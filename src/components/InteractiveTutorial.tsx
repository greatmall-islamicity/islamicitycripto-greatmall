import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Box, 
  Calculator, 
  Eye, 
  Mic,
  GraduationCap 
} from 'lucide-react';
import { playSoundCue, speakText } from '../utils/cryptoSim';

interface InteractiveTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Selamat Datang di Islamicity Cripto',
      desc: 'Platform infrastruktur cerdas pertama yang menyatukan prinsip kesucian filantropi Islam (Zakat, Infaq, Shadaqah, dan Wakaf) dengan kekuatan enkripsi blockchain dan transparansi publik.',
      icon: ShieldCheck,
      actionTab: 'campaigns',
      tip: 'Setiap rupiah atau crypto yang Anda tunaikan tercatat secara kekal (immutable) tanpa potongan tersembunyi.'
    },
    {
      title: 'Transparansi Penyaluran ke 8 Asnaf',
      desc: 'Lacak langsung siapa penerima manfaat (mustahiq) yang menerima hak zakat. Dilengkapi verifikasi biometrik wajah dan audit geotagging untuk memastikan dana tepat sasaran.',
      icon: Users,
      actionTab: 'beneficiaries',
      tip: 'Identitas mustahiq dilindungi oleh enkripsi Zero-Knowledge Proof demi menjaga martabat mereka.'
    },
    {
      title: 'Penjelajah Blok (Blockchain Explorer)',
      desc: 'Inspeksi langsung setiap blok transaksi, hash kriptografi SHA-256, Merkle root, dan validator dewan syariah secara terbuka tanpa rekayasa.',
      icon: Box,
      actionTab: 'explorer',
      tip: 'Gunakan pencarian untuk melacak transaksi Anda secara instan menggunakan TxID hash.'
    },
    {
      title: 'Kalkulator Zakat Nisab Otomatis',
      desc: 'Hitung zakat Maal, Profesi, dan Fitrah Anda dengan nisab emas real-time (85 gram) serta langsung tunaikan dalam satu klik via e-wallet atau kripto.',
      icon: Calculator,
      actionTab: 'campaigns',
      tip: 'Dukungan multi-gateway mulai dari QRIS, GoPay, DANA, Virtual Account BSI, hingga USDT & Islamic Coin.'
    },
    {
      title: 'Akademi & Kurikulum Kripto Syariah',
      desc: 'Pelajari fiqh muamalah digital, fatwa DSN-MUI & AAOIFI No. 59, uji kepatuhan syariah token kripto, serta dapatkan sertifikasi kompetensi digital terakreditasi on-chain.',
      icon: GraduationCap,
      actionTab: 'curriculum',
      tip: 'Selesaikan 6 modul silabus dan ikuti kuis kelulusan untuk mencetak sertifikat digital Anda.'
    },
    {
      title: 'Aksesibilitas Inklusif Penuh (WCAG AAA)',
      desc: 'Aplikasi ini dirancang untuk semua kalangan: dukung navigasi perintah suara (Alt+V), pembaca layar terintegrasi (TTS), penyesuaian ukuran teks, dan mode kontras tinggi visual.',
      icon: Mic,
      actionTab: 'analytics',
      tip: 'Tekan tombol "?" di keyboard kapan saja untuk melihat seluruh daftar pintasan cepat.'
    }
  ];

  const current = steps[currentStep];
  const StepIcon = current.icon;

  const handleNext = () => {
    playSoundCue('click');
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onNavigateToTab(steps[nextStep].actionTab);
    } else {
      playSoundCue('success');
      onClose();
    }
  };

  const handlePrev = () => {
    playSoundCue('click');
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onNavigateToTab(steps[prevStep].actionTab);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900 relative">
        
        {/* Step dots */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-6 bg-emerald-700' : 'w-2 bg-neutral-200'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => {
              playSoundCue('click');
              onClose();
            }}
            aria-label="Lewati Panduan"
            className="text-xs text-neutral-400 hover:text-neutral-700 font-medium cursor-pointer"
          >
            Lewati
          </button>
        </div>

        {/* Content */}
        <div className="text-center my-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <StepIcon className="w-7 h-7" />
          </div>

          <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            Langkah {currentStep + 1} dari {steps.length}
          </span>

          <h2 id="tutorial-modal-title" className="text-base font-bold text-neutral-900 mb-2">
            {current.title}
          </h2>

          <p className="text-xs text-neutral-600 leading-relaxed mb-4">
            {current.desc}
          </p>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-left text-xs text-neutral-700">
            <strong className="text-emerald-900 block mb-0.5">💡 Tips Pintar:</strong>
            {current.tip}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-600 disabled:opacity-30 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{currentStep === steps.length - 1 ? 'Mulai Eksplorasi' : 'Selanjutnya'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
