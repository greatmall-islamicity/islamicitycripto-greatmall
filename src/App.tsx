import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AccessibilityBar } from './components/AccessibilityBar';
import { CampaignsView } from './components/CampaignsView';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import { BeneficiariesPortal } from './components/BeneficiariesPortal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { FraudDetectionPanel } from './components/FraudDetectionPanel';
import { ZakatCalculatorModal } from './components/ZakatCalculatorModal';
import { DonationGatewayModal } from './components/DonationGatewayModal';
import { BiometricVerificationModal } from './components/BiometricVerificationModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { InteractiveTutorial } from './components/InteractiveTutorial';
import { ReportsModal } from './components/ReportsModal';
import { SocialShareModal } from './components/SocialShareModal';
import { CurriculumView } from './components/CurriculumView';
import { StakingDashboard } from './components/StakingDashboard';

import { 
  initialCampaigns, 
  initialBlocks, 
  initialTransactions, 
  initialBeneficiaries, 
  initialNotifications, 
  initialFraudAnalyses 
} from './data/mockData';
import { 
  Campaign, 
  BlockchainTransaction, 
  BlockchainBlock, 
  Beneficiary, 
  NotificationItem, 
  AccessibilitySettings, 
  Language, 
  FraudAnalysisResult 
} from './types';
import { playSoundCue, speakText, sha256, formatIdr } from './utils/cryptoSim';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('campaigns');
  const [lang, setLang] = useState<Language>('id');
  
  // Accessibility state
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    voiceNavActive: false,
    screenReaderActive: false,
    speechRate: 1.0,
    contrastMode: 'normal',
    fontSize: 'md',
    soundEffects: true,
  });

  // Data state
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [blocks, setBlocks] = useState<BlockchainBlock[]>(initialBlocks);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>(initialTransactions);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [fraudAnalyses, setFraudAnalyses] = useState<FraudAnalysisResult[]>(initialFraudAnalyses);

  // Modals state
  const [showZakatCalc, setShowZakatCalc] = useState<boolean>(false);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [donationPrefill, setDonationPrefill] = useState<{ campaignId?: string; amount?: number }>({});
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [showKeyboardModal, setShowKeyboardModal] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [selectedBioBeneficiary, setSelectedBioBeneficiary] = useState<Beneficiary | null>(null);
  const [selectedShareCampaign, setSelectedShareCampaign] = useState<Campaign | null>(null);
  const [highlightedTxHash, setHighlightedTxHash] = useState<string | null>(null);

  // Apply visual theme and font-scale dynamically to document body
  useEffect(() => {
    document.body.classList.remove(
      'theme-high-contrast', 
      'theme-sepia', 
      'theme-dark', 
      'font-scale-sm', 
      'font-scale-md', 
      'font-scale-lg', 
      'font-scale-xl'
    );

    if (accessibilitySettings.contrastMode !== 'normal') {
      document.body.classList.add(`theme-${accessibilitySettings.contrastMode}`);
    }
    document.body.classList.add(`font-scale-${accessibilitySettings.fontSize}`);

    // RTL for Arabic
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [accessibilitySettings.contrastMode, accessibilitySettings.fontSize, lang]);

  // Global Keyboard listener for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShowKeyboardModal(true);
      } else if (e.key === 'Escape') {
        setShowZakatCalc(false);
        setShowDonationModal(false);
        setShowVoiceModal(false);
        setShowKeyboardModal(false);
        setShowTutorial(false);
        setShowReportModal(false);
        setSelectedBioBeneficiary(null);
        setSelectedShareCampaign(null);
      } else if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          setCurrentTab('campaigns');
        } else if (e.key === '2') {
          e.preventDefault();
          setCurrentTab('staking');
        } else if (e.key === '3') {
          e.preventDefault();
          setCurrentTab('explorer');
        } else if (e.key === '4') {
          e.preventDefault();
          setCurrentTab('curriculum');
        } else if (e.key === '5') {
          e.preventDefault();
          setCurrentTab('beneficiaries');
        } else if (e.key === '6') {
          e.preventDefault();
          setCurrentTab('analytics');
        } else if (e.key === '7') {
          e.preventDefault();
          setCurrentTab('fraud');
        } else if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          setShowZakatCalc(true);
        } else if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          setShowDonationModal(true);
        } else if (e.key.toLowerCase() === 'v') {
          e.preventDefault();
          setShowVoiceModal(true);
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          const modes: ('normal' | 'high-contrast' | 'sepia' | 'dark')[] = ['normal', 'high-contrast', 'dark', 'sepia'];
          setAccessibilitySettings(prev => ({
            ...prev,
            contrastMode: modes[(modes.indexOf(prev.contrastMode) + 1) % modes.length]
          }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle successful transaction committed
  const handleSuccessTransaction = async (tx: BlockchainTransaction) => {
    // 1. Prepend transaction
    setTransactions(prev => [tx, ...prev]);

    // 2. Prepend or update block
    const newBlock: BlockchainBlock = {
      blockNumber: tx.blockNumber,
      timestamp: tx.timestamp,
      hash: await sha256(`block-${tx.blockNumber}-${tx.txHash}`),
      prevHash: blocks[0]?.hash || '0x0000a91823...',
      merkleRoot: await sha256(`merkle-${tx.txHash}`),
      txCount: 1,
      validator: 'Node-Syariah-Consensus-01 (MUI / BAZNAS Certified)',
      transactions: [tx]
    };
    setBlocks(prev => [newBlock, ...prev]);

    // 3. Update campaign collected amounts
    setCampaigns(prev => prev.map(c => {
      if (c.smartContractAddress === tx.smartContract) {
        return {
          ...c,
          raisedAmount: c.raisedAmount + tx.amountIdr
        };
      }
      return c;
    }));

    // 4. Add notification item
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      type: 'donation',
      title: 'Donasi Baru Berhasil Dicatat On-Chain',
      message: `Penyaluran sebesar ${tx.amountCrypto} (${tx.currency}) telah divalidasi dan diarsipkan ke Blok #${tx.blockNumber}.`,
      timestamp: 'Baru saja',
      txHash: tx.txHash,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handle Biometric Verification completion
  const handleBiometricVerificationComplete = (beneficiaryId: string, bioAuditId: string) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id === beneficiaryId) {
        return {
          ...b,
          biometricStatus: 'verified',
          biometricScore: 99.6,
          lastAidDate: new Date().toISOString().split('T')[0]
        };
      }
      return b;
    }));

    // Add notification
    const newNotif: NotificationItem = {
      id: 'notif-bio-' + Date.now(),
      type: 'biometric',
      title: 'Verifikasi Biometrik Wajah Berhasil',
      message: `Mustahiq ${beneficiaryId} telah diverifikasi secara aman dengan token ${bioAuditId}.`,
      timestamp: 'Baru saja',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // AI Fraud scan simulation
  const handleTriggerFraudScan = async () => {
    await new Promise(r => setTimeout(r, 1200));
    setFraudAnalyses(prev => [
      {
        id: 'FRAUD-00' + (prev.length + 1),
        campaignId: 'cmp-003',
        campaignTitle: 'Wakaf Sumur Bor Tenaga Surya',
        riskScore: 3,
        riskLevel: 'LOW',
        anomaliesDetected: ['Sensor debit air IoT terhubung dengan telemetry blockchain. Aliran air konsisten 12 liter/menit.'],
        recommendation: 'Aset wakaf berfungsi optimal dan memenuhi syarat keberlanjutan maslahat.',
        evaluatedAt: 'Baru saja (Real-Time)',
        verifiedByAi: true
      },
      ...prev
    ]);
  };

  const handleReadSummaryAloud = () => {
    const summary = `Anda sedang berada di platform Islamicity Cripto pada tab ${currentTab}. Total dana terhimpun saat ini adalah 5,7 miliar rupiah dengan 22 ribu penerima manfaat terverifikasi biometrik.`;
    speakText(summary, lang === 'id' ? 'id-ID' : 'en-US');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col islamic-pattern">
      
      {/* 1. Accessible Skip Navigation Link for Screen Readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-emerald-700 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Lompat Langsung ke Konten Utama (Skip to Main Content)
      </a>

      {/* 2. WCAG AAA Accessibility Controls Bar */}
      <AccessibilityBar
        settings={accessibilitySettings}
        setSettings={setAccessibilitySettings}
        lang={lang}
        onOpenVoiceModal={() => setShowVoiceModal(true)}
        onOpenKeyboardModal={() => setShowKeyboardModal(true)}
        onStartTutorial={() => setShowTutorial(true)}
      />

      {/* 3. Top Navigation Bar (Contract Compliant) */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        notifications={notifications}
        onOpenZakatCalc={() => setShowZakatCalc(true)}
        onOpenDonationModal={() => {
          setDonationPrefill({});
          setShowDonationModal(true);
        }}
        onMarkNotificationsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
      />

      {/* 4. Main Viewport Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'campaigns' && (
          <CampaignsView
            campaigns={campaigns}
            lang={lang}
            onOpenDonationModal={(cmpId) => {
              setDonationPrefill({ campaignId: cmpId });
              setShowDonationModal(true);
            }}
            onOpenZakatCalc={() => setShowZakatCalc(true)}
            onOpenShareModal={(cmp) => setSelectedShareCampaign(cmp)}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'staking' && (
          <StakingDashboard
            lang={lang}
            onOpenExplorerWithTx={(txHash) => {
              setHighlightedTxHash(txHash);
              setCurrentTab('explorer');
            }}
            onSuccessStakeTransaction={(tx) => {
              setTransactions(prev => [tx, ...prev]);
              // Also add to notification feed
              const notif: NotificationItem = {
                id: `notif-${Date.now()}`,
                type: 'donation',
                title: 'Staking Wakaf Produktif Terkunci',
                message: `Aset senilai ${tx.amountCrypto} (${formatIdr(tx.amountIdr)}) berhasil dikunci di Smart Vault BWI.`,
                timestamp: 'Baru saja',
                txHash: tx.txHash,
                read: false
              };
              setNotifications(prev => [notif, ...prev]);
            }}
          />
        )}

        {currentTab === 'explorer' && (
          <BlockchainExplorer
            blocks={blocks}
            transactions={transactions}
            highlightedTxHash={highlightedTxHash}
            onNavigateToStory={(txHash) => {
              setHighlightedTxHash(txHash);
              setCurrentTab('beneficiaries');
            }}
          />
        )}

        {currentTab === 'curriculum' && (
          <CurriculumView
            lang={lang}
            onOpenZakatCalc={() => setShowZakatCalc(true)}
            onOpenDonationModal={() => {
              setDonationPrefill({});
              setShowDonationModal(true);
            }}
          />
        )}

        {currentTab === 'beneficiaries' && (
          <BeneficiariesPortal
            beneficiaries={beneficiaries}
            onOpenBiometricModal={(ben) => setSelectedBioBeneficiary(ben)}
            initialTxHash={highlightedTxHash}
            onNavigateToTx={(txHash) => {
              setHighlightedTxHash(txHash);
              setCurrentTab('explorer');
            }}
            onOpenDonationModal={(cmpId) => {
              setDonationPrefill({ campaignId: cmpId });
              setShowDonationModal(true);
            }}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsDashboard
            campaigns={campaigns}
            onOpenReportModal={() => setShowReportModal(true)}
          />
        )}

        {currentTab === 'fraud' && (
          <FraudDetectionPanel
            fraudAnalyses={fraudAnalyses}
            onTriggerScan={handleTriggerFraudScan}
          />
        )}
      </main>

      {/* 5. Clean, Professional Footer */}
      <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800 text-xs py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-neutral-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Islamicity Cripto</span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-xs">
                Infrastruktur Zakat & Wakaf Kripto Transparan berdaya terbaik dunia dengan sistem enkripsi blockchain end-to-end, verifikasi identitas biometrik, dan AI anti-penipuan.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2.5">Kepatuhan Syariah & Regulasi</h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <button 
                    onClick={() => { playSoundCue('click'); setCurrentTab('curriculum'); }}
                    className="hover:text-emerald-400 text-left transition-colors cursor-pointer underline flex items-center gap-1 font-semibold text-emerald-300"
                  >
                    <span>Akademi & Kurikulum Kripto Syariah</span>
                  </button>
                </li>
                <li>Dewan Syariah Nasional (DSN-MUI)</li>
                <li>Badan Amil Zakat Nasional (BAZNAS)</li>
                <li>Badan Wakaf Indonesia (BWI)</li>
                <li>Audit Standar PSAK 109 & ISO 27001</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2.5">Fitur Aksesibilitas WCAG AAA</h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>Kontrol Navigasi Suara (Web Speech API)</li>
                <li>Pembaca Layar Sintesis Suara (TTS)</li>
                <li>Mode Kontras Tinggi & Skala Font</li>
                <li>Dukungan Penuh Pintasan Papan Ketik</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2.5">Keamanan Kriptografi</h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>Zero-Knowledge Proofs (ZK-SNARK)</li>
                <li>Enkripsi Simetris AES-256-GCM</li>
                <li>Penyimpanan Terdistribusi IPFS & Node</li>
                <li>Audit Smart Contract Independen</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
            <p>© 2026 Islamicity Cripto Foundation. Seluruh hak cipta dilindungi.</p>
            <div className="flex items-center gap-4">
              <span>Keamanan End-to-End Terverifikasi</span>
              <span aria-hidden="true">·</span>
              <span>Node Konsensus Syariah Aktif</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <ZakatCalculatorModal
        isOpen={showZakatCalc}
        onClose={() => setShowZakatCalc(false)}
        onProceedDonation={(amount) => {
          setDonationPrefill({ amount });
          setShowDonationModal(true);
        }}
      />

      <DonationGatewayModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        campaigns={campaigns}
        prefilledCampaignId={donationPrefill.campaignId}
        prefilledAmount={donationPrefill.amount}
        onSuccessTransaction={handleSuccessTransaction}
        onOpenExplorerWithTx={(txHash) => {
          setHighlightedTxHash(txHash);
          setCurrentTab('explorer');
        }}
        onOpenShareModal={(cmp) => setSelectedShareCampaign(cmp)}
      />

      <BiometricVerificationModal
        isOpen={Boolean(selectedBioBeneficiary)}
        onClose={() => setSelectedBioBeneficiary(null)}
        beneficiary={selectedBioBeneficiary}
        onVerificationComplete={handleBiometricVerificationComplete}
      />

      <VoiceAssistantModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        lang={lang}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setShowVoiceModal(false);
        }}
        onOpenZakatCalc={() => {
          setShowVoiceModal(false);
          setShowZakatCalc(true);
        }}
        onOpenDonationModal={() => {
          setShowVoiceModal(false);
          setShowDonationModal(true);
        }}
        onToggleContrast={() => {
          const modes: ('normal' | 'high-contrast' | 'sepia' | 'dark')[] = ['normal', 'high-contrast', 'dark', 'sepia'];
          setAccessibilitySettings(prev => ({
            ...prev,
            contrastMode: modes[(modes.indexOf(prev.contrastMode) + 1) % modes.length]
          }));
        }}
        onReadSummary={handleReadSummaryAloud}
      />

      <KeyboardShortcutsModal
        isOpen={showKeyboardModal}
        onClose={() => setShowKeyboardModal(false)}
      />

      <InteractiveTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onNavigateToTab={(tab) => setCurrentTab(tab)}
      />

      <ReportsModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        campaigns={campaigns}
      />

      <SocialShareModal
        isOpen={Boolean(selectedShareCampaign)}
        onClose={() => setSelectedShareCampaign(null)}
        campaign={selectedShareCampaign}
      />

    </div>
  );
}
