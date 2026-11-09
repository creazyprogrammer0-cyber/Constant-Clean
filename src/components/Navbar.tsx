import React from 'react';
import { Calendar, Sparkles, Car, Image, User } from 'lucide-react';
import { GoogleWalletLogo } from './GoogleWalletLogo';
import { GmailUserAccount } from '../types';
import logoImg from '../assets/images/top_left_logo_1785638403497.jpg';

interface NavbarProps {
  activeTab: 'services' | 'gallery' | 'dashboard' | 'book' | 'account';
  setActiveTab: (tab: 'services' | 'gallery' | 'dashboard' | 'book' | 'account') => void;
  bookingCount: number;
  user: GmailUserAccount;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bookingCount,
  user,
}) => {
  const tabs = [
    {
      id: 'services' as const,
      label: 'Services & Pricing',
      shortLabel: 'Services',
      icon: Sparkles,
      isProfilePic: false,
    },
    {
      id: 'book' as const,
      label: 'Schedule & Pay',
      shortLabel: 'Schedule',
      icon: Calendar,
      isProfilePic: false,
    },
    {
      id: 'gallery' as const,
      label: 'Gallery',
      shortLabel: 'Gallery',
      icon: Image,
      isProfilePic: false,
    },
    {
      id: 'dashboard' as const,
      label: 'Wallet',
      shortLabel: 'Wallet',
      icon: GoogleWalletLogo,
      badge: bookingCount,
      isProfilePic: false,
    },
    {
      id: 'account' as const,
      label: user.isLoggedIn ? user.name.split(' ')[0] : 'Gmail Account',
      shortLabel: user.isLoggedIn ? 'Profile' : 'Account',
      icon: User,
      isProfilePic: true,
    },
  ];

  return (
    <>
      {/* Top Header Bar (Brand Logo & User Profile Badge) */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-zinc-800/80 text-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Logo */}
            <div
              onClick={() => setActiveTab('services')}
              className="flex items-center space-x-3 cursor-pointer group shrink-0"
            >
              <img
                src={logoImg}
                alt="Constant Clean Mobile Auto Detailing"
                className="h-10 sm:h-12 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-200 border border-yellow-400/30"
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                    CONSTANT CLEAN
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-yellow-300/10 text-yellow-300 border border-yellow-300/30">
                    Auto Detailing
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
                  Google Wallet & Calendar Integration
                </p>
              </div>
            </div>

            {/* Quick Profile / Gmail Sync Badge */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setActiveTab('account')}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-colors cursor-pointer"
              >
                {user.isLoggedIn ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-yellow-400/80"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                )}
                <div className="text-left leading-tight hidden sm:block">
                  <span className="text-[11px] font-bold text-white block">
                    {user.isLoggedIn ? user.name : 'Sign in'}
                  </span>
                  <span className="text-[9px] text-lime-400 font-medium block">
                    {user.isLoggedIn ? 'Wallet Connected' : 'Google Sync'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stationary Bottom Dock for All Navigation Tabs */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl px-2">
        <nav className="bg-[#18181c]/95 backdrop-blur-xl p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-zinc-700/80 shadow-2xl shadow-black/80 flex items-center justify-between gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl sm:rounded-2xl text-xs transition-all flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 relative ${
                  isActive
                    ? 'bg-[#38383e] text-white font-extrabold border border-zinc-500 shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-semibold'
                }`}
              >
                {tab.id === 'services' ? (
                  <Sparkles className={`w-4 h-4 shrink-0 ${isActive ? 'text-yellow-300 fill-yellow-300/30' : 'text-zinc-400'}`} />
                ) : tab.isProfilePic ? (
                  user.isLoggedIn ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover ring-1 ring-yellow-400 shrink-0"
                    />
                  ) : (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      G
                    </div>
                  )
                ) : (
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-yellow-400' : 'text-zinc-400'}`} />
                )}

                <span className="truncate text-[10px] sm:text-xs tracking-tight">
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </span>

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`ml-0.5 sm:ml-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                      isActive ? 'bg-lime-400 text-black' : 'bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

