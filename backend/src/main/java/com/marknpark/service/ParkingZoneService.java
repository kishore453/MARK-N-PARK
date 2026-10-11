package com.marknpark.service;

import com.marknpark.dto.CreateParkingZoneRequest;
import com.marknpark.dto.ParkingZoneResponse;
import com.marknpark.exception.BadRequestException;
import com.marknpark.exception.ForbiddenException;
import com.marknpark.exception.ResourceNotFoundException;
import com.marknpark.model.ParkingZone;
import com.marknpark.model.Reservation;
import com.marknpark.model.ReservationStatus;
import com.marknpark.model.Role;
import com.marknpark.model.User;
import com.marknpark.repository.ParkingZoneRepository;
import com.marknpark.repository.ReservationRepository;
import com.marknpark.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ParkingZoneService {

    private static final Set<String> ALLOWED_FEATURES = new HashSet<>(Arrays.asList(
            "Covered", "CCTV", "Security", "EV Charging", "Lighting", "Accessible Parking", "24/7 Access"
    ));

    private final ParkingZoneRepository parkingZoneRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public ParkingZoneService(ParkingZoneRepository parkingZoneRepository,
                              ReservationRepository reservationRepository,
                              UserRepository userRepository,
                              CloudinaryService cloudinaryService) {
        this.parkingZoneRepository = parkingZoneRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public ParkingZoneResponse createParkingZone(CreateParkingZoneRequest request, String hostId) {
        validateFeatures(request.getFeatures());

        if (request.getPhotos() != null && request.getPhotos().size() > 2) {
            throw new BadRequestException("Maximum 2 photos allowed per parking zone");
        }

        ParkingZone zone = new ParkingZone();
        zone.setHostId(hostId);
        zone.setName(request.getName().trim());
        zone.setDescription(request.getDescription().trim());
        zone.setAddress(request.getAddress().trim());
        zone.setCity(request.getCity().trim());
        zone.setLatitude(request.getLatitude());
        zone.setLongitude(request.getLongitude());
        zone.setHourlyPrice(request.getHourlyPrice());
        zone.setDailyPrice(request.getDailyPrice());
        zone.setTotalCapacity(request.getTotalCapacity());
        zone.setFeatures(request.getFeatures() != null ? request.getFeatures() : new ArrayList<>());
        zone.setPhotos(request.getPhotos() != null ? request.getPhotos() : new ArrayList<>());
        zone.setActive(true);

        ParkingZone saved = parkingZoneRepository.save(zone);
        User host = userRepository.findById(hostId).orElse(null);
        return ParkingZoneResponse.fromEntity(saved, saved.getTotalCapacity(), host != null ? host.getName() : null, host != null ? host.getPhone() : null);
    }

    public ParkingZoneResponse updateParkingZone(String id, CreateParkingZoneRequest request, String userId, Role role) {
        ParkingZone zone = parkingZoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking zone not found with id: " + id));

        // Enforce ownership: Host can only update their own zone
        if (role != Role.ADMIN && !zone.getHostId().equals(userId)) {
            throw new ForbiddenException("A host cannot modify another host's parking zone");
        }

        validateFeatures(request.getFeatures());

        if (request.getPhotos() != null && request.getPhotos().size() > 2) {
            throw new BadRequestException("Maximum 2 photos allowed per parking zone");
        }

        zone.setName(request.getName().trim());
        zone.setDescription(request.getDescription().trim());
        zone.setAddress(request.getAddress().trim());
        zone.setCity(request.getCity().trim());
        zone.setLatitude(request.getLatitude());
        zone.setLongitude(request.getLongitude());
        zone.setHourlyPrice(request.getHourlyPrice());
        zone.setDailyPrice(request.getDailyPrice());
        zone.setTotalCapacity(request.getTotalCapacity());
        zone.setFeatures(request.getFeatures() != null ? request.getFeatures() : new ArrayList<>());
        if (request.getPhotos() != null) {
            zone.setPhotos(request.getPhotos());
        }
        zone.setUpdatedAt(Instant.now());

        ParkingZone saved = parkingZoneRepository.save(zone);
        User host = userRepository.findById(zone.getHostId()).orElse(null);
        int available = getAvailableCapacityNow(saved.getId(), saved.getTotalCapacity());
        return ParkingZoneResponse.fromEntity(saved, available, host != null ? host.getName() : null, host != null ? host.getPhone() : null);
    }

    public void deleteParkingZone(String id, String userId, Role role) {
        ParkingZone zone = parkingZoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking zone not found with id: " + id));

        // Enforce ownership: Host can only delete their own zone
        if (role != Role.ADMIN && !zone.getHostId().equals(userId)) {
            throw new ForbiddenException("A host cannot delete another host's parking zone");
        }

        parkingZoneRepository.delete(zone);
    }

    public ParkingZoneResponse getZoneById(String id) {
        ParkingZone zone = parkingZoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking zone not found with id: " + id));

        int available = getAvailableCapacityNow(zone.getId(), zone.getTotalCapacity());
        User host = userRepository.findById(zone.getHostId()).orElse(null);
        return ParkingZoneResponse.fromEntity(zone, available, host != null ? host.getName() : null, host != null ? host.getPhone() : null);
    }

    public List<ParkingZoneResponse> getAllActiveZones() {
        return parkingZoneRepository.findByActiveTrue().stream().map(zone -> {
            int available = getAvailableCapacityNow(zone.getId(), zone.getTotalCapacity());
            User host = userRepository.findById(zone.getHostId()).orElse(null);
            return ParkingZoneResponse.fromEntity(zone, available, host != null ? host.getName() : null, host != null ? host.getPhone() : null);
        }).collect(Collectors.toList());
    }

    public List<ParkingZoneResponse> getZonesByHostId(String hostId) {
        return parkingZoneRepository.findByHostId(hostId).stream().map(zone -> {
            int available = getAvailableCapacityNow(zone.getId(), zone.getTotalCapacity());
            User host = userRepository.findById(hostId).orElse(null);
            return ParkingZoneResponse.fromEntity(zone, available, host != null ? host.getName() : null, host != null ? host.getPhone() : null);
        }).collect(Collectors.toList());
    }

    public List<ParkingZoneResponse> searchZones(String query, String date, String startTime, String endTime, Double maxPrice, List<String> features) {
        List<ParkingZone> zones;
        if (query != null && !query.trim().isEmpty()) {
            zones = parkingZoneRepository.searchByLocation(query.trim());
        } else {
            zones = parkingZoneRepository.findByActiveTrue();
        }

        return zones.stream().filter(zone -> {
            // Price filter
            if (maxPrice != null && zone.getHourlyPrice() > maxPrice) {
                return false;
            }
            // Features filter
            if (features != null && !features.isEmpty()) {
                if (zone.getFeatures() == null || !zone.getFeatures().containsAll(features)) {
                    return false;
                }
            }
            return true;
        }).map(zone -> {
            int available = calculateAvailableCapacity(zone.getId(), zone.getTotalCapacity(), date, startTime, endTime);
            User host = userRepository.findById(zone.getHostId()).orElse(null);
            return ParkingZoneResponse.fromEntity(zone, available, host != null ? host.getName() : null, host != null ? host.getPhone() : null);
        }).collect(Collectors.toList());
    }

    public ParkingZoneResponse uploadZonePhoto(String zoneId, MultipartFile file, String userId, Role role) {
        ParkingZone zone = parkingZoneRepository.findById(zoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking zone not found with id: " + zoneId));

        if (role != Role.ADMIN && !zone.getHostId().equals(userId)) {
            throw new ForbiddenException("A host cannot modify another host's parking zone");
        }

        if (zone.getPhotos() != null && zone.getPhotos().size() >= 2) {
            throw new BadRequestException("Maximum 2 photos allowed per parking zone. Please remove an existing photo first.");
        }

        String photoUrl = cloudinaryService.uploadImage(file);
        if (zone.getPhotos() == null) {
            zone.setPhotos(new ArrayList<>());
        }
        zone.getPhotos().add(photoUrl);
        zone.setUpdatedAt(Instant.now());

        ParkingZone saved = parkingZoneRepository.save(zone);
        User host = userRepository.findById(zone.getHostId()).orElse(null);
        int available = getAvailableCapacityNow(saved.getId(), saved.getTotalCapacity());
        return ParkingZoneResponse.fromEntity(saved, available, host != null ? host.getName() : null, host != null ? host.getPhone() : null);
    }

    public ParkingZoneResponse deleteZonePhoto(String zoneId, String photoUrl, String userId, Role role) {
        ParkingZone zone = parkingZoneRepository.findById(zoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking zone not found with id: " + zoneId));

        if (role != Role.ADMIN && !zone.getHostId().equals(userId)) {
            throw new ForbiddenException("A host cannot modify another host's parking zone");
        }

        if (zone.getPhotos() != null) {
            zone.getPhotos().remove(photoUrl);
            zone.setUpdatedAt(Instant.now());
            ParkingZone saved = parkingZoneRepository.save(zone);
            User host = userRepository.findById(zone.getHostId()).orElse(null);
            int available = getAvailableCapacityNow(saved.getId(), saved.getTotalCapacity());
            return ParkingZoneResponse.fromEntity(saved, available, host != null ? host.getName() : null, host != null ? host.getPhone() : null);
        }

        return getZoneById(zoneId);
    }

    public int getAvailableCapacityNow(String zoneId, int totalCapacity) {
        String today = LocalDate.now().toString();
        String nowTime = LocalTime.now().toString().substring(0, 5);
        return calculateAvailableCapacity(zoneId, totalCapacity, today, nowTime, nowTime);
    }

    public int calculateAvailableCapacity(String zoneId, int totalCapacity, String date, String startTime, String endTime) {
        if (date == null || startTime == null || endTime == null) {
            return totalCapacity;
        }

        List<Reservation> activeReservations = reservationRepository.findByParkingZoneIdAndDateAndReservationStatusIn(
                zoneId, date, Arrays.asList(ReservationStatus.CONFIRMED, ReservationStatus.PENDING)
        );

        long overlappingCount = activeReservations.stream().filter(res -> {
            // Ignore expired pending reservations
            if (res.getReservationStatus() == ReservationStatus.PENDING &&
                    res.getExpiresAt() != null && res.getExpiresAt().isBefore(Instant.now())) {
                return false;
            }

            // Overlap check: (requestedStart < existingEnd) && (requestedEnd > existingStart)
            return doesTimeOverlap(startTime, endTime, res.getStartTime(), res.getEndTime());
        }).count();

        return Math.max(0, totalCapacity - (int) overlappingCount);
    }

    private boolean doesTimeOverlap(String start1, String end1, String start2, String end2) {
        if (start1 == null || end1 == null || start2 == null || end2 == null) {
            return false;
        }
        // String comparison works for "HH:mm" in 24-hr format
        return start1.compareTo(end2) < 0 && end1.compareTo(start2) > 0;
    }

    private void validateFeatures(List<String> features) {
        if (features != null) {
            for (String f : features) {
                if (!ALLOWED_FEATURES.contains(f)) {
                    throw new BadRequestException("Invalid feature: " + f + ". Allowed: " + ALLOWED_FEATURES);
                }
            }
        }
    }
}
