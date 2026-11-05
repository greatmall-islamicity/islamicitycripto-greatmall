import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Users, 
  CheckCircle2, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Campaign } from '../types';
import { formatIdr, formatUsdt, playSoundCue } from '../utils/cryptoSim';

interface AnalyticsDashboardProps {
  campaigns: Campaign[];
  onOpenReportModal: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  campaigns,
  onOpenReportModal
}) => {
  const totalRaised = campaigns.reduce((acc, c) => acc + c.raisedAmount, 0);
  const totalDistributed = campaigns.reduce((acc, c) => acc + c.distributedAmount, 0);
  const totalBeneficiaries = campaigns.reduce((acc, c) => acc + c.beneficiaryCount, 0);
  const totalBiometrics = campaigns.reduce((acc, c) => acc + c.biometricVerifiedCount, 0);

  const distributionVelocity = ((totalDistributed / totalRaised) * 100).toFixed(1);

  const asnafBreakdown = [
    { name: 'Fakir (Sangat Membutuhkan)', percent: 36, amount: totalDistributed * 0.36, color: 'bg-emerald-600' },
    { name: 'Miskin (Penghasilan Tidak Mencukupi)', percent: 32, amount: totalDistributed * 0.32, color: 'bg-emerald-500' },
    { name: 'Gharimin (Terlilit Hutang Pokok Bebas Riba)', percent: 14, amount: totalDistributed * 0.14, color: 'bg-teal-600' },
    { name: 'Ibnu Sabil (Musafir / Krisis Air & Sanitasi)', percent: 10, amount: totalDistributed * 0.10, color: 'bg-sky-600' },
    { name: 'Fisabilillah & Pendidikan Syariah', percent: 5, amount: totalDistributed * 0.05, color: 'bg-indigo-600' },
    { name: 'Amil (Operasional Transparan - Di Bawah Regulasi)', percent: 3, amount: totalDistributed * 0.03, color: 'bg-neutral-600' },
  ];

  const monthlyHistory = [
    { month: 'Mei', in: 620, out: 580 },
    { month: 'Jun', in: 840, out: 810 },
    { month: 'Jul', in: 950, out: 890 },
    { month: 'Ags', in: 1100, out: 1050 },
    { month: 'Sep', in: 1350, out: 1290 },
    { month: 'Okt (Berjalan)', in: 1540, out: 1480 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Export Actions */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>Dasbor Analitik Real-Time Penyaluran Dana</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit transparansi berkala tervalidasi konsensus blockchain & akuntan publik syariah
          </p>
        </div>

        <button
          onClick={() => {
            playSoundCue('click');
            onOpenReportModal();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Laporan Akuntabilitas (PDF / CSV)</span>
        </button>
      </div>

      {/* KPI 4-Card Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Total Dana Terhimpun</span>
          <div className="text-xl font-extrabold text-neutral-900 font-mono tabular-nums">
            {formatIdr(totalRaised)}
          </div>
          <span className="text-[11px] font-mono text-emerald-700 mt-1 block">
            ≈ {formatUsdt(totalRaised / 15600)}
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Tersalurkan ke Mustahiq</span>
          <div className="text-xl font-extrabold text-emerald-800 font-mono tabular-nums">
            {formatIdr(totalDistributed)}
          </div>
          <span className="text-[11px] font-mono text-emerald-700 mt-1 block">
            ≈ {formatUsdt(totalDistributed / 15600)}
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Rasio Distribusi Cepat</span>
          <div className="text-xl font-extrabold text-neutral-900 font-mono tabular-nums flex items-baseline gap-1">
            <span>{distributionVelocity}%</span>
            <span className="text-xs font-semibold text-emerald-700 font-sans">Sesuai Syariah</span>
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Target SLA distribusi &lt; 14 hari
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Penerima Terverifikasi Biometrik</span>
          <div className="text-xl font-extrabold text-neutral-900 font-mono tabular-nums">
            {totalBiometrics.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Anti-Duplikasi
          </span>
        </div>
      </div>

      {/* Grid: Asnaf Allocation & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Asnaf Allocation Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Alokasi Penyaluran Sesuai 8 Asnaf
              </h3>
              <p className="text-xs text-neutral-500">
                Memastikan hak asnaf terpenuhi proporsional sesuai kaidah Fiqh Zakat
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Surah At-Taubah: 60
            </span>
          </div>

          <div className="space-y-3.5">
            {asnafBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-800">{item.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-neutral-500">{formatIdr(item.amount)}</span>
                    <span className="font-bold text-neutral-900">{item.percent}%</span>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500">
            * Alokasi bagian amil dijaga minimal (3%), jauh di bawah batas maksimum regulasi (12.5%), guna memaksimalkan maslahat mustahiq dhuafa.
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Perbandingan Penghimpunan vs Penyaluran (Juta Rp)
                </h3>
                <p className="text-xs text-neutral-500">
                  Konsistensi penyerapan amanah per bulan 2026
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-700" />
                  <span className="text-neutral-600">Penghimpunan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
                  <span className="text-neutral-600">Penyaluran</span>
                </div>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-neutral-200">
              {monthlyHistory.map((m, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* Inflow bar */}
                    <div 
                      className="w-1/2 bg-emerald-700 rounded-t-xs transition-all hover:bg-emerald-800"
                      style={{ height: `${(m.in / 1600) * 100}%` }}
                      title={`Penghimpunan: Rp ${m.in} Juta`}
                    />
                    {/* Outflow bar */}
                    <div 
                      className="w-1/2 bg-emerald-400 rounded-t-xs transition-all hover:bg-emerald-500"
                      style={{ height: `${(m.out / 1600) * 100}%` }}
                      title={`Penyaluran: Rp ${m.out} Juta`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-neutral-600 mt-1">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-600">Pertumbuhan Muzakki Baru Bulan Ini:</span>
            <span className="font-bold text-emerald-800 font-mono flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +28.4% MoM
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
