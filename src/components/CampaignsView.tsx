import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Share2, 
  Coins, 
  ArrowRight, 
  Calculator, 
  CheckCircle2, 
  Users, 
  Fingerprint, 
  ExternalLink,
  MapPin,
  Sparkles,
  GraduationCap,
  Scale
} from 'lucide-react';
import { Campaign, Language } from '../types';
import { translations } from '../utils/translations';
import { formatIdr, formatUsdt, playSoundCue } from '../utils/cryptoSim';

interface CampaignsViewProps {
  campaigns: Campaign[];
  lang: Language;
  onOpenDonationModal: (campaignId?: string) => void;
  onOpenZakatCalc: () => void;
  onOpenShareModal: (campaign: Campaign) => void;
  onNavigateToTab: (tab: string) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  lang,
  onOpenDonationModal,
  onOpenZakatCalc,
  onOpenShareModal,
  onNavigateToTab
}) => {
  const t = translations[lang];
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filterOptions = [
    { id: 'all', label: t.filterAll },
    { id: 'zakat_fitrah', label: t.filterZakatFitrah },
    { id: 'zakat_maal', label: t.filterZakatMaal },
    { id: 'waqf_produktif', label: t.filterWaqf },
  ];

  const filtered = campaigns.filter(c => {
    if (selectedFilter === 'all') return true;
    return c.category === selectedFilter || c.category.includes(selectedFilter.replace('waqf_produktif', 'waqf'));
  });

  const totalRaised = campaigns.reduce((acc, c) => acc + c.raisedAmount, 0);
  const totalDistributed = campaigns.reduce((acc, c) => acc + c.distributedAmount, 0);

  return (
    <div className="space-y-8">
      
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-white rounded-2xl overflow-hidden border border-neutral-800 shadow-xl">
        <div className="absolute inset-0 z-0 opacity-25">
          <img 
            src="/src/assets/images/hero_islamic_architecture_1792212213404.jpg" 
            alt="Arsitektur kontemporer Islamicity Cripto sanctuary"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
          {/* Sharia consensus kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.heroBadge}</span>
            <span className="text-neutral-600" aria-hidden="true">·</span>
            <span className="text-neutral-400">Terdaftar di BAZNAS & BWI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
            {t.heroTitle}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
            {t.heroSubtitle}
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                playSoundCue('click');
                onOpenDonationModal();
              }}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{t.btnDonate}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playSoundCue('click');
                onOpenZakatCalc();
              }}
              className="px-5 py-3 bg-neutral-800/90 hover:bg-neutral-700 text-white text-xs sm:text-sm font-semibold rounded-lg border border-neutral-700 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>{t.btnCalculateZakat}</span>
            </button>
          </div>
        </div>

        {/* 4-Column Proof & KPI Strip */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800 border-t border-neutral-800 bg-neutral-950/90 backdrop-blur-sm text-xs p-4 sm:p-6">
          <div className="px-4 py-2">
            <span className="text-neutral-400 block mb-1">{t.statTotalRaised}</span>
            <span className="font-mono font-extrabold text-white text-base sm:text-lg tabular-nums">
              {formatIdr(totalRaised)}
            </span>
          </div>
          <div className="px-4 py-2">
            <span className="text-neutral-400 block mb-1">{t.statDistributed}</span>
            <span className="font-mono font-extrabold text-emerald-400 text-base sm:text-lg tabular-nums">
              {formatIdr(totalDistributed)}
            </span>
          </div>
          <div className="px-4 py-2">
            <span className="text-neutral-400 block mb-1">{t.statVerifiedBeneficiaries}</span>
            <span className="font-mono font-extrabold text-white text-base sm:text-lg tabular-nums">
              22.100 Mustahiq
            </span>
          </div>
          <div className="px-4 py-2">
            <span className="text-neutral-400 block mb-1">{t.statBlocksMined}</span>
            <span className="font-mono font-extrabold text-emerald-400 text-base sm:text-lg tabular-nums">
              489.211 Blok
            </span>
          </div>
        </div>
      </section>

      {/* Curriculum Academy Callout Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-neutral-950 text-white rounded-xl p-5 sm:p-6 border border-emerald-800/70 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-800/80 text-emerald-200 border border-emerald-600/50">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
            <span>Fitur Unggulan: Kurikulum Literasi Kripto Syariah</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
            Pahami Kaidah Fiqh Muamalah Digital & Fatwa DSN-MUI Sebelum Berzakat
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Akses 6 modul silabus fiqh komprehensif, simulator uji kepatuhan syariah token kripto, serta dapatkan sertifikasi digital terverifikasi on-chain.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => {
              playSoundCue('click');
              onNavigateToTab('staking');
            }}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Coins className="w-4 h-4 text-emerald-200" />
            <span>Staking Wakaf (Est. APY 11.2%)</span>
          </button>

          <button
            onClick={() => {
              playSoundCue('click');
              onNavigateToTab('curriculum');
            }}
            className="px-3.5 py-2 bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-lg text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Kurikulum Fiqh</span>
          </button>

          <button
            onClick={() => {
              playSoundCue('click');
              onNavigateToTab('curriculum');
            }}
            className="px-3 py-2 bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-lg text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Uji Token</span>
          </button>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Daftar Program Zakat & Wakaf Produktif
          </h2>
          <p className="text-xs text-neutral-500">
            Pilih amanah Anda untuk disalurkan dengan transparansi end-to-end
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg flex-wrap">
          {filterOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                playSoundCue('click');
                setSelectedFilter(opt.id);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedFilter === opt.id
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(cmp => {
          const percent = Math.min(100, Math.round((cmp.raisedAmount / cmp.targetAmount) * 100));
          const distributedPercent = Math.min(100, Math.round((cmp.distributedAmount / cmp.raisedAmount) * 100));

          return (
            <article 
              key={cmp.id}
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Image Slot */}
                <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
                  <img 
                    src={cmp.image} 
                    alt={cmp.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] font-semibold uppercase tracking-wider">
                      {cmp.category.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-1 rounded bg-emerald-800/90 backdrop-blur-xs text-emerald-100 text-[11px] font-mono">
                      Asnaf {cmp.asnafCategory}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => {
                        playSoundCue('click');
                        onOpenShareModal(cmp);
                      }}
                      aria-label="Bagikan Program Ini"
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-700 shadow-xs cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1.5">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span>{cmp.location}</span>
                    <span className="text-neutral-300" aria-hidden="true">·</span>
                    <span className="font-semibold text-emerald-700">Audit Biometrik: {cmp.biometricVerifiedCount} jiwa</span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 leading-snug">
                    {lang === 'ar' ? cmp.titleAr : lang === 'en' ? cmp.titleEn : cmp.title}
                  </h3>

                  <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {lang === 'en' ? cmp.descriptionEn : cmp.description}
                  </p>

                  {/* Fund Progress */}
                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-neutral-900">{formatIdr(cmp.raisedAmount)}</span>
                      <span className="text-neutral-500">Target: {formatIdr(cmp.targetAmount)}</span>
                    </div>

                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5">
                      <span>{percent}% Terkumpul</span>
                      <span className="font-mono text-emerald-700 font-semibold">{distributedPercent}% Sudah Tersalurkan</span>
                    </div>
                  </div>

                  {/* Smart Contract Tag */}
                  <div className="mt-4 p-2 bg-neutral-50 rounded border border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span className="truncate">Contract: {cmp.smartContractAddress.substring(0, 16)}...</span>
                    <span className="text-emerald-700 font-semibold shrink-0">E2E Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 border-t border-neutral-100 mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    playSoundCue('click');
                    onOpenDonationModal(cmp.id);
                  }}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Salurkan Donasi</span>
                </button>

                <button
                  onClick={() => {
                    playSoundCue('click');
                    onNavigateToTab('explorer');
                  }}
                  className="px-3.5 py-2.5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
                  title="Lihat Ledger On-Chain"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
};
