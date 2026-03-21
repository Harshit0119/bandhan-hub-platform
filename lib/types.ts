// TODO: vendors table in Supabase

export interface Vendor {
  id: string
  name: string
  category: VendorCategory
  city: string
  profileImage: string
  coverImage: string
  about: string
  experience: string
  minPrice: number
  maxPrice: number
  whatsapp?: string
  instagram?: string
  phone?: string
  views: number
  contactClicks: number
  favoritesCount: number
  isPremium: boolean
  services: Service[]
  gallery: string[]
  createdAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  priceType: 'starting' | 'fixed' | 'hourly' | 'per-day'
}

export type VendorCategory =
  | 'Photographer'
  | 'Pre-wedding Shoot'
  | 'Wedding Planner'
  | 'Makeup Artist'
  | 'Mehendi Artist'
  | 'DJ'
  | 'Caterer'
  | 'Anchor'
  | 'Decorator'
  | 'Beauty Parlour'
  | 'Custom'

export const VENDOR_CATEGORIES: VendorCategory[] = [
  'Photographer',
  'Pre-wedding Shoot',
  'Wedding Planner',
  'Makeup Artist',
  'Mehendi Artist',
  'DJ',
  'Caterer',
  'Anchor',
  'Decorator',
  'Beauty Parlour',
]

export interface Testimonial {
  id: string
  name: string
  location: string
  image: string
  text: string
  rating: number
}
