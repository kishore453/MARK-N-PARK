package com.marknpark.controller;

import com.marknpark.dto.ApiResponse;
import com.marknpark.dto.CreateReservationRequest;
import com.marknpark.dto.ReservationResponse;
import com.marknpark.security.CustomUserDetails;
import com.marknpark.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/api/reservations")
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(
            @Valid @RequestBody CreateReservationRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReservationResponse response = reservationService.createReservation(request, userDetails.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Reservation created. Please complete 25% advance payment to confirm.", response));
    }

    @GetMapping("/api/reservations/my")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getMyReservations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ReservationResponse> list = reservationService.getMyReservations(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/api/reservations/{id}")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservationById(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReservationResponse response = reservationService.getReservationById(id, userDetails.getId(), userDetails.getRole());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/api/reservations/{id}/cancel")
    public ResponseEntity<ApiResponse<ReservationResponse>> cancelReservation(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReservationResponse response = reservationService.cancelReservation(id, userDetails.getId(), userDetails.getRole());
        return ResponseEntity.ok(ApiResponse.success("Reservation cancelled successfully", response));
    }

    @GetMapping("/api/host/reservations")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getHostReservations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ReservationResponse> list = reservationService.getHostReservations(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
