// lib/formatVendor.ts
import { supabase } from "@/lib/supabase";
import { Vendor } from "@/lib/types";

export async function formatVendors(rawVendors: any[]): Promise<Vendor[]> {
  if (!rawVendors || rawVendors.length === 0) return [];

  const vendorIds = rawVendors.map((v) => v.id);

  try {
    // ✅ Fetch counts in parallel (optimized)
    const [viewsRes, favRes] = await Promise.all([
      supabase
        .from("profile_views")
        .select("vendor_id")
        .in("vendor_id", vendorIds),

      supabase.from("favorites").select("vendor_id").in("vendor_id", vendorIds),
    ]);

    const viewsData = viewsRes.data || [];
    const favData = favRes.data || [];

    // ✅ Build maps
    const viewsMap: Record<string, number> = {};
    for (const v of viewsData) {
      viewsMap[v.vendor_id] = (viewsMap[v.vendor_id] || 0) + 1;
    }

    const favMap: Record<string, number> = {};
    for (const f of favData) {
      favMap[f.vendor_id] = (favMap[f.vendor_id] || 0) + 1;
    }

    // ✅ Final formatted vendors
    const formatted: Vendor[] = rawVendors.map((v) => ({
      id: v.id,
      name: v.name || "Unnamed Vendor",
      slug: v.slug || undefined,

      category: v.category,
      city: v.city || "",

      profileImage: v.profile_image || "/placeholder.png",
      coverImage: v.cover_image || "/placeholder.png",

      about: v.about || "",
      experience: v.experience || "",

      minPrice: v.min_price ?? 0,
      maxPrice: v.max_price ?? 0,

      whatsapp: v.whatsapp || "",
      instagram: v.instagram || "",
      phone: v.phone || "",

      views: viewsMap[v.id] || 0,
      favoritesCount: favMap[v.id] || 0,
      contactClicks: 0,

      isPremium: v.is_premium ?? false,

      // ✅ keep future safe
      services: v.services || [],
      gallery: v.gallery || [],

      createdAt: v.created_at || new Date().toISOString(),
    }));

    return formatted;
  } catch (err) {
    console.error("formatVendors error:", err);

    // 🚨 fallback → return safe minimal data (NO CRASH)
    return rawVendors.map((v) => ({
      id: v.id,
      name: v.name || "Vendor",
      category: v.category,
      city: v.city || "",

      profileImage: v.profile_image || "/placeholder.png",
      coverImage: v.cover_image || "/placeholder.png",

      minPrice: v.min_price ?? 0,
      maxPrice: v.max_price ?? 0,

      views: 0,
      favoritesCount: 0,

      isPremium: v.is_premium ?? false,
    })) as Vendor[];
  }
}