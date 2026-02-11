'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  Zap, 
  Users, 
  Star, 
  Globe,
  Share2,
  Calendar,
  Image as ImageIcon,
  Video,
  FileText
} from 'lucide-react';
import Logo from '@/components/Logo';

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  const features = [
    { icon: Shield, title: 'Military Encryption', desc: 'AES-256-GCM end-to-end' },
    { icon: Lock, title: 'Private Stories', desc: 'Only visible to followers' },
    { icon: Zap, title: 'Auto-Publish', desc: 'Schedule posts in advance' },
    { icon: Users, title: 'Referral System', desc: 'Earn badges & rewards' },
    { icon: Star, title: 'Premium Badges', desc: '7 unique achievement badges' },
    { icon: Globe, title: 'Global CDN', desc: 'Fast content delivery' },
  ];

  const subscriptionPlans = [
    { name: 'Free', price: '$0', color: 'from-gray-500 to-gray-700' },
    { name: 'Student', price: '$10', color: 'from-green-500 to-emerald-600' },
    { name: 'Family', price: '$16', color: 'from-blue-500 to-cyan-600' },
    { name: 'Premium', price: '$29', color: 'from-purple-500 to-pink-600' },
    { name: 'Elite', price: '$50', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-purple-900/20 to-dark-800 py-20 px-4">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative container mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Logo size={120} />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            TimeBloc
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Secure • Encrypted • Modern Digital Time Capsule Platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              Get Started Free
            </Link>
            <Link 
              href="/subscriptions" 
              className="px-8 py-3 bg-dark-800 border border-dark-700 rounded-xl font-bold hover:bg-dark-700 transition-all"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-dark-800">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-dark-900 rounded-2xl p-6 border border-dark-700 hover:border-blue-500/50 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            5 subscription tiers with auto-publish, badges, and exclusive features
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {subscriptionPlans.map((plan, idx) => (
              <div key={idx} className={`bg-gradient-to-b ${plan.color} rounded-2xl p-6 text-center`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4">{plan.price}</div>
                <Link 
                  href={`/subscriptions?plan=${plan.name.toLowerCase()}`}
                  className="block w-full py-3 bg-white text-black rounded-xl font-bold hover:opacity-90"
                >
                  Select
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Secure Your Memories?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust TimeBloc with military-grade encryption
          </p>
          <Link 
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg hover:opacity-90"
          >
            <Star className="w-5 h-5" />
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}