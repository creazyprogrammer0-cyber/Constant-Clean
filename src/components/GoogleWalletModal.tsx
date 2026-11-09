import React, { useState, useEffect } from 'react';
import { GoogleWalletLogo } from './GoogleWalletLogo';
import {
  CustomerInfo,
  DetailService,
  DetailingBooking,
  GmailUserAccount,
  GoogleWalletCard,
  ServiceAddon,
  VehicleCategory,
} from '../types';
import {
  calculateTotalDuration,
  calculateTotalPrice,
  formatCurrency,
  formatDateString,
  formatTimeSlot,
  openGoogleWalletApp,
} from '../utils/helpers';
import {
  Wallet,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  Lock,
  Download,
  ExternalLink,
  Sparkles,
  Loader2,
  AlertCircle,
  QrCode,
} from 'lucide-react';

interface GoogleWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: DetailService;
  selectedVehicle: VehicleCategory;
  selectedAddons: ServiceAddon[];
  customerInfo: CustomerInfo;
  selectedDate: string;
  selectedTime: string;
  user?: GmailUserAccount;
  onPaymentSuccess: (booking: DetailingBooking) => void;
}

export const GoogleWalletModal: React.FC<GoogleWalletModalProps> = ({
  isOpen,
  onClose,
  selectedService,
  selectedVehicle,
  selectedAddons,
  customerInfo,
  selectedDate,
  selectedTime,
  user,
  onPaymentSuccess,
}) => {
  // Filter real connected payment cards from user's Google Wallet
  const paymentCards: GoogleWalletCard[] = (user?.isLoggedIn && user?.googleWalletConnected)
    ? (user.walletCards || []).filter((c) => c.type === 'payment' || c.type === 'card' || !c.type)
    : [];

  const [selectedCardId, setSelectedCardId] = useState<string>(() => {
    const primary = paymentCards.find((c) => c.isPrimary);
    return primary ? primary.id : paymentCards[0]?.id || '';
  });

  useEffect(() => {
    if (paymentCards.length > 0 && (!selectedCardId || !paymentCards.some((c) => c.id === selectedCardId))) {
      const primary = paymentCards.find((c) => c.isPrimary);
      setSelectedCardId(primary ? primary.id : paymentCards[0].id);
    }
  }, [paymentCards, selectedCardId]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<DetailingBooking | null>(null);
  const [calendarSyncResult, setCalendarSyncResult] = useState<{
    gcalWebUrl?: string;
    icsContent?: string;
    icsFileName?: string;
    apiSynced?: boolean;
    message?: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalPrice = calculateTotalPrice(
    selectedService,
    selectedVehicle,
    selectedAddons
  );
  const totalDuration = calculateTotalDuration(
    selectedService,
    selectedAddons
  );

  const activeCard = paymentCards.find((c) => c.id === selectedCardId) || paymentCards[0];

  const handleExecutePayment = async () => {
    if (paymentCards.length === 0) {
      openGoogleWalletApp();
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Process payment via Google Wallet endpoint
      const payResponse = await fetch('/api/wallet/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          currency: 'USD',
          serviceName: selectedService.name,
          customer: customerInfo,
          bookingData: {
            service: selectedService,
            vehicleCategory: selectedVehicle,
            addons: selectedAddons,
            bookingDate: selectedDate,
            bookingTime: selectedTime,
            estimatedDurationMinutes: totalDuration,
          },
          googlePayToken: {
            cardBrand: activeCard
              ? `${activeCard.brand} (${activeCard.title} ${activeCard.cardNumberOrId})`
              : 'Google Pay Connected Wallet Card',
          },
        }),
      });

      const payData = await payResponse.json();

      if (!payData.success) {
        throw new Error(payData.error || 'Payment processing failed');
      }

      // Construct booking object
      const newBooking: DetailingBooking = {
        id: payData.bookingId,
        createdAt: new Date().toISOString(),
        service: selectedService,
        vehicleCategory: selectedVehicle,
        addons: selectedAddons,
        customer: customerInfo,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        totalPrice,
        estimatedDurationMinutes: totalDuration,
        paymentStatus: 'completed',
        paymentMethod: 'google_wallet',
        transactionId: payData.transactionId,
        calendarSynced: false,
        status: 'confirmed',
        walletPassId: payData.walletPassId,
      };

      // 2. Automatically sync event to Google Calendar
      const [startHour, startMin] = selectedTime.split(':').map(Number);
      const startDateObj = new Date(selectedDate);
      startDateObj.setHours(startHour, startMin, 0, 0);

      const endDateObj = new Date(startDateObj);
      endDateObj.setMinutes(endDateObj.getMinutes() + totalDuration);

      const calendarRes = await fetch('/api/calendar/create-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: `${selectedService.name} (${customerInfo.vehicleMake} ${customerInfo.vehicleModel})`,
          description: `Apex Auto Detailing Service\nVehicle: ${customerInfo.vehicleYear} ${customerInfo.vehicleMake} ${customerInfo.vehicleModel} (${customerInfo.licensePlate})\nAdd-ons: ${selectedAddons.map((a) => a.name).join(', ') || 'None'}\nPayment: Google Wallet (${payData.transactionId})`,
          location:
            customerInfo.serviceType === 'mobile'
              ? `${customerInfo.streetAddress}, ${customerInfo.city}`
              : 'Apex Auto Studio - 1080 Detailing Way, Los Angeles',
          startDateTime: startDateObj.toISOString(),
          endDateTime: endDateObj.toISOString(),
          customerEmail: customerInfo.email,
          customerName: customerInfo.fullName,
          bookingId: newBooking.id,
        }),
      });

      const calData = await calendarRes.json();
      if (calData.success) {
        newBooking.calendarSynced = true;
        newBooking.calendarEventId = calData.calendarEventId;
        setCalendarSyncResult(calData);
      }

      setCompletedBooking(newBooking);
      setPaymentCompleted(true);
      onPaymentSuccess(newBooking);
    } catch (err: any) {
      console.error('Payment / Calendar error:', err);
      setErrorMessage(err.message || 'Payment processing encountered an issue.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadIcalFile = () => {
    if (!calendarSyncResult?.icsContent) return;
    const blob = new Blob([calendarSyncResult.icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = calendarSyncResult.icsFileName || 'apex-appointment.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f0f13] border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-white space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#3a3a3a] text-zinc-300 hover:text-white hover:bg-[#4a4a4a] transition-colors border border-zinc-600"
        >
          <X className="w-5 h-5" />
        </button>

        {!paymentCompleted ? (
          /* PAYMENT FORM STEP */
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0a0a0d] border border-zinc-700 flex items-center justify-center p-2 shadow-lg shadow-yellow-300/10">
                <GoogleWalletLogo className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Google Wallet Checkout</h3>
                <p className="text-xs text-zinc-400">Fast, secure payment & pass creation</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-[#050505] border border-zinc-800 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold border-b border-zinc-800 pb-2">
                <span className="text-zinc-200">{selectedService.name}</span>
                <span className="text-yellow-300 font-extrabold">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="text-xs text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span className="text-zinc-200 font-medium">
                    {customerInfo.vehicleMake} {customerInfo.vehicleModel} ({selectedVehicle.toUpperCase()})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Appointment:</span>
                  <span className="text-zinc-200 font-medium">
                    {formatDateString(selectedDate)} @ {formatTimeSlot(selectedTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-zinc-200 font-medium">
                    {customerInfo.serviceType === 'mobile' ? 'Mobile Detailing' : 'Studio Drop-off'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                  Select Google Wallet Stored Method:
                </label>
                <button
                  type="button"
                  onClick={openGoogleWalletApp}
                  className="text-xs font-bold text-yellow-300 hover:text-yellow-200 flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20 hover:bg-yellow-400/20 transition-all cursor-pointer shrink-0"
                  title="Open Official Google Wallet App"
                >
                  <span>Manage Cards</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {paymentCards.length > 0 ? (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {paymentCards.map((card) => {
                    const isSelected = selectedCardId === card.id;
                    return (
                      <div
                        key={card.id}
                        onClick={() => setSelectedCardId(card.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-zinc-800 border-yellow-300 ring-1 ring-yellow-300/30'
                            : 'bg-[#050505] border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#0a0a0d] border border-zinc-700 flex items-center justify-center shrink-0">
                            <GoogleWalletLogo className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-white block truncate">{card.title}</span>
                              {card.isPrimary && (
                                <span className="px-1.5 py-0.2 rounded bg-yellow-400 text-black font-extrabold text-[9px] shrink-0">
                                  PRIMARY
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-400 block mt-0.5">
                              {card.cardNumberOrId} • {card.balanceOrStatus || card.expiryOrDetail}
                            </span>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0 ml-2" />}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[#050505] border border-zinc-800 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">No Connected Cards in Google Wallet</p>
                    <p className="text-[11px] text-zinc-400 mt-1 max-w-xs mx-auto">
                      Add or manage your payment cards in the official Google Wallet mobile app to continue.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openGoogleWalletApp}
                    className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                  >
                    <GoogleWalletLogo className="w-4 h-4 shrink-0" />
                    <span>Manage Cards in Google Wallet App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Official Google Pay Button */}
            <button
              onClick={handleExecutePayment}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-black hover:bg-zinc-900 text-white font-extrabold text-base border border-zinc-700 shadow-xl flex items-center justify-center space-x-3 transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-yellow-300" />
                  <span>Processing Google Wallet...</span>
                </>
              ) : (
                <>
                  <span className="text-lg font-black text-yellow-300">G</span>
                  <span>Pay with Google Wallet ({formatCurrency(totalPrice)})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-zinc-400">
              <Lock className="w-3.5 h-3.5 text-lime-400" />
              <span>Encrypted payment authorization tokenized via Google Pay</span>
            </div>
          </div>
        ) : (
          /* PAYMENT SUCCESS & GOOGLE WALLET + CALENDAR SYNC CONFIRMATION */
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-lime-400">
                Payment Authorized & Confirmed
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Your Appointment Is Scheduled!
              </h3>
              <p className="text-xs text-zinc-300 mt-1">
                Transaction ID: <span className="font-mono text-yellow-300">{completedBooking?.transactionId}</span>
              </p>
            </div>

            {/* Wallet Pass Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#18181c] via-[#121216] to-[#18181c] border border-yellow-300/40 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-lime-400" />
                  <span className="text-xs font-bold uppercase text-white">Google Wallet Digital Pass</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-lime-400/20 text-lime-300 border border-lime-400/30 font-bold">
                  ACTIVE PASS
                </span>
              </div>

              <div className="text-xs text-zinc-200 space-y-1">
                <p className="font-bold text-white text-sm">{completedBooking?.service.name}</p>
                <p className="text-zinc-400">
                  {completedBooking?.customer.vehicleYear} {completedBooking?.customer.vehicleMake} {completedBooking?.customer.vehicleModel} ({completedBooking?.customer.licensePlate})
                </p>
                <p className="text-yellow-300 font-bold">
                  {formatDateString(completedBooking?.bookingDate || '')} @ {formatTimeSlot(completedBooking?.bookingTime || '')}
                </p>
              </div>

              {/* QR Barcode mock preview */}
              <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                <div className="flex items-center space-x-2">
                  <QrCode className="w-8 h-8 text-white" />
                  <span className="text-[10px] text-zinc-400 font-mono">PASS-QR: {completedBooking?.id}</span>
                </div>
                <button
                  onClick={() => alert(`Google Wallet Pass Saved! Pass ID: ${completedBooking?.walletPassId}`)}
                  className="px-4 py-2 rounded-xl bg-yellow-300 hover:bg-yellow-200 text-black font-extrabold text-xs flex items-center space-x-1 shadow-md"
                >
                  <Wallet className="w-3.5 h-3.5 text-black mr-1" />
                  <span>Save to Wallet</span>
                </button>
              </div>
            </div>

            {/* Calendar Sync Status */}
            <div className="p-4 rounded-2xl bg-[#050505] border border-zinc-800 text-left space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-white">
                <Calendar className="w-4 h-4 text-lime-400" />
                <span>Google Calendar Sync Status:</span>
              </div>

              <p className="text-xs text-zinc-300">
                {calendarSyncResult?.message || 'Calendar event generated for your appointment.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                {calendarSyncResult?.gcalWebUrl && (
                  <a
                    href={calendarSyncResult.gcalWebUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <span>Open in Google Calendar</span>
                    <ExternalLink className="w-3.5 h-3.5 text-black" />
                  </a>
                )}

                {calendarSyncResult?.icsContent && (
                  <button
                    onClick={downloadIcalFile}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all border border-zinc-600"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .ICS File</span>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-300 via-lime-300 to-lime-400 hover:from-yellow-200 hover:to-lime-300 text-black font-extrabold text-sm shadow-lg shadow-yellow-300/20 transition-all"
            >
              Done & View My Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
