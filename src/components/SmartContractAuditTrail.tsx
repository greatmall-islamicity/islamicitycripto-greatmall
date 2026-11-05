import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileCode, 
  ShieldCheck, 
  Play, 
  Pause, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  Lock, 
  Download, 
  Copy, 
  Cpu, 
  Fingerprint, 
  Scale, 
  Layers, 
  Terminal, 
  Check 
} from 'lucide-react';
import { SmartContractAuditLog } from '../types';
import { initialSmartContractAuditLogs } from '../data/mockData';
import { formatAddress, playSoundCue } from '../utils/cryptoSim';

interface SmartContractAuditTrailProps {
  onHighlightTx?: (txHash: string) => void;
}

type SortField = 'timestamp' | 'event' | 'contract' | 'gas' | 'status';
type SortDirection = 'asc' | 'desc';

interface ParsedEventLog extends SmartContractAuditLog {
  parsedEventName: string;
  topic0: string;
  eventCategory: 'DISBURSEMENT' | 'WAQF_LOCK' | 'BIOMETRIC_PROOF' | 'QARDH_HASAN' | 'FATWA_GOVERNANCE' | 'ZAKAT_DEPOSIT';
  statusBadge: {
    label: string;
    sublabel: string;
    variant: 'emerald' | 'sky' | 'teal' | 'purple';
  };
}

// Dynamic parser function for smart contract logs
function parseSmartContractEvent(log: SmartContractAuditLog): ParsedEventLog {
  const eventName = log.eventEmitted.split('(')[0] || 'UnknownEvent';
  
  // Simulated deterministic topic0 hash based on event signature
  let hashSeed = 0;
  for (let i = 0; i < log.eventEmitted.length; i++) {
    hashSeed = (hashSeed << 5) - hashSeed + log.eventEmitted.charCodeAt(i);
    hashSeed |= 0;
  }
  const hexPart = Math.abs(hashSeed).toString(16).padStart(8, '0');
  const topic0 = `0x${hexPart}e81f9a2b71c08d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b`;

  let eventCategory: ParsedEventLog['eventCategory'] = 'DISBURSEMENT';
  let statusBadge: ParsedEventLog['statusBadge'] = {
    label: 'Settled & Verified',
    sublabel: 'Penyaluran Sah',
    variant: 'emerald'
  };

  if (eventName.includes('MustahiqDisbursed') || eventName.includes('Disbursed')) {
    eventCategory = 'DISBURSEMENT';
    statusBadge = {
      label: 'Disbursement Settled',
      sublabel: 'Tersalurkan ke Mustahiq',
      variant: 'emerald'
    };
  } else if (eventName.includes('Waqf') || eventName.includes('Yield')) {
    eventCategory = 'WAQF_LOCK';
    statusBadge = {
      label: 'Perpetual Locked',
      sublabel: 'Pokok Wakaf Abadi',
      variant: 'sky'
    };
  } else if (eventName.includes('ZkIdentity') || eventName.includes('Passkey')) {
    eventCategory = 'BIOMETRIC_PROOF';
    statusBadge = {
      label: 'Biometric Affirmed',
      sublabel: 'Liveness 99.6% Teruji',
      variant: 'purple'
    };
  } else if (eventName.includes('Capital') || eventName.includes('Qardh')) {
    eventCategory = 'QARDH_HASAN';
    statusBadge = {
      label: 'Zero-Riba Compliant',
      sublabel: 'Qardhul Hasan 0%',
      variant: 'teal'
    };
  } else if (eventName.includes('Fatwa') || eventName.includes('Governance')) {
    eventCategory = 'FATWA_GOVERNANCE';
    statusBadge = {
      label: 'Fatwa Sealed',
      sublabel: 'Audit BAZNAS/DSN-MUI',
      variant: 'emerald'
    };
  } else if (eventName.includes('ZakatDeposited')) {
    eventCategory = 'ZAKAT_DEPOSIT';
    statusBadge = {
      label: 'Deposit Confirmed',
      sublabel: 'Dana Masuk On-Chain',
      variant: 'emerald'
    };
  }

  return {
    ...log,
    parsedEventName: eventName,
    topic0,
    eventCategory,
    statusBadge
  };
}

