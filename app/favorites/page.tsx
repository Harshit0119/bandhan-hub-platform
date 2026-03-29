'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { VendorCard } from '@/components/vendor-card'
import { useAuth } from '@/lib/auth-context'
import { useFavorites, FavoritesProvider } from '@/lib/favorites-store'
import { Vendor } from '@/lib/types'
import { Heart, Clock, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

const formatVendor = (v: any): Vendor => ({
  ...v,
  coverImage: v.cover_image || '/placeholder.jpg',
  profileImage: v.profile_image || '/placeholder.jpg',
  gallery: [],
  services: [],
  views: 0,
  favoritesCount: 0,
  minPrice: v.min_price,
  maxPrice: v.max_price,
  isPremium: v.is_premium,
})


function FavoritesContent() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { favorites, recentlyViewed } = useFavorites()
  const [favoriteVendors, setFavoriteVendors] = useState<Vendor[]>([])
  const [recentVendors, setRecentVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setIsLoading(true)

      // FAVORITES
      const { data: favs } = await supabase
        .from('favorites')
        .select('vendor_id')
        .eq('user_id', user.id)

      const favIds = favs?.map(f => f.vendor_id) || []

      let favVendors: Vendor[] = []
      if (favIds.length > 0) {
        const { data } = await supabase
          .from('vendors')
          .select('*')
          .in('id', favIds)

        favVendors = data?.map(formatVendor) || []
      }

      // RECENT
      const { data: rec } = await supabase
        .from('recently_viewed')
        .select('vendor_id')
        .eq('user_id', user.id)

      const recIds = rec?.map(r => r.vendor_id) || []

      let recVendors: Vendor[] = []
      if (recIds.length > 0) {
        const { data } = await supabase
          .from('vendors')
          .select('*')
          .in('id', recIds)

        recVendors = data?.map(formatVendor) || []
      }

      setFavoriteVendors(favVendors)
      setRecentVendors(recVendors)
      setIsLoading(false)
    }

    fetchData()
  }, [user])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your Collection
            </h1>
            <p className="text-muted-foreground mb-8">
              Vendors you&apos;ve saved and recently viewed
            </p>

            <Tabs defaultValue="favorites" className="space-y-8">
              <TabsList>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites ({favoriteVendors.length})
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recently Viewed ({recentVendors.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="favorites">
                {favoriteVendors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteVendors.map((vendor, index) => (
                      <VendorCard key={vendor.id} vendor={vendor} index={index} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Heart}
                    title="No favorites yet"
                    description="Browse vendors and click the heart icon to save them here"
                    actionLabel="Explore Vendors"
                    actionHref="/vendors"
                  />
                )}
              </TabsContent>

              <TabsContent value="recent">
                {recentVendors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recentVendors.map((vendor, index) => (
                      <VendorCard key={vendor.id} vendor={vendor} index={index} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Clock}
                    title="No recently viewed vendors"
                    description="Start exploring vendors to see your history here"
                    actionLabel="Explore Vendors"
                    actionHref="/vendors"
                  />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

interface EmptyStateProps {
  icon: React.ElementType
  title: string
  description: string
  actionLabel: string
  actionHref: string
}

function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <div className="inline-flex p-4 bg-secondary rounded-full mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      <Link href={actionHref}>
        <Button className="bg-primary text-primary-foreground">
          {actionLabel}
        </Button>
      </Link>
    </motion.div>
  )
}

export default function FavoritesPage() {
  return (
    <FavoritesProvider>
      <FavoritesContent />
    </FavoritesProvider>
  )
}
