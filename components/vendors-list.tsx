'use client'

import { Vendor } from '@/lib/types'
import { VendorCard } from '@/components/vendor-card'

export function VendorsList({ vendors }: { vendors: Vendor[] }) {
  if (vendors.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold">No vendors found</h3>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {vendors.map((vendor, index) => (
        <VendorCard key={vendor.id} vendor={vendor} index={index} />
      ))}
    </div>
  )
}