import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Volume2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { playSoundCue, speakText } from '../utils/cryptoSim';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onNavigate: (tab: string) => void;
  onOpenZakatCalc: () => void;
  onOpenDonationModal: () => void;
  onToggleContrast: () => void;
  onReadSummary: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  lang,
  onNavigate,
  onOpenZakatCalc,
  onOpenDonationModal,
  onToggleContrast,
  onReadSummary
}) => {
  const t = translations[lang];
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [supportStatus, setSupportStatus] = useState<string>('ready');

  // Available sample commands
  const sampleCommands = [
    { text: 'Buka Zakat & Program', cmd: 'zakat', action: () => onNavigate('campaigns') },
    { text: 'Staking Wakaf Produktif', cmd: 'staking', action: () => onNavigate('staking') },
    { text: 'Buka Blockchain Explorer', cmd: 'blockchain', action: () => onNavigate('explorer') },
    { text: 'Kurikulum Kripto Syariah', cmd: 'kurikulum', action: () => onNavigate('curriculum') },
    { text: 'Kisah Dampak Mustahiq', cmd: 'kisah', action: () => onNavigate('beneficiaries') },
    { text: 'Buka Analitik & Asnaf', cmd: 'analitik', action: () => onNavigate('analytics') },
    { text: 'Buka AI Deteksi Penipuan', cmd: 'fraud', action: () => onNavigate('fraud') },
    { text: 'Hitung Zakat Saya', cmd: 'hitung', action: onOpenZakatCalc },
    { text: 'Tunaikan Donasi Sekarang', cmd: 'donasi', action: onOpenDonationModal },
    { text: 'Ganti Kontras Warna', cmd: 'kontras', action: onToggleContrast },
    { text: 'Bacakan Ringkasan Layar', cmd: 'baca', action: onReadSummary },
  ];

  const handleCommandExecution = (spokenText: string) => {
    const lower = spokenText.toLowerCase().trim();
    setTranscript(spokenText);

    if (lower.includes('staking') || lower.includes('investasi') || lower.includes('sukuk') || lower.includes('kunci')) {
      onNavigate('staking');
      const msg = 'Membuka dasbor staking wakaf produktif dan kalkulator imbal hasil syariah.';
      setLastAction(msg);
      speakText(msg, 'id-ID');
      playSoundCue('success');
    } else if (lower.includes('zakat') || lower.includes('kampanye') || lower.includes('program')) {
      onNavigate('campaigns');
      const msg = 'Membuka daftar program zakat dan wakaf.';
      setLastAction(msg);
      speakText(msg, 'id-ID');
      playSoundCue('success');
    } else if (lower.includes('blockchain') || lower.includes('ledger') || lower.includes('explorer') || lower.includes('blok')) {
      onNavigate('explorer');
      const msg = 'Membuka penjelajah blok blockchain terenkripsi.';
      setLastAction(msg);
      speakText(msg, 'id-ID');
      playSoundCue('success');
    } else if (lower.includes('kurikulum') || lower.includes('akademi') || lower.includes('belajar') || lower.includes('fiqh') || lower.includes('kuis') || lower.includes('modul')) {
      onNavigate('curriculum');
      const msg = 'Membuka kurikulum literasi kripto syariah dan uji token.';
      setLastAction(msg);
      speakText(msg, 'id-ID');
      playSoundCue('success');
    } else if (lower.includes('penerima') || lower.includes('mustahiq') || lower.includes('manfaat') || lower.includes('kisah') || lower.includes('cerita') || lower.includes('dampak')) {
      onNavigate('beneficiaries');
      const msg = 'Membuka portal kisah dampak nyata dan verifikasi penerima manfaat.';
      setLastAction(msg);
      speakText(msg, 'id-ID');
      playSoundCue('success');
    } else if (lower.includes('analitik') || lower.includes('asnaf') || lower.includes('grafik') || lower.includes('laporan')) {
      onNavigate('analytics');
      const msg = 'Membuka dasbor analitik real-time.';
      setLastAction(msg);
      speakText(msg, 'id-ID');
      playSoundCue('success');
    } else if (lower.includes('fraud') || lower.includes('penipuan') || lower.includes('ai') || lower.includes('keamanan')) {
      onNavigate('fraud');
      const msg = 'Membuka modul AI deteksi penipuan.';
      setLastAction(msg);
      speakText(msg, 'id-ID');
      playSoundCue('success');
    } else if (lower.includes('hitung') || lower.includes('kalkulator')) {
      onOpenZakatCalc();
      const msg = 'Membuka kalkulator zakat otomatis.';
      setLastAction(msg);
      speakText(msg, 'id-ID');
      playSoundCue('success');
    } else if (lower.includes('donasi') || lower.includes('tunaikan') || lower.includes('bayar')) {
      onOpenDonationModal();
      const msg = 'Membuka gateway penyaluran donasi.';
      setLastAction(msg);
      speakText(msg, 'id-ID');
      playSoundCue('success');
    } else if (lower.includes('kontras') || lower.includes('tema')) {
      onToggleContrast();
      const msg = 'Mengubah mode kontras visual.';
      setLastAction(msg);
      speakText(msg, 'id-ID');
      playSoundCue('success');
    } else if (lower.includes('baca') || lower.includes('ringkasan')) {
      onReadSummary();
      const msg = 'Membacakan ringkasan layar saat ini.';
      setLastAction(msg);
      playSoundCue('voice');
    } else if (lower.includes('tutup') || lower.includes('keluar')) {
      onClose();
    } else {
      setLastAction(`Perintah "${spokenText}" dicatat. Silakan coba perintah di daftar.`);
      playSoundCue('alert');
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      return;
    }

    // Try Web Speech Recognition
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
                              (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupportStatus('Web Speech API tidak didukung pada browser ini. Anda tetap dapat mengklik pintasan suara di bawah.');
      return;
    }

    let recognition: any;
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'id-ID';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const text = lastResult[0].transcript;
          handleCommandExecution(text);
        }
      };

      recognition.onerror = (e: any) => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [isOpen, lang]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
    >
      <div className="bg-white rounded-xl max-w-lg w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isListening ? 'bg-emerald-600 text-white animate-pulse' : 'bg-neutral-100 text-neutral-700'}`}>
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h2 id="voice-modal-title" className="text-base font-bold text-neutral-900">
                Navigasi Perintah Suara
              </h2>
              <p className="text-xs text-neutral-500">WCAG AAA Voice Navigation Control</p>
            </div>
          </div>
          <button
            onClick={() => {
              playSoundCue('click');
              onClose();
            }}
            aria-label="Tutup Perintah Suara"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listening visualizer */}
        <div className="my-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 relative">
            <Mic className={`w-8 h-8 ${isListening ? 'text-emerald-600 animate-bounce' : 'text-neutral-400'}`} />
            {isListening && (
              <span className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-30" />
            )}
          </div>
          <p className="mt-3 text-sm font-semibold text-neutral-800">
            {isListening ? 'Mendengarkan... Silakan sebutkan perintah Anda' : 'Mikrofon Siaga / Mode Interaktif'}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {transcript ? `Terdengar: "${transcript}"` : 'Contoh: "Buka zakat", "Hitung zakat", "Blockchain"'}
          </p>
        </div>

        {/* Feedback Alert */}
        {lastAction && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Respon Suara:</span> {lastAction}
            </div>
          </div>
        )}

        {/* Direct Clickable Command Palette for accessible dual input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-700">Daftar Perintah Cepat (Klik atau Ucapkan):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {sampleCommands.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  playSoundCue('voice');
                  item.action();
                  setLastAction(`Menjalankan: ${item.text}`);
                }}
                className="text-left px-3 py-2 text-xs bg-neutral-50 hover:bg-emerald-50 hover:border-emerald-300 border border-neutral-200 rounded-md transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span className="font-medium text-neutral-800 group-hover:text-emerald-900 truncate">{item.text}</span>
                <Volume2 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-700 shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>Pintasan Keyboard: <strong>Alt + V</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white font-medium cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
