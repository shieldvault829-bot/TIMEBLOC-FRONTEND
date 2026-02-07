// components/SharePage.jsx
'use client';

import { useEffect, useState } from 'react';
import { 
  XMarkIcon,
  LinkIcon,
  ShareIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaTelegram,
  FaLinkedinIn,
  FaSnapchatGhost,
  FaInstagram
} from 'react-icons/fa';

const SharePage = ({ postId, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://timebloc.com/post/${postId}`;
  
  const shareLinks = [
    {
      name: 'Facebook',
      icon: FaFacebookF,
      color: 'bg-[#1877F2]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-[#1DA1F2]',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this TimeBloc capsule!`
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-[#25D366]',
      url: `https://wa.me/?text=${encodeURIComponent(`Check this out: ${shareUrl}`)}`
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-[#0088CC]',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=TimeBloc Capsule`
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      color: 'bg-[#0A66C2]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Snapchat',
      icon: FaSnapchatGhost,
      color: 'bg-[#FFFC00] text-black',
      url: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      color: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]',
      url: `instagram://`
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (url) => {
    if (url === 'instagram://') {
      alert('Open Instagram app to share');
    } else {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        
        <div className="relative bg-dark-800 rounded-3xl overflow-hidden border border-dark-700 shadow-2xl">
          
          <div className="p-6 border-b border-dark-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShareIcon className="w-8 h-8 text-primary-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Share Capsule</h2>
                  <p className="text-sm text-dark-400">Spread across the timeverse</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-dark-400" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {shareLinks.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleShare(platform.url)}
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${platform.color} animate-glow`}
                  style={{ animationDelay: `${Math.random() * 1}s` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <platform.icon className="w-8 h-8 mb-2" />
                  <span className="text-xs font-medium">{platform.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-dark-700">
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-dark-900 rounded-xl p-4 border border-dark-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <LinkIcon className="w-5 h-5 text-primary-400" />
                      <span className="text-sm text-dark-300 truncate">
                        {shareUrl}
                      </span>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        copied 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-dark-700 hover:bg-dark-600 text-dark-300'
                      }`}
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-dark-900/50 border-t border-dark-700">
            <p className="text-center text-sm text-dark-400">
              Every share helps preserve memories across time 🌌
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePage;