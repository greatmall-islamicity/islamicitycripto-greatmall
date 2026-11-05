import { CurriculumModule } from '../types';

export const curriculumModules: CurriculumModule[] = [
  {
    id: 'MOD-01',
    order: 1,
    level: 'DASAR',
    title: 'Konsep Harta (Māl) dan Uang (Tsaman) dalam Islam vs Kripto',
    titleEn: 'The Concept of Wealth (Māl) & Money (Tsaman) in Islamic Jurisprudence vs Crypto',
    durationMinutes: 25,
    summary: 'Memahami kriteria sah suatu aset digital agar diakui sebagai Māl Mutaqawwam (harta bernilai menurut syariat) dan bukan ilusi spekulasi.',
    dalilReference: 'QS. Al-Baqarah: 188 & QS. An-Nisa: 29 ("Janganlah kamu memakan harta sesamamu dengan jalan yang batil...")',
    fatwaReference: 'Ijtima Ulama Komisi Fatwa se-Indonesia VII Tahun 2021 & AAOIFI Sharia Standard No. 59',
    learningPoints: [
      'Kriteria Māl dalam fiqh: memiliki nilai guna riil (manfa’ah), halal dimanfaatkan, dan dapat disimpan/dikuasai (tamalluk).',
      'Perbedaan Kripto sebagai Komoditas (Sil’ah) beragun aset riil vs Kripto tanpa underlying bernilai.',
      'Konsep Tsaman (alat tukar): uang dalam Islam bukanlah komoditas yang diperjualbelikan dengan bunga, melainkan ukuran nilai (mi’yar al-qimah).',
      'Syarat sah akad serah terima (Taqabudh) secara kontemporer melalui finalitas blok ledger blockchain.'
    ],
    caseStudy: {
      scenario: 'Seorang muzakki ingin menyumbangkan Bitcoin dan USDT yang diperoleh dari hasil kerja lepas (freelance programming) internasional.',
      fiqhVerdict: 'HALAL',
      verdictExplanation: 'Diperbolehkan dan sah karena aset kripto tersebut diperoleh dari kompensasi jasa nyata (Ijarah) yang halal, memiliki nilai likuid riil, dan tidak mengandung unsur penipuan.'
    },
    quizQuestions: [
      {
        question: 'Menurut kaidah fiqh muamalah, apakah syarat utama suatu aset digital agar sah disebut sebagai Māl Mutaqawwam?',
        options: [
          'Memiliki grafik kenaikan harga tercepat di bursa',
          'Memiliki manfaat riil yang mubah (halal) dan dapat disimpan atau dikuasai secara sah',
          'Diciptakan secara anonim tanpa identitas developer',
          'Menggunakan algoritma konsensus Proof of Work saja'
        ],
        correctIndex: 1,
        explanation: 'Dalam fiqh, harta yang sah (Mutaqawwam) harus memiliki manfaat riil yang diperbolehkan syariat dan dapat dimiliki/diserahterimakan secara adil.'
      },
      {
        question: 'Bagaimana status serah terima (Taqabudh) aset kripto terdesentralisasi dalam transaksi pembayaran syariah?',
        options: [
          'Tidak sah karena tidak berbentuk kertas fisik',
          'Sah secara hukmi (Taqabudh Hukmi) setelah transaksi terkonfirmasi oleh konsensus blok blockchain',
          'Harus menunggu surat tertulis dari kantor pos',
          'Hanya sah jika disaksikan oleh pejabat bank konvensional'
        ],
        correctIndex: 1,
        explanation: 'Ulama kontemporer (termasuk AAOIFI dan DSN-MUI) mengakui Taqabudh Hukmi melalui perpindahan saldo digital dan konfirmasi on-chain yang tidak dapat dibatalkan.'
      }
    ]
  },
  {
    id: 'MOD-02',
    order: 2,
    level: 'DASAR',
    title: 'Tiga Jebakan Fiqh: Mengapa Riba, Gharar, dan Maysir Diharamkan dalam Kripto',
    titleEn: 'The Three Fiqh Prohibitions: Riba, Gharar, and Maysir in Digital Assets',
    durationMinutes: 35,
    summary: 'Bedah tuntas mekanisme keuangan kripto yang melanggar syariat: bunga pinjaman DeFi, koin meme spekulasi judi, dan ketidakpastian ekstrem.',
    dalilReference: 'Hadits Riwayat Muslim No. 1513 ("Rasulullah SAW melarang jual beli al-hashah dan jual beli gharar") & QS. Al-Baqarah: 275',
    fatwaReference: 'Fatwa DSN-MUI No. 116/DSN-MUI/IX/2017 & Keputusan Majma Al-Fiqh Al-Islami OKI No. 63 (1/7)',
    learningPoints: [
      'Riba dalam Kripto: Protokol peminjaman DeFi yang menjanjikan APY/bunga pasti dari modal pinjaman (Riba Qardh).',
      'Gharar (Ketidakpastian Berlebihan): Token kripto tanpa dokumen teknis (whitepaper), tanpa utilitas, atau skema "rug-pull".',
      'Maysir (Perjudian): Praktik trading leverage 50x-100x dan binary options kripto yang mengandalkan untung-untungan spekulatif semata.',
      'Perbedaan antara Risiko Bisnis Alami (Ghurm) yang halal dengan Risiko Judi (Maysir) yang haram.'
    ],
    caseStudy: {
      scenario: 'Aplikasi menawarkan staking dengan janji imbal hasil tetap 36% per tahun dari kumpulan pinjaman pengguna lain berbunga.',
      fiqhVerdict: 'HARAM',
      verdictExplanation: 'Termasuk Riba Nasi’ah dan Riba Qardh yang diharamkan secara tegas karena menjamin keuntungan tetap atas pinjaman uang berbunga tanpa akad mudharabah/musyarakah riil.'
    },
    quizQuestions: [
      {
        question: 'Manakah di antara praktik berikut yang secara tegas dilarang karena mengandung unsur Maysir (perjudian)?',
        options: [
          'Membeli token emas fisik PAXG untuk lindung nilai inflasi',
          'Trading futures kripto dengan leverage 100x menebak pergerakan harga 1 menit tanpa aset dasar',
          'Membayar zakat maal menggunakan stablecoin USDT beragun cadangan kas',
          'Menyimpan aset kripto dalam dompet perangkat keras (cold storage)'
        ],
        correctIndex: 1,
        explanation: 'Trading spekulatif leverage ekstrem tanpa kepemilikan aset riil mengalihkan transaksi dari investasi produktif menjadi taruhan judi (maysir).'
      }
    ]
  },
  {
    id: 'MOD-03',
    order: 3,
    level: 'MENENGAH',
    title: 'Fatwa Otoritas Syariah: DSN-MUI, BWI, dan Standar Global AAOIFI',
    titleEn: 'Sharia Authority Rulings: DSN-MUI, BWI, and AAOIFI Global Framework',
    durationMinutes: 30,
    summary: 'Kompilasi panduan regulasi resmi Dewan Syariah Nasional, Badan Wakaf Indonesia, dan badan syariah internasional terhadap aset digital.',
    dalilReference: 'Kaidah Fiqhiyyah: "Al-Ashlu fil mu’amalati al-ibahah hatta yadulla ad-dalilu ‘ala tahrimiha" (Hukum asal muamalah adalah boleh sampai ada dalil yang mengharamkannya)',
    fatwaReference: 'Fatwa MUI 2021, DSN-MUI No. 140/DSN-MUI/VIII/2021, & BWI Peraturan No. 1 Tahun 2020 tentang Wakaf Uang',
    learningPoints: [
      'Posisi MUI: Kripto sebagai mata uang haram di Indonesia karena melanggar UU Mata Uang (Rupiah satu-satunya alat tukar sah), namun komoditas digital beragun aset halal memenuhi syarat sil’ah.',
      'Standar AAOIFI No. 59: Tokenisasi aset riil (Real World Asset / RWA) seperti sukuk digital dan properti adalah instrumen syariah unggulan.',
      'Fatwa Badan Wakaf Indonesia (BWI): Wakaf uang digital sah selama pokok wakaf abadi dilindungi dan tidak mengalami penurunan nilai pokok (anti-diminution).'
    ],
    caseStudy: {
      scenario: 'Penerbitan Sukuk Wakaf Digital di atas blockchain untuk membiayai klinik mata gratis kaum dhuafa bersertifikat BWI.',
      fiqhVerdict: 'HALAL',
      verdictExplanation: 'Sangat dianjurkan karena merupakan pemanfaatan teknologi blockchain untuk transparansi kebajikan (birr) dan pelestarian maslahat publik.'
    },
    quizQuestions: [
      {
        question: 'Berdasarkan regulasi di Indonesia dan fatwa DSN-MUI, bagaimanakah kedudukan aset kripto?',
        options: [
          'Boleh menggantikan Rupiah sebagai mata uang resmi pasar',
          'Haram secara mutlak dalam segala bentuk tanpa pengecualian',
          'Tidak boleh sebagai alat tukar resmi negara, namun sah sebagai komoditas aset digital jika memiliki underlying riil dan utilitas jelas',
          'Wajib dimiliki oleh seluruh lembaga perbankan tanpa syarat'
        ],
        correctIndex: 2,
        explanation: 'Regulasi Indonesia menetapkan Rupiah sebagai satu-satunya mata uang sah, sementara aset kripto berizin Bappebti dapat diperdagangkan sebagai komoditas digital halal bila memenuhi syarat syariah.'
      }
    ]
  },
  {
    id: 'MOD-04',
    order: 4,
    level: 'MENENGAH',
    title: 'Fiqh Zakat Kripto: Penentuan Nisab 85 Gram Emas, Haul, dan Perhitungan',
    titleEn: 'Zakat on Crypto Assets: Calculating the 85g Gold Nisab, Haul, and Rate',
    durationMinutes: 40,
    summary: 'Metode syariah praktis menghitung kewajiban zakat 2.5% atas portofolio aset kripto dan penyalurannya ke 8 Asnaf secara tepat sasaran.',
    dalilReference: 'QS. At-Taubah: 103 ("Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka") & Hadits Nisab Emas 20 Dinar',
    fatwaReference: 'Keputusan BAZNAS No. 1 Tahun 2026 & Fatwa Ulama Zakat Kontemporer',
    learningPoints: [
      'Nisab Zakat Kripto: Diqiyaskan (dianalogikan) dengan zakat emas/perak (85 gram emas murni = ~Rp 123.250.000).',
      'Syarat Haul: Kepemilikan aset kripto telah berlalu masa 1 tahun hijriyah/masehi di atas batas nisab.',
      'Klasifikasi Portofolio: Kripto simpanan jangka panjang (diambil 2.5% dari total nilai pasar) vs Kripto perniagaan aktif (dihitung dari modal + laba bersih).',
      'Mengapa penyaluran zakat wajib prioritaskan Fakir dan Miskin dengan verifikasi biometrik penerima.'
    ],
    caseStudy: {
      scenario: 'Seorang investor memiliki saldo kripto stabil (USDT & ETH) senilai Rp 200.000.000 yang tersimpan selama 14 bulan tanpa terpakai.',
      fiqhVerdict: 'HALAL',
      verdictExplanation: 'Wajib mengeluarkan zakat sebesar 2,5% yaitu Rp 5.000.000 (atau ~320.5 USDT) karena telah melampaui nisab 85 gr emas dan memenuhi syarat haul 1 tahun.'
    },
    quizQuestions: [
      {
        question: 'Berapakah nisab yang digunakan oleh para fuqaha kontemporer untuk zakat aset simpanan kripto?',
        options: [
          'Setara 5 ekor unta',
          'Setara 85 gram emas murni (sekitar Rp 123 Juta)',
          'Setara 1.000 token koin meme',
          'Tidak ada nisab, bebas berapapun'
        ],
        correctIndex: 1,
        explanation: 'Aset simpanan moneter digital diqiyaskan dengan emas seberat 85 gram dengan tarif kewajiban 2.5% setelah genap haul 1 tahun.'
      }
    ]
  },
  {
    id: 'MOD-05',
    order: 5,
    level: 'LANJUTAN',
    title: 'Wakaf Produktif Uang Digital dan Pelestarian Pokok Aset',
    titleEn: 'Productive Waqf via Digital Assets & The Inalienability Principle',
    durationMinutes: 30,
    summary: 'Bagaimana blockchain menjamin pokok wakaf abadi (tidak boleh berkurang atau dijual) dan hanya menyalurkan surplus manfaat ke umat.',
    dalilReference: 'Hadits Riwayat Bukhari No. 2772 (Pesan Rasulullah kepada Umar bin Khattab ra: "Tahanlah pokoknya dan sedekahkanlah buah/hasilnya")',
    fatwaReference: 'Fatwa Komisi Fatwa MUI Tahun 2002 tentang Wakaf Uang & Keputusan BWI',
    learningPoints: [
      'Prinsip Keabadian Pokok (*Habsul Ashl*): Pokok wakaf tidak boleh dihibahkan, diwariskan, atau diperjualbelikan.',
      'Pemanfaatan Smart Contract Time-Lock untuk mencegah penarikan pokok wakaf secara permanen.',
      'Model Wakaf Produktif: Pokok diinvestasikan pada aset berisiko rendah (sukuk/klinik/sumur air), dividennya dibagikan gratis untuk mustahiq.',
      'Akuntabilitas Nadzir: Pelaporan on-chain transparan bagi donatur wakaf (Waqif).'
    ],
    caseStudy: {
      scenario: 'Komunitas mengumpulkan wakaf kripto untuk membangun sumur bor tenaga surya di NTT, dengan pokok dana dikunci permanen pada smart contract.',
      fiqhVerdict: 'HALAL',
      verdictExplanation: 'Sangat sah dan merupakan wujud nyata wakaf produktif modern yang mengalirkan pahala jariyah abadi bagi seluruh pewakaf.'
    },
    quizQuestions: [
      {
        question: 'Apakah prinsip paling mendasar dalam hukum wakaf syariah yang ditegakkan melalui smart contract Islamicity?',
        options: [
          'Pokok wakaf boleh dibagikan habis kepada amil',
          'Pokok wakaf harus ditahan (abadi/tidak boleh berkurang) dan hanya surplus manfaatnya yang disalurkan',
          'Wakaf harus ditarik kembali setelah 3 bulan',
          'Wakaf wajib dipinjamkan dengan bunga tinggi'
        ],
        correctIndex: 1,
        explanation: 'Kaidah pokok wakaf adalah "Tahan pokoknya, sedekahkan hasilnya". Smart contract memastikan pokok wakaf terkunci secara kekal.'
      }
    ]
  },
  {
    id: 'MOD-06',
    order: 6,
    level: 'AMIL_SPESIALIS',
    title: 'Smart Contract sebagai Akad Syariah Digital & Anti-Penipuan (AI Shield)',
    titleEn: 'Smart Contracts as Digital Sharia Covenants & AI Anti-Fraud Shield',
    durationMinutes: 45,
    summary: 'Teknis tata kelola smart contract terdesentralisasi, multi-sig dewan pengawas, serta perlindungan deteksi penipuan berbasis kecerdasan buatan.',
    dalilReference: 'QS. Al-Maidah: 1 ("Wahai orang-orang yang beriman! Penuhilah janji-janji/akad-akad itu...")',
    fatwaReference: 'Standar Tata Kelola Lembaga Keuangan Islam (AAOIFI Governance Standard No. 11)',
    learningPoints: [
      'Smart Contract sebagai manifestasi akad digital: Ijab dan Qabul terekam dalam fungsi kode yang deterministik dan transparan.',
      'Multi-Signature Dewan Pengawas: Pengeluaran dana di atas pagu memerlukan persetujuan konsensus komite syariah independen.',
      'Sistem Deteksi Penipuan AI: Mendeteksi anomali duplikasi klaim bantuan, geolokasi mencurigakan, dan manipulasi kwitansi vendor.',
      'Audit Biometrik Wajah & Enkripsi Zero-Knowledge: Menjaga kehormatan dhuafa sekaligus memastikan akurasi distribusi hak zakat.'
    ],
    caseStudy: {
      scenario: 'Terjadi upaya penarikan berulang tanpa verifikasi biometrik yang langsung digagalkan oleh sensor AI Circuit Breaker dalam 2 detik.',
      fiqhVerdict: 'HALAL',
      verdictExplanation: 'Tindakan pengamanan ini wajib (Hifzhul Maal) demi melindungi hak asnaf fakir miskin dari pencurian atau penyelewengan dana umat.'
    },
    quizQuestions: [
      {
        question: 'Bagaimana peran AI Anti-Fraud Shield dan verifikasi biometrik dalam menjaga integritas zakat menurut Maqashid Syariah?',
        options: [
          'Hanya sebagai aksesoris tampilan pemasaran',
          'Menegakkan perlindungan harta (Hifzhul Maal) dan memastikan amanah tersalurkan tepat kepada mereka yang benar-benar berhak',
          'Menghilangkan peran ulama dan dewan pengawas',
          'Memperlambat proses penyaluran bantuan hingga berbulan-bulan'
        ],
        correctIndex: 1,
        explanation: 'Teknologi AI dan biometrik adalah sarana (wasilah) untuk mewujudkan tujuan syariat menjaga amanah harta kaum dhuafa agar terhindar dari manipulasi.'
      }
    ]
  }
];

export interface ShariaTokenCheckItem {
  id: string;
  name: string;
  symbol: string;
  category: string;
  verdict: 'HALAL' | 'HARAM' | 'SYUBHAT';
  score: number;
  underlyingAsset: string;
  reasons: string[];
  fatwaReference: string;
  recommendation: string;
}

export const shariaTokenDatabase: ShariaTokenCheckItem[] = [
  {
    id: 'tok-paxg',
    name: 'Pax Gold',
    symbol: 'PAXG',
    category: 'Asset-Backed Token (Emas Riil)',
    verdict: 'HALAL',
    score: 98,
    underlyingAsset: '1 Troy Ounce Emas London Good Delivery Bar 99.99% di Brinks Vault',
    reasons: [
      'Memiliki underlying emas fisik 1:1 yang diaudit berkala oleh akuntan publik independen.',
      'Bebas dari riba dan spekulasi kosong, dapat ditebus (redeemable) menjadi emas fisik.',
      'Sesuai Fatwa Emas DSN-MUI No. 77/DSN-MUI/V/2010 tentang Jual Beli Emas Tunai.'
    ],
    fatwaReference: 'DSN-MUI Fatwa Emas & Sharia Review Board Standard No. 59',
    recommendation: 'Sangat direkomendasikan untuk simpanan halal, lindung nilai, dan pembayaran zakat maal.'
  },
  {
    id: 'tok-islm',
    name: 'Islamic Coin',
    symbol: 'ISLM',
    category: 'Sharia Utility Blockchain Token',
    verdict: 'HALAL',
    score: 94,
    underlyingAsset: 'Haqq Network Sharia-Compliant Proof-of-Stake Blockchain Utility',
    reasons: [
      'Memiliki Dewan Pengawas Syariah resmi (Sharia Oracle) yang mengaudit smart contract.',
      'Mengalokasikan 10% dari setiap emisi koin ke Evergreen DAO untuk filantropi Islam dan komunitas.',
      'Mekanisme konsensus bebas bunga dan tidak melibatkan perjudian.'
    ],
    fatwaReference: 'Haqq Sharia Board Fatwa (Disahkan oleh Ulama Terkemuka Timur Tengah)',
    recommendation: 'Halal digunakan untuk biaya komputasi transaksi dan partisipasi ekosistem syariah.'
  },
  {
    id: 'tok-meme',
    name: 'Speculative Meme Tokens',
    symbol: 'MEME / PEPE / DOGE',
    category: 'Unbacked Speculative Token',
    verdict: 'HARAM',
    score: 12,
    underlyingAsset: 'Tidak ada underlying (Murni spekulasi tren media sosial)',
    reasons: [
      'Mengandung Gharar Fakhisy (ketidakpastian ekstrem tanpa utilitas bisnis riil).',
      'Mengarah pada Maysir (perjudian mencari keuntungan dari kerugian pembeli berikutnya / Greater Fool Theory).',
      'Tingginya manipulasi pasar pump-and-dump yang merugikan masyarakat awam.'
    ],
    fatwaReference: 'Keputusan Ijtima Ulama Komisi Fatwa MUI VII Tahun 2021',
    recommendation: 'Diharamkan untuk diperjualbelikan atau dijadikan sarana investasi syariah.'
  },
  {
    id: 'tok-defi-lending',
    name: 'Interest-Bearing DeFi Yield Tokens',
    symbol: 'cUSDC / aDAI',
    category: 'DeFi Lending & Yield Protocol',
    verdict: 'HARAM',
    score: 18,
    underlyingAsset: 'Kumpulan Pinjaman Pengguna Lain Berbunga Bunga Tetap',
    reasons: [
      'Mengandung Riba Qardh (keuntungan tetap yang dipersyaratkan atas pinjaman uang).',
      'Meminjamkan modal dengan pengenaan bunga likuidasi otomatis yang menindas peminjam.',
      'Bukan akad kemitraan bagi hasil (mudharabah/musyarakah) yang adil.'
    ],
    fatwaReference: 'Fatwa DSN-MUI tentang Bunga Bank & Pelarangan Riba Al-Qur’an Surah Al-Baqarah: 275',
    recommendation: 'Tinggalkan protokol berbunga; beralih ke Qardhul Hasan atau Sukuk Wakaf Produktif.'
  },
  {
    id: 'tok-sukuk-realestate',
    name: 'Tokenized Sukuk Real Estate',
    symbol: 'SUKUK-RE',
    category: 'Asset-Backed Digital Sukuk',
    verdict: 'HALAL',
    score: 96,
    underlyingAsset: 'Kepemilikan Sah Aset Properti & Rumah Sakit Bersertifikat',
    reasons: [
      'Berdasarkan akad Ijarah (sewa-menyewa) atau Musyarakah Mutanaqisah yang sah.',
      'Imbal hasil berasal dari uang sewa riil penyewa properti, bukan bunga pinjaman.',
      'Dilindungi secara hukum dengan sertifikat hak tanggungan resmi.'
    ],
    fatwaReference: 'Fatwa DSN-MUI No. 137/DSN-MUI/IX/2020 tentang Sukuk',
    recommendation: 'Instrumen investasi syariah unggulan untuk wakaf uang dan dana abadi filantropi.'
  }
];
