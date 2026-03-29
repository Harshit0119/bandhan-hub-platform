'use client'

import Image from 'next/image'
import Link from 'next/link'
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

interface VendorCardProps {
  vendor: Vendor
  index?: number
}

export function VendorCard({ vendor, index = 0 }: VendorCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  const handleClick = () => {
      router.push(`/vendor/${vendor.id}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
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
  }

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `${(price / 100000).toFixed(1)}L`
    }
    return `${(price / 1000).toFixed(0)}K`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-border bg-card"
        onClick={handleClick}
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={vendor.profileImage}
            alt={vendor.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

          {/* Featured Badge */}
          {vendor.isPremium && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 rounded-full bg-white/80 hover:bg-white transition-colors",
              isFavorite(vendor.id) ? "text-primary" : "text-foreground/60"
            )}
            onClick={handleFavoriteClick}
          >
            <Heart className={cn("h-5 w-5", isFavorite(vendor.id) && "fill-current")} />
          </Button>

          {/* Views */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm">
            <Eye className="h-4 w-4" />
            <span>{vendor.views.toLocaleString()}</span>
          </div>

          {/* Price */}
          <div className="absolute bottom-3 right-3 bg-white/90 text-foreground px-2 py-1 rounded text-sm font-semibold">
            ₹{formatPrice(vendor.minPrice)} - ₹{formatPrice(vendor.maxPrice)}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {vendor.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{vendor.category}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4" />
            <span>{vendor.city}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
