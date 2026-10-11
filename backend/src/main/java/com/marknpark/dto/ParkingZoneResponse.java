package com.marknpark.dto;

import com.marknpark.model.ParkingZone;

import java.time.Instant;
import java.util.List;

public class ParkingZoneResponse {
    private String id;
    private String hostId;
    private String hostName;
    private String hostPhone;
    private String name;
    private String description;
    private String address;
    private String city;
    private Double latitude;
    private Double longitude;
    private Double hourlyPrice;
    private Double dailyPrice;
    private Integer totalCapacity;
    private Integer availableCapacity; // dynamically computed
    private List<String> features;
    private List<String> photos;
    private Boolean active;
    private Instant createdAt;

    public ParkingZoneResponse() {
    }

    public static ParkingZoneResponse fromEntity(ParkingZone zone, Integer availableCapacity, String hostName, String hostPhone) {
        if (zone == null) return null;
        ParkingZoneResponse resp = new ParkingZoneResponse();
        resp.setId(zone.getId());
        resp.setHostId(zone.getHostId());
        resp.setHostName(hostName);
        resp.setHostPhone(hostPhone);
        resp.setName(zone.getName());
        resp.setDescription(zone.getDescription());
        resp.setAddress(zone.getAddress());
        resp.setCity(zone.getCity());
        resp.setLatitude(zone.getLatitude());
        resp.setLongitude(zone.getLongitude());
        resp.setHourlyPrice(zone.getHourlyPrice());
        resp.setDailyPrice(zone.getDailyPrice());
        resp.setTotalCapacity(zone.getTotalCapacity());
        resp.setAvailableCapacity(availableCapacity != null ? availableCapacity : zone.getTotalCapacity());
        resp.setFeatures(zone.getFeatures());
        resp.setPhotos(zone.getPhotos());
        resp.setActive(zone.getActive());
        resp.setCreatedAt(zone.getCreatedAt());
        return resp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getHourlyPrice() {
        return hourlyPrice;
    }

    public void setHourlyPrice(Double hourlyPrice) {
        this.hourlyPrice = hourlyPrice;
    }

    public Double getDailyPrice() {
        return dailyPrice;
    }

    public void setDailyPrice(Double dailyPrice) {
        this.dailyPrice = dailyPrice;
    }

    public Integer getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(Integer totalCapacity) {
        this.totalCapacity = totalCapacity;
    }

    public Integer getAvailableCapacity() {
        return availableCapacity;
    }

    public void setAvailableCapacity(Integer availableCapacity) {
        this.availableCapacity = availableCapacity;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public List<String> getPhotos() {
        return photos;
    }

    public void setPhotos(List<String> photos) {
        this.photos = photos;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
