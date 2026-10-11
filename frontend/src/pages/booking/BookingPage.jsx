import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Car, Shield, Plus, ArrowRight, AlertCircle, Check } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function BookingPage() {
  const { parkingZoneId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [zone, setZone] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [bookingType, setBookingType] = useState('HOURLY');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [vehicleId, setVehicleId] = useState('');

  // Add Vehicle Modal
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicleNumber, setNewVehicleNumber] = useState('');
  const [newVehicleName, setNewVehicleName] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('CAR');
  const [addingVehicle, setAddingVehicle] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zoneRes, vehiclesRes] = await Promise.all([
          api.get(`/parking-zones/${parkingZoneId}`),
          api.get('/vehicles'),
        ]);

        if (zoneRes?.data) setZone(zoneRes.data);
        if (vehiclesRes?.data) {
          setVehicles(vehiclesRes.data);
          if (vehiclesRes.data.length > 0) {
            setVehicleId(vehiclesRes.data[0].id);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load booking information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parkingZoneId]);

  // Handle Quick Add Vehicle
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!newVehicleNumber.trim() || !newVehicleName.trim()) return;

    setAddingVehicle(true);
    try {
      const res = await api.post('/vehicles', {
        vehicleNumber: newVehicleNumber.trim().toUpperCase(),
        vehicleName: newVehicleName.trim(),
        vehicleType: newVehicleType,
      });

      if (res?.data) {
        setVehicles([...vehicles, res.data]);
        setVehicleId(res.data.id);
        setShowAddVehicleModal(false);
        setNewVehicleNumber('');
        setNewVehicleName('');
      }
    } catch (err) {
      alert(err.message || 'Failed to add vehicle');
    } finally {
      setAddingVehicle(false);
    }
  };

  // Approximate Estimated Calculation for Real-time Feedback (Backend guarantees final amounts)
  const calculateEstimatedTotals = () => {
    if (!zone) return { total: 0, advance: 0, remaining: 0, duration: 0 };

    if (bookingType === 'DAILY') {
      const total = zone.dailyPrice || 0;
      const advance = Math.round(total * 0.25 * 100) / 100;
      const remaining = Math.round((total - advance) * 100) / 100;
      return { total, advance, remaining, duration: '24 Hours (Full Day)' };
    }

    // Hourly
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    let diffHours = (endH + endM / 60) - (startH + startM / 60);
    if (diffHours <= 0) diffHours = 1;
    diffHours = Math.ceil(diffHours);

    const total = diffHours * (zone.hourlyPrice || 0);
    const advance = Math.round(total * 0.25 * 100) / 100;
    const remaining = Math.round((total - advance) * 100) / 100;
    return { total, advance, remaining, duration: `${diffHours} Hour${diffHours > 1 ? 's' : ''}` };
  };

  const totals = calculateEstimatedTotals();

  // Submit Reservation
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!vehicleId) {
      setError('Please select or add a vehicle before booking.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const payload = {
        parkingZoneId,
        vehicleId,
        bookingType,
        date,
        startTime,
        endTime,
      };

      const res = await api.post('/reservations', payload);
      if (res?.data) {
        // Navigate to payment page
        navigate(`/payment/${res.data.id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create reservation. The slot may be fully booked.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingState message="Configuring booking interface..." />
      </div>
    );
  }

  if (error && !zone) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <span className="text-xs font-bold text-signal uppercase tracking-widest">
          STEP 1 OF 3: RESERVATION DETAILS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
          Reserve Parking Slot
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          {zone?.name} • {zone?.address}, {zone?.city}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-lg flex items-start gap-3 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Breakdown on Right */}
      <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: col-span-7 */}
        <div className="lg:col-span-7 bg-graphite-900 border border-graphite-800 rounded-lg p-6 space-y-6">
          {/* Booking Type Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-bone-200 uppercase tracking-wider block">
              Reservation Frequency
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBookingType('HOURLY')}
                className={`py-3 px-4 rounded border text-xs font-bold text-left transition-all ${
                  bookingType === 'HOURLY'
                    ? 'bg-signal/15 border-signal text-signal'
                    : 'bg-graphite-850 border-graphite-750 text-neutral-300 hover:border-graphite-600'
                }`}
              >
                <div className="font-extrabold">HOURLY BOOKING</div>
                <div className="text-[11px] font-normal opacity-80 mt-0.5">₹{zone.hourlyPrice}/hr • Flexible hours</div>
              </button>

              <button
                type="button"
                onClick={() => setBookingType('DAILY')}
                className={`py-3 px-4 rounded border text-xs font-bold text-left transition-all ${
                  bookingType === 'DAILY'
                    ? 'bg-signal/15 border-signal text-signal'
                    : 'bg-graphite-850 border-graphite-750 text-neutral-300 hover:border-graphite-600'
                }`}
              >
                <div className="font-extrabold">FULL DAY PASS</div>
                <div className="text-[11px] font-normal opacity-80 mt-0.5">₹{zone.dailyPrice}/day • 24hr access</div>
              </button>
            </div>
          </div>

          {/* Date Picker */}
          <Input
            label="Parking Date"
            type="date"
            icon={Calendar}
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              icon={Clock}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input
              label="End Time"
              type="time"
              icon={Clock}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-bone-200 uppercase tracking-wider block">
                Select Your Vehicle <span className="text-signal">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAddVehicleModal(true)}
                className="text-xs text-signal hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add New Vehicle
              </button>
            </div>

            {vehicles.length === 0 ? (
              <div className="p-4 bg-graphite-850 border border-graphite-750 rounded text-center space-y-2">
                <p className="text-xs text-neutral-400">No vehicle registered under your account yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={() => setShowAddVehicleModal(true)}
                >
                  Register Vehicle
                </Button>
              </div>
            ) : (
              <Select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                required
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} className="bg-graphite-900">
                    {v.vehicleName} ({v.vehicleNumber}) - {v.vehicleType}
                  </option>
                ))}
              </Select>
            )}
          </div>
        </div>

        {/* Right Column: Pricing Breakdown & 25% Advance Lock (col-span-5) */}
        <div className="lg:col-span-5 bg-graphite-900 border border-graphite-800 rounded-lg p-6 space-y-6">
          <h3 className="text-base font-bold text-bone-50 pb-3 border-b border-graphite-800">
            Booking & Tariff Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-neutral-300">
              <span>Duration</span>
              <span className="font-semibold text-bone-50">{totals.duration}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Tariff Rate</span>
              <span className="font-semibold text-bone-50">
                {bookingType === 'HOURLY' ? `₹${zone.hourlyPrice} / hr` : `₹${zone.dailyPrice} / day`}
              </span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Gross Total Amount</span>
              <span className="font-semibold text-bone-50">₹{totals.total}</span>
            </div>

            {/* Split Breakdown */}
            <div className="pt-3 border-t border-graphite-800 space-y-2">
              <div className="p-3 bg-signal/10 border border-signal/30 rounded flex justify-between items-center text-signal font-bold">
                <div>
                  <span className="text-xs">25% Advance to Confirm</span>
                  <p className="text-[10px] font-normal opacity-90">Pay online via Razorpay</p>
                </div>
                <span className="text-base">₹{totals.advance}</span>
              </div>

              <div className="p-3 bg-graphite-850 border border-graphite-750 rounded flex justify-between items-center text-neutral-300">
                <div>
                  <span className="text-xs font-semibold">75% Balance on Arrival</span>
                  <p className="text-[10px] text-neutral-400">Pay directly when parking</p>
                </div>
                <span className="text-sm font-bold text-bone-100">₹{totals.remaining}</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={submitting}
            icon={ArrowRight}
          >
            Proceed to Advance Payment (₹{totals.advance})
          </Button>

          <p className="text-[11px] text-neutral-500 text-center leading-relaxed">
            By proceeding, you agree to MARK N PARK's parking code of conduct and facility rules.
          </p>
        </div>
      </form>

      {/* Quick Add Vehicle Modal */}
      <Modal
        isOpen={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        title="Add Vehicle to Garage"
        subtitle="Register your car, bike, or EV for immediate parking allocation"
      >
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <Input
            label="Vehicle Registration Number"
            placeholder="e.g. KA01MJ4029"
            value={newVehicleNumber}
            onChange={(e) => setNewVehicleNumber(e.target.value)}
            required
          />

          <Input
            label="Make & Model"
            placeholder="e.g. Hyundai Creta, Honda City"
            value={newVehicleName}
            onChange={(e) => setNewVehicleName(e.target.value)}
            required
          />

          <Select
            label="Vehicle Classification"
            value={newVehicleType}
            onChange={(e) => setNewVehicleType(e.target.value)}
          >
            <option value="CAR">Sedan / Hatchback (CAR)</option>
            <option value="SUV">SUV / Compact SUV</option>
            <option value="BIKE">Two-Wheeler (BIKE)</option>
            <option value="EV">Electric Vehicle (EV)</option>
          </Select>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setShowAddVehicleModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={addingVehicle}>
              Save Vehicle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
