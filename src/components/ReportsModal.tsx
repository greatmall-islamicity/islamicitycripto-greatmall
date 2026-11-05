import React from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { Campaign } from '../types';
import { formatIdr, playSoundCue } from '../utils/cryptoSim';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  campaigns
}) => {
  if (!isOpen) return null;

  const totalRaised = campaigns.reduce((acc, c) => acc + c.raisedAmount, 0);
  const totalDistributed = campaigns.reduce((acc, c) => acc + c.distributedAmount, 0);

  const handleExportCsv = () => {
    playSoundCue('click');
    const headers = ['ID Program', 'Judul Program', 'Kategori Asnaf', 'Target IDR', 'Terkumpul IDR', 'Tersalurkan IDR', 'Penerima Manfaat', 'Smart Contract'];
    const rows = campaigns.map(c => [
      `"${c.id}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.asnafCategory}"`,
      c.targetAmount,
      c.raisedAmount,
      c.distributedAmount,
      c.beneficiaryCount,
      `"${c.smartContractAddress}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Audit_Islamicity_Cripto_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    playSoundCue('click');
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="bg-white rounded-xl max-w-2xl w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <FileText className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 id="report-modal-title" className="text-base font-bold text-neutral-900">
                Laporan Akuntabilitas & Transparansi Keuangan
              </h2>
              <p className="text-xs text-neutral-500">Standar PSAK 109 Fiqh Zakat & Audit Kriptografi Blockchain</p>
            </div>
          </div>
          <button
            onClick={() => {
              playSoundCue('click');
              onClose();
            }}
            aria-label="Tutup Laporan"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Sheet Preview */}
        <div className="my-4 p-5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-4 text-xs font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div>
              <span className="font-extrabold text-sm text-emerald-900 tracking-tight">ISLAMICITY CRIPTO FOUNDATION</span>
              <p className="text-[11px] text-neutral-500">Sovereign Sharia Crypto Philanthropy Infrastructure</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-[11px] text-neutral-500">Periode: Oktober 2026</span>
              <p className="text-[10px] text-emerald-700 font-bold">STATUS: AUDITED & ON-CHAIN</p>
            </div>
          </div>

          {/* Aggregate Numbers */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded border border-neutral-200">
            <div>
              <span className="text-neutral-500 block text-[11px]">Total Penghimpunan Zakat & Wakaf:</span>
              <span className="font-mono font-bold text-sm text-neutral-900">{formatIdr(totalRaised)}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[11px]">Total Tersalurkan ke Asnaf:</span>
              <span className="font-mono font-bold text-sm text-emerald-800">{formatIdr(totalDistributed)}</span>
            </div>
          </div>

          {/* Programs Table */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-600 font-semibold text-[11px]">
                <th className="py-1.5">Program</th>
                <th className="py-1.5">Asnaf</th>
                <th className="py-1.5 text-right">Terkumpul</th>
                <th className="py-1.5 text-right">Tersalurkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {campaigns.map(c => (
                <tr key={c.id} className="py-1.5">
                  <td className="py-1.5 font-medium text-neutral-900 pr-2">{c.title}</td>
                  <td className="py-1.5 capitalize text-neutral-600">{c.asnafCategory}</td>
                  <td className="py-1.5 text-right font-mono tabular-nums">{formatIdr(c.raisedAmount)}</td>
                  <td className="py-1.5 text-right font-mono tabular-nums text-emerald-700 font-semibold">{formatIdr(c.distributedAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cryptographic Proof Verification Stamp */}
          <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Stempel Keabsahan Kriptografi & Sharia Compliance</span>
            </div>
            <p className="font-mono text-[10px] text-emerald-800 truncate">
              Merkle Root Hash: 0x8849102938102938102938102938102938102938102938102938102938102938
            </p>
            <p className="text-[10px] text-emerald-700">
              Dokumen ini dapat diverifikasi publik tanpa membuka data pribadi sensitif donatur (Zero Knowledge).
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 rounded-md cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md text-xs font-semibold cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
