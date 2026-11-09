import React, { useState } from 'react';
import { BEFORE_AFTER_GALLERY } from '../data/services';
import { Sparkles, Star, CheckCircle2, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export const BeforeAfterGallery: React.FC = () => {
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({
    '1': 50,
    '2': 50,
    '3': 50,
  });

  const handleSliderChange = (id: string, val: number) => {
    setSliderPositions((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <div className="space-y-10 py-8">
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-yellow-300/10 text-yellow-300 border border-yellow-300/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
            Showroom Transformation Gallery
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-white mt-2">
          Interactive Before & After Results
        </h2>
        <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
          Drag the interactive slider to compare paint correction, interior steam extraction, and ceramic coating gloss transformations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {BEFORE_AFTER_GALLERY.map((item) => {
          const pos = sliderPositions[item.id] || 50;

          return (
            <div
              key={item.id}
              className="bg-[#0f0f13] rounded-3xl border border-zinc-800 p-5 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-300">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{item.title}</h3>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Interactive Image Comparison Box */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden select-none border border-zinc-700/80">
                {/* AFTER image (base layer) */}
                <img
                  src={item.afterUrl}
                  alt={`${item.title} After`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-lime-400 backdrop-blur-md text-black font-extrabold text-[10px] uppercase tracking-wider z-10 shadow-md">
                  AFTER
                </span>

                {/* BEFORE image (clipped layer) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${pos}%` }}
                >
                  <img
                    src={item.beforeUrl}
                    alt={`${item.title} Before`}
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-zinc-200 font-extrabold text-[10px] uppercase tracking-wider z-10">
                    BEFORE
                  </span>
                </div>

                {/* Vertical Divider line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-yellow-300 shadow-lg pointer-events-none z-20"
                  style={{ left: `${pos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-yellow-300 text-black flex items-center justify-center shadow-lg font-bold">
                    <ArrowRightLeft className="w-4 h-4 text-black" />
                  </div>
                </div>

                {/* Slider Input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pos}
                  onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <span>← Drag to compare</span>
                <span className="text-lime-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Guaranteed</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        <div className="p-5 rounded-2xl bg-[#0f0f13] border border-zinc-800 text-center">
          <span className="text-3xl font-black text-yellow-300">1,400+</span>
          <span className="block text-xs text-zinc-400 mt-1 font-medium">Vehicles Detailed</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0f0f13] border border-zinc-800 text-center flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1 py-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            ))}
          </div>
          <span className="block text-xs text-zinc-400 mt-1 font-medium">Google Reviews</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0f0f13] border border-zinc-800 text-center">
          <span className="text-3xl font-black text-yellow-300">100%</span>
          <span className="block text-xs text-zinc-400 mt-1 font-medium">Google Wallet Ready</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0f0f13] border border-zinc-800 text-center">
          <span className="text-3xl font-black text-lime-400">3 Years</span>
          <span className="block text-xs text-zinc-400 mt-1 font-medium">Ceramic Coating Warranty</span>
        </div>
      </div>
    </div>
  );
};
