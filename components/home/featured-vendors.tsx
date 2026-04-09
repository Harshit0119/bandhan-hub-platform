// \components\home\featured-vendors.tsx
import { supabase } from '@/lib/supabase'
import { formatVendors } from '@/lib/formatVendors'
import FeaturedVendorsClient from './featured-vendors-client'

export default async function FeaturedVendors() {
  const { data } = await supabase
    .from('vendors')
    .select('*')
    .eq('is_premium', true)
    .limit(8)

  const vendors = await formatVendors(data || [])

  return <FeaturedVendorsClient vendors={vendors} />
}



// 'use client'

// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { VendorCard } from '@/components/vendor-card'
// import { motion } from 'framer-motion'
// import { ArrowRight } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { formatVendors } from '@/lib/formatVendors' // ✅ FIXED
// import { Vendor } from '@/lib/types'

// export default function FeaturedVendors() {
//   const [vendors, setVendors] = useState<Vendor[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     let isMounted = true // ✅ prevent memory leak

//     const fetchFeatured = async () => {
//       try {
//         setLoading(true)

//         const { data, error } = await supabase
//           .from('vendors')
//           .select('*')
//           .eq('is_premium', true)
//           .order('created_at', { ascending: false })
//           .limit(8)

//         if (error || !data) throw error

//         const formatted = await formatVendors(data)

//         if (isMounted) {
//           setVendors(formatted)
//         }

//       } catch (err) {
//         console.error('Featured Vendors Error:', err)
//       } finally {
//         if (isMounted) setLoading(false)
//       }
//     }

//     fetchFeatured()

//     return () => {
//       isMounted = false
//     }
//   }, [])

//   return (
//     <section className="py-16 md:py-20 bg-secondary/30">
//       <div className="container mx-auto px-4">

//         {/* HEADER */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-10 md:mb-12"
//         >
//           <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
//             Featured Vendors
//           </h2>
//           <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
//             Top premium vendors getting maximum visibility 🚀
//           </p>
//         </motion.div>

//         {/* LOADING SKELETON (BETTER UX) */}
//         {loading ? (
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
//             {[...Array(4)].map((_, i) => (
//               <div
//                 key={i}
//                 className="h-55 md:h-62.5 bg-muted animate-pulse rounded-xl"
//               />
//             ))}
//           </div>
//         ) : vendors.length === 0 ? (
//           <div className="text-center py-10">
//             <p className="text-muted-foreground">
//               No premium vendors yet 🚀
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
//             {vendors.map((vendor, index) => (
//               <VendorCard key={vendor.id} vendor={vendor} index={index} />
//             ))}
//           </div>
//         )}

//         {/* CTA */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           className="text-center mt-10 md:mt-12"
//         >
//           <Link href="/vendors">
//             <Button variant="outline" size="lg" className="group">
//               View All Vendors
//               <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//             </Button>
//           </Link>
//         </motion.div>

//       </div>
//     </section>
//   )
// }