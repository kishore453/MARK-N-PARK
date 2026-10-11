package com.marknpark.controller;

import com.marknpark.dto.ApiResponse;
import com.marknpark.dto.CreatePaymentOrderRequest;
import com.marknpark.dto.PaymentOrderResponse;
import com.marknpark.dto.ReservationResponse;
import com.marknpark.dto.VerifyPaymentRequest;
import com.marknpark.security.CustomUserDetails;
import com.marknpark.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createOrder(
            @Valid @RequestBody CreatePaymentOrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        PaymentOrderResponse response = paymentService.createPaymentOrder(request.getReservationId(), userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Razorpay order created successfully", response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<ReservationResponse>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReservationResponse response = paymentService.verifyPayment(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully. Reservation confirmed!", response));
    }
}
