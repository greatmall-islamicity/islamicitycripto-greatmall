import { Campaign, BlockchainBlock, BlockchainTransaction, Beneficiary, NotificationItem, FraudAnalysisResult } from '../types';

export const initialCampaigns: Campaign[] = [
  {
    id: 'cmp-001',
    title: 'Zakat Pangan Darurat & Paket Gizi Asnaf Fakir Miskin',
    titleEn: 'Emergency Food Zakat & Nutrition Kits for the Needy',
    titleAr: 'زكاة الغذاء الطارئ وحزم التغذية للفقراء والمساكين',
    category: 'zakat_fitrah',
    description: 'Penyaluran beras premium dan sembako bergizi tinggi langsung ke pintu keluarga mustahiq dengan verifikasi biometrik wajah penerima tanpa perantara.',
    descriptionEn: 'Direct doorstep distribution of premium rice and nutrition food parcels to verified mustahiq families with facial biometric audit logs.',
    targetAmount: 750000000,
    targetCrypto: '48,000 USDT',
    raisedAmount: 642850000,
    distributedAmount: 590000000,
    beneficiaryCount: 3850,
    asnafCategory: 'fakir',
    image: '/src/assets/images/zakat_food_distribution_1792212214956.jpg',
    location: 'Jawa Barat & NTT, Indonesia',
    verificationStatus: 'verified',
    biometricVerifiedCount: 3820,
    smartContractAddress: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    e2eEncrypted: true,
    recentDisbursements: [
      {
        id: 'dsb-101',
        title: 'Batch 1: 1.200 Paket Beras & Sembako Sukabumi',
        amount: 180000000,
        date: '2026-10-14',
        beneficiaryCount: 1200,
        biometricAuditId: 'BIO-PASS-99824',
        proofHash: '0x9fa1c74291e0a811234bce90812349018e219ba48810c9201bc',
        status: 'completed'
      },
      {
        id: 'dsb-102',
        title: 'Batch 2: 1.500 Paket Sembako Keluarga Kupang NTT',
        amount: 225000000,
        date: '2026-10-15',
        beneficiaryCount: 1500,
        biometricAuditId: 'BIO-PASS-99839',
        proofHash: '0x3cb710fa90811234bce90812349018e219ba48810c9201bc998',
        status: 'completed'
      }
    ]
  },
  {
    id: 'cmp-002',
    title: 'Wakaf Produktif Klinik Mata & Pusat Diagnostik Komunitas',
    titleEn: 'Productive Waqf Community Eye Clinic & Diagnostic Pavilion',
    titleAr: 'وقف إنتاجي لعيادة العيون ومركز التشخيص المجتمعي',
    category: 'waqf_produktif',
    description: 'Pembangunan pusat diagnostik kesehatan syariah berbasis panel surya gratis untuk dhuafa dan asnaf miskin dengan aset wakaf abadi bersertifikat BWI.',
    descriptionEn: 'Construction of a zero-cost solar-powered Sharia health diagnostic pavilion for underprivileged families, backed by certified perpetual waqf assets.',
    targetAmount: 2400000000,
    targetCrypto: '155,000 USDT',
    raisedAmount: 1890000000,
    distributedAmount: 1650000000,
    beneficiaryCount: 12400,
    asnafCategory: 'miskin',
    image: '/src/assets/images/waqf_hospital_clinic_1792212213611.jpg',
    location: 'Lombok Timur & Flores',
    verificationStatus: 'audited',
    biometricVerifiedCount: 8900,
    smartContractAddress: '0x4389104A3b2A69De6Dbf7f01ED13B2108B2c8821',
    e2eEncrypted: true,
    recentDisbursements: [
      {
        id: 'dsb-201',
        title: 'Pengadaan Mesin Autoref & Operasi Katarak Gratis',
        amount: 650000000,
        date: '2026-10-10',
        beneficiaryCount: 420,
        biometricAuditId: 'BIO-PASS-77211',
        proofHash: '0x448a90182312b84918237410928301984019283019283019283',
        status: 'completed'
      }
    ]
  },
  {
    id: 'cmp-003',
    title: 'Wakaf Sumur Bor Tenaga Surya & Filtrasi Air Bersih',
    titleEn: 'Solar Deep Aquifer Clean Water Well & Filtration Waqf',
    titleAr: 'وقف بئر مياه بالطاقة الشمسية وشبكة تنقية المياه النقية',
    category: 'waqf_sosial',
    description: 'Penyediaan sumur bor otomatis sedalam 120 meter bertenaga surya untuk mengakhiri krisis air bersih bagi 5.000 warga desa kekeringan.',
    descriptionEn: 'Provision of a 120-meter deep solar water aquifer system with potable multi-stage filtration ending chronic drought for 5,000 villagers.',
    targetAmount: 480000000,
    targetCrypto: '31,000 USDT',
    raisedAmount: 480000000,
    distributedAmount: 480000000,
    beneficiaryCount: 5200,
    asnafCategory: 'ibnu_sabil',
    image: '/src/assets/images/waqf_water_well_1792212214536.jpg',
    location: 'Gunung Kidul & Sumba Barat',
    verificationStatus: 'verified',
    biometricVerifiedCount: 5200,
    smartContractAddress: '0x9923104A3b2A69De6Dbf7f01ED13B2108B2c5541',
    e2eEncrypted: true,
    recentDisbursements: [
      {
        id: 'dsb-301',
        title: 'Instalasi Pipa Sanitasi & Kran Distribusi Komunal',
        amount: 480000000,
        date: '2026-10-12',
        beneficiaryCount: 5200,
        biometricAuditId: 'BIO-PASS-55419',
        proofHash: '0x772091238910481029380129380192830192830192830192830',
        status: 'completed'
      }
    ]
  },
  {
    id: 'cmp-004',
    title: 'Zakat Maal Pemberdayaan Ekonomi & Modal Usaha Mikro Syariah',
    titleEn: 'Zakat Maal Micro-Enterprise Sharia Revolving Grant Fund',
    titleAr: 'زكاة المال لتمكين المشاريع الصغيرة والتمويل الإسلامي للمستحقين',
    category: 'zakat_maal',
    description: 'Bantuan modal usaha bebas riba (Qardhul Hasan) bagi mustahiq produktif agar bertransformasi dari penerima zakat menjadi muzakki berdaya.',
    descriptionEn: 'Interest-free revolving business grants (Qardhul Hasan) mentoring productive beneficiaries into self-sufficient future muzakkis.',
    targetAmount: 1200000000,
    targetCrypto: '78,000 USDT',
    raisedAmount: 940000000,
    distributedAmount: 850000000,
    beneficiaryCount: 650,
    asnafCategory: 'gharimin',
    image: '/src/assets/images/hero_islamic_architecture_1792212213404.jpg',
    location: 'Surabaya, Solo & Banda Aceh',
    verificationStatus: 'verified',
    biometricVerifiedCount: 650,
    smartContractAddress: '0x1102914A3b2A69De6Dbf7f01ED13B2108B2c9911',
    e2eEncrypted: true,
    recentDisbursements: [
      {
        id: 'dsb-401',
        title: 'Penyaluran Modal Usaha Asnaf Gharimin & Dhuafa',
        amount: 850000000,
        date: '2026-10-08',
        beneficiaryCount: 650,
        biometricAuditId: 'BIO-PASS-33109',
        proofHash: '0x129048109283019283019283019283019283019283019283019',
        status: 'completed'
      }
    ]
  }
];

