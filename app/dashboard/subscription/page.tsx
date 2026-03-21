'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockVendors } from '@/lib/mock-data'
import { Check, Star, Zap, Crown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Get started with basic features',
    features: [
      'Listed on vendors page',
      'Basic profile page',
      'Up to 4 photos in gallery',
      'WhatsApp contact button',
      'Limited visibility',
    ],
    notIncluded: [
      'Homepage featured listing',
      'Featured badge',
      'Priority in search results',
      'Analytics dashboard',
      'Unlimited photos',
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 999,
    period: 'month',
    description: 'Best for growing businesses',
    features: [
      'Everything in Free, plus:',
      'Featured on homepage',
      'Featured badge on profile',
      'Priority in search results',
      'Full analytics dashboard',
      'Unlimited gallery photos',
      'Instagram & call buttons',
      'Premium support',
    ],
    popular: true,
  },
  {
    id: 'annual',
    name: 'Premium Annual',
    price: 9999,
    period: 'year',
    description: 'Save 17% with annual billing',
    features: [
      'All Premium features',
      '2 months free',
      'Priority customer support',
      'Early access to new features',
      'Custom profile branding',
    ],
    popular: false,
  },
]

export default function SubscriptionPage() {
  // TODO: Get actual subscription status from Supabase
  const vendorData = mockVendors[0]
  const currentPlan = vendorData.isPremium ? 'premium' : 'free'
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    if (planId === currentPlan) return
    
    setIsLoading(planId)
    
    // TODO: Integrate Stripe or Polar for payments
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('Redirecting to payment...')
    setIsLoading(null)
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Upgrade Your Plan
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Get more visibility and reach more couples planning their perfect wedding
          </p>
        </div>

        {/* Current Plan Banner */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-full">
                {currentPlan === 'premium' ? (
                  <Crown className="h-6 w-6 text-primary" />
                ) : (
                  <Star className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Current Plan: {currentPlan === 'premium' ? 'Premium' : 'Free'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentPlan === 'premium' 
                    ? 'You have access to all premium features' 
                    : 'Upgrade to unlock more features'}
                </p>
              </div>
            </div>
            {currentPlan === 'premium' && (
              <Badge className="bg-accent text-accent-foreground">
                <Zap className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "h-full relative",
                plan.popular && "border-primary shadow-lg"
              )}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      ₹{plan.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.notIncluded && (
                    <ul className="space-y-3 opacity-50">
                      {plan.notIncluded.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground line-through">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    className={cn(
                      "w-full",
                      plan.popular 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                    disabled={plan.id === currentPlan || isLoading !== null}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {isLoading === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : plan.id === currentPlan ? (
                      'Current Plan'
                    ) : plan.id === 'free' ? (
                      'Downgrade'
                    ) : (
                      'Upgrade Now'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-sm text-muted-foreground">
                We accept all major credit/debit cards, UPI, and net banking through our secure payment partner.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">
                How does the homepage featuring work?
              </h4>
              <p className="text-sm text-muted-foreground">
                Premium vendors are displayed in the featured section on our homepage, getting maximum visibility to couples searching for vendors.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* TODO Notice */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          {/* TODO: integrate Stripe or Polar for payments */}
          Payment integration coming soon. Contact support for manual upgrades.
        </p>
      </motion.div>
    </div>
  )
}
