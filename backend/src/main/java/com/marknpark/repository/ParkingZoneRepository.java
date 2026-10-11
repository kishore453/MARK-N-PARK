package com.marknpark.repository;

import com.marknpark.model.ParkingZone;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingZoneRepository extends MongoRepository<ParkingZone, String> {
    List<ParkingZone> findByHostId(String hostId);
    List<ParkingZone> findByActiveTrue();
    Optional<ParkingZone> findByIdAndActiveTrue(String id);
    
    @Query("{ 'active': true, $or: [ { 'city': { $regex: ?0, $options: 'i' } }, { 'address': { $regex: ?0, $options: 'i' } }, { 'name': { $regex: ?0, $options: 'i' } } ] }")
    List<ParkingZone> searchByLocation(String query);
}