export const initialTransactions: BlockchainTransaction[] = [
  {
    txHash: '0x7f9a8123cba09148102938102938102938102938102938102938102938102938',
    blockNumber: 489210,
    timestamp: '2026-10-16 21:15:20',
    type: 'ZAKAT',
    donorMasked: 'Hamba Allah (0x4E...8A)',
    amountIdr: 5000000,
    amountCrypto: '320.5 USDT',
    currency: 'USDT',
    paymentGateway: 'Crypto',
    smartContract: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    zkProofHash: 'zk-snark-0x8924a...bc',
    biometricVerified: true,
    status: 'confirmed'
  },
  {
    txHash: '0x3bb19024cba09148102938102938102938102938102938102938102938102911',
    blockNumber: 489209,
    timestamp: '2026-10-16 20:48:10',
    type: 'WAKAF',
    donorMasked: 'Ir. M. Ridwan (0x9F...12)',
    amountIdr: 25000000,
    amountCrypto: '1,600 USDT',
    currency: 'IDR',
    paymentGateway: 'E-Wallet',
    smartContract: '0x4389104A3b2A69De6Dbf7f01ED13B2108B2c8821',
    zkProofHash: 'zk-snark-0x4381a...11',
    biometricVerified: true,
    status: 'confirmed'
  },
  {
    txHash: '0x1290f841cba09148102938102938102938102938102938102938102938102922',
    blockNumber: 489208,
    timestamp: '2026-10-16 19:30:04',
    type: 'DISBURSEMENT',
    donorMasked: 'Islamic Smart Contract Vault',
    beneficiaryMasked: 'Mustahiq Terverifikasi (Kupang #042)',
    amountIdr: 225000000,
    amountCrypto: '14,400 USDT',
    currency: 'IDR',
    paymentGateway: 'Virtual Account',
    smartContract: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    zkProofHash: 'zk-snark-0x9910f...44',
    biometricVerified: true,
    status: 'confirmed'
  },
  {
    txHash: '0x55018a12cba09148102938102938102938102938102938102938102938102933',
    blockNumber: 489207,
    timestamp: '2026-10-16 18:12:45',
    type: 'ZAKAT',
    donorMasked: 'Hamba Allah (0x1A...CC)',
    amountIdr: 1000000,
    amountCrypto: '64.1 USDT',
    currency: 'ISLM',
    paymentGateway: 'Crypto',
    smartContract: '0x1102914A3b2A69De6Dbf7f01ED13B2108B2c9911',
    zkProofHash: 'zk-snark-0x1102b...88',
    biometricVerified: true,
    status: 'confirmed'
  }
];

