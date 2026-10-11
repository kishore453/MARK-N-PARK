import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingState from '../../components/common/LoadingState';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get('/admin/reservations');
        if (res?.data) {
          setReservations(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin reservations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-800">
        <div>
          <span className="text-xs font-bold text-signal uppercase tracking-widest">
            ADMINISTRATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
            Global Reservations Ledger
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Audit booker identities, parking zones, duration, vehicle numbers, and tariffs
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading platform reservations ledger..." />
      ) : (
        <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-graphite-850 border-b border-graphite-800 text-[10px] text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ref ID</th>
                  <th className="py-3 px-4 font-semibold">Facility</th>
                  <th className="py-3 px-4 font-semibold">Seeker</th>
                  <th className="py-3 px-4 font-semibold">Vehicle</th>
                  <th className="py-3 px-4 font-semibold">Schedule</th>
                  <th className="py-3 px-4 font-semibold">Total (Adv 25%)</th>
                  <th className="py-3 px-4 font-semibold">Reservation Status</th>
                  <th className="py-3 px-4 font-semibold">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-800">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-graphite-850/50">
                    <td className="py-3 px-4 font-mono font-bold text-bone-200">
                      #{r.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-bone-50">{r.parkingZoneName}</div>
                      <div className="text-[10px] text-neutral-400">{r.parkingZoneCity}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-bone-100">{r.seekerName || 'Seeker'}</div>
                      <div className="text-[10px] text-neutral-400">{r.seekerEmail}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-signal">
                      {r.vehicleNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-bone-100">{r.date}</div>
                      <div className="text-[10px] text-neutral-400">{r.startTime} - {r.endTime}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-bone-50">₹{r.totalAmount}</div>
                      <div className="text-[10px] text-emerald-400">₹{r.advanceAmount} Adv</div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.reservationStatus} type="reservation" />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.paymentStatus} type="payment" />
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
