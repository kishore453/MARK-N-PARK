package com.marknpark.repository;

import com.marknpark.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    List<Vehicle> findByUserId(String userId);
    Optional<Vehicle> findByIdAndUserId(String id, String userId);
    boolean existsByVehicleNumberAndUserId(String vehicleNumber, String userId);
}
