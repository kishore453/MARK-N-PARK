package com.marknpark.dto;

import com.marknpark.model.BookingType;
import com.marknpark.model.PaymentStatus;
import com.marknpark.model.Reservation;
import com.marknpark.model.ReservationStatus;

import java.time.Instant;

public class ReservationResponse {
    private String id;
    private String seekerId;
    private String seekerName;
    private String seekerEmail;
    private String seekerPhone;
    private String hostId;
    private String hostName;
    private String hostPhone;
    private String parkingZoneId;
    private String parkingZoneName;
    private String parkingZoneAddress;
    private String parkingZoneCity;
    private String vehicleId;
    private String vehicleNumber;
    private String vehicleName;
    private String vehicleType;
    private BookingType bookingType;
    private String date;
    private String startTime;
    private String endTime;
    private Double duration;
    private Double totalAmount;
    private Double advanceAmount;
    private Double remainingAmount;
    private ReservationStatus reservationStatus;
    private PaymentStatus paymentStatus;
    private Instant createdAt;

    public ReservationResponse() {
    }

    public static ReservationResponse fromEntity(Reservation res) {
        if (res == null) return null;
        ReservationResponse r = new ReservationResponse();
        r.setId(res.getId());
        r.setSeekerId(res.getSeekerId());
        r.setHostId(res.getHostId());
        r.setParkingZoneId(res.getParkingZoneId());
        r.setVehicleId(res.getVehicleId());
        r.setBookingType(res.getBookingType());
        r.setDate(res.getDate());
        r.setStartTime(res.getStartTime());
        r.setEndTime(res.getEndTime());
        r.setDuration(res.getDuration());
        r.setTotalAmount(res.getTotalAmount());
        r.setAdvanceAmount(res.getAdvanceAmount());
        r.setRemainingAmount(res.getRemainingAmount());
        r.setReservationStatus(res.getReservationStatus());
        r.setPaymentStatus(res.getPaymentStatus());
        r.setCreatedAt(res.getCreatedAt());
        return r;
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

    public String getSeekerName() {
        return seekerName;
    }

    public void setSeekerName(String seekerName) {
        this.seekerName = seekerName;
    }

    public String getSeekerEmail() {
        return seekerEmail;
    }

    public void setSeekerEmail(String seekerEmail) {
        this.seekerEmail = seekerEmail;
    }

    public String getSeekerPhone() {
        return seekerPhone;
    }

    public void setSeekerPhone(String seekerPhone) {
        this.seekerPhone = seekerPhone;
    }

    public String getHostId() {
        return hostId;
    }

    public void setHostId(String hostId) {
        this.hostId = hostId;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getHostPhone() {
        return hostPhone;
    }

    public void setHostPhone(String hostPhone) {
        this.hostPhone = hostPhone;
    }

    public String getParkingZoneId() {
        return parkingZoneId;
    }

    public void setParkingZoneId(String parkingZoneId) {
        this.parkingZoneId = parkingZoneId;
    }

    public String getParkingZoneName() {
        return parkingZoneName;
    }

    public void setParkingZoneName(String parkingZoneName) {
        this.parkingZoneName = parkingZoneName;
    }

    public String getParkingZoneAddress() {
        return parkingZoneAddress;
    }

    public void setParkingZoneAddress(String parkingZoneAddress) {
        this.parkingZoneAddress = parkingZoneAddress;
    }

    public String getParkingZoneCity() {
        return parkingZoneCity;
    }

    public void setParkingZoneCity(String parkingZoneCity) {
        this.parkingZoneCity = parkingZoneCity;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getVehicleName() {
        return vehicleName;
    }

    public void setVehicleName(String vehicleName) {
        this.vehicleName = vehicleName;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
