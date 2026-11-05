import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Award, 
  Search, 
  ArrowRight, 
  Volume2, 
  Lock, 
  Download, 
  Printer, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  X, 
  Coins, 
  Scale, 
  AlertTriangle,
  Calculator,
  Copy,
  Share2
} from 'lucide-react';
import { CurriculumModule, Language } from '../types';
import { curriculumModules, shariaTokenDatabase, ShariaTokenCheckItem } from '../data/curriculumData';
import { playSoundCue, speakText, sha256 } from '../utils/cryptoSim';

interface CurriculumViewProps {
  lang: Language;
  onOpenZakatCalc: () => void;
  onOpenDonationModal: () => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  lang,
  onOpenZakatCalc,
  onOpenDonationModal
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'checker' | 'quiz'>('modules');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<CurriculumModule | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>(['MOD-01', 'MOD-02']);
  const [moduleSearchQuery, setModuleSearchQuery] = useState<string>('');
  
  // Token Checker state
  const [selectedTokenId, setSelectedTokenId] = useState<string>(shariaTokenDatabase[0].id);
  const [tokenSearchQuery, setTokenSearchQuery] = useState<string>('');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [certificateHash, setCertificateHash] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Hamba Allah');
  const [certificateCopied, setCertificateCopied] = useState<boolean>(false);

  const filteredTokens = shariaTokenDatabase.filter(tok => {
    if (!tokenSearchQuery.trim()) return true;
    const q = tokenSearchQuery.toLowerCase().trim();
    return (
      tok.name.toLowerCase().includes(q) ||
      tok.symbol.toLowerCase().includes(q) ||
      tok.category.toLowerCase().includes(q) ||
      tok.verdict.toLowerCase().includes(q)
    );
  });

  const selectedToken = shariaTokenDatabase.find(t => t.id === selectedTokenId) || filteredTokens[0] || shariaTokenDatabase[0];

  const filteredModules = curriculumModules.filter(m => {
    const matchesLevel = selectedLevel === 'all' || m.level === selectedLevel;
    if (!matchesLevel) return false;
    if (!moduleSearchQuery.trim()) return true;
    const q = moduleSearchQuery.toLowerCase().trim();
    return (
      m.title.toLowerCase().includes(q) ||
      m.summary.toLowerCase().includes(q) ||
      m.dalilReference.toLowerCase().includes(q) ||
      m.fatwaReference.toLowerCase().includes(q) ||
      m.learningPoints.some(p => p.toLowerCase().includes(q))
    );
  });

  const handleDownloadSyllabus = () => {
    playSoundCue('click');
    const header = `# SILABUS AKADEMI & KURIKULUM KRIPTO SYARIAH
Platform: Islamicity Cripto (Standar DSN-MUI & AAOIFI No. 59)
Tanggal Unduh: ${new Date().toLocaleDateString('id-ID')}
Total Modul: ${curriculumModules.length}

============================================================\n\n`;

    const body = curriculumModules.map(m => `MODUL ${m.order} [TINGKAT: ${m.level}]
Judul: ${m.title}
Durasi: ${m.durationMinutes} Menit
Ringkasan: ${m.summary}
Dalil Rujukan: ${m.dalilReference}
Fatwa Terkait: ${m.fatwaReference}
Pokok Pembelajaran:
${m.learningPoints.map((p, idx) => `  ${idx + 1}. ${p}`).join('\n')}
Studi Kasus: "${m.caseStudy.scenario}"
Keputusan Fiqh: ${m.caseStudy.fiqhVerdict}
Penjelasan: ${m.caseStudy.verdictExplanation}
------------------------------------------------------------\n`).join('\n');

    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Silabus_Kurikulum_Kripto_Syariah_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    playSoundCue('success');
  };

  const progressPercent = Math.round((completedModules.length / curriculumModules.length) * 100);

  const handleToggleComplete = (modId: string) => {
    playSoundCue('success');
    if (completedModules.includes(modId)) {
      setCompletedModules(prev => prev.filter(id => id !== modId));
    } else {
      setCompletedModules(prev => [...prev, modId]);
    }
  };

