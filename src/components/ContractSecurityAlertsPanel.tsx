import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  ExternalLink, 
  Clock, 
  Check, 
  FileCode,
  Layers,
  RefreshCw
} from 'lucide-react';
import { ContractSecurityAlert } from '../types';
import { initialContractSecurityAlerts } from '../data/mockData';
import { formatAddress, playSoundCue, speakText } from '../utils/cryptoSim';

interface ContractSecurityAlertsPanelProps {
  onNavigateToAuditTrail?: () => void;
  onNavigateToGovernance?: () => void;
}

export const ContractSecurityAlertsPanel: React.FC<ContractSecurityAlertsPanelProps> = ({
  onNavigateToAuditTrail,
  onNavigateToGovernance
}) => {
  const [alerts, setAlerts] = useState<ContractSecurityAlert[]>(initialContractSecurityAlerts);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [browserPushEnabled, setBrowserPushEnabled] = useState<boolean>(false);
  const [activePushToast, setActivePushToast] = useState<ContractSecurityAlert | null>(null);
  const [isSimulatingEvents, setIsSimulatingEvents] = useState<boolean>(true);

  // Auto-dismiss active push toast after 6 seconds
  useEffect(() => {
    if (!activePushToast) return;
    const timer = setTimeout(() => {
      setActivePushToast(null);
    }, 6500);
    return () => clearTimeout(timer);
  }, [activePushToast]);

  // Request browser desktop notification permission
  const handleRequestPushPermission = async () => {
    playSoundCue('click');
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setBrowserPushEnabled(true);
          playSoundCue('success');
          new Notification('Islamicity Cripto Shield', {
            body: 'Notifikasi Push Real-Time Smart Contract diaktifkan.',
            icon: '/favicon.ico'
          });
        }
      } catch {
        // Fallback
      }
    }
  };

  // Dispatch new push alert (internal toast + optional sound + browser push)
  const dispatchPushAlert = (newAlert: ContractSecurityAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
    setActivePushToast(newAlert);

    if (soundEnabled) {
      playSoundCue('alert');
    }

    if (browserPushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`[${newAlert.severity}] ${newAlert.title}`, {
          body: `${newAlert.message} (${newAlert.contractName})`,
          icon: '/favicon.ico'
        });
      } catch {}
    }
  };

  // Trigger manual simulation of suspicious activity
  const handleTriggerSimulatedAnomaly = () => {
    playSoundCue('click');
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newBlock = 489211 + Math.floor(Math.random() * 10);

    const simulatedCases: Omit<ContractSecurityAlert, 'id' | 'timestamp' | 'blockNumber' | 'read' | 'resolved'>[] = [
      {
        severity: 'CRITICAL',
        title: 'Percobaan Penarikan Tanpa Otorisasi Biometrik Terdeteksi',
        message: 'Kontrak mendeteksi upaya relayer asing mengklaim dana Asnaf Fakir Sukabumi dengan tanda tangan biometrik palsu.',
        contractName: 'IslamicZakatVaultV2.sol',
        contractAddress: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
        category: 'INVARIANT_CIRCUIT_BREAKER',
        actionSuggested: 'Smart Contract Circuit Breaker aktif otomatis memblokir pemanggil. Dana tetap aman 100%.'
      },
      {
        severity: 'WARNING',
        title: 'Anomali Kecepatan Penarikan Berulang (High Velocity)',
        message: 'Terjadi 4 penarikan beruntun dalam 12 detik dari klaster IP relayer sama.',
        contractName: 'ZakatDisbursementEscrow.sol',
        contractAddress: '0x4389104A3b2A69De6Dbf7f01ED13B2108B2c8821',
        category: 'SUSPICIOUS_VELOCITY',
        actionSuggested: 'Masa jeda throttle 60 detik diterapkan otomatis oleh smart contract.'
      },
      {
        severity: 'NOTICE',
        title: 'Status Kritis: Proposal Multi-Sig DSN-MUI Dimulai',
        message: 'Perubahan kontrak upgrade logika verifikasi ZK diajukan ke Timelock 72 Jam.',
        contractName: 'ShariaGovernanceConsensus.sol',
        contractAddress: '0x5519804A3b2A69De6Dbf7f01ED13B2108B2c1109',
        category: 'TIMELOCK_UPGRADE',
        actionSuggested: 'Menunggu 3 dari 5 tanda tangan validator independen dewan syariah.'
      }
    ];

    const pick = simulatedCases[Math.floor(Math.random() * simulatedCases.length)];
    const newAlert: ContractSecurityAlert = {
      id: 'ALERT-' + Math.floor(100 + Math.random() * 900),
      timestamp: timeStr,
      blockNumber: newBlock,
      severity: pick.severity,
      title: pick.title,
      message: pick.message,
      contractName: pick.contractName,
      contractAddress: pick.contractAddress,
      category: pick.category,
      actionSuggested: pick.actionSuggested,
      read: false,
      resolved: false
    };

    dispatchPushAlert(newAlert);
  };

  const handleMarkAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    playSoundCue('click');
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true, read: true } : a));
    playSoundCue('success');
  };

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && !a.resolved).length;

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-4">
      
      {/* Floating Push Notification Toast */}
      {activePushToast && (
        <div 
          className="fixed top-20 right-4 z-50 max-w-md w-full animate-in slide-in-from-top-3 fade-in duration-300"
          role="alert"
          aria-live="assertive"
        >
          <div className={`p-4 rounded-xl border shadow-xl backdrop-blur-md ${
            activePushToast.severity === 'CRITICAL'
              ? 'bg-neutral-900/95 border-red-500/80 text-white'
              : activePushToast.severity === 'WARNING'
              ? 'bg-neutral-900/95 border-amber-500/80 text-white'
              : 'bg-neutral-900/95 border-sky-500/80 text-white'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  activePushToast.severity === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400'
                    : activePushToast.severity === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-sky-500/20 text-sky-400'
                }`}>
                  {activePushToast.severity === 'CRITICAL' ? (
                    <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />
                  ) : activePushToast.severity === 'WARNING' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Info className="w-5 h-5 text-sky-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                      activePushToast.severity === 'CRITICAL' 
                        ? 'bg-red-600 text-white' 
                        : activePushToast.severity === 'WARNING'
                        ? 'bg-amber-600 text-white'
                        : 'bg-sky-600 text-white'
                    }`}>
                      PUSH NOTIFIKASI · {activePushToast.severity}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Blok #{activePushToast.blockNumber}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold mt-1 text-white leading-tight">
                    {activePushToast.title}
                  </h5>

                  <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                    {activePushToast.message}
                  </p>

                  <div className="mt-2 text-[10px] text-emerald-400 font-mono">
                    Kontrak: {activePushToast.contractName}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActivePushToast(null)}
                className="text-neutral-400 hover:text-white p-1 rounded cursor-pointer"
                aria-label="Tutup Notifikasi Push"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">{activePushToast.timestamp.split(' ')[1]}</span>
              <button
                onClick={() => {
                  setActivePushToast(null);
                  if (onNavigateToAuditTrail) onNavigateToAuditTrail();
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Periksa di Audit Trail</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Security Center Banner inside Explorer */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-neutral-900">
                Pusat Notifikasi Push & Pengawasan Keamanan Smart Contract
              </h3>
              {criticalCount > 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 animate-pulse">
                  <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                  {criticalCount} Anomali Kritis
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Semua Kontrak Normal
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Sistem alarm otomatis mendeteksi anomali penarikan, perubahan timelock, dan percobaan manipulasi tata kelola syariah secara real-time
            </p>
          </div>

          {/* Preferences & Test Trigger Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sound toggle */}
            <button
              onClick={() => {
                const nextState = !soundEnabled;
                setSoundEnabled(nextState);
                if (nextState) playSoundCue('success');
              }}
              className={`p-2 rounded-md border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                soundEnabled 
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold' 
                  : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
              title={soundEnabled ? 'Suara Alarm Aktif' : 'Suara Alarm Dibisukan'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-700" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-400" />}
              <span>{soundEnabled ? 'Alarm Suara On' : 'Alarm Mute'}</span>
            </button>

            {/* Browser Desktop Push Permission */}
            <button
              onClick={handleRequestPushPermission}
              className={`px-3 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                browserPushEnabled
                  ? 'border-emerald-600 bg-emerald-700 text-white'
                  : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{browserPushEnabled ? 'Push Browser Aktif' : 'Aktifkan Push Browser'}</span>
            </button>

            {/* Test Simulation Button */}
            <button
              onClick={handleTriggerSimulatedAnomaly}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tes Simulasi Alarm</span>
            </button>
          </div>
        </div>

        {/* Severity Filter Strip */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-neutral-100 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-neutral-500 mr-1">Filter Tingkat Urgensi:</span>
            {[
              { id: 'all', label: `Semua (${alerts.length})` },
              { id: 'CRITICAL', label: 'Kritis (Circuit Breaker)' },
              { id: 'WARNING', label: 'Peringatan Anomali' },
              { id: 'NOTICE', label: 'Perubahan Timelock' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => {
                  playSoundCue('click');
                  setFilterSeverity(f.id);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterSeverity === f.id
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span>{unreadCount} Notifikasi Belum Dibaca</span>
            <button
              onClick={() => {
                playSoundCue('click');
                setAlerts(prev => prev.map(a => ({ ...a, read: true })));
              }}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Tandai Semua Dibaca
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs divide-y divide-neutral-100">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-neutral-800">Tidak ada notifikasi mencurigakan pada kriteria ini.</p>
            <p className="mt-0.5">Seluruh parameter smart contract berada dalam status nominal dan aman.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div 
              key={alert.id}
              className={`p-4 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs ${
                !alert.read ? 'bg-amber-50/20' : 'hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Severity Icon */}
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-red-100 text-red-700'
                    : alert.severity === 'WARNING'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-sky-100 text-sky-700'
                }`}>
                  {alert.severity === 'CRITICAL' ? (
                    <AlertOctagon className="w-5 h-5 text-red-600" />
                  ) : alert.severity === 'WARNING' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Info className="w-5 h-5 text-sky-600" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-red-600 text-white'
                        : alert.severity === 'WARNING'
                        ? 'bg-amber-600 text-white'
                        : 'bg-sky-600 text-white'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                      {alert.title}
                    </span>
                    {!alert.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" title="Baru" />
                    )}
                  </div>

                  <p className="text-neutral-600 leading-relaxed max-w-2xl">
                    {alert.message}
                  </p>

                  <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200 mt-2 text-[11px] space-y-1">
                    <div className="flex items-center gap-2 font-mono text-neutral-500">
                      <span>Kontrak: <strong className="text-neutral-800">{alert.contractName}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Blok #{alert.blockNumber}</span>
                    </div>
                    <p className="text-emerald-800 font-medium">
                      🛡️ <strong>Tindakan Sistem Otomatis:</strong> {alert.actionSuggested}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                <span className="text-[11px] font-mono text-neutral-400">
                  {alert.timestamp}
                </span>

                <div className="flex items-center gap-2">
                  {!alert.resolved ? (
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3 text-emerald-700" />
                      <span>Selesaikan</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Terselesaikan
                    </span>
                  )}

                  {!alert.read && (
                    <button
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="text-neutral-400 hover:text-neutral-700 p-1"
                      title="Tandai dibaca"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
