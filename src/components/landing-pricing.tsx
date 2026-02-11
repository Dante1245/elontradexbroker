
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    frequency: '/month',
    description: 'For individuals starting their crypto journey.',
    features: [
      'Secure multi-asset wallet',
      'Instant trade execution',
      'Real-time market data',
      '0.1% transaction fee',
      '24/7 email support',
    ],
    cta: 'Get Started for Free',
    isMostPopular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    frequency: '/month',
    description: 'For active traders and crypto enthusiasts.',
    features: [
      'All features in Starter',
      'Advanced charting tools',
      'API access for bots',
      '0.05% transaction fee',
      'Priority chat support',
    ],
    cta: 'Choose Pro Plan',
    isMostPopular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    frequency: '',
    description: 'For institutions and high-volume traders.',
    features: [
      'All features in Pro',
      'Dedicated account manager',
      'Custom trading limits',
      'Volume-based fee discounts',
      'White-glove onboarding',
    ],
    cta: 'Contact Sales',
    isMostPopular: false,
  },
];

export function LandingPricing() {
  return (
    <section id="pricing" className="bg-muted/50 py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Choose the Right Plan for You
          </h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Simple, transparent pricing. No hidden fees. Ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${plan.isMostPopular ? 'border-primary shadow-2xl scale-105' : ''}`}
            >
              {plan.isMostPopular && (
                <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider text-center py-1 rounded-t-lg">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.frequency}</span>
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={plan.isMostPopular ? 'default' : 'outline'}>
                    <Link href="/signup">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
