import { MetadataRoute } from 'next'

// Replace with your actual domain
const BASE_URL = 'https://bandhan-hub.vercel.app'

// 👉 If you have DB, fetch vendors here
async function getVendors() {
  return [
    { slug: 'photgallery' },
    // later fetch from Supabase
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vendors = await getVendors()

  const vendorUrls = vendors.map((v) => ({
    url: `${BASE_URL}/vendor/${v.slug}`,
    lastModified: new Date(),
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/vendors`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/dashboard`,
      lastModified: new Date(),
    },
    ...vendorUrls,
  ]
}