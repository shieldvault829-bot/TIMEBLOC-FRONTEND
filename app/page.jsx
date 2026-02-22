import Link from 'next/link';
import { Shield, Lock, Zap, Users, Star, Globe, Calendar, Award, Share2, Camera, Video, Image } from 'lucide-react';
import Logo from '@/components/Logo';

export const metadata = {
  title: 'TimeBloc - Secure Digital Time Capsules',
  description: 'Military-grade encrypted social platform with stories, reels, badges, and auto-publish.',
  openGraph: {
    title: 'TimeBloc - Secure Digital Time Capsules',
    description: 'Military-grade encrypted social platform',
    images: [{ url: '/og-image.png' }],
  },
};

export default function HomePage() {
  const features = [
    { icon: Shield, title: 'Military Encryption', desc: 'AES-256-GCM end-to-end' },
    { icon: Lock, title: 'Private Stories', desc: '24h followers only' },
    { icon: Calendar, title: 'Auto-Publish', desc: 'Schedule posts' },
    { icon: Award, title: '7 Badges', desc: 'Earn achievements' },
    { icon: Users, title: 'Referral System', desc: 'Earn badges' },
    { icon: Share2, title: 'Share Everywhere', desc: '10+ platforms' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
      <div className="container mx-auto px-4 py-20 text-center">
        <Logo size={150} className="mx-auto mb-6 animate-float" />
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          TimeBloc
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Secure • Encrypted • Modern Digital Time Capsule Platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/dashboard" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:opacity-90 transition">
            Get Started Free
          </Link>
          <Link href="/subscriptions" className="px-8 py-3 bg-dark-800 border border-dark-700 rounded-xl font-bold hover:bg-dark-700 transition">
            View Plans
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-dark-800/50 rounded-2xl p-6 border border-dark-700 hover:border-blue-500/50 transition">
                <Icon className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}