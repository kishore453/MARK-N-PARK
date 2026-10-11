import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, MapPin, Eye, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

export default function HostParkingZonesPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchZones = async () => {
    try {
      const res = await api.get('/parking-zones');
      if (res?.data) {
        setZones(res.data);
      }
    } catch (err) {
      console.error('Failed to load host parking zones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleDeleteZone = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await api.delete(`/parking-zones/${id}`);
      await fetchZones();
    } catch (err) {
      alert(err.message || 'Failed to delete parking zone');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-800">
        <div>
          <span className="text-xs font-bold text-signal uppercase tracking-widest">
            HOST PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
            My Parking Zones
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure rates, location coordinates, amenities, and uploaded imagery
          </p>
        </div>

        <Link to="/host/parking-zones/new">
          <Button variant="primary" size="sm" icon={Plus}>
            Create New Parking Zone
          </Button>
        </Link>
      </div>

      {loading ? (
        <LoadingState message="Fetching your listed parking zones..." />
      ) : zones.length === 0 ? (
        <EmptyState
          title="No parking zones created"
          description="You haven't listed any parking zones yet. Turn your driveway or commercial lot into revenue."
          actionLabel="Create Parking Zone"
          onAction={() => window.location.href = '/host/parking-zones/new'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => {
            const photo = zone.photos && zone.photos.length > 0
              ? zone.photos[0]
              : 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={zone.id}
                className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden flex flex-col justify-between shadow-md hover:border-graphite-700 transition-all"
              >
                <div>
                  {/* 16:9 Image */}
                  <div className="relative aspect-video w-full bg-graphite-950">
                    <img
                      src={photo}
                      alt={zone.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-graphite-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-graphite-750">
                      {zone.totalCapacity} Total Bays
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-bold text-bone-50 line-clamp-1">{zone.name}</h3>
                    <p className="text-xs text-neutral-400 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-signal flex-shrink-0" />
                      <span>{zone.address}, {zone.city}</span>
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-neutral-300">
                      <span>Tariff: <strong className="text-bone-50">₹{zone.hourlyPrice}/hr</strong></span>
                      <span>Day: <strong className="text-bone-50">₹{zone.dailyPrice}/day</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-graphite-850 border-t border-graphite-800 flex items-center justify-between">
                  <Link to={`/parking/${zone.id}`} className="text-xs text-neutral-400 hover:text-bone-100 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link to={`/host/parking-zones/${zone.id}/edit`}>
                      <Button variant="outline" size="sm" icon={Edit2}>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      icon={Trash2}
                      onClick={() => handleDeleteZone(zone.id, zone.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
