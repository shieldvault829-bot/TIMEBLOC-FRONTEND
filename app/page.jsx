'use client';

import Link from 'next/link';
import { Shield, Lock, Zap, Users, Star, Globe, Calendar, Award, Share2 } from 'lucide-react';
import Logo from '../components/Logo';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center mb-8">
          <Logo size={120} />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          TimeBloc
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 text-center mb-8 max-w-3xl mx-auto">
          Secure • Encrypted • Modern Digital Time Capsule Platform
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/dashboard" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold hover:opacity-90 transition">
            Get Started Free
          </Link>
          <Link href="/subscriptions" className="px-8 py-3 bg-dark-800 border border-dark-700 rounded-xl font-bold hover:bg-dark-700 transition">
            View Plans
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Feature icon={Shield} title="Military Encryption" desc="AES-256-GCM end-to-end encryption" />
          <Feature icon={Lock} title="Private Stories" desc="24-hour stories visible to followers only" />
          <Feature icon={Calendar} title="Auto-Publish" desc="Schedule posts for exact date & time" />
          <Feature icon={Award} title="7 Badges" desc="Student, Family, Premium, Elite, Referral, Creator" />
          <Feature icon={Users} title="Referral System" desc="Earn badges for referring friends" />
          <Feature icon={Share2} title="Share Everywhere" desc="Share to WhatsApp, Instagram, Facebook, Twitter" />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 hover:border-blue-500/50 transition">
      <Icon className="w-8 h-8 text-blue-400 mb-4" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}