// /vendors/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { VendorCard } from '@/components/vendor-card'
import { VendorsFilter } from '@/components/vendors-filter'
import { FavoritesProvider } from '@/lib/favorites-store'
import { Vendor } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase, safeQuery } from '@/lib/supabase'
import { formatVendors } from '@/lib/formatVendors'

function VendorsContent() {
  const searchParams = useSearchParams()

  const [vendors, setVendors] = useState<Vendor[]>([])
  const [premium, setPremium] = useState<Vendor[]>([])
  const [free, setFree] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const category = searchParams.get('category') || ''
  const city = searchParams.get('city') || ''
  const minBudget = searchParams.get('minBudget')
    ? parseInt(searchParams.get('minBudget')!)
    : undefined
  const maxBudget = searchParams.get('maxBudget')
    ? parseInt(searchParams.get('maxBudget')!)
    : undefined

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true)

      try {
        const { data, error } = await safeQuery(async () => {
          let query = supabase
            .from('vendors')
            .select('*')
            // 🔥 PRIORITY SORTING
            .order('is_premium', { ascending: false })
            .order('subscription_expires_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })

          if (category) query = query.eq('category', category)
          if (city) query = query.ilike('city', `%${city}%`)
          if (minBudget) query = query.gte('min_price', minBudget)
          if (maxBudget) query = query.lte('max_price', maxBudget)

          return await query
        })

        if (error || !data) {
          console.error('Error fetching vendors:', error)
          setVendors([])
          return
        }

        const formatted = await formatVendors(data)

        // 🔥 SPLIT DATA
        const premiumVendors = formatted.filter((v) => v.isPremium)
        const freeVendors = formatted.filter((v) => !v.isPremium)

        setVendors(formatted)
        setPremium(premiumVendors)
        setFree(freeVendors)

      } catch (err) {
        console.error('Fetch vendors error:', err)
        setVendors([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendors()
  }, [category, city, minBudget, maxBudget])

  return (
    <FavoritesProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 pt-24">
          {/* HERO */}
          <section className="bg-linear-to-br from-primary to-primary/80 text-white py-12">
            <div className="container mx-auto px-4 text-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="font-serif text-4xl font-bold mb-4">
                  {category ? `${category}s` : 'All Vendors'}
                </h1>
                <p className="text-white/80">
                  {city
                    ? `Browse vendors in ${city}`
                    : 'Discover talented wedding professionals'}
                </p>
              </motion.div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-8">
            <VendorsFilter
              initialCategory={category}
              initialCity={city}
              initialMinBudget={minBudget}
              initialMaxBudget={maxBudget}
            />

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : vendors.length > 0 ? (
              <>
                {/* 🔥 TOP VENDORS (ONLY WHEN NO FILTER) */}
                {!category && !city && premium.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        🔥 Top Vendors
                      </h2>

                      <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                        Premium Listings
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {premium.map((vendor, index) => (
                        <div
                          key={vendor.id}
                          className="relative"
                        >
                          {/* ⭐ PREMIUM BADGE
                          <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-black text-xs px-2 py-1 rounded shadow">
                            ⭐ Featured
                          </div> */}

                          {/* 💎 SLIGHT GLOW */}
                          <div className="rounded-xl border border-primary/30 shadow-md hover:shadow-lg transition">
                            <VendorCard vendor={vendor} index={index} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ❗ NO PREMIUM FALLBACK */}
                {!category && !city && premium.length === 0 && (
                  <div className="mb-10 text-center p-6 border rounded-xl bg-secondary/30">
                    <h2 className="text-xl font-semibold mb-2">
                      Top Vendors Coming Soon
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      We’re onboarding the best professionals in your city.
                    </p>
                  </div>
                )}

                {/* 🔥 MAIN GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(category || city ? vendors : free).map((vendor, index) => (
                    <VendorCard key={vendor.id} vendor={vendor} index={index} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold">No vendors found</h3>
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </FavoritesProvider>
  )
}

export default function VendorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VendorsContent />
    </Suspense>
  )
}