// lib/types.ts

export interface Vendor {
  id: string;
  name: string;
  slug?: string;

  category: VendorCategory;
  city: string;

  // ✅ Make OPTIONAL (very important)
  profileImage?: string | null;
  coverImage?: string | null;

  about?: string | null;
  experience?: string | null;

  minPrice?: number | null;
  maxPrice?: number | null;

  whatsapp?: string | null;
  instagram?: string | null;
  phone?: string | null;

  // ✅ Derived fields (not from DB)
  views?: number;
  contactClicks?: number;
  favoritesCount?: number;

  isPremium?: boolean;

  services?: Service[];
  gallery?: string[];

  createdAt?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
  priceType?: "starting" | "fixed" | "hourly" | "per-day";
}

export type VendorCategory =
  | "Photographer"
  | "Pre-wedding Shoot"
  | "Wedding Planner"
  | "Makeup Artist"
  | "Mehendi Artist"
  | "DJ"
  | "Caterer"
  | "Anchor"
  | "Decorator"
  | "Beauty Parlour"
  | "Clothing"
  | "Card Printing";

export const VENDOR_CATEGORIES: VendorCategory[] = [
  "Photographer",
  "Pre-wedding Shoot",
  "Wedding Planner",
  "Makeup Artist",
  "Mehendi Artist",
  "DJ",
  "Caterer",
  "Anchor",
  "Decorator",
  "Beauty Parlour",
  "Clothing",
  "Card Printing"
];

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  image: string;
  text: string;
  rating: number;
}