export const initialBlocks: BlockchainBlock[] = [
  {
    blockNumber: 489210,
    timestamp: '2026-10-16 21:15:20',
    hash: '0x0000b91a78e123fa90812349018e219ba48810c9201bc9987162534819028301',
    prevHash: '0x0000789123fa90812349018e219ba48810c9201bc9987162534819028301fa12',
    merkleRoot: '0x8849102938102938102938102938102938102938102938102938102938102938',
    txCount: 8,
    validator: 'Node-Syariah-Consensus-01 (MUI / BAZNAS Certified)',
    transactions: initialTransactions.slice(0, 1)
  },
  {
    blockNumber: 489209,
    timestamp: '2026-10-16 20:48:10',
    hash: '0x0000789123fa90812349018e219ba48810c9201bc9987162534819028301fa12',
    prevHash: '0x0000334819028301fa12789123fa90812349018e219ba48810c9201bc9987162',
    merkleRoot: '0x4481029381029381029381029381029381029381029381029381029381029384',
    txCount: 14,
    validator: 'Node-Syariah-Consensus-02 (International Islamic Board)',
    transactions: initialTransactions.slice(1, 2)
  },
  {
    blockNumber: 489208,
    timestamp: '2026-10-16 19:30:04',
    hash: '0x0000334819028301fa12789123fa90812349018e219ba48810c9201bc9987162',
    prevHash: '0x0000112938102938102938102938102938102938102938102938102938102938',
    merkleRoot: '0x1192830192830192830192830192830192830192830192830192830192830192',
    txCount: 19,
    validator: 'Node-Syariah-Consensus-03 (BWI Sovereign Auditor)',
    transactions: initialTransactions.slice(2, 3)
  }
];

