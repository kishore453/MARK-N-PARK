package com.marknpark.service;

import com.marknpark.dto.CreateReservationRequest;
import com.marknpark.dto.ReservationResponse;
import com.marknpark.exception.BadRequestException;
import com.marknpark.exception.ConflictException;
import com.marknpark.exception.ForbiddenException;
import com.marknpark.exception.ResourceNotFoundException;
import com.marknpark.model.BookingType;
import com.marknpark.model.ParkingZone;
import com.marknpark.model.PaymentStatus;
import com.marknpark.model.Reservation;
import com.marknpark.model.ReservationStatus;
import com.marknpark.model.Role;
import com.marknpark.model.User;
import com.marknpark.model.Vehicle;
import com.marknpark.repository.ParkingZoneRepository;
import com.marknpark.repository.ReservationRepository;
import com.marknpark.repository.UserRepository;
import com.marknpark.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ParkingZoneRepository parkingZoneRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    // Per-zone lock monitor to guarantee zero overbooking during concurrent bookings
    private final ConcurrentHashMap<String, Object> zoneLocks = new ConcurrentHashMap<>();

    public ReservationService(ReservationRepository reservationRepository,
                              ParkingZoneRepository parkingZoneRepository,
                              VehicleRepository vehicleRepository,
                              UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.parkingZoneRepository = parkingZoneRepository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    public ReservationResponse createReservation(CreateReservationRequest request, String seekerId) {
        // 1. Verify parking zone exists and is active
        ParkingZone zone = parkingZoneRepository.findById(request.getParkingZoneId())
                .orElseThrow(() -> new ResourceNotFoundException("Parking zone not found with id: " + request.getParkingZoneId()));

        if (!Boolean.TRUE.equals(zone.getActive())) {
            throw new BadRequestException("This parking zone is currently inactive and cannot accept reservations.");
        }

        // 2. Verify date & times are valid
        LocalDate bookingDate;
        LocalTime start;
        LocalTime end;
        try {
            bookingDate = LocalDate.parse(request.getDate());
            start = LocalTime.parse(request.getStartTime());
            end = LocalTime.parse(request.getEndTime());
        } catch (DateTimeParseException e) {
            throw new BadRequestException("Invalid date or time format. Expected YYYY-MM-DD and HH:mm.");
        }

        ZoneId appZone = ZoneId.of("Asia/Kolkata");
        if (bookingDate.isBefore(LocalDate.now(appZone))) {
            throw new BadRequestException("Reservations cannot be booked for past dates.");
        }

        if (bookingDate.isEqual(LocalDate.now(appZone)) && start.isBefore(LocalTime.now(appZone).minusMinutes(5))) {
            throw new BadRequestException("Start time cannot be in the past.");
        }

        if (!end.isAfter(start)) {
            throw new BadRequestException("End time must be strictly after start time.");
        }

        // 3. Verify vehicle exists and belongs to seeker
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(request.getVehicleId(), seekerId)
                .orElseThrow(() -> new BadRequestException("Vehicle does not exist or does not belong to your account."));

        // 4. Calculate Duration and Amounts from database prices
        double durationHours;
        double totalAmount;

        if (request.getBookingType() == BookingType.HOURLY) {
            long minutes = Duration.between(start, end).toMinutes();
            durationHours = Math.ceil(minutes / 60.0);
            if (durationHours < 1.0) durationHours = 1.0;
            totalAmount = durationHours * zone.getHourlyPrice();
        } else {
            // DAILY
            durationHours = 24.0;
            totalAmount = zone.getDailyPrice();
        }

        double advanceAmount = Math.round(totalAmount * 0.25 * 100.0) / 100.0;
        double remainingAmount = Math.round((totalAmount - advanceAmount) * 100.0) / 100.0;

        // 5. Concurrency-safe availability validation using per-zone lock
        Object zoneLock = zoneLocks.computeIfAbsent(zone.getId(), k -> new Object());
        Reservation savedReservation;

        synchronized (zoneLock) {
            List<Reservation> activeReservations = reservationRepository.findByParkingZoneIdAndDateAndReservationStatusIn(
                    zone.getId(), request.getDate(), Arrays.asList(ReservationStatus.CONFIRMED, ReservationStatus.PENDING)
            );

            long overlappingCount = activeReservations.stream().filter(res -> {
                // Discard expired pending holds
                if (res.getReservationStatus() == ReservationStatus.PENDING &&
                        res.getExpiresAt() != null && res.getExpiresAt().isBefore(Instant.now())) {
                    return false;
                }

                // Check overlap: (requestedStart < existingEnd) && (requestedEnd > existingStart)
                return request.getStartTime().compareTo(res.getEndTime()) < 0 &&
                        request.getEndTime().compareTo(res.getStartTime()) > 0;
            }).count();

            if (overlappingCount >= zone.getTotalCapacity()) {
                throw new ConflictException("Parking zone is fully occupied for the requested time slot. Please choose another slot.");
            }

            // Create Reservation in PENDING status with 15-minute hold
            Reservation reservation = new Reservation();
            reservation.setSeekerId(seekerId);
            reservation.setHostId(zone.getHostId());
            reservation.setParkingZoneId(zone.getId());
            reservation.setVehicleId(vehicle.getId());
            reservation.setBookingType(request.getBookingType());
            reservation.setDate(request.getDate());
            reservation.setStartTime(request.getStartTime());
            reservation.setEndTime(request.getEndTime());
            reservation.setDuration(durationHours);
            reservation.setTotalAmount(totalAmount);
            reservation.setAdvanceAmount(advanceAmount);
            reservation.setRemainingAmount(remainingAmount);
            reservation.setReservationStatus(ReservationStatus.PENDING);
            reservation.setPaymentStatus(PaymentStatus.PENDING);
            reservation.setExpiresAt(Instant.now().plusSeconds(900)); // 15 min lock

            savedReservation = reservationRepository.save(reservation);
        }

        return populateReservationResponse(savedReservation);
    }

    public List<ReservationResponse> getMyReservations(String seekerId) {
        return reservationRepository.findBySeekerIdOrderByCreatedAtDesc(seekerId).stream()
                .map(this::populateReservationResponse)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getHostReservations(String hostId) {
        return reservationRepository.findByHostIdOrderByCreatedAtDesc(hostId).stream()
                .map(this::populateReservationResponse)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::populateReservationResponse)
                .collect(Collectors.toList());
    }

    public ReservationResponse getReservationById(String reservationId, String userId, Role role) {
        Reservation res = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        if (role != Role.ADMIN && !res.getSeekerId().equals(userId) && !res.getHostId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to view this reservation");
        }

        return populateReservationResponse(res);
    }

    public ReservationResponse cancelReservation(String reservationId, String userId, Role role) {
        Reservation res = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        if (role != Role.ADMIN && !res.getSeekerId().equals(userId)) {
            throw new ForbiddenException("Only the booking owner or an administrator can cancel this reservation");
        }

        if (res.getReservationStatus() == ReservationStatus.CANCELLED) {
            throw new BadRequestException("Reservation is already cancelled.");
        }

        if (res.getReservationStatus() == ReservationStatus.COMPLETED) {
            throw new BadRequestException("Completed reservations cannot be cancelled.");
        }

        res.setReservationStatus(ReservationStatus.CANCELLED);
        res.setUpdatedAt(Instant.now());
        Reservation updated = reservationRepository.save(res);

        return populateReservationResponse(updated);
    }

    public ReservationResponse populateReservationResponse(Reservation res) {
        ReservationResponse r = ReservationResponse.fromEntity(res);

        // Populate Zone info
        parkingZoneRepository.findById(res.getParkingZoneId()).ifPresent(zone -> {
            r.setParkingZoneName(zone.getName());
            r.setParkingZoneAddress(zone.getAddress());
            r.setParkingZoneCity(zone.getCity());
        });

        // Populate Vehicle info
        vehicleRepository.findById(res.getVehicleId()).ifPresent(veh -> {
            r.setVehicleName(veh.getVehicleName());
            r.setVehicleNumber(veh.getVehicleNumber());
            r.setVehicleType(veh.getVehicleType());
        });

        // Populate Seeker info
        userRepository.findById(res.getSeekerId()).ifPresent(seeker -> {
            r.setSeekerName(seeker.getName());
            r.setSeekerEmail(seeker.getEmail());
            r.setSeekerPhone(seeker.getPhone());
        });

        // Populate Host info
        userRepository.findById(res.getHostId()).ifPresent(host -> {
            r.setHostName(host.getName());
            r.setHostPhone(host.getPhone());
        });

        return r;
    }
}
