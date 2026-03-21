'use client'

import { useAuth } from '@/lib/auth-context'
import { useFavorites } from '@/lib/favorites-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockVendors, getVendorById } from '@/lib/mock-data'
import { Eye, Heart, MousePointer, TrendingUp, Star, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { user } = useAuth()
  const { recentlyViewed } = useFavorites()

  // TODO: Get actual vendor data from Supabase
  const vendorData = user?.vendorId ? mockVendors[0] : null

  const stats = [
    { 
      label: 'Profile Views', 
      value: vendorData?.views.toLocaleString() || '0', 
      icon: Eye, 
      change: '+12%',
      color: 'text-blue-600 bg-blue-100'
    },
    { 
      label: 'Contact Clicks', 
      value: vendorData?.contactClicks.toString() || '0', 
      icon: MousePointer, 
      change: '+8%',
      color: 'text-green-600 bg-green-100'
    },
    { 
      label: 'Favorites', 
      value: vendorData?.favoritesCount.toString() || '0', 
      icon: Heart, 
      change: '+5%',
      color: 'text-pink-600 bg-pink-100'
    },
    { 
      label: 'Leads Generated', 
      value: '23', 
      icon: TrendingUp, 
      change: '+15%',
      color: 'text-purple-600 bg-purple-100'
    },
  ]

  const recentVendors = recentlyViewed
    .slice(0, 4)
    .map(id => getVendorById(id))
    .filter(Boolean)

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your profile today.
          </p>
        </div>

        {/* Subscription Status */}
        {vendorData && (
          <Card className="mb-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {vendorData.isPremium ? 'Premium' : 'Free Plan'}
                  </Badge>
                  {vendorData.isPremium && (
                    <Star className="h-5 w-5 fill-accent text-accent" />
                  )}
                </div>
                <h3 className="text-xl font-semibold">
                  {vendorData.isPremium 
                    ? 'Your profile is featured on the homepage!' 
                    : 'Upgrade to Premium for more visibility'}
                </h3>
                <p className="text-primary-foreground/80 mt-1">
                  {vendorData.isPremium 
                    ? 'You are getting maximum exposure to couples searching for vendors.' 
                    : 'Get featured on homepage, priority listing, and more leads.'}
                </p>
              </div>
              {!vendorData.isPremium && (
                <Link href="/dashboard/subscription">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Upgrade Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
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
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change} this week</p>
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
                <Button variant="outline" className="w-full justify-start">
                  Edit Profile
                </Button>
              </Link>
              <Link href="/dashboard/services">
                <Button variant="outline" className="w-full justify-start">
                  Manage Services & Pricing
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button variant="outline" className="w-full justify-start">
                  View Analytics
                </Button>
              </Link>
              <Link href={`/vendor/${user?.vendorId || '1'}`}>
                <Button variant="outline" className="w-full justify-start">
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
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0">
                      1
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add high-quality photos to your gallery
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0">
                      2
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Keep your pricing information up to date
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0">
                      3
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Respond to inquiries quickly via WhatsApp
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0">
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
      </motion.div>
    </div>
  )
}
