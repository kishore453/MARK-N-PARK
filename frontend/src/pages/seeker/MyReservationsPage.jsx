import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Car, AlertCircle, Ban, Eye, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('UPCOMING'); // UPCOMING, ACTIVE, COMPLETED, CANCELLED
  const [cancelModalReservation, setCancelModalReservation] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState('');

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations/my');
      if (res?.data) {
        setReservations(res.data);
      }
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelBooking = async () => {
    if (!cancelModalReservation) return;
    setCancelling(true);
    setActionError('');

    try {
      await api.patch(`/reservations/${cancelModalReservation.id}/cancel`);
      setCancelModalReservation(null);
      await fetchReservations();
    } catch (err) {
      setActionError(err.message || 'Failed to cancel reservation');
    } finally {
      setCancelling(false);
    }
  };

  // Categorize Reservations by Date and Status
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredReservations = reservations.filter((r) => {
    if (activeTab === 'CANCELLED') {
      return r.reservationStatus === 'CANCELLED';
    }
    if (activeTab === 'COMPLETED') {
      return r.reservationStatus === 'COMPLETED' || (r.reservationStatus === 'CONFIRMED' && r.date < todayStr);
    }
    if (activeTab === 'ACTIVE') {
      return r.reservationStatus === 'CONFIRMED' && r.date === todayStr;
    }
    // UPCOMING (default)
    return (r.reservationStatus === 'CONFIRMED' || r.reservationStatus === 'PENDING') && r.date >= todayStr;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-800">
        <div>
          <span className="text-xs font-bold text-signal uppercase tracking-widest">
            SEEKER PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
            My Reservations
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track permits, arrival schedules, advance payments, and cancellation status
          </p>
        </div>

        <Link to="/search">
          <Button variant="primary" size="sm">
            Book New Parking
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-graphite-800 pb-2">
        {['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded transition-colors ${
              activeTab === tab
                ? 'bg-signal text-white'
                : 'text-neutral-400 hover:text-bone-100 hover:bg-graphite-850'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState message="Fetching your reservations history..." />
      ) : filteredReservations.length === 0 ? (
        <EmptyState
          title={`No ${activeTab.toLowerCase()} reservations`}
          description={`You do not have any ${activeTab.toLowerCase()} parking reservations at this time.`}
          actionLabel="Find Parking Near You"
          onAction={() => window.location.href = '/search'}
        />
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((res) => (
            <div
              key={res.id}
              className="bg-graphite-900 border border-graphite-800 rounded-lg p-5 space-y-4 hover:border-graphite-700 transition-all shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-graphite-800">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    ID: #{res.id.substring(0, 10).toUpperCase()}
                  </span>
                  <h3 className="text-base font-bold text-bone-50 mt-0.5">
                    {res.parkingZoneName}
                  </h3>
                  <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-signal" />
                    {res.parkingZoneAddress}, {res.parkingZoneCity}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={res.reservationStatus} type="reservation" />
                  <StatusBadge status={res.paymentStatus} type="payment" />
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 block">Date</span>
                  <span className="font-semibold text-bone-100 flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-signal" /> {res.date}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block">Time Slot</span>
                  <span className="font-semibold text-bone-100 flex items-center gap-1.5 mt-1">
                    <Clock className="w-3.5 h-3.5 text-signal" /> {res.startTime} - {res.endTime}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block">Vehicle</span>
                  <span className="font-semibold text-bone-100 flex items-center gap-1.5 mt-1">
                    <Car className="w-3.5 h-3.5 text-signal" /> {res.vehicleNumber}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block">Total Tariff</span>
                  <span className="font-bold text-bone-50 block mt-1">
                    ₹{res.totalAmount} <span className="text-[10px] text-emerald-400 font-normal">(25% adv: ₹{res.advanceAmount})</span>
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-graphite-800 flex items-center justify-between">
                <div className="text-xs text-neutral-400">
                  {res.paymentStatus === 'ADVANCE_CAPTURED' && (
                    <span className="text-emerald-400 font-medium">
                      ✓ Advance captured. Remaining ₹{res.remainingAmount} due on arrival.
                    </span>
                  )}
                  {res.paymentStatus === 'PENDING' && (
                    <span className="text-amber-400 font-medium">
                      ⚠️ Pending advance payment. Complete to avoid release.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {res.paymentStatus === 'PENDING' && res.reservationStatus === 'PENDING' && (
                    <Link to={`/payment/${res.id}`}>
                      <Button variant="primary" size="sm">
                        Pay Advance
                      </Button>
                    </Link>
                  )}

                  <Link to={`/confirmation/${res.id}`}>
                    <Button variant="outline" size="sm" icon={Eye}>
                      Permit
                    </Button>
                  </Link>

                  {res.reservationStatus !== 'CANCELLED' && res.reservationStatus !== 'COMPLETED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      icon={Ban}
                      onClick={() => setCancelModalReservation(res)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={!!cancelModalReservation}
        onClose={() => setCancelModalReservation(null)}
        title="Cancel Parking Reservation"
        subtitle="Are you sure you want to cancel this booking?"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-300 leading-relaxed">
            Cancelling will release your reserved slot back into public availability for other seekers.
          </p>

          {actionError && (
            <div className="p-3 bg-red-950/40 border border-red-800 rounded text-xs text-red-300">
              {actionError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-graphite-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalReservation(null)}
            >
              Keep Reservation
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={cancelling}
              onClick={handleCancelBooking}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
