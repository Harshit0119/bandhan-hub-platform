//app\page.tsx
'use client'

import dynamic from "next/dynamic"
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/home/hero-section'
import { Footer } from '@/components/footer'
import { FavoritesProvider } from '@/lib/favorites-store'

// 🚀 Lazy load heavy sections
const SearchSection = dynamic(() =>
  import('@/components/home/search-section').then(mod => mod.SearchSection),{ ssr: false }
)

const FeaturedVendors = dynamic(() =>
  import('@/components/home/featured-vendors'),
  {ssr: false }
)

const CategoriesSection = dynamic(() =>
  import('@/components/home/categories-section').then(mod => mod.CategoriesSection),{ ssr: false }
)

const TestimonialsSection = dynamic(() =>
  import('@/components/home/testimonials-section').then(mod => mod.TestimonialsSection),{ ssr: false }
)

const CTASection = dynamic(() =>
  import('@/components/home/cta-section').then(mod => mod.CTASection),{ ssr: false }
)

export default function HomePage() {
  return (
    <FavoritesProvider>
      <main className="min-h-screen">
        <Navbar transparent />
        <HeroSection />

        {/* 🚀 lazy loaded below fold */}
        <SearchSection />
        <FeaturedVendors />
        <CategoriesSection />
        <TestimonialsSection />
        <CTASection />

        <Footer />
      </main>
    </FavoritesProvider>
  )
}