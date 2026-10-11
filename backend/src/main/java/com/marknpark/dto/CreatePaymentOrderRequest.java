package com.marknpark.dto;

import jakarta.validation.constraints.NotBlank;

public class CreatePaymentOrderRequest {

    @NotBlank(message = "Reservation ID is required")
    private String reservationId;

    public CreatePaymentOrderRequest() {
    }

    public CreatePaymentOrderRequest(String reservationId) {
        this.reservationId = reservationId;
    }

    public String getReservationId() {
        return reservationId;
    }

    public void setReservationId(String reservationId) {
        this.reservationId = reservationId;
    }
}
