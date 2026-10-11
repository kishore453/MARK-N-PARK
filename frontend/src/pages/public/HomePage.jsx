import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ShieldCheck, ArrowRight, Clock, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import ParkingCard from '../../components/common/ParkingCard';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';

export default function HomePage() {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/parking-zones');
        if (res?.data) {
          setZones(res.data.slice(0, 3));
        }
      } catch (err) {
        console.warn('Could not load featured parking zones:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      navigate(`/search?location=${encodeURIComponent(searchLocation.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="w-full space-y-20 lg:space-y-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-graphite-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Editorial Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-graphite-850 border border-graphite-750 text-xs font-semibold text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-signal" />
                PEER-TO-PEER URBAN PARKING INFRASTRUCTURE
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-bone-50 tracking-tight leading-[1.05]">
                Find. <br />
                Reserve. <br />
                <span className="text-signal">Park.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 max-w-xl leading-relaxed">
                India's modern mobility exchange connecting drivers with verified private bays, corporate slots, and transit hubs. Lock in your spot in 60 seconds with a 25% advance.
              </p>

              {/* Interactive Search Bar */}
              <form onSubmit={handleHeroSearch} className="max-w-xl bg-graphite-900 p-2 rounded-lg border border-graphite-750 shadow-2xl flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative flex items-center">
                  <MapPin className="w-5 h-5 text-signal ml-3 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Enter locality, transit hub or city (e.g. Indiranagar)"
                    className="w-full bg-transparent text-sm text-bone-50 placeholder:text-neutral-500 py-2.5 focus:outline-none"
                  />
                </div>
                <Button type="submit" variant="primary" size="md" icon={Search}>
                  Find Parking
                </Button>
              </form>

              {/* Secondary CTA row */}
              <div className="flex items-center gap-6 pt-2 text-xs text-neutral-400">
                <span>Looking to host your property?</span>
                <Link to="/register?role=HOST" className="text-signal hover:underline font-semibold flex items-center gap-1">
                  List Your Parking Zone <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Visual Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-graphite-750 shadow-2xl bg-graphite-950">
                <img
                  src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80"
                  alt="Urban mobility parking infrastructure"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-transparent to-transparent opacity-80" />
                
                {/* Overlay Metric Floating Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-graphite-900/90 backdrop-blur-md p-4 rounded border border-graphite-750 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Live Inventory</span>
                    <p className="text-sm font-bold text-bone-50">Bengaluru Metro Corridor</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                    45+ Guaranteed Bays
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-xs font-bold text-signal uppercase tracking-widest">
            ENGINEERED FOR URBAN FLOW
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-bone-50">
            Why Drivers Rely on MARK N PARK
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400">
            Eliminate circling busy blocks and unreliable roadside meters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-graphite-900 border border-graphite-800 p-6 rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-graphite-800 border border-graphite-700 flex items-center justify-center text-signal">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-bone-50">Find Convenient Parking</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Discover real-time parking zones within walking distance of commercial plazas, transit hubs, and events.
            </p>
          </div>

          <div className="bg-graphite-900 border border-graphite-800 p-6 rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-graphite-800 border border-graphite-700 flex items-center justify-center text-signal">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-bone-50">Reserve Before You Arrive</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Book hourly or daily time slots in advance with concurrency-locked capacity checking. Your bay is guaranteed.
            </p>
          </div>

          <div className="bg-graphite-900 border border-graphite-800 p-6 rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-graphite-800 border border-graphite-700 flex items-center justify-center text-signal">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-bone-50">Pay Securely</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pay 25% advance online via Razorpay to lock your booking. Pay the remaining 75% balance when you arrive.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 STEPS) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border border-graphite-800 bg-graphite-900/60 rounded-xl p-8 lg:p-12 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold text-signal uppercase tracking-widest">
                STREAMLINED JOURNEY
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-bone-50 mt-1">
                How MARK N PARK Operates
              </h3>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm">
              Three transparent steps to frictionless parking anywhere in the city.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="space-y-3">
              <span className="text-3xl font-extrabold text-signal">01</span>
              <h4 className="text-lg font-bold text-bone-50">Find</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Enter your destination and parking schedule to explore nearby verified parking zones on the interactive map.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <span className="text-3xl font-extrabold text-signal">02</span>
              <h4 className="text-lg font-bold text-bone-50">Reserve</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Choose your vehicle, review transparent pricing, and pay a 25% advance online to instantly lock your bay.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <span className="text-3xl font-extrabold text-signal">03</span>
              <h4 className="text-lg font-bold text-bone-50">Park</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Drive straight to the facility with GPS guidance, park in your designated slot, and settle the 75% balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DISCOVERY SECTION (CURATED ZONES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold text-signal uppercase tracking-widest">
              DISCOVER HUBS
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-bone-50 mt-1">
              Featured Parking Zones
            </h3>
          </div>
          <Link to="/search">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              Explore All Zones
            </Button>
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Fetching live parking availability..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zones.map((zone) => (
              <ParkingCard key={zone.id} zone={zone} />
            ))}
          </div>
        )}
      </section>

      {/* 5. HOST CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-graphite-900 via-graphite-850 to-graphite-900 border border-graphite-750 rounded-xl p-8 lg:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-signal uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Partner with MARK N PARK
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-bone-50 tracking-tight">
              Turn unused parking into income.
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Monetize spare driveways, commercial basements, or secure lots. Manage capacity, set hourly and daily tariffs, and accept reservations seamlessly.
            </p>
            <div className="pt-2">
              <Link to="/register?role=HOST">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  List Your Parking Zone
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
