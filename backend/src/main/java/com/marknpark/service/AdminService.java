package com.marknpark.service;

import com.marknpark.dto.ParkingZoneResponse;
import com.marknpark.dto.ReservationResponse;
import com.marknpark.dto.UserDto;
import com.marknpark.exception.BadRequestException;
import com.marknpark.exception.ResourceNotFoundException;
import com.marknpark.model.Payment;
import com.marknpark.model.Reservation;
import com.marknpark.model.ReservationStatus;
import com.marknpark.model.Role;
import com.marknpark.model.User;
import com.marknpark.repository.PaymentRepository;
import com.marknpark.repository.ParkingZoneRepository;
import com.marknpark.repository.ReservationRepository;
import com.marknpark.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ParkingZoneRepository parkingZoneRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final ReservationService reservationService;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    public AdminService(UserRepository userRepository,
                        ParkingZoneRepository parkingZoneRepository,
                        ReservationRepository reservationRepository,
                        PaymentRepository paymentRepository,
                        ReservationService reservationService) {
        this.userRepository = userRepository;
        this.parkingZoneRepository = parkingZoneRepository;
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.reservationService = reservationService;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    public void updateUserRole(String userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setRole(newRole);
        userRepository.save(user);
    }

    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        userRepository.delete(user);
    }

    public List<ParkingZoneResponse> getAllZones() {
        return parkingZoneRepository.findAll().stream().map(zone -> {
            User host = userRepository.findById(zone.getHostId()).orElse(null);
            return ParkingZoneResponse.fromEntity(zone, zone.getTotalCapacity(), host != null ? host.getName() : null, host != null ? host.getPhone() : null);
        }).collect(Collectors.toList());
    }

    public void toggleZoneStatus(String zoneId) {
        var zone = parkingZoneRepository.findById(zoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking zone not found: " + zoneId));
        zone.setActive(!Boolean.TRUE.equals(zone.getActive()));
        parkingZoneRepository.save(zone);
    }

    public List<ReservationResponse> getAllReservations() {
        return reservationService.getAllReservations();
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByCreatedAtDesc();
    }

    public Map<String, Object> getPlatformReports() {
        long totalUsers = userRepository.count();
        long totalSeekers = userRepository.findByRole(Role.SEEKER).size();
        long totalHosts = userRepository.findByRole(Role.HOST).size();
        long totalZones = parkingZoneRepository.count();
        long activeZones = parkingZoneRepository.findByActiveTrue().size();

        List<Reservation> allReservations = reservationRepository.findAll();
        long totalBookings = allReservations.size();
        long confirmedBookings = allReservations.stream()
                .filter(r -> r.getReservationStatus() == ReservationStatus.CONFIRMED)
                .count();

        double totalRevenue = allReservations.stream()
                .filter(r -> r.getReservationStatus() == ReservationStatus.CONFIRMED)
                .mapToDouble(Reservation::getTotalAmount)
                .sum();

        double advanceCaptured = allReservations.stream()
                .filter(r -> r.getReservationStatus() == ReservationStatus.CONFIRMED)
                .mapToDouble(Reservation::getAdvanceAmount)
                .sum();

        Map<String, Object> reports = new HashMap<>();
        reports.put("totalUsers", totalUsers);
        reports.put("totalSeekers", totalSeekers);
        reports.put("totalHosts", totalHosts);
        reports.put("totalZones", totalZones);
        reports.put("activeZones", activeZones);
        reports.put("totalBookings", totalBookings);
        reports.put("confirmedBookings", confirmedBookings);
        reports.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
        reports.put("advanceCaptured", Math.round(advanceCaptured * 100.0) / 100.0);
        return reports;
    }

    public Map<String, Object> getSystemConfiguration() {
        Map<String, Object> config = new HashMap<>();
        config.put("platformName", "MARK N PARK");
        config.put("tagline", "Find. Reserve. Park.");
        config.put("advancePercentage", 25);
        config.put("remainingPercentage", 75);
        config.put("jwtExpirationMs", jwtExpiration);
        config.put("razorpayKeyIdConfigured", razorpayKeyId != null && !razorpayKeyId.isBlank());
        config.put("database", "MongoDB Atlas");
        return config;
    }
}
