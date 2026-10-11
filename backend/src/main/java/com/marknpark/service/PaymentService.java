package com.marknpark.service;

import com.marknpark.dto.PaymentOrderResponse;
import com.marknpark.dto.ReservationResponse;
import com.marknpark.dto.VerifyPaymentRequest;
import com.marknpark.exception.BadRequestException;
import com.marknpark.exception.ForbiddenException;
import com.marknpark.exception.ResourceNotFoundException;
import com.marknpark.model.Payment;
import com.marknpark.model.PaymentStatus;
import com.marknpark.model.Reservation;
import com.marknpark.model.ReservationStatus;
import com.marknpark.repository.PaymentRepository;
import com.marknpark.repository.ReservationRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final ReservationService reservationService;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public PaymentService(ReservationRepository reservationRepository,
                          PaymentRepository paymentRepository,
                          ReservationService reservationService) {
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.reservationService = reservationService;
    }

    public PaymentOrderResponse createPaymentOrder(String reservationId, String userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        if (!reservation.getSeekerId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to pay for this reservation");
        }

        if (reservation.getReservationStatus() == ReservationStatus.CONFIRMED) {
            throw new BadRequestException("This reservation is already confirmed and paid.");
        }

        if (reservation.getReservationStatus() == ReservationStatus.CANCELLED) {
            throw new BadRequestException("Cannot pay for a cancelled reservation.");
        }

        // Amount in paise (1 INR = 100 paise)
        long amountPaise = Math.round(reservation.getAdvanceAmount() * 100);

        // Check if Razorpay credentials configured
        if (keyId == null || keyId.isBlank() || keyId.contains("placeholder") ||
                keySecret == null || keySecret.isBlank() || keySecret.contains("placeholder")) {
            log.warn("Razorpay credentials are in test placeholder mode.");
            // Generate deterministic order id for test mode sandbox
            String testOrderId = "order_test_" + reservation.getId().substring(0, Math.min(10, reservation.getId().length()));
            return new PaymentOrderResponse(
                    testOrderId,
                    amountPaise,
                    "INR",
                    keyId != null ? keyId : "rzp_test_placeholder",
                    reservation.getId(),
                    reservation.getAdvanceAmount(),
                    "Payment service in test mode: 25% Advance Amount Rs. " + reservation.getAdvanceAmount()
            );
        }

        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", reservation.getId());

            Order order = client.orders.create(orderRequest);
            String orderId = order.get("id");

            return new PaymentOrderResponse(
                    orderId,
                    amountPaise,
                    "INR",
                    keyId,
                    reservation.getId(),
                    reservation.getAdvanceAmount(),
                    "MARK N PARK 25% Advance Payment"
            );
        } catch (Exception e) {
            log.error("Failed to create Razorpay order", e);
            throw new BadRequestException("Failed to initialize payment order: " + e.getMessage());
        }
    }

    public ReservationResponse verifyPayment(VerifyPaymentRequest request, String userId) {
        Reservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + request.getReservationId()));

        if (!reservation.getSeekerId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to verify this payment");
        }

        // Validate HMAC-SHA256 signature
        boolean isValidSignature = verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValidSignature) {
            reservation.setPaymentStatus(PaymentStatus.FAILED);
            reservationRepository.save(reservation);
            throw new BadRequestException("Invalid payment signature. Payment verification failed.");
        }

        // Signature verified successfully! Update Reservation status
        reservation.setReservationStatus(ReservationStatus.CONFIRMED);
        reservation.setPaymentStatus(PaymentStatus.ADVANCE_CAPTURED);
        reservation.setUpdatedAt(Instant.now());
        Reservation updated = reservationRepository.save(reservation);

        // Record Payment
        Payment payment = new Payment();
        payment.setReservationId(reservation.getId());
        payment.setRazorpayOrderId(request.getRazorpayOrderId());
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setAmount(reservation.getAdvanceAmount());
        payment.setStatus("SUCCESS");
        paymentRepository.save(payment);

        return reservationService.populateReservationResponse(updated);
    }

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        // If in test placeholder mode, allow test signature "test_signature_valid" or verify HMAC
        if (keySecret == null || keySecret.isBlank() || keySecret.contains("placeholder") || keySecret.contains("dummy")) {
            return "test_signature_valid".equals(signature) || signature.startsWith("sig_test_");
        }

        try {
            String data = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            // Convert to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            String generatedSignature = hexString.toString();

            return MessageDigest.isEqual(
                    generatedSignature.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            log.error("Signature verification error", e);
            return false;
        }
    }
}
