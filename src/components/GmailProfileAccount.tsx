import React, { useState, useRef, useEffect } from 'react';
import { DetailingBooking, GmailUserAccount, GoogleWalletCard } from '../types';
import { formatTimeSlot } from '../utils/helpers';
import { GoogleWalletLogo } from './GoogleWalletLogo';
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Car,
  Navigation,
  ShieldCheck,
  User,
  Mail,
  KeyRound,
  Check,
  Sparkles,
  Search,
  X,
  Settings,
} from 'lucide-react';

interface GmailProfileAccountProps {
  user: GmailUserAccount;
  bookings?: DetailingBooking[];
  onLogin: (email: string, name: string, avatarUrl?: string) => void;
  onLogout?: () => void;
  onNavigateToWallet?: () => void;
  onNavigateToBook?: () => void;
  onAddCard?: (card: Omit<GoogleWalletCard, 'id'>) => void;
  onRemoveCard?: (id: string) => void;
}

export function BrightRedMapMarker({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#FF0000"
        stroke="#FF0000"
        strokeWidth="1.2"
      />
      <circle cx="12" cy="9" r="2.8" fill="#000000" stroke="#FFFFFF" strokeWidth="0.6" />
    </svg>
  );
}

export function GoogleMapsLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return <BrightRedMapMarker className={className} />;
}

