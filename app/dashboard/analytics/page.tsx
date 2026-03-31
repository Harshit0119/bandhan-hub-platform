//app\dashboard\analytics\page.tsx
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
  Lock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  useEffect(() => {
    if (!user?.id) return

    const fetchAnalytics = async () => {
      setLoading(true)

      // ✅ get vendorId
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

      // ✅ counts
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

      // ✅ RPC for graph (ONLY if premium)
      if (isPremium) {
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
      }

      setLoading(false)
    }

    fetchAnalytics()
  }, [user, isPremium])

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

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your performance & grow your business
        </p>
      </div>

      {/* STATS */}
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

      {/* CONVERSION (PREMIUM LOCK) */}
      <Card className="relative">
        {!isPremium && (
          <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4" />
              Premium Feature
            </div>
          </div>
        )}

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Conversion Rate
          </CardTitle>
        </CardHeader>

        <CardContent className={cn(!isPremium && "blur-sm")}>
          <div className="text-4xl font-bold text-primary">
            {conversionRate}%
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {stats.contacts} contacts from {stats.views} views
          </p>
        </CardContent>
      </Card>

      {/* GRAPH (PREMIUM LOCK) */}
      <Card className="relative">
        {!isPremium && (
          <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4" />
              Upgrade to see trends
            </div>
          </div>
        )}

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Views
          </CardTitle>
        </CardHeader>

        <CardContent className={cn(!isPremium && "blur-sm")}>
          <div className="flex items-end gap-3 h-48">
            {safeWeekly.map((d, i) => (
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
        </CardContent>
      </Card>

      {/* INSIGHTS */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded">
            <p className="font-semibold text-green-600">Performance</p>
            <p className="text-sm">
              {stats.views > 50
                ? 'Great traction 🚀'
                : 'Keep sharing your profile'}
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded">
            <p className="font-semibold text-yellow-600">Tip</p>
            <p className="text-sm">
              Add more images to increase trust
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded">
            <p className="font-semibold text-blue-600">Action</p>
            <p className="text-sm">
              Share your profile on WhatsApp groups
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}