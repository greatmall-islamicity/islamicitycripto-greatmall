import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Eye, 
  Lock,
  Cpu
} from 'lucide-react';
import { FraudAnalysisResult } from '../types';
import { playSoundCue, speakText } from '../utils/cryptoSim';

interface FraudDetectionPanelProps {
  fraudAnalyses: FraudAnalysisResult[];
  onTriggerScan: () => Promise<void>;
}

export const FraudDetectionPanel: React.FC<FraudDetectionPanelProps> = ({
  fraudAnalyses,
  onTriggerScan
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<FraudAnalysisResult | null>(null);

  const handleRunScan = async () => {
    setIsScanning(true);
    playSoundCue('voice');

    await onTriggerScan();
    setIsScanning(false);
    playSoundCue('success');
    speakText('Pemindaian AI anti-penipuan selesai. Semua kontrak syariah dan pengajuan penyaluran dinyatakan aman.', 'id-ID');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-neutral-900">
              Sistem Deteksi Penipuan Otomatis Berbasis AI
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Menganalisis anomali transaksi, duplikasi klaim mustahiq, dan validitas tanda tangan digital vendor
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Menganalisis Pola Transaksi...' : 'Jalankan Audit AI Real-Time'}</span>
        </button>
      </div>

      {/* Security Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Tingkat Keamanan Platform</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-950 font-mono">
            99.8% Aman
          </div>
          <p className="text-[11px] text-emerald-800 mt-1">
            Nol insiden fraud atau pengalihan dana ilegal tercatat sejak genesis block.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-700 font-bold text-xs mb-1">
            <Lock className="w-4 h-4 text-neutral-600" />
            <span>Pemeriksaan Anomali Otomatis</span>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 font-mono">
            4 Lapisan
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Biometrik Wajah, Geolokasi, Hash Faktur, & Smart Contract Guard.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-700 font-bold text-xs mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Audit Model AI</span>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 font-mono">
            Gemini Anti-Fraud
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Model pembelajaran mendalam dilatih pada jutaan parameter transaksi filantropi.
          </p>
        </div>
      </div>

      {/* Analysis Results Feed */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900">
            Laporan Analisis Risiko Kampanye & Penyaluran
          </h3>
          <span className="text-[11px] font-mono text-neutral-400">
            Evaluasi Berkelanjutan
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {fraudAnalyses.map(item => (
            <div key={item.id} className="p-4 hover:bg-neutral-50 transition-colors text-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400 font-semibold">{item.id}</span>
                    <span className="font-bold text-neutral-900">{item.campaignTitle}</span>
                  </div>
                  <div className="mt-1 text-neutral-600 space-y-1">
                    {item.anomaliesDetected.map((anomaly, idx) => (
                      <p key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span>{anomaly}</span>
                      </p>
                    ))}
                  </div>
                  <p className="text-neutral-500 mt-2 text-[11px]">
                    <strong>Rekomendasi AI:</strong> {item.recommendation}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold ${
                    item.riskLevel === 'LOW' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : item.riskLevel === 'MEDIUM' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Skor Risiko: {item.riskScore}/100 ({item.riskLevel})
                  </span>
                  <p className="text-[10px] font-mono text-neutral-400 mt-1">{item.evaluatedAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
