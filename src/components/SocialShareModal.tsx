import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Send, 
  QrCode, 
  ShieldCheck 
} from 'lucide-react';
import { Campaign } from '../types';
import { playSoundCue } from '../utils/cryptoSim';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  campaign
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !campaign) return null;

  const appUrl = window.location.href;
  const shareText = `Salurkan Zakat & Wakaf Transparan via Blockchain di Islamicity Cripto: "${campaign.title}". Tervalidasi amanah & biometrik. ${appUrl}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(appUrl);

  const shareLinks = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodedText}`,
      bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodedText}`,
      bg: 'bg-neutral-900 hover:bg-neutral-800 text-white',
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(campaign.title)}`,
      bg: 'bg-sky-500 hover:bg-sky-600 text-white',
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bg: 'bg-blue-700 hover:bg-blue-800 text-white',
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}`);
    setCopied(true);
    playSoundCue('click');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="bg-white rounded-xl max-w-md w-full border border-neutral-200 shadow-2xl p-6 text-neutral-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Share2 className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-sm font-bold text-neutral-900">
                Bagikan Kampanye Kebaikan
              </h2>
              <p className="text-[11px] text-neutral-500">Ajak kerabat berpartisipasi dalam filantropi terpercaya</p>
            </div>
          </div>
          <button
            onClick={() => {
              playSoundCue('click');
              onClose();
            }}
            aria-label="Tutup Berbagi"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campaign Mini Preview */}
        <div className="my-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center gap-3">
          <img 
            src={campaign.image} 
            alt={campaign.title} 
            className="w-14 h-14 rounded-md object-cover shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">
              {campaign.category.replace('_', ' ')}
            </span>
            <p className="text-xs font-semibold text-neutral-900 truncate">
              {campaign.title}
            </p>
            <p className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">
              Smart Contract: {campaign.smartContractAddress.substring(0, 10)}...
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2 my-4">
          {shareLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSoundCue('click')}
              className={`p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${link.bg}`}
            >
              <span>{link.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link Input */}
        <div className="pt-2 border-t border-neutral-100">
          <span className="text-xs font-medium text-neutral-600 block mb-1">
            Salin Tautan Terverifikasi Blockchain:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-md text-xs font-mono text-neutral-700 truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
