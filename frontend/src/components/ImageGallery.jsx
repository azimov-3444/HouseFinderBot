import React, { useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const ImageGallery = ({ images = [] }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  // Fallback if no images
  const safeImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'
  ];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Image Viewer */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-100 rounded-3xl group shadow-sm">
        <img
          src={safeImages[activeIdx]}
          alt={`Mulk rasmi ${activeIdx + 1}`}
          className="h-full w-full object-cover transition-all duration-500 animate-in fade-in zoom-in-95"
        />

        {/* Arrow Navigation */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-primary-900 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 active:scale-90 transition-all duration-200"
            >
              <IoChevronBack className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-primary-900 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 active:scale-90 transition-all duration-200"
            >
              <IoChevronForward className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute right-4 bottom-4 px-3.5 py-1.5 rounded-xl bg-slate-900/75 backdrop-blur-sm text-white text-xs font-bold shadow-md">
          {activeIdx + 1} / {safeImages.length}
        </div>
      </div>

      {/* Thumbnails list */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-1 scroll-smooth shrink-0 no-scrollbar">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-[4/3] w-24 sm:w-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border-2 transition-all ${
                activeIdx === idx
                  ? 'border-primary-600 scale-95 ring-2 ring-primary-100'
                  : 'border-transparent hover:border-slate-350 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
