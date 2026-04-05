// dashboard/page.tsx
'use client'

import { useAuth } from '@/lib/auth-context'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Eye,
  Heart,
  MousePointer,
  TrendingUp,
  Star,
  ArrowRight,
  Loader2,
  Clock,
  Lock
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { RecentLeads } from '@/components/recent-leads'
import { getVendorIdByUserId } from '@/lib/db-actions'
import Image from 'next/image'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { user } = useAuth()

  const [stats, setStats] = useState({
    views: 0,
    favorites: 0,
    contacts: 0,
    inquiries: 0,
  })

  const [loading, setLoading] = useState(true)
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [recentVendors, setRecentVendors] = useState<any[]>([])
  const isPremium = user?.isPremium

  //============== OPTIMIZED FETCH===============
  useEffect(() => {
    if (!user?.id) return

    let isMounted = true

    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // ✅ CENTRALIZED (BEST PRACTICE)
        const vId = await getVendorIdByUserId(user.id)

        if (!vId) {
          setLoading(false)
          return
        }

        if (!isMounted) return
        setVendorId(vId)

        // ✅ PARALLEL QUERIES (FAST)
        const [viewsRes, favRes, contactRes, inquiryRes] = await Promise.all([
          supabase.from('profile_views')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vId),

          supabase
            .from('favorites')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vId),

          supabase
            .from('contact_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vId),

          supabase
            .from('inquiries')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vId),
        ])

        if (!isMounted) return

        setStats({
          views: viewsRes.count || 0,
          favorites: favRes.count || 0,
          contacts: contactRes.count || 0,
          inquiries: inquiryRes.count || 0,
        })

        // Fetch recently viewed vendors for couples
        if (!user?.isVendor) {
          setTimeout(async () => {
            const { data } = await supabase
              .from('recently_viewed')
              .select('vendor:vendor_id(*)')
              .eq('user_id', user?.id)
              .order('created_at', { ascending: false })
              .limit(5)

            if (!isMounted) {
              setRecentVendors(data?.map(item => item.vendor).filter(Boolean) || [])
            }
          }, 0)
        }

      } catch (err) {
        console.error('Dashboard Error:', err)
      } finally {
        if (isMounted)
          setLoading(false)
      }
    }

    fetchDashboardData()

    return () => {
      isMounted = false
    }
  }, [user])

  const statsData = useMemo(() => [
    {
      label: 'Profile Views',
      value: stats.views,
      icon: Eye,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Contact Clicks',
      value: stats.contacts,
      icon: MousePointer,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Favorites',
      value: stats.favorites,
      icon: Heart,
      color: 'text-pink-600 bg-pink-100',
    },
    {
      label: 'Leads Generated',
      value: stats.inquiries,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
    },
  ], [stats])

  // ================= LOADING SKELETON =================
  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6 animate-pulse">
        <div className="h-8 w-60 bg-muted rounded" />
        <div className="h-20 bg-muted rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded" />
          ))}
        </div>
        <div className="h-40 bg-muted rounded" />
      </div>
    )
  }
  if (!vendorId) {
    return (
      <div className="p-6">
        <p>No vendor profile found.</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your performance and grow your business 🚀
          </p>
        </div>

        {/* SUBSCRIPTION */}
        <Card className="mb-8 bg-linear-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {isPremium ? 'Premium Plan' : 'Free Plan'}
                </Badge>

                {isPremium && (
                  <Star className="h-5 w-5 fill-accent text-accent" />
                )}
              </div>

              <h3 className="text-xl font-semibold">
                {isPremium
                  ? 'You are getting maximum visibility 🚀'
                  : 'Get more leads & bookings'}
              </h3>
            </div>

            {/* {!user?.isPremium && ( */}
            {!isPremium && (
              <Link href="/dashboard/subscription">
                <Button className="bg-accent text-accent-foreground">
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat) => {
            const Icon = stat.icon

            return (
              <Card key={stat.label}>
                <CardContent className="p-6 flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* LEADS (Locked for free) */}
        <Card className="relative overflow-hidden">
          {!isPremium && (
            <div
              onClick={() => {
                toast.error('Upgrade to manage leads 🚀')
              }}
              className="absolute inset-0 z-10 backdrop-blur-md bg-white/40 flex flex-col items-center justify-center cursor-pointer"
            >
              <Lock className="mb-2" />
              <p className="font-semibold">Premium Feature</p>
              <p className="text-sm text-muted-foreground">
                Manage leads from dashboard
              </p>
            </div>
          )}
          <CardHeader className={!isPremium ? 'blur-sm' : ''}>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Latest customer inquiries</CardDescription>
          </CardHeader>

          <CardContent className={!isPremium ? 'blur-sm' : ''}>
            {stats.inquiries === 0 ? (
              <p className="text-muted-foreground text-sm">No leads yet</p>
            ) : (
              <RecentLeads />
            )}

            <Link href="/dashboard/inquiries">
              <Button variant="outline" className="w-full mt-3">
                View All Leads
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions & Recently Viewed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your profile and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/profile">
                <Button variant="outline" className="w-full justify-start mb-2">
                  Edit Profile
                </Button>
              </Link>
              <Link href="/dashboard/services">
                <Button variant="outline" className="w-full justify-start mb-2">
                  Manage Services & Pricing
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button variant="outline" className="w-full justify-start mb-2">
                  View Analytics
                </Button>
              </Link>
              <Link href={`/vendor/${user?.vendorId}`}>
                <Button variant="outline" className="w-full justify-start mb-2">
                  Preview Public Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recently Viewed (for couples) */}
          {!user?.isVendor && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recently Viewed
                </CardTitle>
                <CardDescription>Vendors you&apos;ve checked out</CardDescription>
              </CardHeader>
              <CardContent>
                {recentVendors.length > 0 ? (
                  <div className="space-y-3">
                    {recentVendors.map((vendor) => vendor && (
                      <Link key={vendor.id} href={`/vendor/${vendor.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={vendor.profileImage}
                              alt={vendor.name}
                              fill
                              className="object-cover"
                              placeholder="blur"
                              blurDataURL="/blur.png"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{vendor.name}</h4>
                            <p className="text-sm text-muted-foreground">{vendor.category}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No recently viewed vendors yet
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tips for Vendors */}
          {user?.isVendor && (
            <Card>
              <CardHeader>
                <CardTitle>Tips to Get More Leads</CardTitle>
                <CardDescription>Improve your profile visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                      1
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add high-quality photos to your gallery
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                      2
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Keep your pricing information up to date
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                      3
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Respond to inquiries quickly via WhatsApp
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                      4
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to Premium for homepage visibility
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div >
    </div >
  )
}