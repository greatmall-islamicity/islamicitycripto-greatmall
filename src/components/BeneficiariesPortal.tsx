import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Fingerprint, 
  Search, 
  ArrowRight, 
  FileCheck, 
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  Heart
} from 'lucide-react';
import { Beneficiary, AsnafType } from '../types';
import { formatIdr, playSoundCue } from '../utils/cryptoSim';
import { BeneficiaryStoriesFeed } from './BeneficiaryStoriesFeed';

interface BeneficiariesPortalProps {
  beneficiaries: Beneficiary[];
  onOpenBiometricModal: (beneficiary: Beneficiary) => void;
  initialTxHash?: string | null;
  onNavigateToTx?: (txHash: string) => void;
  onOpenDonationModal?: (campaignId?: string) => void;
}

export const BeneficiariesPortal: React.FC<BeneficiariesPortalProps> = ({
  beneficiaries,
  onOpenBiometricModal,
  initialTxHash,
  onNavigateToTx = () => {},
  onOpenDonationModal = () => {}
}) => {
  const [portalTab, setPortalTab] = useState<'stories' | 'registry'>('stories');
  const [filterAsnaf, setFilterAsnaf] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  useEffect(() => {
    if (initialTxHash) {
      setPortalTab('stories');
    }
  }, [initialTxHash]);

  const asnafOptions = [
    { id: 'all', label: 'Semua Asnaf' },
    { id: 'fakir', label: 'Fakir' },
    { id: 'miskin', label: 'Miskin' },
    { id: 'gharimin', label: 'Gharimin' },
    { id: 'ibnu_sabil', label: 'Ibnu Sabil' },
  ];

  const filtered = beneficiaries.filter(b => {
    const matchAsnaf = filterAsnaf === 'all' || b.asnaf === filterAsnaf;
    const matchSearch = 
      b.fullNameMasked.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAsnaf && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Portal Navigation Tabs: Stories vs Registry */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => {
              playSoundCue('click');
              setPortalTab('stories');
            }}
            className={`px-3.5 py-2 rounded-md transition-all cursor-pointer flex items-center gap-2 ${
              portalTab === 'stories'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Kisah Dampak Nyata (Beneficiary Stories)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          </button>

          <button
            onClick={() => {
              playSoundCue('click');
              setPortalTab('registry');
            }}
            className={`px-3.5 py-2 rounded-md transition-all cursor-pointer flex items-center gap-2 ${
              portalTab === 'registry'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Database Mustahiq & Biometrik Wajah</span>
            <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded-full font-mono">
              {beneficiaries.length}
            </span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
          ZK-SNARK & Biometric Validated
        </span>
      </div>

      {/* Render 1: Beneficiary Stories Feed */}
      {portalTab === 'stories' && (
        <BeneficiaryStoriesFeed
          initialTxHash={initialTxHash}
          onNavigateToTx={onNavigateToTx}
          onOpenDonationModal={onOpenDonationModal}
        />
      )}

      {/* Render 2: Registry & Biometric Portal */}
      {portalTab === 'registry' && (
        <>
          {/* Header and Filter */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-700" />
                  <span>Database Transparansi Penerima Manfaat (Mustahiq)</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Distribusi dana langsung dengan enkripsi privasi identitas dan audit biometrik wajah
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari ID, Nama, atau Kota..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Asnaf Filter Buttons */}
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-neutral-100 flex-wrap">
              <span className="text-xs font-semibold text-neutral-500 mr-2">Filter 8 Asnaf:</span>
              {asnafOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    playSoundCue('click');
                    setFilterAsnaf(opt.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    filterAsnaf === opt.id
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

      {/* Beneficiaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(ben => (
          <div 
            key={ben.id}
            className="bg-white border border-neutral-200 hover:border-emerald-600 rounded-xl p-4 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-400">{ben.id}</span>
                    <span className="text-xs font-bold text-neutral-900">{ben.fullNameMasked}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span>{ben.city}</span>
                    <span className="text-neutral-300" aria-hidden="true">·</span>
                    <span className="font-semibold text-emerald-800 capitalize">Asnaf {ben.asnaf}</span>
                  </div>
                </div>

                {/* Biometric Status badge */}
                {ben.biometricStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Biometrik {ben.biometricScore}%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    Perlu Verifikasi
                  </span>
                )}
              </div>

              {/* Aid summary */}
              <div className="my-3 p-2.5 bg-neutral-50 rounded-lg border border-neutral-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Bantuan Diterima:</span>
                  <span className="font-mono font-bold text-neutral-900 tabular-nums">
                    {formatIdr(ben.totalAidReceivedIdr)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Penyaluran Terakhir:</span>
                  <span className="font-mono text-neutral-800">
                    {ben.lastAidDate}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-between">
                <span>Bukti Identitas ZK:</span>
                <span className="text-emerald-800 font-semibold">{ben.zkIdentityProof}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    playSoundCue('click');
                    setSelectedBeneficiary(ben);
                  }}
                  className="text-xs text-neutral-700 hover:text-neutral-900 font-medium cursor-pointer"
                >
                  Riwayat Audit
                </button>
                <button
                  onClick={() => {
                    playSoundCue('click');
                    setPortalTab('stories');
                    setSearchQuery(ben.id);
                  }}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kisah Dampak</span>
                </button>
              </div>

              <button
                onClick={() => {
                  playSoundCue('click');
                  onOpenBiometricModal(ben);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold cursor-pointer"
              >
                <Fingerprint className="w-3.5 h-3.5 text-emerald-700" />
                <span>Uji Biometrik Wajah</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Beneficiary Detail & Proof photo */}
      {selectedBeneficiary && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-lg w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="font-bold text-sm text-neutral-900">
                Log Audit Penyaluran: {selectedBeneficiary.fullNameMasked}
              </span>
              <button 
                onClick={() => setSelectedBeneficiary(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 my-4">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                <p><strong>Domisili:</strong> {selectedBeneficiary.city}</p>
                <p><strong>Kategori Syariah:</strong> Asnaf {selectedBeneficiary.asnaf.toUpperCase()}</p>
                <p><strong>Total Akumulasi Hak Zakat:</strong> {formatIdr(selectedBeneficiary.totalAidReceivedIdr)}</p>
                <p><strong>Metode Validasi Identitas:</strong> {selectedBeneficiary.verificationMethod}</p>
              </div>

              {/* Verifiable Photographic Proof */}
              <div>
                <span className="font-semibold text-neutral-800 block mb-1.5">
                  Foto Dokumentasi Penyerahan Bantuan Terverifikasi:
                </span>
                <div className="rounded-lg overflow-hidden border border-neutral-200">
                  <img 
                    src="/src/assets/images/zakat_food_distribution_1792212214956.jpg" 
                    alt="Penyaluran beras dan pangan zakat kepada penerima manfaat"
                    className="w-full h-44 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-2 bg-neutral-900 text-white font-mono text-[10px] flex items-center justify-between">
                    <span>Hash Stempel Foto: 0x9fa1c74291e0a8112...</span>
                    <span className="text-emerald-400">SHA-256 Valid</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedBeneficiary(null)}
              className="w-full py-2 bg-neutral-900 text-white rounded-md font-semibold cursor-pointer"
            >
              Tutup Log Audit
            </button>
          </div>
        </div>
      )}
        </>
      )}

    </div>
  );
};

