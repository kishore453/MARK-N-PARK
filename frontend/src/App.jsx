import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ProfilePage from './pages/public/ProfilePage';
import SearchPage from './pages/search/SearchPage';
import ZoneDetailPage from './pages/search/ZoneDetailPage';

// Seeker / Booking Pages
import BookingPage from './pages/booking/BookingPage';
import PaymentPage from './pages/booking/PaymentPage';
import ConfirmationPage from './pages/booking/ConfirmationPage';
import MyReservationsPage from './pages/seeker/MyReservationsPage';
import VehiclesPage from './pages/seeker/VehiclesPage';

// Host Pages
import HostDashboardPage from './pages/host/HostDashboardPage';
import HostParkingZonesPage from './pages/host/HostParkingZonesPage';
import HostParkingZoneFormPage from './pages/host/HostParkingZoneFormPage';
import HostReservationsPage from './pages/host/HostReservationsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminZonesPage from './pages/admin/AdminZonesPage';
import AdminReservationsPage from './pages/admin/AdminReservationsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#0E0E0E] text-[#F7F5F0]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/parking/:id" element={<ZoneDetailPage />} />

              {/* Seeker & Authenticated Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vehicles"
                element={
                  <ProtectedRoute>
                    <VehiclesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/:parkingZoneId"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/:reservationId"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/confirmation/:reservationId"
                element={
                  <ProtectedRoute>
                    <ConfirmationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-reservations"
                element={
                  <ProtectedRoute>
                    <MyReservationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reservation/:id"
                element={
                  <ProtectedRoute>
                    <ConfirmationPage />
                  </ProtectedRoute>
                }
              />

              {/* Host Protected Routes */}
              <Route
                path="/host"
                element={
                  <RoleRoute allowedRoles={['HOST', 'ADMIN']}>
                    <HostDashboardPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/host/parking-zones"
                element={
                  <RoleRoute allowedRoles={['HOST', 'ADMIN']}>
                    <HostParkingZonesPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/host/parking-zones/new"
                element={
                  <RoleRoute allowedRoles={['HOST', 'ADMIN']}>
                    <HostParkingZoneFormPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/host/parking-zones/:id/edit"
                element={
                  <RoleRoute allowedRoles={['HOST', 'ADMIN']}>
                    <HostParkingZoneFormPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/host/reservations"
                element={
                  <RoleRoute allowedRoles={['HOST', 'ADMIN']}>
                    <HostReservationsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/host/profile"
                element={
                  <RoleRoute allowedRoles={['HOST', 'ADMIN']}>
                    <ProfilePage />
                  </RoleRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <AdminUsersPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/parking-zones"
                element={
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <AdminZonesPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/reservations"
                element={
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <AdminReservationsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <AdminPaymentsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <AdminReportsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/configuration"
                element={
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </RoleRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
