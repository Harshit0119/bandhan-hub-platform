// app/[city]/[category]/page.tsx

import { Metadata } from 'next'
import { getVendors } from '@/lib/db-actions'
import { SLUG_TO_CATEGORY } from '@/lib/types'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { VendorsList } from '@/components/vendors-list'
import { FavoritesProvider } from '@/lib/favorites-store'

type Props = {
  params: {
    city: string
    category: string
  }
}
export const revalidate = 60
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; category: string }>
}) {
  const { city, category } = await params

  const citySlug = city.toLowerCase()
  const categorySlug = category.toLowerCase()

  const categoryName = SLUG_TO_CATEGORY[categorySlug] || categorySlug

  return {
    title: `Best ${categoryName}s in ${citySlug} | Bandhan Hub`,
    description: `Find top ${categoryName}s in ${citySlug}. Compare prices, portfolios and book trusted vendors on Bandhan Hub.`,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string; category: string }>
}) {
  const { city, category } = await params

  const citySlug = city.toLowerCase()
  const categorySlug = category.toLowerCase()

  const categoryName =
    SLUG_TO_CATEGORY[categorySlug as keyof typeof SLUG_TO_CATEGORY]

  if (!categoryName) {
    return <div>Category not found</div>
  }

  const vendors = await getVendors({
    city: citySlug,
    category: categoryName,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* HERO */}
        <section className="bg-linear-to-br from-primary to-primary/80 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl font-bold mb-4">
              Best {categoryName}s in {citySlug}
            </h1>
            <p className="text-white/80">
              Find top {categoryName}s in {citySlug}
            </p>
          </div>
        </section>

        {/* VENDORS */}
        <section className="container mx-auto px-4 py-8">
          <FavoritesProvider>
            <VendorsList vendors={vendors} />
          </FavoritesProvider>
        </section>
      </main>

      <Footer />
    </div>
  )
}