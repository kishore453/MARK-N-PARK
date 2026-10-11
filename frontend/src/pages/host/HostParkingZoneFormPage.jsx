import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Trash2, MapPin, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';

const ALL_FEATURES = [
  'Covered',
  'CCTV',
  'Security',
  'EV Charging',
  'Lighting',
  'Accessible Parking',
  '24/7 Access',
];

export default function HostParkingZoneFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [latitude, setLatitude] = useState('12.9716');
  const [longitude, setLongitude] = useState('77.5946');
  const [hourlyPrice, setHourlyPrice] = useState('50');
  const [dailyPrice, setDailyPrice] = useState('400');
  const [totalCapacity, setTotalCapacity] = useState('10');
  const [features, setFeatures] = useState(['CCTV', 'Security', '24/7 Access']);
  const [photos, setPhotos] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchZone = async () => {
        try {
          const res = await api.get(`/parking-zones/${id}`);
          if (res?.data) {
            const z = res.data;
            setName(z.name || '');
            setDescription(z.description || '');
            setAddress(z.address || '');
            setCity(z.city || 'Bengaluru');
            setLatitude(z.latitude?.toString() || '12.9716');
            setLongitude(z.longitude?.toString() || '77.5946');
            setHourlyPrice(z.hourlyPrice?.toString() || '50');
            setDailyPrice(z.dailyPrice?.toString() || '400');
            setTotalCapacity(z.totalCapacity?.toString() || '10');
            setFeatures(z.features || []);
            setPhotos(z.photos || []);
          }
        } catch (err) {
          setError(err.message || 'Failed to load parking zone');
        } finally {
          setLoading(false);
        }
      };

      fetchZone();
    }
  }, [id, isEditing]);

  const toggleFeature = (feat) => {
    if (features.includes(feat)) {
      setFeatures(features.filter((f) => f !== feat));
    } else {
      setFeatures([...features, feat]);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photos.length >= 2) {
      alert('Maximum 2 photos permitted per parking zone. Please remove an existing photo first.');
      return;
    }

    setUploadingPhoto(true);
    try {
      if (isEditing) {
        // Direct API upload
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post(`/parking-zones/${id}/photos`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res?.data?.photos) {
          setPhotos(res.data.photos);
        }
      } else {
        // Preview local Base64 for new zone before saving
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      alert(err.message || 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = (photoIndex) => {
    setPhotos(photos.filter((_, idx) => idx !== photoIndex));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        address: address.trim(),
        city: city.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        hourlyPrice: parseFloat(hourlyPrice),
        dailyPrice: parseFloat(dailyPrice),
        totalCapacity: parseInt(totalCapacity, 10),
        features,
        photos: photos.slice(0, 2), // strictly max 2 photos
      };

      if (isEditing) {
        await api.put(`/parking-zones/${id}`, payload);
      } else {
        await api.post('/parking-zones', payload);
      }

      navigate('/host/parking-zones');
    } catch (err) {
      setError(err.message || 'Failed to save parking zone');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingState message="Loading parking zone configuration..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-signal uppercase tracking-widest">
          {isEditing ? 'UPDATE FACILITY' : 'NEW FACILITY REGISTRATION'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
          {isEditing ? 'Edit Parking Zone' : 'List a New Parking Zone'}
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configure rates, capacity, features, GPS coordinates, and photos (maximum 2 photos)
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg flex items-center gap-2 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-graphite-900 border border-graphite-800 rounded-lg p-6 space-y-6">
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-bone-50 pb-2 border-b border-graphite-800">
            Facility Identity
          </h3>

          <Input
            label="Parking Zone Name"
            placeholder="e.g. Indiranagar Metro Transit Hub"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-bone-200 uppercase tracking-wider">
              Description <span className="text-signal">*</span>
            </label>
            <textarea
              rows={3}
              required
              className="w-full bg-graphite-850 text-bone-50 border border-graphite-700 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-signal focus:border-signal"
              placeholder="Detailed description of facility access, boom barriers, security, and instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Location & GPS */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-bone-50 pb-2 border-b border-graphite-800">
            Location & Geospatial Coordinates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Street Address"
              placeholder="e.g. 100 Feet Road, HAL 2nd Stage"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <Input
              label="City"
              placeholder="e.g. Bengaluru"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="any"
              placeholder="12.9716"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />

            <Input
              label="Longitude"
              type="number"
              step="any"
              placeholder="77.5946"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Tariffs & Capacity */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-bone-50 pb-2 border-b border-graphite-800">
            Pricing & Bay Capacity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Hourly Tariff (₹)"
              type="number"
              min="1"
              value={hourlyPrice}
              onChange={(e) => setHourlyPrice(e.target.value)}
              required
            />

            <Input
              label="Daily Tariff (₹)"
              type="number"
              min="1"
              value={dailyPrice}
              onChange={(e) => setDailyPrice(e.target.value)}
              required
            />

            <Input
              label="Total Bay Capacity (Slots)"
              type="number"
              min="1"
              value={totalCapacity}
              onChange={(e) => setTotalCapacity(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Features selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-bone-50 pb-2 border-b border-graphite-800">
            Verified Facility Features
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ALL_FEATURES.map((feat) => {
              const isChecked = features.includes(feat);
              return (
                <button
                  key={feat}
                  type="button"
                  onClick={() => toggleFeature(feat)}
                  className={`flex items-center gap-2 p-2.5 rounded border text-xs font-semibold text-left transition-all ${
                    isChecked
                      ? 'bg-signal/20 border-signal text-signal'
                      : 'bg-graphite-850 border-graphite-750 text-neutral-300 hover:border-graphite-600'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-signal' : 'text-neutral-500'}`} />
                  <span>{feat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Upload: Maximum 2 Photos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-graphite-800">
            <h3 className="text-sm font-bold text-bone-50">
              Facility Imagery (Max 2 Photos)
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              {photos.length} / 2 photos uploaded
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {photos.map((photoUrl, idx) => (
              <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-graphite-750 bg-graphite-950">
                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded hover:bg-red-700 transition-colors"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {photos.length < 2 && (
              <label className="relative aspect-video rounded-lg border-2 border-dashed border-graphite-700 hover:border-signal flex flex-col items-center justify-center p-4 cursor-pointer transition-colors bg-graphite-850/50">
                <Upload className="w-6 h-6 text-signal mb-1" />
                <span className="text-xs font-semibold text-bone-100">
                  {uploadingPhoto ? 'Uploading...' : 'Upload Parking Photo'}
                </span>
                <span className="text-[10px] text-neutral-500 mt-0.5">JPEG, PNG, WebP up to 5MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploadingPhoto}
                  onChange={handlePhotoUpload}
                />
              </label>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-graphite-800 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/host/parking-zones')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={submitting}
            icon={ArrowRight}
          >
            {isEditing ? 'Save Changes' : 'Publish Parking Zone'}
          </Button>
        </div>
      </form>
    </div>
  );
}
