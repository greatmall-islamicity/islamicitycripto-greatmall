import React, { useState } from 'react';
import { 
  Box, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  FileCode,
  Layers,
  Database,
  Sparkles,
  BookOpen,
  Heart
} from 'lucide-react';
import { BlockchainBlock, BlockchainTransaction } from '../types';
import { formatAddress, formatIdr, playSoundCue } from '../utils/cryptoSim';
import { SmartContractAuditTrail } from './SmartContractAuditTrail';
import { GovernanceVisualizer } from './GovernanceVisualizer';
import { ContractSecurityAlertsPanel } from './ContractSecurityAlertsPanel';
import { initialBeneficiaryStories } from '../data/beneficiaryStoriesData';

interface BlockchainExplorerProps {
  blocks: BlockchainBlock[];
  transactions: BlockchainTransaction[];
  highlightedTxHash?: string | null;
  onNavigateToStory?: (txHash: string) => void;
}

export const BlockchainExplorer: React.FC<BlockchainExplorerProps> = ({
  blocks,
  transactions,
  highlightedTxHash,
  onNavigateToStory
}) => {
  const [searchQuery, setSearchQuery] = useState(highlightedTxHash || '');
  const [selectedTx, setSelectedTx] = useState<BlockchainTransaction | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<BlockchainBlock | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [explorerTab, setExplorerTab] = useState<'all' | 'audit-trail' | 'governance' | 'security' | 'transactions'>('all');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    playSoundCue('click');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      tx.txHash.toLowerCase().includes(q) ||
      tx.donorMasked.toLowerCase().includes(q) ||
      tx.smartContract.toLowerCase().includes(q) ||
      tx.blockNumber.toString() === q
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Explorer Header & Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-700" />
              <span>Penjelajah Blockchain Syariah Terenkripsi</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Konsensus node terdistribusi BAZNAS, BWI, & Dewan Pengawas Syariah Independen
            </p>
          </div>


          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Hash Tx (0x...), Blok, atau Alamat..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Live Chain Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-neutral-100 text-xs">
          <div>
            <span className="text-neutral-500 block">Tinggi Blok Terkini:</span>
            <span className="font-mono font-bold text-neutral-900 text-sm">#{blocks[0]?.blockNumber || 489211}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Kecepatan Konsensus:</span>
            <span className="font-mono font-bold text-emerald-700 text-sm">1.8s · Sharia-PoS</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Metode Enkripsi:</span>
            <span className="font-mono font-bold text-neutral-900 text-sm">AES-256 + ZK-SNARK</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Status Node Jaringan:</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Sinkron
            </span>
          </div>
        </div>

        {/* Explorer Sub-navigation Tabs */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => {
                playSoundCue('click');
                setExplorerTab('all');
              }}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                explorerTab === 'all'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Semua Modul
            </button>
            <button
              onClick={() => {
                playSoundCue('click');
                setExplorerTab('audit-trail');
              }}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                explorerTab === 'audit-trail'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>Audit Trail</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            </button>
            <button
              onClick={() => {
                playSoundCue('click');
                setExplorerTab('governance');
              }}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                explorerTab === 'governance'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>Governance Visualizer</span>
            </button>
            <button
              onClick={() => {
                playSoundCue('click');
                setExplorerTab('security');
              }}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                explorerTab === 'security'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>Alarm & Status Kritis</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            </button>
            <button
              onClick={() => {
                playSoundCue('click');
                setExplorerTab('transactions');
              }}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                explorerTab === 'transactions'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Aliran Transaksi Donasi
            </button>
          </div>

          <span className="text-[11px] font-mono text-neutral-500">
            Smart Contract SHA-256 Validated
          </span>
        </div>
      </div>

      {/* Confirmed Blocks Strip */}
      {(explorerTab === 'all' || explorerTab === 'transactions') && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center gap-1.5">
              <Box className="w-4 h-4 text-emerald-700" />
              <span>Blok Audit Terakhir Ditambang</span>
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">Diperbarui Real-time</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {blocks.map(block => (
              <div 
                key={block.blockNumber}
                onClick={() => {
                  playSoundCue('click');
                  setSelectedBlock(block);
                }}
                className="bg-white border border-neutral-200 hover:border-emerald-600 rounded-lg p-3.5 shadow-xs cursor-pointer transition-all text-xs group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Blok #{block.blockNumber}
                  </span>
                  <span className="text-[11px] text-neutral-400">{block.timestamp.split(' ')[1]}</span>
                </div>
                <p className="font-mono text-[11px] text-neutral-600 truncate mb-1">
                  Hash: {block.hash}
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
                  <span>{block.txCount} Transaksi</span>
                  <span className="text-emerald-700 group-hover:underline flex items-center gap-0.5">
                    Inspeksi <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-Time Push Security Alerts (Circuit Breaker & Critical Status Changes) */}
      {(explorerTab === 'all' || explorerTab === 'security') && (
        <ContractSecurityAlertsPanel 
          onNavigateToAuditTrail={() => setExplorerTab('audit-trail')}
          onNavigateToGovernance={() => setExplorerTab('governance')}
        />
      )}

      {/* Governance Visualizer (Recharts Fund Flow Chart: Deposit -> Escrow -> Mustahiq) */}
      {(explorerTab === 'all' || explorerTab === 'governance') && (
        <GovernanceVisualizer 
          onInspectContract={(address) => {
            setSearchQuery(address);
          }}
        />
      )}

      {/* Smart Contract Audit Trail (Sortable Table with Dynamic Event Parsing & Status Indicators) */}
      {(explorerTab === 'all' || explorerTab === 'audit-trail') && (
        <SmartContractAuditTrail 
          onHighlightTx={(hash) => {
            setSearchQuery(hash);
            setExplorerTab('transactions');
          }}
        />
      )}




      {/* Transactions Table */}
      {(explorerTab === 'all' || explorerTab === 'transactions') && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Aliran Transaksi Zakat & Wakaf On-Chain
              </h3>
              <p className="text-xs text-neutral-500">
                Menampilkan {filteredTransactions.length} transaksi terverifikasi
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              Konsensus Terbuka
            </span>
          </div>


        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-4">Hash Transaksi</th>
                <th className="py-2.5 px-3">Tipe</th>
                <th className="py-2.5 px-3">Muzakki / Donatur</th>
                <th className="py-2.5 px-3 text-right">Nominal (IDR)</th>
                <th className="py-2.5 px-3 text-right">Kripto</th>
                <th className="py-2.5 px-3">Gateway</th>
                <th className="py-2.5 px-3">Biometrik</th>
                <th className="py-2.5 px-4 text-center">Aksi & Dampak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredTransactions.map(tx => {
                const hasStory = initialBeneficiaryStories.some(s => s.verifiedTxHash.toLowerCase() === tx.txHash.toLowerCase());
                return (
                <tr 
                  key={tx.txHash} 
                  className={`hover:bg-neutral-50 transition-colors ${highlightedTxHash === tx.txHash ? 'bg-emerald-50/60' : ''}`}
                >
                  <td className="py-3 px-4 font-mono text-neutral-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-800 font-medium">{formatAddress(tx.txHash, 8, 6)}</span>
                      <button 
                        onClick={() => handleCopy(tx.txHash)}
                        className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded cursor-pointer"
                        title="Salin Hash"
                      >
                        {copiedHash === tx.txHash ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.type === 'ZAKAT' ? 'bg-emerald-100 text-emerald-800' :
                      tx.type === 'WAKAF' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {tx.type}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-neutral-700 font-medium">
                    {tx.donorMasked}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 tabular-nums">
                    {formatIdr(tx.amountIdr)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-neutral-600 tabular-nums">
                    {tx.amountCrypto}
                  </td>

                  <td className="py-3 px-3 text-neutral-600">
                    {tx.paymentGateway}
                  </td>

                  <td className="py-3 px-3">
                    {tx.biometricVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Lolos
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400">Standar</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => {
                          playSoundCue('click');
                          setSelectedTx(tx);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-50 rounded border border-emerald-200 cursor-pointer"
                      >
                        Audit
                      </button>
                      {hasStory && (
                        <button
                          onClick={() => {
                            playSoundCue('click');
                            if (onNavigateToStory) {
                              onNavigateToStory(tx.txHash);
                            }
                          }}
                          className="px-2 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          title="Lihat kisah dampak kemanusiaan langsung dari transaksi ini"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Kisah Dampak</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-lg w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-700" />
                <span className="font-bold text-sm">Detail Audit Kriptografi Transaksi</span>
              </div>
              <button 
                onClick={() => setSelectedTx(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-2.5 my-4">
              <div>
                <span className="text-neutral-500 block mb-0.5">Hash Transaksi (TxID):</span>
                <p className="font-mono text-[11px] bg-neutral-50 p-2 rounded border border-neutral-200 break-all">
                  {selectedTx.txHash}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-neutral-500 block">Blok:</span>
                  <span className="font-mono font-bold text-emerald-700">#{selectedTx.blockNumber}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Waktu Tercatat:</span>
                  <span className="font-mono">{selectedTx.timestamp}</span>
                </div>
              </div>

              <div>
                <span className="text-neutral-500 block mb-0.5">Bukti Zero-Knowledge (ZK-SNARK Proof):</span>
                <p className="font-mono text-[11px] bg-neutral-50 p-2 rounded border border-neutral-200 break-all text-neutral-700">
                  {selectedTx.zkProofHash}
                </p>
              </div>

              <div>
                <span className="text-neutral-500 block mb-0.5">Alamat Smart Contract Syariah:</span>
                <p className="font-mono text-[11px] bg-neutral-50 p-2 rounded border border-neutral-200 break-all text-neutral-700">
                  {selectedTx.smartContract}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900">Integritas Hash Transaksi:</span>
                  <p className="text-[11px] text-emerald-800">Terverifikasi dan tidak dapat dimanipulasi (Immutable).</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
              </div>

              {/* Linked Beneficiary Impact Story preview */}
              {(() => {
                const linkedStory = initialBeneficiaryStories.find(
                  s => s.verifiedTxHash.toLowerCase() === selectedTx.txHash.toLowerCase()
                );
                if (!linkedStory) return null;
                return (
                  <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-neutral-50 rounded-xl border border-emerald-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        Kisah Dampak Nyata Terverifikasi
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                        {linkedStory.category}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-800 italic font-serif leading-relaxed line-clamp-3">
                      "{linkedStory.quote}"
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60 flex-wrap gap-2">
                      <div className="text-[11px] text-emerald-950">
                        <span className="font-bold">{linkedStory.beneficiaryName}</span>
                        <span className="text-neutral-500 block text-[10px]">{linkedStory.city} · Biometrik {linkedStory.biometricScore}%</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedTx(null);
                          if (onNavigateToStory) {
                            onNavigateToStory(selectedTx.txHash);
                          }
                        }}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Buka Kisah Lengkap di Feed</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2 bg-neutral-900 text-white rounded-md font-semibold cursor-pointer"
            >
              Tutup Audit
            </button>
          </div>
        </div>
      )}

      {/* Block Details Modal */}
      {selectedBlock && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-lg w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-700" />
                <span className="font-bold text-sm">Header Blok #{selectedBlock.blockNumber}</span>
              </div>
              <button 
                onClick={() => setSelectedBlock(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 my-4">
              <div>
                <span className="text-neutral-500 block">Hash Blok:</span>
                <p className="font-mono text-[11px] bg-neutral-50 p-2 rounded border border-neutral-200 break-all">
                  {selectedBlock.hash}
                </p>
              </div>
              <div>
                <span className="text-neutral-500 block">Parent Hash (Hash Sebelumnya):</span>
                <p className="font-mono text-[11px] bg-neutral-50 p-2 rounded border border-neutral-200 break-all">
                  {selectedBlock.prevHash}
                </p>
              </div>
              <div>
                <span className="text-neutral-500 block">Merkle Root:</span>
                <p className="font-mono text-[11px] bg-neutral-50 p-2 rounded border border-neutral-200 break-all">
                  {selectedBlock.merkleRoot}
                </p>
              </div>
              <div>
                <span className="text-neutral-500 block">Validator Konsensus:</span>
                <p className="font-medium text-neutral-800">{selectedBlock.validator}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedBlock(null)}
              className="w-full py-2 bg-neutral-900 text-white rounded-md font-semibold cursor-pointer"
            >
              Tutup Inspeksi
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
