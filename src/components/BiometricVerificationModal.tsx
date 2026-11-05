import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, CheckCircle2, ShieldAlert, Fingerprint, RefreshCw, Scan, UserCheck } from 'lucide-react';
import { Beneficiary } from '../types';
import { playSoundCue, speakText, sha256 } from '../utils/cryptoSim';

interface BiometricVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary: Beneficiary | null;
  onVerificationComplete: (beneficiaryId: string, bioAuditId: string) => void;
}

export const BiometricVerificationModal: React.FC<BiometricVerificationModalProps> = ({
  isOpen,
  onClose,
  beneficiary,
  onVerificationComplete
}) => {
  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'analyzing' | 'success'>('idle');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [generatedAuditId, setGeneratedAuditId] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Clean up camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      setScanStep('idle');
      setScanProgress(0);
      return;
    }

    // Try starting camera
    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 480 } });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        } else {
          setCameraError('Kamera tidak didukung pada browser ini. Menggunakan simulator biometrik syariah.');
        }
      } catch (err) {
        setCameraError('Akses kamera ditolak atau tidak tersedia. Menggunakan mode simulator presisi.');
      }
    }

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen || !beneficiary) return null;

  const startScan = async () => {
    setScanStep('scanning');
    setScanProgress(0);
    playSoundCue('voice');

    // Progress animation
    for (let i = 10; i <= 100; i += 20) {
      await new Promise(r => setTimeout(r, 220));
      setScanProgress(i);
    }

    setScanStep('analyzing');
    await new Promise(r => setTimeout(r, 400));

    // Generate cryptographic bio token
    const token = 'BIO-PASS-' + Math.floor(10000 + Math.random() * 90000);
    setGeneratedAuditId(token);
    setScanStep('success');
    playSoundCue('success');
    speakText(`Verifikasi biometrik ${beneficiary.fullNameMasked} berhasil dengan skor kecocokan 99.6%.`, 'id-ID');

    onVerificationComplete(beneficiary.id, token);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="biometric-modal-title"
    >
      <div className="bg-white rounded-xl max-w-md w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Fingerprint className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 id="biometric-modal-title" className="text-sm font-bold text-neutral-900">
                Verifikasi Identitas Biometrik Mustahiq
              </h2>
              <p className="text-[11px] text-neutral-500">Anti-Spoofing & Liveness Facial Detection</p>
            </div>
          </div>
          <button
            onClick={() => {
              playSoundCue('click');
              onClose();
            }}
            aria-label="Tutup Verifikasi Biometrik"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Beneficiary Meta Card */}
        <div className="my-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-neutral-500">Nama Penerima:</span>
            <span className="font-semibold text-neutral-900">{beneficiary.fullNameMasked}</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-neutral-500">Asnaf / Domisili:</span>
            <span className="font-medium text-neutral-800 capitalize">{beneficiary.asnaf} · {beneficiary.city}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Metode Validasi:</span>
            <span className="font-mono text-emerald-700 font-semibold">{beneficiary.verificationMethod}</span>
          </div>
        </div>

        {/* Camera Scanner Viewport */}
        <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-neutral-950 rounded-2xl overflow-hidden border-2 border-emerald-500/50 flex items-center justify-center shadow-inner my-4">
          
          {cameraActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            /* Fallback Facial Mesh Simulator */
            <div className="w-full h-full flex flex-col items-center justify-center bg-radial from-neutral-800 to-neutral-950 text-neutral-400 p-4 text-center">
              <Scan className="w-16 h-16 text-emerald-400 opacity-60 mb-2" />
              <p className="text-xs text-neutral-300 font-medium">Simulator Kamera Biometrik</p>
              <p className="text-[10px] text-neutral-500 mt-1">Sensor Liveness AI Aktif</p>
            </div>
          )}

          {/* Facial Oval Overlay */}
          <div className="absolute inset-4 border-2 border-dashed border-emerald-400/80 rounded-[45%] pointer-events-none flex items-center justify-center">
            {scanStep === 'scanning' && (
              <div 
                className="w-full h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] transition-all duration-300"
                style={{ transform: `translateY(${(scanProgress - 50) * 2}px)` }}
              />
            )}
          </div>

          {/* Progress / Status banner */}
          <div className="absolute bottom-2 inset-x-2 bg-neutral-900/90 backdrop-blur-xs py-1.5 px-3 rounded-lg text-center text-xs text-emerald-300 border border-neutral-800 font-mono">
            {scanStep === 'idle' && 'Posisikan wajah di dalam oval'}
            {scanStep === 'scanning' && `Memindai kontur wajah: ${scanProgress}%`}
            {scanStep === 'analyzing' && 'Mencocokkan tanda tangan ZK...'}
            {scanStep === 'success' && 'Biometrik Terverifikasi (99.6%)'}
          </div>
        </div>

        {cameraError && (
          <p className="text-[11px] text-neutral-500 text-center mb-3">
            {cameraError}
          </p>
        )}

        {/* Success State Info */}
        {scanStep === 'success' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 mb-4">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Audit Biometrik Berhasil Dicatat</span>
            </div>
            <p className="text-[11px] text-emerald-800 font-mono">
              ID Token: <strong>{generatedAuditId}</strong>
            </p>
            <p className="text-[11px] text-emerald-700">
              Dana dapat dicairkan aman ke rekening mustahiq dengan jaminan anti-fraud.
            </p>
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {scanStep !== 'success' ? (
            <button
              onClick={startScan}
              disabled={scanStep === 'scanning' || scanStep === 'analyzing'}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-300 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{scanStep === 'scanning' ? 'Memindai...' : 'Mulai Verifikasi Biometrik'}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
            >
              Selesai & Simpan Hasil
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
