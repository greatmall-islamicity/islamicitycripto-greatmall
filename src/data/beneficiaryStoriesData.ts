import { BeneficiaryStory } from '../types';

export const initialBeneficiaryStories: BeneficiaryStory[] = [
  {
    id: 'story-001',
    beneficiaryId: 'BEN-8822',
    beneficiaryName: 'Pak Ahmad Dahlan (5371****4410)',
    asnaf: 'fakir',
    city: 'Kupang, Nusa Tenggara Timur',
    campaignId: 'cmp-001',
    campaignTitle: 'Zakat Pangan Darurat & Paket Gizi Asnaf Fakir Miskin',
    date: '2026-10-15',
    headline: 'Dari Perahu Rusak Menuju Meja Makan Penuh: 1.500 Keluarga Pesisir Kupang Terselamatkan',
    quote: '"Dua bulan perahu saya bocor dan laut berangin kencang. Beras di rumah habis, kami terpaksa makan ubi liar. Saat relawan datang membawa beras dan paket gizi melalui verifikasi wajah biometrik, anak saya menangis karena malam ini bisa makan nasi pulen dan ikan teri segar."',
    narrativeBefore: 'Pak Ahmad (54 tahun) adalah nelayan tradisional di pesisir Kupang Barat. Ketika musim angin barat daya melanda, perahunya yang lapuk tidak mampu melaut selama berminggu-minggu. Kondisi ekonomi keluarga terjun bebas, hingga simpanan beras habis dan ia terpaksa berhutang ke tengkulak dengan bunga tinggi.',
    narrativeIntervention: 'Melalui smart contract Zakat Pangan Darurat, dana senilai Rp 225.000.000 dari Muzakki terverifikasi dialokasikan langsung untuk 1.500 kepala keluarga mustahiq pesisir. Penyaluran menggunakan validasi biometrik wajah offline-first untuk memastikan 0% kebocoran, tanpa perantara birokrasi berbelit.',
    narrativeImpact: 'Keluarga Pak Ahmad menerima 50 kg beras fortifikasi vitamin, 5 liter minyak goreng, abon ikan bernutrisi, serta subsidi peralatan jaring ikan tangkap. Kini keluarganya memiliki pasokan pangan aman untuk 3 bulan ke depan dan perahunya telah diperbaiki secara gotong royong.',
    aidAmountIdr: 225000000,
    aidAmountCrypto: '14,400 USDT',
    verifiedTxHash: '0x1290f841cba09148102938102938102938102938102938102938102938102922',
    blockNumber: 489208,
    smartContractAddress: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    zkProofHash: 'zk-snark-0x9910f88127394c810293810293810293810293844',
    biometricScore: 98.7,
    biometricMethod: 'FaceBiometric (Liveness Detection)',
    category: 'Ketahanan Pangan',
    imageUrl: '/src/assets/images/zakat_food_distribution_1792212214956.jpg',
    imageCaption: 'Pak Ahmad Dahlan menerima pasokan paket pangan bergizi terverifikasi biometrik di posko pesisir Kupang.',
    imageHash: '0x9fa1c74291e0a811234bce90812349018e219ba48810c9201bc998',
    prayerCount: 142,
    prayers: [
      {
        id: 'p-1',
        sender: 'Muzakki Hamba Allah',
        text: 'Semoga berkah melimpah untuk Pak Ahmad sekeluarga, diberikan kesehatan dan laut yang tenang.',
        timestamp: '1 jam lalu'
      },
      {
        id: 'p-2',
        sender: 'dr. Farhan Syahputra',
        text: 'Alhamdulillah, bahagia melihat zakat kita benar-benar sampai ke saudara kita di NTT tanpa potongan sesenpun.',
        timestamp: '3 jam lalu'
      },
      {
        id: 'p-3',
        sender: 'Nurul Hidayah',
        text: 'Aamiin ya Rabbal alamin. Semoga anak-anak beliau tumbuh sehat dan cerdas.',
        timestamp: '5 jam lalu'
      }
    ],
    tags: ['Zakat Pangan', 'Asnaf Fakir', 'Kupang NTT', 'Biometrik Terverifikasi', 'Ketahanan Pangan']
  },
  {
    id: 'story-002',
    beneficiaryId: 'BEN-8821',
    beneficiaryName: 'Ibu Siti Aminah (3202****9012)',
    asnaf: 'miskin',
    city: 'Sukabumi, Jawa Barat',
    campaignId: 'cmp-001',
    campaignTitle: 'Zakat Pangan Darurat & Paket Gizi Asnaf Fakir Miskin',
    date: '2026-10-14',
    headline: 'Janda Tiga Anak Membuka Warung Berkah: Transformasi Dari Penerima Zakat Menjadi Calon Muzakki',
    quote: '"Sejak suami meninggal 2 tahun lalu karena sakit, saya menjahit baju sobek tetangga dengan upah Rp 15.000 sehari. Berkat amanah zakat ini, selain anak-anak tidak kelaparan lagi, modal etalase warung sembako kecil saya akhirnya terwujud. Insya Allah tahun depan saya yang akan berzakat."',
    narrativeBefore: 'Ibu Siti Aminah (39 tahun) membesarkan 3 anak yang masih sekolah di desa pelosok Sukabumi. Pendapatan harian tidak menentu sering membuat anak tertuanya terancam putus sekolah dari bangku SMP karena menunggak iuran buku dan transportasi.',
    narrativeIntervention: 'Penyaluran zakat produktif terverifikasi blockchain sebesar Rp 4.500.000 beserta paket pangan logistik keluarga diserahkan setelah sistem audit kecerdasan buatan dan pengawas syariah memvalidasi kelayakan Asnaf Miskin.',
    narrativeImpact: 'Kini Bu Siti memiliki warung kelontong kecil di teras rumahnya yang menjual telur, minyak, bumbu dapur, dan pulsa listrik. Omzet hariannya mencapai Rp 250.000 dengan laba bersih stabil untuk menyekolahkan ketiga buah hatinya.',
    aidAmountIdr: 5000000,
    aidAmountCrypto: '320.5 USDT',
    verifiedTxHash: '0x7f9a8123cba09148102938102938102938102938102938102938102938102938',
    blockNumber: 489210,
    smartContractAddress: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    zkProofHash: 'zk-snark-0x8924a77192834bce90812349018e219ba48810c9201bc',
    biometricScore: 99.4,
    biometricMethod: 'FaceBiometric + NID Card Hash',
    category: 'Pemberdayaan Usaha Mikro',
    imageUrl: '/src/assets/images/zakat_food_distribution_1792212214956.jpg',
    imageCaption: 'Ibu Siti Aminah di depan etalase sembako barunya bersama paket bantuan pangan darurat.',
    imageHash: '0x882310fa90811234bce90812349018e219ba48810c9201bc998a1',
    prayerCount: 98,
    prayers: [
      {
        id: 'p-4',
        sender: 'Ahmad Fauzi (Muzakki Jakarta)',
        text: 'Masya Allah Bu Siti, semoga warungnya semakin berkah, laris manis, dan anak-anak jadi anak yang sholeh.',
        timestamp: '4 jam lalu'
      },
      {
        id: 'p-5',
        sender: 'Keluarga Rahardjo',
        text: 'Semoga Allah permudah jalan Bu Siti untuk menjadi muzakki berdaya berikutnya.',
        timestamp: '1 hari lalu'
      }
    ],
    tags: ['Zakat Maal', 'Pemberdayaan Wanita', 'Sukabumi', 'Asnaf Miskin', 'Kemandirian Ekonomi']
  },
  {
    id: 'story-003',
    beneficiaryId: 'BEN-8825',
    beneficiaryName: 'Kakek Marzuki (5203****1890)',
    asnaf: 'miskin',
    city: 'Lombok Timur, NTB',
    campaignId: 'cmp-002',
    campaignTitle: 'Wakaf Produktif Klinik Mata & Pusat Diagnostik Komunitas',
    date: '2026-10-10',
    headline: 'Cahaya Kembali Setelah 5 Tahun Gelap: Operasi Katarak Gratis Berkat Wakaf Produktif Abadi',
    quote: '"Lima tahun mata kanan dan kiri saya tertutup kabut katarak tebal, sampai wajah cucu sendiri tidak bisa saya lihat. Ketika perban dibuka di klinik wakaf syariah ini, yang pertama kali saya cari adalah mushaf Al-Qur\'an tua saya. Air mata saya tumpah, huruf Arab itu kini terbaca terang benderang kembali."',
    narrativeBefore: 'Kakek Marzuki (68 tahun) adalah buruh tani kelapa yang terpaksa berhenti bekerja karena kebutaan katarak bilateral. Biaya operasi di rumah sakit kota mencapai belasan juta rupiah—nominal yang mustahil dijangkau oleh lansia dhuafa di desanya.',
    narrativeIntervention: 'Melalui aset wakaf produktif terverifikasi BWI seluas 2.500 m2 yang dilengkapi mesin phacoemulsification tenaga surya, smart contract secara otomatis mendanai operasi katarak lengkap beserta obat dan kacamata pemulihan.',
    narrativeImpact: 'Penglihatan Kakek Marzuki pulih 90%. Beliau kini kembali aktif mengajar mengaji anak-anak di surau desa dan berjalan ke masjid tanpa perlu dituntun lagi.',
    aidAmountIdr: 25000000,
    aidAmountCrypto: '1,600 USDT',
    verifiedTxHash: '0x3bb19024cba09148102938102938102938102938102938102938102938102911',
    blockNumber: 489209,
    smartContractAddress: '0x4389104A3b2A69De6Dbf7f01ED13B2108B2c8821',
    zkProofHash: 'zk-snark-0x4381a998124810293810293810293810293810293811',
    biometricScore: 98.2,
    biometricMethod: 'Biometric Iris & Facial Matching',
    category: 'Kesehatan Dhuafa',
    imageUrl: '/src/assets/images/waqf_hospital_clinic_1792212213611.jpg',
    imageCaption: 'Kakek Marzuki tersenyum haru memegang mushaf Al-Qur\'an pasca operasi katarak di Klinik Wakaf Lombok.',
    imageHash: '0x448a90182312b84918237410928301984019283019283019283',
    prayerCount: 215,
    prayers: [
      {
        id: 'p-6',
        sender: 'H. Bambang S.',
        text: 'Pahala jariyah yang tidak pernah terputus bagi seluruh wakif. Selamat membaca Al-Qur\'an kembali Kek Marzuki.',
        timestamp: '30 menit lalu'
      },
      {
        id: 'p-7',
        sender: 'Relawan Medis BAZNAS',
        text: 'Kesehatan lansia adalah prioritas kami. Transparansi blockchain membuat setiap donatur bisa melihat senyum ini langsung.',
        timestamp: '2 jam lalu'
      }
    ],
    tags: ['Wakaf Produktif', 'Kesehatan Lansia', 'Katarak Gratis', 'Lombok Timur', 'Amal Jariyah']
  },
  {
    id: 'story-004',
    beneficiaryId: 'BEN-8824',
    beneficiaryName: 'Ibu Fatimah Az-Zahra (3311****2291)',
    asnaf: 'ibnu_sabil',
    city: 'Gunung Kidul, D.I. Yogyakarta',
    campaignId: 'cmp-003',
    campaignTitle: 'Wakaf Sumur Bor Tenaga Surya & Filtrasi Air Bersih',
    date: '2026-10-12',
    headline: 'Akhir Penantian Kekeringan 30 Tahun: Air Sebening Kaca Memancar di Bukit Karst',
    quote: '"Sejak saya kecil, ibu saya bangun jam 3 pagi menuruni tebing curam 4 kilometer memikul jerigen air kapur keruh. Sekarang, cukup putar keran di depan mushaf dusun, air pegunungan dingin dan higienis langsung mengalir deras. Tidak ada lagi anak-anak yang sakit diare."',
    narrativeBefore: 'Dusun Karangrejek di perbukitan karst Gunung Kidul mengalami krisis air kronis setiap kemarau 8 bulan. Warga miskin harus menyisihkan Rp 350.000 per bulan hanya untuk membeli tangki air swasta berbau kaporit.',
    narrativeIntervention: 'Pembangunan sumur bor akuifer dalam 120 meter dengan sistem pompa celup submersible bertenaga surya fotovoltaik 15.000 Watt dan filtrasi 4 tahap membran reverse-osmosis.',
    narrativeImpact: '5.200 warga desa kini menikmati air bersih layak minum gratis yang dialirkan ke 12 titik hidran umum dan mushola desa. Pengeluaran warga terpangkas signifikan, dialihkan untuk pendidikan anak.',
    aidAmountIdr: 1000000,
    aidAmountCrypto: '64.1 USDT',
    verifiedTxHash: '0x55018a12cba09148102938102938102938102938102938102938102938102933',
    blockNumber: 489207,
    smartContractAddress: '0x1102914A3b2A69De6Dbf7f01ED13B2108B2c9911',
    zkProofHash: 'zk-snark-0x1102b11928301928301928301928301928301928388',
    biometricScore: 97.9,
    biometricMethod: 'NID Card Cryptographic Hash',
    category: 'Air Bersih & Sanitasi',
    imageUrl: '/src/assets/images/waqf_water_well_1792212214536.jpg',
    imageCaption: 'Warga Dusun Karangrejek bersyukur saat air bersih pertama kali mengalir dari sumur bor wakaf bertenaga surya.',
    imageHash: '0x772091238910481029380129380192830192830192830192830',
    prayerCount: 180,
    prayers: [
      {
        id: 'p-8',
        sender: 'Ustadz Sulaiman',
        text: '"Sebaik-baik sedekah adalah memberi air minum" (HR. Abu Dawud). Semoga mengalir pahalanya sampai akhirat.',
        timestamp: '6 jam lalu'
      }
    ],
    tags: ['Wakaf Air Bersih', 'Gunung Kidul', 'Energi Surya', 'Sanitasi Berkelanjutan', 'Ibnu Sabil']
  }
];
