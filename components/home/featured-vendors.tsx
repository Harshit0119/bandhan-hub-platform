// \components\home\featured-vendors.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VendorCard } from '@/components/vendor-card'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function FeaturedVendors() {
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true)

        // ✅ STEP 1: Fetch premium vendors
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .eq('is_premium', true)
          .order('created_at', { ascending: false })
          .limit(8)

        if (error || !data) throw error

        if (data.length === 0) {
          setVendors([])
          return
        }

        const vendorIds = data.map(v => v.id)

        // ✅ STEP 2: Fetch counts
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

        // ✅ STEP 4: Format EXACT SAME AS /vendors PAGE
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

        // ✅ IMPORTANT (YOU MISSED THIS)
        setVendors(formatted)

      } catch (err) {
        console.error('Featured Vendors Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Vendors
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Top premium vendors getting maximum visibility 🚀
          </p>
        </motion.div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No premium vendors yet 🚀
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vendors.map((vendor, index) => (
              <VendorCard key={vendor.id} vendor={vendor} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/vendors">
            <Button variant="outline" size="lg" className="group">
              View All Vendors
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}