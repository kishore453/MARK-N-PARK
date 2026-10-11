package com.marknpark.controller;

import com.marknpark.dto.ApiResponse;
import com.marknpark.dto.CreateVehicleRequest;
import com.marknpark.model.Vehicle;
import com.marknpark.security.CustomUserDetails;
import com.marknpark.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Vehicle>>> getMyVehicles(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(vehicles));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Vehicle>> createVehicle(
            @Valid @RequestBody CreateVehicleRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Vehicle vehicle = vehicleService.createVehicle(request, userDetails.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Vehicle registered successfully", vehicle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Vehicle>> updateVehicle(
            @PathVariable String id,
            @Valid @RequestBody CreateVehicleRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Vehicle vehicle = vehicleService.updateVehicle(id, request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated successfully", vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        vehicleService.deleteVehicle(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Vehicle removed successfully", null));
    }
}
