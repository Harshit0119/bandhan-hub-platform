'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VendorCard } from '@/components/vendor-card'
import { getFeaturedVendors } from '@/lib/mock-data'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function FeaturedVendors() {
  // TODO: Fetch from Supabase - Only shows paid/premium vendors on homepage
  const vendors = getFeaturedVendors()

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
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
            Handpicked premium vendors who have earned their reputation through exceptional service and client satisfaction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vendors.map((vendor, index) => (
            <VendorCard key={vendor.id} vendor={vendor} index={index} />
          ))}
        </div>

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
