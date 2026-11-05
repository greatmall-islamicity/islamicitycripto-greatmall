export type Language = 'id' | 'en' | 'ar';

export type CampaignCategory = 
  | 'zakat_fitrah' 
  | 'zakat_maal' 
  | 'zakat_profesi' 
  | 'waqf_produktif' 
  | 'waqf_sosial' 
  | 'infak_kemanusiaan';

export type AsnafType = 
  | 'fakir' 
  | 'miskin' 
  | 'amil' 
  | 'muallaf' 
  | 'riqab' 
  | 'gharimin' 
  | 'fisabilillah' 
  | 'ibnu_sabil';

export interface Campaign {
  id: string;
  title: string;
  titleEn: string;
  titleAr: string;
  category: CampaignCategory;
  description: string;
  descriptionEn: string;
  targetAmount: number; // in IDR
  targetCrypto: string; // e.g. "50,000 USDT"
  raisedAmount: number;
  distributedAmount: number;
  beneficiaryCount: number;
  asnafCategory: AsnafType;
  image: string;
  location: string;
  verificationStatus: 'verified' | 'audited' | 'pending';
  biometricVerifiedCount: number;
  smartContractAddress: string;
  e2eEncrypted: boolean;
  recentDisbursements: DisbursementRecord[];
}

export interface DisbursementRecord {
  id: string;
  title: string;
  amount: number;
  date: string;
  beneficiaryCount: number;
  biometricAuditId: string;
  proofHash: string;
  status: 'completed' | 'in_transit' | 'scheduled';
}

export interface BlockchainTransaction {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  type: 'ZAKAT' | 'WAKAF' | 'DISBURSEMENT';
  donorMasked: string; // e.g., "Hamba Allah (0x7F2...9a)"
  beneficiaryMasked?: string;
  amountIdr: number;
  amountCrypto: string;
  currency: 'IDR' | 'USDT' | 'ISLM' | 'ETH' | 'PAXG';
  paymentGateway: 'E-Wallet' | 'Crypto' | 'Virtual Account' | 'QRIS';
  smartContract: string;
  zkProofHash: string;
  biometricVerified: boolean;
  status: 'confirmed' | 'pending';
}

export interface BlockchainBlock {
  blockNumber: number;
  timestamp: string;
  hash: string;
  prevHash: string;
  merkleRoot: string;
  txCount: number;
  validator: string;
  transactions: BlockchainTransaction[];
}

export interface Beneficiary {
  id: string;
  fullNameMasked: string;
  asnaf: AsnafType;
  city: string;
  biometricStatus: 'verified' | 'pending';
  biometricScore: number;
  verificationMethod: 'FaceBiometric' | 'WebAuthnPasskey' | 'NID_Card';
  totalAidReceivedIdr: number;
  lastAidDate: string;
  zkIdentityProof: string;
}

export interface NotificationItem {
  id: string;
  type: 'distribution' | 'donation' | 'biometric' | 'security';
  title: string;
  message: string;
  timestamp: string;
  txHash?: string;
  read: boolean;
}

export interface AccessibilitySettings {
  voiceNavActive: boolean;
  screenReaderActive: boolean;
  speechRate: number;
  contrastMode: 'normal' | 'high-contrast' | 'sepia' | 'dark';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  soundEffects: boolean;
}

export interface FraudAnalysisResult {
  id: string;
  campaignId: string;
  campaignTitle: string;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  anomaliesDetected: string[];
  recommendation: string;
  evaluatedAt: string;
  verifiedByAi: boolean;
}

export interface SmartContractAuditLog {
  id: string;
  timestamp: string;
  contractName: string;
  contractAddress: string;
  methodCalled: string;
  eventEmitted: string;
  caller: string;
  invariantStatus: 'VERIFIED' | 'COMPLIANT' | 'PROTECTED';
  invariantNote: string;
  gasUsed: number;
  blockNumber: number;
  auditorSignature: string;
  decodedParams: { key: string; value: string }[];
}

