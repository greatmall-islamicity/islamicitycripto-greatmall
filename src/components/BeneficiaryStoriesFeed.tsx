import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Share2, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  MapPin, 
  Calendar, 
  Award, 
  ArrowRight,
  TrendingUp,
  Coins,
  FileCheck,
  Quote,
  Eye
} from 'lucide-react';
import { BeneficiaryStory, AsnafType } from '../types';
import { initialBeneficiaryStories } from '../data/beneficiaryStoriesData';
import { formatAddress, formatIdr, playSoundCue, speakText } from '../utils/cryptoSim';

interface BeneficiaryStoriesFeedProps {
  initialTxHash?: string | null;
  onNavigateToTx: (txHash: string) => void;
  onOpenDonationModal: (campaignId?: string) => void;
}

export const BeneficiaryStoriesFeed: React.FC<BeneficiaryStoriesFeedProps> = ({
  initialTxHash,
  onNavigateToTx,
  onOpenDonationModal
}) => {
  const [stories, setStories] = useState<BeneficiaryStory[]>(initialBeneficiaryStories);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAsnaf, setSelectedAsnaf] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialTxHash || '');
  const [activeAudioStoryId, setActiveAudioStoryId] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  
  // Prayer input state
  const [prayerInputs, setPrayerInputs] = useState<Record<string, { sender: string; text: string }>>({});
  const [showPrayerFormFor, setShowPrayerFormFor] = useState<string | null>(null);

  useEffect(() => {
    if (initialTxHash) {
      setSearchQuery(initialTxHash);
      const matched = stories.find(s => s.verifiedTxHash.toLowerCase() === initialTxHash.toLowerCase());
      if (matched) {
        setTimeout(() => {
          const el = document.getElementById(`story-${matched.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [initialTxHash, stories]);

  const categories = [
    { id: 'all', label: 'Semua Bidang Dampak' },
    { id: 'Ketahanan Pangan', label: '🌾 Ketahanan Pangan' },
    { id: 'Kesehatan Dhuafa', label: '🏥 Kesehatan Dhuafa' },
    { id: 'Air Bersih & Sanitasi', label: '💧 Air Bersih & Sanitasi' },
    { id: 'Pemberdayaan Usaha Mikro', label: '📈 Pemberdayaan Usaha' }
  ];

  const asnafOptions = [
    { id: 'all', label: 'Semua Asnaf' },
    { id: 'fakir', label: 'Fakir' },
    { id: 'miskin', label: 'Miskin' },
    { id: 'ibnu_sabil', label: 'Ibnu Sabil' },
    { id: 'gharimin', label: 'Gharimin' }
  ];

  const filteredStories = stories.filter(story => {
    const matchCategory = selectedCategory === 'all' || story.category === selectedCategory;
    const matchAsnaf = selectedAsnaf === 'all' || story.asnaf === selectedAsnaf;
    if (!matchCategory || !matchAsnaf) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      story.headline.toLowerCase().includes(q) ||
      story.beneficiaryName.toLowerCase().includes(q) ||
      story.city.toLowerCase().includes(q) ||
      story.verifiedTxHash.toLowerCase().includes(q) ||
      story.campaignTitle.toLowerCase().includes(q) ||
      story.quote.toLowerCase().includes(q)
    );
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    playSoundCue('click');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleToggleAudio = (story: BeneficiaryStory) => {
    if (activeAudioStoryId === story.id) {
      window.speechSynthesis.cancel();
      setActiveAudioStoryId(null);
    } else {
      window.speechSynthesis.cancel();
      setActiveAudioStoryId(story.id);
      const textToRead = `${story.headline}. Kutipan penerima manfaat: ${story.quote}. Dampak nyata: ${story.narrativeImpact}`;
      speakText(textToRead, 'id-ID');
      playSoundCue('click');
    }
  };

  const handleSendPrayer = (storyId: string) => {
    const input = prayerInputs[storyId];
    if (!input || !input.text.trim()) return;

    playSoundCue('success');
    const newPrayer = {
      id: `p-${Date.now()}`,
      sender: input.sender.trim() || 'Hamba Allah',
      text: input.text.trim(),
      timestamp: 'Baru saja'
    };

    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return {
          ...s,
          prayerCount: s.prayerCount + 1,
          prayers: [newPrayer, ...s.prayers]
        };
      }
      return s;
    }));

    setPrayerInputs(prev => ({
      ...prev,
      [storyId]: { sender: '', text: '' }
    }));
    setShowPrayerFormFor(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Feed Hero Summary Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-emerald-900 text-white rounded-2xl p-6 md:p-8 shadow-lg border border-emerald-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feed Kisah Dampak Mustahiq (Human Impact Narratives)</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
            Melihat Dampak Nyata Zakat & Wakaf Kripto Anda
          </h2>
          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
            Setiap transaksi di blockchain bukan sekadar angka atau deretan hash kriptografi. Di baliknya ada keluarga mustahiq yang terbebas dari kelaparan, lansia yang kembali melihat, dan air bersih yang mengalir ke desa-desa kekeringan. Seluruh narasi di bawah ini terhubung langsung dengan bukti transaksi on-chain.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-800/60 text-xs">
            <div>
              <span className="text-neutral-400 block text-[11px]">Jiwa Terdampak:</span>
              <span className="text-lg font-bold text-white font-mono">22.650+ Jiwa</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Audit On-Chain:</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">100% Valid</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Rata-rata Biometrik:</span>
              <span className="text-lg font-bold text-emerald-300 font-mono">98.5% Liveness</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Doa & Pesan Kebaikan:</span>
              <span className="text-lg font-bold text-amber-300 font-mono">635+ Doa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari narasi, nama mustahiq, kota, atau TxHash..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-neutral-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
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

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Menampilkan <strong>{filteredStories.length}</strong> kisah dampak terverifikasi</span>
          </div>
        </div>

        {/* Category & Asnaf Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-100">
          <span className="text-[11px] font-bold text-neutral-500 mr-1">Bidang:</span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                playSoundCue('click');
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <span className="text-[11px] font-bold text-neutral-500 ml-2 mr-1">Asnaf:</span>
          {asnafOptions.map(asnaf => (
            <button
              key={asnaf.id}
              onClick={() => {
                playSoundCue('click');
                setSelectedAsnaf(asnaf.id);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer capitalize ${
                selectedAsnaf === asnaf.id
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {asnaf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Feed Cards */}
      <div className="space-y-6">
        {filteredStories.length === 0 ? (
          <div className="text-center py-16 bg-white border border-neutral-200 rounded-xl p-8">
            <Quote className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">Tidak ada kisah dampak yang cocok</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
              Coba atur ulang kata kunci pencarian atau bersihkan filter kategori untuk melihat semua kisah kemanusiaan terverifikasi.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedAsnaf('all');
              }}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
            >
              Tampilkan Semua Kisah
            </button>
          </div>
        ) : (
          filteredStories.map(story => {
            const isHighlighted = initialTxHash && story.verifiedTxHash.toLowerCase() === initialTxHash.toLowerCase();

            return (
              <article 
                key={story.id}
                id={`story-${story.id}`}
                className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all ${
                  isHighlighted 
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30' 
                    : 'border-neutral-200'
                }`}
              >
                {/* Highlight banner if opened directly from BlockchainExplorer */}
                {isHighlighted && (
                  <div className="bg-emerald-800 text-white text-xs px-4 py-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      Kisah Dampak Ini Terhubung Langsung dengan Transaksi yang Anda Pilih di Explorer
                    </span>
                    <span className="font-mono text-[11px] bg-emerald-900 px-2 py-0.5 rounded">
                      Blok #{story.blockNumber}
                    </span>
                  </div>
                )}

                {/* Story Header */}
                <div className="p-5 sm:p-6 pb-4 border-b border-neutral-100">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                        {story.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-700 uppercase">
                        Asnaf {story.asnaf}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {story.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>{story.date}</span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
                    {story.headline}
                  </h3>

                  <p className="text-xs text-neutral-500 mt-1">
                    Program Penyaluran: <strong className="text-neutral-800">{story.campaignTitle}</strong>
                  </p>
                </div>

                {/* Hero Quote Block */}
                <div className="bg-emerald-50/60 p-5 sm:p-6 border-b border-emerald-100/80 relative">
                  <Quote className="w-8 h-8 text-emerald-300/80 absolute top-3 left-3 -scale-x-100 pointer-events-none" />
                  <div className="relative pl-6 sm:pl-8">
                    <p className="text-xs sm:text-sm text-emerald-950 font-serif italic leading-relaxed">
                      {story.quote}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-900">
                        — {story.beneficiaryName} ({story.beneficiaryId})
                      </span>

                      {/* Text-To-Speech Audio Narration */}
                      <button
                        onClick={() => handleToggleAudio(story)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                          activeAudioStoryId === story.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title="Dengarkan narasi suara kisah ini"
                      >
                        {activeAudioStoryId === story.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Hentikan Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Dengarkan Kisah</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Narrative Details: Before / Intervention / Impact Grid */}
                <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-neutral-100 text-xs">
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                    <span className="font-bold text-neutral-700 uppercase tracking-wide text-[10px] block mb-1.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      1. Kondisi Sebelum Penyaluran
                    </span>
                    <p className="text-neutral-600 leading-relaxed">
                      {story.narrativeBefore}
                    </p>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                    <span className="font-bold text-neutral-700 uppercase tracking-wide text-[10px] block mb-1.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      2. Intervensi Bantuan Syariah
                    </span>
                    <p className="text-neutral-600 leading-relaxed">
                      {story.narrativeIntervention}
                    </p>
                  </div>

                  <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-200">
                    <span className="font-bold text-emerald-900 uppercase tracking-wide text-[10px] block mb-1.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      3. Transformasi & Dampak Riil
                    </span>
                    <p className="text-emerald-950 leading-relaxed font-medium">
                      {story.narrativeImpact}
                    </p>
                  </div>
                </div>

                {/* Verifiable Documentation Photo & Cryptographic Proof */}
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 border-b border-neutral-100">
                  {/* Photo with SHA-256 Badge */}
                  <div className="lg:col-span-5 space-y-1.5">
                    <div className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 group">
                      <img 
                        src={story.imageUrl} 
                        alt={story.imageCaption}
                        className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                        <p className="text-[10px] line-clamp-1">{story.imageCaption}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 px-1">
                      <span className="truncate max-w-[200px]">SHA-256: {story.imageHash}</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        Terotentikasi
                      </span>
                    </div>
                  </div>

                  {/* Cryptographic Link Strip */}
                  <div className="lg:col-span-7 bg-neutral-900 text-neutral-200 rounded-xl p-4 flex flex-col justify-between text-xs font-mono space-y-3">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                          <ShieldCheck className="w-4 h-4" />
                          Audit Kriptografi Transaksi On-Chain
                        </span>
                        <span className="text-neutral-400 text-[10px]">Blok #{story.blockNumber}</span>
                      </div>

                      <div className="space-y-2 mt-2.5">
                        <div>
                          <span className="text-neutral-400 text-[10px] block">Hash Transaksi (TxID):</span>
                          <div className="flex items-center justify-between gap-2 bg-neutral-800/80 p-1.5 rounded border border-neutral-700 mt-0.5">
                            <span className="text-emerald-300 truncate text-[11px] font-mono">
                              {story.verifiedTxHash}
                            </span>
                            <button
                              onClick={() => handleCopy(story.verifiedTxHash)}
                              className="text-neutral-400 hover:text-white p-1 shrink-0 cursor-pointer"
                              title="Salin Hash Transaksi"
                            >
                              {copiedHash === story.verifiedTxHash ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-neutral-400 text-[10px] block">Alokasi Bantuan:</span>
                            <span className="text-white font-bold">{formatIdr(story.aidAmountIdr)}</span>
                            <span className="text-neutral-400 text-[10px] block">({story.aidAmountCrypto})</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 text-[10px] block">Metode Validasi Biometrik:</span>
                            <span className="text-emerald-400 font-semibold">{story.biometricScore}% Skor</span>
                            <span className="text-neutral-400 text-[10px] block">{story.biometricMethod}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Direct link button to inspect transaction in BlockchainExplorer */}
                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400">Zero-Knowledge Identity Verified</span>
                      <button
                        onClick={() => {
                          playSoundCue('click');
                          onNavigateToTx(story.verifiedTxHash);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold font-sans cursor-pointer transition-colors shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspeksi di Blockchain Explorer</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Community Prayers & Action Footer */}
                <div className="p-4 sm:p-5 bg-neutral-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Prayers count and trigger */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        playSoundCue('click');
                        setShowPrayerFormFor(showPrayerFormFor === story.id ? null : story.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-700 cursor-pointer transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>{story.prayerCount} Doa Dikirimkan</span>
                    </button>

                    <button
                      onClick={() => {
                        playSoundCue('click');
                        setShowPrayerFormFor(showPrayerFormFor === story.id ? null : story.id);
                      }}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                    >
                      {showPrayerFormFor === story.id ? 'Tutup Form Doa' : '+ Kirim Doa Kebaikan'}
                    </button>
                  </div>

                  {/* Action buttons: Donate & Share */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        playSoundCue('click');
                        onOpenDonationModal(story.campaignId);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center gap-1"
                    >
                      <span>Tunaikan untuk Program Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inline Prayers Form & Prayers List */}
                {showPrayerFormFor === story.id && (
                  <div className="p-5 bg-white border-t border-neutral-200 space-y-4">
                    <div className="max-w-xl">
                      <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 mb-2">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>Kirim Doa atau Ucapan Semangat untuk {story.beneficiaryName}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Nama / Hamba Allah"
                          value={prayerInputs[story.id]?.sender || ''}
                          onChange={e => setPrayerInputs(prev => ({
                            ...prev,
                            [story.id]: {
                              sender: e.target.value,
                              text: prev[story.id]?.text || ''
                            }
                          }))}
                          className="px-3 py-1.5 border border-neutral-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                        />
                        <input
                          type="text"
                          placeholder="Tuliskan doa kebaikan Anda di sini..."
                          value={prayerInputs[story.id]?.text || ''}
                          onChange={e => setPrayerInputs(prev => ({
                            ...prev,
                            [story.id]: {
                              sender: prev[story.id]?.sender || '',
                              text: e.target.value
                            }
                          }))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSendPrayer(story.id);
                          }}
                          className="sm:col-span-2 px-3 py-1.5 border border-neutral-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                        />
                      </div>
                      <button
                        onClick={() => handleSendPrayer(story.id)}
                        disabled={!prayerInputs[story.id]?.text?.trim()}
                        className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Aamiinkan & Kirim Doa</span>
                      </button>
                    </div>

                    {/* Recent Prayers List */}
                    <div className="pt-3 border-t border-neutral-100">
                      <span className="text-[11px] font-bold text-neutral-500 block mb-2">
                        Doa & Harapan dari Sesama Muzakki:
                      </span>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {story.prayers.map(prayer => (
                          <div key={prayer.id} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-neutral-800">{prayer.sender}</span>
                              <span className="text-[10px] text-neutral-400">{prayer.timestamp}</span>
                            </div>
                            <p className="text-neutral-600 italic">"{prayer.text}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </article>
            );
          })
        )}
      </div>

    </div>
  );
};
