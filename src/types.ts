export type VehicleCategory = 'sedan' | 'suv' | 'truck' | 'exotic';

export interface VehicleOption {
  id: VehicleCategory;
  name: string;
  description: string;
  priceMultiplier: number;
  iconName: string;
}

export interface DetailService {
  id: string;
  name: string;
  tagline: string;
  description: string;
  durationMinutes: number;
  basePrice: number;
  popular?: boolean;
  features: string[];
  category: 'exterior' | 'interior' | 'full' | 'ceramic' | 'maintenance';
}

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  icon: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  licensePlate: string;
  specialNotes?: string;
  serviceType: 'mobile' | 'studio';
}

export interface BookingSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm format e.g. "09:00"
  available: boolean;
}

export interface DetailingBooking {
  id: string;
  createdAt: string;
  service: DetailService;
  vehicleCategory: VehicleCategory;
  addons: ServiceAddon[];
  customer: CustomerInfo;
  bookingDate: string; // YYYY-MM-DD
  bookingTime: string; // HH:mm
  totalPrice: number;
  estimatedDurationMinutes: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'google_wallet' | 'google_pay';
  transactionId?: string;
  calendarEventId?: string;
  calendarSynced: boolean;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  walletPassId?: string;
}

export interface GoogleWalletPassData {
  passId: string;
  bookingId: string;
  customerName: string;
  serviceName: string;
  vehicleInfo: string;
  appointmentDateTime: string;
  location: string;
  status: string;
  barcodeValue: string;
  qrCodeUrl: string;
  walletSaveUrl: string;
}

export interface GoogleWalletCard {
  id: string;
  title: string;
  type: 'payment' | 'pass' | 'loyalty' | 'transit' | 'key';
  brand: string;
  cardNumberOrId: string;
  expiryOrDetail?: string;
  balanceOrStatus?: string;
  bgColor: string;
  textColor?: string;
  isPrimary?: boolean;
  issuerLogo?: string;
}

export interface GmailUserAccount {
  isLoggedIn: boolean;
  name: string;
  email: string;
  avatarUrl: string;
  googleWalletConnected: boolean;
  connectedAt?: string;
  walletCards: GoogleWalletCard[];
}
