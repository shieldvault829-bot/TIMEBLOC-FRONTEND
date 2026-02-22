'use client';

import { useState } from 'react';
import { X, Link, Copy, Check } from 'lucide-react';
import { FaFacebook, FaTwitter, FaWhatsapp, FaTelegram, FaInstagram, FaSnapchat, FaLinkedin, FaReddit, FaEnvelope, FaSms } from 'react-icons/fa';

const platforms = [
  { icon: FaFacebook, name: 'Facebook', color: 'bg-[#1877F2]' },
  { icon: FaTwitter, name: 'Twitter', color: 'bg-[#1DA1F2]' },
  { icon: FaWhatsapp, name: 'WhatsApp', color: 'bg-[#25D366]' },
  { icon: FaTelegram, name: 'Telegram', color: 'bg-[#0088CC]' },
  { icon: FaInstagram, name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { icon: FaSnapchat, name: 'Snapchat', color: 'bg-[#FFFC00] text-black' },
  { icon: FaLinkedin, name: 'LinkedIn', color: 'bg-[#0A66C2]' },
  { icon: FaReddit, name: 'Reddit', color: 'bg-[#FF4500]' },
  { icon: FaEnvelope, name: 'Email', color: 'bg-[#EA4335]' },
  { icon: FaSms, name: 'SMS', color: 'bg-[#34B7F1]' },
];

export default function SharePage({ postId, onClose }) {
  const [copied, setCopied] = useState(false);
  const url = `https://timebloc.vercel.app/post/${postId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-dark-800 rounded-2xl max-w-2xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Share</h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {platforms.map((p, i) => {
            const Icon = p.icon;
            return (
              <button key={i} className={`${p.color} p-4 rounded-xl hover:scale-105 transition`}>
                <Icon className="w-6 h-6 mx-auto mb-1" />
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
          <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-dark-700 rounded-lg">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}