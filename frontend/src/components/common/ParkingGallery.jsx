import React, { useState } from 'react';

export default function ParkingGallery({ photos = [], name = 'Parking Zone' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayPhotos = photos && photos.length > 0
    ? photos
    : ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="space-y-3">
      {/* Main 16:9 Image */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-graphite-950 border border-graphite-800 shadow-lg">
        <img
          src={displayPhotos[activeIndex] || displayPhotos[0]}
          alt={`${name} photo ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {displayPhotos.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md text-xs font-semibold text-white border border-white/20">
            {activeIndex + 1} / {displayPhotos.length}
          </div>
        )}
      </div>

      {/* Thumbnails (Max 2) */}
      {displayPhotos.length > 1 && (
        <div className="grid grid-cols-2 gap-3">
          {displayPhotos.map((photo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-video rounded overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? 'border-signal ring-2 ring-signal/20'
                  : 'border-graphite-800 hover:border-graphite-700 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={photo}
                alt={`${name} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
