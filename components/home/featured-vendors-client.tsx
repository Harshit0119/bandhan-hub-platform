'use client'

import { VendorCard } from '@/components/vendor-card'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Vendor } from '@/lib/types'

export default function FeaturedVendorsClient({ vendors,
}:{
    vendors: Vendor[]
}) {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold">
            Featured Vendors
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {vendors.map((vendor: Vendor, index: number) => (
            <VendorCard key={vendor.id} vendor={vendor} index={index} />
          ))}
        </div>

        <div className="text-center mt-10 md:mt-12">
          <Link href="/vendors">
            <Button variant="outline" size="lg">
              View All Vendors
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}