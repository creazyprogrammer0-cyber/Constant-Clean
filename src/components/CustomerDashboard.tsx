import React, { useState } from 'react';
import { DetailingBooking, GmailUserAccount, GoogleWalletCard } from '../types';
import { GoogleWalletLogo } from './GoogleWalletLogo';
import {
  formatCurrency,
  formatDateString,
  formatTimeSlot,
  openGoogleWalletApp,
} from '../utils/helpers';
import {
  Wallet,
  Calendar,
  Clock,
  Car,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Download,
  ShieldCheck,
  Sparkles,
  QrCode,
  Trash2,
  RefreshCw,
  Search,
  CreditCard,
  Plus,
} from 'lucide-react';

interface CustomerDashboardProps {
  bookings: DetailingBooking[];
  user: GmailUserAccount;
  onStartNewBooking: () => void;
  onCancelBooking?: (id: string) => void;
  onNavigateToAccount?: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  bookings,
  user,
  onStartNewBooking,
  onCancelBooking,
  onNavigateToAccount,
}) => {
  const [selectedPassBooking, setSelectedPassBooking] = useState<DetailingBooking | null>(
    bookings.length > 0 ? bookings[0] : null
  );
  const [activeTab, setActiveTab] = useState<'upcoming' | 'all'>('upcoming');
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(user.googleWalletConnected);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [connectedEmail, setConnectedEmail] = useState<string>(user.email);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const upcomingBookings = bookings.filter((b) => b.status !== 'cancelled');

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : bookings;

  const [connectedWallets, setConnectedWallets] = useState<Array<{ id: string; email: string; isPrimary: boolean; connectedAt: string; status: 'Active' | 'Synced' }>>([
    { id: '1', email: user.email, isPrimary: true, connectedAt: 'Active Now', status: 'Active' },
  ]);

  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsWalletConnected(true);
      if (!connectedWallets.some((w) => w.email.toLowerCase() === connectedEmail.toLowerCase())) {
        setConnectedWallets((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            email: connectedEmail,
            isPrimary: prev.length === 0,
            connectedAt: 'Just connected',
            status: 'Active',
          },
        ]);
      }
      setIsConnectModalOpen(false);
    }, 800);
  };

  const handleDisconnectWalletAccount = (emailToDisconnect: string) => {
    setConnectedWallets((prev) => prev.filter((w) => w.email !== emailToDisconnect));
    if (connectedWallets.length <= 1) {
      setIsWalletConnected(false);
    }
  };


  const handleSyncGCal = (booking: DetailingBooking) => {
    const startHour = Number(booking.bookingTime.split(':')[0]);
    const startMin = Number(booking.bookingTime.split(':')[1]);
    const startDate = new Date(booking.bookingDate);
    startDate.setHours(startHour, startMin, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + booking.estimatedDurationMinutes);

    const formatGCalTime = (isoString: string) =>
      new Date(isoString).toISOString().replace(/-|:|\.\d\d\d/g, '');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `🚗 ${booking.service.name} - Constant Clean Auto Detailing`,
      details: `Auto Detailing Service\nVehicle: ${booking.customer.vehicleYear} ${booking.customer.vehicleMake} ${booking.customer.vehicleModel} (${booking.customer.licensePlate})\nLocation: ${booking.customer.streetAddress}\nStatus: Paid via Google Wallet`,
      location:
        booking.customer.serviceType === 'mobile'
          ? `${booking.customer.streetAddress}, ${booking.customer.city}`
          : 'Constant Clean Auto Studio - 1080 Detailing Way, Los Angeles',
      dates: `${formatGCalTime(startDate.toISOString())}/${formatGCalTime(
        endDate.toISOString()
      )}`,
    });

    window.open(`https://calendar.google.com/render?${params.toString()}`, '_blank');
  };

  return (
    <div className="space-y-8 py-6">

      {bookings.length === 0 ? (
        <div className="bg-[#18181c] rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0a0a0d] border border-zinc-700 flex items-center justify-center p-2 shadow-lg shadow-yellow-400/10">
                <GoogleWalletLogo className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Connected Google Wallets</h3>
                <p className="text-xs text-zinc-400">
                  Linked accounts for instant digital detailing pass storage & Google Calendar sync
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md flex items-center space-x-2 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Connect Google Wallet</span>
            </button>
          </div>

          {connectedWallets.length === 0 ? (
            <div className="text-center py-10 px-4 bg-[#0a0a0d] rounded-2xl border border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                <Wallet className="w-6 h-6" />
              </div>
              <p className="text-white text-sm font-bold">No Google Wallet Accounts Connected</p>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                Connect your Google account to sync detailing service passes and appointment dates.
              </p>
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md"
              >
                Connect Wallet Account
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-3">
                  Active Wallet Connections ({connectedWallets.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connectedWallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="p-5 rounded-2xl bg-[#0a0a0d] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {user.isLoggedIn && wallet.email === user.email ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-11 h-11 rounded-full object-cover ring-2 ring-yellow-400/80 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center shrink-0">
                              <Wallet className="w-5 h-5 text-lime-400" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white text-sm">{wallet.email}</span>
                              {wallet.isPrimary && (
                                <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[10px] font-extrabold uppercase">
                                  Primary Gmail
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-zinc-400 block mt-0.5">
                              Status: <span className="text-lime-400 font-semibold">{wallet.status}</span> • {wallet.connectedAt}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                          <span>Google Wallet & Calendar Synced</span>
                        </span>
                        <button
                          onClick={() => handleDisconnectWalletAccount(wallet.email)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors text-[11px] font-semibold"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Cards in Official Google Wallet */}
              <div className="pt-4 border-t border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GoogleWalletLogo className="w-5 h-5" />
                    <h4 className="text-sm font-extrabold text-white">
                      Cards ({user.googleWalletConnected ? user.walletCards.length : 0})
                    </h4>
                  </div>
                  <button
                    onClick={openGoogleWalletApp}
                    className="text-xs font-bold text-yellow-300 hover:text-yellow-200 flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20 hover:bg-yellow-400/20 transition-all cursor-pointer"
                    title="Open Official Google Wallet App or Play Store"
                  >
                    <span>Manage Cards</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {user.googleWalletConnected && user.walletCards.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.walletCards.map((card) => (
                      <div
                        key={card.id}
                        className={`p-4 rounded-xl bg-gradient-to-br ${card.bgColor} border border-white/10 shadow-lg flex flex-col justify-between h-36 text-white relative overflow-hidden`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-1.5">
                            <GoogleWalletLogo className="w-4 h-4 shrink-0" />
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                              {card.brand}
                            </span>
                          </div>
                          {card.isPrimary && (
                            <span className="px-1.5 py-0.5 rounded bg-yellow-400 text-black font-extrabold text-[9px]">
                              PRIMARY
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-extrabold truncate">{card.title}</p>
                          <div className="flex items-center justify-between mt-1 text-[11px] opacity-90">
                            <span className="font-mono">{card.cardNumberOrId}</span>
                            <span className="font-bold">{card.balanceOrStatus || card.expiryOrDetail}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[#0a0a0d] border border-zinc-800 text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto shadow-inner">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">No Connected Cards in Google Wallet</p>
                      <p className="text-xs text-zinc-400 max-w-md mx-auto">
                        Add or manage your payment methods and passes directly inside the official Google Wallet mobile app.
                      </p>
                    </div>
                    <button
                      onClick={openGoogleWalletApp}
                      className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md inline-flex items-center space-x-2"
                    >
                      <GoogleWalletLogo className="w-4 h-4 shrink-0" />
                      <span>Manage Cards in Google Wallet App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          )}

          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400">
              Ready to schedule your vehicle detailing? Digital passes will automatically sync to your connected Google Wallet upon booking.
            </p>
            <button
              onClick={onStartNewBooking}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-lime-300 to-lime-400 hover:from-yellow-300 hover:to-lime-300 text-black font-extrabold text-xs transition-all shadow-lg shadow-yellow-400/20 flex items-center justify-center space-x-2 shrink-0"
            >
              <Calendar className="w-4 h-4 text-black" />
              <span>Schedule Detailing Service</span>
            </button>
          </div>
        </div>
      ) : (
        /* Content layout: Left list, Right Google Wallet Pass Viewer */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Bookings List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex space-x-2 text-xs font-bold p-1 bg-[#3a3a3a] rounded-xl border border-zinc-600/80">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'upcoming'
                      ? 'bg-[#505050] text-white font-extrabold border border-zinc-400 shadow-sm'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  Active ({upcomingBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'all'
                      ? 'bg-[#505050] text-white font-extrabold border border-zinc-400 shadow-sm'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  History ({bookings.length})
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {displayedBookings.map((bk) => {
                const isSelectedForPass = selectedPassBooking?.id === bk.id;

                return (
                  <div
                    key={bk.id}
                    onClick={() => setSelectedPassBooking(bk)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                      isSelectedForPass
                        ? 'bg-gradient-to-r from-lime-950/90 via-[#3a3a3a] to-lime-900/80 border-yellow-300 ring-1 ring-yellow-300/40 shadow-md shadow-yellow-300/20'
                        : 'bg-[#3a3a3a]/80 hover:bg-[#4a4a4a] border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-yellow-400">
                            {bk.service.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {bk.vehicleCategory.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white mt-1">
                          {bk.customer.vehicleYear} {bk.customer.vehicleMake} {bk.customer.vehicleModel}
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Plate: {bk.customer.licensePlate} • Client: {bk.customer.fullName}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-white">
                          {formatCurrency(bk.totalPrice)}
                        </span>
                        <div className="flex items-center justify-end space-x-1 text-[10px] text-lime-400 font-bold mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Google Wallet Paid</span>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time Badge */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#050505] text-xs border border-zinc-800">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-semibold block uppercase">
                          Scheduled Time
                        </span>
                        <span className="font-bold text-zinc-200">
                          {formatDateString(bk.bookingDate)} @ {formatTimeSlot(bk.bookingTime)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 font-semibold block uppercase">
                          Google Calendar Sync
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSyncGCal(bk);
                          }}
                          className="text-yellow-400 hover:underline font-bold flex items-center space-x-1"
                        >
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          <span>Sync Event</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Tracker Bar */}
                    <div className="pt-1 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
                        <span>Service Status:</span>
                        <span className="text-lime-400 font-bold">Confirmed & On Schedule</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-lime-400 h-full w-1/4" title="Confirmed" />
                        <div className="bg-yellow-400 h-full w-1/4" title="Prep & Wash" />
                        <div className="bg-zinc-700 h-full w-1/4" title="Polish & Protect" />
                        <div className="bg-zinc-700 h-full w-1/4" title="Quality Inspection" />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                      <span className="text-zinc-400 text-[11px]">
                        Tx: <span className="font-mono text-zinc-300">{bk.transactionId}</span>
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPassBooking(bk);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-lime-950/80 hover:bg-lime-900 border border-lime-800 text-lime-300 text-xs font-bold flex items-center space-x-1"
                        >
                          <Wallet className="w-3.5 h-3.5" />
                          <span>View Wallet Pass</span>
                        </button>

                        {onCancelBooking && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to cancel this appointment?')) {
                                onCancelBooking(bk.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[#3a3a3a] hover:bg-rose-950 text-zinc-300 hover:text-rose-300 transition-colors border border-zinc-600"
                            title="Cancel Appointment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Google Wallet Pass Interactive Digital Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-lime-400" />
                  <span>Google Wallet Pass Viewer</span>
                </h3>
              </div>

              {selectedPassBooking ? (
                <div className="bg-gradient-to-b from-[#18181c] via-[#121216] to-[#18181c] p-6 rounded-3xl border border-yellow-300/40 shadow-2xl space-y-5 text-white">
                  
                  {/* Top Pass Header */}
                  <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-yellow-300 to-lime-400 flex items-center justify-center font-black text-black text-xs">
                        CC
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white">Constant Clean Detailing</h4>
                        <p className="text-[10px] text-yellow-300 font-bold">Service & Warranty Pass</p>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/30 text-[10px] font-bold uppercase tracking-wider">
                      Verified Pass
                    </div>
                  </div>

                  {/* Main Pass Content */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                        Service Package
                      </span>
                      <h3 className="text-xl font-extrabold text-white">
                        {selectedPassBooking.service.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-[#050505] border border-zinc-800">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                          Vehicle
                        </span>
                        <span className="font-bold text-zinc-200">
                          {selectedPassBooking.customer.vehicleYear} {selectedPassBooking.customer.vehicleMake} {selectedPassBooking.customer.vehicleModel}
                        </span>
                        <span className="block text-[10px] text-zinc-400 mt-0.5">
                          Plate: {selectedPassBooking.customer.licensePlate}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                          Appointment
                        </span>
                        <span className="font-bold text-yellow-400">
                          {formatDateString(selectedPassBooking.bookingDate)}
                        </span>
                        <span className="block text-[10px] text-zinc-300">
                          @ {formatTimeSlot(selectedPassBooking.bookingTime)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-300 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Customer:</span>
                        <span className="font-bold text-white">{selectedPassBooking.customer.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Total Paid:</span>
                        <span className="font-bold text-lime-400">{formatCurrency(selectedPassBooking.totalPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Service Location:</span>
                        <span className="font-semibold text-zinc-200 truncate max-w-[180px]">
                          {selectedPassBooking.customer.serviceType === 'mobile'
                            ? selectedPassBooking.customer.streetAddress
                            : 'Constant Clean Studio'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Barcode Section */}
                  <div className="p-4 rounded-2xl bg-white text-black text-center space-y-2">
                    <QrCode className="w-24 h-24 mx-auto text-black" />
                    <p className="text-[10px] font-mono font-bold tracking-widest uppercase">
                      PASS-ID: {selectedPassBooking.walletPassId || selectedPassBooking.id}
                    </p>
                    <p className="text-[10px] text-zinc-600 font-medium">
                      Scan at check-in or technician arrival
                    </p>
                  </div>

                  {/* Wallet & Calendar Quick Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (!isWalletConnected) {
                          setIsConnectModalOpen(true);
                        } else {
                          alert(
                            `Google Wallet Digital Pass saved successfully to ${connectedEmail}!\nPass ID: ${selectedPassBooking.walletPassId || selectedPassBooking.id}`
                          );
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-lime-300 to-lime-400 hover:from-yellow-300 hover:to-lime-300 text-black font-extrabold text-xs flex items-center justify-center space-x-2 border border-yellow-400 shadow-md transition-all"
                    >
                      <Wallet className="w-4 h-4 text-black" />
                      <span>{isWalletConnected ? 'Save To Google Wallet' : 'Connect Google Wallet to Save Pass'}</span>
                    </button>

                    <button
                      onClick={() => handleSyncGCal(selectedPassBooking)}
                      className="w-full py-2.5 rounded-xl bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white font-semibold text-xs flex items-center justify-center space-x-2 border border-zinc-600 transition-all"
                    >
                      <Calendar className="w-4 h-4 text-lime-400" />
                      <span>Add to Google Calendar</span>
                    </button>
                  </div>

                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#0f0f13] border border-zinc-800 text-center text-zinc-400 text-xs">
                  Select a booking on the left to view its Google Wallet pass.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Connect Google Wallet Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#18181c] border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0a0a0d] border border-zinc-700 flex items-center justify-center p-2 shadow-lg shadow-yellow-400/10">
                <GoogleWalletLogo className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Google Wallet Sync</h3>
                <p className="text-xs text-zinc-400">
                  {isWalletConnected ? 'Manage Google Wallet Connection' : 'Connect Google Wallet Account'}
                </p>
              </div>
            </div>

            {isWalletConnected ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-lime-950/40 border border-lime-800/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300 font-semibold">Connection Status:</span>
                    <span className="text-lime-400 font-extrabold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Connected Account:</span>
                    <span className="font-mono font-bold text-white">{connectedEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Pass Auto-Sync:</span>
                    <span className="font-bold text-lime-300">Enabled</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Your Google Wallet is active. Detail booking passes, warranty certificates, and service updates will automatically sync to your Google Wallet app.
                </p>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      alert('Passes manually synced to Google Wallet!');
                      setIsConnectModalOpen(false);
                    }}
                    className="w-full py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs transition-all shadow-md"
                  >
                    Sync All Active Passes Now
                  </button>
                  <button
                    onClick={() => handleDisconnectWalletAccount(connectedEmail)}
                    className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-300 font-semibold text-xs transition-all border border-zinc-700"
                  >
                    Disconnect Google Wallet
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Link your Google Wallet account to store digital detailing passes, service warranties, and receive real-time push updates when your vehicle detailing begins.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">
                      Google Account Email
                    </label>
                    <input
                      type="email"
                      value={connectedEmail}
                      onChange={(e) => setConnectedEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
                      placeholder="your.email@gmail.com"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2 text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer text-zinc-300">
                      <input type="checkbox" defaultChecked className="rounded accent-lime-400" />
                      <span>Auto-save new detailing passes to Google Wallet</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer text-zinc-300">
                      <input type="checkbox" defaultChecked className="rounded accent-lime-400" />
                      <span>Sync appointment reminders to Google Calendar</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-lime-300 to-lime-400 hover:from-yellow-300 hover:to-lime-300 text-black font-extrabold text-xs transition-all shadow-lg shadow-yellow-400/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <GoogleWalletLogo className="w-4 h-4 shrink-0" />
                    <span>{isConnecting ? 'Connecting to Google Wallet...' : 'Connect Google Wallet'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
