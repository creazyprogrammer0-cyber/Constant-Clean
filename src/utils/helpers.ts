import { DetailService, ServiceAddon, VehicleCategory } from '../types';
import { VEHICLE_OPTIONS } from '../data/services';

export function calculateTotalPrice(
  service: DetailService,
  vehicleCategory: VehicleCategory,
  addons: ServiceAddon[]
): number {
  const vehicleOpt = VEHICLE_OPTIONS.find((v) => v.id === vehicleCategory);
  const multiplier = vehicleOpt ? vehicleOpt.priceMultiplier : 1.0;
  
  const baseMultiplied = Math.round(service.basePrice * multiplier);
  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);

  return baseMultiplied + addonsTotal;
}

export function calculateTotalDuration(
  service: DetailService,
  addons: ServiceAddon[]
): number {
  const addonsDuration = addons.reduce((sum, addon) => sum + addon.durationMinutes, 0);
  return service.durationMinutes + addonsDuration;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateString(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeSlot(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function getStorageBookings(): any[] {
  try {
    const data = localStorage.getItem('apex_detailing_bookings');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStorageBooking(booking: any) {
  try {
    const existing = getStorageBookings();
    const updated = [booking, ...existing.filter((b: any) => b.id !== booking.id)];
    localStorage.setItem('apex_detailing_bookings', JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving booking to localStorage:', err);
  }
}

export function openGoogleWalletApp(): void {
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.google.android.apps.walletnfcrel';
  const webWalletUrl = 'https://pay.google.com';
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isAndroid) {
    const intentUrl = 'intent://wallet/#Intent;scheme=wallet;package=com.google.android.apps.walletnfcrel;end;';
    const start = Date.now();
    window.location.href = intentUrl;
    setTimeout(() => {
      if (Date.now() - start < 2000) {
        window.open(playStoreUrl, '_blank');
      }
    }, 1200);
  } else {
    window.open(webWalletUrl, '_blank');
  }
}
