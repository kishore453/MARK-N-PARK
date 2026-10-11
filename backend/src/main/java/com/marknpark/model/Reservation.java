package com.marknpark.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "reservations")
@CompoundIndex(name = "zone_date_status_idx", def = "{'parkingZoneId': 1, 'date': 1, 'reservationStatus': 1}")
public class Reservation {

    @Id
    private String id;

    @Indexed
    private String seekerId;

    @Indexed
    private String hostId;

    @Indexed
    private String parkingZoneId;

    private String vehicleId;

    private BookingType bookingType;

    private String date; // YYYY-MM-DD

    private String startTime; // HH:mm

    private String endTime; // HH:mm

    private Double duration; // hours or days

    private Double totalAmount;

    private Double advanceAmount;

    private Double remainingAmount;

    private ReservationStatus reservationStatus = ReservationStatus.PENDING;

    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private Instant expiresAt; // For holding temporary pending slots

    private Instant createdAt = Instant.now();

    private Instant updatedAt = Instant.now();

    public Reservation() {
    }

    public Reservation(String id, String seekerId, String hostId, String parkingZoneId, String vehicleId,
                       BookingType bookingType, String date, String startTime, String endTime,
                       Double duration, Double totalAmount, Double advanceAmount, Double remainingAmount,
                       ReservationStatus reservationStatus, PaymentStatus paymentStatus) {
        this.id = id;
        this.seekerId = seekerId;
        this.hostId = hostId;
        this.parkingZoneId = parkingZoneId;
        this.vehicleId = vehicleId;
        this.bookingType = bookingType;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.totalAmount = totalAmount;
        this.advanceAmount = advanceAmount;
        this.remainingAmount = remainingAmount;
        this.reservationStatus = reservationStatus != null ? reservationStatus : ReservationStatus.PENDING;
        this.paymentStatus = paymentStatus != null ? paymentStatus : PaymentStatus.PENDING;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSeekerId() {
        return seekerId;
    }

    public void setSeekerId(String seekerId) {
        this.seekerId = seekerId;
    }

    public String getHostId() {
        return hostId;
    }

    public void setHostId(String hostId) {
        this.hostId = hostId;
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

    public Double getDuration() {
        return duration;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Double getAdvanceAmount() {
        return advanceAmount;
    }

    public void setAdvanceAmount(Double advanceAmount) {
        this.advanceAmount = advanceAmount;
    }

    public Double getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(Double remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public ReservationStatus getReservationStatus() {
        return reservationStatus;
    }

    public void setReservationStatus(ReservationStatus reservationStatus) {
        this.reservationStatus = reservationStatus;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
