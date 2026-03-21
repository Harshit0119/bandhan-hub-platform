'use client'

import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/home/hero-section'
import { SearchSection } from '@/components/home/search-section'
import { FeaturedVendors } from '@/components/home/featured-vendors'
import { CategoriesSection } from '@/components/home/categories-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CTASection } from '@/components/home/cta-section'
import { Footer } from '@/components/footer'
import { FavoritesProvider } from '@/lib/favorites-store'

export default function HomePage() {
  return (
    <FavoritesProvider>
      <main className="min-h-screen">
        <Navbar transparent />
        <HeroSection />
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