export const initialBeneficiaries: Beneficiary[] = [
  {
    id: 'BEN-8821',
    fullNameMasked: 'Siti Aminah (3202****9012)',
    asnaf: 'miskin',
    city: 'Sukabumi, Jawa Barat',
    biometricStatus: 'verified',
    biometricScore: 99.4,
    verificationMethod: 'FaceBiometric',
    totalAidReceivedIdr: 4500000,
    lastAidDate: '2026-10-14',
    zkIdentityProof: 'zk-id-0x9948...ab'
  },
  {
    id: 'BEN-8822',
    fullNameMasked: 'Pak Ahmad Dahlan (5371****4410)',
    asnaf: 'fakir',
    city: 'Kupang, NTT',
    biometricStatus: 'verified',
    biometricScore: 98.7,
    verificationMethod: 'FaceBiometric',
    totalAidReceivedIdr: 6200000,
    lastAidDate: '2026-10-15',
    zkIdentityProof: 'zk-id-0x3310...ef'
  },
  {
    id: 'BEN-8823',
    fullNameMasked: 'Hasan Basri (1101****8823)',
    asnaf: 'gharimin',
    city: 'Banda Aceh',
    biometricStatus: 'verified',
    biometricScore: 99.1,
    verificationMethod: 'WebAuthnPasskey',
    totalAidReceivedIdr: 15000000,
    lastAidDate: '2026-10-08',
    zkIdentityProof: 'zk-id-0x7721...01'
  },
  {
    id: 'BEN-8824',
    fullNameMasked: 'Fatimah Az-Zahra (3311****2291)',
    asnaf: 'ibnu_sabil',
    city: 'Gunung Kidul, DIY',
    biometricStatus: 'verified',
    biometricScore: 97.9,
    verificationMethod: 'NID_Card',
    totalAidReceivedIdr: 3500000,
    lastAidDate: '2026-10-12',
    zkIdentityProof: 'zk-id-0x5519...cc'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'distribution',
    title: 'Dana Zakat Pangan Berhasil Disalurkan!',
    message: 'Sebesar Rp 225.000.000 telah diserahkan langsung ke 1.500 Mustahiq di Kupang dengan bukti biometrik terenkripsi.',
    timestamp: '15 menit lalu',
    txHash: '0x1290f841cba09148102938102938102938102938102938102938102938102922',
    read: false
  },
  {
    id: 'notif-2',
    type: 'donation',
    title: 'Wakaf Produktif Terkonfirmasi',
    message: 'Donasi sebesar 1.600 USDT telah divalidasi oleh konsensus node syariah di Blok #489209.',
    timestamp: '1 jam lalu',
    txHash: '0x3bb19024cba09148102938102938102938102938102938102938102938102911',
    read: false
  },
  {
    id: 'notif-3',
    type: 'biometric',
    title: 'Verifikasi Biometrik Selesai',
    message: '1.200 penerima manfaat Asnaf Fakir Sukabumi telah terverifikasi via deteksi liveness biometrik wajah.',
    timestamp: '2 hari lalu',
    read: true
  }
];

export const initialFraudAnalyses: FraudAnalysisResult[] = [
  {
    id: 'FRAUD-001',
    campaignId: 'cmp-001',
    campaignTitle: 'Zakat Pangan Darurat & Paket Gizi',
    riskScore: 2,
    riskLevel: 'LOW',
    anomaliesDetected: ['Tidak ada anomali. Distribusi sejalan dengan data geolokasi BPS dan verifikasi biometrik penerima 99.4% cocok.'],
    recommendation: 'Aman untuk pencairan dana otomatis berikutnya melalui smart contract.',
    evaluatedAt: '2026-10-16 21:00',
    verifiedByAi: true
  },
  {
    id: 'FRAUD-002',
    campaignId: 'cmp-002',
    campaignTitle: 'Wakaf Produktif Klinik Mata',
    riskScore: 5,
    riskLevel: 'LOW',
    anomaliesDetected: ['Faktur pengadaan diverifikasi dengan tanda tangan digital vendor medis terdaftar.'],
    recommendation: 'Lolos validasi integritas audit syariah BWI.',
    evaluatedAt: '2026-10-16 20:30',
    verifiedByAi: true
  },
  {
    id: 'FRAUD-003',
    campaignId: 'cmp-004',
    campaignTitle: 'Zakat Maal Pemberdayaan Ekonomi',
    riskScore: 14,
    riskLevel: 'LOW',
    anomaliesDetected: ['Terdapat 3 pengajuan ulang dari alamat IP sama, namun telah dikonfirmasi sebagai amil lapangan terdaftar.'],
    recommendation: 'Distribusi diizinkan dengan pemantauan audit trail berkala.',
    evaluatedAt: '2026-10-16 19:15',
    verifiedByAi: true
  }
];

