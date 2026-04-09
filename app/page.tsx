// app/page.tsx

import dynamic from "next/dynamic"
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/home/hero-section'
import { Footer } from '@/components/footer'
import { FavoritesProvider } from '@/lib/favorites-store'

// ✅ Lightweight skeleton loader (no blank UI)
function SectionSkeleton({ height = "h-[300px]" }: { height?: string }) {
  return (
    <div className={`w-full ${height} animate-pulse bg-muted/40 rounded-xl`} />
  )
}

// 🚀 Dynamic imports with loading fallback (IMPORTANT)
const SearchSection = dynamic(
  () => import('@/components/home/search-section').then(mod => mod.SearchSection),
  {
    loading: () => <SectionSkeleton height="h-[120px]" />,
  }
)

const FeaturedVendors = dynamic(
  () => import('@/components/home/featured-vendors'),
  {
    loading: () => <SectionSkeleton height="h-[400px]" />,
  }
)

const CategoriesSection = dynamic(
  () => import('@/components/home/categories-section').then(mod => mod.CategoriesSection),
  {
    loading: () => <SectionSkeleton height="h-[300px]" />,
  }
)

const TestimonialsSection = dynamic(
  () => import('@/components/home/testimonials-section').then(mod => mod.TestimonialsSection),
  {
    loading: () => <SectionSkeleton height="h-[300px]" />,
  }
)

const CTASection = dynamic(
  () => import('@/components/home/cta-section').then(mod => mod.CTASection),
  {
    loading: () => <SectionSkeleton height="h-[200px]" />,
  }
)

export default function HomePage() {
  return (
    <FavoritesProvider>
      <main className="min-h-screen">
        {/* ✅ Above-the-fold stays instant */}
        <Navbar transparent />
        <HeroSection />

        {/* ✅ Below-the-fold sections (lazy but NOT blank anymore) */}
        <section className="space-y-12 mt-8">
          <SearchSection />
          <FeaturedVendors />
          <CategoriesSection />
          <TestimonialsSection />
          <CTASection />
        </section>

        <Footer />
      </main>
    </FavoritesProvider>
  )
}



// //app\page.tsx
// 'use client'

// import dynamic from "next/dynamic"
// import { Navbar } from '@/components/navbar'
// import { HeroSection } from '@/components/home/hero-section'
// import { Footer } from '@/components/footer'
// import { FavoritesProvider } from '@/lib/favorites-store'

// // 🚀 Lazy load heavy sections
// const SearchSection = dynamic(() =>
//   import('@/components/home/search-section').then(mod => mod.SearchSection),{ ssr: false }
// )

// const FeaturedVendors = dynamic(() =>
//   import('@/components/home/featured-vendors'),
//   {ssr: false }
// )

// const CategoriesSection = dynamic(() =>
//   import('@/components/home/categories-section').then(mod => mod.CategoriesSection),{ ssr: false }
// )

// const TestimonialsSection = dynamic(() =>
//   import('@/components/home/testimonials-section').then(mod => mod.TestimonialsSection),{ ssr: false }
// )

// const CTASection = dynamic(() =>
//   import('@/components/home/cta-section').then(mod => mod.CTASection),{ ssr: false }
// )

// export default function HomePage() {
//   return (
//     <FavoritesProvider>
//       <main className="min-h-screen">
//         <Navbar transparent />
//         <HeroSection />

//         {/* 🚀 lazy loaded below fold */}
//         <SearchSection />
//         <FeaturedVendors />
//         <CategoriesSection />
//         <TestimonialsSection />
//         <CTASection />

//         <Footer />
//       </main>
//     </FavoritesProvider>
//   )
// }