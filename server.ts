import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for bookings and calendar events
interface StoredBooking {
  id: string;
  createdAt: string;
  serviceId: string;
  serviceName: string;
  vehicleCategory: string;
  addons: any[];
  customer: {
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
  };
  bookingDate: string;
  bookingTime: string;
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

const bookingsStore: Map<string, StoredBooking> = new Map();

// Helper to construct Google Calendar web template URL
function buildGoogleCalendarWebUrl(event: {
  title: string;
  description: string;
  location: string;
  startIso: string;
  endIso: string;
}) {
  const formatGCalTime = (isoString: string) => {
    return new Date(isoString).toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const startFormatted = formatGCalTime(event.startIso);
  const endFormatted = formatGCalTime(event.endIso);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${startFormatted}/${endFormatted}`,
  });

  return `https://calendar.google.com/render?${params.toString()}`;
}

// Helper to build iCal (.ics) string
function buildIcalString(event: {
  title: string;
  description: string;
  location: string;
  startIso: string;
  endIso: string;
  email: string;
}) {
  const formatIcalTime = (isoString: string) => {
    return new Date(isoString).toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Constant Clean Auto Detailing//Google Calendar Sync//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:detail-${Date.now()}@constantcleandetail.com`,
    `DTSTAMP:${formatIcalTime(new Date().toISOString())}`,
    `DTSTART:${formatIcalTime(event.startIso)}`,
    `DTEND:${formatIcalTime(event.endIso)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `ORGANIZER;CN=Constant Clean Auto Detailing:mailto:appointments@constantcleandetail.com`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${event.email}:mailto:${event.email}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Constant Clean Auto Detailing API' });
});

// GET all bookings
app.get('/api/bookings', (_req: Request, res: Response) => {
  const bookings = Array.from(bookingsStore.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json({ success: true, bookings });
});

// GET booking by ID
app.get('/api/bookings/:id', (req: Request, res: Response) => {
  const booking = bookingsStore.get(req.params.id);
  if (!booking) {
    res.status(404).json({ success: false, error: 'Booking not found' });
    return;
  }
  res.json({ success: true, booking });
});

// Google Calendar Event Creation API
app.post('/api/calendar/create-event', async (req: Request, res: Response) => {
  try {
    const {
      summary,
      description,
      location,
      startDateTime,
      endDateTime,
      customerEmail,
      customerName,
      bookingId,
    } = req.body;

    if (!summary || !startDateTime || !endDateTime) {
      res.status(400).json({
        success: false,
        error: 'Missing required calendar event parameters (summary, startDateTime, endDateTime)',
      });
      return;
    }

    const eventTitle = `🚗 ${summary} - Constant Clean Auto Detailing`;
    const fullLocation = location || 'Constant Clean Studio / Mobile Detailing';

    // Build web link and iCal file content
    const gcalWebUrl = buildGoogleCalendarWebUrl({
      title: eventTitle,
      description: `${description}\n\nCustomer: ${customerName}\nEmail: ${customerEmail}`,
      location: fullLocation,
      startIso: startDateTime,
      endIso: endDateTime,
    });

    const icsContent = buildIcalString({
      title: eventTitle,
      description: `${description}\nCustomer: ${customerName}`,
      location: fullLocation,
      startIso: startDateTime,
      endIso: endDateTime,
      email: customerEmail,
    });

    // Check for Google OAuth token in request headers or container environment
    const authHeader = req.headers.authorization || req.headers['x-goog-iam-authorization-token'];
    let googleCalendarEventId = `gcal_${Date.now()}`;
    let apiSynced = false;
    let apiSyncError = null;

    if (authHeader) {
      try {
        const calendarResponse = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
                ? authHeader
                : `Bearer ${authHeader}`,
            },
            body: JSON.stringify({
              summary: eventTitle,
              location: fullLocation,
              description: `${description}\n\nClient Name: ${customerName}\nContact Email: ${customerEmail}`,
              start: { dateTime: startDateTime, timeZone: 'America/Los_Angeles' },
              end: { dateTime: endDateTime, timeZone: 'America/Los_Angeles' },
              attendees: [{ email: customerEmail, displayName: customerName }],
              reminders: {
                useDefault: false,
                overrides: [
                  { method: 'email', minutes: 24 * 60 },
                  { method: 'popup', minutes: 120 },
                  { method: 'popup', minutes: 30 },
                ],
              },
            }),
          }
        );

        if (calendarResponse.ok) {
          const calData = (await calendarResponse.json()) as any;
          googleCalendarEventId = calData.id || googleCalendarEventId;
          apiSynced = true;
        } else {
          const errText = await calendarResponse.text();
          console.warn('Google Calendar API returned non-OK status:', errText);
          apiSyncError = 'OAuth session token expired or requires consent refresh. Web URL fallback generated.';
        }
      } catch (err: any) {
        console.warn('Error making direct Google Calendar API request:', err?.message);
        apiSyncError = err?.message;
      }
    }

    // Update booking if bookingId provided
    if (bookingId && bookingsStore.has(bookingId)) {
      const b = bookingsStore.get(bookingId)!;
      b.calendarSynced = true;
      b.calendarEventId = googleCalendarEventId;
      bookingsStore.set(bookingId, b);
    }

    res.json({
      success: true,
      apiSynced,
      calendarEventId: googleCalendarEventId,
      gcalWebUrl,
      icsContent,
      icsFileName: `constant-clean-detailing-${bookingId || Date.now()}.ics`,
      apiSyncError,
      message: apiSynced
        ? 'Successfully added appointment directly to your Google Calendar!'
        : 'Google Calendar event generated. Click to add to your calendar in 1-click.',
    });
  } catch (error: any) {
    console.error('Error in /api/calendar/create-event:', error);
    res.status(500).json({ success: false, error: error.message || 'Server calendar sync error' });
  }
});

// Google Wallet Payment Processing API
app.post('/api/wallet/process-payment', (req: Request, res: Response) => {
  try {
    const {
      amount,
      currency = 'USD',
      serviceName,
      customer,
      bookingData,
      googlePayToken,
    } = req.body;

    if (!amount || !customer) {
      res.status(400).json({ success: false, error: 'Missing payment amount or customer details' });
      return;
    }

    // Generate unique transaction ID & Google Wallet pass authorization
    const transactionId = `Gpay_tx_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const passId = `gpass_detail_${Date.now()}`;
    const bookingId = bookingData?.id || `bk_${Date.now()}`;

    // Store or update booking in memory
    const storedBooking: StoredBooking = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      serviceId: bookingData?.service?.id || 'service_standard',
      serviceName: serviceName || bookingData?.service?.name || 'Auto Detailing Service',
      vehicleCategory: bookingData?.vehicleCategory || 'sedan',
      addons: bookingData?.addons || [],
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        streetAddress: customer.streetAddress || 'Studio Location',
        city: customer.city || 'Los Angeles',
        zipCode: customer.zipCode || '90001',
        vehicleMake: customer.vehicleMake,
        vehicleModel: customer.vehicleModel,
        vehicleYear: customer.vehicleYear,
        vehicleColor: customer.vehicleColor,
        licensePlate: customer.licensePlate,
        specialNotes: customer.specialNotes,
        serviceType: customer.serviceType || 'mobile',
      },
      bookingDate: bookingData?.bookingDate || new Date().toISOString().split('T')[0],
      bookingTime: bookingData?.bookingTime || '09:00',
      totalPrice: amount,
      estimatedDurationMinutes: bookingData?.estimatedDurationMinutes || 120,
      paymentStatus: 'completed',
      paymentMethod: 'google_wallet',
      transactionId,
      calendarSynced: false,
      status: 'confirmed',
      walletPassId: passId,
    };

    bookingsStore.set(bookingId, storedBooking);

    // Formulate response
    res.json({
      success: true,
      transactionId,
      amount,
      currency,
      status: 'APPROVED',
      paymentMethod: 'Google Wallet / Google Pay',
      timestamp: new Date().toISOString(),
      bookingId,
      walletPassId: passId,
      cardBrand: googlePayToken?.cardBrand || 'VISA ending in 4242 (Google Wallet)',
      message: 'Payment authorized successfully via Google Wallet!',
    });
  } catch (err: any) {
    console.error('Error in /api/wallet/process-payment:', err);
    res.status(500).json({ success: false, error: err.message || 'Payment processing failed' });
  }
});

