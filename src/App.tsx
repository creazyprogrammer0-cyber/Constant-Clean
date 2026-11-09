import React, { useState, useEffect } from 'react';
import {
  CustomerInfo,
  DetailService,
  DetailingBooking,
  GmailUserAccount,
  GoogleWalletCard,
  ServiceAddon,
  VehicleCategory,
} from './types';
import { DETAILING_SERVICES } from './data/services';
import { DEFAULT_GMAIL_USER } from './data/defaultWalletCards';
import { getStorageBookings, saveStorageBooking } from './utils/helpers';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceSelector } from './components/ServiceSelector';
import { CalendarScheduler } from './components/CalendarScheduler';
import { GoogleWalletModal } from './components/GoogleWalletModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { GmailProfileAccount } from './components/GmailProfileAccount';
import { Calendar, Wallet, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'services' | 'gallery' | 'dashboard' | 'book' | 'account'>('services');

  // Gmail User & Official Google Wallet state
  const [user, setUser] = useState<GmailUserAccount>(DEFAULT_GMAIL_USER);

  // Service selection state
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory>('sedan');
  const [selectedService, setSelectedService] = useState<DetailService>(DETAILING_SERVICES[2]); // Executive Full Detail default
  const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>([]);

  // Default date = tomorrow
  const getTomorrowIso = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTomorrowIso());
  const [selectedTime, setSelectedTime] = useState<string>('09:00');

  // Customer info - sync email with logged in Gmail user
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: user.name,
    email: user.email,
    phone: '',
    streetAddress: '',
    city: 'Los Angeles',
    zipCode: '90001',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '2024',
    vehicleColor: '',
    licensePlate: '',
    specialNotes: '',
    serviceType: 'mobile',
  });

  // Bookings list
  const [bookings, setBookings] = useState<DetailingBooking[]>([]);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Sync user email to customerInfo when user changes
  useEffect(() => {
    if (user.isLoggedIn) {
      setCustomerInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: user.email,
      }));
    }
  }, [user]);

  // Load initial bookings from backend and localStorage
  useEffect(() => {
    const localData = getStorageBookings();
    setBookings(localData);

    fetch('/api/bookings')
      ? fetch('/api/bookings')
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.bookings) && data.bookings.length > 0) {
              setBookings((prev) => {
                const combined = [...data.bookings, ...prev];
                const unique = Array.from(new Map(combined.map((b) => [b.id, b])).values());
                return unique;
              });
            }
          })
          .catch((err) => console.warn('Could not fetch server bookings:', err))
      : null;
  }, []);

  const handleLoginGmail = (email: string, name: string, avatarUrl?: string) => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: true,
      email,
      name,
      avatarUrl: avatarUrl || prev.avatarUrl,
      googleWalletConnected: true,
      connectedAt: 'Just connected',
    }));
  };

  const handleLogoutGmail = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
      googleWalletConnected: false,
    }));
  };

  const handleAddCard = (newCardData: Omit<GoogleWalletCard, 'id'>) => {
    const newCard: GoogleWalletCard = {
      ...newCardData,
      id: 'card-' + Date.now(),
    };
    setUser((prev) => ({
      ...prev,
      walletCards: [newCard, ...prev.walletCards],
    }));
  };

  const handleRemoveCard = (cardId: string) => {
    setUser((prev) => ({
      ...prev,
      walletCards: prev.walletCards.filter((c) => c.id !== cardId),
    }));
  };

  const handlePaymentSuccess = (newBooking: DetailingBooking) => {
    saveStorageBooking(newBooking);
    setBookings((prev) => [newBooking, ...prev.filter((b) => b.id !== newBooking.id)]);

    // Also auto-generate a Google Wallet pass card for this booking!
    const newPassCard: GoogleWalletCard = {
      id: 'pass-' + newBooking.id,
      title: `${newBooking.service.name} Pass`,
      type: 'pass',
      brand: 'Constant Clean',
      cardNumberOrId: `PASS #${newBooking.id.slice(-6).toUpperCase()}`,
      expiryOrDetail: `${newBooking.bookingDate} at ${newBooking.bookingTime}`,
      balanceOrStatus: 'Active Booking Pass',
      bgColor: 'from-[#18181c] via-[#2a2a30] to-yellow-950',
      textColor: 'text-yellow-300',
      isPrimary: false,
    };

    setUser((prev) => ({
      ...prev,
      walletCards: [newPassCard, ...prev.walletCards.filter((c) => c.id !== newPassCard.id)],
    }));
  };

  const handleCancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-yellow-400 selection:text-black flex flex-col justify-between relative overflow-x-hidden">
      {/* Background ambient lighting effects for Black, Grey, Bright Yellow & Neon Lime theme */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-yellow-300/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-lime-300/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          bookingCount={bookings.filter((b) => b.status !== 'cancelled').length}
          user={user}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* TAB 1: Services & Pricing (includes Hero header) */}
          {activeTab === 'services' && (
            <div className="space-y-12">
              <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                <Hero
                  onStartBooking={() => {
                    setActiveTab('book');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onExploreServices={() => {
                    const el = document.getElementById('services-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </div>

              <ServiceSelector
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                selectedAddons={selectedAddons}
                setSelectedAddons={setSelectedAddons}
                onProceedToSchedule={() => {
                  setActiveTab('book');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {/* TAB 2: Interactive Before & After Gallery */}
          {activeTab === 'gallery' && <BeforeAfterGallery />}

          {/* TAB 3: Customer Hub - Google Wallet Passes & Calendar Appointments */}
          {activeTab === 'dashboard' && (
            <CustomerDashboard
              bookings={bookings}
              user={user}
              onStartNewBooking={() => setActiveTab('book')}
              onCancelBooking={handleCancelBooking}
              onNavigateToAccount={() => setActiveTab('account')}
            />
          )}

          {/* TAB 4: Appointment Scheduling & Customer Form */}
          {activeTab === 'book' && (
            <CalendarScheduler
              selectedService={selectedService}
              selectedVehicle={selectedVehicle}
              selectedAddons={selectedAddons}
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              onBackToServices={() => setActiveTab('services')}
              onProceedToPayment={() => setIsWalletModalOpen(true)}
            />
          )}

          {/* TAB 5: Official Gmail Style Account Profile & Login Page */}
          {activeTab === 'account' && (
            <GmailProfileAccount
              user={user}
              bookings={bookings}
              onLogin={handleLoginGmail}
              onLogout={handleLogoutGmail}
              onNavigateToWallet={() => setActiveTab('dashboard')}
              onNavigateToBook={() => {
                setActiveTab('book');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddCard={handleAddCard}
              onRemoveCard={handleRemoveCard}
            />
          )}
        </main>
      </div>

      {/* Google Wallet Checkout Modal */}
      <GoogleWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        selectedService={selectedService}
        selectedVehicle={selectedVehicle}
        selectedAddons={selectedAddons}
        customerInfo={customerInfo}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        user={user}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Footer */}
      <footer className="bg-[#3a3a3a] border-t border-zinc-800/80 text-zinc-400 pt-10 pb-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-300 via-lime-300 to-lime-400 flex items-center justify-center font-extrabold text-black text-xs shadow-md shadow-yellow-300/20">
              CC
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">Constant Clean Auto Detailing Studio & Mobile Concierge</p>
              <p className="text-xs text-zinc-400">Google Calendar & Google Wallet Integration</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-semibold">
            <div className="flex items-center space-x-1.5 text-lime-300">
              <Wallet className="w-4 h-4" />
              <span>Google Wallet Enabled</span>
            </div>
            <div className="flex items-center space-x-1.5 text-yellow-300">
              <Calendar className="w-4 h-4" />
              <span>Google Calendar Syncing</span>
            </div>
          </div>

          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Constant Clean Auto Detailing. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

