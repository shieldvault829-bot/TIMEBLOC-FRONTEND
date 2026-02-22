'use client';

import { useState } from 'react';
import { Check, Star, Users, Briefcase, Zap, Shield } from 'lucide-react';
import { payment } from '@/lib/api';

const plans = [
  { id: 'free', name: 'Free', price: '$0', color: 'from-gray-500 to-gray-700', features: ['3 posts/day', 'Basic editing'] },
  { id: 'student', name: 'Student', price: '$10', color: 'from-green-500 to-emerald-600', features: ['10 posts/day', 'Advanced editing', 'Student badge'] },
  { id: 'family', name: 'Family Pack', price: '$16', color: 'from-blue-500 to-cyan-600', features: ['25 posts/day', 'Pro editing', 'Family badge'] },
  { id: 'premium', name: 'Premium', price: '$29', color: 'from-purple-500 to-pink-600', features: ['Unlimited', 'AI editing', 'Premium badge'] },
  { id: 'elite', name: 'Business Elite', price: '$50', color: 'from-amber-500 to-orange-600', features: ['Everything', '100GB', 'Elite badge'] },
];

export default function SubscriptionsPage() {
  const [selected, setSelected] = useState(null);

  const handleSubscribe = async (plan) => {
    const res = await payment.create({ plan: plan.id, amount: plan.price.replace('$', '') });
    if (res.data.payment?.invoice_url) window.open(res.data.payment.invoice_url, '_blank');
  };

  return (
    <div className="min-h-screen bg-dark-900 py-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
        <p className="text-gray-400 text-center mb-12">5 subscription tiers with exclusive features</p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-gradient-to-b ${plan.color} rounded-2xl p-6 text-center`}>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-4">{plan.price}<span className="text-sm font-normal">/mo</span></div>
              <div className="mb-6">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm mb-2"><Check className="w-4 h-4" />{f}</div>
                ))}
              </div>
              <button onClick={() => handleSubscribe(plan)} className="w-full py-3 bg-white text-black rounded-xl font-bold hover:opacity-90">
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}