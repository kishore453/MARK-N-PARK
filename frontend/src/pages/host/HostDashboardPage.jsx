import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, Clock, DollarSign, Activity, Users, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingState from '../../components/common/LoadingState';

export default function HostDashboardPage() {
  const [zones, setZones] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostData = async () => {
      try {
        const [zonesRes, resRes] = await Promise.all([
          api.get('/parking-zones'),
          api.get('/host/reservations'),
        ]);

        if (zonesRes?.data) setZones(zonesRes.data);
        if (resRes?.data) setReservations(resRes.data);
      } catch (err) {
        console.error('Failed to load host dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHostData();
  }, []);

  const totalCapacity = zones.reduce((acc, z) => acc + (z.totalCapacity || 0), 0);
  const activeZonesCount = zones.filter(z => z.active).length;
  const confirmedReservations = reservations.filter(r => r.reservationStatus === 'CONFIRMED');
  const totalAdvanceRevenue = confirmedReservations.reduce((acc, r) => acc + (r.advanceAmount || 0), 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingState message="Loading host operations console..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-800">
        <div>
          <span className="text-xs font-bold text-signal uppercase tracking-widest">
            HOST OPERATIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
            Parking Facility Console
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time bay occupancy, active tariffs, advance receipts, and inbound reservations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/host/reservations">
            <Button variant="outline" size="sm">
              View All Reservations
            </Button>
          </Link>
          <Link to="/host/parking-zones/new">
            <Button variant="primary" size="sm" icon={Plus}>
              Add Parking Zone
            </Button>
          </Link>
        </div>
      </div>

      {/* Practical Compact Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-graphite-900 border border-graphite-800 p-4 rounded-lg">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Active Parking Zones
          </span>
          <div className="text-2xl font-extrabold text-bone-50 mt-1">
            {activeZonesCount} <span className="text-xs font-normal text-neutral-400">/ {zones.length} total</span>
          </div>
        </div>

        <div className="bg-graphite-900 border border-graphite-800 p-4 rounded-lg">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Total Bay Capacity
          </span>
          <div className="text-2xl font-extrabold text-bone-50 mt-1">
            {totalCapacity} <span className="text-xs font-normal text-neutral-400">Slots</span>
          </div>
        </div>

        <div className="bg-graphite-900 border border-graphite-800 p-4 rounded-lg">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Confirmed Bookings
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {confirmedReservations.length}
          </div>
        </div>

        <div className="bg-graphite-900 border border-graphite-800 p-4 rounded-lg">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Advance Captured (25%)
          </span>
          <div className="text-2xl font-extrabold text-signal mt-1">
            ₹{Math.round(totalAdvanceRevenue * 100) / 100}
          </div>
        </div>
      </div>

      {/* Main Grid: Zones Summary & Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Managed Zones (col-span-5) */}
        <div className="lg:col-span-5 bg-graphite-900 border border-graphite-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-sm font-bold text-bone-50">Managed Facilities</h3>
            <Link to="/host/parking-zones" className="text-xs text-signal hover:underline font-semibold">
              Manage All
            </Link>
          </div>

          {zones.length === 0 ? (
            <div className="text-center py-6 text-xs text-neutral-400">
              No parking facilities listed yet. Click "Add Parking Zone" to begin.
            </div>
          ) : (
            <div className="space-y-3">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="p-3 bg-graphite-850 border border-graphite-750 rounded flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-bone-50">{zone.name}</h4>
                    <p className="text-[11px] text-neutral-400">{zone.city} • ₹{zone.hourlyPrice}/hr</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">{zone.totalCapacity} bays</span>
                    <p className="text-[10px] text-neutral-400">{zone.active ? 'Operational' : 'Disabled'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inbound Reservations Table (col-span-7) */}
        <div className="lg:col-span-7 bg-graphite-900 border border-graphite-800 rounded-lg p-5 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-graphite-800">
            <h3 className="text-sm font-bold text-bone-50">Recent Inbound Reservations</h3>
            <Link to="/host/reservations" className="text-xs text-signal hover:underline font-semibold">
              Full Log
            </Link>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-8 text-xs text-neutral-400">
              No reservations have been placed yet for your facilities.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-graphite-800 text-[10px] text-neutral-400 uppercase tracking-wider">
                    <th className="pb-2 font-semibold">Date & Time</th>
                    <th className="pb-2 font-semibold">Driver / Vehicle</th>
                    <th className="pb-2 font-semibold">Advance (25%)</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-graphite-800">
                  {reservations.slice(0, 5).map((r) => (
                    <tr key={r.id} className="hover:bg-graphite-850/50">
                      <td className="py-2.5">
                        <div className="font-semibold text-bone-100">{r.date}</div>
                        <div className="text-[10px] text-neutral-400">{r.startTime} - {r.endTime}</div>
                      </td>
                      <td className="py-2.5">
                        <div className="font-medium text-bone-200">{r.seekerName || 'Seeker'}</div>
                        <div className="text-[10px] text-signal font-mono">{r.vehicleNumber}</div>
                      </td>
                      <td className="py-2.5 font-bold text-emerald-400">
                        ₹{r.advanceAmount}
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={r.reservationStatus} type="reservation" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
