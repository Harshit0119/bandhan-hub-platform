'use client'

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Heart, MousePointer, TrendingUp, Star, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { RecentLeads } from '@/components/recent-leads'

export default function DashboardPage() {
  const { user } = useAuth()

  const [stats, setStats] = useState({
    views: 0,
    favorites: 0,
    contacts: 0,
    inquiries: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recentVendors, setRecentVendors] = useState<any[]>([])

  useEffect(() => {
    if (!user?.vendorId) return

    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        const vendorId = user.vendorId

        const [
          { count: views },
          { count: favorites },
          { count: contacts },
          { count: inquiries },
        ] = await Promise.all([
          supabase
            .from('profile_views')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendorId),

          supabase
            .from('favorites')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendorId),

          supabase
            .from('contact_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendorId),

          supabase
            .from('inquiries')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendorId),
        ])

        setStats({
          views: views || 0,
          favorites: favorites || 0,
          contacts: contacts || 0,
          inquiries: inquiries || 0,
        })

        // Fetch recently viewed vendors for non-vendors
        if (!user?.isVendor) {
          const { data } = await supabase
            .from('recently_viewed')
            .select('vendor_id, vendors(*)')
            .eq('user_id', user?.id)
            .order('viewed_at', { ascending: false })
            .limit(5)

          const vendors = data?.map((item: any) => item.vendors).filter(Boolean) || []
          setRecentVendors(vendors)
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  // 🔹 LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // 🔹 ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  // 🔹 SAFETY
  if (!user?.vendorId) {
    return (
      <div className="p-6">
        <p>No vendor profile found.</p>
      </div>
    )
  }

  const statsData = [
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
  ]

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* 🔥 HEADER */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your performance and grow your business 🚀
          </p>
        </div>

        {/* 💰 SUBSCRIPTION */}
        <Card className="mb-8 bg-linear-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {user?.isPremium ? 'Premium Plan' : 'Free Plan'}
                </Badge>

                {user?.isPremium && (
                  <Star className="h-5 w-5 fill-accent text-accent" />
                )}
              </div>

              <h3 className="text-xl font-semibold">
                {user?.isPremium
                  ? 'You are getting maximum visibility 🚀'
                  : 'Get more leads & bookings'}
              </h3>

              <p className="text-primary-foreground/80 mt-1">
                {user?.isPremium
                  ? 'Your profile is prioritized in search results.'
                  : 'Upgrade to get featured & receive more inquiries.'}
              </p>
            </div>

            {!user?.isPremium && (
              <Link href="/dashboard/subscription">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-foreground mt-1">
                          {stat.value}
                        </p>
                      </div>

                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Latest customer inquiries</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {stats.inquiries === 0 ? (
              <p className="text-muted-foreground text-sm">
                No leads yet
              </p>
            ) : (
              <RecentLeads />
            )}

            <Link href="/dashboard/inquiries">
              <Button variant="outline" className="w-full mt-2">
                View All Leads
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions & Recently Viewed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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