export const initialSmartContractAuditLogs: import('../types').SmartContractAuditLog[] = [
  {
    id: 'SC-AUDIT-901',
    timestamp: '2026-10-16 21:15:20',
    contractName: 'IslamicZakatVaultV2.sol',
    contractAddress: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    methodCalled: 'releaseMustahiqDisbursement(batchId, biometricPassToken, amount)',
    eventEmitted: 'MustahiqDisbursed(bytes32 indexed batchId, address recipient, uint256 amount)',
    caller: 'Relayer-Amil-WestJava (0x3348...90a1)',
    invariantStatus: 'VERIFIED',
    invariantNote: '100% Cadangan Kas Syariah Terkunci · Sesuai Hak Asnaf Fakir · Biometrik Lolos 99.4%',
    gasUsed: 43280,
    blockNumber: 489210,
    auditorSignature: 'DSN-MUI-Validator-Sig-0x991f820c',
    decodedParams: [
      { key: 'batchId', value: 'DSB-101 (1.200 Paket Sukabumi)' },
      { key: 'amount', value: '180,000,000 IDR (11,538 USDT)' },
      { key: 'biometricHash', value: 'BIO-PASS-99824' },
      { key: 'asnafType', value: 'Fakir Miskin' }
    ]
  },
  {
    id: 'SC-AUDIT-902',
    timestamp: '2026-10-16 20:48:10',
    contractName: 'WaqfPerpetualAssetLock.sol',
    contractAddress: '0x4389104A3b2A69De6Dbf7f01ED13B2108B2c8821',
    methodCalled: 'lockWaqfPerpetualPrincipal(assetId, bwiLegalCertHash, amount)',
    eventEmitted: 'WaqfPrincipalImmortalized(bytes32 assetId, uint256 principalValue)',
    caller: 'BWI-Sovereign-Portal (0x4421...bb10)',
    invariantStatus: 'PROTECTED',
    invariantNote: 'Prinsip Inalienabilitas Aktif · Aset Pokok Wakaf Terkunci Kekal, Tidak Boleh Dijual/Disita',
    gasUsed: 58910,
    blockNumber: 489209,
    auditorSignature: 'BWI-Legal-Auditor-Sig-0x772e119a',
    decodedParams: [
      { key: 'assetId', value: 'CLINIC-LOMBOK-02' },
      { key: 'principalValue', value: '2,400,000,000 IDR' },
      { key: 'certificateHash', value: 'BWI-CERT-77890123' },
      { key: 'sustainabilityModel', value: 'Productive Healthcare Waqf' }
    ]
  },
  {
    id: 'SC-AUDIT-903',
    timestamp: '2026-10-16 19:30:04',
    contractName: 'BiometricIdentityRegistry.sol',
    contractAddress: '0x9923104A3b2A69De6Dbf7f01ED13B2108B2c5541',
    methodCalled: 'assertZkLivenessProof(mustahiqCommitment, zkProofSNARK)',
    eventEmitted: 'ZkIdentityAffirmed(bytes32 commitment, uint256 timestamp)',
    caller: 'ZkProver-Node-EastNusa (0x1290...3fa1)',
    invariantStatus: 'VERIFIED',
    invariantNote: 'Privasi Zero-Knowledge Terjamin · Nol Data Pribadi Sensitif Bocor ke Publik',
    gasUsed: 74120,
    blockNumber: 489208,
    auditorSignature: 'ZK-Consensus-Node-Sig-0x112048aa',
    decodedParams: [
      { key: 'mustahiqCommitment', value: 'zk-id-0x3310...ef' },
      { key: 'livenessMatchScore', value: '98.7% (Facial Contour Liveness)' },
      { key: 'antiSybilDuplication', value: 'PASSED (0 Duplicate Claims)' }
    ]
  },
  {
    id: 'SC-AUDIT-904',
    timestamp: '2026-10-16 18:12:45',
    contractName: 'QardhulHasanMicroGrant.sol',
    contractAddress: '0x1102914A3b2A69De6Dbf7f01ED13B2108B2c9911',
    methodCalled: 'issueRevolvingMicroCapital(borrowerId, grantAmount, durationHaul)',
    eventEmitted: 'CapitalDisbursed(bytes32 borrowerId, uint256 amount)',
    caller: 'Sharia-Micro-Operator (0x5501...cc12)',
    invariantStatus: 'COMPLIANT',
    invariantNote: 'Bebas Riba Mutlak (0.00% Bunga) · Dana Pengembalian Otomatis Mengalir ke Rekening Asnaf',
    gasUsed: 36450,
    blockNumber: 489207,
    auditorSignature: 'DSN-MUI-Microfinance-Sig-0x889a2244',
    decodedParams: [
      { key: 'borrowerId', value: 'GHARIMIN-SOLO-019' },
      { key: 'grantAmount', value: '15,000,000 IDR' },
      { key: 'interestRate', value: '0.00% (Qardhul Hasan Murni)' },
      { key: 'tenureMonths', value: '12 Bulan' }
    ]
  },
  {
    id: 'SC-AUDIT-905',
    timestamp: '2026-10-16 17:05:12',
    contractName: 'ShariaGovernanceConsensus.sol',
    contractAddress: '0x5519804A3b2A69De6Dbf7f01ED13B2108B2c1109',
    methodCalled: 'submitFatwaComplianceCheck(blockInterval, merkleRootHash)',
    eventEmitted: 'FatwaComplianceSealed(uint256 blockInterval, bytes32 rootHash)',
    caller: 'BAZNAS-Independent-Node (0x8810...44ab)',
    invariantStatus: 'VERIFIED',
    invariantNote: 'Beban Operasional Amil Terjaga 3.0% (Maksimal Regulasi 12.5%) · 100% Rekonsiliasi Kas Sesuai',
    gasUsed: 52190,
    blockNumber: 489206,
    auditorSignature: 'BAZNAS-Auditor-Consensus-Sig-0x448a9901',
    decodedParams: [
      { key: 'blockInterval', value: '489200-489206' },
      { key: 'totalReconciledInflow', value: '1,540,000,000 IDR' },
      { key: 'amilFeeRatio', value: '3.0% (Standar Hemat & Berdaya)' }
    ]
  }
];

