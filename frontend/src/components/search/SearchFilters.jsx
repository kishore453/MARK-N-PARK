import React from 'react';
import { Search, Calendar, Clock, DollarSign, Filter, RotateCcw } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const ALL_FEATURES = [
  'Covered',
  'CCTV',
  'Security',
  'EV Charging',
  'Lighting',
  'Accessible Parking',
  '24/7 Access'
];

export default function SearchFilters({
  filters,
  onChange,
  onReset,
  onApply
}) {
  const handleFeatureToggle = (feature) => {
    const current = filters.features || [];
    const updated = current.includes(feature)
      ? current.filter(f => f !== feature)
      : [...current, feature];
    onChange({ ...filters, features: updated });
  };

  return (
    <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4 space-y-4 shadow-md">
      {/* Search Header & Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Location Query */}
        <Input
          label="Location or City"
          icon={Search}
          placeholder="e.g. Indiranagar, Bengaluru"
          value={filters.location || ''}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
        />

        {/* Date Selector */}
        <Input
          label="Parking Date"
          type="date"
          icon={Calendar}
          value={filters.date || ''}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => onChange({ ...filters, date: e.target.value })}
        />

        {/* Start Time */}
        <Input
          label="Start Time"
          type="time"
          icon={Clock}
          value={filters.startTime || ''}
          onChange={(e) => onChange({ ...filters, startTime: e.target.value })}
        />

        {/* End Time */}
        <Input
          label="End Time"
          type="time"
          icon={Clock}
          value={filters.endTime || ''}
          onChange={(e) => onChange({ ...filters, endTime: e.target.value })}
        />
      </div>

      {/* Row 2: Booking Type & Max Price */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-graphite-800">
        {/* Booking Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-bone-200 uppercase tracking-wider">Type:</span>
          <div className="flex bg-graphite-850 p-0.5 rounded border border-graphite-750">
            <button
              type="button"
              onClick={() => onChange({ ...filters, bookingType: 'HOURLY' })}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                filters.bookingType === 'HOURLY'
                  ? 'bg-signal text-white'
                  : 'text-neutral-400 hover:text-bone-100'
              }`}
            >
              Hourly
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...filters, bookingType: 'DAILY' })}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                filters.bookingType === 'DAILY'
                  ? 'bg-signal text-white'
                  : 'text-neutral-400 hover:text-bone-100'
              }`}
            >
              Daily
            </button>
          </div>
        </div>

        {/* Max Hourly Price Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-bone-200 uppercase tracking-wider">
            Max Price:
          </span>
          <span className="text-xs font-bold text-signal">₹{filters.maxPrice || 150}/hr</span>
          <input
            type="range"
            min="30"
            max="300"
            step="10"
            value={filters.maxPrice || 150}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-28 sm:w-36 accent-signal cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onReset}>
            Reset
          </Button>
          <Button variant="primary" size="sm" icon={Filter} onClick={onApply}>
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Row 3: Feature Check-pills */}
      <div className="space-y-1.5 pt-2 border-t border-graphite-800">
        <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
          Required Amenities & Features:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_FEATURES.map((feature) => {
            const isSelected = (filters.features || []).includes(feature);
            return (
              <button
                key={feature}
                type="button"
                onClick={() => handleFeatureToggle(feature)}
                className={`text-xs px-2.5 py-1 rounded-sm border transition-all ${
                  isSelected
                    ? 'bg-signal/20 border-signal text-signal font-semibold'
                    : 'bg-graphite-850 border-graphite-750 text-neutral-300 hover:border-graphite-600'
                }`}
              >
                {feature}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
