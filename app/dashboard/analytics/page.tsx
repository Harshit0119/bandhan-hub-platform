'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Eye,
  Heart,
  MousePointer,
  MessageSquare,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function AnalyticsPage() {
  const { user, isLoading } = useAuth()

  const [stats, setStats] = useState({
    views: 0,
    favorites: 0,
    contacts: 0,
    inquiries: 0,
  })

  const [weeklyViews, setWeeklyViews] = useState<
    { day: string; views: number }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.vendorId) return

    const fetchAnalytics = async () => {
      setLoading(true)

      const vendorId = user.vendorId

      // 🔹 TOTAL COUNTS
      const { count: views } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId)

      const { count: favorites } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId)

      const { count: contacts } = await supabase
        .from('contact_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId)

      const { count: inquiries } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId)

      // 🔹 WEEKLY VIEWS
      const { data: viewsData } = await supabase
        .from('profile_views')
        .select('viewed_at')
        .eq('vendor_id', vendorId)

      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split('T')[0]
      }).reverse()

      const grouped = last7Days.map((date) => {
        const count =
          viewsData?.filter((v) =>
            v.viewed_at.startsWith(date)
          ).length || 0

        return {
          day: new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
          }),
          views: count,
        }
      })

      setWeeklyViews(grouped)

      setStats({
        views: views || 0,
        favorites: favorites || 0,
        contacts: contacts || 0,
        inquiries: inquiries || 0,
      })

      setLoading(false)
    }

    fetchAnalytics()
  }, [user])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const maxViews = Math.max(...weeklyViews.map((d) => d.views), 1)

  // 🔥 NEW: Conversion Rate
  const conversionRate =
    stats.views > 0
      ? ((stats.contacts / stats.views) * 100).toFixed(1)
      : 0

  const totalWeekly = weeklyViews.reduce((sum, d) => sum + d.views, 0)
  const peakDay = weeklyViews.reduce((prev, curr) =>
    curr.views > prev.views ? curr : prev,
    weeklyViews[0] || { day: '', views: 0 }
  )

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your performance & grow your business
        </p>
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Views', value: stats.views, icon: Eye },
          { label: 'Favorites', value: stats.favorites, icon: Heart },
          { label: 'Contacts', value: stats.contacts, icon: MousePointer },
          { label: 'Inquiries', value: stats.inquiries, icon: MessageSquare },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-2">
                    <Icon className="text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* 🔥 CONVERSION */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Conversion Rate
          </CardTitle>
          <CardDescription>
            How many visitors contact you
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="text-4xl font-bold text-primary">
            {conversionRate}%
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {stats.contacts} contacts from {stats.views} views
          </p>
        </CardContent>
      </Card>

      {/* 📊 WEEKLY GRAPH */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Views
          </CardTitle>
          <CardDescription>Last 7 days performance</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-end gap-3 h-48">
            {weeklyViews.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.views / maxViews) * 100}%` }}
                  className="w-full bg-primary rounded-t-md"
                />
                <span className="text-xs">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <span>Total: {totalWeekly} views</span>
            <span>
              Peak: {peakDay?.day} ({peakDay?.views})
            </span>
          </div>
        </CardContent>

        <CardTitle className="gap-2 ml-6">Summary</CardTitle>
        <CardContent className="grid md:grid-cols-3 gap-4">

          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-muted-foreground">Total Weekly Views</p>
            <p className="text-xl font-bold">{totalWeekly}</p>
          </div>

          <div className="p-4 bg-green-50 rounded">
            <p className="text-sm text-muted-foreground">Best Day</p>
            <p className="text-xl font-bold">{peakDay.day}</p>
          </div>

          <div className="p-4 bg-purple-50 rounded">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-xl font-bold">{conversionRate}%</p>
          </div>
        </CardContent>
      </Card>


      {/* 💡 SMART INSIGHTS */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-3 gap-4">

          <div className="p-4 bg-green-50 rounded">
            <p className="font-semibold text-green-600">Strong Performance</p>
            <p className="text-sm">
              Your profile is converting well. Keep sharing your link 🔥
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded">
            <p className="font-semibold text-yellow-600">Growth Tip</p>
            <p className="text-sm">
              Vendors with 5+ images get 2x more inquiries
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded">
            <p className="font-semibold text-blue-600">Action</p>
            <p className="text-sm">
              Share your profile on WhatsApp groups to boost traffic 🚀
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
