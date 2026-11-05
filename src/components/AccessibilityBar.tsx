import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  Eye, 
  Type, 
  HelpCircle, 
  Keyboard, 
  Sparkles 
} from 'lucide-react';
import { AccessibilitySettings, Language } from '../types';
import { translations } from '../utils/translations';
import { playSoundCue, speakText, stopSpeaking } from '../utils/cryptoSim';

interface AccessibilityBarProps {
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  lang: Language;
  onOpenVoiceModal: () => void;
  onOpenKeyboardModal: () => void;
  onStartTutorial: () => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  settings,
  setSettings,
  lang,
  onOpenVoiceModal,
  onOpenKeyboardModal,
  onStartTutorial
}) => {
  const t = translations[lang];

  const toggleContrast = () => {
    playSoundCue('click');
    const modes: ('normal' | 'high-contrast' | 'sepia' | 'dark')[] = ['normal', 'high-contrast', 'dark', 'sepia'];
    const currentIndex = modes.indexOf(settings.contrastMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    setSettings(prev => ({ ...prev, contrastMode: nextMode }));
    
    if (settings.screenReaderActive) {
      speakText(`Mode tampilan diubah ke ${nextMode}`, lang === 'id' ? 'id-ID' : 'en-US');
    }
  };

  const cycleFontSize = () => {
    playSoundCue('click');
    const sizes: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];
    const curIdx = sizes.indexOf(settings.fontSize);
    const nextSize = sizes[(curIdx + 1) % sizes.length];
    
    setSettings(prev => ({ ...prev, fontSize: nextSize }));
    
    if (settings.screenReaderActive) {
      speakText(`Ukuran font diubah ke ${nextSize}`, lang === 'id' ? 'id-ID' : 'en-US');
    }
  };

  const toggleScreenReader = () => {
    playSoundCue('click');
    const newState = !settings.screenReaderActive;
    setSettings(prev => ({ ...prev, screenReaderActive: newState }));
    
    if (newState) {
      speakText(
        lang === 'id' 
          ? 'Fitur pembaca layar diaktifkan. Anda dapat mengarahkan kursor atau menekan tombol untuk mendengar audio.' 
          : 'Screen reader enabled. Accessible audio feedback is now active.',
        lang === 'id' ? 'id-ID' : 'en-US'
      );
    } else {
      stopSpeaking();
    }
  };

  const toggleSound = () => {
    const newState = !settings.soundEffects;
    if (newState) playSoundCue('success');
    setSettings(prev => ({ ...prev, soundEffects: newState }));
  };

  return (
    <aside 
      aria-label="Aksesibilitas dan Bantuan"
      className="bg-neutral-900 text-neutral-100 border-b border-neutral-800 text-xs px-4 py-2"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: WCAG Compliance Status & Prompt */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400">WCAG AAA Compliance</span>
          <span className="text-neutral-500" aria-hidden="true">·</span>
          <span className="text-neutral-400 hidden sm:inline">
            Inklusif untuk disabilitas netra, motorik, dan pendengaran
          </span>
        </div>

        {/* Right: Accessibility Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Voice Command button */}
          <button
            onClick={() => {
              playSoundCue('voice');
              onOpenVoiceModal();
            }}
            aria-label="Buka Perintah Suara (Alt+V)"
            title="Buka Navigasi Suara (Alt+V)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 transition-colors cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-medium whitespace-nowrap">Suara (Alt+V)</span>
          </button>

          {/* Screen Reader Narrator */}
          <button
            onClick={toggleScreenReader}
            aria-label={`Pembaca Layar ${settings.screenReaderActive ? 'Aktif' : 'Nonaktif'}`}
            title="Bicara / Pembaca Layar"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              settings.screenReaderActive 
                ? 'bg-amber-600 text-white font-medium' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">
              {settings.screenReaderActive ? 'TTS Aktif' : 'Pembaca Layar'}
            </span>
          </button>

          {/* High Contrast Switcher */}
          <button
            onClick={toggleContrast}
            aria-label={`Ubah Tema Kontras (Saat ini: ${settings.contrastMode})`}
            title="Ganti Mode Kontras & Tema"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span className="whitespace-nowrap capitalize">{settings.contrastMode}</span>
          </button>

          {/* Font Scaler */}
          <button
            onClick={cycleFontSize}
            aria-label={`Ubah Ukuran Huruf (Saat ini: ${settings.fontSize.toUpperCase()})`}
            title="Perbesar / Perkecil Ukuran Font"
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer font-mono"
          >
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{settings.fontSize.toUpperCase()}</span>
          </button>

          {/* Sound Audio Cues */}
          <button
            onClick={toggleSound}
            aria-label={`Efek Suara Audio ${settings.soundEffects ? 'Aktif' : 'Mute'}`}
            title="Efek Suara Notifikasi"
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
          >
            {settings.soundEffects ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
          </button>

          {/* Keyboard Shortcuts */}
          <button
            onClick={() => {
              playSoundCue('click');
              onOpenKeyboardModal();
            }}
            aria-label="Daftar Pintasan Papan Ketik (Tekan ?)"
            title="Pintasan Keyboard (Alt+K atau ?)"
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>

          {/* Interactive Tutorial */}
          <button
            onClick={() => {
              playSoundCue('click');
              onStartTutorial();
            }}
            aria-label="Mulai Panduan Interaktif Pengguna Baru"
            title="Panduan Interaktif"
            className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-300 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Panduan</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
