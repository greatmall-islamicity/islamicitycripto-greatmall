import React, { useState } from 'react';
import { ShieldCheck, Bell, Calculator, Globe, Menu, X, Check } from 'lucide-react';
import { Language, NotificationItem } from '../types';
import { translations } from '../utils/translations';
import { playSoundCue } from '../utils/cryptoSim';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  notifications: NotificationItem[];
  onOpenZakatCalc: () => void;
  onOpenDonationModal: () => void;
  onMarkNotificationsRead: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  notifications,
  onOpenZakatCalc,
  onOpenDonationModal,
  onMarkNotificationsRead
}) => {
  const t = translations[lang];
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'campaigns', label: t.navCampaigns },
    { id: 'staking', label: t.navStaking },
    { id: 'explorer', label: t.navExplorer },
    { id: 'curriculum', label: t.navCurriculum },
    { id: 'beneficiaries', label: t.navBeneficiaries },
    { id: 'analytics', label: t.navAnalytics },
    { id: 'fraud', label: t.navFraudAi },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                playSoundCue('click');
                setCurrentTab('campaigns');
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md p-1"
              aria-label="Islamicity Cripto Beranda"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">
                {t.brandName}
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line text links */}
          <nav 
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-600"
            aria-label="Navigasi Utama"
          >
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  playSoundCue('click');
                  setCurrentTab(item.id);
                }}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  currentTab === item.id 
                    ? 'text-emerald-700 font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600' 
                    : 'hover:text-neutral-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action + helper utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Zakat Calculator button */}
            <button
              onClick={() => {
                playSoundCue('click');
                onOpenZakatCalc();
              }}
              aria-label="Kalkulator Zakat Otomatis"
              title="Kalkulator Zakat"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-700" />
              <span className="whitespace-nowrap">Kalkulator</span>
            </button>

            {/* Notification Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  playSoundCue('click');
                  setShowNotifMenu(!showNotifMenu);
                  if (unreadCount > 0) onMarkNotificationsRead();
                }}
                aria-label={`Notifikasi Penyaluran Real-time (${unreadCount} belum dibaca)`}
                className="relative p-2 text-neutral-600 hover:text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full" />
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifMenu && (
                <div 
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-1"
                  role="dialog"
                  aria-label="Daftar Notifikasi Penyaluran"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
                    <span className="text-xs font-semibold text-neutral-900">Pembaruan Penyaluran Dana</span>
                    <span className="text-[11px] text-neutral-500 font-mono">Real-time Feed</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.map(notif => (
                      <div key={notif.id} className="p-2.5 rounded bg-neutral-50 hover:bg-neutral-100 text-left border border-neutral-100 transition-colors">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-xs font-semibold text-neutral-900">{notif.title}</p>
                          <span className="text-[10px] text-neutral-400 whitespace-nowrap">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">{notif.message}</p>
                        {notif.txHash && (
                          <p className="mt-1 text-[10px] font-mono text-emerald-700 truncate">
                            Tx: {notif.txHash}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                aria-label="Pilih Bahasa"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-neutral-500" />
                <span className="uppercase font-mono">{lang}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-neutral-200 rounded-md shadow-md py-1 z-50">
                  {(['id', 'en', 'ar'] as Language[]).map(l => (
                    <button
                      key={l}
                      onClick={() => {
                        playSoundCue('click');
                        setLang(l);
                        setShowLangMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center justify-between cursor-pointer"
                    >
                      <span>{l === 'id' ? 'Indonesia' : l === 'en' ? 'English' : 'العربية'}</span>
                      {lang === l && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                playSoundCue('click');
                onOpenDonationModal();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-700"
            >
              {t.btnDonate}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-md"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Links drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-neutral-100 flex flex-col gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  playSoundCue('click');
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm font-medium rounded-md ${
                  currentTab === item.id 
                    ? 'bg-emerald-50 text-emerald-800 font-semibold' 
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onOpenZakatCalc();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 rounded-md"
            >
              Hitung Zakat (Kalkulator)
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
