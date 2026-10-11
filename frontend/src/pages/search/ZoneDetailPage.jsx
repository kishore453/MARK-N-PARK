import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Shield, Zap, Car, Clock, Phone, User, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import ParkingGallery from '../../components/common/ParkingGallery';
import Map from '../../components/common/Map';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function ZoneDetailPage() {
  const { id } = useParams();
  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZone = async () => {
      try {
        const res = await api.get(`/parking-zones/${id}`);
        if (res?.data) {
          setZone(res.data);
        }
      } catch (err) {
        setError(err.message || 'Parking zone could not be found');
      } finally {
        setLoading(false);
      }
    };

    fetchZone();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingState message="Retrieving parking zone specifications..." />
      </div>
    );
  }

  if (error || !zone) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ErrorState
          title="Parking Zone Unavailable"
          message={error || 'The requested parking zone could not be found.'}
        />
      </div>
    );
  }

  const isAvailable = zone.availableCapacity > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-graphite-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2 py-0.5 rounded bg-graphite-800 border border-graphite-700 text-neutral-300 font-semibold uppercase tracking-wider">
              PARKING ZONE
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
                isAvailable
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                  : 'bg-red-950/60 text-red-300 border-red-800'
              }`}
            >
              {isAvailable ? `${zone.availableCapacity} / ${zone.totalCapacity} Spots Free` : 'Fully Booked'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight">
            {zone.name}
          </h1>

          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 mt-1">
            <MapPin className="w-4 h-4 text-signal flex-shrink-0" />
            <span>{zone.address}, {zone.city}</span>
          </p>
        </div>

        {/* Pricing & Fast Action Bar */}
        <div className="flex items-center gap-6 bg-graphite-900 border border-graphite-800 p-3.5 rounded-lg">
          <div>
            <div className="text-xl font-extrabold text-bone-50">₹{zone.hourlyPrice} <span className="text-xs font-normal text-neutral-400">/hr</span></div>
            <div className="text-xs text-neutral-400">₹{zone.dailyPrice} /day</div>
          </div>
          <Link to={`/booking/${zone.id}`}>
            <Button variant="primary" size="md" disabled={!isAvailable} icon={ArrowRight}>
              Reserve Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Gallery & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Photos & Details (col-span-7) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Photo Gallery (16:9) */}
          <ParkingGallery photos={zone.photos} name={zone.name} />

          {/* Description */}
          <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-6 space-y-3">
            <h3 className="text-base font-bold text-bone-50">About this Parking Zone</h3>
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {zone.description}
            </p>
          </div>

          {/* Amenities & Features */}
          <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-bone-50">Verified Facility Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {zone.features && zone.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 p-2.5 rounded bg-graphite-850 border border-graphite-750 text-xs text-bone-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-signal flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Location Map & Host Info (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Map Section */}
          <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold text-bone-50 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-signal" /> Exact GPS Location
            </h3>
            <Map
              zones={[zone]}
              selectedZoneId={zone.id}
              center={{ lat: zone.latitude || 12.9716, lng: zone.longitude || 77.5946 }}
              zoom={15}
              className="w-full h-[280px] rounded"
            />
            <p className="text-xs text-neutral-400">
              Coordinates: <span className="font-mono text-bone-200">{zone.latitude?.toFixed(4)}° N, {zone.longitude?.toFixed(4)}° E</span>
            </p>
          </div>

          {/* Host Card */}
          <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-5 space-y-3">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Hosted by
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-graphite-800 border border-graphite-700 flex items-center justify-center text-signal font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-bone-50">{zone.hostName || 'Verified Partner'}</p>
                <p className="text-xs text-neutral-400">MARK N PARK Verified Host</p>
              </div>
            </div>
            {zone.hostPhone && (
              <div className="pt-2 border-t border-graphite-800 flex items-center gap-2 text-xs text-neutral-300">
                <Phone className="w-3.5 h-3.5 text-signal" />
                <span>{zone.hostPhone}</span>
              </div>
            )}
          </div>

          {/* Booking Breakdown Reminder */}
          <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-5 space-y-2 text-xs text-neutral-300">
            <p className="font-semibold text-bone-50">Reservation Policy:</p>
            <ul className="space-y-1 text-neutral-400 list-disc list-inside">
              <li>25% advance payment required to lock this slot.</li>
              <li>75% balance settled directly upon arrival.</li>
              <li>Instant booking confirmation with digital pass.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
