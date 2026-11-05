import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Coins, 
  Building2, 
  QrCode, 
  CheckCircle2, 
  Copy, 
  Fingerprint, 
  ExternalLink,
  Share2,
  Download,
  RefreshCw,
  Wallet,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import QRCode from 'qrcode';
import { Campaign, BlockchainTransaction } from '../types';
import { formatIdr, formatUsdt, sha256, playSoundCue, speakText } from '../utils/cryptoSim';

interface DonationGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  prefilledCampaignId?: string;
  prefilledAmount?: number;
  onSuccessTransaction: (tx: BlockchainTransaction) => void;
  onOpenExplorerWithTx: (txHash: string) => void;
  onOpenShareModal: (campaign: Campaign) => void;
}

export const DonationGatewayModal: React.FC<DonationGatewayModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  prefilledCampaignId,
  prefilledAmount,
  onSuccessTransaction,
  onOpenExplorerWithTx,
  onOpenShareModal
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    prefilledCampaignId || campaigns[0]?.id || ''
  );
  const [amount, setAmount] = useState<number>(prefilledAmount || 250000);
  const [gatewayType, setGatewayType] = useState<'ewallet' | 'crypto' | 'va'>('ewallet');
  const [selectedProvider, setSelectedProvider] = useState<string>('qris');
  const [donorName, setDonorName] = useState<string>('Ahmad Fauzi');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [useE2EEncryption, setUseE2EEncryption] = useState<boolean>(true);
  const [isBiometricVerified, setIsBiometricVerified] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedTx, setConfirmedTx] = useState<BlockchainTransaction | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // QR Code generator states for external crypto wallets
  const [cryptoQrDataUrl, setCryptoQrDataUrl] = useState<string>('');
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(false);
  const [showQrExpanded, setShowQrExpanded] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [copiedUri, setCopiedUri] = useState<boolean>(false);

  // Sync prefilled values when opening
  useEffect(() => {
    if (prefilledCampaignId) setSelectedCampaignId(prefilledCampaignId);
    if (prefilledAmount && prefilledAmount > 0) setAmount(prefilledAmount);
  }, [prefilledCampaignId, prefilledAmount]);

  if (!isOpen) return null;

  const currentCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const quickAmounts = [100000, 250000, 500000, 1000000, 5000000];

  const handleSimulateBiometric = () => {
    playSoundCue('voice');
    setIsBiometricVerified(true);
  };

  const handleCommitDonation = async () => {
    setIsProcessing(true);
    playSoundCue('click');

    try {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const randomSeed = Math.random().toString();
      const rawTxString = `${selectedCampaignId}-${amount}-${timestamp}-${randomSeed}`;
      const generatedHash = await sha256(rawTxString);
      const zkProof = 'zk-snark-' + (await sha256(`zk-${generatedHash}`)).substring(0, 18);

      const cryptoAmount = (amount / 15600).toFixed(2) + ' USDT';

      const newTx: BlockchainTransaction = {
        txHash: generatedHash,
        blockNumber: 489211,
        timestamp,
        type: currentCampaign.category.includes('waqf') ? 'WAKAF' : 'ZAKAT',
        donorMasked: isAnonymous ? 'Hamba Allah (ZK-Proof)' : `${donorName} (${generatedHash.substring(0, 6)}...${generatedHash.substring(generatedHash.length - 4)})`,
        amountIdr: amount,
        amountCrypto: cryptoAmount,
        currency: gatewayType === 'crypto' ? 'USDT' : 'IDR',
        paymentGateway: gatewayType === 'ewallet' ? 'E-Wallet' : gatewayType === 'crypto' ? 'Crypto' : 'Virtual Account',
        smartContract: currentCampaign.smartContractAddress,
        zkProofHash: zkProof,
        biometricVerified: isBiometricVerified,
        status: 'confirmed'
      };

      // Simulated network consensus delay (400ms)
      await new Promise(r => setTimeout(r, 450));

      setConfirmedTx(newTx);
      onSuccessTransaction(newTx);
      playSoundCue('success');
      speakText('Alhamdulillah, donasi zakat Anda berhasil diverifikasi dan dicatat pada blok ledger blockchain.', 'id-ID');
    } catch {
      // Fallback
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate crypto amounts & payload details based on selected asset
  const cryptoAssetDetails = useMemo(() => {
    const usdVal = amount / 15600;
    const provider = selectedProvider.toLowerCase();

    if (provider.includes('islm')) {
      const islmRate = 0.05; // 1 ISLM ≈ $0.05
      const tokenQty = (usdVal / islmRate).toFixed(2);
      return {
        symbol: 'ISLM',
        network: 'Haqq Network (Mainnet 11235)',
        amountFormatted: `${tokenQty} ISLM`,
        tokenQty,
        contract: currentCampaign.smartContractAddress,
        decimals: 18,
        standard: 'ERC-20 / IBC',
        uri: `ethereum:${currentCampaign.smartContractAddress}@11235?value=${tokenQty}e18`
      };
    } else if (provider.includes('eth')) {
      const ethRate = 3400; // 1 ETH ≈ $3400
      const tokenQty = (usdVal / ethRate).toFixed(4);
      return {
        symbol: 'ETH',
        network: 'Ethereum Mainnet (ChainID 1)',
        amountFormatted: `${tokenQty} ETH`,
        tokenQty,
        contract: currentCampaign.smartContractAddress,
        decimals: 18,
        standard: 'Native ETH',
        uri: `ethereum:${currentCampaign.smartContractAddress}?value=${tokenQty}`
      };
    } else if (provider.includes('paxg')) {
      const paxgRate = 2650; // 1 PAXG ≈ 1 Troy Oz Gold ≈ $2650
      const tokenQty = (usdVal / paxgRate).toFixed(4);
      return {
        symbol: 'PAXG',
        network: 'Ethereum Mainnet (Gold Backed)',
        amountFormatted: `${tokenQty} PAXG`,
        tokenQty,
        contract: currentCampaign.smartContractAddress,
        decimals: 18,
        standard: 'ERC-20 Sharia Gold',
        uri: `ethereum:${currentCampaign.smartContractAddress}?token=PAXG&amount=${tokenQty}`
      };
    } else {
      // Default USDT
      const tokenQty = usdVal.toFixed(2);
      return {
        symbol: 'USDT',
        network: 'Tether USD (ERC-20 / TRC-20)',
        amountFormatted: `${tokenQty} USDT`,
        tokenQty,
        contract: currentCampaign.smartContractAddress,
        decimals: 6,
        standard: 'ERC-20',
        uri: `ethereum:${currentCampaign.smartContractAddress}?token=USDT&amount=${tokenQty}`
      };
    }
  }, [amount, selectedProvider, currentCampaign.smartContractAddress]);

  // Generate QR Code image for crypto payment
  const handleGenerateCryptoQr = async () => {
    setIsGeneratingQr(true);
    playSoundCue('click');

    try {
      // QR payload includes smart contract address, amount, campaign, and protocol metadata
      const payload = JSON.stringify({
        protocol: 'islamicity-crypto-pay',
        version: '1.0',
        recipient: currentCampaign.smartContractAddress,
        campaignId: currentCampaign.id,
        campaignTitle: currentCampaign.title,
        amountIdr: amount,
        cryptoAsset: cryptoAssetDetails.symbol,
        cryptoAmount: cryptoAssetDetails.tokenQty,
        network: cryptoAssetDetails.network,
        paymentUri: cryptoAssetDetails.uri,
        timestamp: Date.now()
      });

      const qrUrl = await QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#064e3b', // Deep emerald
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });

      setCryptoQrDataUrl(qrUrl);
      playSoundCue('success');
    } catch {
      // Fallback simple address QR
      try {
        const fallbackUrl = await QRCode.toDataURL(currentCampaign.smartContractAddress, {
          width: 320,
          margin: 2,
          color: { dark: '#064e3b', light: '#ffffff' }
        });
        setCryptoQrDataUrl(fallbackUrl);
      } catch {}
    } finally {
      setIsGeneratingQr(false);
    }
  };

  // Automatically generate or update QR when crypto gateway or provider or amount changes
  useEffect(() => {
    if (gatewayType === 'crypto') {
      handleGenerateCryptoQr();
    }
  }, [gatewayType, selectedProvider, amount, selectedCampaignId]);

  const handleDownloadQr = () => {
    if (!cryptoQrDataUrl) return;
    playSoundCue('click');
    const a = document.createElement('a');
    a.href = cryptoQrDataUrl;
    a.download = `QR_Crypto_${cryptoAssetDetails.symbol}_${currentCampaign.id}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    playSoundCue('success');
  };

  const handleCopyCryptoAddress = () => {
    navigator.clipboard.writeText(currentCampaign.smartContractAddress);
    setCopiedAddress(true);
    playSoundCue('click');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyUri = () => {
    navigator.clipboard.writeText(cryptoAssetDetails.uri);
    setCopiedUri(true);
    playSoundCue('click');
    setTimeout(() => setCopiedUri(false), 2000);
  };

  const handleCopyHash = () => {
    if (!confirmedTx) return;
    navigator.clipboard.writeText(confirmedTx.txHash);
    setCopied(true);
    playSoundCue('click');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gateway-title"
    >
      <div className="bg-white rounded-xl max-w-xl w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 id="gateway-title" className="text-base font-bold text-neutral-900">
                Penyaluran Zakat & Wakaf Digital Terenkripsi
              </h2>
              <p className="text-xs text-neutral-500">Multi-Gateway E-Wallet, QRIS, Bank Syariah & Kripto</p>
            </div>
          </div>
          <button
            onClick={() => {
              playSoundCue('click');
              onClose();
            }}
            aria-label="Tutup Jendela Penyaluran"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State 1: Active Input & Payment Flow */}
        {!confirmedTx ? (
          <div className="space-y-4 my-4">
            {/* Campaign Selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Pilih Program Tujuan:
              </label>
              <select
                value={selectedCampaignId}
                onChange={e => setSelectedCampaignId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
              >
                {campaigns.map(cmp => (
                  <option key={cmp.id} value={cmp.id}>
                    [{cmp.category.toUpperCase().replace('_', ' ')}] {cmp.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Donation Amount with Quick Select */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-700">
                  Nominal Donasi (IDR):
                </label>
                <span className="text-[11px] font-mono text-neutral-500">
                  ≈ {formatUsdt(amount / 15600)}
                </span>
              </div>
              <input
                type="number"
                min="10000"
                step="10000"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-base font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {quickAmounts.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      playSoundCue('click');
                      setAmount(val);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                      amount === val 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold' 
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    {formatIdr(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Gateway Types (E-Wallet / Crypto / Bank Syariah) */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                Pilih Metode Pembayaran:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setGatewayType('ewallet');
                    setSelectedProvider('qris');
                  }}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    gatewayType === 'ewallet'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>E-Wallet & QRIS</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGatewayType('crypto');
                    setSelectedProvider('usdt');
                  }}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    gatewayType === 'crypto'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>Kripto Syariah</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGatewayType('va');
                    setSelectedProvider('bsi');
                  }}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    gatewayType === 'va'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Bank Syariah VA</span>
                </button>
              </div>

              {/* Sub-providers rendering */}
              <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
                {gatewayType === 'ewallet' && (
                  <div className="space-y-2">
                    <span className="font-semibold text-neutral-800">Dukungan Dompet Digital:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['QRIS Instant', 'GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSelectedProvider(p.toLowerCase())}
                          className={`px-2.5 py-1 rounded text-xs border cursor-pointer ${
                            selectedProvider === p.toLowerCase()
                              ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 p-2 bg-white rounded border border-neutral-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-6 h-6 text-emerald-700" />
                        <div>
                          <p className="font-semibold text-neutral-900">QRIS Dinamis Otomatis</p>
                          <p className="text-[11px] text-neutral-500">Scan dari aplikasi perbankan atau dompet digital apa saja</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Fee 0%</span>
                    </div>
                  </div>
                )}

                {gatewayType === 'crypto' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-neutral-800">Pilih Aset Kripto Syariah:</span>
                        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                          {cryptoAssetDetails.amountFormatted}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['USDT (Tether)', 'ISLM (Islamic Coin)', 'ETH (Ethereum)', 'PAXG (Emas Token)'].map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setSelectedProvider(c.toLowerCase())}
                            className={`px-2.5 py-1 rounded text-xs border cursor-pointer transition-colors ${
                              selectedProvider === c.toLowerCase()
                                ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate QR Code Feature for External Crypto Wallets */}
                    <div className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                            <QrCode className="w-4 h-4 text-emerald-700" />
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                              <span>QR Code Dompet Kripto Eksternal</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-normal">
                                {cryptoAssetDetails.symbol}
                              </span>
                            </span>
                            <p className="text-[10px] text-neutral-500">
                              Dukung MetaMask, Trust Wallet, Keplr, HAQQ Wallet, Rainbow & Safe
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleGenerateCryptoQr}
                          disabled={isGeneratingQr}
                          className="px-2.5 py-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                          title="Perbarui QR Code"
                        >
                          <RefreshCw className={`w-3 h-3 ${isGeneratingQr ? 'animate-spin' : ''}`} />
                          <span>Generate Ulang QR</span>
                        </button>
                      </div>

                      {/* Generated QR Code Card */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                        {/* QR Image with subtle scan frame */}
                        <div className="relative shrink-0 bg-white p-2.5 rounded-lg border border-neutral-200 shadow-xs flex flex-col items-center">
                          {cryptoQrDataUrl ? (
                            <img
                              src={cryptoQrDataUrl}
                              alt={`QR Code Pembayaran Kripto ${cryptoAssetDetails.symbol}`}
                              className="w-32 h-32 object-contain rounded"
                            />
                          ) : (
                            <div className="w-32 h-32 flex items-center justify-center text-neutral-400">
                              <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-1.5 w-full">
                            <button
                              type="button"
                              onClick={handleDownloadQr}
                              disabled={!cryptoQrDataUrl}
                              className="flex-1 py-1 px-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              title="Unduh QR Code sebagai gambar PNG"
                            >
                              <Download className="w-3 h-3" />
                              <span>Unduh QR</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowQrExpanded(!showQrExpanded)}
                              className="py-1 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded text-[10px] font-semibold cursor-pointer transition-colors"
                              title="Perbesar QR Code"
                            >
                              {showQrExpanded ? 'Kecilkan' : 'Zoom'}
                            </button>
                          </div>
                        </div>

                        {/* Payment Instructions & Details */}
                        <div className="flex-1 text-xs space-y-2 w-full">
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="bg-white p-2 rounded border border-neutral-200">
                              <span className="text-neutral-500 block text-[10px]">Jumlah Nominal:</span>
                              <span className="font-mono font-bold text-neutral-900">{cryptoAssetDetails.amountFormatted}</span>
                              <span className="text-neutral-400 block text-[10px] font-mono">≈ {formatIdr(amount)}</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-neutral-200">
                              <span className="text-neutral-500 block text-[10px]">Jaringan (Network):</span>
                              <span className="font-medium text-neutral-800 text-[10px] truncate block" title={cryptoAssetDetails.network}>
                                {cryptoAssetDetails.network}
                              </span>
                              <span className="text-emerald-700 text-[10px] font-bold block">{cryptoAssetDetails.standard}</span>
                            </div>
                          </div>

                          {/* Smart Contract Vault Address with copy */}
                          <div>
                            <span className="text-[10px] font-medium text-neutral-500 block mb-0.5">
                              Alamat Smart Contract Vault Penerima:
                            </span>
                            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded border border-neutral-200 font-mono text-[11px]">
                              <span className="text-neutral-800 truncate flex-1 font-semibold">
                                {currentCampaign.smartContractAddress}
                              </span>
                              <button
                                type="button"
                                onClick={handleCopyCryptoAddress}
                                className="text-neutral-500 hover:text-neutral-800 p-1 rounded hover:bg-neutral-100 cursor-pointer"
                                title="Salin Alamat Kontrak"
                              >
                                {copiedAddress ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Quick Wallet Direct URI string */}
                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-neutral-200">
                            <span className="text-neutral-500">Protokol: EIP-681 / Web3 Pay</span>
                            <button
                              type="button"
                              onClick={handleCopyUri}
                              className="text-emerald-700 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                              title="Salin Wallet Direct Payment URI"
                            >
                              <span>{copiedUri ? 'URI Disalin!' : 'Salin URI Pembayaran'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Modal or Expanded View for QR Code */}
                      {showQrExpanded && cryptoQrDataUrl && (
                        <div className="p-4 bg-emerald-950 text-white rounded-xl text-center space-y-3 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-300">
                              <Sparkles className="w-4 h-4" />
                              Scan dengan Aplikasi Mobile Wallet Anda
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowQrExpanded(false)}
                              className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                            >
                              Tutup
                            </button>
                          </div>
                          <div className="bg-white p-4 rounded-xl inline-block shadow-md">
                            <img
                              src={cryptoQrDataUrl}
                              alt="Expanded QR Code"
                              className="w-56 h-56 object-contain"
                            />
                          </div>
                          <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                            Buka aplikasi dompet kripto (Trust Wallet, MetaMask, Haqq, dll), pilih menu <strong>Scan QR</strong>, lalu konfirmasi transfer senilai <strong>{cryptoAssetDetails.amountFormatted}</strong>.
                          </p>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={handleDownloadQr}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Simpan Gambar QR</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleCopyCryptoAddress}
                              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{copiedAddress ? 'Tersalin' : 'Salin Alamat Vault'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {gatewayType === 'va' && (
                  <div className="space-y-2">
                    <span className="font-semibold text-neutral-800">Virtual Account Bank Syariah:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['Bank Syariah Indonesia (BSI)', 'Bank Muamalat', 'BCA Syariah'].map(b => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedProvider(b.toLowerCase())}
                          className={`px-2.5 py-1 rounded text-xs border cursor-pointer ${
                            selectedProvider === b.toLowerCase()
                              ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 p-2 bg-white rounded border border-neutral-200">
                      <p className="text-[11px] text-neutral-500">Nomor Virtual Account Syariah:</p>
                      <p className="font-mono text-sm font-bold text-neutral-900">8921-0812-9948-2104</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy & Zero Knowledge Options */}
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2.5 text-xs">
              <span className="font-semibold text-neutral-900 block">Privasi & Keamanan Ledger:</span>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-neutral-700 font-medium">
                  Hamba Allah (Sembunyikan nama asli di penjelajah blockchain publik dengan ZK-Proof)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useE2EEncryption}
                  onChange={e => setUseE2EEncryption(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-neutral-700 font-medium">
                  Enkripsi End-to-End (AES-256-GCM) data transaksi & tanda terima
                </span>
              </label>

              {/* Biometric simulation button */}
              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint className={`w-4 h-4 ${isBiometricVerified ? 'text-emerald-600' : 'text-neutral-400'}`} />
                  <span className="text-neutral-700">Verifikasi Biometrik Passkey Muzakki</span>
                </div>
                <button
                  type="button"
                  onClick={handleSimulateBiometric}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                    isBiometricVerified 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
                  }`}
                >
                  {isBiometricVerified ? 'Terverifikasi (Passkey Aktif)' : 'Scan Biometrik'}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleCommitDonation}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-400 text-white font-bold rounded-lg text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memvalidasi Konsensus Blockchain...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-200" />
                  <span>Tunaikan & Catat ke Blockchain ({formatIdr(amount)})</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* State 2: Transaction Success & Hash Verification Receipt */
          <div className="space-y-4 my-4 animate-in fade-in">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-base font-bold text-emerald-950">
                Alhamdulillah, Transaksi Berhasil!
              </h3>
              <p className="text-xs text-emerald-800 mt-1">
                Amanah donasi Anda telah terverifikasi secara on-chain dan masuk ke blok konsensus syariah.
              </p>
            </div>

            {/* Receipt Details */}
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500">Nominal Penyaluran:</span>
                <span className="font-bold text-neutral-900 font-mono text-sm">{formatIdr(confirmedTx.amountIdr)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Program:</span>
                <span className="font-medium text-neutral-800">{currentCampaign.title}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Identitas Muzakki:</span>
                <span className="font-medium text-neutral-800">{confirmedTx.donorMasked}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Nomor Blok:</span>
                <span className="font-mono font-semibold text-emerald-700">#{confirmedTx.blockNumber}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Metode Pembayaran:</span>
                <span className="font-medium text-neutral-800">{confirmedTx.paymentGateway}</span>
              </div>

              {/* Transaction Hash */}
              <div className="pt-2 border-t border-neutral-200">
                <span className="text-neutral-500 block mb-1">Hash Transaksi Blockchain (SHA-256):</span>
                <div className="flex items-center gap-2 p-2 bg-white rounded border border-neutral-200">
                  <span className="font-mono text-[11px] text-neutral-800 truncate flex-1">
                    {confirmedTx.txHash}
                  </span>
                  <button
                    onClick={handleCopyHash}
                    aria-label="Salin Hash Transaksi"
                    className="p-1 rounded hover:bg-neutral-100 text-neutral-600 cursor-pointer"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions: View in Explorer or Share */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => {
                  playSoundCue('click');
                  onOpenExplorerWithTx(confirmedTx.txHash);
                  onClose();
                }}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Lihat di Blok Explorer</span>
              </button>

              <button
                onClick={() => {
                  playSoundCue('click');
                  onOpenShareModal(currentCampaign);
                }}
                className="px-4 py-2.5 border border-neutral-300 hover:border-neutral-400 text-neutral-700 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
