'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mockVendors } from '@/lib/mock-data'
import { Eye, Heart, MousePointer, TrendingUp, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AnalyticsPage() {
  // TODO: Fetch from Supabase
  const vendorData = mockVendors[0]

  // Mock analytics data
  const weeklyViews = [
    { day: 'Mon', views: 45 },
    { day: 'Tue', views: 52 },
    { day: 'Wed', views: 38 },
    { day: 'Thu', views: 65 },
    { day: 'Fri', views: 78 },
    { day: 'Sat', views: 95 },
    { day: 'Sun', views: 82 },
  ]

  const maxViews = Math.max(...weeklyViews.map(d => d.views))

  const stats = [
    { 
      label: 'Total Profile Views', 
      value: vendorData.views.toLocaleString(), 
      icon: Eye, 
      change: '+12%',
      description: 'vs last month'
    },
    { 
      label: 'Contact Clicks', 
      value: vendorData.contactClicks.toString(), 
      icon: MousePointer, 
      change: '+8%',
      description: 'WhatsApp, Instagram, Call'
    },
    { 
      label: 'Profile Favorites', 
      value: vendorData.favoritesCount.toString(), 
      icon: Heart, 
      change: '+5%',
      description: 'couples saved your profile'
    },
    { 
      label: 'Conversion Rate', 
      value: `${((vendorData.contactClicks / vendorData.views) * 100).toFixed(1)}%`, 
      icon: TrendingUp, 
      change: '+2%',
      description: 'views to contact'
    },
  ]

  const topSources = [
    { source: 'Homepage Featured', visits: 1250, percentage: 51 },
    { source: 'Category Search', visits: 680, percentage: 28 },
    { source: 'Direct Link', visits: 320, percentage: 13 },
    { source: 'City Filter', visits: 200, percentage: 8 },
  ]

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your profile performance and engagement
          </p>
        </div>

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
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Views
              </CardTitle>
              <CardDescription>Profile views over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-48 gap-2">
                {weeklyViews.map((data, index) => (
                  <motion.div
                    key={data.day}
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.views / maxViews) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div 
                      className="w-full bg-primary/80 rounded-t-md hover:bg-primary transition-colors cursor-pointer"
                      style={{ height: '100%' }}
                    />
                    <span className="text-xs text-muted-foreground">{data.day}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                <span>Total: {weeklyViews.reduce((sum, d) => sum + d.views, 0)} views</span>
                <span>Peak: Saturday ({Math.max(...weeklyViews.map(d => d.views))} views)</span>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Traffic Sources
              </CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSources.map((source, index) => (
                  <motion.div
                    key={source.source}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{source.source}</span>
                      <span className="text-sm text-muted-foreground">{source.visits} visits</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${source.percentage}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{source.percentage}%</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Tips */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Tips to improve your profile visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-green-600 font-semibold mb-2">Great!</div>
                  <p className="text-sm text-green-700">
                    Your contact rate is above average. Couples are interested in your services!
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-amber-600 font-semibold mb-2">Tip</div>
                  <p className="text-sm text-amber-700">
                    Add more photos to your gallery. Profiles with 6+ images get 40% more views.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-blue-600 font-semibold mb-2">Suggestion</div>
                  <p className="text-sm text-blue-700">
                    Update your pricing info. Profiles with clear pricing get 25% more inquiries.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
