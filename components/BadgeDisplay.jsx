'use client';

import { Award, Star, Users, Crown, Trophy, Target, Zap } from 'lucide-react';

const badges = [
  { name: 'Student Tier', icon: Star, color: 'from-green-500 to-emerald-600' },
  { name: 'Family Pack', icon: Users, color: 'from-blue-500 to-cyan-600' },
  { name: 'Premium Member', icon: Crown, color: 'from-purple-500 to-pink-600' },
  { name: 'Business Elite', icon: Trophy, color: 'from-amber-500 to-orange-600' },
  { name: 'Top Referrer', icon: Target, color: 'from-red-500 to-pink-600' },
  { name: 'Top Creator', icon: Award, color: 'from-yellow-500 to-amber-600' },
  { name: 'Lifetime Referral', icon: Zap, color: 'from-indigo-500 to-purple-600' },
];

export default function BadgeDisplay({ userId }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((b, i) => {
        const Icon = b.icon;
        return (
          <div key={i} className={`bg-gradient-to-br ${b.color} rounded-xl p-4 text-center shadow-lg`}>
            <Icon className="w-8 h-8 mx-auto mb-2" />
            <div className="font-bold text-sm">{b.name}</div>
          </div>
        );
      })}
    </div>
  );
}