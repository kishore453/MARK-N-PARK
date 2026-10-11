import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Eye, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';

export default function AdminZonesPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchZones = async () => {
    try {
      const res = await api.get('/admin/parking-zones');
      if (res?.data) {
        setZones(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin zones', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/admin/parking-zones/${id}/toggle-status`);
      await fetchZones();
    } catch (err) {
      alert(err.message || 'Failed to toggle zone status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-800">
        <div>
          <span className="text-xs font-bold text-signal uppercase tracking-widest">
            ADMINISTRATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
            Parking Zones Master Registry
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Global inventory of facilities, capacity distribution, and operational state
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading parking zones registry..." />
      ) : (
        <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-graphite-850 border-b border-graphite-800 text-[10px] text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Zone / Address</th>
                  <th className="py-3 px-4 font-semibold">City</th>
                  <th className="py-3 px-4 font-semibold">Host</th>
                  <th className="py-3 px-4 font-semibold">Tariff</th>
                  <th className="py-3 px-4 font-semibold">Total Bays</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-800">
                {zones.map((z) => (
                  <tr key={z.id} className="hover:bg-graphite-850/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-bone-50">{z.name}</div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-signal" /> {z.address}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-bone-200">{z.city}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-bone-100">{z.hostName || 'Host'}</div>
                      <div className="text-[10px] text-neutral-400">{z.hostPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-bone-100">₹{z.hourlyPrice}/hr</div>
                      <div className="text-[10px] text-neutral-400">₹{z.dailyPrice}/day</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{z.totalCapacity} Slots</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(z.id)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          z.active
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {z.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {z.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/parking/${z.id}`}>
                        <Button variant="outline" size="sm" icon={Eye}>
                          Preview
                        </Button>
                      </Link>
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
