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
import { supabase } from '@/lib/supabase'

function VendorsContent() {
  const searchParams = useSearchParams()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const category = searchParams.get('category') || ''
  const city = searchParams.get('city') || ''
  const minBudget = searchParams.get('minBudget') ? parseInt(searchParams.get('minBudget')!) : undefined
  const maxBudget = searchParams.get('maxBudget') ? parseInt(searchParams.get('maxBudget')!) : undefined

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true)

      let query = supabase.from('vendors').select('*')

      if (category) query = query.eq('category', category)
      if (city) query = query.ilike('city', `%${city}%`)
      if (minBudget) query = query.gte('min_price', minBudget)
      if (maxBudget) query = query.lte('max_price', maxBudget)

      const { data, error } = await query

      if (error) {
        console.error("Error fetching vendors:", error)
        setIsLoading(false)
        return
      }
      const formatted = data.map((v) => ({
        ...v,
        coverImage: v.cover_image || '/placeholder.jpg',
        profileImage: v.profile_image || '/placeholder.jpg',
        gallery: [],
        services: [],
        views: 0,
        favoritesCount: 0,
        minPrice: v.min_price,
        maxPrice: v.max_price,
        isPremium: v.is_premium,
        whatsapp: v.whatsapp,
        instagram: v.instagram,
        phone: v.phone,
        experience: v.experience,
        about: v.about,
      }))

      setVendors(formatted)
      setIsLoading(false)
    }

    fetchVendors()
  }, [category, city, minBudget, maxBudget])

  return (
    <FavoritesProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24">
          {/* Header */}
          <section className="bg-linear-to-br from-primary to-primary/80 text-white py-12">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {category ? `${category}s` : 'All Vendors'}
                </h1>
                <p className="text-white/80 max-w-2xl mx-auto">
                  {city ? `Browse vendors in ${city}` : 'Discover talented wedding professionals across India'}
                </p>
              </motion.div>
            </div>
          </section>

          {/* Filters & Results */}
          <section className="container mx-auto px-4 py-8">
            <VendorsFilter
              initialCategory={category}
              initialCity={city}
              initialMinBudget={minBudget}
              initialMaxBudget={maxBudget}
            />

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : vendors.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  Showing {vendors.length} vendor{vendors.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {vendors.map((vendor, index) => (
                    <VendorCard key={vendor.id} vendor={vendor} index={index} />
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">No vendors found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
              </motion.div>
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VendorsContent />
    </Suspense>
  )
}
