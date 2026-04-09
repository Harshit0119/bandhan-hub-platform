// app/dashboard/subscription/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap, Crown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

/* ✅ Razorpay loader (FIX) */
const loadRazorpay = () => {
  return new Promise<boolean>((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Get started with basic features',
    features: [
      'Basic Profile Page',
      'Listed on vendors page',
      'Up to 5 photos in gallery',
      'WhatsApp contact button',
      'Limited visibility',
    ],
    notIncluded: [
      'Lead management dashboard',
      'Homepage featured listing',
      'Featured badge',
      'Priority Ranking',
      'Analytics dashboard',
      'Up to 50 photos',
      'Instagram & call buttons',
      'Premium support',
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 199,
    originalPrice: 399,
    period: 'month',
    description: 'Best for growing businesses',
    features: [
      'Everything in Free, plus:',
      'Featured on homepage',
      'Lead management dashboard',
      'Top in search results',
      'Featured badge on profile',
      'Priority Ranking',
      'Full analytics dashboard',
      'Up to 50 gallery photos',
      'Instagram & call buttons',
      'Premium support',
    ],
    popular: true,
  },
  {
    id: 'annual',
    name: 'Premium Annual',
    price: 1999,
    originalPrice: 3999,
    period: 'year',
    description: 'Best value (save 50%)',
    features: [
      'Everything in Premium',
      'Better analytics',
      'Top priority ranking',
      'Early feature access',
      'Custom branding (soon)',
      'Marketing support (soon)',
    ],
    popular: false,
  },
]

export default function SubscriptionPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const  router = useRouter()
  // ✅ FIX: Read actual plan from DB
  const currentPlan = useMemo(() => {
    if (user?.subscription_plan) return user.subscription_plan // 🔥 MAIN FIX
    if (user?.isPremium) return 'premium'
    return 'free'
  }, [user])

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error("Please log in to subscribe")
      return
    }

    setIsLoading(planId)

    try {
      /* ✅ Load Razorpay dynamically */
      const isLoaded = await loadRazorpay()

      if (!isLoaded) {
        toast.error("Payment system failed to load. Try again.")
        return
      }

      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, userId: user.id }),
      })

      const order = await res.json()

      if (!order?.id) {
        throw new Error("Order creation failed")
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Bandhan-Hub",
        description: planId === 'annual'
          ? "Annual Premium Subscription"
          : "Monthly Premium Subscription",
        order_id: order.id,

        handler: async function (response: any) {
          try {
            const controller = new AbortController()

            // ⏱ timeout after 8 sec
            const timeout = setTimeout(() => controller.abort(), 8000)

            const res = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                userId: user.id,
                plan: planId,
              }),
              signal: controller.signal,
            })

            clearTimeout(timeout)

            const data = await res.json()

            if (!res.ok || data.error) {
              throw new Error(data.error || "Verification failed")
            }

            toast.success("Payment successful 🎉")

            // ✅ small delay for DB sync
            setTimeout(() => {
              window.location.reload()
            }, 1000)

          } catch (err) {
            console.error("VERIFY ERROR:", err)

            toast.error("Payment done but verification failed. Refresh page.")

            // ✅ fallback (VERY IMPORTANT)
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email,
        },
      }

      const Razorpay = (window as any).Razorpay
      const rzp = new Razorpay(options)
      rzp.on("payment.failed", function () {
        toast.error("Payment failed.Try again.")
      })

      rzp.open()

    } catch (err) {
      console.error(err)
      toast.error("Payment failed")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl font-bold">
            Upgrade Your Plan
          </h1>
          <p className="text-muted-foreground mt-2">
            Get more visibility, leads & bookings 🚀
          </p>
        </div>

        {/* CURRENT PLAN */}
        <Card className="mb-8 bg-linear-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 rounded-full">
                {currentPlan !== 'free' ? (
                  <Crown className="h-6 w-6 text-primary" />
                ) : (
                  <Star className="h-6 w-6 text-primary" />
                )}
              </div>

              <div>
                <h3 className="font-semibold">
                  Current Plan: {currentPlan === 'annual' ? 'Premium Annual' : currentPlan === 'premium' ? 'Premium Monthly' : 'Free'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentPlan === 'free'
                    ? 'Upgrade to unlock growth features'
                    : 'All premium features unlocked'}
                </p>
              </div>
            </div>

            {currentPlan !== 'free' && (
              <Badge className="bg-green-500 text-white">
                <Zap className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* PLANS */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {

            // ✅ FIX: Correct comparison
            const isCurrent =
              (currentPlan === 'free' && plan.id === 'free') ||
              (currentPlan === 'premium' && plan.id === 'premium') ||
              (currentPlan === 'annual' && plan.id === 'annual')

            return (
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
                      <Badge className="bg-primary text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {/* ✅ ACTIVE BADGE */}
                  {isCurrent && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white">
                        Active
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>

                    <div className="mt-4">
                      {plan.originalPrice && (
                        <span className="text-xl line-through text-gray-400 mr-2">
                          ₹{plan.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold">
                        ₹{plan.price}
                      </span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>

                    {plan.id !== 'free' && (
                      <Badge className="bg-green-500 text-white mt-2">
                        🎉 50% Launch Offer
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.notIncluded && (
                      <ul className="space-y-3 opacity-50">
                        {plan.notIncluded.map((feature) => (
                          <li key={feature} className="flex gap-2">
                            <Check className="h-5 w-5 mt-0.5" />
                            <span className="text-sm line-through">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button
                      className={cn(
                        "w-full text-white",
                        isCurrent
                          ? "bg-primary hover:bg-primary-dark" // darker solid green
                          : "bg-primary hover:bg-primary-dark"
                        // faded/blurred for others
                      )}
                      disabled={isCurrent || isLoading !== null}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {isLoading === plan.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : isCurrent ? (
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
            )
          })}
        </div>

        {/* FAQ */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
      </motion.div>
    </div>
  )
}
