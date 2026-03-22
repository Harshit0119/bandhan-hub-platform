'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import React from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, Heart, User, LogOut, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavbarProps {
  transparent?: boolean
}

export function Navbar({ transparent = false }: NavbarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled
      ? "bg-[#8B0000]/95 backdrop-blur-md shadow-lg"
      : isScrolled ? "bg-transparent"
        : "bg-transparent"
      }`}>
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className={`font-serif text-2xl lg:text-3xl font-bold ${transparent ? 'text-white' : 'text-primary'
              }`}>
              Bandhan<span className="text-accent">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/vendors"
              className={`text-sm font-medium transition-colors hover:text-accent ${transparent ? 'text-white/90' : 'text-foreground/80'
                }`}
            >
              All Vendors
            </Link>
            <Link
              href="/vendors?category=Photographer"
              className={`text-sm font-medium transition-colors hover:text-accent ${transparent ? 'text-white/90' : 'text-foreground/80'
                }`}
            >
              Photographers
            </Link>
            <Link
              href="/vendors?category=Wedding Planner"
              className={`text-sm font-medium transition-colors hover:text-accent ${transparent ? 'text-white/90' : 'text-foreground/80'
                }`}
            >
              Planners
            </Link>
            <Link
              href="/vendors?category=Makeup Artist"
              className={`text-sm font-medium transition-colors hover:text-accent ${transparent ? 'text-white/90' : 'text-foreground/80'
                }`}
            >
              Makeup
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/favorites">
                  <Button variant="ghost" size="icon" className={transparent ? 'text-white hover:bg-white/10' : ''}>
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className={transparent ? 'text-white hover:bg-white/10' : ''}>
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {/* <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center gap-2 cursor-pointer">
                        <Heart className="h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className={transparent ? 'text-white hover:bg-white/10' : ''}>
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Join as Vendor
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 ${transparent ? 'text-white' : 'text-foreground'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${transparent ? 'text-white' : 'text-foreground'}`} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link href="/vendors" className="text-foreground/80 py-2" onClick={() => setMobileMenuOpen(false)}>
                All Vendors
              </Link>
              <Link href="/vendors?category=Photographer" className="text-foreground/80 py-2" onClick={() => setMobileMenuOpen(false)}>
                Photographers
              </Link>
              <Link href="/vendors?category=Wedding Planner" className="text-foreground/80 py-2" onClick={() => setMobileMenuOpen(false)}>
                Planners
              </Link>
              <Link href="/vendors?category=Makeup Artist" className="text-foreground/80 py-2" onClick={() => setMobileMenuOpen(false)}>
                Makeup Artists
              </Link>

              <div className="border-t border-border pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/favorites" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Heart className="h-4 w-4" />
                        Favorites
                      </Button>
                    </Link>
                    <Button variant="destructive" className="w-full justify-start gap-2" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Join as Vendor
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
