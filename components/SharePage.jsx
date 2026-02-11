'use client';

import { useState } from 'react';
import { X, Link, Check, Copy } from 'lucide-react';
import { 
  FaFacebook, FaTwitter, FaWhatsapp, FaTelegram, 
  FaInstagram, FaSnapchat, FaLinkedin, FaReddit,
  FaEnvelope, FaSms
} from 'react-icons/fa';

export default function SharePage({ postId, onClose }) {
  const [copied, setCopied] = useState(false);
  const url = `https://timebloc.com/post/${postId}`;

  const platforms = [
    { name: 'Facebook', icon: FaFacebook, color: 'bg-[#1877F2]', url: `https://facebook.com/sharer.php?u=${url}` },
    { name: 'Twitter', icon: FaTwitter, color: 'bg-[#1DA1F2]', url: `https://twitter.com/intent/tweet?url=${url}` },
    { name: 'WhatsApp', icon: FaWhatsapp, color: 'bg-[#25D366]', url: `https://wa.me/?text=${url}` },
    { name: 'Telegram', icon: FaTelegram, color: 'bg-[#0088CC]', url: `https://t.me/share/url?url=${url}` },
    { name: 'Instagram', icon: FaInstagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500', url: 'instagram://' },
    { name: 'Snapchat', icon: FaSnapchat, color: 'bg-[#FFFC00] text-black', url: `https://snapchat.com/scan?url=${url}` },
    { name: 'LinkedIn', icon: FaLinkedin, color: 'bg-[#0A66C2]', url: `https://linkedin.com/share?url=${url}` },
    { name: 'Reddit', icon: FaReddit, color: 'bg-[#FF4500]', url: `https://reddit.com/submit?url=${url}` },
    { name: 'Email', icon: FaEnvelope, color: 'bg-[#EA4335]', url: `mailto:?body=${url}` },
    { name: 'SMS', icon: FaSms, color: 'bg-[#34B7F1]', url: `sms:?body=${url}` },
  ];

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-dark-800 rounded-2xl max-w-2xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Share</h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {platforms.map((p) => {
            const Icon = p.icon;
            return (
              <button key={p.name} onClick={() => window.open(p.url, '_blank')} 
                className={`${p.color} p-4 rounded-xl hover:scale-105 transition`}>
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-xs">{p.name}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-dark-900 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 truncate">{url}</span>
          </div>
          <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-dark-700 rounded-lg hover:bg-dark-600">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}