export const initialContractSecurityAlerts: import('../types').ContractSecurityAlert[] = [
  {
    id: 'ALERT-001',
    timestamp: '2026-10-16 21:18:42',
    blockNumber: 489210,
    severity: 'CRITICAL',
    title: 'Upaya Penarikan Berulang Mencurigakan (Sybil Claim Attack)',
    message: 'Terdeteksi 5 permintaan klaim berturut-turut dalam 30 detik pada batch Sukabumi tanpa token biometrik yang sah.',
    contractName: 'IslamicZakatVaultV2.sol',
    contractAddress: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    category: 'DUPLICATE_CLAIM_ATTEMPT',
    actionSuggested: 'Circuit Breaker otomatis menolak transaksi. Saldo dana mustahiq aman 100%.',
    read: false,
    resolved: true
  },
  {
    id: 'ALERT-002',
    timestamp: '2026-10-16 20:52:10',
    blockNumber: 489209,
    severity: 'WARNING',
    title: 'Lonjakan Konsumsi Gas Eksekusi (>75.000 Gas)',
    message: 'Eksekusi fungsi yield wakaf mengalami lonjakan gas di atas ambang batas normal efisiensi.',
    contractName: 'WaqfYieldPerpetualEscrow.sol',
    contractAddress: '0x4389104A3b2A69De6Dbf7f01ED13B2108B2c8821',
    category: 'SUSPICIOUS_VELOCITY',
    actionSuggested: 'Pemeriksaan batching node relayer disarankan untuk mencegah pemborosan komputasi.',
    read: false,
    resolved: false
  },
  {
    id: 'ALERT-003',
    timestamp: '2026-10-16 19:35:00',
    blockNumber: 489208,
    severity: 'NOTICE',
    title: 'Pembaruan Parameter Timelock Syariah Diajukan',
    message: 'Dewan Pengawas DSN-MUI mengajukan penyesuaian batas haul nisab emas (Timelock 48 Jam On-Chain).',
    contractName: 'ShariaGovernanceConsensus.sol',
    contractAddress: '0x5519804A3b2A69De6Dbf7f01ED13B2108B2c1109',
    category: 'TIMELOCK_UPGRADE',
    actionSuggested: 'Status proposal terkunci hingga masa voting konsensus multi-sig selesai.',
    read: true,
    resolved: true
  }
];


