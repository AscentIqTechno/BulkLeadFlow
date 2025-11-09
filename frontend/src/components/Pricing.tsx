import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: { monthly: string; annual: string };
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Free Trial',
    price: { monthly: '$0', annual: '$0' },
    description: 'Try ReachIQ free for 15 days — no credit card required.',
    features: [
      'Full platform access for 15 days',
      'Basic AI insights',
      'Community support',
    ],
    buttonText: 'Start Free Trial',
  },
  {
    name: 'Basic',
    price: { monthly: '$5', annual: '$48' },
    description: 'Perfect for individuals starting their AI-powered trading journey.',
    features: [
      'Unlimited access after trial',
      'Core analytics tools',
      'Standard AI insights',
      'Email support',
    ],
    buttonText: 'Get Basic Plan',
  },
  {
    name: 'Premium',
    price: { monthly: '$25', annual: '$240' },
    description: 'Unlock the full power of ReachIQ with premium analytics and insights.',
    features: [
      'Everything in Basic',
      'Advanced analytics dashboard',
      'Unlimited AI insights',
      'Priority support',
      'Early access to new features',
    ],
    highlighted: true,
    buttonText: 'Go Premium',
  },
];

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="pricing" className="py-24 bg-[#12141C]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Start free and upgrade anytime. Choose the plan that fits your needs with full transparency.
          </p>

          {/* Toggle Button */}
          <div className="inline-flex p-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
            <button
              className={`px-4 py-2 rounded-full transition-colors ${
                billingCycle === 'monthly' ? 'bg-crypto-purple text-white' : 'text-gray-400'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-colors ${
                billingCycle === 'annual' ? 'bg-crypto-purple text-white' : 'text-gray-400'
              }`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual <span className="text-xs font-medium ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white/5 backdrop-blur-sm border rounded-xl overflow-hidden ${
                plan.highlighted
                  ? 'border-crypto-purple relative shadow-xl shadow-crypto-purple/10'
                  : 'border-white/10'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-crypto-purple text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-semibold mb-2 text-white">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    {billingCycle === 'monthly' ? plan.price.monthly : plan.price.annual}
                  </span>
                  <span className="text-gray-400 ml-1">
                    {plan.price.monthly !== '$0' ? '/month' : ''}
                  </span>
                </div>
                <p className="text-gray-400 mb-6">{plan.description}</p>

                <Button
                  className={`w-full mb-6 ${
                    plan.highlighted
                      ? 'bg-crypto-purple hover:bg-crypto-dark-purple'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {plan.buttonText}
                </Button>

                <div>
                  <p className="text-sm font-medium text-gray-300 mb-4">What’s included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-crypto-purple mr-3 shrink-0" />
                        <span className="text-gray-400 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
