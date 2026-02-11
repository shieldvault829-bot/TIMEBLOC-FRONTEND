'use client';

import { useState } from 'react';
import { Check, Star, Users, Briefcase, Zap, Shield } from 'lucide-react';

const SubscriptionsPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      color: 'from-gray-500 to-gray-700',
      features: [
        '3 daily posts',
        'Basic editing tools',
        '500MB storage',
        'Community support',
        'Ad-supported'
      ],
      limitations: [
        'No auto-publish',
        'Limited badges',
        'No premium frames',
        'Watermarked exports'
      ]
    },
    {
      id: 'student',
      name: 'Student',
      price: '$10',
      period: 'per month',
      color: 'from-green-500 to-emerald-600',
      badge: 'Most Popular',
      features: [
        '10 daily posts',
        'Advanced editing',
        '5GB storage',
        'Priority support',
        'Ad-free experience',
        'Basic auto-publish',
        'Student badge'
      ]
    },
    {
      id: 'family',
      name: 'Family Pack',
      price: '$16',
      period: 'per month',
      color: 'from-blue-500 to-cyan-600',
      features: [
        '25 daily posts',
        'Pro editing suite',
        '20GB shared storage',
        'Up to 5 family members',
        'Family badge',
        'Advanced auto-publish',
        'Premium support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$29',
      period: 'per month',
      color: 'from-purple-500 to-pink-600',
      features: [
        'Unlimited posts',
        'AI editing tools',
        '50GB storage',
        'Premium badge',
        'Scheduled auto-publish',
        'Advanced analytics',
        'Dedicated support'
      ]
    },
    {
      id: 'elite',
      name: 'Business Elite',
      price: '$50',
      period: 'per month',
      color: 'from-amber-500 to-orange-600',
      features: [
        'Everything in Premium',
        '100GB storage',
        'Team collaboration',
        'Elite badge',
        'Custom branding',
        'API access',
        '24/7 phone support',
        'Account manager'
      ]
    }
  ];

  const handleSubscribe = async (planId) => {
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          amount: plans.find(p => p.id === planId)?.price.replace('$', ''),
          currency: 'USD'
        })
      });
      
      const data = await response.json();
      
      if (data.payment?.invoice_url) {
        window.open(data.payment.invoice_url, '_blank');
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include military-grade encryption and 24/7 security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
                selectedPlan === plan.id
                  ? 'border-white shadow-2xl'
                  : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                    {plan.badge}
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                  {plan.id === 'free' && <Star className="w-8 h-8" />}
                  {plan.id === 'student' && <Zap className="w-8 h-8" />}
                  {plan.id === 'family' && <Users className="w-8 h-8" />}
                  {plan.id === 'premium' && <Shield className="w-8 h-8" />}
                  {plan.id === 'elite' && <Briefcase className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-1">{plan.price}</div>
                <div className="text-gray-400">{plan.period}</div>
              </div>

              <div className="mb-8">
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {plan.limitations && (
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <div className="text-gray-500 text-sm mb-2">Limitations:</div>
                    <div className="space-y-2">
                      {plan.limitations.map((limit, idx) => (
                        <div key={idx} className="flex items-center text-gray-500">
                          <div className="w-5 h-5 mr-3 flex-shrink-0">•</div>
                          <span className="text-sm">{limit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.id === 'free'
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : `bg-gradient-to-r ${plan.color} hover:opacity-90`
                }`}
              >
                {plan.id === 'free' ? 'Get Started' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-6 text-gray-400 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Cancel anytime
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              30-day money back guarantee
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Military-grade encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;