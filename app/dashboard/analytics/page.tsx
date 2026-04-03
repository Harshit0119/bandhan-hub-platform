// app\dashboard\analytics\page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Eye,
  Heart,
  MousePointer,
  MessageSquare,
  Calendar,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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

  const isPremium = user?.isPremium

  // 🔒 Premium Overlay Component
  const PremiumOverlay = () => (
    <div
      onClick={() => toast("Upgrade to unlock premium features 🚀")}
      className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
    >
      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium shadow">
        🔒 Unlock growth insights
      </div>
    </div>
  )

  useEffect(() => {
    if (!user?.id) return

    const fetchAnalytics = async () => {
      setLoading(true)

      const { data: vendorData } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!vendorData) {
        setLoading(false)
        return
      }

      const vendorId = vendorData.id

      const [viewsRes, favRes, contactRes, inquiryRes] = await Promise.all([
        supabase.from('profile_views').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId),
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId),
        supabase.from('contact_clicks').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId),
      ])

      setStats({
        views: viewsRes.count || 0,
        favorites: favRes.count || 0,
        contacts: contactRes.count || 0,
        inquiries: inquiryRes.count || 0,
      })

      const { data } = await supabase.rpc('get_views_by_day', {
        vendor_id_input: vendorId,
      })

      const formatted =
        data?.slice(-7).map((d: any) => ({
          day: new Date(d.day).toLocaleDateString('en-US', {
            weekday: 'short',
          }),
          views: d.views,
        })) || []

      setWeeklyViews(formatted)

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

  const safeWeekly = weeklyViews.length
    ? weeklyViews
    : [
      { day: 'Mon', views: 0 },
      { day: 'Tue', views: 0 },
      { day: 'Wed', views: 0 },
      { day: 'Thu', views: 0 },
      { day: 'Fri', views: 0 },
      { day: 'Sat', views: 0 },
      { day: 'Sun', views: 0 },
    ]

  const maxViews = Math.max(...safeWeekly.map((d) => d.views), 1)

  const conversionRate =
    stats.views > 0
      ? ((stats.contacts / stats.views) * 100).toFixed(1)
      : '0'

  const peakDay = safeWeekly.reduce((max, curr) =>
    curr.views > max.views ? curr : max,
    safeWeekly[0]
  )

  const avgViews =
    safeWeekly.reduce((sum, d) => sum + d.views, 0) / safeWeekly.length

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your performance & grow your business
        </p>
      </div>

      {/* TOP STATS (ALWAYS VISIBLE) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Views', value: stats.views, icon: Eye },
          { label: 'Favorites', value: stats.favorites, icon: Heart },
          { label: 'Contacts', value: stats.contacts, icon: MousePointer },
          { label: 'Inquiries', value: stats.inquiries, icon: MessageSquare },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i}>
              <CardContent className="p-6 flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <Icon className="text-primary" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* GRAPH */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Views
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="relative">

            {!isPremium && <PremiumOverlay />}

            <div className={cn(!isPremium && "blur-sm pointer-events-none")}>
              <div className="flex items-end gap-3 h-48">
                {safeWeekly.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: (d.views / maxViews) * 180 }}
                      className="w-full bg-primary rounded-t-md"
                    />
                    <span className="text-xs">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* INSIGHT CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Peak Day */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              {!isPremium && <PremiumOverlay />}
              <div className={cn(!isPremium && "blur-sm pointer-events-none")}>
                <p className="text-sm text-muted-foreground">Peak Day</p>
                <p className="text-2xl font-bold">{peakDay.day}</p>
                <p className="text-xs text-muted-foreground">{peakDay.views} views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              {!isPremium && <PremiumOverlay />}
              <div className={cn(!isPremium && "blur-sm pointer-events-none")}>
                <p className="text-sm text-muted-foreground">Avg Daily Views</p>
                <p className="text-2xl font-bold">{avgViews.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              {!isPremium && <PremiumOverlay />}
              <div className={cn(!isPremium && "blur-sm pointer-events-none")}>
                <p className="text-sm text-muted-foreground">Conversion</p>
                <p className="text-2xl font-bold">{conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* INSIGHTS */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded">
            <p className="font-semibold text-green-600">Performance</p>
            <p className="text-sm"> {stats.views > 50 ? 'Great traction 🚀' : 'Keep sharing your profile'} </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded">
            <p className="font-semibold text-yellow-600">Tip</p>
            <p className="text-sm"> Add more images to increase trust </p>
          </div>
          <div className="p-4 bg-blue-50 rounded"> <p className="font-semibold text-blue-600">Action</p> <p className="text-sm"> Share your profile on WhatsApp groups </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}