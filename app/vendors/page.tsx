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

      // ✅ STEP 1: Fetch vendors
      let query = supabase.from('vendors').select('*')

      if (category) query = query.eq('category', category)
      if (city) query = query.ilike('city', `%${city}%`)
      if (minBudget) query = query.gte('min_price', minBudget)
      if (maxBudget) query = query.lte('max_price', maxBudget)

      const { data, error } = await query

      if (error || !data) {
        console.error("Error fetching vendors:", error)
        setIsLoading(false)
        return
      }

      if (data.length === 0) {
        setVendors([])
        setIsLoading(false)
        return
      }

      const vendorIds = data.map(v => v.id)

      // ✅ STEP 2: Fetch counts ONLY for these vendors
      const [
        { data: viewsData },
        { data: favData }
      ] = await Promise.all([
        supabase
          .from('profile_views')
          .select('vendor_id')
          .in('vendor_id', vendorIds),

        supabase
          .from('favorites')
          .select('vendor_id')
          .in('vendor_id', vendorIds),
      ])

      // ✅ STEP 3: Build maps
      const viewsMap: Record<string, number> = {}
      viewsData?.forEach(v => {
        viewsMap[v.vendor_id] = (viewsMap[v.vendor_id] || 0) + 1
      })

      const favMap: Record<string, number> = {}
      favData?.forEach(f => {
        favMap[f.vendor_id] = (favMap[f.vendor_id] || 0) + 1
      })

      // ✅ STEP 4: Format
      const formatted = data.map((v) => ({
        ...v,
        coverImage: v.cover_image || '/placeholder.jpg',
        profileImage: v.profile_image || '/placeholder.jpg',
        gallery: [],
        services: [],

        views: viewsMap[v.id] || 0,
        favoritesCount: favMap[v.id] || 0,

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

          <section className="bg-linear-to-br from-primary to-primary/80 text-white py-12">
            <div className="container mx-auto px-4 text-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="font-serif text-4xl font-bold mb-4">
                  {category ? `${category}s` : 'All Vendors'}
                </h1>
                <p className="text-white/80">
                  {city ? `Browse vendors in ${city}` : 'Discover talented wedding professionals'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vendors.map((vendor, index) => (
                  <VendorCard key={vendor.id} vendor={vendor} index={index} />
                ))}
              </div>
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VendorsContent />
    </Suspense>
  )
}