export const SmartContractAuditTrail: React.FC<SmartContractAuditTrailProps> = ({
  onHighlightTx
}) => {
  const [logs, setLogs] = useState<SmartContractAuditLog[]>(initialSmartContractAuditLogs);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContract, setSelectedContract] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [inspectingLog, setInspectingLog] = useState<ParsedEventLog | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Live streaming simulator adding dynamic events
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const templates = [
        {
          contractName: 'IslamicZakatVaultV2.sol',
          contractAddress: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
          methodCalled: 'releaseMustahiqDisbursement(batchId, biometricPassToken, amount)',
          eventEmitted: 'MustahiqDisbursed(bytes32 indexed batchId, address recipient, uint256 amount)',
          caller: 'Relayer-Amil-Kupang (0x' + Math.random().toString(16).substring(2, 10) + ')',
          invariantStatus: 'VERIFIED' as const,
          invariantNote: '100% Cadangan Kas Terkunci · Sesuai Hak Asnaf Fakir · Biometrik Lolos',
          gasUsed: Math.floor(41000 + Math.random() * 7000),
          decodedParams: [
            { key: 'batchId', value: 'DSB-' + Math.floor(100 + Math.random() * 900) },
            { key: 'amount', value: `${(Math.floor(15 + Math.random() * 45) * 5000000).toLocaleString('id-ID')} IDR` },
            { key: 'biometricHash', value: 'BIO-PASS-' + Math.floor(10000 + Math.random() * 90000) },
            { key: 'asnafType', value: 'Fakir Miskin' }
          ]
        },
        {
          contractName: 'WaqfPerpetualAssetLock.sol',
          contractAddress: '0x4389104A3b2A69De6Dbf7f01ED13B2108B2c8821',
          methodCalled: 'distributeProductiveYield(assetId, recipientPool)',
          eventEmitted: 'YieldDistributed(bytes32 assetId, uint256 surplusAmount)',
          caller: 'BWI-AssetManager (0x' + Math.random().toString(16).substring(2, 10) + ')',
          invariantStatus: 'PROTECTED' as const,
          invariantNote: 'Aset Pokok Abadi Utuh · Surplus Manfaat Mengalir ke Mustahiq',
          gasUsed: Math.floor(49000 + Math.random() * 8000),
          decodedParams: [
            { key: 'assetId', value: 'CLINIC-LOMBOK-02' },
            { key: 'surplusYield', value: '24,000,000 IDR' },
            { key: 'beneficiariesServed', value: '1,450 Jiwa' }
          ]
        },
        {
          contractName: 'BiometricIdentityRegistry.sol',
          contractAddress: '0x9923104A3b2A69De6Dbf7f01ED13B2108B2c5541',
          methodCalled: 'assertZkLivenessProof(mustahiqCommitment, zkProofSNARK)',
          eventEmitted: 'ZkIdentityAffirmed(bytes32 commitment, uint256 timestamp)',
          caller: 'ZkProver-WestJava (0x' + Math.random().toString(16).substring(2, 10) + ')',
          invariantStatus: 'VERIFIED' as const,
          invariantNote: 'Privasi Zero-Knowledge Terjamin · Anti-Spoofing Liveness 99.6%',
          gasUsed: Math.floor(68000 + Math.random() * 10000),
          decodedParams: [
            { key: 'mustahiqCommitment', value: 'zk-id-0x' + Math.random().toString(16).substring(2, 8) + '...' },
            { key: 'livenessMatchScore', value: '99.6% (Facial Mesh Valid)' },
            { key: 'antiSybilDuplication', value: 'PASSED' }
          ]
        }
      ];

      const sample = templates[Math.floor(Math.random() * templates.length)];
      const newBlockNum = 489211 + Math.floor(Math.random() * 5);

      const newLogItem: SmartContractAuditLog = {
        id: 'SC-AUDIT-' + Math.floor(1000 + Math.random() * 9000),
        timestamp: timeStr,
        contractName: sample.contractName,
        contractAddress: sample.contractAddress,
        methodCalled: sample.methodCalled,
        eventEmitted: sample.eventEmitted,
        caller: sample.caller,
        invariantStatus: sample.invariantStatus,
        invariantNote: sample.invariantNote,
        gasUsed: sample.gasUsed,
        blockNumber: newBlockNum,
        auditorSignature: 'DSN-MUI-Sig-0x' + Math.random().toString(16).substring(2, 10),
        decodedParams: sample.decodedParams
      };

      setLogs(prev => [newLogItem, ...prev.slice(0, 24)]);
    }, 5500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Dynamically parse all logs
  const parsedLogs = useMemo(() => {
    return logs.map(parseSmartContractEvent);
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return parsedLogs.filter(log => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        log.contractName.toLowerCase().includes(q) ||
        log.parsedEventName.toLowerCase().includes(q) ||
        log.methodCalled.toLowerCase().includes(q) ||
        log.caller.toLowerCase().includes(q) ||
        log.contractAddress.toLowerCase().includes(q) ||
        log.decodedParams.some(p => p.value.toLowerCase().includes(q))
      );

      const matchContract = selectedContract === 'all' || log.contractName.includes(selectedContract);
      const matchCategory = selectedCategory === 'all' || log.eventCategory === selectedCategory;

      return matchSearch && matchContract && matchCategory;
    });
  }, [parsedLogs, searchQuery, selectedContract, selectedCategory]);

  // Sort logs
  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'timestamp') {
        cmp = a.blockNumber - b.blockNumber;
      } else if (sortField === 'event') {
        cmp = a.parsedEventName.localeCompare(b.parsedEventName);
      } else if (sortField === 'contract') {
        cmp = a.contractName.localeCompare(b.contractName);
      } else if (sortField === 'gas') {
        cmp = a.gasUsed - b.gasUsed;
      } else if (sortField === 'status') {
        cmp = a.invariantStatus.localeCompare(b.invariantStatus);
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredLogs, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    playSoundCue('click');
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-60 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-emerald-700" />
      : <ArrowDown className="w-3.5 h-3.5 text-emerald-700" />;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    playSoundCue('click');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleExportCsv = () => {
    playSoundCue('click');
    const headers = ['Log ID', 'Timestamp', 'Block', 'Contract', 'Address', 'Event Emitted', 'Topic0 Hash', 'Status Invariant', 'Gas Used', 'Auditor Signature'];
    const rows = sortedLogs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      l.blockNumber,
      `"${l.contractName}"`,
      `"${l.contractAddress}"`,
      `"${l.parsedEventName}"`,
      `"${l.topic0}"`,
      `"${l.invariantStatus}"`,
      l.gasUsed,
      `"${l.auditorSignature}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Trail_SmartContract_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
      
      {/* Header and Telemetry Stats */}
      <div className="p-4 sm:p-5 border-b border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-neutral-900">
                Audit Trail Event Smart Contract (On-Chain)
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {isStreaming ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Live Parsing Aktif</span>
                  </>
                ) : (
                  <span>Live Parsing Dijeda</span>
                )}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tabel audit terurut dinamis yang mem-parsing log event emisi smart contract, parameter ABI terdekode, dan stempel konsensus syariah
            </p>
          </div>

          {/* Quick Actions: Streaming Toggle & CSV Export */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                playSoundCue('click');
                setIsStreaming(!isStreaming);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                isStreaming
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Jeda Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-100" />
                  <span>Mulai Stream</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-neutral-100">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari event, metode, atau parameter..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-neutral-300 rounded-md text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Contract selector */}
          <select
            value={selectedContract}
            onChange={e => setSelectedContract(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded-md text-xs font-medium bg-white text-neutral-700 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
          >
            <option value="all">Semua Smart Contract</option>
            <option value="ZakatVault">IslamicZakatVault (Penyaluran)</option>
            <option value="WaqfPerpetual">WaqfPerpetualAsset (Aset Wakaf)</option>
            <option value="BiometricIdentity">BiometricRegistry (Identitas)</option>
            <option value="QardhulHasan">QardhulHasanGrant (Modal Mikro)</option>
            <option value="ShariaGovernance">ShariaGovernance (Audit Fiqh)</option>
          </select>

          {/* Event Category selector */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded-md text-xs font-medium bg-white text-neutral-700 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
          >
            <option value="all">Semua Tipe Event</option>
            <option value="DISBURSEMENT">Penyaluran Mustahiq (Disbursement)</option>
            <option value="WAQF_LOCK">Penguncian Wakaf Abadi (Waqf Lock)</option>
            <option value="BIOMETRIC_PROOF">Verifikasi Biometrik (Passkey)</option>
            <option value="QARDH_HASAN">Pinjaman Bebas Riba (Qardh)</option>
            <option value="FATWA_GOVERNANCE">Kepatuhan Fatwa (Governance)</option>
            <option value="ZAKAT_DEPOSIT">Deposit Zakat (Inflow)</option>
          </select>
        </div>
      </div>

      {/* Sortable Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 select-none">
            <tr>
              {/* Timestamp & Block */}
              <th 
                onClick={() => handleSort('timestamp')}
                className="py-3 px-4 cursor-pointer hover:bg-neutral-100 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Waktu & Blok</span>
                  {renderSortIndicator('timestamp')}
                </div>
              </th>

              {/* Event & Contract */}
              <th 
                onClick={() => handleSort('event')}
                className="py-3 px-3 cursor-pointer hover:bg-neutral-100 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Event Emitted & Kontrak</span>
                  {renderSortIndicator('event')}
                </div>
              </th>

              {/* Parsed Payload Parameters */}
              <th className="py-3 px-3">
                <span>Parameter Terdekode (ABI)</span>
              </th>

              {/* Visual Status Indicator */}
              <th 
                onClick={() => handleSort('status')}
                className="py-3 px-3 cursor-pointer hover:bg-neutral-100 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Indikator Status Transaksi</span>
                  {renderSortIndicator('status')}
                </div>
              </th>

              {/* Gas Used */}
              <th 
                onClick={() => handleSort('gas')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-neutral-100 transition-colors group"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Gas Terpakai</span>
                  {renderSortIndicator('gas')}
                </div>
              </th>

              {/* Action */}
              <th className="py-3 px-4 text-center">
                <span>Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-sans">
            {sortedLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500">
                  Tidak ada log audit smart contract yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              sortedLogs.map(item => (
                <tr 
                  key={item.id}
                  className="hover:bg-neutral-50 transition-colors group cursor-pointer"
                  onClick={() => {
                    playSoundCue('click');
                    setInspectingLog(item);
                  }}
                >
                  {/* Timestamp & Block */}
                  <td className="py-3 px-4 font-mono text-neutral-800">
                    <div className="font-semibold text-neutral-900">{item.timestamp.split(' ')[1]}</div>
                    <span className="text-[11px] text-emerald-700 font-medium">Blok #{item.blockNumber}</span>
                  </td>

                  {/* Event & Contract */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-neutral-900 text-[11px]">
                        {item.parsedEventName}()
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                      <FileCode className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{item.contractName}</span>
                    </div>
                  </td>

                  {/* Decoded Parameters Badges */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 flex-wrap max-w-sm">
                      {item.decodedParams.slice(0, 2).map((p, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 text-neutral-700 border border-neutral-200 truncate max-w-[160px]"
                          title={`${p.key}: ${p.value}`}
                        >
                          <strong className="text-neutral-900">{p.key}:</strong> {p.value}
                        </span>
                      ))}
                      {item.decodedParams.length > 2 && (
                        <span className="text-[10px] text-neutral-400 font-mono">
                          +{item.decodedParams.length - 2} lagi
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Visual Status Indicator */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {item.statusBadge.variant === 'emerald' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{item.statusBadge.label}</span>
                        </span>
                      )}
                      {item.statusBadge.variant === 'sky' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                          <Lock className="w-3 h-3 text-sky-600" />
                          <span>{item.statusBadge.label}</span>
                        </span>
                      )}
                      {item.statusBadge.variant === 'purple' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                          <Fingerprint className="w-3 h-3 text-purple-600" />
                          <span>{item.statusBadge.label}</span>
                        </span>
                      )}
                      {item.statusBadge.variant === 'teal' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          <Scale className="w-3 h-3 text-teal-600" />
                          <span>{item.statusBadge.label}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-0.5 font-medium">
                      {item.statusBadge.sublabel}
                    </p>
                  </td>

                  {/* Gas Used */}
                  <td className="py-3 px-3 text-right font-mono text-neutral-800 tabular-nums font-semibold">
                    {item.gasUsed.toLocaleString('id-ID')}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSoundCue('click');
                        setInspectingLog(item);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-50 rounded border border-emerald-300 transition-colors cursor-pointer"
                    >
                      Audit Log
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Audit Detail Modal / Inspector Drawer */}
      {inspectingLog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="audit-trail-detail-title"
        >
          <div className="bg-white rounded-xl max-w-lg w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900 text-xs max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-emerald-200" />
                </div>
                <div>
                  <h4 id="audit-trail-detail-title" className="font-bold text-sm text-neutral-900">
                    Inspeksi Audit Trail Smart Contract
                  </h4>
                  <p className="text-[11px] text-neutral-500">ID Log: {inspectingLog.id} · Blok #{inspectingLog.blockNumber}</p>
                </div>
              </div>
              <button 
                onClick={() => setInspectingLog(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3.5 my-4">
              
              {/* Event Signature & Topic 0 */}
              <div>
                <span className="text-neutral-500 block mb-0.5">Event Signature (Topic 0 Hash):</span>
                <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                  <p className="font-bold text-neutral-900 font-mono text-[11px]">{inspectingLog.eventEmitted}</p>
                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-neutral-500">
                    <span className="truncate flex-1">{inspectingLog.topic0}</span>
                    <button
                      onClick={() => handleCopy(inspectingLog.topic0)}
                      className="ml-2 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                      title="Salin Topic0"
                    >
                      {copiedText === inspectingLog.topic0 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Smart Contract & Caller */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px]">Kontrak:</span>
                  <p className="font-bold text-neutral-900 truncate">{inspectingLog.contractName}</p>
                  <p className="font-mono text-[10px] text-neutral-500 truncate mt-0.5">{inspectingLog.contractAddress}</p>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px]">Pemanggil (Caller):</span>
                  <p className="font-bold text-neutral-900 truncate">{inspectingLog.caller}</p>
                  <p className="font-mono text-[10px] text-emerald-700 mt-0.5">Gas: {inspectingLog.gasUsed.toLocaleString('id-ID')}</p>
                </div>
              </div>

              {/* Decoded Parameters List */}
              <div>
                <span className="text-neutral-500 block mb-1">Parameter Terdekode (ABI Decoded):</span>
                <div className="border border-neutral-200 rounded divide-y divide-neutral-100 overflow-hidden">
                  {inspectingLog.decodedParams.map((p, idx) => (
                    <div key={idx} className="p-2 flex items-center justify-between bg-white text-[11px]">
                      <span className="font-mono text-neutral-500">{p.key}</span>
                      <span className="font-semibold text-neutral-900 font-mono text-right">{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invariant Rule Verification */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Verifikasi Invarian Fiqh:</span>
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {inspectingLog.invariantStatus}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  {inspectingLog.invariantNote}
                </p>
              </div>

              {/* Consensus Auditor Signature */}
              <div>
                <span className="text-neutral-500 block mb-0.5">Tanda Tangan Validator Sharia Konsensus:</span>
                <div className="p-2 bg-neutral-50 rounded border border-neutral-200 flex items-center justify-between font-mono text-[11px]">
                  <span className="truncate text-neutral-700">{inspectingLog.auditorSignature}</span>
                  <button
                    onClick={() => handleCopy(inspectingLog.auditorSignature)}
                    className="text-neutral-500 hover:text-neutral-800 p-1 cursor-pointer shrink-0"
                    title="Salin Tanda Tangan"
                  >
                    {copiedText === inspectingLog.auditorSignature ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

            </div>

            <button
              onClick={() => setInspectingLog(null)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md font-semibold cursor-pointer"
            >
              Tutup Inspeksi
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
