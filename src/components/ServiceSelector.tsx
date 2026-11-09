import React from 'react';
import {
  DetailService,
  ServiceAddon,
  VehicleCategory,
  VehicleOption,
} from '../types';
import {
  DETAILING_SERVICES,
  SERVICE_ADDONS,
  VEHICLE_OPTIONS,
} from '../data/services';
import {
  calculateTotalDuration,
  calculateTotalPrice,
  formatCurrency,
} from '../utils/helpers';
import {
  Car,
  CarFront,
  Truck,
  Sparkles,
  Check,
  Clock,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sun,
  Dog,
  Gauge,
  Wind,
  Droplets,
  Star,
} from 'lucide-react';

interface ServiceSelectorProps {
  selectedVehicle: VehicleCategory;
  setSelectedVehicle: (v: VehicleCategory) => void;
  selectedService: DetailService;
  setSelectedService: (s: DetailService) => void;
  selectedAddons: ServiceAddon[];
  setSelectedAddons: React.Dispatch<React.SetStateAction<ServiceAddon[]>>;
  onProceedToSchedule: () => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedVehicle,
  setSelectedVehicle,
  selectedService,
  setSelectedService,
  selectedAddons,
  setSelectedAddons,
  onProceedToSchedule,
}) => {
  const toggleAddon = (addon: ServiceAddon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const currentPrice = calculateTotalPrice(
    selectedService,
    selectedVehicle,
    selectedAddons
  );
  const currentDuration = calculateTotalDuration(
    selectedService,
    selectedAddons
  );

  const getAddonIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-4 h-4 text-yellow-300" />;
      case 'Dog':
        return <Dog className="w-4 h-4 text-yellow-300" />;
      case 'Gauge':
        return <Gauge className="w-4 h-4 text-lime-400" />;
      case 'Wind':
        return <Wind className="w-4 h-4 text-lime-400" />;
      case 'Droplets':
        return <Droplets className="w-4 h-4 text-lime-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-yellow-300" />;
    }
  };

  const getVehicleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car':
        return <Car className="w-5 h-5" />;
      case 'CarFront':
        return <CarFront className="w-5 h-5" />;
      case 'Truck':
        return <Truck className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div id="services-section" className="space-y-12 py-8">
      {/* SECTION 1: Vehicle Type Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-300">
              Step 1 of 3
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Select Your Vehicle Category
            </h2>
          </div>
          <span className="text-xs text-zinc-400 hidden sm:inline-block">
            Prices adjust automatically by vehicle size
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VEHICLE_OPTIONS.map((veh) => {
            const isSelected = selectedVehicle === veh.id;
            return (
              <div
                key={veh.id}
                onClick={() => setSelectedVehicle(veh.id)}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 border text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-lime-950/90 via-[#3a3a3a] to-lime-900/80 border-yellow-300 ring-2 ring-yellow-300/40 shadow-lg shadow-yellow-300/20'
                    : 'bg-[#3a3a3a] hover:bg-[#4a4a4a] border-zinc-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-yellow-300 text-black flex items-center justify-center font-extrabold shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
                <div
                  className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${
                    isSelected
                      ? 'bg-yellow-300/20 text-yellow-300 border border-yellow-300/30'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {getVehicleIcon(veh.iconName)}
                </div>
                <h3 className="font-bold text-white text-base">{veh.name}</h3>
                <p className="text-xs text-zinc-400 mt-1">{veh.description}</p>
                <div className="mt-3 text-[11px] font-semibold text-zinc-400">
                  Multiplier:{' '}
                  <span className="text-yellow-300 font-bold">
                    {veh.priceMultiplier === 1 ? 'Standard' : `+${Math.round((veh.priceMultiplier - 1) * 100)}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Service Packages */}
      <div className="space-y-4 pt-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-300">
            Step 2 of 3
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Choose Detailing Package
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            All packages include eco-friendly PH-neutral detailing solutions and digital warranty
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DETAILING_SERVICES.map((serv) => {
            const isSelected = selectedService.id === serv.id;
            const calculatedPrice = calculateTotalPrice(
              serv,
              selectedVehicle,
              []
            );

            return (
              <div
                key={serv.id}
                onClick={() => setSelectedService(serv)}
                className={`relative p-6 sm:p-7 rounded-3xl cursor-pointer transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-lime-950/90 via-[#3a3a3a] to-lime-900/80 border-yellow-300 ring-2 ring-yellow-300/40 shadow-2xl shadow-yellow-300/20'
                    : 'bg-[#3a3a3a] hover:bg-[#4a4a4a] border-zinc-700'
                }`}
              >
                {/* Popular Ribbon */}
                {serv.popular && (
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-300 via-lime-300 to-lime-400 text-black text-[10px] font-extrabold tracking-wider uppercase shadow-md flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-black text-black" />
                    <span>Most Popular</span>
                  </div>
                )}

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-yellow-300 text-black flex items-center justify-center font-extrabold shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <span>{serv.name}</span>
                      </h3>
                      <p className="text-xs text-yellow-300 font-medium mt-0.5">
                        {serv.tagline}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-white">
                        {formatCurrency(calculatedPrice)}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-medium flex items-center justify-end space-x-1 mt-0.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>~{serv.durationMinutes} mins</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                    {serv.description}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-zinc-800/80 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Included In Package:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {serv.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-zinc-300">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-yellow-300' : 'text-lime-400'}`} />
                          <span className="text-[11px] leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className={`text-xs font-medium ${isSelected ? 'text-yellow-300 font-bold' : 'text-zinc-400'}`}>
                    {isSelected ? '✓ Currently Selected' : 'Click to Select'}
                  </span>
                  <div
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      isSelected
                        ? 'bg-yellow-300 text-black shadow-md shadow-yellow-300/30'
                        : 'bg-zinc-800 text-zinc-300 group-hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Package'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Add-on Enhancements */}
      <div className="space-y-4 pt-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-300">
            Step 3 of 3
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Optional Add-on Enhancements
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Customize your appointment with specialized restoration add-ons
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICE_ADDONS.map((addon) => {
            const isAdded = selectedAddons.some((a) => a.id === addon.id);

            return (
              <div
                key={addon.id}
                onClick={() => toggleAddon(addon)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col justify-between ${
                  isAdded
                    ? 'bg-gradient-to-r from-lime-950/90 via-[#3a3a3a] to-lime-900/80 border-yellow-300 ring-1 ring-yellow-300/40 shadow-md shadow-yellow-300/20'
                    : 'bg-[#3a3a3a] hover:bg-[#4a4a4a] border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-zinc-800">
                      {getAddonIcon(addon.icon)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{addon.name}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        +{addon.durationMinutes} mins
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-yellow-300 text-sm">
                    +{formatCurrency(addon.price)}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 mt-3">{addon.description}</p>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-medium">
                  <span className={isAdded ? 'text-yellow-300 font-bold' : 'text-zinc-400'}>
                    {isAdded ? '✓ Added' : 'Add to service'}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold ${
                      isAdded ? 'bg-yellow-300 text-black' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isAdded ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Summary Bar / Continue CTA */}
      <div className="sticky bottom-4 z-30 p-4 sm:p-5 rounded-2xl bg-[#3a3a3a]/95 backdrop-blur-md border border-zinc-700 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400">Total Price Estimate:</span>
            <span className="text-2xl font-black text-white">{formatCurrency(currentPrice)}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              ~{currentDuration} mins
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {selectedService.name} • {selectedVehicle.toUpperCase()} • {selectedAddons.length} Add-ons
          </p>
        </div>

        <button
          onClick={onProceedToSchedule}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-yellow-300 via-lime-300 to-lime-400 hover:from-yellow-200 hover:to-lime-300 text-black font-extrabold text-sm shadow-lg shadow-yellow-300/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
        >
          <span>Schedule with Google Calendar</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  );
};