export const GmailProfileAccount: React.FC<GmailProfileAccountProps> = ({
  user,
  bookings = [],
  onLogin,
  onNavigateToBook,
}) => {
  // Login form state
  const [loginEmail, setLoginEmail] = useState('macmillins4@gmail.com');
  const [loginName, setLoginName] = useState('Mac Millins');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [selectedAvatar, setSelectedAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState('August 2026');
  const [selectedDay, setSelectedDay] = useState<number>(2);

  // Suggested Google Official Maps Verified Real Addresses Database (Bay Area Only)
  const OFFICIAL_GOOGLE_MAPS_DATABASE = [
    '1 Market St, San Francisco, CA 94105',
    '200 Spear St, San Francisco, CA 94105',
    '500 Howard St, San Francisco, CA 94105',
    '1 California St, San Francisco, CA 94111',
    '50 California St, San Francisco, CA 94111',
    '450 Sutter St, San Francisco, CA 94108',
    '600 Montgomery St, San Francisco, CA 94111',
    '100 Van Ness Ave, San Francisco, CA 94102',
    '1355 Market St, San Francisco, CA 94103',
    '1455 Market St, San Francisco, CA 94103',
    '888 Brannan St, San Francisco, CA 94103',
    '500 Terry A Francois Blvd, San Francisco, CA 94158',
    '1 Apple Park Way, Cupertino, CA 95014',
    '1 Infinite Loop, Cupertino, CA 95014',
    '1600 Amphitheatre Pkwy, Mountain View, CA 94043',
    '400 Castro St, Mountain View, CA 94041',
    '500 University Ave, Palo Alto, CA 94301',
    '150 Forest Ave, Palo Alto, CA 94301',
    '3000 El Camino Real, Palo Alto, CA 94306',
    '3400 Hillview Ave, Palo Alto, CA 94304',
    '1 Hacker Way, Menlo Park, CA 94025',
    '1100 El Camino Real, Redwood City, CA 94063',
    '500 Oracle Pkwy, Redwood City, CA 94065',
    '100 Bayview Point, San Mateo, CA 94403',
    '1 First St, San Jose, CA 95113',
    '50 S Market St, San Jose, CA 95113',
    '200 E Santa Clara St, San Jose, CA 95113',
    '2880 Zanker Rd, San Jose, CA 95134',
    '2150 Shattuck Ave, Berkeley, CA 94704',
    '1 Frank H Ogawa Plaza, Oakland, CA 94612',
    '1901 Harrison St, Oakland, CA 94612',
    '3000 Mission College Blvd, Santa Clara, CA 95054',
    '2200 Mission College Blvd, Santa Clara, CA 95054',
    '100 W Evelyn Ave, Sunnyvale, CA 94086',
    '1000 Enterprise Way, Sunnyvale, CA 94089',
    '39300 Civic Center Dr, Fremont, CA 94538',
    '100 Pringle Ave, Walnut Creek, CA 94596',
    '1000 4th St, San Rafael, CA 94901',
    '100 Cherry Ave, San Bruno, CA 94066'
  ];

  // Primary Bay Area Cities to Zip Code and State Lookup Map for Accurate Suggestions
  const CITY_ZIP_MAP: Record<string, { state: string; zip: string; defaultStreet: string }> = {
    'san francisco': { state: 'CA', zip: '94105', defaultStreet: 'Market St' },
    'san jose': { state: 'CA', zip: '95113', defaultStreet: '1st St' },
    'oakland': { state: 'CA', zip: '94612', defaultStreet: 'Broadway' },
    'palo alto': { state: 'CA', zip: '94301', defaultStreet: 'University Ave' },
    'mountain view': { state: 'CA', zip: '94043', defaultStreet: 'Amphitheatre Pkwy' },
    'cupertino': { state: 'CA', zip: '95014', defaultStreet: 'Apple Park Way' },
    'redwood city': { state: 'CA', zip: '94063', defaultStreet: 'El Camino Real' },
    'san mateo': { state: 'CA', zip: '94403', defaultStreet: 'Bayview Point' },
    'berkeley': { state: 'CA', zip: '94704', defaultStreet: 'Shattuck Ave' },
    'santa clara': { state: 'CA', zip: '95054', defaultStreet: 'Mission College Blvd' },
    'sunnyvale': { state: 'CA', zip: '94086', defaultStreet: 'Evelyn Ave' },
    'fremont': { state: 'CA', zip: '94538', defaultStreet: 'Civic Center Dr' },
    'walnut creek': { state: 'CA', zip: '94596', defaultStreet: 'Pringle Ave' },
    'san rafael': { state: 'CA', zip: '94901', defaultStreet: '4th St' }
  };

  // Helper to format raw user address string with appropriate capitalizations and commas
  const formatAddressCapitalization = (addr: string): string => {
    if (!addr || !addr.trim()) return '';
    let s = addr.trim();

    // Check if exact match in database
    const exactDb = OFFICIAL_GOOGLE_MAPS_DATABASE.find(
      (item) => item.toLowerCase() === s.toLowerCase()
    );
    if (exactDb) return exactDb;

    const stateCodes = new Set(['ca', 'ny', 'wa', 'il', 'tx', 'fl', 'az', 'co', 'nv', 'or', 'ga', 'nc', 'va', 'ma', 'pa', 'oh', 'mi']);
    const streetTypes: Record<string, string> = {
      blvd: 'Blvd', st: 'St', ave: 'Ave', rd: 'Rd', dr: 'Dr', pkwy: 'Pkwy', way: 'Way', ct: 'Ct', ln: 'Ln', pl: 'Pl', hwy: 'Hwy', cir: 'Cir', terrace: 'Terrace'
    };

    const words = s.split(/\s+/).map((word) => {
      const hasComma = word.endsWith(',');
      const cleanWord = word.replace(/[,.]/g, '');
      const lower = cleanWord.toLowerCase();
      let res = cleanWord;

      if (stateCodes.has(lower) || lower === 'usa' || lower === 'us') {
        res = cleanWord.toUpperCase();
      } else if (streetTypes[lower]) {
        res = streetTypes[lower];
      } else if (/^\d+([a-z]{2})?$/i.test(cleanWord)) {
        res = cleanWord;
      } else if (cleanWord.length > 0) {
        res = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1).toLowerCase();
      }

      return hasComma ? res + ',' : res;
    });

    let formatted = words.join(' ');

    // Add missing commas if not present e.g., "Blvd Santa Monica" -> "Blvd, Santa Monica"
    formatted = formatted.replace(/\b(Blvd|St|Ave|Rd|Dr|Pkwy|Way|Ct|Ln|Pl|Hwy|Cir|Terrace)\s+([A-Z])/g, '$1, $2');
    formatted = formatted.replace(/\b([A-Za-z]+)\s+([A-Z]{2})\b/g, '$1, $2');
    formatted = formatted.replace(/,\s*,/g, ',');

    return formatted;
  };

  // Helper to generate matches with full street address, city, state, and zip code
  const getFullAddressMatches = (input: string): string[] => {
    const q = input.trim();
    if (!q) return OFFICIAL_GOOGLE_MAPS_DATABASE.map((item) => formatAddressCapitalization(item));

    const formattedQuery = formatAddressCapitalization(q);
    const qLower = q.toLowerCase();

    // Extract significant query tokens (ignoring standard filler suffix/state words unless they are the only tokens)
    const ignoreWords = new Set([
      'st', 'street', 'ave', 'avenue', 'blvd', 'boulevard', 'rd', 'road', 'dr', 'drive',
      'pkwy', 'parkway', 'way', 'ct', 'court', 'ln', 'lane', 'pl', 'place', 'hwy', 'highway',
      'cir', 'circle', 'terrace', 'ca', 'california', 'usa', 'us'
    ]);

    const rawTokens = qLower
      .split(/[\s,.]+/)
      .filter((t) => t.length > 0);

    const sigTokens = rawTokens.filter((t) => !ignoreWords.has(t));
    const tokensToUse = sigTokens.length > 0 ? sigTokens : rawTokens;

    // Filter database items that contain significant tokens matching the search query
    const matchedDb = OFFICIAL_GOOGLE_MAPS_DATABASE.filter((addr) => {
      const addrLower = addr.toLowerCase();

      // Check full string substring match
      if (addrLower.includes(qLower)) return true;

      // Check if all significant query tokens are present in the database address
      return tokensToUse.every((token) => {
        if (/^\d+$/.test(token)) {
          // If token is numeric (e.g. house number '1' or '500' or zip '94105')
          const words = addrLower.split(/[\s,.]+/);
          return words.some((w) => w === token || (w.startsWith(token) && words[0] === w));
        }
        return addrLower.includes(token);
      });
    });

    // Score matched DB items for accurate sorting
    const scoredDb = matchedDb.map((addr) => {
      const addrLower = addr.toLowerCase();
      let score = 0;
      if (addrLower === qLower) score += 10000;
      else if (addrLower.startsWith(qLower)) score += 5000;
      else if (addrLower.includes(qLower)) score += 2000;

      tokensToUse.forEach((token) => {
        if (addrLower.includes(token)) score += 100;
      });
      return { addr, score };
    });

    scoredDb.sort((a, b) => b.score - a.score);
    const sortedDbResults = scoredDb.map((item) => formatAddressCapitalization(item.addr));

    const results: string[] = [...sortedDbResults];

    // If formattedQuery contains a typed house number or street name, add formatted typed address as matching suggestion
    let cleanSynth = formatAddressCapitalization(q);
    if (cleanSynth && cleanSynth.length >= 3) {
      // Force state to CA if non-CA state is present or missing
      cleanSynth = cleanSynth.replace(/,\s*(?!CA\b)[A-Z]{2}\b/gi, ', CA');
      if (!/\bCA\b/.test(cleanSynth)) {
        if (!/\b\d{5}\b/.test(cleanSynth)) {
          cleanSynth = `${cleanSynth}, CA 94105`;
        } else {
          cleanSynth = cleanSynth.replace(/(\b\d{5}\b)/, 'CA $1');
        }
      }

      if (!results.some((r) => r.toLowerCase() === cleanSynth.toLowerCase())) {
        const hasHouseNum = /^\d+\s+[a-zA-Z]/.test(cleanSynth);
        if (hasHouseNum) {
          results.unshift(cleanSynth);
        } else if (results.length === 0) {
          results.push(cleanSynth);
        }
      }
    }

    // Filter to ensure ONLY California (CA) addresses are returned
    return results.filter((addr) => /\bCA\b/.test(addr));
  };

  // Custom Map Address & Verified Address State
  const addressInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [customAddress, setCustomAddress] = useState('1 Market St, San Francisco, CA 94105');
  const [verifiedAddress, setVerifiedAddress] = useState('1 Market St, San Francisco, CA 94105');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Helper to predict complete full California address (house #, street name, city, state: CA, zip code)
  const predictFullAddress = (input: string): string => {
    const raw = input.trim();
    if (!raw) return '1 Market St, San Francisco, CA 94105';

    // 1. Try finding an official verified California database match first
    const matches = getFullAddressMatches(raw);
    if (matches.length > 0 && /\bCA\b/.test(matches[0])) {
      return matches[0];
    }

    // 2. Synthesize a complete California address (house #, street name, city, state: CA, zip code)
    let clean = formatAddressCapitalization(raw);

    // Replace any non-CA state code with CA
    clean = clean.replace(/,\s*(?!CA\b)[A-Z]{2}\b/gi, ', CA');

    const hasZip = /\b\d{5}(-\d{4})?\b/.test(clean);
    const hasCA = /\bCA\b/.test(clean);
    const hasHouse = /^\d+\s+/.test(clean);

    if (hasZip && hasCA && hasHouse) {
      return clean;
    }

    // Check if query mentions a known California city from CITY_ZIP_MAP
    const cleanLower = clean.toLowerCase();
    for (const [cityKey, cityData] of Object.entries(CITY_ZIP_MAP)) {
      if (cleanLower.includes(cityKey)) {
        const cityNameCap = cityKey
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        if (hasHouse) {
          const streetPart = clean.split(new RegExp(cityNameCap, 'i'))[0].replace(/,$/, '').trim();
          if (streetPart) {
            return `${streetPart}, ${cityNameCap}, CA ${cityData.zip}`;
          }
          return `100 ${cityData.defaultStreet}, ${cityNameCap}, CA ${cityData.zip}`;
        } else {
          return `100 ${clean.replace(/,$/, '').trim()}, ${cityNameCap}, CA ${cityData.zip}`;
        }
      }
    }

    // Fallback California address structure guaranteed (house number, street name, city, CA, zip code)
    if (hasHouse) {
      if (clean.includes(', CA')) {
        const parts = clean.split(', CA');
        const streetAndCity = parts[0];
        if (streetAndCity.includes(',')) {
          return `${streetAndCity}, CA 94105`;
        }
        return `${streetAndCity}, San Francisco, CA 94105`;
      }
      return `${clean}, San Francisco, CA 94105`;
    }

    const hasStreetSuffix = /\b(blvd|st|ave|rd|dr|pkwy|way|ct|ln|pl|hwy|cir|terrace)\b/i.test(clean);
    const formattedStreet = hasStreetSuffix ? clean : `${clean} St`;
    return `100 ${formattedStreet}, San Francisco, CA 94105`;
  };

  // Alias for red marker address predictor
  const guessRedMarkerAddress = (input: string): string => predictFullAddress(input);

  // Hide suggestions list when clicking outside search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchAddress = () => {
    if (!customAddress.trim()) return;
    const matches = getFullAddressMatches(customAddress);
    if (matches.length > 0) {
      setCustomAddress(matches[0]);
      setVerifiedAddress(matches[0]);
    } else {
      const formatted = formatAddressCapitalization(customAddress.trim());
      setCustomAddress(formatted);
      setVerifiedAddress(formatted);
    }
    setShowSuggestions(false);
  };

  const handleSelectSuggestedAddress = (addr: string) => {
    // If the clicked address is already selected, deselect it
    if (verifiedAddress === addr || customAddress === addr) {
      setCustomAddress('');
      setVerifiedAddress('');
    } else {
      setCustomAddress(addr);
      setVerifiedAddress(addr);
      setShowSuggestions(false);
    }
  };

  const handleAddressInputClick = () => {
    setShowSuggestions(true);
    if (addressInputRef.current) {
      addressInputRef.current.focus();
    }
  };

  // State for events manually entered by the user
  const [manualEvents, setManualEvents] = useState<Array<{
    id: string;
    day: number;
    dateStr: string;
    time: string;
    title: string;
    vehicle: string;
    location: string;
    status: string;
  }>>(() => {
    try {
      const saved = localStorage.getItem('manual_calendar_events');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Modal / form state for adding a manual event directly
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDate, setManualDate] = useState('2026-08-15');
  const [manualTime, setManualTime] = useState('10:00 AM - 12:00 PM');
  const [manualVehicle, setManualVehicle] = useState('');
  const [manualLocation, setManualLocation] = useState('');

  // Transform manually booked appointments from booking system
  const bookingEvents = (bookings || [])
    .filter((b) => b.status !== 'cancelled')
    .map((b) => {
      let dayNum = 15;
      if (b.bookingDate) {
        const parts = b.bookingDate.split('-');
        if (parts.length === 3) {
          dayNum = parseInt(parts[2], 10) || 15;
        }
      }
      return {
        id: b.id,
        day: dayNum,
        dateStr: b.bookingDate,
        time: b.bookingTime ? formatTimeSlot(b.bookingTime) : '09:00 AM',
        title: b.service?.name || 'Detailing Appointment',
        vehicle: `${b.customer?.vehicleYear || ''} ${b.customer?.vehicleMake || ''} ${b.customer?.vehicleModel || ''} (${b.customer?.licensePlate || ''})`.trim() || 'Vehicle Detailing',
        location: b.customer?.serviceType === 'mobile'
          ? `${b.customer?.streetAddress || ''}, ${b.customer?.city || ''}`
          : 'Constant Clean Studio • 100 Wilshire Blvd, Santa Monica, CA',
        status: 'Confirmed & Synced',
      };
    });

  // Combined list of ONLY manually entered upcoming events
  const appointments = [...manualEvents, ...bookingEvents].reduce((acc, evt) => {
    if (!acc.some((item) => item.id === evt.id)) {
      acc.push(evt);
    }
    return acc;
  }, [] as typeof manualEvents);

  const handleCreateManualEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const parts = manualDate.split('-');
    const dayNum = parts.length === 3 ? parseInt(parts[2], 10) : 15;

    const newEvt = {
      id: 'manual-' + Date.now(),
      day: dayNum,
      dateStr: manualDate,
      time: manualTime.trim() || '10:00 AM - 12:00 PM',
      title: manualTitle.trim(),
      vehicle: manualVehicle.trim() || 'Vehicle Detailing',
      location: manualLocation.trim() || verifiedAddress || 'San Francisco, CA',
      status: 'Manually Entered',
    };

    const updated = [newEvt, ...manualEvents];
    setManualEvents(updated);
    try {
      localStorage.setItem('manual_calendar_events', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save manual event:', err);
    }
    setManualTitle('');
    setManualVehicle('');
    setManualLocation('');
    setIsAddEventModalOpen(false);
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      onLogin(loginEmail, loginName, selectedAvatar);
      setIsLoggingIn(false);
    }, 600);
  };

  const handleAddToGCal = (title: string, dateStr: string, location: string) => {
    const encodedTitle = encodeURIComponent(title);
    const encodedLoc = encodeURIComponent(location);
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&location=${encodedLoc}&details=Constant+Clean+Auto+Detailing+Service+Appointment`;
    window.open(gcalUrl, '_blank');
  };

  // IF NOT LOGGED IN: SHOW GMAIL STYLE LOGIN PAGE
  if (!user.isLoggedIn) {
    return (
      <div className="py-12 px-4 max-w-xl mx-auto">
        <div className="bg-[#18181c] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Accent glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Official Google & Gmail Header Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-zinc-700">
              {/* Google G multi-color icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-xs font-bold tracking-tight text-white">Google Accounts</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign in with Gmail
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto">
              Use your Google account to log in and automatically sync your <span className="text-lime-300 font-semibold">Official Google Wallet</span> & Calendar.
            </p>
          </div>

          {/* Wallet Auto-Connect Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-zinc-900 border border-blue-500/30 flex items-center space-x-3.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
              <GoogleWalletLogo className="w-6 h-6" />
            </div>
            <div className="text-xs">
              <p className="font-extrabold text-white">Instant Google Wallet Sync</p>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Signing in automatically connects all your Google Wallet payment cards, passes, & vehicle keys.
              </p>
            </div>
          </div>

          {/* Quick Sign-In Profile Buttons */}
          <div className="space-y-3">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              Select Profile Picture
            </label>
            <div className="flex items-center justify-center space-x-3">
              {sampleAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`relative p-1 rounded-full transition-all ${
                    selectedAvatar === url
                      ? 'ring-2 ring-yellow-400 scale-110'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={url}
                    alt="Avatar choice"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {selectedAvatar === url && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-yellow-400 text-black flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
                  placeholder="Mac Millins"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Gmail Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
                  placeholder="your.email@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-lime-300 to-lime-400 hover:from-yellow-300 hover:to-lime-300 text-black font-extrabold text-xs transition-all shadow-lg shadow-yellow-400/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
              </svg>
              <span>{isLoggingIn ? 'Signing in & Syncing Wallet...' : 'Sign in with Google / Gmail'}</span>
            </button>
          </form>

          {/* Footnote */}
          <p className="text-center text-[11px] text-zinc-500">
            Protected by Google Security • Connected with Google Wallet Pass Services
          </p>
        </div>
      </div>
    );
  }

  // LOGGED IN VIEW: OFFICIAL GMAIL / GOOGLE ACCOUNT PROFILE PAGE (WITH GMAIL INFO AT TOP)
  return (
    <div className="py-6 px-3 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Top Banner: Gmail User Profile Information Header */}
      <div className="bg-[#18181c] border border-zinc-800 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-yellow-400 shadow-md"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-lime-400 border-2 border-[#18181c] flex items-center justify-center text-black">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
              <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[10px] font-bold uppercase tracking-wider">
                Gmail Account
              </span>
            </div>
            <p className="text-zinc-400 text-xs font-mono mt-0.5">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1 text-[11px] text-lime-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Google Connected & Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-yellow-400 hover:text-yellow-300 border border-zinc-700 font-extrabold text-xs transition-all shadow-md flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-yellow-400" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* 4 Section Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Google Calendar Widget (Top Left) */}
        <div className="bg-[#18181c] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-extrabold text-white">Google Calendar</h3>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="font-bold text-white mr-1">{currentMonth}</span>
                <button
                  onClick={() => setCurrentMonth('July 2026')}
                  className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCurrentMonth('August 2026')}
                  className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Calendar Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-yellow-400 uppercase">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-xs">
              <div className="p-1.5 text-center text-lime-400/30">26</div>
              <div className="p-1.5 text-center text-lime-400/30">27</div>
              <div className="p-1.5 text-center text-lime-400/30">28</div>
              <div className="p-1.5 text-center text-lime-400/30">29</div>
              <div className="p-1.5 text-center text-lime-400/30">30</div>
              <div className="p-1.5 text-center text-lime-400/30">31</div>

              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const hasAppt = appointments.some((a) => a.day === day);
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`p-1.5 text-center rounded-lg font-bold transition-all relative ${
                      isSelected || hasAppt
                        ? 'bg-gradient-to-r from-lime-950/40 via-[#0a0a0d] to-lime-950/40 text-white font-extrabold border-2 border-yellow-400 shadow-sm shadow-yellow-400/20'
                        : 'text-lime-400 hover:bg-zinc-800'
                    }`}
                  >
                    <span className={isSelected || hasAppt ? 'text-white font-black' : ''}>{day}</span>
                    {(hasAppt || isSelected) && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Event on Schedule Card in Quadrant 1 */}
            {(() => {
              if (appointments.length === 0) {
                return (
                  <div className="p-4 rounded-xl border-2 border-yellow-400/80 shadow-sm shadow-yellow-400/20 bg-gradient-to-r from-yellow-950/20 via-[#0a0a0d] to-yellow-950/20 space-y-2 mt-3 text-center">
                    <div className="flex items-center justify-center space-x-1.5 text-yellow-400 font-extrabold uppercase text-[10px] tracking-wider">
                      <CalendarIcon className="w-3.5 h-3.5 text-lime-400" />
                      <span>Next Event on Schedule</span>
                    </div>
                    <p className="text-sm font-black text-white pt-1">Please book an appointment</p>
                    <p className="text-[11px] text-zinc-400">No upcoming events found on your schedule.</p>
                    {onNavigateToBook && (
                      <button
                        type="button"
                        onClick={onNavigateToBook}
                        className="mt-1 px-3.5 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md inline-flex items-center space-x-1.5 cursor-pointer"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Book an Appointment</span>
                      </button>
                    )}
                  </div>
                );
              }

              const selectedAppt = appointments.find((a) => a.day === selectedDay) || appointments[0];
              const timeParts = selectedAppt.time.split(' ');
              const timeDigits = timeParts[0];
              const timeAmPm = timeParts[1] || '';

              return (
                <div className="p-3.5 rounded-xl border-2 border-yellow-400 shadow-sm shadow-yellow-400/20 bg-gradient-to-r from-lime-950/40 via-[#0a0a0d] to-lime-950/40 space-y-2 mt-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase text-yellow-400 tracking-wider flex items-center space-x-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-lime-400" />
                      <span>Next Event on Schedule</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-lime-400/15 border border-yellow-400/40 font-mono text-[11px] font-extrabold flex items-center space-x-1 whitespace-nowrap shrink-0">
                      <span className="text-yellow-400 font-black">Aug</span>
                      <span className="text-white font-black text-xs">{selectedAppt.day}</span>
                      <span className="text-lime-400">, 2026</span>
                    </span>
                  </div>

                  <p className="text-xs font-extrabold text-white leading-tight pt-0.5">{selectedAppt.title}</p>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1.5 border-t border-zinc-800/80">
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-lime-400/10 border border-yellow-400/40 w-fit">
                      <Clock className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                      <span className="font-mono text-xs font-black text-white">{timeDigits}</span>
                      {timeAmPm && <span className="font-mono text-xs font-black text-yellow-400">{timeAmPm}</span>}
                    </div>
                    <span className="flex items-center space-x-1 truncate max-w-[170px]">
                      <Car className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                      <span className="truncate text-zinc-300">{selectedAppt.vehicle}</span>
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${appointments.length > 0 ? 'bg-lime-400' : 'bg-zinc-600'} inline-block`} />
              <span className={appointments.length > 0 ? 'text-lime-400 font-medium' : 'text-zinc-400'}>
                {appointments.length > 0 ? 'Service Scheduled' : 'No Active Schedule'}
              </span>
            </span>
            <span className="text-lime-400 font-semibold">{appointments.length} Synced Events</span>
          </div>
        </div>

        {/* Google Map Location (Top Right) */}
        <div className="bg-[#18181c] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <GoogleMapsLogo className="w-5 h-5" />
                <h3 className="text-sm font-extrabold text-white">Google Maps</h3>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customAddress.trim() || 'Bay Area, CA')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-lime-400 hover:text-lime-300 font-bold flex items-center space-x-1"
              >
                <span>Open Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Embedded Interactive Map */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#0a0a0d] h-44 relative shadow-inner group">
              <iframe
                title="Verified Location Google Map"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(120%)' }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(verifiedAddress || customAddress.trim() || 'Bay Area, CA')}&t=&z=${(verifiedAddress || customAddress.trim()) ? 14 : 10}&ie=UTF8&iwloc=none&output=embed`}
              />
              <div className="absolute top-2 left-2 bg-[#18181c]/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-700 text-[10px] text-white font-extrabold flex items-center space-x-1.5 max-w-[85%] truncate z-10">
                <BrightRedMapMarker className="w-4 h-4 shrink-0" />
                <span className="truncate">{(verifiedAddress || customAddress.trim()) ? formatAddressCapitalization(verifiedAddress || customAddress.trim()) : 'Bright Red Pointed Location'}</span>
              </div>

              {/* Center Masking Disc to obscure standard Google Maps marker bubble */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#18181c]/95 border-2 border-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.9)] z-15 pointer-events-none flex items-center justify-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF0000] animate-ping opacity-100" />
              </div>

              {/* Bright Red Map Marker Pin with Black Dot Overlay */}
              <div
                onClick={() => {
                  const guessed = guessRedMarkerAddress(verifiedAddress || customAddress);
                  setCustomAddress(guessed);
                  setVerifiedAddress(guessed);
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-20 flex flex-col items-center cursor-pointer transition-all hover:scale-110 drop-shadow-[0_0_20px_rgba(255,0,0,1)]"
                title="Click bright red pointed location to set address in Suggested Addresses"
              >
                <div className="bg-black/95 text-white text-[9px] font-extrabold font-mono px-2 py-0.5 rounded-md border-2 border-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)] whitespace-nowrap mb-1 flex items-center space-x-1">
                  <BrightRedMapMarker className="w-3.5 h-3.5 shrink-0" />
                  <span>{(verifiedAddress || customAddress.trim()) ? guessRedMarkerAddress(verifiedAddress || customAddress) : 'Bright Red Pointed Location'}</span>
                </div>
                <BrightRedMapMarker className="w-10 h-10 filter drop-shadow-[0_2px_10px_rgba(255,0,0,1)]" />
              </div>
            </div>

            {/* Address Search with Search Button */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold text-zinc-300 uppercase tracking-wider flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-lime-400" />
                  <span>Type Full Address</span>
                </label>
              </div>

              {/* Input + Search Button */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    ref={addressInputRef}
                    type="text"
                    value={customAddress}
                    onClick={handleAddressInputClick}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomAddress(val);
                      if (val.trim()) {
                        const matches = getFullAddressMatches(val);
                        if (matches.length > 0) {
                          setVerifiedAddress(matches[0]);
                        } else {
                          setVerifiedAddress(formatAddressCapitalization(val));
                        }
                      } else {
                        setVerifiedAddress('');
                      }
                    }}
                    onFocus={handleAddressInputClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchAddress();
                      } else if (e.key === 'Tab') {
                        const matches = getFullAddressMatches(customAddress);
                        if (matches.length > 0 && customAddress.trim()) {
                          e.preventDefault();
                          setCustomAddress(matches[0]);
                          setVerifiedAddress(matches[0]);
                        }
                      }
                    }}
                    placeholder="Search Google Maps"
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl pl-3 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all font-mono"
                  />
                  {customAddress && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomAddress('');
                        setVerifiedAddress('');
                        if (addressInputRef.current) {
                          addressInputRef.current.focus();
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                      title="Clear address"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSearchAddress}
                  className="px-3.5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md flex items-center space-x-1 shrink-0"
                >
                  <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Search</span>
                </button>
              </div>

              {/* Inline Address Suggestion Completion Helper */}
              {(() => {
                if (!customAddress.trim()) return null;
                const matches = getFullAddressMatches(customAddress);
                const topSuggestion = matches[0];
                if (!topSuggestion || topSuggestion.toLowerCase() === customAddress.trim().toLowerCase()) return null;

                return (
                  <div className="flex items-center justify-between bg-lime-950/40 border border-lime-500/30 rounded-lg px-2.5 py-1.5 text-[11px] font-mono">
                    <span className="text-zinc-300 truncate pr-2">
                      Suggested: <strong className="text-lime-300">{topSuggestion}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAddress(topSuggestion);
                        setVerifiedAddress(topSuggestion);
                      }}
                      className="text-yellow-400 hover:text-yellow-300 font-extrabold text-[10px] uppercase tracking-wider underline shrink-0 cursor-pointer"
                    >
                      Accept (Tab)
                    </button>
                  </div>
                );
              })()}

              {/* Permanent Suggested Addresses Box (Matching Card Side Margins) */}
              <div className="bg-[#121215] border-2 border-yellow-400 shadow-md shadow-yellow-400/20 rounded-xl p-2.5 space-y-2 w-full mt-2">
                <div className="flex items-center justify-between px-1 py-0.5 text-[10px] font-extrabold text-yellow-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5">
                  <span className="flex items-center space-x-1.5">
                    <GoogleMapsLogo className="w-4 h-4" />
                    <span>Suggested Addresses (Predicted Full California Addresses)</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono text-lime-400 bg-lime-400/10 border border-lime-400/20 px-1.5 py-0.5 rounded">
                      37.7937° N, 122.3965° W
                    </span>
                    {(customAddress || verifiedAddress) && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomAddress('');
                          setVerifiedAddress('');
                        }}
                        className="text-zinc-400 hover:text-white text-[10px] font-bold underline"
                      >
                        Deselect
                      </button>
                    )}
                  </div>
                </div>

                {/* Guessed Red Point Address Hero Card */}
                {(() => {
                  const redPointFullAddress = guessRedMarkerAddress(verifiedAddress || customAddress);
                  const isRedPointSelected = verifiedAddress === redPointFullAddress || customAddress === redPointFullAddress;

                  return (
                    <div className="bg-gradient-to-r from-red-950/70 via-[#18181c] to-red-950/70 border-2 border-red-500/80 rounded-xl p-2.5 flex items-center justify-between shadow-md shadow-red-500/20">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/40 shrink-0">
                          <BrightRedMapMarker className="w-5 h-5 filter drop-shadow-[0_0_6px_rgba(255,0,0,0.8)]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider flex items-center space-x-1">
                            <span>Predicted Red Point Full Address</span>
                            <span className="text-[9px] text-lime-400 font-bold">• 100% Complete</span>
                          </div>
                          <p className="text-xs font-extrabold text-white truncate font-mono mt-0.5">
                            {redPointFullAddress}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomAddress(redPointFullAddress);
                          setVerifiedAddress(redPointFullAddress);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-extrabold text-[10px] uppercase tracking-wider transition-all shrink-0 cursor-pointer ml-2 shadow-sm ${
                          isRedPointSelected
                            ? 'bg-lime-400 text-black shadow-lime-400/30'
                            : 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/30'
                        }`}
                      >
                        {isRedPointSelected ? 'Selected' : 'Use Address'}
                      </button>
                    </div>
                  );
                })()}

                <div className="max-h-44 overflow-y-auto space-y-1 pt-0.5 pr-0.5">
                  {(() => {
                    const displayMatches = getFullAddressMatches(customAddress);
                    const redPointFullAddress = guessRedMarkerAddress(verifiedAddress || customAddress);

                    // Ensure redPointFullAddress is at top if not already present
                    const listWithRedPoint = [...displayMatches];
                    if (!listWithRedPoint.some((a) => a.toLowerCase() === redPointFullAddress.toLowerCase())) {
                      listWithRedPoint.unshift(redPointFullAddress);
                    }

                    // Map through items and ensure all addresses are fully predicted California addresses
                    return listWithRedPoint.map((addrRaw) => {
                      const addr = predictFullAddress(addrRaw);
                      const isSelected = verifiedAddress === addr || (customAddress === addr && verifiedAddress !== '');
                      const isRedPointAddr = addr.toLowerCase() === redPointFullAddress.toLowerCase();

                      return (
                        <button
                          key={addr}
                          type="button"
                          onClick={() => handleSelectSuggestedAddress(addr)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between group cursor-pointer ${
                            isSelected
                              ? 'bg-lime-950/90 text-lime-300 border border-yellow-400 shadow-sm shadow-yellow-400/20 font-bold'
                              : 'hover:bg-lime-950/60 hover:text-lime-300 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 truncate pr-2">
                            {isRedPointAddr ? (
                              <BrightRedMapMarker className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_3px_rgba(255,0,0,0.8)]" />
                            ) : (
                              <GoogleMapsLogo className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span className="truncate">{addr}</span>
                            {isRedPointAddr ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-extrabold border border-red-500/30 shrink-0">
                                Red Point Predicted
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-lime-400/10 text-lime-400 font-bold border border-lime-400/20 shrink-0">
                                Predicted Address
                              </span>
                            )}
                          </div>
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-yellow-400' : 'text-lime-400'}`} />
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Calendar Events (Bottom Left) */}
        <div className="bg-[#18181c] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-extrabold text-white">Upcoming Events</h3>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[10px] font-extrabold flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                  <span>Add Manual Event</span>
                </button>
                <span className="text-[10px] font-bold text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
                  Live Google Sync
                </span>
              </div>
            </div>

            {appointments.length === 0 ? (
              <div className="p-6 rounded-xl border border-zinc-800 bg-[#0a0a0d] text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mx-auto text-yellow-400">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <p className="text-base font-extrabold text-white">Please book an appointment</p>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  No upcoming events have been entered manually yet. Book an appointment or manually enter an event to see it on your schedule.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {onNavigateToBook && (
                    <button
                      type="button"
                      onClick={onNavigateToBook}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-lime-400 hover:from-yellow-300 hover:to-lime-300 text-black font-extrabold text-xs transition-all shadow-md inline-flex items-center space-x-1.5 cursor-pointer"
                    >
                      <CalendarIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Book an Appointment</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsAddEventModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-extrabold text-xs transition-all inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add Manual Event</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {appointments.map((appt) => {
                  const timeParts = appt.time.split(' ');
                  const timeDigits = timeParts[0];
                  const timeAmPm = timeParts[1] || '';

                  return (
                    <div
                      key={appt.id}
                      onClick={() => setSelectedDay(appt.day)}
                      className={`p-3.5 rounded-xl border-2 border-yellow-400 shadow-sm shadow-yellow-400/20 transition-all space-y-2 cursor-pointer bg-gradient-to-r from-lime-950/40 via-[#0a0a0d] to-lime-950/40 ${
                        selectedDay === appt.day
                          ? 'ring-2 ring-lime-400/80 shadow-lg shadow-lime-950/50'
                          : 'hover:border-yellow-300'
                      }`}
                    >
                      {/* Row 1: Date & Status Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-lime-400/15 border border-yellow-400/40 font-mono text-[11px] font-extrabold flex items-center space-x-1 whitespace-nowrap shrink-0">
                          <span className="text-yellow-400 font-black">Aug</span>
                          <span className="text-white font-black text-xs">{appt.day}</span>
                          <span className="text-lime-400">, 2026</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-lime-400/15 border border-yellow-400/40 text-[10px] font-extrabold text-lime-300 uppercase whitespace-nowrap shrink-0">
                          {appt.status}
                        </span>
                      </div>

                      {/* Row 2: Time */}
                      <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-lime-400/10 border border-yellow-400/40 w-fit">
                        <Clock className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                        <span className="font-mono text-xs font-black text-white">{timeDigits}</span>
                        {timeAmPm && <span className="font-mono text-xs font-black text-yellow-400">{timeAmPm}</span>}
                      </div>

                      {/* Title */}
                      <p className="text-xs font-extrabold text-white leading-tight pt-0.5">{appt.title}</p>

                      {/* Vehicle & Sync Action */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1.5 border-t border-zinc-800/80">
                        <span className="flex items-center space-x-1 truncate max-w-[200px]">
                          <Car className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                          <span className="truncate text-zinc-300">{appt.vehicle}</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToGCal(appt.title, `2026-08-${appt.day}`, appt.location);
                          }}
                          className="text-lime-400 hover:text-lime-300 font-extrabold flex items-center space-x-1 shrink-0 ml-2 text-xs"
                        >
                          <span>Sync</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Verified Customer Service Address (Bottom Right) */}
        <div className="bg-[#18181c] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-yellow-400 shrink-0" />
                <h3 className="text-sm font-extrabold text-white">Verified Address</h3>
              </div>
              {verifiedAddress.trim() ? (
                <span className="px-2.5 py-0.5 rounded-full bg-lime-400/15 border border-lime-400/40 text-[10px] font-extrabold text-lime-400 flex items-center space-x-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Verified</span>
                </span>
              ) : null}
            </div>

            {verifiedAddress.trim() ? (
              <div className="p-4 rounded-xl bg-[#0a0a0d] border-2 border-yellow-400 shadow-sm shadow-yellow-400/20 space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase text-yellow-400 tracking-wider">
                      Primary Customer Service Address
                    </span>
                    <span className="flex items-center space-x-1 text-lime-400 text-xs font-bold shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-lime-400" />
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-white leading-snug font-mono bg-lime-950/30 p-3 rounded-lg border border-lime-400/40 text-lime-100 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <span className="break-words">{verifiedAddress.trim()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/60 space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Operating Hours:</span>
                    </span>
                    <span className="font-bold text-white">7:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-lime-400" />
                      <span>Customer Concierge:</span>
                    </span>
                    <span className="font-bold text-white">(310) 555-0199</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center space-x-1.5">
                      <Car className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Mobile Coverage:</span>
                    </span>
                    <span className="font-bold text-lime-400">LA County & Bay Area</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#0a0a0d] border-2 border-dashed border-yellow-400/50 text-center space-y-2.5">
                <MapPin className="w-8 h-8 text-yellow-400 mx-auto opacity-80" />
                <p className="text-sm font-extrabold text-yellow-300">
                  Please input address in search box above
                </p>
                <p className="text-xs text-zinc-400">
                  Type an address in search or pick a suggested address below to verify service location.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Google Account Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181c] border border-zinc-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Google Account Settings</h3>
                  <p className="text-xs text-zinc-400 font-mono">Sync & Map Preferences</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121215] border border-zinc-800">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-white block">Google Calendar Auto-Sync</span>
                  <span className="text-zinc-400 text-[11px]">Sync detailing appointments to Google Calendar</span>
                </div>
                <div className="w-10 h-6 bg-yellow-400 rounded-full flex items-center justify-end px-1 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-black shadow-md" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121215] border border-zinc-800">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-white block">Map Marker Auto-Suggest</span>
                  <span className="text-zinc-400 text-[11px]">Suggest full address when red marker points on map</span>
                </div>
                <div className="w-10 h-6 bg-lime-500 rounded-full flex items-center justify-end px-1 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-black shadow-md" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121215] border border-zinc-800">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-white block">Security & Authentication</span>
                  <span className="text-zinc-400 text-[11px]">2-Step Verification Active</span>
                </div>
                <span className="text-[10px] font-bold text-lime-400 bg-lime-400/10 px-2 py-1 rounded border border-lime-400/20">
                  Active
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Event Creation Modal */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181c] border border-zinc-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Add Manual Event</h3>
                  <p className="text-xs text-zinc-400 font-mono">Create an Event Manually</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEventModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 text-[11px] font-bold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Interior & Paint Correction Detail"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full bg-[#121215] border border-zinc-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 text-[11px] font-bold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full bg-[#121215] border border-zinc-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-[11px] font-bold mb-1">Time Slot *</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 12:00 PM"
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full bg-[#121215] border border-zinc-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] font-bold mb-1">Vehicle Info</label>
                <input
                  type="text"
                  placeholder="e.g. 2024 Porsche 911 GT3 (Lic #8ABC123)"
                  value={manualVehicle}
                  onChange={(e) => setManualVehicle(e.target.value)}
                  className="w-full bg-[#121215] border border-zinc-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] font-bold mb-1">Location / Service Address</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Market St, San Francisco, CA 94105"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  className="w-full bg-[#121215] border border-zinc-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md cursor-pointer"
                >
                  Save Manual Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

