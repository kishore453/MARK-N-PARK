# MARK N PARK (Peer-to-Peer Parking Marketplace)

**MARK N PARK** is a full-stack peer-to-peer parking marketplace and reservation platform. It connects vehicle drivers seeking parking spaces with property hosts with available driveways, parking zones, and commercial spaces.

---

## 🛠 Tech Stack

- **Backend**: Java 21, Spring Boot 3.3.4, Spring Security, Spring Data MongoDB, JJWT (0.12.6), Razorpay SDK, Cloudinary SDK
- **Frontend**: React 19, Vite 8, TailwindCSS, React Router v7, Lucide Icons, Axios
- **Database**: MongoDB (Local or MongoDB Atlas)

---

## 🚀 Running the Application

### 1. Prerequisites
- **Java 21+** installed
- **MongoDB** running on `mongodb://localhost:27017`
- **Node.js** (v18+) and npm
- **Apache Maven** (located in `C:\Users\Kishore B\Downloads\apache-maven-3.10.0-bin\apache-maven-3.10.0\bin\mvn.cmd`)

### 2. Backend (Spring Boot)
```bash
cd backend
mvn clean package -DskipTests
java -jar target/marknpark-backend-1.0.0.jar
```
*Runs on `http://localhost:8080`*

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Runs on `http://localhost:5173`*

---

## 🔑 Demo Seed Accounts

Upon initial startup with an empty database, the backend automatically seeds the following accounts and parking spots:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Seeker** | `seeker@marknpark.com` | `Seeker@12345` | Vehicle driver with pre-registered vehicles (Hyundai Creta, Ather 450X) |
| **Host** | `host@marknpark.com` | `Host@12345` | Parking zone owner with active parking hubs in Bengaluru |
| **Admin** | `admin@marknpark.com` | `Admin@12345` | Platform administrator with full analytics, user & zone management |

---

## 📱 Features

1. **Seeker Portal**:
   - Geospatial search for parking zones with price, date, time, and amenity filters
   - Interactive zone map with availability and instant pricing calculator
   - Vehicle registry management (Cars, SUVs, EVs, Bikes)
   - Reservation management with 25% advance booking & Razorpay integration
   - Real-time confirmation tickets with verification codes

2. **Host Portal**:
   - Host dashboard with occupancy metrics and earnings
   - Parking zone creator with multi-tier hourly & daily pricing, amenities, and photo uploads
   - Real-time reservation tracker (Pending, Confirmed, Completed, Cancelled)

3. **Admin Portal**:
   - Platform dashboard with revenue overview and advance payment metrics
   - User role governance (Seeker / Host / Admin)
   - Parking zone moderation & active toggle
   - Transaction logs & system health configurations
