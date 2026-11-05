import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  Sankey, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Lock, 
  CheckCircle2, 
  Fingerprint, 
  Activity, 
  Play, 
  Pause, 
  RefreshCw, 
  FileCode,
  Coins,
  Building2,
  Users,
  Eye,
  Info
} from 'lucide-react';
import { formatIdr, formatUsdt, playSoundCue } from '../utils/cryptoSim';

interface GovernanceVisualizerProps {
  onInspectContract?: (address: string) => void;
}

export const GovernanceVisualizer: React.FC<GovernanceVisualizerProps> = ({
  onInspectContract
}) => {
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<string | null>('router');
  const [flowSpeed, setFlowSpeed] = useState<number>(3);
  const [activeStageStep, setActiveStageStep] = useState<number>(1);

  // Simulated live stage flow advancement
  useEffect(() => {
    if (!isSimulating) return;
    const timer = setInterval(() => {
      setActiveStageStep(prev => (prev % 4) + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, [isSimulating]);

  // Data for Recharts Sankey fund distribution flow
  const sankeyData = {
    nodes: [
      // 0-2: Inflow Sources
      { name: 'Muzakki (E-Wallets / QRIS)' },
      { name: 'Muzakki (Kripto USDT & ISLM)' },
      { name: 'Muzakki (Bank Syariah VA)' },
      // 3: Central Invariant Router
      { name: 'ShariaGovernanceRouter.sol' },
      // 4-6: Intermediary Escrows
      { name: 'ZakatDisbursementEscrow.sol' },
      { name: 'WaqfYieldPerpetualEscrow.sol' },
      { name: 'QardhulHasanRevolvingEscrow.sol' },
      // 7-10: Beneficiary Mustahiq Wallets
      { name: 'Mustahiq Fakir (Dompet Digital / Bantuan Pangan)' },
      { name: 'Mustahiq Miskin (Klinik & Kesehatan Komunitas)' },
      { name: 'Asnaf Gharimin (Pembebasan Hutang Riba)' },
      { name: 'Ibnu Sabil & Wakaf Sumur Bersih' }
    ],
    links: [
      // From Sources to Router
      { source: 0, target: 3, value: 2450 },
      { source: 1, target: 3, value: 1680 },
      { source: 2, target: 3, value: 1592 },
      // From Router to Escrows
      { source: 3, target: 4, value: 3200 },
      { source: 3, target: 5, value: 1890 },
      { source: 3, target: 6, value: 632 },
      // From Escrows to Beneficiaries
      { source: 4, target: 7, value: 1850 },
      { source: 4, target: 8, value: 1350 },
      { source: 5, target: 8, value: 1100 },
      { source: 5, target: 10, value: 790 },
      { source: 6, target: 9, value: 632 }
    ]
  };

  // Stage Volume Trend Chart Data (Inflow, In-Escrow, Settled to Beneficiaries)
  const stageVolumeData = [
    { name: 'Tahap 1: Deposit Muzakki', masuk: 5722, terkunciEscrow: 0, tersalurkanMustahiq: 0 },
    { name: 'Tahap 2: Sharia Router', masuk: 5722, terkunciEscrow: 280, tersalurkanMustahiq: 0 },
    { name: 'Tahap 3: Escrow & Biometrik', masuk: 5722, terkunciEscrow: 352, tersalurkanMustahiq: 4890 },
    { name: 'Tahap 4: Dompet Mustahiq', masuk: 5722, terkunciEscrow: 0, tersalurkanMustahiq: 5370 },
  ];

  // Stage Flow Steps Metadata
  const flowStages = [
    {
      step: 1,
      title: '1. Deposit Awal Muzakki',
      subtitle: 'Inflow Gateway Multi-Chain',
      contract: 'ZakatInflowGateway.sol',
      address: '0x1A89...78F2',
      metric: 'Rp 5.722.850.000',
      status: 'Konsensus Divalidasi',
      icon: Coins,
      description: 'Dana zakat/wakaf disetorkan donatur melalui QRIS, E-Wallet, Bank Syariah VA, atau kripto halal (USDT/ISLM) dengan stempel waktu on-chain.'
    },
    {
      step: 2,
      title: '2. Sharia Invariant Router',
      subtitle: 'Validasi Fiqh & Kepatuhan Asnaf',
      contract: 'ShariaGovernanceRouter.sol',
      address: '0x8920...43e7',
      metric: '0.00% Riba · 100% Reserves',
      status: 'DSN-MUI Approved',
      icon: ShieldCheck,
      description: 'Smart contract memvalidasi invarian syariah: memastikan alokasi 8 Asnaf tepat, membatasi amil maksimal 3.0%, dan menolak segala bentuk riba.'
    },
    {
      step: 3,
      title: '3. Intermediary Escrow Vault',
      subtitle: 'Penguncian Dana Bersyarat Biometrik',
      contract: 'ZakatDisbursementEscrow.sol',
      address: '0x4389...8821',
      metric: 'Rp 352 Juta (In-Transit)',
      status: 'Biometric Gate Locked',
      icon: Lock,
      description: 'Dana tersimpan di escrow aman dan HANYA bisa dicairkan jika oracle biometrik memverifikasi identitas liveness penerima manfaat (Mustahiq).'
    },
    {
      step: 4,
      title: '4. Dompet Akhir Mustahiq',
      subtitle: 'Penyaluran Sah ke Penerima Hak',
      contract: 'MustahiqPayoutOracle.sol',
      address: '0x9923...5541',
      metric: 'Rp 5.370.000.000 (93.8%)',
      status: 'Selesai & Terverifikasi',
      icon: Users,
      description: 'Dana ditransfer langsung tanpa perantara ke dompet digital mustahiq atau ditukarkan menjadi paket sembako/klinik terverifikasi geotagging.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Visualizer Top Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-neutral-900">
                Governance Visualizer: Alur Distribusi Dana Smart Contract
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {isSimulating ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Real-Time Flow Engine</span>
                  </>
                ) : (
                  <span>Simulasi Dijeda</span>
                )}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Visualisasi alur perpindahan dana zakat & wakaf mulai dari setoran awal muzakki, melewati kontrak escrow syariah, hingga diterima dompet mustahiq
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSoundCue('click');
                setIsSimulating(!isSimulating);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                isSimulating 
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800' 
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulating ? 'Jeda Simulasi Aliran' : 'Jalankan Aliran'}</span>
            </button>
          </div>
        </div>

        {/* 4-Step Interactive Pipeline Flow Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-neutral-100">
          {flowStages.map(stage => {
            const StageIcon = stage.icon;
            const isActive = activeStageStep === stage.step;

            return (
              <div
                key={stage.step}
                onClick={() => {
                  playSoundCue('click');
                  setActiveStageStep(stage.step);
                }}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer text-xs relative ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 right-3 px-1.5 py-0.2 bg-emerald-700 text-white font-mono text-[9px] rounded-xs font-bold uppercase tracking-wider">
                    Aliran Aktif
                  </span>
                )}
                
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-emerald-700 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    <StageIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-neutral-900 block truncate">{stage.title}</span>
                    <span className="text-[10px] text-neutral-500 block truncate">{stage.subtitle}</span>
                  </div>
                </div>

                <div className="my-2 p-1.5 bg-white rounded border border-neutral-100 font-mono text-[11px] flex items-center justify-between">
                  <span className="text-neutral-500 font-bold">{stage.metric}</span>
                  <span className="text-emerald-700 text-[10px]">{stage.status}</span>
                </div>

                <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recharts Flow Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recharts Sankey Diagram of Distribution Flow */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Pemetaan Topologi Alur Kontrak Pintar (Sankey Flow Chart)
              </h4>
              <p className="text-xs text-neutral-500">
                Visualisasi volume dana (Juta Rp) dari setoran awal menuju rekening escrow perantara dan dompet mustahiq
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Zero-Leakage Consensus
            </span>
          </div>

          {/* Recharts Sankey Component */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <Sankey
                data={sankeyData}
                nodeWidth={14}
                nodePadding={24}
                margin={{ top: 10, right: 140, bottom: 10, left: 20 }}
                link={{ stroke: '#10b981', strokeOpacity: 0.35 }}
                node={{ fill: '#047857' }}
              >
                <Tooltip 
                  formatter={(value: any) => [`Rp ${value} Juta`, 'Volume Aliran']} 
                  contentStyle={{ backgroundColor: '#18181b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
              </Sankey>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-neutral-100 text-center text-xs">
            <div className="p-2 bg-neutral-50 rounded">
              <span className="text-neutral-500 block text-[11px]">Sumber Donatur:</span>
              <strong className="text-neutral-800">3 Saluran Gateway</strong>
            </div>
            <div className="p-2 bg-neutral-50 rounded">
              <span className="text-neutral-500 block text-[11px]">Intermediary Escrow:</span>
              <strong className="text-emerald-800">3 Smart Vaults</strong>
            </div>
            <div className="p-2 bg-neutral-50 rounded">
              <span className="text-neutral-500 block text-[11px]">Target Penerima:</span>
              <strong className="text-neutral-800">4 Klaster Asnaf</strong>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Stage Volume Comparison Bar Chart */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">
                  Volume Tahapan Penyaluran
                </h4>
                <p className="text-xs text-neutral-500">
                  Volume akumulasi dana (Juta Rp) per tahap tata kelola
                </p>
              </div>
            </div>

            {/* Recharts BarChart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" angle={-18} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(val: any) => [`Rp ${val} Juta`, '']} 
                    contentStyle={{ backgroundColor: '#18181b', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="masuk" fill="#047857" name="Total Inflow" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tersalurkanMustahiq" fill="#34d399" name="Tersalurkan" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Contract Invariant Card */}
          <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-800 flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-emerald-700" />
                <span>Smart Contract Invarian Aktif:</span>
              </span>
              <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                ENFORCED
              </span>
            </div>
            <p className="text-[11px] text-neutral-600">
              Escrow mengunci dana secara kriptografis menggunakan *Time-locked Multi-Sig* bersama BAZNAS & Dewan Pengawas Syariah. Dana tidak bisa dialihkan untuk operasional amil melampaui plafon 3.0%.
            </p>
          </div>
        </div>

      </div>

      {/* Real-Time Transaction Routing Trace Matrix */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-neutral-900">
              Jejak Audit Perjalanan Transaksi (Transaction Lifecycle Trace)
            </h4>
            <p className="text-xs text-neutral-500">
              Menelusuri bagaimana setiap rupiah atau token bergerak dari penyetor ke mustahiq tanpa jeda manual
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Trace SLA &lt; 2 Detik
          </span>
        </div>

        <div className="p-4 overflow-x-auto">
          <div className="min-w-[650px] flex items-center justify-between relative py-2">
            
            {/* Step 1 Node */}
            <div className="flex flex-col items-center text-center w-36">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center text-emerald-900 mb-2">
                <Coins className="w-5 h-5 text-emerald-700" />
              </div>
              <span className="font-bold text-xs text-neutral-900">Setoran Muzakki</span>
              <span className="text-[10px] text-neutral-500 font-mono">0x4E...8A</span>
              <span className="text-[10px] font-bold text-emerald-700 mt-1">Rp 5.000.000</span>
            </div>

            <ArrowRight className="w-5 h-5 text-emerald-600 shrink-0 animate-pulse" />

            {/* Step 2 Node */}
            <div className="flex flex-col items-center text-center w-40">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center mb-2 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="font-bold text-xs text-neutral-900">Router Syariah</span>
              <span className="text-[10px] text-neutral-500 font-mono">ShariaRouter.sol</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 font-semibold">
                Asnaf Fakir (100%)
              </span>
            </div>

            <ArrowRight className="w-5 h-5 text-emerald-600 shrink-0 animate-pulse" />

            {/* Step 3 Node */}
            <div className="flex flex-col items-center text-center w-44">
              <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-500 text-amber-800 flex items-center justify-center mb-2">
                <Fingerprint className="w-5 h-5 text-amber-700" />
              </div>
              <span className="font-bold text-xs text-neutral-900">Escrow & Biometrik</span>
              <span className="text-[10px] text-neutral-500 font-mono">DisbursementEscrow</span>
              <span className="text-[10px] text-amber-800 font-bold mt-1">
                BIO-PASS-99824 (99.6%)
              </span>
            </div>

            <ArrowRight className="w-5 h-5 text-emerald-600 shrink-0 animate-pulse" />

            {/* Step 4 Node */}
            <div className="flex flex-col items-center text-center w-40">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xs text-neutral-900">Dompet Mustahiq</span>
              <span className="text-[10px] text-neutral-500 font-mono">Siti Aminah (#Sukabumi)</span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1">
                TERIMA SAH (100%)
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
