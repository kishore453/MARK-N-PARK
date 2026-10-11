import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, ShieldCheck, MapPin } from 'lucide-react';
import api from '../../services/api';
import LoadingState from '../../components/common/LoadingState';

export default function AdminReportsPage() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/admin/reports');
        if (res?.data) {
          setReports(res.data);
        }
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingState message="Aggregating platform reports and telemetry..." />
      </div>
    );
  }

  const advancePercentage = 25;
  const balancePercentage = 75;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-800">
        <div>
          <span className="text-xs font-bold text-signal uppercase tracking-widest">
            OPERATIONAL ANALYTICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
            Exchange Performance & Financial Reports
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time liquidity, booking conversions, host occupancy, and 25/75 split breakdown
          </p>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-graphite-900 border border-graphite-800 p-6 rounded-lg space-y-2">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
            Gross Marketplace Value (GMV)
          </span>
          <div className="text-3xl font-extrabold text-bone-50">₹{reports?.totalRevenue || 0}</div>
          <p className="text-[11px] text-neutral-400">Total value of all confirmed parking bookings.</p>
        </div>

        <div className="bg-graphite-900 border border-graphite-800 p-6 rounded-lg space-y-2">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
            25% Online Advance Captured
          </span>
          <div className="text-3xl font-extrabold text-signal">₹{reports?.advanceCaptured || 0}</div>
          <p className="text-[11px] text-neutral-400">Captured and verified via Razorpay HMAC signature.</p>
        </div>

        <div className="bg-graphite-900 border border-graphite-800 p-6 rounded-lg space-y-2">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
            75% Expected Arrival Settlements
          </span>
          <div className="text-3xl font-extrabold text-emerald-400">
            ₹{Math.round(((reports?.totalRevenue || 0) - (reports?.advanceCaptured || 0)) * 100) / 100}
          </div>
          <p className="text-[11px] text-neutral-400">To be settled by drivers directly upon bay entry.</p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Marketplace Conversion */}
        <div className="bg-graphite-900 border border-graphite-800 p-6 rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-bone-50 pb-2 border-b border-graphite-800">
            Booking Conversions
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-graphite-800">
              <span className="text-neutral-300">Total Initiated Bookings</span>
              <span className="font-bold text-bone-50">{reports?.totalBookings || 0}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-graphite-800">
              <span className="text-neutral-300">Confirmed (Advance Paid)</span>
              <span className="font-bold text-emerald-400">{reports?.confirmedBookings || 0}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-neutral-300">Confirmation Conversion Rate</span>
              <span className="font-bold text-signal">
                {reports?.totalBookings > 0
                  ? Math.round((reports.confirmedBookings / reports.totalBookings) * 100)
                  : 100}%
              </span>
            </div>
          </div>
        </div>

        {/* User Ecosystem */}
        <div className="bg-graphite-900 border border-graphite-800 p-6 rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-bone-50 pb-2 border-b border-graphite-800">
            Participant Ecosystem
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-graphite-800">
              <span className="text-neutral-300">Active Seekers (Drivers)</span>
              <span className="font-bold text-bone-50">{reports?.totalSeekers || 0}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-graphite-800">
              <span className="text-neutral-300">Active Property Hosts</span>
              <span className="font-bold text-bone-50">{reports?.totalHosts || 0}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-neutral-300">Operational Facilities</span>
              <span className="font-bold text-emerald-400">
                {reports?.activeZones || 0} / {reports?.totalZones || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
