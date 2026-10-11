import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Calendar, CreditCard, BarChart3, Settings, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';

export default function AdminDashboardPage() {
  const [reports, setReports] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [repRes, cfgRes] = await Promise.all([
          api.get('/admin/reports'),
          api.get('/admin/configuration'),
        ]);

        if (repRes?.data) setReports(repRes.data);
        if (cfgRes?.data) setConfig(cfgRes.data);
      } catch (err) {
        console.error('Failed to load admin metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingState message="Connecting to administrative console..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-800">
        <div>
          <span className="text-xs font-bold text-signal uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-signal" /> SYSTEM ADMINISTRATOR CONSOLE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
            Platform Master Overview
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Global exchange metrics, transaction volume, user identities, and infrastructure health
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/reports">
            <Button variant="outline" size="sm" icon={BarChart3}>
              Detailed Reports
            </Button>
          </Link>
          <Link to="/admin/parking-zones">
            <Button variant="primary" size="sm">
              Manage Zones
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-graphite-900 border border-graphite-800 p-4 rounded-lg">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Total Users
          </span>
          <div className="text-2xl font-extrabold text-bone-50 mt-1">{reports?.totalUsers || 0}</div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            {reports?.totalSeekers || 0} Seekers • {reports?.totalHosts || 0} Hosts
          </span>
        </div>

        <div className="bg-graphite-900 border border-graphite-800 p-4 rounded-lg">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Parking Zones
          </span>
          <div className="text-2xl font-extrabold text-bone-50 mt-1">{reports?.totalZones || 0}</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">
            {reports?.activeZones || 0} Active Facilities
          </span>
        </div>

        <div className="bg-graphite-900 border border-graphite-800 p-4 rounded-lg">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Confirmed Bookings
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{reports?.confirmedBookings || 0}</div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            {reports?.totalBookings || 0} Total Initiated
          </span>
        </div>

        <div className="bg-graphite-900 border border-graphite-800 p-4 rounded-lg">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            25% Advance Captured
          </span>
          <div className="text-2xl font-extrabold text-signal mt-1">₹{reports?.advanceCaptured || 0}</div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            Gross GMV: ₹{reports?.totalRevenue || 0}
          </span>
        </div>
      </div>

      {/* Admin Modules Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="bg-graphite-900 border border-graphite-800 p-5 rounded-lg hover:border-graphite-700 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-bone-50 font-bold text-sm">
              <Users className="w-4 h-4 text-signal" /> User Management
            </div>
            <p className="text-xs text-neutral-400">View registered seekers, hosts, and role permissions.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-signal transition-colors" />
        </Link>

        <Link
          to="/admin/parking-zones"
          className="bg-graphite-900 border border-graphite-800 p-5 rounded-lg hover:border-graphite-700 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-bone-50 font-bold text-sm">
              <MapPin className="w-4 h-4 text-signal" /> Parking Zones
            </div>
            <p className="text-xs text-neutral-400">Audit capacity, location coords, tariffs, and status toggles.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-signal transition-colors" />
        </Link>

        <Link
          to="/admin/reservations"
          className="bg-graphite-900 border border-graphite-800 p-5 rounded-lg hover:border-graphite-700 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-bone-50 font-bold text-sm">
              <Calendar className="w-4 h-4 text-signal" /> Reservations Ledger
            </div>
            <p className="text-xs text-neutral-400">Inspect system-wide active, confirmed, and cancelled bookings.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-signal transition-colors" />
        </Link>

        <Link
          to="/admin/payments"
          className="bg-graphite-900 border border-graphite-800 p-5 rounded-lg hover:border-graphite-700 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-bone-50 font-bold text-sm">
              <CreditCard className="w-4 h-4 text-signal" /> Payment Transactions
            </div>
            <p className="text-xs text-neutral-400">Razorpay order logs, payment IDs, and signatures.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-signal transition-colors" />
        </Link>

        <Link
          to="/admin/reports"
          className="bg-graphite-900 border border-graphite-800 p-5 rounded-lg hover:border-graphite-700 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-bone-50 font-bold text-sm">
              <BarChart3 className="w-4 h-4 text-signal" /> Operational Analytics
            </div>
            <p className="text-xs text-neutral-400">Detailed performance insights and financial metrics.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-signal transition-colors" />
        </Link>

        <div className="bg-graphite-900 border border-graphite-800 p-5 rounded-lg space-y-1">
          <div className="flex items-center gap-2 text-bone-50 font-bold text-sm">
            <Settings className="w-4 h-4 text-signal" /> System Configuration
          </div>
          <p className="text-xs text-neutral-400">
            Split: {config?.advancePercentage}% / {config?.remainingPercentage}% • DB: {config?.database}
          </p>
        </div>
      </div>
    </div>
  );
}
