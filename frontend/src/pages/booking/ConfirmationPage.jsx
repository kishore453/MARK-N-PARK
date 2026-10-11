import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MapPin, Calendar, Clock, Car, ArrowRight, Download, Share2 } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import StatusBadge from '../../components/common/StatusBadge';

export default function ConfirmationPage() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await api.get(`/reservations/${reservationId}`);
        if (res?.data) {
          setReservation(res.data);
        }
      } catch (err) {
        console.error('Could not load reservation confirmation', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <LoadingState message="Generating digital parking permit..." />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-neutral-400">Reservation confirmation details could not be found.</p>
        <Link to="/my-reservations" className="mt-4 inline-block text-signal font-semibold">
          Go to My Reservations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Badge Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-700/60 rounded-full flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-950/40">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold text-signal uppercase tracking-widest block">
          STEP 3 OF 3: CONFIRMED
        </span>
        <h1 className="text-3xl font-extrabold text-bone-50 tracking-tight">
          Parking Bay Reserved!
        </h1>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          Your 25% advance deposit has been captured via Razorpay. Your parking permit has been confirmed.
        </p>
      </div>

      {/* Digital Parking Pass Card */}
      <div className="bg-graphite-900 border border-graphite-750 rounded-lg overflow-hidden shadow-2xl">
        {/* Pass Top Bar */}
        <div className="bg-graphite-850 p-4 border-b border-graphite-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              BOOKING REFERENCE
            </span>
            <p className="text-sm font-mono font-bold text-bone-50">#{reservation.id.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={reservation.reservationStatus} type="reservation" />
            <StatusBadge status={reservation.paymentStatus} type="payment" />
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-6 space-y-6">
          {/* Facility Location */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-signal uppercase tracking-wider">
              PARKING FACILITY
            </span>
            <h3 className="text-lg font-bold text-bone-50">{reservation.parkingZoneName}</h3>
            <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-signal flex-shrink-0" />
              <span>{reservation.parkingZoneAddress}, {reservation.parkingZoneCity}</span>
            </p>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-graphite-850 rounded border border-graphite-750 text-xs">
            <div>
              <span className="text-neutral-400 block">Date of Arrival</span>
              <span className="font-semibold text-bone-100 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-signal" /> {reservation.date}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block">Reserved Window</span>
              <span className="font-semibold text-bone-100 flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5 text-signal" /> {reservation.startTime} - {reservation.endTime}
              </span>
            </div>
            <div className="col-span-2 pt-2 border-t border-graphite-800">
              <span className="text-neutral-400 block">Permitted Vehicle</span>
              <span className="font-semibold text-bone-100 flex items-center gap-1.5 mt-1">
                <Car className="w-3.5 h-3.5 text-signal" /> {reservation.vehicleName} ({reservation.vehicleNumber}) - {reservation.vehicleType}
              </span>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 text-xs pt-2 border-t border-graphite-800">
            <div className="flex justify-between text-neutral-300">
              <span>Gross Total Tariff:</span>
              <span className="font-bold text-bone-50">₹{reservation.totalAmount}</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Advance Paid Online (25%):</span>
              <span>₹{reservation.advanceAmount}</span>
            </div>
            <div className="flex justify-between text-signal font-bold pt-2 border-t border-graphite-800 text-sm">
              <span>Remaining Balance on Arrival (75%):</span>
              <span>₹{reservation.remainingAmount}</span>
            </div>
          </div>
        </div>

        {/* Pass Actions */}
        <div className="bg-graphite-850 p-4 border-t border-graphite-800 flex items-center justify-between gap-4">
          <Link to="/my-reservations" className="flex-1">
            <Button variant="primary" size="md" className="w-full" icon={ArrowRight}>
              View in My Reservations
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="outline" size="md">
              Find More Parking
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
