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
  | "Hindu Priest"
  | "Caterer"
  | "Anchor"
  | "Decorator"
  | "Beauty Parlour"
  | "Clothing"
  | "Card Printing"
  | "Gardens/Hotels";

export const VENDOR_CATEGORIES: VendorCategory[] = [
  "Photographer",
  "Pre-wedding Shoot",
  "Wedding Planner",
  "Makeup Artist",
  "Mehendi Artist",
  "DJ",
  "Hindu Priest",
  "Caterer",
  "Anchor",
  "Decorator",
  "Beauty Parlour",
  "Clothing",
  "Card Printing",
  "Gardens/Hotels"
];

export const CATEGORY_SLUG_MAP: Record<string, string> = {
  "Photographer": "photographers",
  "Pre-wedding Shoot": "pre-wedding-shoots",
  "Wedding Planner": "wedding-planners",
  "Makeup Artist": "makeup-artists",
  "Mehendi Artist": "mehendi-artists",
  "DJ": "djs",
  "Hindu Priest": "pandits",
  "Caterer": "caterers",
  "Anchor": "anchors",
  "Decorator": "decorators",
  "Beauty Parlour": "beauty-parlours",
  "Clothing": "wedding-clothing",
  "Card Printing": "wedding-card-printing",
  "Gardens/Hotels": "wedding-venues",
}

export const SLUG_TO_CATEGORY: Record<string, VendorCategory> = {
  "photographers": "Photographer",
  "pre-wedding-shoots": "Pre-wedding Shoot",
  "wedding-planners": "Wedding Planner",
  "makeup-artists": "Makeup Artist",
  "mehendi-artists": "Mehendi Artist",
  "djs": "DJ",
  "pandits": "Hindu Priest",
  "caterers": "Caterer",
  "anchors": "Anchor",
  "decorators": "Decorator",
  "beauty-parlours": "Beauty Parlour",
  "wedding-clothing": "Clothing",
  "wedding-card-printing": "Card Printing",
  "wedding-venues": "Gardens/Hotels",
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  image: string;
  text: string;
  rating: number;
}
