// app\dashboard\layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { FavoritesProvider } from '@/lib/favorites-store'
import Image from 'next/image'
import {
  LayoutDashboard,
  User,
  Package,
  BarChart3,
  CreditCard,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Loader2, Mail } from 'lucide-react'

const sidebarLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Inquiries', href: '/dashboard/inquiries', icon: Mail },
  { name: 'Services & Pricing', href: '/dashboard/services', icon: Package },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
]

function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/bandhan-hublogo.png"
            alt="BandhanHub Logo"
            className="h-35 mb-0 -ml-1=5"
            width={210}
            height={1}
            placeholder="blur"
            blurDataURL="/blur.png"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{link.name}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login')
      } else if (!user.isVendor) {
        router.push('/vendors')
      }
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    router.push('/signup')
    return
  }

  return (
    <FavoritesProvider>
      <div className="min-h-screen flex bg-background">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-card border-r border-border">
          <DashboardSidebar />
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 justify-center">
            <Image
              src="/bandhan-hublogo.png"
              alt="BandhanHub Logo"
              className="h-29 -ml-10"
              width={210}
              height={1}
              placeholder="blur"
              blurDataURL="/blur.png"
            />
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <DashboardSidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:pt-0 pt-16">
          {children}
        </main>
      </div>
    </FavoritesProvider>
  )
}
