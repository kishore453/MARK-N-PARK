import React, { useState, useEffect } from 'react';
import { Car, Plus, Trash2, Edit2, Shield, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleType, setVehicleType] = useState('CAR');
  const [submitting, setSubmitting] = useState(false);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      if (res?.data) {
        setVehicles(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openAddModal = () => {
    setEditingVehicle(null);
    setVehicleNumber('');
    setVehicleName('');
    setVehicleType('CAR');
    setModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleNumber(vehicle.vehicleNumber);
    setVehicleName(vehicle.vehicleName);
    setVehicleType(vehicle.vehicleType);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleNumber.trim() || !vehicleName.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        vehicleName: vehicleName.trim(),
        vehicleType,
      };

      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, payload);
      } else {
        await api.post('/vehicles', payload);
      }

      setModalOpen(false);
      await fetchVehicles();
    } catch (err) {
      setError(err.message || 'Failed to save vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      await fetchVehicles();
    } catch (err) {
      alert(err.message || 'Failed to delete vehicle');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-800">
        <div>
          <span className="text-xs font-bold text-signal uppercase tracking-widest">
            SEEKER GARAGE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
            Registered Vehicles
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your personal automobiles and license plates for instant parking spot access
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={openAddModal}>
          Add Vehicle
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800 rounded text-xs text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingState message="Loading vehicle registry..." />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No vehicles in garage"
          description="Register your vehicle details once so you can quickly book parking slots anywhere in the city."
          actionLabel="Add Your First Vehicle"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-graphite-900 border border-graphite-800 rounded-lg p-5 space-y-3 relative group hover:border-graphite-750 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 bg-graphite-850 border border-graphite-750 text-neutral-300 rounded font-bold uppercase tracking-wider">
                  {v.vehicleType}
                </span>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(v)}
                    className="p-1 text-neutral-400 hover:text-bone-50 transition-colors"
                    title="Edit vehicle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
                    title="Remove vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-bone-50">{v.vehicleName}</h3>
                <div className="inline-block mt-2 px-3 py-1 bg-graphite-950 border border-graphite-800 rounded font-mono text-sm font-bold tracking-widest text-signal">
                  {v.vehicleNumber}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingVehicle ? 'Edit Vehicle Details' : 'Register New Vehicle'}
        subtitle="Used for parking permit generation and boom barrier recognition"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Registration Number"
            placeholder="e.g. KA01MJ4029"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            required
          />

          <Input
            label="Make & Model"
            placeholder="e.g. Hyundai Creta, Honda City"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            required
          />

          <Select
            label="Vehicle Category"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="CAR">Car / Sedan / Hatchback</option>
            <option value="SUV">SUV / Compact SUV</option>
            <option value="BIKE">Two-Wheeler (Motorcycle / Scooter)</option>
            <option value="EV">Electric Vehicle (EV)</option>
          </Select>

          <div className="pt-2 flex justify-end gap-3 border-t border-graphite-800">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={submitting}>
              {editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
