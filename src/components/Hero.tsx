import React from 'react';
import { Calendar, Wallet, ShieldCheck, Sparkles, Star, MapPin, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onStartBooking: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartBooking, onExploreServices }) => {
  return (
    <div className="relative w-full overflow-hidden bg-[#050505] text-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Full-bleed background detailing image with black blur overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=80"
          alt="Auto Detailing Background"
          className="w-full h-full object-cover object-center filter blur-sm opacity-30 scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Black blur overlay extending across the page */}
        <div className="absolute inset-0 bg-[#050505]/70 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/85 to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_80%)]" />
      </div>

      {/* Subtle background glow circles */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-300/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-lime-400/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="space-y-6">
          
          {/* Top Tag Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-300/10 border border-yellow-300/30 text-yellow-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mobile Detailing & Studio Services</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium">
              <div className="flex items-center space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-5 sm:h-5.5 w-5 sm:w-5.5 rounded-[3px] bg-[#D32323] flex items-center justify-center shadow-sm shrink-0">
                    <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-white" viewBox="0 0 24 24">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  </div>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5">
                <span>Rated on</span>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Yelp_Logo.svg" 
                  alt="Yelp" 
                  className="h-5 sm:h-5.5 w-auto inline-block object-contain align-middle drop-shadow shrink-0"
                  referrerPolicy="no-referrer"
                />
                <span>(420+ Reviews)</span>
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Showroom Shine.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-lime-300 to-lime-400">
              Scheduled & Paid
            </span>{' '}
            In Seconds.
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Integrated with{' '}
            <strong className="text-white font-semibold">Google Calendar</strong> for instant appointment sync and{' '}
            <strong className="text-white font-semibold">Google Wallet</strong> for effortless one-tap checkout & digital service passes.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-2">
            <div className="flex items-center space-x-3 bg-zinc-900/90 p-3 rounded-xl border border-zinc-800">
              <div className="p-2 rounded-lg bg-yellow-300/10 text-yellow-300">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Google Calendar Sync</h4>
                <p className="text-xs text-zinc-400">Auto-adds to your personal calendar</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-zinc-900/90 p-3 rounded-xl border border-zinc-800">
              <div className="p-2 rounded-lg bg-lime-400/15 text-lime-400">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Google Wallet Ready</h4>
                <p className="text-xs text-zinc-400">One-tap pay + Pass saved in Wallet</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartBooking}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-300 via-lime-300 to-lime-400 hover:from-yellow-200 hover:to-lime-300 text-black font-extrabold text-base shadow-xl shadow-yellow-300/20 hover:shadow-yellow-300/35 transition-all duration-200 flex items-center justify-center space-x-3 group active:scale-95"
            >
              <Calendar className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
              <span>Schedule Customer Appointment</span>
            </button>

            <button
              onClick={onExploreServices}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#3a3a3a] hover:bg-[#4a4a4a] border border-zinc-600 text-white font-semibold text-base transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Explore Packages</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center space-x-6 text-xs text-zinc-400 pt-2">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-yellow-300" />
              <span>100% mobile(We come to you)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
