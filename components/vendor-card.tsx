// components/vendor-card.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Heart, Eye, MapPin, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { useFavorites } from '@/lib/favorites-store'
import { Vendor } from '@/lib/types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState, memo, useCallback } from 'react'

interface VendorCardProps {
  vendor: Vendor
  index?: number
}

function VendorCardComponent({ vendor, index = 0 }: VendorCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  const [imgError, setImgError] = useState(false)

  // ✅ memoized handlers (avoid re-renders)
  const handleClick = useCallback(() => {
    router.push(`/vendor/${vendor.slug || vendor.id}`)
  }, [router, vendor.slug, vendor.id])

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()

      if (!user) {
        router.push('/signup')
        return
      }

      if (isFavorite(vendor.id)) {
        removeFavorite(vendor.id)
      } else {
        addFavorite(vendor.id)
      }
    },
    [user, router, vendor.id, isFavorite, addFavorite, removeFavorite]
  )

  const formatPrice = (price: number) => {
    if (!price) return '0'
    if (price >= 100000) return `${(price / 100000).toFixed(1)}L`
    return `${(price / 1000).toFixed(0)}K`
  }

  return (
    <motion.div
      initial={index < 8 ? { opacity: 0, y: 15 } : false} // ✅ animate only first few
      whileInView={index < 8 ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        onClick={handleClick}
        className="group overflow-hidden cursor-pointer transition-all duration-300 border-border bg-card hover:shadow-lg active:scale-[0.98]"
      >
        {/* IMAGE */}
        <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
          <Image
            src={
              imgError
                ? '/placeholder.png'
                : vendor.profileImage || '/placeholder.png'
            }
            alt={vendor.name || 'Vendor'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            priority={index < 2} // 🚀 only first 2 preload
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

          {/* PREMIUM BADGE */}
          {vendor.isPremium && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}

          {/* FAVORITE */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white",
              isFavorite(vendor.id)
                ? "text-primary"
                : "text-foreground/60"
            )}
            onClick={handleFavoriteClick}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isFavorite(vendor.id) && "fill-current"
              )}
            />
          </Button>

          {/* STATS */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{vendor.views || 0}</span>
            </div>

            {/* <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{vendor.favoritesCount || 0}</span>
            </div> */}
          </div>

          {/* PRICE */}
          <div className="absolute bottom-3 right-3 bg-white/90 text-foreground px-2 py-1 rounded text-xs sm:text-sm font-semibold">
            ₹{formatPrice(vendor.minPrice || 0)} - ₹{formatPrice(vendor.maxPrice || 0)}
          </div>
        </div>

        {/* CONTENT */}
        <CardContent className="p-4">
          <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {vendor.name || 'Unnamed Vendor'}
          </h3>

          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {vendor.category || 'Category'}
          </p>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {vendor.city || 'Location'}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ✅ MEMO = BIG PERFORMANCE BOOST
export const VendorCard = memo(VendorCardComponent)