  // 5 Quiz Questions collected across modules
  const quizList = [
    {
      q: 'Apakah syarat utama agar suatu aset kripto diakui sebagai Māl Mutaqawwam (harta bernilai sah menurut syariat)?',
      opts: [
        'Harganya harus naik lebih dari 100% per minggu',
        'Memiliki manfaat riil yang mubah (halal) dan dapat disimpan atau dikuasai secara sah',
        'Diciptakan oleh komunitas tanpa izin otoritas',
        'Hanya diterbitkan melalui mekanisme penambangan Proof of Work'
      ],
      correct: 1,
      exp: 'Kaidah Fiqh menetapkan bahwa harta yang sah harus memiliki manfaat riil yang diperbolehkan syariat dan dapat dimiliki/diserahterimakan secara adil.'
    },
    {
      q: 'Mengapa trading kripto dengan leverage 50x-100x tanpa kepemilikan aset riil diharamkan dalam Islam?',
      opts: [
        'Karena membutuhkan koneksi internet cepat',
        'Karena mengandung unsur Maysir (perjudian untung-untungan spekulatif murni) dan Gharar fakhisy',
        'Karena hanya boleh dilakukan pada hari Jumat',
        'Karena tidak menggunakan Rupiah fisik'
      ],
      correct: 1,
      exp: 'Trading spekulatif leverage ekstrem tanpa aset dasar mengalihkan aktivitas dari investasi produktif menjadi perjudian (maysir) terlarang.'
    },
    {
      q: 'Berapakah nisab yang digunakan oleh para ulama kontemporer untuk zakat simpanan aset kripto?',
      opts: [
        'Setara 5 ekor kambing',
        'Setara 85 gram emas murni (~Rp 123 Juta) dengan haul 1 tahun dan kadar 2.5%',
        'Setara 1.000 token koin meme',
        'Tidak ada nisab, bebas berapapun nominalnya'
      ],
      correct: 1,
      exp: 'Aset simpanan moneter digital diqiyaskan dengan emas seberat 85 gram dengan kewajiban zakat 2.5% setelah genap haul 1 tahun.'
    },
    {
      q: 'Apakah prinsip hukum wakaf paling mendasar yang ditegakkan melalui smart contract abadi Islamicity?',
      opts: [
        'Pokok wakaf boleh dihabiskan untuk biaya pesta amil',
        'Pokok wakaf harus ditahan (abadi/tidak boleh berkurang/dijual) dan hanya surplus manfaatnya yang dialirkan ke mustahiq',
        'Wakaf harus ditarik kembali oleh pewakaf setelah 30 hari',
        'Pokok wakaf wajib dipinjamkan dengan bunga tinggi'
      ],
      correct: 1,
      exp: 'Hadits Nabi SAW menegaskan "Tahan pokoknya, sedekahkan hasilnya". Smart contract mengunci pokok wakaf secara permanen.'
    },
    {
      q: 'Bagaimana peran AI Anti-Fraud Shield dan verifikasi biometrik wajah dalam tata kelola zakat syariah?',
      opts: [
        'Sebagai formalitas teknis tanpa dampak nyata',
        'Menegakkan maqashid syariah Hifzhul Maal (menjaga harta) agar dana zakat tidak dicuri atau diduplikasi oleh pihak yang tidak berhak',
        'Menghapuskan fungsi komite syariah independen',
        'Memperpanjang proses penyaluran hingga bertahun-tahun'
      ],
      correct: 1,
      exp: 'AI dan biometrik adalah sarana wasilah untuk memastikan amanah mustahiq terlindungi dari manipulasi dan tepat sasaran.'
    }
  ];

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    playSoundCue('click');
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleEvaluateQuiz = async () => {
    playSoundCue('success');
    setQuizSubmitted(true);

    let correctCount = 0;
    quizList.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correctCount++;
    });

    const finalScore = Math.round((correctCount / quizList.length) * 100);

    if (finalScore >= 80) {
      const generatedHash = await sha256(`CERT-SHARIA-${userName}-${Date.now()}`);
      setCertificateHash(generatedHash);
      speakText(`Selamat, Anda lulus kuis literasi kripto syariah dengan skor ${finalScore}. Sertifikat digital Anda telah diterbitkan.`, 'id-ID');
    } else {
      speakText(`Skor Anda ${finalScore}. Silakan pelajari kembali modul kurikulum untuk mengulang kuis.`, 'id-ID');
    }
  };

  const scoreCount = quizList.reduce((acc, q, idx) => (quizAnswers[idx] === q.correct ? acc + 1 : acc), 0);
  const quizScore = Math.round((scoreCount / quizList.length) * 100);

  return (
    <div className="space-y-6">
      
      {/* Top Hero Banner */}
      <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Akademi & Kurikulum Fiqh Muamalah Kripto</span>
              <span className="text-neutral-300" aria-hidden="true">·</span>
              <span className="text-neutral-500 font-mono">Standar DSN-MUI & AAOIFI No. 59</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Kurikulum Literasi Kripto Syariah & Tata Kelola Zakat Wakaf
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Panduan edukasi komprehensif untuk memahami batasan halal-haram aset digital, menghindari jebakan riba dan spekulasi maysir, serta menunaikan zakat dan wakaf modern berbasis blockchain dengan penuh keyakinan.
            </p>
          </div>

          {/* Progress & Certification Badge */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 sm:p-5 w-full lg:w-80 shrink-0">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="font-semibold text-neutral-800">Progres Belajar Anda:</span>
              <span className="font-mono font-bold text-emerald-800">{completedModules.length} / {curriculumModules.length} Modul ({progressPercent}%)</span>
            </div>

            <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden mb-3">
              <div 
                className="bg-emerald-700 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-200">
              <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                Sertifikasi On-Chain
              </span>
              <button
                onClick={() => {
                  playSoundCue('click');
                  setActiveTab('quiz');
                }}
                className="text-neutral-700 hover:text-neutral-900 font-medium underline cursor-pointer"
              >
                Ikuti Kuis Kelulusan
              </button>
            </div>
          </div>
        </div>

        {/* Tab Sub-Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg mt-6 text-xs font-medium max-w-xl">
          <button
            onClick={() => {
              playSoundCue('click');
              setActiveTab('modules');
            }}
            className={`flex-1 py-2 text-center rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'modules' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Silabus & Modul Fiqh</span>
          </button>

          <button
            onClick={() => {
              playSoundCue('click');
              setActiveTab('checker');
            }}
            className={`flex-1 py-2 text-center rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'checker' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Uji Kepatuhan Syariah Token</span>
          </button>

          <button
            onClick={() => {
              playSoundCue('click');
              setActiveTab('quiz');
            }}
            className={`flex-1 py-2 text-center rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'quiz' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Kuis & Sertifikat Digital</span>
          </button>
        </div>
      </section>

      {/* TAB 1: Silabus & Modul Pembelajaran */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          
          {/* Level Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Daftar Modul Silabus Terstruktur
              </h2>
              <p className="text-xs text-neutral-500">
                Pilih modul untuk mempelajari landasan fiqh, dalil, dan studi kasus praktis
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'Semua Tingkat' },
                { id: 'DASAR', label: 'Dasar (Pemula)' },
                { id: 'MENENGAH', label: 'Menengah (Zakat & Fatwa)' },
                { id: 'LANJUTAN', label: 'Lanjutan (Wakaf Abadi)' },
                { id: 'AMIL_SPESIALIS', label: 'Spesialis Amil & AI' },
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => {
                    playSoundCue('click');
                    setSelectedLevel(lvl.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    selectedLevel === lvl.id
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-neutral-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={moduleSearchQuery}
                onChange={e => setModuleSearchQuery(e.target.value)}
                placeholder="Cari topik modul fiqh (contoh: emas, nisab, zakat, riba, smart contract, wakaf)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
              {moduleSearchQuery && (
                <button
                  onClick={() => setModuleSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDownloadSyllabus}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Unduh seluruh silabus dan referensi dalil ke dokumen teks offline"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Unduh Silabus Lengkap (TXT)</span>
              </button>
            </div>
          </div>

          {/* Module Cards Grid */}
          {filteredModules.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-neutral-200 text-neutral-500 text-xs space-y-2">
              <BookOpen className="w-8 h-8 text-neutral-300 mx-auto" />
              <p className="font-semibold text-neutral-800">Tidak ada modul yang sesuai pencarian &ldquo;{moduleSearchQuery}&rdquo;</p>
              <button
                onClick={() => {
                  setModuleSearchQuery('');
                  setSelectedLevel('all');
                }}
                className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
              >
                Reset Pencarian & Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredModules.map(mod => {
              const isCompleted = completedModules.includes(mod.id);

              return (
                <div
                  key={mod.id}
                  className="bg-white border border-neutral-200 hover:border-emerald-600 rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 uppercase">
                        {mod.level} · {mod.durationMinutes} Menit
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selesai
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400 font-mono">Belum Diambil</span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                      {mod.title}
                    </h3>

                    <p className="mt-2 text-xs text-neutral-600 leading-relaxed line-clamp-3">
                      {mod.summary}
                    </p>

                    <div className="mt-3 p-2.5 bg-neutral-50 rounded border border-neutral-100 text-[11px] space-y-1">
                      <p className="text-neutral-700 font-medium truncate">
                        <strong>Dalil:</strong> {mod.dalilReference}
                      </p>
                      <p className="text-neutral-500 font-mono text-[10px] truncate">
                        {mod.fatwaReference}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        playSoundCue('click');
                        handleToggleComplete(mod.id);
                      }}
                      className="text-xs text-neutral-600 hover:text-neutral-900 font-medium cursor-pointer"
                    >
                      {isCompleted ? 'Batal Selesai' : 'Tandai Selesai'}
                    </button>

                    <button
                      onClick={() => {
                        playSoundCue('click');
                        setSelectedModule(mod);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>Pelajari Modul</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}

        </div>
      )}

      {/* TAB 2: Simulator Uji Kepatuhan Syariah Token (Token Checker) */}
      {activeTab === 'checker' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-700" />
                <span>Simulator Uji Kepatuhan Syariah Aset & Protokol Kripto</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Evaluasi kepatuhan fiqh muamalah berdasarkan keberadaan underlying asset, ketiadaan unsur riba, dan risiko gharar spekulatif
              </p>
            </div>

            {/* Token Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tokenSearchQuery}
                onChange={e => setTokenSearchQuery(e.target.value)}
                placeholder="Cari token atau simbol (mis. PAXG, ISLM)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Token Selector Chips */}
          <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-neutral-100">
            {filteredTokens.length === 0 ? (
              <p className="text-xs text-neutral-500 py-1">Tidak ada token yang cocok dengan &ldquo;{tokenSearchQuery}&rdquo;</p>
            ) : (
              filteredTokens.map(tok => (
              <button
                key={tok.id}
                onClick={() => {
                  playSoundCue('click');
                  setSelectedTokenId(tok.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedTokenId === tok.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <span>{tok.name}</span>
                <span className="font-mono text-[10px] opacity-80">({tok.symbol})</span>
              </button>
            ))
            )}
          </div>

          {/* Detailed Fiqh Analysis Card */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase">{selectedToken.category}</span>
                <h3 className="text-lg font-extrabold text-neutral-900">{selectedToken.name} ({selectedToken.symbol})</h3>
              </div>

              {/* Verdict Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  selectedToken.verdict === 'HALAL'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : selectedToken.verdict === 'HARAM'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {selectedToken.verdict === 'HALAL' ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>KEPUTUSAN FIQH: {selectedToken.verdict}</span>
                </span>
                <span className="font-mono text-xs font-bold text-neutral-600 bg-white px-2.5 py-1 rounded border border-neutral-200">
                  Skor: {selectedToken.score}/100
                </span>
              </div>
            </div>

            {/* Underlying Asset Breakdown */}
            <div className="text-xs space-y-2">
              <div>
                <span className="font-semibold text-neutral-700 block mb-0.5">Aset Pendukung (Underlying Asset / Utilitas):</span>
                <p className="font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200 text-neutral-800">
                  {selectedToken.underlyingAsset}
                </p>
              </div>

              <div>
                <span className="font-semibold text-neutral-700 block mb-1">Pertimbangan Dalil & Kaidah Fiqh:</span>
                <ul className="space-y-1.5">
                  {selectedToken.reasons.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded border border-neutral-100 text-[11px] text-neutral-700">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white rounded border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-0.5">Rujukan Fatwa:</span>
                  <p className="text-[11px] font-medium text-neutral-800">{selectedToken.fatwaReference}</p>
                </div>
                <div className="p-3 bg-white rounded border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-0.5">Rekomendasi Praktis:</span>
                  <p className="text-[11px] font-medium text-emerald-800">{selectedToken.recommendation}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: Kuis & Sertifikat Digital */}
      {activeTab === 'quiz' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <span>Uji Kompetensi & Sertifikasi Literasi Kripto Syariah</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Jawab 5 pertanyaan studi kasus praktis untuk membuktikan pemahaman fiqh muamalah digital Anda
              </p>
            </div>

            {/* User name input for certificate */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-600 font-medium whitespace-nowrap">Nama Anda:</span>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="Nama untuk Sertifikat"
                className="px-3 py-1.5 border border-neutral-300 rounded-md text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-4">
            {quizList.map((item, qIdx) => {
              const selectedOpt = quizAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === item.correct;

              return (
                <div key={qIdx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                      {qIdx + 1}. {item.q}
                    </span>
                    {quizSubmitted && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? 'Benar (+20)' : 'Kurang Tepat'}
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.opts.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                        className={`text-left p-3 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                          selectedOpt === optIdx
                            ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedOpt === optIdx && <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0 ml-2" />}
                      </button>
                    ))}
                  </div>

                  {/* Explanation after submit */}
                  {quizSubmitted && (
                    <div className="p-2.5 bg-white rounded border border-neutral-200 text-[11px] text-neutral-600">
                      <strong>Penjelasan Fiqh:</strong> {item.exp}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Evaluate Action */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-neutral-500">
              {Object.keys(quizAnswers).length} dari {quizList.length} soal terjawab
            </span>

            <button
              onClick={handleEvaluateQuiz}
              disabled={Object.keys(quizAnswers).length < quizList.length}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-300 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Evaluasi Jawaban & Terbitkan Sertifikat</span>
            </button>
          </div>

          {/* Certificate Result Modal / Card */}
          {quizSubmitted && quizScore >= 80 && certificateHash && (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-neutral-950 text-white border border-emerald-700/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <span className="font-bold text-sm tracking-wide uppercase text-emerald-300">
                      Sertifikat Kelulusan Literasi Kripto Syariah
                    </span>
                    <p className="text-[10px] text-neutral-400">Islamicity Crypto Academic Council · Terakreditasi On-Chain</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-700">
                  SKOR: {quizScore}/100 (LULUS)
                </span>
              </div>

              <div className="text-center py-4 space-y-1">
                <span className="text-xs text-neutral-400 uppercase tracking-widest block">Diberikan kepada:</span>
                <h3 className="text-2xl font-bold text-white tracking-tight">{userName}</h3>
                <p className="text-xs text-emerald-200 max-w-lg mx-auto mt-2 leading-relaxed">
                  Telah berhasil menyelesaikan kurikulum Fiqh Muamalah Kontemporer, memahami kaidah penghindaran riba & gharar, serta kompeten dalam tata kelola Zakat & Wakaf Kripto berbasis blockchain.
                </p>
              </div>

              <div className="p-3 bg-neutral-900/80 rounded-lg border border-emerald-800/80 font-mono text-[10px] space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Hash Kredensial On-Chain (SHA-256):</span>
                  <span className="text-emerald-400">VERIFIED VALID</span>
                </div>
                <p className="text-emerald-300 truncate">{certificateHash}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-neutral-400 font-mono">
                  Tanggal Terbit: {new Date().toISOString().split('T')[0]}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`Sertifikat Literasi Kripto Syariah: ${userName} | On-Chain Hash: ${certificateHash}`);
                      setCertificateCopied(true);
                      playSoundCue('click');
                      setTimeout(() => setCertificateCopied(false), 2500);
                    }}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{certificateCopied ? 'Tersalin!' : 'Salin Hash'}</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Alhamdulillah, saya (${userName}) telah lulus Uji Kompetensi Literasi Kripto Syariah di Islamicity Cripto dengan skor ${quizScore}/100. Kredensial On-Chain: ${certificateHash}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playSoundCue('click')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Bagikan WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      playSoundCue('click');
                      window.print();
                    }}
                    className="px-3 py-1.5 bg-white text-neutral-900 hover:bg-neutral-100 rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Module Reader Modal */}
      {selectedModule && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-2xl w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900 text-xs max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-3 border-b border-neutral-200 gap-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-emerald-800 uppercase">
                  {selectedModule.level} · MODUL {selectedModule.order}
                </span>
                <h3 className="text-base font-bold text-neutral-900 mt-1">
                  {selectedModule.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedModule(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              
              {/* Dalil & Fatwa Box */}
              <div className="p-3.5 bg-emerald-50/70 rounded-lg border border-emerald-200 space-y-2">
                <div>
                  <span className="font-bold text-emerald-950 block mb-0.5">📖 Landasan Dalil Al-Qur&apos;an / Hadits:</span>
                  <p className="text-emerald-900 leading-relaxed font-sans">{selectedModule.dalilReference}</p>
                </div>
                <div className="pt-2 border-t border-emerald-200/80">
                  <span className="font-bold text-emerald-950 block mb-0.5">📜 Rujukan Fatwa Ulama:</span>
                  <p className="text-emerald-800 font-mono text-[11px]">{selectedModule.fatwaReference}</p>
                </div>
              </div>

              {/* Learning Points */}
              <div>
                <span className="font-bold text-neutral-900 block mb-2 text-xs">
                  Pokok Bahasan Fiqh Muamalah:
                </span>
                <ul className="space-y-2">
                  {selectedModule.learningPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-neutral-700 leading-relaxed bg-neutral-50 p-2.5 rounded border border-neutral-100">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center shrink-0 font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Case Study */}
              <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">Studi Kasus Praktis:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedModule.caseStudy.fiqhVerdict === 'HALAL' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Keputusan Fiqh: {selectedModule.caseStudy.fiqhVerdict}
                  </span>
                </div>
                <p className="text-neutral-700 italic leading-relaxed">
                  &ldquo;{selectedModule.caseStudy.scenario}&rdquo;
                </p>
                <p className="text-neutral-600 text-[11px] pt-1 border-t border-neutral-200">
                  <strong>Penjelasan Hukum:</strong> {selectedModule.caseStudy.verdictExplanation}
                </p>
              </div>

            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-200">
              <button
                onClick={() => {
                  playSoundCue('voice');
                  speakText(`${selectedModule.title}. ${selectedModule.summary}. ${selectedModule.dalilReference}`, 'id-ID');
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-semibold text-xs cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>Bacakan Audio (TTS)</span>
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                {selectedModule.title.toLowerCase().includes('zakat') && (
                  <button
                    onClick={() => {
                      setSelectedModule(null);
                      playSoundCue('click');
                      onOpenZakatCalc();
                    }}
                    className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold rounded-md text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Hitung Zakat Sekarang</span>
                  </button>
                )}

                {selectedModule.title.toLowerCase().includes('wakaf') && (
                  <button
                    onClick={() => {
                      setSelectedModule(null);
                      playSoundCue('click');
                      onOpenDonationModal();
                    }}
                    className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold rounded-md text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Coins className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Salurkan Wakaf</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    handleToggleComplete(selectedModule.id);
                    setSelectedModule(null);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-md text-xs cursor-pointer"
                >
                  {completedModules.includes(selectedModule.id) ? 'Tutup' : 'Tandai Selesai & Tutup'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
