//\components\home\search-section.tsx
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, MapPin } from 'lucide-react'
import { VENDOR_CATEGORIES } from '@/lib/types'
import { motion } from 'framer-motion'

export function SearchSection() {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')

  const handleSearch = useCallback(() => {
    if(!category && !city) return
    
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (city) params.set('city', city)

    router.push(`/vendors?${params.toString()}`)
  }, [category, city, router])

  return (
    <section className="py-16 bg-background relative -mt-20 z-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 border border-border">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-6">
              Find Your Perfect Vendor
            </h2>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {VENDOR_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-12 pl-10 bg-background"
                />
              </div>

              <Button onClick={handleSearch} className="h-12 px-8">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}



// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Search, MapPin } from 'lucide-react'
// import { VENDOR_CATEGORIES } from '@/lib/types'
// import { motion } from 'framer-motion'

// export function SearchSection() {
//   const router = useRouter()
//   const [category, setCategory] = useState('')
//   const [city, setCity] = useState('')

//   const handleSearch = () => {
//     const params = new URLSearchParams()
//     if (category) params.set('category', category)
//     if (city) params.set('city', city)
//     router.push(`/vendors?${params.toString()}`)
//   }

//   return (
//     <section className="py-16 bg-background relative -mt-20 z-20">
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="max-w-4xl mx-auto"
//         >
//           <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 border border-border">
//             <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-6 text-foreground">
//               Find Your Perfect Vendor
//             </h2>
            
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <Select value={category} onValueChange={setCategory}>
//                   <SelectTrigger className="h-12 bg-background">
//                     <SelectValue placeholder="Select category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {VENDOR_CATEGORIES.map((cat) => (
//                       <SelectItem key={cat} value={cat}>
//                         {cat}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex-1 relative">
//                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                 <Input
//                   placeholder="Enter city (e.g., Bhopal, Indore)"
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   className="h-12 pl-10 bg-background"
//                 />
//               </div>

//               <Button 
//                 onClick={handleSearch}
//                 className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
//               >
//                 <Search className="h-5 w-5 mr-2" />
//                 Search
//               </Button>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }
