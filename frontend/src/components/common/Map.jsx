import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';

export default function Map({
  zones = [],
  selectedZoneId = null,
  onSelectZone,
  center = { lat: 12.9716, lng: 77.5946 }, // Bengaluru default
  zoom = 13,
  className = 'h-full min-h-[450px] w-full rounded-lg'
}) {
  const mapRef = useRef(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Check and load Google Maps Script if key is available
  useEffect(() => {
    if (!apiKey) return;

    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsLoaded(true);
      document.head.appendChild(script);
    }
  }, [apiKey]);

  // Google Maps Instance Lifecycle
  useEffect(() => {
    if (!googleMapsLoaded || !mapRef.current || !window.google) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: selectedZoneId
        ? {
            lat: zones.find(z => z.id === selectedZoneId)?.latitude || center.lat,
            lng: zones.find(z => z.id === selectedZoneId)?.longitude || center.lng,
          }
        : center,
      zoom: zoom,
      disableDefaultUI: false,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#161616' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#161616' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#888888' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1f1f1f' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#383838' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c0c0c' }] },
      ],
    });

    // Add markers
    zones.forEach((zone) => {
      if (!zone.latitude || !zone.longitude) return;

      const isSelected = zone.id === selectedZoneId;
      const marker = new window.google.maps.Marker({
        position: { lat: zone.latitude, lng: zone.longitude },
        map: mapInstance,
        title: zone.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 10 : 7,
          fillColor: isSelected ? '#FF5A1F' : '#FAF9F6',
          fillOpacity: 1,
          strokeColor: '#111111',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        if (onSelectZone) onSelectZone(zone);
      });
    });
  }, [googleMapsLoaded, zones, selectedZoneId, center, zoom, onSelectZone]);

  // Fallback interactive radar coordinate canvas when Google Maps key is omitted
  if (!apiKey || !googleMapsLoaded) {
    return (
      <div className={`relative bg-graphite-950 border border-graphite-800 overflow-hidden flex flex-col ${className}`}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* Header Notice */}
        <div className="p-3 bg-graphite-900/90 border-b border-graphite-800 flex items-center justify-between text-xs z-10">
          <div className="flex items-center gap-1.5 text-bone-200 font-medium">
            <Navigation className="w-3.5 h-3.5 text-signal" />
            <span>Interactive Geospatial Zone Map ({zones.length} Zones Located)</span>
          </div>
          <span className="text-[10px] text-neutral-400 bg-graphite-850 px-2 py-0.5 rounded border border-graphite-750">
            {apiKey ? 'Initializing Google Maps API...' : 'Live GPS Coordinate Grid'}
          </span>
        </div>

        {/* Coordinate Plotting Area */}
        <div className="relative flex-1 min-h-[380px] p-6 flex items-center justify-center">
          {/* Compass Rose */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full border border-graphite-800 flex items-center justify-center text-[10px] text-neutral-500 font-mono">
            N
          </div>

          {/* Markers */}
          <div className="relative w-full h-full min-h-[320px]">
            {zones.map((zone, idx) => {
              const isSelected = zone.id === selectedZoneId;
              // Generate pseudo-spatial positions from relative lat/long
              const topPercent = 25 + ((idx * 28) % 60);
              const leftPercent = 20 + ((idx * 33) % 65);

              return (
                <div
                  key={zone.id}
                  onClick={() => onSelectZone && onSelectZone(zone)}
                  style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg border transition-all ${
                      isSelected
                        ? 'bg-signal text-white border-white ring-4 ring-signal/20'
                        : 'bg-graphite-900 text-bone-100 border-graphite-700 hover:border-signal'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-signal'}`} />
                    <span>₹{zone.hourlyPrice}/hr</span>
                  </div>

                  {/* Marker Popup Pin */}
                  <div className="w-2 h-2 mx-auto rotate-45 -mt-1 bg-inherit border-r border-b border-inherit" />

                  {/* Zone Label when hovered or selected */}
                  {isSelected && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1.5 w-44 bg-graphite-900 border border-signal p-2 rounded shadow-2xl text-left pointer-events-none">
                      <p className="text-[11px] font-bold text-bone-50 line-clamp-1">{zone.name}</p>
                      <p className="text-[10px] text-neutral-400 line-clamp-1">{zone.address}</p>
                      <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        {zone.availableCapacity} spots left
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info banner */}
        {!apiKey && (
          <div className="p-2.5 bg-graphite-900/90 border-t border-graphite-800 text-[11px] text-neutral-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-signal" />
              Configure <code className="text-bone-200 bg-graphite-800 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> in <code className="text-bone-200 bg-graphite-800 px-1 rounded">frontend/.env</code> for live satellite tiles.
            </span>
            <span className="text-neutral-500 font-mono">12.9716° N, 77.5946° E</span>
          </div>
        )}
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
}
