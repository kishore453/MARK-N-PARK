import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shield, Zap, Eye, Car } from 'lucide-react';
import Button from './Button';

export default function ParkingCard({
  zone,
  isSelected = false,
  onMouseEnter,
  onMouseLeave
}) {
  if (!zone) return null;

  const primaryPhoto = zone.photos && zone.photos.length > 0
    ? zone.photos[0]
    : 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80';

  const isAvailable = zone.availableCapacity > 0;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative bg-graphite-900 rounded-lg overflow-hidden border transition-all duration-200 ${
        isSelected
          ? 'border-signal ring-1 ring-signal shadow-lg shadow-signal/10'
          : 'border-graphite-800 hover:border-graphite-700 hover:shadow-md'
      }`}
    >
      {/* 16:9 Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-graphite-950">
        <img
          src={primaryPhoto}
          alt={zone.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Capacity Overlay Pill */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${
              isAvailable
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                : 'bg-red-950/80 text-red-300 border border-red-700/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse" />
            {isAvailable ? `${zone.availableCapacity} / ${zone.totalCapacity} Available` : 'Fully Occupied'}
          </span>
        </div>

        {/* City Tag */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-graphite-950/80 text-bone-200 border border-graphite-800 backdrop-blur-md">
            {zone.city}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {/* Title & Location */}
        <div>
          <h3 className="text-base font-bold text-bone-50 group-hover:text-signal transition-colors line-clamp-1">
            {zone.name}
          </h3>
          <p className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-signal flex-shrink-0" />
            <span>{zone.address}</span>
          </p>
        </div>

        {/* Feature Badges */}
        {zone.features && zone.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {zone.features.slice(0, 3).map((feat) => (
              <span
                key={feat}
                className="text-[10px] px-2 py-0.5 bg-graphite-850 text-neutral-300 border border-graphite-750 rounded font-medium"
              >
                {feat}
              </span>
            ))}
            {zone.features.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 text-neutral-400 font-medium">
                +{zone.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-graphite-800 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-bone-50">₹{zone.hourlyPrice}</span>
              <span className="text-xs text-neutral-400">/hr</span>
            </div>
            <div className="text-[11px] text-neutral-400">
              ₹{zone.dailyPrice} <span className="text-[10px]">/day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/parking/${zone.id}`}>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </Link>
            <Link to={`/booking/${zone.id}`}>
              <Button variant="primary" size="sm" disabled={!isAvailable}>
                Reserve
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
