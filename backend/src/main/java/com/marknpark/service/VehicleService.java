package com.marknpark.service;

import com.marknpark.dto.CreateVehicleRequest;
import com.marknpark.exception.ForbiddenException;
import com.marknpark.exception.ResourceNotFoundException;
import com.marknpark.model.Vehicle;
import com.marknpark.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getVehiclesByUserId(String userId) {
        return vehicleRepository.findByUserId(userId);
    }

    public Vehicle createVehicle(CreateVehicleRequest request, String userId) {
        Vehicle vehicle = new Vehicle();
        vehicle.setUserId(userId);
        vehicle.setVehicleNumber(request.getVehicleNumber().toUpperCase().trim());
        vehicle.setVehicleType(request.getVehicleType().toUpperCase().trim());
        vehicle.setVehicleName(request.getVehicleName().trim());
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(String id, CreateVehicleRequest request, String userId) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        if (!vehicle.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not own this vehicle");
        }

        vehicle.setVehicleNumber(request.getVehicleNumber().toUpperCase().trim());
        vehicle.setVehicleType(request.getVehicleType().toUpperCase().trim());
        vehicle.setVehicleName(request.getVehicleName().trim());
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(String id, String userId) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        if (!vehicle.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not own this vehicle");
        }

        vehicleRepository.delete(vehicle);
    }
}
