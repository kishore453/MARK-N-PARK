package com.marknpark.dto;

import com.marknpark.model.BookingType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateReservationRequest {

    @NotBlank(message = "Parking zone ID is required")
    private String parkingZoneId;

    @NotBlank(message = "Vehicle ID is required")
    private String vehicleId;

    @NotNull(message = "Booking type is required (HOURLY or DAILY)")
    private BookingType bookingType;

    @NotBlank(message = "Date is required (YYYY-MM-DD)")
    private String date;

    @NotBlank(message = "Start time is required (HH:mm)")
    private String startTime;

    @NotBlank(message = "End time is required (HH:mm)")
    private String endTime;

    public CreateReservationRequest() {
    }

    public CreateReservationRequest(String parkingZoneId, String vehicleId, BookingType bookingType,
                                    String date, String startTime, String endTime) {
        this.parkingZoneId = parkingZoneId;
        this.vehicleId = vehicleId;
        this.bookingType = bookingType;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getParkingZoneId() {
        return parkingZoneId;
    }

    public void setParkingZoneId(String parkingZoneId) {
        this.parkingZoneId = parkingZoneId;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public BookingType getBookingType() {
        return bookingType;
    }

    public void setBookingType(BookingType bookingType) {
        this.bookingType = bookingType;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}
