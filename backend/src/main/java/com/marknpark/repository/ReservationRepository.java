package com.marknpark.repository;

import com.marknpark.model.Reservation;
import com.marknpark.model.ReservationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findBySeekerIdOrderByCreatedAtDesc(String seekerId);
    List<Reservation> findByHostIdOrderByCreatedAtDesc(String hostId);
    List<Reservation> findByParkingZoneId(String parkingZoneId);
    
    List<Reservation> findByParkingZoneIdAndDateAndReservationStatusIn(
            String parkingZoneId, String date, List<ReservationStatus> statuses);

    @Query("{ 'parkingZoneId': ?0, 'date': ?1, 'reservationStatus': { $in: ?2 } }")
    List<Reservation> findActiveByZoneAndDate(String parkingZoneId, String date, List<ReservationStatus> statuses);

    List<Reservation> findAllByOrderByCreatedAtDesc();
}
