package com.marknpark.controller;

import com.marknpark.dto.ApiResponse;
import com.marknpark.dto.CreateParkingZoneRequest;
import com.marknpark.dto.ParkingZoneResponse;
import com.marknpark.security.CustomUserDetails;
import com.marknpark.service.ParkingZoneService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/parking-zones")
public class ParkingZoneController {

    private final ParkingZoneService parkingZoneService;

    public ParkingZoneController(ParkingZoneService parkingZoneService) {
        this.parkingZoneService = parkingZoneService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ParkingZoneResponse>>> getAllZones() {
        List<ParkingZoneResponse> zones = parkingZoneService.getAllActiveZones();
        return ResponseEntity.ok(ApiResponse.success(zones));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ParkingZoneResponse>> getZoneById(@PathVariable String id) {
        ParkingZoneResponse zone = parkingZoneService.getZoneById(id);
        return ResponseEntity.ok(ApiResponse.success(zone));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ParkingZoneResponse>>> searchZones(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) List<String> features) {
        List<ParkingZoneResponse> zones = parkingZoneService.searchZones(location, date, startTime, endTime, maxPrice, features);
        return ResponseEntity.ok(ApiResponse.success(zones));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<ParkingZoneResponse>> createZone(
            @Valid @RequestBody CreateParkingZoneRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ParkingZoneResponse zone = parkingZoneService.createParkingZone(request, userDetails.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Parking zone created successfully", zone));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<ParkingZoneResponse>> updateZone(
            @PathVariable String id,
            @Valid @RequestBody CreateParkingZoneRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ParkingZoneResponse zone = parkingZoneService.updateParkingZone(id, request, userDetails.getId(), userDetails.getRole());
        return ResponseEntity.ok(ApiResponse.success("Parking zone updated successfully", zone));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteZone(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        parkingZoneService.deleteParkingZone(id, userDetails.getId(), userDetails.getRole());
        return ResponseEntity.ok(ApiResponse.success("Parking zone deleted successfully", null));
    }

    @PostMapping("/{id}/photos")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<ParkingZoneResponse>> uploadPhoto(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ParkingZoneResponse zone = parkingZoneService.uploadZonePhoto(id, file, userDetails.getId(), userDetails.getRole());
        return ResponseEntity.ok(ApiResponse.success("Photo uploaded successfully", zone));
    }

    @DeleteMapping("/{id}/photos")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<ParkingZoneResponse>> deletePhoto(
            @PathVariable String id,
            @RequestParam("photoUrl") String photoUrl,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ParkingZoneResponse zone = parkingZoneService.deleteZonePhoto(id, photoUrl, userDetails.getId(), userDetails.getRole());
        return ResponseEntity.ok(ApiResponse.success("Photo deleted successfully", zone));
    }
}