export interface ContractSecurityAlert {
  id: string;
  timestamp: string;
  blockNumber: number;
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
  title: string;
  message: string;
  contractName: string;
  contractAddress: string;
  category: 'SUSPICIOUS_VELOCITY' | 'INVARIANT_CIRCUIT_BREAKER' | 'TIMELOCK_UPGRADE' | 'DUPLICATE_CLAIM_ATTEMPT' | 'AMIL_FEE_OVERRUN';
  actionSuggested: string;
  read: boolean;
  resolved: boolean;
}

export interface CurriculumModule {
  id: string;
  order: number;
  level: 'DASAR' | 'MENENGAH' | 'LANJUTAN' | 'AMIL_SPESIALIS';
  title: string;
  titleEn: string;
  durationMinutes: number;
  summary: string;
  dalilReference: string;
  fatwaReference: string;
  learningPoints: string[];
  caseStudy: {
    scenario: string;
    fiqhVerdict: 'HALAL' | 'HARAM' | 'SYUBHAT';
    verdictExplanation: string;
  };
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface BeneficiaryStory {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  asnaf: AsnafType;
  city: string;
  campaignId: string;
  campaignTitle: string;
  date: string;
  headline: string;
  quote: string;
  narrativeBefore: string;
  narrativeIntervention: string;
  narrativeImpact: string;
  aidAmountIdr: number;
  aidAmountCrypto: string;
  verifiedTxHash: string;
  blockNumber: number;
  smartContractAddress: string;
  zkProofHash: string;
  biometricScore: number;
  biometricMethod: string;
  category: 'Ketahanan Pangan' | 'Kesehatan Dhuafa' | 'Air Bersih & Sanitasi' | 'Pemberdayaan Usaha Mikro' | 'Pendidikan Yatim';
  imageUrl: string;
  imageCaption: string;
  imageHash: string;
  prayerCount: number;
  prayers: {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }[];
  tags: string[];
}

export type ShariaContractModel = 'MUDHARABAH' | 'MUSYARAKAH' | 'IJARAH_SUKUK' | 'QARDH_HASAN';

export interface WaqfStakingPool {
  id: string;
  name: string;
  category: 'WAKAF_PRODUKTIF_MEDIS' | 'WAKAF_AIR_ENERGI' | 'WAKAF_AGRO_PANGAN' | 'WAKAF_PENDIDIKAN_DIGITAL';
  description: string;
  shariaModel: ShariaContractModel;
  shariaFatwaRef: string;
  underlyingAsset: string;
  targetMaturityMonths: number[]; // e.g. [3, 6, 12, 24, 36]
  estimatedApyPercent: number; // Projected annual yield percentage (nisbah/ujrah share)
  donorYieldSharePercent: number; // Share of return retained by donor or compounded (e.g. 60%)
  waqfPerpetualSharePercent: number; // Share of return perpetually channeled to mustahiq beneficiaries (e.g. 40%)
  totalStakedIdr: number;
  totalStakers: number;
  acceptedTokens: ('USDT' | 'ISLM' | 'ETH' | 'PAXG')[];
  smartContractVault: string;
  riskRating: 'RENDAH (Aset Riil Beragun)' | 'MODERAT (Bagi Hasil Usaha)' | 'KONSERVATIF (Sukuk Ijarah)';
  bwiAccreditationNo: string;
  status: 'ACTIVE' | 'FULL';
}

export interface UserWaqfStake {
  id: string;
  poolId: string;
  poolName: string;
  tokenSymbol: 'USDT' | 'ISLM' | 'ETH' | 'PAXG';
  stakedTokenAmount: number;
  stakedIdrAmount: number;
  lockPeriodMonths: number;
  startDate: string;
  maturityDate: string;
  shariaModel: ShariaContractModel;
  projectedAnnualYieldIdr: number;
  accumulatedBeneficiaryYieldIdr: number; // Amount channeled directly to Waqf impact projects
  accumulatedDonorYieldIdr: number; // Return given back to donor or opted for auto-rewaqf
  autoReinvestInWaqf: boolean;
  txHash: string;
  status: 'LOCKING' | 'MATURED' | 'COMPOUNDING';
}



