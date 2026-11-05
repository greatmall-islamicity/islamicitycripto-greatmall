import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { playSoundCue } from '../utils/cryptoSim';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Alt + 1', desc: 'Buka Menu Kampanye & Zakat' },
    { key: 'Alt + 2', desc: 'Buka Staking Wakaf Produktif & Kalkulator' },
    { key: 'Alt + 3', desc: 'Buka Penjelajah Blockchain (Blok & Tx)' },
    { key: 'Alt + 4', desc: 'Buka Kurikulum Kripto Syariah & Uji Token' },
    { key: 'Alt + 5', desc: 'Buka Kisah Dampak & Penerima Manfaat' },
    { key: 'Alt + 6', desc: 'Buka Dasbor Analitik & Asnaf' },
    { key: 'Alt + 7', desc: 'Buka AI Deteksi Penipuan' },
    { key: 'Alt + K', desc: 'Buka Kalkulator Zakat Syariah Otomatis' },
    { key: 'Alt + D', desc: 'Tunaikan Zakat / Donasi Cepat' },
    { key: 'Alt + V', desc: 'Buka Kontrol Navigasi Perintah Suara' },
    { key: 'Alt + C', desc: 'Ganti Kontras Warna (Normal / AAA / Sepia / Dark)' },
    { key: 'Alt + T', desc: 'Aktifkan / Hentikan Pembaca Layar (TTS)' },
    { key: '?', desc: 'Buka Bantuan Pintasan Papan Ketik Ini' },
    { key: 'Escape', desc: 'Tutup Dialog / Modal yang Sedang Terbuka' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div className="bg-white rounded-xl max-w-lg w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-sm font-bold text-neutral-900">
                Pintasan Papan Ketik (Keyboard Shortcuts)
              </h2>
              <p className="text-[11px] text-neutral-500">Standar Aksesibilitas WCAG AAA untuk Navigasi Cepat</p>
            </div>
          </div>
          <button
            onClick={() => {
              playSoundCue('click');
              onClose();
            }}
            aria-label="Tutup Pintasan Keyboard"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="my-4 divide-y divide-neutral-100 max-h-80 overflow-y-auto pr-1">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-neutral-700 font-medium">{sc.desc}</span>
              <kbd className="px-2.5 py-1 bg-neutral-100 border border-neutral-300 rounded font-mono font-semibold text-neutral-900 shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>Dapat digunakan kapan saja di semua halaman</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-md cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
