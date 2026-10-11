import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Menu, X, User as UserIcon, LogOut, Shield, Car, Calendar, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, isAuthenticated, isSeeker, isHost, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-signal ${
      isActive ? 'text-signal font-semibold' : 'text-neutral-300'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-graphite-900/95 backdrop-blur-md border-b border-graphite-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-signal rounded flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="font-extrabold text-base tracking-tighter">M</span>
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-bone-50 text-base sm:text-lg flex items-center gap-1.5">
                MARK <span className="text-signal">N</span> PARK
              </span>
              <span className="hidden sm:block text-[10px] tracking-widest text-neutral-400 font-medium uppercase -mt-1">
                Find. Reserve. Park.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              // Public Navigation
              <>
                <NavLink to="/search" className={navLinkClasses}>Find Parking</NavLink>
                <a href="/#how-it-works" className="text-sm font-medium text-neutral-300 hover:text-signal transition-colors">How It Works</a>
                <NavLink to="/register?role=HOST" className={navLinkClasses}>List Your Parking</NavLink>
              </>
            ) : isSeeker ? (
              // Seeker Navigation
              <>
                <NavLink to="/search" className={navLinkClasses}>Find Parking</NavLink>
                <NavLink to="/my-reservations" className={navLinkClasses}>My Reservations</NavLink>
                <NavLink to="/vehicles" className={navLinkClasses}>Vehicles</NavLink>
                <NavLink to="/profile" className={navLinkClasses}>Profile</NavLink>
              </>
            ) : isHost ? (
              // Host Navigation
              <>
                <NavLink to="/host" end className={navLinkClasses}>Dashboard</NavLink>
                <NavLink to="/host/parking-zones" className={navLinkClasses}>Parking Zones</NavLink>
                <NavLink to="/host/reservations" className={navLinkClasses}>Reservations</NavLink>
                <NavLink to="/host/profile" className={navLinkClasses}>Profile</NavLink>
              </>
            ) : isAdmin ? (
              // Admin Navigation
              <>
                <NavLink to="/admin" end className={navLinkClasses}>Admin Dashboard</NavLink>
                <NavLink to="/admin/users" className={navLinkClasses}>Users</NavLink>
                <NavLink to="/admin/parking-zones" className={navLinkClasses}>Parking Zones</NavLink>
                <NavLink to="/admin/reservations" className={navLinkClasses}>Reservations</NavLink>
                <NavLink to="/admin/payments" className={navLinkClasses}>Payments</NavLink>
                <NavLink to="/admin/reports" className={navLinkClasses}>Reports</NavLink>
              </>
            ) : null}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/search">
                  <Button variant="primary" size="sm">Find Parking</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-graphite-800 border border-graphite-700">
                  <div className="w-6 h-6 rounded-full bg-graphite-700 flex items-center justify-center text-signal text-xs font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs text-bone-100 font-medium truncate max-w-[120px]">{user?.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-graphite-900 border border-graphite-700 text-neutral-400 rounded uppercase font-semibold">
                    {user?.role}
                  </span>
                </div>
                <Button variant="outline" size="sm" icon={LogOut} onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-neutral-300 hover:text-bone-50 hover:bg-graphite-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-graphite-900 border-b border-graphite-800 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2.5">
            {!isAuthenticated ? (
              <>
                <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2 text-neutral-300 hover:text-signal">
                  Find Parking
                </Link>
                <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2 text-neutral-300 hover:text-signal">
                  How It Works
                </a>
                <Link to="/register?role=HOST" onClick={() => setMobileMenuOpen(false)} className="text-sm py-2 text-neutral-300 hover:text-signal">
                  List Your Parking
                </Link>
                <div className="pt-3 border-t border-graphite-800 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/search" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">Find Parking</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="py-2 border-b border-graphite-800 flex items-center justify-between">
                  <div className="text-xs text-bone-100 font-medium">{user?.name} ({user?.role})</div>
                  <Button variant="outline" size="sm" icon={LogOut} onClick={handleLogout}>Logout</Button>
                </div>
                {isSeeker && (
                  <>
                    <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Find Parking</Link>
                    <Link to="/my-reservations" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">My Reservations</Link>
                    <Link to="/vehicles" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Vehicles</Link>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Profile</Link>
                  </>
                )}
                {isHost && (
                  <>
                    <Link to="/host" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Dashboard</Link>
                    <Link to="/host/parking-zones" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Parking Zones</Link>
                    <Link to="/host/reservations" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Reservations</Link>
                    <Link to="/host/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Profile</Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Admin Dashboard</Link>
                    <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Users</Link>
                    <Link to="/admin/parking-zones" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Parking Zones</Link>
                    <Link to="/admin/reservations" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Reservations</Link>
                    <Link to="/admin/payments" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Payments</Link>
                    <Link to="/admin/reports" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5 text-neutral-300">Reports</Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
