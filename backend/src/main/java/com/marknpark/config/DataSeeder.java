package com.marknpark.config;

import com.marknpark.model.ParkingZone;
import com.marknpark.model.Role;
import com.marknpark.model.User;
import com.marknpark.model.Vehicle;
import com.marknpark.repository.ParkingZoneRepository;
import com.marknpark.repository.UserRepository;
import com.marknpark.repository.VehicleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final ParkingZoneRepository parkingZoneRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      ParkingZoneRepository parkingZoneRepository,
                      VehicleRepository vehicleRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.parkingZoneRepository = parkingZoneRepository;
        this.vehicleRepository = vehicleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            if (userRepository.count() == 0) {
                log.info("Database is empty. Seeding initial demo users and parking zones...");

                // 1. Seed Admin
                User admin = new User();
                admin.setName("Platform Administrator");
                admin.setEmail("admin@marknpark.com");
                admin.setPasswordHash(passwordEncoder.encode("Admin@12345"));
                admin.setRole(Role.ADMIN);
                admin.setPhone("+919876543210");
                userRepository.save(admin);

                // 2. Seed Host
                User host = new User();
                host.setName("Vikram Malhotra");
                host.setEmail("host@marknpark.com");
                host.setPasswordHash(passwordEncoder.encode("Host@12345"));
                host.setRole(Role.HOST);
                host.setPhone("+919876543211");
                User savedHost = userRepository.save(host);

                // 3. Seed Seeker
                User seeker = new User();
                seeker.setName("Arjun Sharma");
                seeker.setEmail("seeker@marknpark.com");
                seeker.setPasswordHash(passwordEncoder.encode("Seeker@12345"));
                seeker.setRole(Role.SEEKER);
                seeker.setPhone("+919876543212");
                User savedSeeker = userRepository.save(seeker);

                // 4. Seed Seeker Vehicle
                Vehicle vehicle = new Vehicle();
                vehicle.setUserId(savedSeeker.getId());
                vehicle.setVehicleName("Hyundai Creta");
                vehicle.setVehicleNumber("KA-01-MJ-4029");
                vehicle.setVehicleType("SUV");
                vehicleRepository.save(vehicle);

                Vehicle vehicle2 = new Vehicle();
                vehicle2.setUserId(savedSeeker.getId());
                vehicle2.setVehicleName("Ather 450X");
                vehicle2.setVehicleNumber("KA-05-EV-1922");
                vehicle2.setVehicleType("EV");
                vehicleRepository.save(vehicle2);

                // 5. Seed Parking Zones for the Host
                ParkingZone zone1 = new ParkingZone();
                zone1.setHostId(savedHost.getId());
                zone1.setName("Indiranagar Metro Transit Hub");
                zone1.setDescription("Secure, multi-tier urban parking facility located right adjacent to CMH Road and Indiranagar Metro Station. Fully paved with boom barrier access, 24/7 CCTV surveillance, and dedicated EV fast charging stations.");
                zone1.setAddress("100 Feet Road, HAL 2nd Stage, Indiranagar");
                zone1.setCity("Bengaluru");
                zone1.setLatitude(12.9784);
                zone1.setLongitude(77.6408);
                zone1.setHourlyPrice(60.0);
                zone1.setDailyPrice(450.0);
                zone1.setTotalCapacity(15);
                zone1.setFeatures(Arrays.asList("Covered", "CCTV", "Security", "EV Charging", "24/7 Access"));
                zone1.setPhotos(Arrays.asList(
                        "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80"
                ));
                zone1.setActive(true);
                parkingZoneRepository.save(zone1);

                ParkingZone zone2 = new ParkingZone();
                zone2.setHostId(savedHost.getId());
                zone2.setName("Koramangala 5th Block Central Hub");
                zone2.setDescription("Spacious private parking zone in the heart of Koramangala commercial district. Walking distance from prominent dining spots, co-working centers, and shopping avenues. Guarded entry with dedicated CCTV.");
                zone2.setAddress("KHB Colony, 5th Block, Koramangala");
                zone2.setCity("Bengaluru");
                zone2.setLatitude(12.9352);
                zone2.setLongitude(77.6245);
                zone2.setHourlyPrice(50.0);
                zone2.setDailyPrice(380.0);
                zone2.setTotalCapacity(10);
                zone2.setFeatures(Arrays.asList("CCTV", "Security", "Lighting", "24/7 Access"));
                zone2.setPhotos(Arrays.asList(
                        "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?auto=format&fit=crop&w=1200&q=80"
                ));
                zone2.setActive(true);
                parkingZoneRepository.save(zone2);

                ParkingZone zone3 = new ParkingZone();
                zone3.setHostId(savedHost.getId());
                zone3.setName("MG Road Financial Plaza Zone");
                zone3.setDescription("Underground premium executive parking zone situated off MG Road. Features high-clearance bays, automated smart ticket validation, accessible parking ramps, and EV level-2 destination charging.");
                zone3.setAddress("Mahatma Gandhi Road, Ashok Nagar");
                zone3.setCity("Bengaluru");
                zone3.setLatitude(12.9756);
                zone3.setLongitude(77.6066);
                zone3.setHourlyPrice(80.0);
                zone3.setDailyPrice(600.0);
                zone3.setTotalCapacity(20);
                zone3.setFeatures(Arrays.asList("Covered", "CCTV", "Security", "EV Charging", "Lighting", "Accessible Parking"));
                zone3.setPhotos(Arrays.asList(
                        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80"
                ));
                zone3.setActive(true);
                parkingZoneRepository.save(zone3);

                log.info("Demo data seeding completed successfully.");
            }
        } catch (Exception e) {
            log.warn("Database seeding skipped or encountered connection notice: {}", e.getMessage());
        }
    }
}
