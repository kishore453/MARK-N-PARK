import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-graphite-950 border-t border-graphite-800 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-signal rounded flex items-center justify-center text-white font-extrabold text-sm">
                M
              </div>
              <span className="font-extrabold tracking-tight text-bone-50 text-base">
                MARK <span className="text-signal">N</span> PARK
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Peer-to-peer urban parking marketplace and reservation platform. Find guaranteed bays, book in advance, and park effortlessly.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Razorpay Verified & Secured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-bone-100 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search" className="hover:text-signal transition-colors">Find Parking</Link></li>
              <li><Link to="/search?city=Bengaluru" className="hover:text-signal transition-colors">Bengaluru Hubs</Link></li>
              <li><Link to="/register?role=HOST" className="hover:text-signal transition-colors">List Your Parking Zone</Link></li>
              <li><a href="/#how-it-works" className="hover:text-signal transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Platform Pillars */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-bone-100 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-signal" /> 25% Advance Lock-in</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-signal" /> Exact GPS Coordinates</li>
              <li>Real-time Capacity Checking</li>
              <li>Verified Host Network</li>
            </ul>
          </div>

          {/* Portals & Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-bone-100 uppercase tracking-wider">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-signal transition-colors">User Sign In</Link></li>
              <li><Link to="/register" className="hover:text-signal transition-colors">Seeker Registration</Link></li>
              <li><Link to="/register?role=HOST" className="hover:text-signal transition-colors">Host Partner Portal</Link></li>
              <li><Link to="/login" className="hover:text-signal transition-colors">Administrative Access</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-graphite-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} MARK N PARK. All rights reserved. Peer-to-Peer Urban Mobility.</p>
          <div className="flex items-center gap-6">
            <span>Find. Reserve. Park.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