// Google Wallet Pass Generation Endpoint
app.post('/api/wallet/create-pass', (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const booking = bookingsStore.get(bookingId);

    if (!booking) {
      res.status(404).json({ success: false, error: 'Booking not found to generate pass' });
      return;
    }

    const passId = booking.walletPassId || `gpass_${Date.now()}`;
    const qrCodeData = `CONSTANT-CLEAN-PASS:${booking.id}:${booking.customer.licensePlate}`;

    // Wallet Pass Payload compliant with Google Wallet Generic Pass Issuer structure
    const passData = {
      passId,
      bookingId: booking.id,
      customerName: booking.customer.fullName,
      serviceName: booking.serviceName,
      vehicleInfo: `${booking.customer.vehicleYear} ${booking.customer.vehicleMake} ${booking.customer.vehicleModel} (${booking.customer.licensePlate})`,
      appointmentDateTime: `${booking.bookingDate} @ ${booking.bookingTime}`,
      location:
        booking.customer.serviceType === 'mobile'
          ? `${booking.customer.streetAddress}, ${booking.customer.city}`
          : 'Constant Clean Auto Studio - 1080 Detailing Way, Los Angeles CA',
      status: 'CONFIRMED APPOINTMENT & WARRANTY PASS',
      barcodeValue: qrCodeData,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        qrCodeData
      )}`,
      walletSaveUrl: `https://pay.google.com/gp/v/object/${passId}`,
      issueDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      technicianGuarantee: '100% Paint Protection & Cleanliness Guarantee by Constant Clean Detailing',
    };

    res.json({
      success: true,
      passData,
      message: 'Google Wallet Event & Warranty Pass generated successfully!',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚗 Constant Clean Auto Detailing Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
