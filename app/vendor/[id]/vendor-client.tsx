//\app\vendor\[id]\vendors-client.tsx
'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useFavorites } from '@/lib/favorites-store'
import { useAuth } from '@/lib/auth-context'
import {
  insertProfileView,
  insertContactClick,
  insertInquiry,
} from '@/lib/db-actions'
import { Vendor } from '@/lib/types'
import {
  Heart,
  MapPin,
  Phone,
  Instagram,
  MessageCircle,
  Star,
  Eye,
  ArrowLeft,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface Props {
  vendor: Vendor
}

export default function VendorClient({ vendor: initialVendor }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const { isFavorite, addFavorite, removeFavorite, addRecentlyViewed } = useFavorites()

  const [vendor, setVendor] = useState<Vendor>(initialVendor)
  const [showInquiry, setShowInquiry] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)

  const [inquiryData, setInquiryData] = useState({
    name: '',
    phone: '',
    event_date: '',
    message: '',
  })

  const gallery = useMemo(() => vendor.gallery || [], [vendor.gallery])

  // ✅ VIEW TRACK
  useEffect(() => {
    if (!vendor?.id) return
    const key = `viewed_${vendor.id}`

    if (!sessionStorage.getItem(key)) {
      insertProfileView(vendor.id)
      sessionStorage.setItem(key, 'true')
      addRecentlyViewed(vendor.id)
    }
  }, [vendor?.id])

  // ✅ FAVORITE
  const handleFavoriteClick = () => {
    if (!user) return router.push('/signup')

    if (isFavorite(vendor.id)) {
      removeFavorite(vendor.id)
      setVendor((prev) => ({
        ...prev,
        favoritesCount: (prev.favoritesCount || 1) - 1,
      }))
    } else {
      addFavorite(vendor.id)
      setVendor((prev) => ({
        ...prev,
        favoritesCount: (prev.favoritesCount || 0) + 1,
      }))
    }
  }

  // ✅ CONTACT
  const handleContactClick = (type: 'whatsapp' | 'instagram' | 'phone') => {
    if (!user) return router.push('/signup')

    insertContactClick(vendor.id)

    let url = ''
    if (type === 'whatsapp') url = `https://wa.me/${vendor.whatsapp?.replace(/\D/g, '')}`
    if (type === 'instagram') url = `https://instagram.com/${vendor.instagram}`
    if (type === 'phone') url = `tel:${vendor.phone}`

    window.open(url, '_blank')
  }

  const formatPrice = (price: number) => {
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lakh`
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* COVER */}
      <div className="relative h-64 sm:h-80 md:h-80">
        <Image
          src={vendor.coverImage || '/placeholder.webp'}
          alt={vendor.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 left-4 text-white bg-white/20 hover:bg-white/30"
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </Button>
      </div>

      {/* MAIN */}
      <main className="flex-1 container mx-auto px-4 -mt-20 relative z-10">

        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-xl border p-5 md:p-8"
        >
          <div className="flex flex-col md:flex-row gap-6">

            {/* IMAGE */}
            <div className="-mt-16 md:mt-0">
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={vendor.profileImage || '/placeholder.jpg'}
                  alt={vendor.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* INFO */}
            <div className="flex-1">
              <div className="flex justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {vendor.name}
                  </h1>

                  <p className="text-muted-foreground">{vendor.category}</p>

                  <div className="flex items-center gap-1 text-sm mt-1">
                    <MapPin className="h-4 w-4" />
                    {vendor.city}
                  </div>

                  {vendor.isPremium && (
                    <Badge className="mt-2">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFavoriteClick}
                  className={cn(isFavorite(vendor.id) && "text-primary")}
                >
                  <Heart className={cn(isFavorite(vendor.id) && "fill-current")} />
                </Button>
              </div>

              {/* STATS */}
              <div className="flex gap-6 mt-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {vendor.experience}+ years experience
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" /> {vendor.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> {vendor.favoritesCount || 0}
                </span>
              </div>

              {/* PRICE */}
              <div className="mt-4 p-4 bg-secondary/50 rounded-lg inline-block">
                <span className="text-sm text-muted-foreground">Starting from</span><div className="text-xl font-bold text-primary">
                  {formatPrice(vendor.minPrice || 0)} - {formatPrice(vendor.maxPrice || 0)}
                </div>
              </div>

              {/* CONTACT */}
              <div className="flex flex-wrap gap-3 mt-5">
                {vendor.whatsapp && (
                  <Button onClick={() => handleContactClick('whatsapp')}>
                    WhatsApp
                  </Button>
                )}
                {vendor.instagram && (
                  <Button
                    variant="outline"
                    onClick={() => handleContactClick('instagram')}>
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Button>
                )}
                {vendor.phone && (
                  <Button variant="outline" onClick={() => handleContactClick('phone')}>
                    Call
                  </Button>
                )}
                <Button onClick={() => {
                  if (!user) {
                    router.push('/signup')
                    return
                  }
                  setShowInquiry(true)
                }}>
                  Send Inquiry
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6 pb-12">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            <Card>
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent>{vendor.about}</CardContent>
            </Card>

            {/* GALLERY */}
            <Card>
              <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => {
                        setSelectedIndex(i)
                        setZoom(1)
                      }}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="(max-width:768px) 50vw, 25vw"
                        className="object-cover hover:scale-105 transition"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <Card>
              <CardHeader><CardTitle>Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vendor.services?.map((s) => (
                  <div key={s.id} className="border p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>{s.name}</span>
                      <span className="font-semibold">{formatPrice(s.price || 0)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* INQUIRY MODAL */}
            {showInquiry && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl w-full max-w-md">
                  <h2 className="font-bold text-lg mb-4">Send Inquiry</h2>

                  <input
                    placeholder="Your Name"
                    className="w-full border p-2 mb-2"
                    value={inquiryData.name}
                    onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                  />

                  <input
                    placeholder="Phone"
                    className="w-full border p-2 mb-2"
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                  />

                  <p className="text-sm text-muted-foreground mb-1"><b>Event Date</b></p>
                  <input
                    type="month"
                    className="w-full border p-2 mb-3"
                    value={inquiryData.event_date}
                    onChange={(e) =>
                      setInquiryData({ ...inquiryData, event_date: e.target.value })
                    }
                  />

                  <textarea
                    placeholder="Message"
                    className="w-full border p-2 mb-3"
                    value={inquiryData.message}
                    onChange={(e) =>
                      setInquiryData({ ...inquiryData, message: e.target.value })
                    }
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={async () => {
                        if (!inquiryData.name || !inquiryData.phone) {
                          toast.error("Name & Phone are required")
                          return
                        }
                        await insertInquiry({
                          vendorId: vendor.id,
                          userId: user?.id || null,
                          name: inquiryData.name,
                          phone: inquiryData.phone,
                          event_date: inquiryData.event_date || null,
                          message: inquiryData.message,
                        })
                        await fetch("/api/send-inquiry-email", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            vendorId: vendor.id,
                            name: inquiryData.name,
                            phone: inquiryData.phone,
                            message: inquiryData.message,
                          }),
                        })
                        toast.success("Sent!")
                        setShowInquiry(false)
                      }}
                    >
                      Submit
                    </Button>
                    <Button variant="outline" onClick={() => setShowInquiry(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main >

      {/* ✅ FULLSCREEN VIEWER */}
      {
        selectedIndex !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            {/* CLOSE */}
            <button aria-label="Open menu"
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={() => setSelectedIndex(null)}
            >
              ✕
            </button>


            {/* IMAGE */}
            <div
              className="flex items-center justify-center w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={vendor.gallery?.[selectedIndex]}
                className="max-h-[90%] max-w-[90%]"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>

            {/* PREV */}
            <button aria-label="Open menu"
              className="absolute left-4 text-white text-4xl"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex((prev) =>
                  prev === 0 ? gallery.length - 1 : (prev as number) - 1
                )
              }}
            >
              ‹
            </button>

            {/* NEXT */}
            <button aria-label="Open menu"
              className="absolute right-4 text-white text-4xl"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex((prev) =>
                  prev === gallery.length - 1 ? 0 : (prev as number) + 1
                )
              }}
            >
              ›
            </button>

            {/* ZOOM */}
            <div className="absolute bottom-6 flex gap-4">
              <button aria-label="Open menu"
                className="bg-white px-3 py-1 rounded"
                onClick={(e) => {
                  e.stopPropagation()
                  setZoom((z) => Math.max(1, z - 0.5))
                }}
              >
                -
              </button>
              <button aria-label="Open menu"
                className="bg-white px-3 py-1 rounded"
                onClick={(e) => {
                  e.stopPropagation()
                  setZoom((z) => z + 0.5)
                }}
              >
                +
              </button>
            </div>
          </div>
        )
      }
    </div >
  )
}



//  'use client'

// import { useEffect, useState, use, useMemo } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { Navbar } from '@/components/navbar'
// import { Footer } from '@/components/footer'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { supabase } from '@/lib/supabase'
// import { Badge } from '@/components/ui/badge'
// import { useFavorites, FavoritesProvider } from '@/lib/favorites-store'
// import { useAuth } from '@/lib/auth-context'
// import {
//   insertProfileView,
//   insertContactClick,
//   insertInquiry,
// } from '@/lib/db-actions'
// import { Vendor } from '@/lib/types'
// import {
//   Heart,
//   MapPin,
//   Phone,
//   Instagram,
//   MessageCircle,
//   Star,
//   Eye,
//   ArrowLeft,
//   Loader2,
//   Clock,
//   Images
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { motion } from 'framer-motion'
// import { toast } from 'sonner'

// interface VendorProfileContentProps {
//   vendor: Vendor
//   setVendor: (vendor: Vendor | null | ((prev: Vendor | null) => Vendor | null)) => void
// }

// function VendorProfileContent({ vendor, setVendor }: VendorProfileContentProps) {
//   const router = useRouter()
//   const { user } = useAuth()
//   const [showInquiry, setShowInquiry] = useState(false)
//   const [inquiryData, setInquiryData] = useState({
//     name: '',
//     phone: '',
//     event_date: '',
//     message: '',
//   })
//   const { isFavorite, addFavorite, removeFavorite, addRecentlyViewed } = useFavorites()

//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
//   const [zoom, setZoom] = useState(1)
//   const gallery = useMemo(() => vendor.gallery || [], [vendor.gallery])

//   useEffect(() => {
//     if (!vendor?.id) return

//     const key = `viewed_${vendor.id}`

//     if (sessionStorage.getItem(key)) return

//     insertProfileView(vendor.id)

//     sessionStorage.setItem(key, 'true')

//     addRecentlyViewed(vendor.id)
//   }, [vendor?.id])

//   const handleFavoriteClick = async () => {
//     if (!user) {
//       router.push('/signup')
//       return
//     }
//     if (isFavorite(vendor.id)) {
//       removeFavorite(vendor.id)
//     } else {
//       addFavorite(vendor.id)
//     }
//     // ✅ re-fetch favorites count
//     setVendor((prev: any) => ({
//       ...prev,
//       favoritesCount: isFavorite(vendor.id)
//         ? (prev.favoritesCount || 1) - 1
//         : (prev.favoritesCount || 0) + 1
//     }))
//   }

//   const handleContactClick = async (type: 'whatsapp' | 'instagram' | 'phone') => {
//     if (!user) {
//       router.push('/signup')
//       return
//     }

//     insertContactClick(vendor.id) // ✅ FIXED

//     let url = ''

//     switch (type) {
//       case 'whatsapp':
//         url = `https://wa.me/${vendor.whatsapp?.replace(/\D/g, '')}`
//         break
//       case 'instagram':
//         url = `https://instagram.com/${vendor.instagram}`
//         break
//       case 'phone':
//         url = `tel:${vendor.phone}`
//         break
//     }

//     window.open(url, '_blank')
//   }

//   const formatPrice = (price: number) => {
//     if (price >= 100000) {
//       return `₹${(price / 100000).toFixed(1)} Lakh`
//     }
//     return `₹${price.toLocaleString()}`
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />

//       <main className="flex-1 pt-16">
//         {/* Cover Image */}
//         <div className="relative h-64 md:h-80 lg:h-96">
//           <Image
//             src={vendor.coverImage || '/placeholder.jpg'}
//             alt={`${vendor.name} cover`}
//             fill
//             className="object-cover"
//             placeholder="blur"
//             blurDataURL="/blur.png"
//           />
//           <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

//           {/* Back Button */}
//           <div className="absolute top-4 left-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
//               onClick={() => router.back()}
//             >
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>

//         {/* Profile Section */}
//         <div className="container mx-auto px-4 -mt-24 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
//           >
//             <div className="p-6 md:p-8">
//               <div className="flex flex-col md:flex-row gap-6">
//                 {/* Profile Image */}
//                 <div className="shrink-0 -mt-20 md:-mt-16">
//                   <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-card shadow-lg">
//                     <Image
//                       src={vendor.profileImage || '/placeholder.jpg'}
//                       alt={vendor.name}
//                       fill
//                       className="object-cover"
//                       placeholder="blur"
//                       blurDataURL="/blur.png"
//                     />
//                   </div>
//                 </div>

//                 {/* Info */}
//                 <div className="flex-1">
//                   <div className="flex flex-wrap items-start justify-between gap-4">
//                     <div>
//                       <div className="flex items-center gap-3 flex-wrap">
//                         <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
//                           {vendor.name}
//                         </h1>
//                         {vendor.isPremium && (
//                           <Badge className="bg-accent text-accent-foreground">
//                             <Star className="h-3 w-3 mr-1 fill-current" />
//                             Featured
//                           </Badge>
//                         )}
//                       </div>
//                       <p className="text-muted-foreground mt-1">{vendor.category}</p>
//                       <div className="flex items-center gap-1 text-muted-foreground mt-2">
//                         <MapPin className="h-4 w-4" />
//                         <span>{vendor.city}</span>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex gap-3">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className={cn(
//                           "rounded-full",
//                           isFavorite(vendor.id) && "text-primary border-primary"
//                         )}
//                         onClick={handleFavoriteClick}
//                       >
//                         <Heart className={cn("h-5 w-5", isFavorite(vendor.id) && "fill-current")} />
//                       </Button>
//                     </div>
//                   </div>

//                   {/* Stats */}
//                   <div className="flex flex-wrap gap-6 mt-6 text-sm">
//                     <div className="flex items-center gap-2 text-muted-foreground">
//                       <Clock className="h-4 w-4" />
//                       <span>{vendor.experience} experience</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-muted-foreground">
//                       <Eye className="h-4 w-4" />
//                       <span>{(vendor.views || 0).toLocaleString()} views</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-muted-foreground">
//                       <Heart className="h-4 w-4" />
//                       <span>{(vendor.favoritesCount || 0).toLocaleString()} favorites</span>
//                     </div>
//                   </div>

//                   {/* Price Range */}
//                   <div className="mt-4 p-4 bg-secondary/50 rounded-lg inline-block">
//                     <span className="text-sm text-muted-foreground">Starting from</span>
//                     <div className="text-xl font-bold text-primary">
//                       {formatPrice(vendor.minPrice || 0)} - {formatPrice(vendor.maxPrice || 0)}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Contact Buttons */}
//               <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border">
//                 {vendor.whatsapp && (
//                   <Button
//                     onClick={() => handleContactClick('whatsapp')}
//                     className="bg-[#25D366] hover:bg-[#20BD5C] text-white"
//                   >
//                     <MessageCircle className="h-4 w-4 mr-2" />
//                     WhatsApp
//                   </Button>
//                 )}
//                 {vendor.instagram && (
//                   <Button
//                     variant="outline"
//                     onClick={() => handleContactClick('instagram')}
//                     className="border-[#E4405F] text-[#E4405F] hover:bg-[#E4405F]/10"
//                   >
//                     <Instagram className="h-4 w-4 mr-2" />
//                     Instagram
//                   </Button>
//                 )}
//                 {vendor.phone && (
//                   <Button
//                     variant="outline"
//                     onClick={() => handleContactClick('phone')}
//                   >
//                     <Phone className="h-4 w-4 mr-2" />
//                     Call
//                   </Button>
//                 )}
//                 <Button
//                   onClick={() => {
//                     if (!user) {
//                       router.push('/signup')
//                       return
//                     }
//                     setShowInquiry(true)
//                   }}
//                 >
//                   Send Inquiry
//                 </Button>
//               </div>
//             </div>
//           </motion.div>

//           {/* Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 pb-12">
//             {/* Main Content */}
//             <div className="lg:col-span-2 space-y-8">
//               {/* About */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>About</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground leading-relaxed">{vendor.about}</p>
//                 </CardContent>
//               </Card>

//               {/* Gallery */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Gallery</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {vendor.gallery?.map((image, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         whileInView={{ opacity: 1, scale: 1 }}
//                         viewport={{ once: true }}
//                         transition={{ delay: index * 0.1 }}
//                         className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-secondary"
//                         onClick={() => {
//                           setSelectedIndex(index)
//                           setZoom(1)
//                         }}
//                       >
//                         <Image
//                           src={image}
//                           alt={`Gallery ${index + 1}`}
//                           fill
//                           loading="lazy"
//                           quality={50}
//                           className="object-cover"
//                           placeholder="blur"
//                           blurDataURL="/blur.png"
//                         />
//                       </motion.div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Sidebar - Services */}
//             <div className="space-y-8">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Services & Pricing</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {vendor.services?.map((service) => (
//                     <div
//                       key={service.id}
//                       className="p-4 bg-secondary/30 rounded-lg border border-border"
//                     >
//                       <div className="flex justify-between items-start gap-4">
//                         <div>
//                           <h4 className="font-semibold text-foreground">{service.name}</h4>
//                           <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
//                         </div>
//                         <div className="text-right shrink-0">
//                           <div className="font-bold text-primary">{formatPrice(service.price || 0)}</div>
//                           <span className="text-xs text-muted-foreground capitalize">{service.priceType}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>

//               {/* Quick Contact Card */}
//               <Card className="bg-primary text-primary-foreground">
//                 <CardContent className="p-6 text-center">
//                   <h3 className="font-serif text-xl font-semibold mb-2">Interested?</h3>
//                   <p className="text-primary-foreground/80 text-sm mb-4">
//                     Get in touch with {vendor.name} today
//                   </p>
//                   {vendor.whatsapp && (
//                     <Button
//                       onClick={() => handleContactClick('whatsapp')}
//                       className="w-full bg-white text-primary hover:bg-white/90"
//                     >
//                       <MessageCircle className="h-4 w-4 mr-2" />
//                       Contact via WhatsApp
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//               {showInquiry && (
//                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//                   <div className="bg-white p-6 rounded-xl w-full max-w-md">

//                     <h2 className="text-xl font-bold mb-4">Send Inquiry</h2>

//                     <input
//                       placeholder="Your Name"
//                       className="w-full border p-2 mb-3"
//                       value={inquiryData.name}
//                       onChange={(e) =>
//                         setInquiryData({ ...inquiryData, name: e.target.value })
//                       }
//                     />

//                     <input
//                       placeholder="Phone"
//                       className="w-full border p-2 mb-3"
//                       value={inquiryData.phone}
//                       onChange={(e) =>
//                         setInquiryData({ ...inquiryData, phone: e.target.value })
//                       }
//                     />
//                     <p className="text-sm text-muted-foreground mb-1"><b>Event Date</b></p>
//                     <input
//                       type="date"
//                       className="w-full border p-2 mb-3"
//                       value={inquiryData.event_date}
//                       onChange={(e) =>
//                         setInquiryData({ ...inquiryData, event_date: e.target.value })
//                       }
//                     />

// <textarea
//   placeholder="Message"
//   className="w-full border p-2 mb-3"
//   value={inquiryData.message}
//   onChange={(e) =>
//     setInquiryData({ ...inquiryData, message: e.target.value })
//   }
// />

//                     <div className="flex gap-3">
//                       <Button
//                         onClick={async () => {
//                           if (!inquiryData.name || !inquiryData.phone) {
//                             toast.error("Name & Phone are required")
//                             return
//                           }

//                           try {
//                             console.log("Sending inquiry...", inquiryData)

//                             await insertInquiry({
//                               vendorId: vendor.id,
//                               userId: user?.id || null,
//                               name: inquiryData.name,
//                               phone: inquiryData.phone,
//                               event_date: inquiryData.event_date || null,
//                               message: inquiryData.message,
//                             })

//                             // ✅ SEND EMAIL
//                             await fetch("/api/send-inquiry-email", {
//                               method: "POST",
//                               headers: {
//                                 "Content-Type": "application/json",
//                               },
//                               body: JSON.stringify({
//                                 vendorId: vendor.id,
//                                 name: inquiryData.name,
//                                 phone: inquiryData.phone,
//                                 message: inquiryData.message,
//                               }),
//                             })

//                             toast.success("Inquiry sent successfully!")

//                             setInquiryData({
//                               name: '',
//                               phone: '',
//                               event_date: '',
//                               message: '',
//                             })

//                             setShowInquiry(false)

//                           } catch (err) {
//                             console.error(err)
//                             toast.error("Failed to send inquiry")
//                           }
//                         }}
//                       >
//                         Submit
//                       </Button>

//                       <Button variant="outline" onClick={() => setShowInquiry(false)}>
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main >

//       <Footer />
//       {/* ✅ FULLSCREEN VIEWER */}
//       {
//         selectedIndex !== null && (
//           <div
//             className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
//             onClick={() => setSelectedIndex(null)}
//           >
//             {/* CLOSE */}
//             <button aria-label="Open menu"
//               className="absolute top-4 right-4 text-white text-3xl"
//               onClick={() => setSelectedIndex(null)}
//             >
//               ✕
//             </button>


//             {/* IMAGE */}
//             <div
//               className="flex items-center justify-center w-full h-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={vendor.gallery?.[selectedIndex]}
//                 className="max-h-[90%] max-w-[90%]"
//                 style={{ transform: `scale(${zoom})` }}
//               />
//             </div>

//             {/* PREV */}
//             <button aria-label="Open menu"
//               className="absolute left-4 text-white text-4xl"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 setSelectedIndex((prev) =>
//                   prev === 0 ? gallery.length - 1 : (prev as number) - 1
//                 )
//               }}
//             >
//               ‹
//             </button>

//             {/* NEXT */}
//             <button aria-label="Open menu"
//               className="absolute right-4 text-white text-4xl"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 setSelectedIndex((prev) =>
//                   prev === gallery.length - 1 ? 0 : (prev as number) + 1
//                 )
//               }}
//             >
//               ›
//             </button>

//             {/* ZOOM */}
//             <div className="absolute bottom-6 flex gap-4">
//               <button aria-label="Open menu"
//                 className="bg-white px-3 py-1 rounded"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   setZoom((z) => Math.max(1, z - 0.5))
//                 }}
//               >
//                 -
//               </button>
//               <button aria-label="Open menu"
//                 className="bg-white px-3 py-1 rounded"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   setZoom((z) => z + 0.5)
//                 }}
//               >
//                 +
//               </button>
//             </div>
//           </div>
//         )
//       }
//     </div >
//   )
// }

// export default function VendorProfilePage({ params }: { params: Promise<{ id: string }> }) {
//   const router = useRouter()
//   const { user, isLoading: authLoading } = useAuth()
//   const [vendor, setVendor] = useState<Vendor | null>(null)
//   const [isLoading, setIsLoading] = useState(true)


//   useEffect(() => {
//     if (authLoading) return

//     const fetchVendor = async () => {
//       setIsLoading(true)

//       try {
//         // ✅ Get vendor (slug OR id)
//         let { data } = await supabase
//           .from('vendors')
//           .select('*')
//           .eq('slug', resolvedParams.id)
//           .maybeSingle()

//         if (!data) {
//           const res = await supabase
//             .from('vendors')
//             .select('*')
//             .eq('id', resolvedParams.id)
//             .maybeSingle()

//           data = res.data
//         }

//         if (!data) {
//           setVendor(null)
//           return
//         }

//         const vendorId = data.id

//         // ✅ PARALLEL FETCH (FAST ⚡)
//         const [
//           { data: images },
//           { data: services },
//           { count: viewsCount },
//           { count: favCount },
//         ] = await Promise.all([
//           supabase
//             .from('vendor_images')
//             .select('image_url')
//             .eq('vendor_id', vendorId),

//           supabase
//             .from('services')
//             .select('*')
//             .eq('vendor_id', vendorId),

//           supabase
//             .from('profile_views')
//             .select('*', { count: 'exact', head: true })
//             .eq('vendor_id', vendorId),

//           supabase
//             .from('favorites')
//             .select('*', { count: 'exact', head: true })
//             .eq('vendor_id', vendorId),
//         ])

//         setVendor({
//           ...data,
//           coverImage: data.cover_image || '/placeholder.jpg',
//           profileImage: data.profile_image || '/placeholder.jpg',
//           gallery: images?.map((img) => img.image_url) || [],
//           services: services || [],
//           views: viewsCount || 0,
//           favoritesCount: favCount || 0,
//           minPrice: Number(data.min_price) || 0,
//           maxPrice: Number(data.max_price) || 0,
//           isPremium: data.is_premium,
//         })

//       } catch (err) {
//         console.error(err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if(!resolvedParams.id) return

//     fetchVendor()
//   }, [resolvedParams.id, authLoading])

//   if (authLoading || isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   if (!vendor) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center">
//         <h1 className="text-2xl font-bold mb-4">Vendor not found</h1>
//         <Link href="/vendors">
//           <Button>Browse Vendors</Button>
//         </Link>
//       </div>
//     )
//   }

//   return (
//     <FavoritesProvider>
//       <VendorProfileContent vendor={vendor} setVendor={setVendor} />
//     </FavoritesProvider>
//   )
// }

