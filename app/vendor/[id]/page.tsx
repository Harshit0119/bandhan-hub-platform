'use client'

import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { useFavorites, FavoritesProvider } from '@/lib/favorites-store'
import { getVendorById } from '@/lib/mock-data'
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
  Loader2,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface VendorProfileContentProps {
  vendor: Vendor
}

function VendorProfileContent({ vendor }: VendorProfileContentProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { isFavorite, addFavorite, removeFavorite, addRecentlyViewed } = useFavorites()

  useEffect(() => {
    if (user) {
      // TODO: Track profile view in Supabase
      addRecentlyViewed(vendor.id)
    }
  }, [vendor.id, user, addRecentlyViewed])

  const handleFavoriteClick = () => {
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

  const handleContactClick = (type: 'whatsapp' | 'instagram' | 'phone') => {
    // TODO: Track contact click in Supabase
    let url = ''
    switch (type) {
      case 'whatsapp':
        url = `https://wa.me/${vendor.whatsapp?.replace(/\D/g, '')}`
        break
      case 'instagram':
        url = `https://instagram.com/${vendor.instagram}`
        break
      case 'phone':
        url = `tel:${vendor.phone}`
        break
    }
    window.open(url, '_blank')
  }

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lakh`
    }
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 lg:h-96">
          <Image
            src={vendor.coverImage}
            alt={`${vendor.name} cover`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="container mx-auto px-4 -mt-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="shrink-0 -mt-20 md:-mt-16">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-card shadow-lg">
                    <Image
                      src={vendor.profileImage}
                      alt={vendor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                          {vendor.name}
                        </h1>
                        {vendor.isPremium && (
                          <Badge className="bg-accent text-accent-foreground">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1">{vendor.category}</p>
                      <div className="flex items-center gap-1 text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4" />
                        <span>{vendor.city}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          "rounded-full",
                          isFavorite(vendor.id) && "text-primary border-primary"
                        )}
                        onClick={handleFavoriteClick}
                      >
                        <Heart className={cn("h-5 w-5", isFavorite(vendor.id) && "fill-current")} />
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 mt-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{vendor.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{vendor.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span>{vendor.favoritesCount} favorites</span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mt-4 p-4 bg-secondary/50 rounded-lg inline-block">
                    <span className="text-sm text-muted-foreground">Starting from</span>
                    <div className="text-xl font-bold text-primary">
                      {formatPrice(vendor.minPrice)} - {formatPrice(vendor.maxPrice)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border">
                {vendor.whatsapp && (
                  <Button 
                    onClick={() => handleContactClick('whatsapp')}
                    className="bg-[#25D366] hover:bg-[#20BD5C] text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                )}
                {vendor.instagram && (
                  <Button 
                    variant="outline"
                    onClick={() => handleContactClick('instagram')}
                    className="border-[#E4405F] text-[#E4405F] hover:bg-[#E4405F]/10"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Button>
                )}
                {vendor.phone && (
                  <Button 
                    variant="outline"
                    onClick={() => handleContactClick('phone')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 pb-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{vendor.about}</p>
                </CardContent>
              </Card>

              {/* Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {vendor.gallery.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-secondary"
                      >
                        <Image
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Services */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Services & Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vendor.services.map((service) => (
                    <div
                      key={service.id}
                      className="p-4 bg-secondary/30 rounded-lg border border-border"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{service.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-primary">{formatPrice(service.price)}</div>
                          <span className="text-xs text-muted-foreground capitalize">{service.priceType}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Contact Card */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <h3 className="font-serif text-xl font-semibold mb-2">Interested?</h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Get in touch with {vendor.name} today
                  </p>
                  {vendor.whatsapp && (
                    <Button 
                      onClick={() => handleContactClick('whatsapp')}
                      className="w-full bg-white text-primary hover:bg-white/90"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact via WhatsApp
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function VendorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    // If not logged in, redirect to signup
    if (!user) {
      router.push('/signup')
      return
    }

    // TODO: Fetch vendor from Supabase
    const foundVendor = getVendorById(resolvedParams.id)
    if (foundVendor) {
      setVendor(foundVendor)
    }
    setIsLoading(false)
  }, [resolvedParams.id, user, authLoading, router])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Vendor not found</h1>
        <Link href="/vendors">
          <Button>Browse Vendors</Button>
        </Link>
      </div>
    )
  }

  return (
    <FavoritesProvider>
      <VendorProfileContent vendor={vendor} />
    </FavoritesProvider>
  )
}
