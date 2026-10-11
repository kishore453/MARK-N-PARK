import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, List, Compass, Filter } from 'lucide-react';
import api from '../../services/api';
import SearchFilters from '../../components/search/SearchFilters';
import ParkingCard from '../../components/common/ParkingCard';
import Map from '../../components/common/Map';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || searchParams.get('city') || '',
    date: searchParams.get('date') || new Date().toISOString().split('T')[0],
    startTime: searchParams.get('startTime') || '09:00',
    endTime: searchParams.get('endTime') || '18:00',
    bookingType: searchParams.get('bookingType') || 'HOURLY',
    maxPrice: Number(searchParams.get('maxPrice')) || 150,
    features: searchParams.getAll('features') || [],
  });

  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [mobileTab, setMobileTab] = useState('list'); // 'list' or 'map'

  const fetchZones = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.date) params.append('date', filters.date);
      if (filters.startTime) params.append('startTime', filters.startTime);
      if (filters.endTime) params.append('endTime', filters.endTime);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.features && filters.features.length > 0) {
        filters.features.forEach((f) => params.append('features', f));
      }

      const res = await api.get(`/parking-zones/search?${params.toString()}`);
      if (res?.data) {
        setZones(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to search parking zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleResetFilters = () => {
    const defaultFilters = {
      location: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '18:00',
      bookingType: 'HOURLY',
      maxPrice: 150,
      features: [],
    };
    setFilters(defaultFilters);
    setSearchParams({});
    fetchZones();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Filter Bar */}
      <SearchFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        onApply={fetchZones}
      />

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden bg-graphite-900 p-1 rounded-md border border-graphite-800">
        <button
          type="button"
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-2 text-xs font-semibold rounded flex items-center justify-center gap-2 ${
            mobileTab === 'list'
              ? 'bg-signal text-white'
              : 'text-neutral-400 hover:text-bone-100'
          }`}
        >
          <List className="w-4 h-4" />
          List View ({zones.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('map')}
          className={`flex-1 py-2 text-xs font-semibold rounded flex items-center justify-center gap-2 ${
            mobileTab === 'map'
              ? 'bg-signal text-white'
              : 'text-neutral-400 hover:text-bone-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Map View
        </button>
      </div>

      {/* Main Split Layout: 55% List / 45% Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: 55% (col-span-7) */}
        <div className={`space-y-4 lg:col-span-7 ${mobileTab === 'map' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between text-xs text-neutral-400 pb-1">
            <span>
              Showing <strong className="text-bone-50">{zones.length}</strong> available parking zones
            </span>
            {filters.location && (
              <span className="text-signal font-semibold">Near "{filters.location}"</span>
            )}
          </div>

          {loading ? (
            <LoadingState message="Scanning live inventory and calculated occupancy..." />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchZones} />
          ) : zones.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="Nothing matched your search"
              description="No parking zones matched your current filters or location criteria. Try widening your price range or adjusting requested hours."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {zones.map((zone) => (
                <ParkingCard
                  key={zone.id}
                  zone={zone}
                  isSelected={zone.id === selectedZoneId}
                  onMouseEnter={() => setSelectedZoneId(zone.id)}
                  onMouseLeave={() => setSelectedZoneId(null)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: 45% (col-span-5) Sticky Map */}
        <div className={`lg:col-span-5 lg:sticky lg:top-24 ${mobileTab === 'list' ? 'hidden lg:block' : 'block'}`}>
          <Map
            zones={zones}
            selectedZoneId={selectedZoneId}
            onSelectZone={(zone) => setSelectedZoneId(zone.id)}
            className="w-full h-[600px] rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
