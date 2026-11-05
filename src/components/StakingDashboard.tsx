import React, { useState, useMemo } from 'react';
import { 
  Lock, 
  Unlock, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Clock, 
  Info, 
  ExternalLink, 
  Copy, 
  RefreshCw, 
  Layers, 
  Scale, 
  BookOpen, 
  HelpCircle,
  AlertCircle,
  Building,
  HeartHandshake,
  Percent,
  Sliders,
  DollarSign
} from 'lucide-react';
import { WaqfStakingPool, UserWaqfStake, ShariaContractModel, Language, BlockchainTransaction } from '../types';
import { initialWaqfStakingPools, initialUserWaqfStakes } from '../data/stakingData';
import { formatAddress, formatIdr, formatUsdt, playSoundCue, speakText, sha256 } from '../utils/cryptoSim';

interface StakingDashboardProps {
  lang: Language;
  onOpenExplorerWithTx: (txHash: string) => void;
  onSuccessStakeTransaction?: (tx: BlockchainTransaction) => void;
}

export const StakingDashboard: React.FC<StakingDashboardProps> = ({
  lang,
  onOpenExplorerWithTx,
  onSuccessStakeTransaction
}) => {
  const [pools] = useState<WaqfStakingPool[]>(initialWaqfStakingPools);
  const [userStakes, setUserStakes] = useState<UserWaqfStake[]>(initialUserWaqfStakes);
  const [activeTab, setActiveTab] = useState<'calculator' | 'pools' | 'portfolio' | 'sharia-model'>('calculator');
  
  // Interactive Calculator State
  const [selectedPoolId, setSelectedPoolId] = useState<string>(initialWaqfStakingPools[0].id);
  const [selectedToken, setSelectedToken] = useState<'USDT' | 'ISLM' | 'ETH' | 'PAXG'>('USDT');
  const [stakeTokenAmount, setStakeTokenAmount] = useState<number>(1000);
  const [lockMonths, setLockMonths] = useState<number>(12);
  const [donorShareChoice, setDonorShareChoice] = useState<'standard' | '100_percent_waqf' | '50_50'>('standard');
  const [autoCompound, setAutoCompound] = useState<boolean>(true);

  // Staking Execution Flow State
  const [isStaking, setIsStaking] = useState<boolean>(false);
  const [stakeSuccessReceipt, setStakeSuccessReceipt] = useState<UserWaqfStake | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Token Price Simulator (IDR equivalent)
  const tokenPricesIdr: Record<'USDT' | 'ISLM' | 'ETH' | 'PAXG', number> = {
    USDT: 15600,
    ISLM: 780,     // ~$0.05
    ETH: 53040000, // ~$3400
    PAXG: 41340000 // ~$2650
  };

  const selectedPool = useMemo(() => {
    return pools.find(p => p.id === selectedPoolId) || pools[0];
  }, [pools, selectedPoolId]);

  // Nominal conversions
  const totalStakeIdr = stakeTokenAmount * tokenPricesIdr[selectedToken];

  // Dynamic Sharia Yield Calculation (Nisbah Model: Base APY x Lock duration factor)
  const durationBonusFactor = useMemo(() => {
    switch (lockMonths) {
      case 3: return 0.85;
      case 6: return 0.95;
      case 12: return 1.0;
      case 24: return 1.15;
      case 36: return 1.30;
      default: return 1.0;
    }
  }, [lockMonths]);

  const effectiveAnnualApy = Number((selectedPool.estimatedApyPercent * durationBonusFactor).toFixed(2));

  // Determine profit split percentages
  const { donorSharePercent, waqfSharePercent } = useMemo(() => {
    if (selectedPool.shariaModel === 'QARDH_HASAN') {
      return { donorSharePercent: 0, waqfSharePercent: 100 };
    }
    if (donorShareChoice === '100_percent_waqf') {
      return { donorSharePercent: 0, waqfSharePercent: 100 };
    }
    if (donorShareChoice === '50_50') {
      return { donorSharePercent: 50, waqfSharePercent: 50 };
    }
    return {
      donorSharePercent: selectedPool.donorYieldSharePercent,
      waqfSharePercent: selectedPool.waqfPerpetualSharePercent
    };
  }, [selectedPool, donorShareChoice]);

  // Projected Yield Computations
  const totalProjectedYieldIdr = useMemo(() => {
    const annualReturn = (totalStakeIdr * effectiveAnnualApy) / 100;
    return (annualReturn * (lockMonths / 12));
  }, [totalStakeIdr, effectiveAnnualApy, lockMonths]);

  const projectedDonorYieldIdr = (totalProjectedYieldIdr * donorSharePercent) / 100;
  const projectedWaqfYieldIdr = (totalProjectedYieldIdr * waqfSharePercent) / 100;

  // Aggregate user portfolio metrics
  const portfolioStats = useMemo(() => {
    const totalStaked = userStakes.reduce((acc, curr) => acc + curr.stakedIdrAmount, 0);
    const totalWaqfImpact = userStakes.reduce((acc, curr) => acc + curr.accumulatedBeneficiaryYieldIdr, 0);
    const totalDonorEarnings = userStakes.reduce((acc, curr) => acc + curr.accumulatedDonorYieldIdr, 0);
    return { totalStaked, totalWaqfImpact, totalDonorEarnings };
  }, [userStakes]);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    playSoundCue('click');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Execute On-Chain Waqf Staking
  const handleConfirmStake = async () => {
    if (stakeTokenAmount <= 0) return;
    setIsStaking(true);
    playSoundCue('click');

    try {
      const now = new Date();
      const startDate = now.toISOString().split('T')[0];
      const matDateObj = new Date(now);
      matDateObj.setMonth(matDateObj.getMonth() + lockMonths);
      const maturityDate = matDateObj.toISOString().split('T')[0];

      const rawSeed = `${selectedPool.id}-${stakeTokenAmount}-${selectedToken}-${Date.now()}`;
      const generatedTxHash = await sha256(rawSeed);

      // 600ms simulated Sharia Smart Contract Lock consensus
      await new Promise(r => setTimeout(r, 600));

      const newStake: UserWaqfStake = {
        id: `stk-${Date.now().toString().slice(-4)}`,
        poolId: selectedPool.id,
        poolName: selectedPool.name,
        tokenSymbol: selectedToken,
        stakedTokenAmount: stakeTokenAmount,
        stakedIdrAmount: totalStakeIdr,
        lockPeriodMonths: lockMonths,
        startDate,
        maturityDate,
        shariaModel: selectedPool.shariaModel,
        projectedAnnualYieldIdr: totalProjectedYieldIdr,
        accumulatedBeneficiaryYieldIdr: projectedWaqfYieldIdr * 0.25, // Initial simulated progress
        accumulatedDonorYieldIdr: projectedDonorYieldIdr * 0.25,
        autoReinvestInWaqf: autoCompound,
        txHash: generatedTxHash,
        status: autoCompound ? 'COMPOUNDING' : 'LOCKING'
      };

      setUserStakes(prev => [newStake, ...prev]);
      setStakeSuccessReceipt(newStake);
      playSoundCue('success');
      speakText('Alhamdulillah, aset kripto Anda berhasil dikunci dalam smart contract wakaf produktif bersertifikat BWI.', 'id-ID');

      // Emit block transaction if callback provided
      if (onSuccessStakeTransaction) {
        const blockTx: BlockchainTransaction = {
          txHash: generatedTxHash,
          blockNumber: 489212,
          timestamp: now.toISOString().replace('T', ' ').substring(0, 19),
          type: 'WAKAF',
          donorMasked: 'Wakif Syariah On-Chain (0x' + generatedTxHash.substring(2, 6) + '...9a)',
          amountIdr: totalStakeIdr,
          amountCrypto: `${stakeTokenAmount} ${selectedToken}`,
          currency: selectedToken,
          paymentGateway: 'Crypto',
          smartContract: selectedPool.smartContractVault,
          zkProofHash: 'zk-snark-waqf-' + generatedTxHash.substring(0, 14),
          biometricVerified: true,
          status: 'confirmed'
        };
        onSuccessStakeTransaction(blockTx);
      }
    } catch {
      // Fallback
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner: Sharia Waqf Staking Protocol */}
      <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-emerald-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Protokol Staking Wakaf Kripto Produktif (CWLS On-Chain · Standar DSN-MUI & BWI)</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-2.5">
            Kunci Aset Kripto untuk Wakaf Abadi, Raih Bagi Hasil Halal Berkelanjutan
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
            Solusi filantropi Islam modern: Kunci likuiditas kripto (USDT, ISLM, ETH, PAXG) ke dalam instrumen aset riil berizin Badan Wakaf Indonesia (BWI). Pokok aset Anda tetap aman terjaga secara syariah, sementara dividen bagi hasil disalurkan otomatis via smart contract untuk membiayai klinik dhuafa, lumbung pangan organik, dan air bersih.
          </p>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-800/60 text-xs">
            <div>
              <span className="text-neutral-400 block text-[11px]">Total Nilai Terkunci (TVL):</span>
              <span className="text-lg font-bold text-white font-mono">Rp 12,15 Miliar</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Rata-rata Estimasi APY:</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">8.4% - 11.2%</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Model Akad Fiqh:</span>
              <span className="text-lg font-bold text-emerald-300">Ijarah & Mudharabah</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Dividen Tersalurkan:</span>
              <span className="text-lg font-bold text-amber-300 font-mono">Rp 984+ Juta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border border-neutral-200 rounded-xl p-2.5 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg text-xs font-medium flex-wrap">
          <button
            onClick={() => {
              playSoundCue('click');
              setActiveTab('calculator');
            }}
            className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-700" />
            <span>Kalkulator & Form Staking</span>
          </button>

          <button
            onClick={() => {
              playSoundCue('click');
              setActiveTab('pools');
            }}
            className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pools'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Daftar Pool Proyek Wakaf ({pools.length})</span>
          </button>

          <button
            onClick={() => {
              playSoundCue('click');
              setActiveTab('portfolio');
            }}
            className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'portfolio'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>Portofolio Staking Saya ({userStakes.length})</span>
          </button>

          <button
            onClick={() => {
              playSoundCue('click');
              setActiveTab('sharia-model');
            }}
            className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sharia-model'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>Model Fiqh & Kepatuhan Syariah</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md hidden md:inline">
          DSN-MUI Validated Smart Vaults
        </span>
      </div>

      {/* TAB 1: INTERACTIVE ESTIMATED YIELD CALCULATOR & STAKING FORM */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: Inputs & Parameters */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-700" />
                <span>Simulasi & Kunci Aset Kripto Wakaf</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Pilih proyek wakaf riil, tentukan durasi penguncian, dan atur porsi bagi hasil amal jariyah
              </p>
            </div>

            {/* 1. Select Waqf Project Pool */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Pilih Proyek Wakaf Produktif:
              </label>
              <select
                value={selectedPoolId}
                onChange={e => setSelectedPoolId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
              >
                {pools.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.shariaModel}] {p.name} (Est. APY: {p.estimatedApyPercent}%)
                  </option>
                ))}
              </select>

              <div className="mt-2 p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Aset Dasar (Underlying):</span>
                  <span className="font-semibold text-neutral-800">{selectedPool.underlyingAsset}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Akreditasi BWI:</span>
                  <span className="font-mono text-emerald-700 font-semibold">{selectedPool.bwiAccreditationNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Klasifikasi Risiko:</span>
                  <span className="text-neutral-700 font-medium">{selectedPool.riskRating}</span>
                </div>
              </div>
            </div>

            {/* 2. Choose Crypto Token & Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  Pilih Aset Kripto Syariah:
                </label>
                <span className="text-[11px] font-mono text-neutral-500">
                  Kurs: 1 {selectedToken} ≈ {formatIdr(tokenPricesIdr[selectedToken])}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {(['USDT', 'ISLM', 'ETH', 'PAXG'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      playSoundCue('click');
                      setSelectedToken(t);
                    }}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      selectedToken === t
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={stakeTokenAmount}
                  onChange={e => setStakeTokenAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg font-mono text-base font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-neutral-500">
                  {selectedToken}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-500">
                <span>Nilai Rupiah Terkalkulasi:</span>
                <span className="font-mono font-bold text-emerald-800 text-xs">
                  {formatIdr(totalStakeIdr)}
                </span>
              </div>

              {/* Quick Amount presets */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {[100, 500, 1000, 2500, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      playSoundCue('click');
                      setStakeTokenAmount(val);
                    }}
                    className="px-2 py-0.5 text-[11px] rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 cursor-pointer font-mono"
                  >
                    +{val} {selectedToken}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Duration Lock Period */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Periode Penguncian Likuiditas (Lock Period):</span>
                </label>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                  Faktor Nisbah: {durationBonusFactor}x
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[3, 6, 12, 24, 36].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      playSoundCue('click');
                      setLockMonths(m);
                    }}
                    className={`py-2 text-center rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      lockMonths === m
                        ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span>{m} Bln</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Semakin panjang periode komitmen, semakin stabil dana mengalir ke proyek wakaf riil dengan proyeksi imbal hasil lebih optimal.
              </p>
            </div>

            {/* 4. Profit Sharing & Waqf Allocation Mode */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Model Alokasi Hasil Investasi (Nisbah Syariah):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    playSoundCue('click');
                    setDonorShareChoice('standard');
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    donorShareChoice === 'standard'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className="block font-bold">Standar Proyek</span>
                  <span className="text-[11px] text-neutral-500 block">
                    Wakaf {selectedPool.waqfPerpetualSharePercent}% · Anda {selectedPool.donorYieldSharePercent}%
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSoundCue('click');
                    setDonorShareChoice('50_50');
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    donorShareChoice === '50_50'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className="block font-bold">Imbang 50 / 50</span>
                  <span className="text-[11px] text-neutral-500 block">
                    Wakaf 50% · Anda 50%
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSoundCue('click');
                    setDonorShareChoice('100_percent_waqf');
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    donorShareChoice === '100_percent_waqf'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className="block font-bold">100% Wakaf Abadi</span>
                  <span className="text-[11px] text-neutral-500 block">
                    Semua hasil untuk Mustahiq
                  </span>
                </button>
              </div>
            </div>

            {/* Auto-Compound toggle */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-neutral-800 block">Auto-Compounding Amal Jariyah:</span>
                <span className="text-[11px] text-neutral-500">Otomatis putar kembali bagian hasil donor ke dalam pokok wakaf saat jatuh tempo</span>
              </div>
              <input
                type="checkbox"
                checked={autoCompound}
                onChange={e => setAutoCompound(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Execute Staking Button */}
            <button
              type="button"
              disabled={isStaking || stakeTokenAmount <= 0}
              onClick={handleConfirmStake}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-400 text-white font-bold rounded-xl text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isStaking ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengunci Aset di Smart Contract Vault...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-200" />
                  <span>Kunci {stakeTokenAmount} {selectedToken} ke Proyek Wakaf Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Right Panel: Estimated Yield Breakdown & Projection Card */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Projection Card */}
            <div className="bg-gradient-to-br from-emerald-900 via-neutral-900 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-emerald-700/60 text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80">
                <span className="text-emerald-300 font-bold flex items-center gap-1.5 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  Proyeksi Imbal Hasil Syariah
                </span>
                <span className="font-mono text-[11px] bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded">
                  {effectiveAnnualApy}% p.a.
                </span>
              </div>

              {/* Main Numbers */}
              <div className="space-y-3">
                <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/60">
                  <span className="text-neutral-400 text-[11px] block">Total Estimasi Hasil ({lockMonths} Bulan):</span>
                  <span className="text-xl font-bold font-mono text-white block mt-0.5">
                    {formatIdr(totalProjectedYieldIdr)}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-mono">
                    ≈ {formatUsdt(totalProjectedYieldIdr / 15600)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-700">
                    <span className="text-emerald-400 font-bold block text-[10px] uppercase">
                      Bagian Wakaf ({waqfSharePercent}%):
                    </span>
                    <span className="font-bold text-sm text-white font-mono mt-1 block">
                      {formatIdr(projectedWaqfYieldIdr)}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      Pahala Jariyah Mustahiq
                    </span>
                  </div>

                  <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-700">
                    <span className="text-amber-300 font-bold block text-[10px] uppercase">
                      Bagian Wakif ({donorSharePercent}%):
                    </span>
                    <span className="font-bold text-sm text-white font-mono mt-1 block">
                      {formatIdr(projectedDonorYieldIdr)}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      {autoCompound ? 'Auto-Reinvested' : 'Kembali ke Dompet'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Impact Narrative Breakdown */}
              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/40 space-y-2 text-[11px]">
                <span className="font-bold text-emerald-200 block">Dampak Nyata yang Dihasilkan:</span>
                <ul className="space-y-1.5 text-neutral-300">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Pokok aset ({stakeTokenAmount} {selectedToken}) aman terkunci dalam smart contract non-kustodian.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Bagi hasil wakaf membiayai operasional riil {selectedPool.underlyingAsset}.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Mendapatkan sertifikat Wakaf Uang Digital resmi dari Badan Wakaf Indonesia (BWI).</span>
                  </li>
                </ul>
              </div>

              {/* Smart Contract Proof Note */}
              <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                <span>Vault: {formatAddress(selectedPool.smartContractVault, 6, 4)}</span>
                <span className="text-emerald-400 font-semibold">Zero-Riba Guaranteed</span>
              </div>
            </div>

            {/* Fatwa & Model Explainer Box */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-neutral-900">Landasan Syariah & Kaidah Fiqh</span>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <p className="font-semibold">Rujukan Fatwa: {selectedPool.shariaFatwaRef}</p>
                <p className="italic text-emerald-800">
                  "Menahan pokok harta (habsul ashli) dan menyedekahkan hasil atau buahnya (tasbiluts tsamarah) di jalan Allah." (HR. Bukhari & Muslim).
                </p>
              </div>

              <p className="text-neutral-600 text-[11px] leading-relaxed">
                Staking wakaf berbeda dengan bunga ribawi: tidak ada jaminan keuntungan tetap (fixed return guarantee). Imbal hasil dihitung berdasarkan performa nyata aset dasar (*underlying asset*) sesuai nisbah bagi hasil yang disepakati di awal.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: ALL WAQF STAKING POOLS */}
      {activeTab === 'pools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pools.map(pool => (
            <div
              key={pool.id}
              className="bg-white border border-neutral-200 hover:border-emerald-600 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {pool.shariaModel}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 mt-1">
                      {pool.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-neutral-500 block">Est. Return (APY):</span>
                    <span className="text-base font-bold text-emerald-700 font-mono">
                      {pool.estimatedApyPercent}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  {pool.description}
                </p>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Aset Dasar (Underlying):</span>
                    <span className="font-semibold text-neutral-800">{pool.underlyingAsset}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Bagi Hasil Amal / Wakif:</span>
                    <span className="font-bold text-emerald-800">
                      {pool.waqfPerpetualSharePercent}% Wakaf · {pool.donorYieldSharePercent}% Wakif
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Token Diterima:</span>
                    <div className="flex items-center gap-1">
                      {pool.acceptedTokens.map(tok => (
                        <span key={tok} className="px-1.5 py-0.2 bg-white rounded border border-neutral-300 font-mono text-[10px] font-bold">
                          {tok}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Total Likuiditas Terkumpul:</span>
                  <span className="font-mono font-bold text-neutral-900 text-xs">
                    {formatIdr(pool.totalStakedIdr)} ({pool.totalStakers} Wakif)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playSoundCue('click');
                    setSelectedPoolId(pool.id);
                    setActiveTab('calculator');
                  }}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center gap-1"
                >
                  <span>Mulai Kunci Aset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: USER STAKING PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div className="space-y-5">
          
          {/* Portfolio Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-neutral-500 block">Total Aset Kripto Terkunci:</span>
              <span className="text-lg font-bold font-mono text-neutral-900 mt-1 block">
                {formatIdr(portfolioStats.totalStaked)}
              </span>
              <span className="text-[11px] text-neutral-400">{userStakes.length} Posisi Aktif di Vault</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-emerald-800 block font-semibold">Dividen Wakaf Tersalurkan:</span>
              <span className="text-lg font-bold font-mono text-emerald-900 mt-1 block">
                {formatIdr(portfolioStats.totalWaqfImpact)}
              </span>
              <span className="text-[11px] text-emerald-700">Dampak Amal Jariyah Mengalir</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-amber-800 block font-semibold">Hasil Terakumulasi Wakif:</span>
              <span className="text-lg font-bold font-mono text-amber-900 mt-1 block">
                {formatIdr(portfolioStats.totalDonorEarnings)}
              </span>
              <span className="text-[11px] text-amber-700">Otomatis Compounded / Saldo</span>
            </div>
          </div>

          {/* Staking Positions Table */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Daftar Kontrak Penguncian Aset Wakaf Saya
                </h3>
                <p className="text-xs text-neutral-500">
                  Daftar smart contract vault wakaf non-kustodian terdaftar
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                100% On-Chain Secured
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-4">Proyek & Akad</th>
                    <th className="py-2.5 px-3">Aset Terkunci</th>
                    <th className="py-2.5 px-3">Nilai Pokok (IDR)</th>
                    <th className="py-2.5 px-3">Periode</th>
                    <th className="py-2.5 px-3 text-right">Hasil Wakaf</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-4 text-center">Audit Tx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {userStakes.map(stake => (
                    <tr key={stake.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">{stake.poolName}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          Akad: <span className="text-emerald-800 font-semibold">{stake.shariaModel}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-neutral-800">
                        {stake.stakedTokenAmount} {stake.tokenSymbol}
                      </td>

                      <td className="py-3 px-3 font-mono text-neutral-900">
                        {formatIdr(stake.stakedIdrAmount)}
                      </td>

                      <td className="py-3 px-3 text-neutral-600">
                        <div>{stake.lockPeriodMonths} Bulan</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Jatuh Tempo: {stake.maturityDate}</div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                        {formatIdr(stake.accumulatedBeneficiaryYieldIdr)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          stake.status === 'COMPOUNDING'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {stake.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            playSoundCue('click');
                            onOpenExplorerWithTx(stake.txHash);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-50 rounded border border-emerald-200 cursor-pointer inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Inspeksi</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SHARIA COMPLIANCE & INVESTMENT MODELS */}
      {activeTab === 'sharia-model' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-700" />
              <span>4 Model Akad Syariah dalam Staking Wakaf</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-emerald-900 block mb-0.5">1. Akad Ijarah (Sukuk Sewa Aset)</span>
                <p className="text-neutral-600 leading-relaxed text-[11px]">
                  Penyertaan aset untuk menyewa atau mendanai aset riil (alat kesehatan, gedung). Imbal hasil bersumber dari ujrah (tarif sewa) operasional yang stabil dan terukur.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-emerald-900 block mb-0.5">2. Akad Mudharabah (Bagi Hasil Kemitraan)</span>
                <p className="text-neutral-600 leading-relaxed text-[11px]">
                  Wakif bertindak sebagai shahibul maal (penyedia modal) dan Nazhir/pengelola proyek wakaf sebagai mudharib. Keuntungan usaha dibagi berdasarkan rasio nisbah yang disepakati.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-emerald-900 block mb-0.5">3. Akad Musyarakah (Kongsi Modal Campuran)</span>
                <p className="text-neutral-600 leading-relaxed text-[11px]">
                  Penggabungan modal wakif dan pengelola untuk membangun utilitas umum komersial (PLTS energi surya, desalinasi air). Risiko dan keuntungan dibagi proporsional.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-emerald-900 block mb-0.5">4. Akad Qardhul Hasan (Pinjaman Kebajikan)</span>
                <p className="text-neutral-600 leading-relaxed text-[11px]">
                  Penguncian likuiditas tanpa mengharap imbal hasil material bagi wakif (100% manfaat dialokasikan untuk beasiswa dhuafa). Pokok likuiditas kembali utuh saat jatuh tempo.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Proteksi & Audit Kepatuhan Non-Riba</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-[11px] space-y-1">
                <span className="font-bold text-emerald-950 block">Mengapa Bebas Riba & Sah menurut Fiqh?</span>
                <p className="text-emerald-900 leading-relaxed">
                  Tidak ada bunga berbunga (*riba nasiah*), tidak ada peminjaman dengan penambahan wajib tanpa underlying (*riba qardh*), serta tidak ada spekulasi untung-untungan buta (*gharar & maysir*). Setiap imbalan bersumber dari arus kas produktif aset riil.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-[11px]">
                <span className="font-bold text-neutral-900 block">Sertifikasi & Kemitraan:</span>
                <ul className="space-y-1.5 text-neutral-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Terdaftar pada Lembaga Keuangan Syariah Penerima Wakaf Uang (LKS-PWU)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Diawasi oleh Dewan Pengawas Syariah (DPS) bersertifikasi MUI</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Audit smart contract SHA-256 dan verifikasi konsensus multi-node</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stake Confirmation Success Modal */}
      {stakeSuccessReceipt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900 text-xs">
            <div className="text-center pb-4 border-b border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2.5">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-emerald-950">
                Alhamdulillah, Staking Wakaf Berhasil Terkunci!
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Akad syariah telah dicatat secara immutable pada blockchain.
              </p>
            </div>

            <div className="space-y-2.5 my-4">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Proyek:</span>
                  <span className="font-semibold text-neutral-800 text-right">{stakeSuccessReceipt.poolName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Nominal Terkunci:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {stakeSuccessReceipt.stakedTokenAmount} {stakeSuccessReceipt.tokenSymbol} ({formatIdr(stakeSuccessReceipt.stakedIdrAmount)})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Periode Jatuh Tempo:</span>
                  <span className="font-mono text-neutral-800">{stakeSuccessReceipt.lockPeriodMonths} Bulan ({stakeSuccessReceipt.maturityDate})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Akad Model:</span>
                  <span className="font-bold text-emerald-700">{stakeSuccessReceipt.shariaModel}</span>
                </div>
              </div>

              <div>
                <span className="text-neutral-500 block mb-1">Hash Transaksi Blockchain:</span>
                <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200 font-mono text-[11px]">
                  <span className="truncate flex-1 text-neutral-800">{stakeSuccessReceipt.txHash}</span>
                  <button
                    onClick={() => handleCopy(stakeSuccessReceipt.txHash)}
                    className="p-1 text-neutral-500 hover:text-neutral-800 cursor-pointer"
                    title="Salin Hash"
                  >
                    {copiedHash === stakeSuccessReceipt.txHash ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  playSoundCue('click');
                  onOpenExplorerWithTx(stakeSuccessReceipt.txHash);
                  setStakeSuccessReceipt(null);
                }}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Lihat di Penjelajah Blockchain</span>
              </button>

              <button
                type="button"
                onClick={() => setStakeSuccessReceipt(null)}
                className="px-4 py-2.5 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
