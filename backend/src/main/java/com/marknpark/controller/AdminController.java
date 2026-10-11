package com.marknpark.controller;

import com.marknpark.dto.ApiResponse;
import com.marknpark.dto.ParkingZoneResponse;
import com.marknpark.dto.ReservationResponse;
import com.marknpark.dto.UserDto;
import com.marknpark.model.Payment;
import com.marknpark.model.Role;
import com.marknpark.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsers() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers()));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<Void>> updateUserRole(
            @PathVariable String id,
            @RequestParam Role role) {
        adminService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", null));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User removed successfully", null));
    }

    @GetMapping("/parking-zones")
    public ResponseEntity<ApiResponse<List<ParkingZoneResponse>>> getParkingZones() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllZones()));
    }

    @PatchMapping("/parking-zones/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Void>> toggleZoneStatus(@PathVariable String id) {
        adminService.toggleZoneStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Zone status updated successfully", null));
    }

    @GetMapping("/reservations")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getReservations() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllReservations()));
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<Payment>>> getPayments() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllPayments()));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReports() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getPlatformReports()));
    }

    @GetMapping("/configuration")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getConfiguration() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getSystemConfiguration()));
    }
}
