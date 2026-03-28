'use client'

import { Button } from '@/components/ui/button'

export default function PremiumGate({
  children,
  isPremium,
}: {
  children: React.ReactNode
  isPremium: boolean
}) {
  if (isPremium) return <>{children}</>

  return (
    <div className="relative">
      {/* BLURRED CONTENT */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-6 text-center">
          <h3 className="font-bold text-lg mb-2">Upgrade to Premium</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Unlock analytics, leads & more
          </p>

          <Button>
            Upgrade ₹199/month
          </Button>
        </div>
      </div>
    </div>
  )
}