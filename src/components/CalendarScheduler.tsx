import React, { useState, useEffect } from 'react';
import {
  CustomerInfo,
  DetailService,
  ServiceAddon,
  VehicleCategory,
} from '../types';
import {
  calculateTotalDuration,
  calculateTotalPrice,
  formatCurrency,
  formatDateString,
  formatTimeSlot,
} from '../utils/helpers';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Car,
  CheckCircle2,
  ShieldCheck,
  Wallet,
  Sparkles,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';

interface CalendarSchedulerProps {
  selectedService: DetailService;
  selectedVehicle: VehicleCategory;
  selectedAddons: ServiceAddon[];
  customerInfo: CustomerInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  onBackToServices: () => void;
  onProceedToPayment: () => void;
}

export const CalendarScheduler: React.FC<CalendarSchedulerProps> = ({
  selectedService,
  selectedVehicle,
  selectedAddons,
  customerInfo,
  setCustomerInfo,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onBackToServices,
  onProceedToPayment,
}) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Generate next 14 available dates
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      dates.push({ iso, dayName, monthDay, fullDate: d });
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  const timeSlots = [
    { time: '08:00', label: '8:00 AM', period: 'Morning' },
    { time: '10:30', label: '10:30 AM', period: 'Morning' },
    { time: '13:00', label: '1:00 PM', period: 'Afternoon' },
    { time: '15:30', label: '3:30 PM', period: 'Afternoon' },
    { time: '17:30', label: '5:30 PM', period: 'Evening' },
  ];

  const handleInputChange = (
    field: keyof CustomerInfo,
    value: string
  ) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customerInfo.fullName.trim()) errors.fullName = 'Full name is required';
    if (!customerInfo.email.trim() || !customerInfo.email.includes('@'))
      errors.email = 'Valid email is required for calendar invite';
    if (!customerInfo.phone.trim()) errors.phone = 'Phone number is required';
    if (!customerInfo.vehicleMake.trim()) errors.vehicleMake = 'Make is required';
    if (!customerInfo.vehicleModel.trim()) errors.vehicleModel = 'Model is required';
    if (!customerInfo.licensePlate.trim()) errors.licensePlate = 'License plate is required';
    if (customerInfo.serviceType === 'mobile' && !customerInfo.streetAddress.trim()) {
      errors.streetAddress = 'Address is required for mobile detailing';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onProceedToPayment();
    }
  };

  const totalPrice = calculateTotalPrice(
    selectedService,
    selectedVehicle,
    selectedAddons
  );
  const totalDuration = calculateTotalDuration(
    selectedService,
    selectedAddons
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBackToServices}
        className="inline-flex items-center space-x-2 text-sm text-yellow-300 hover:text-yellow-200 font-bold transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-yellow-300" />
        <span>Back to Services & Pricing</span>
      </button>

      <div className="bg-[#0f0f13] rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-yellow-300/10 text-yellow-300 border border-yellow-300/20">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
              Google Calendar Scheduling
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Schedule Appointment & Customer Details
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            This appointment will be synchronized automatically to your Google Calendar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP A: Date & Time Picker */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-300" />
              <span>1. Choose Appointment Date & Time</span>
            </h3>

            {/* Dates Horizontal Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">
                Select Date:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.iso;
                  return (
                    <button
                      key={item.iso}
                      type="button"
                      onClick={() => setSelectedDate(item.iso)}
                      className={`p-3 rounded-xl text-center border transition-all ${
                        isSelected
                          ? 'bg-yellow-300 text-black font-extrabold border-yellow-300 shadow-md shadow-yellow-300/30'
                          : 'bg-[#3a3a3a] hover:bg-[#4a4a4a] border-zinc-600 text-zinc-200'
                      }`}
                    >
                      <span className="block text-[11px] uppercase tracking-wider opacity-80">
                        {item.dayName}
                      </span>
                      <span className="block text-sm font-extrabold mt-0.5">
                        {item.monthDay}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-zinc-300">
                Select Time Slot ({totalDuration} mins estimated):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-yellow-300 text-black font-extrabold border-yellow-300 shadow-md shadow-yellow-300/30'
                          : 'bg-[#3a3a3a] hover:bg-[#4a4a4a] border-zinc-600 text-zinc-200'
                      }`}
                    >
                      <span className="block text-xs font-extrabold">{slot.label}</span>
                      <span className="block text-[10px] opacity-70 mt-0.5">
                        {slot.period}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP B: Service Delivery Location (Mobile vs Studio) */}
          <div className="space-y-4 border-t border-zinc-800 pt-6">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-yellow-300" />
              <span>2. Service Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => handleInputChange('serviceType', 'mobile')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  customerInfo.serviceType === 'mobile'
                    ? 'bg-zinc-800 border-yellow-300 ring-1 ring-yellow-300/30'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-yellow-300/10 text-yellow-300">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Mobile Detailing</h4>
                    <p className="text-xs text-zinc-400">We come to your home or office</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleInputChange('serviceType', 'studio')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  customerInfo.serviceType === 'studio'
                    ? 'bg-zinc-800 border-yellow-300 ring-1 ring-yellow-300/30'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-lime-400/10 text-lime-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Constant Clean Studio Drop-off</h4>
                    <p className="text-xs text-zinc-400">Drop off at 1080 Detailing Way, LA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP C: Vehicle Information */}
          <div className="space-y-4 border-t border-zinc-800 pt-6">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Car className="w-4 h-4 text-yellow-300" />
              <span>3. Vehicle Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Make *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Porsche / BMW / Ford"
                  value={customerInfo.vehicleMake}
                  onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:border-yellow-300 focus:outline-none"
                />
                {formErrors.vehicleMake && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.vehicleMake}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Model *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 911 GT3 / M4 / F-150"
                  value={customerInfo.vehicleModel}
                  onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:border-yellow-300 focus:outline-none"
                />
                {formErrors.vehicleModel && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.vehicleModel}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  License Plate *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 7XYZ89"
                  value={customerInfo.licensePlate}
                  onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:border-yellow-300 focus:outline-none"
                />
                {formErrors.licensePlate && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.licensePlate}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Vehicle Year
                </label>
                <input
                  type="text"
                  placeholder="2024"
                  value={customerInfo.vehicleYear}
                  onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:border-yellow-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Paint Color
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metallic Black / Alpine White"
                  value={customerInfo.vehicleColor}
                  onChange={(e) => handleInputChange('vehicleColor', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:border-yellow-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* STEP D: Contact Details */}
          <div className="space-y-4 border-t border-zinc-800 pt-6">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <User className="w-4 h-4 text-yellow-300" />
              <span>4. Customer Contact & Google Calendar Account</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={customerInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:border-yellow-300 focus:outline-none"
                  />
                </div>
                {formErrors.fullName && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Email Address (Google Calendar Invite) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="john@gmail.com"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:border-yellow-300 focus:outline-none"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="(555) 019-2834"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:border-yellow-300 focus:outline-none"
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.phone}</p>
                )}
              </div>

              {customerInfo.serviceType === 'mobile' && (
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">
                    Street Address (Mobile Location) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="123 Ocean Blvd"
                      value={customerInfo.streetAddress}
                      onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050505] border border-zinc-800 text-white text-sm focus:border-yellow-300 focus:outline-none"
                    />
                  </div>
                  {formErrors.streetAddress && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.streetAddress}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* STEP E: Calendar & Payment Preview Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#18181c] via-[#121216] to-[#18181c] border border-yellow-300/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-lime-400/10 text-lime-400 shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Next Step: Google Wallet Payment ({formatCurrency(totalPrice)})
                </div>
                <div className="text-xs text-zinc-300 mt-0.5">
                  Scheduled for <strong className="text-yellow-300">{formatDateString(selectedDate)} at {formatTimeSlot(selectedTime)}</strong>. Will automatically create calendar event and wallet pass.
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 px-8 py-3.5 rounded-xl bg-gradient-to-r from-yellow-300 via-lime-300 to-lime-400 hover:from-yellow-200 hover:to-lime-300 text-black font-extrabold text-sm shadow-xl shadow-yellow-300/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Proceed to Google Wallet Pay</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
