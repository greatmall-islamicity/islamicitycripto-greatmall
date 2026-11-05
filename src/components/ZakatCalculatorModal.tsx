import React, { useState } from 'react';
import { Calculator, X, Coins, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatIdr, formatUsdt, playSoundCue } from '../utils/cryptoSim';

interface ZakatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedDonation: (amountIdr: number, category: string) => void;
}

export const ZakatCalculatorModal: React.FC<ZakatCalculatorModalProps> = ({
  isOpen,
  onClose,
  onProceedDonation
}) => {
  const [activeTab, setActiveTab] = useState<'maal' | 'profesi' | 'fitrah'>('maal');

  // Maal inputs
  const [tabungan, setTabungan] = useState<number>(150000000);
  const [emasGram, setEmasGram] = useState<number>(20);
  const [hargaEmasGram] = useState<number>(1450000); // Rp 1.450.000/gram
  const [investasi, setInvestasi] = useState<number>(0);
  const [hutangJatuhTempo, setHutangJatuhTempo] = useState<number>(0);

  // Profesi inputs
  const [gajiBulanan, setGajiBulanan] = useState<number>(18000000);
  const [pendapatanLain, setPendapatanLain] = useState<number>(2000000);
  const [pengeluaranPokok, setPengeluaranPokok] = useState<number>(8000000);

  // Fitrah inputs
  const [jumlahJiwa, setJumlahJiwa] = useState<number>(4);
  const hargaBerasPerJiwa = 50000; // Rp 50.000 per jiwa (setara 2.5 kg / 3.5 liter beras)

  if (!isOpen) return null;

  // Nisab constants
  const nisabMaalIdr = 85 * hargaEmasGram; // Rp 123.250.000
  const nisabProfesiBulanan = (524 * 15000); // 524 kg beras @ Rp 15.000 = Rp 7.860.000

  // Calculations
  const totalHartaMaal = tabungan + (emasGram * hargaEmasGram) + investasi - hutangJatuhTempo;
  const isMaalWajib = totalHartaMaal >= nisabMaalIdr;
  const zakatMaalAmount = isMaalWajib ? Math.round(totalHartaMaal * 0.025) : 0;

  const totalBersihBulanan = (gajiBulanan + pendapatanLain) - pengeluaranPokok;
  const isProfesiWajib = totalBersihBulanan >= nisabProfesiBulanan;
  const zakatProfesiAmount = isProfesiWajib ? Math.round(totalBersihBulanan * 0.025) : 0;

  const zakatFitrahAmount = jumlahJiwa * hargaBerasPerJiwa;

  let currentCalculatedAmount = 0;
  let isEligible = true;
  let targetCategory = 'zakat_maal';

  if (activeTab === 'maal') {
    currentCalculatedAmount = zakatMaalAmount;
    isEligible = isMaalWajib;
    targetCategory = 'zakat_maal';
  } else if (activeTab === 'profesi') {
    currentCalculatedAmount = zakatProfesiAmount;
    isEligible = isProfesiWajib;
    targetCategory = 'zakat_profesi';
  } else {
    currentCalculatedAmount = zakatFitrahAmount;
    isEligible = true;
    targetCategory = 'zakat_fitrah';
  }

  const cryptoUsdtEquivalent = (currentCalculatedAmount / 15600);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="zakat-calc-title"
    >
      <div className="bg-white rounded-xl max-w-xl w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Calculator className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 id="zakat-calc-title" className="text-base font-bold text-neutral-900">
                Kalkulator Zakat Syariah Otomatis
              </h2>
              <p className="text-xs text-neutral-500">Standar BAZNAS & Nisab Emas Terverifikasi</p>
            </div>
          </div>
          <button
            onClick={() => {
              playSoundCue('click');
              onClose();
            }}
            aria-label="Tutup Kalkulator Zakat"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg my-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('maal')}
            className={`flex-1 py-2 text-center rounded-md transition-colors cursor-pointer ${
              activeTab === 'maal' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Zakat Maal (Harta)
          </button>
          <button
            onClick={() => setActiveTab('profesi')}
            className={`flex-1 py-2 text-center rounded-md transition-colors cursor-pointer ${
              activeTab === 'profesi' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Zakat Profesi (Penghasilan)
          </button>
          <button
            onClick={() => setActiveTab('fitrah')}
            className={`flex-1 py-2 text-center rounded-md transition-colors cursor-pointer ${
              activeTab === 'fitrah' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Zakat Fitrah
          </button>
        </div>

        {/* Tab 1: Maal */}
        {activeTab === 'maal' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start justify-between gap-3">
              <div>
                <span className="font-semibold text-neutral-900">Nisab Zakat Maal (85 gr Emas):</span>
                <p className="text-neutral-500 mt-0.5">85 gram × Rp 1.450.000 = <strong>{formatIdr(nisabMaalIdr)}</strong></p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${isMaalWajib ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'}`}>
                {isMaalWajib ? 'Wajib Zakat' : 'Belum Mencapai Nisab'}
              </span>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Saldo Tabungan / Deposito / Giro (Rp)
              </label>
              <input
                type="number"
                value={tabungan}
                onChange={e => setTabungan(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Emas Batangan / Simpanan (Gram)
                </label>
                <input
                  type="number"
                  value={emasGram}
                  onChange={e => setEmasGram(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Surat Berharga / Investasi (Rp)
                </label>
                <input
                  type="number"
                  value={investasi}
                  onChange={e => setInvestasi(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Hutang Jatuh Tempo / Pengurang (Rp)
              </label>
              <input
                type="number"
                value={hutangJatuhTempo}
                onChange={e => setHutangJatuhTempo(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Profesi */}
        {activeTab === 'profesi' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start justify-between gap-3">
              <div>
                <span className="font-semibold text-neutral-900">Nisab Bulanan (524 kg Beras):</span>
                <p className="text-neutral-500 mt-0.5">524 kg × Rp 15.000 = <strong>{formatIdr(nisabProfesiBulanan)} / bulan</strong></p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${isProfesiWajib ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'}`}>
                {isProfesiWajib ? 'Wajib Zakat' : 'Belum Mencapai Nisab'}
              </span>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Penghasilan Tetap Bulanan / Gaji (Rp)
              </label>
              <input
                type="number"
                value={gajiBulanan}
                onChange={e => setGajiBulanan(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Penghasilan Tambahan / Bonus / Dividen (Rp)
              </label>
              <input
                type="number"
                value={pendapatanLain}
                onChange={e => setPendapatanLain(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Pengeluaran Kebutuhan Pokok Bulanan (Rp)
              </label>
              <input
                type="number"
                value={pengeluaranPokok}
                onChange={e => setPengeluaranPokok(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Fitrah */}
        {activeTab === 'fitrah' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="font-semibold text-neutral-900">Ketentuan Zakat Fitrah:</span>
              <p className="text-neutral-500 mt-0.5">
                Wajib ditunaikan sebelum shalat Idul Fitri sebesar 1 sha&apos; (2,5 kg atau 3,5 liter beras) per jiwa atau setara <strong>Rp 50.000 / jiwa</strong>.
              </p>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Jumlah Jiwa / Anggota Keluarga yang Ditanggung
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={jumlahJiwa}
                  onChange={e => setJumlahJiwa(Math.max(1, Number(e.target.value)))}
                  className="w-32 px-3 py-2 border border-neutral-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
                <span className="text-neutral-600 font-medium">Orang</span>
              </div>
            </div>
          </div>
        )}

        {/* Calculation Result Summary Box */}
        <div className="mt-5 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wide">
              Kewajiban Zakat Anda (2.5%):
            </span>
            <span className="text-[11px] font-mono text-emerald-700">
              ≈ {formatUsdt(cryptoUsdtEquivalent)}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-950 font-mono tabular-nums">
            {formatIdr(currentCalculatedAmount)}
          </div>
          <p className="text-[11px] text-emerald-800 mt-1">
            {isEligible 
              ? 'Telah memenuhi syarat Nisab & Haul syariah. Siap disalurkan via blockchain.'
              : 'Jumlah harta belum melampaui nisab wajib zakat, namun dianjurkan berinfak sukarela.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 rounded-md cursor-pointer"
          >
            Batal
          </button>
          
          <button
            onClick={() => {
              playSoundCue('success');
              onProceedDonation(currentCalculatedAmount > 0 ? currentCalculatedAmount : 100000, targetCategory);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>Tunaikan Zakat Ini Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
