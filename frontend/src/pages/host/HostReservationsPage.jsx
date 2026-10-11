import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Car, Phone, Mail, User, Shield } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

export default function HostReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get('/host/reservations');
        if (res?.data) {
          setReservations(res.data);
        }
      } catch (err) {
        console.error('Failed to load host reservations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const filtered = reservations.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.reservationStatus === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-800">
        <div>
          <span className="text-xs font-bold text-signal uppercase tracking-widest">
            HOST PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
            Facility Reservations
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Complete arrival register, vehicle numbers, advance captured and balance collections
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-graphite-900 p-1 rounded border border-graphite-800">
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                filterStatus === st
                  ? 'bg-signal text-white'
                  : 'text-neutral-400 hover:text-bone-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading facility inbound reservations..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No reservations found"
          description="There are currently no reservations matching your selected filter."
        />
      ) : (
        <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-graphite-850 border-b border-graphite-800 text-[10px] text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Booking ID</th>
                  <th className="py-3 px-4 font-semibold">Facility Zone</th>
                  <th className="py-3 px-4 font-semibold">Driver / Contact</th>
                  <th className="py-3 px-4 font-semibold">Schedule</th>
                  <th className="py-3 px-4 font-semibold">Vehicle</th>
                  <th className="py-3 px-4 font-semibold">Tariff (Adv / Bal)</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-800">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-graphite-850/50">
                    <td className="py-3 px-4 font-mono font-bold text-bone-200">
                      #{r.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-bone-50">{r.parkingZoneName}</div>
                      <div className="text-[10px] text-neutral-400">{r.parkingZoneCity}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-bone-100">{r.seekerName || 'Seeker'}</div>
                      <div className="text-[10px] text-neutral-400">{r.seekerPhone || r.seekerEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-bone-100">{r.date}</div>
                      <div className="text-[10px] text-neutral-400">{r.startTime} - {r.endTime}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-signal">
                      {r.vehicleNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-400">Adv: ₹{r.advanceAmount}</div>
                      <div className="text-[10px] text-neutral-400">Bal: ₹{r.remainingAmount}</div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.reservationStatus} type="reservation" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
