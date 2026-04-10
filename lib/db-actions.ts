// lib/db-actions.ts

import { supabase } from "@/lib/supabase";
import { Vendor, VendorCategory } from "@/lib/types";
import { cache } from 'react'
/**
 * ✅ Get vendors by city + category (SEO pages)
 */
export async function getVendors({
  city,
  category,
}: {
  city: string;
  category: VendorCategory;
}): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .ilike("city", city)
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ getVendors error:", error);
    return [];
  }

  return (data || []).map((v) => ({
    id: v.id,
    name: v.name,
    slug: v.slug,

    category: v.category,
    city: v.city,

    profileImage: v.profile_image,
    coverImage: v.cover_image,

    about: v.about,
    experience: v.experience,

    minPrice: v.min_price,
    maxPrice: v.max_price,

    whatsapp: v.whatsapp,
    instagram: v.instagram,
    phone: v.phone,

    isPremium: v.is_premium,
    createdAt: v.created_at,
  }));
}

export const getAllVendors = cache(async (): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from("vendors")
    .select("id, slug, category, city, created_at")

  if (error) {
    console.error("❌ getAllVendors error:", error)
    return []
  }

  return data || []
})

/**
 * ✅ Get vendorId from logged-in user
 */
export async function getVendorIdByUserId(userId: string) {
  const { data, error } = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("❌ Vendor fetch error:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return data.id;
}

/**
 * ✅ Insert profile view (with session protection handled outside)
 */
export async function insertProfileView(vendorId: string) {
  const { error } = await supabase
    .from("profile_views")
    .insert({ vendor_id: vendorId });

  if (error) {
    console.error("❌ Profile view insert error:", error);
    throw error;
  }
}

/**
 * ✅ Insert contact click
 */
export async function insertContactClick(vendorId: string) {
  const { error } = await supabase
    .from("contact_clicks")
    .insert({ vendor_id: vendorId });

  if (error) {
    console.error("❌ Contact click error:", error);
    throw error;
  }
}

/**
 * ✅ Insert inquiry
 */
export async function insertInquiry({
  vendorId,
  userId,
  name,
  phone,
  event_date,
  message,
}: {
  vendorId: string;
  userId?: string | null;
  name: string;
  phone: string;
  event_date?: string | null;
  message?: string;
}) {
  const { error } = await supabase.from("inquiries").insert({
    vendor_id: vendorId,
    user_id: userId || null,
    name,
    phone,
    event_date: event_date || null,
    message,
  });

  if (error) {
    console.error("❌ Inquiry insert error:", error);
    throw error;
  }
}

/**
 * ✅ Get vendor stats (dashboard + analytics)
 */
export async function getVendorStats(vendorId: string) {
  const results = await Promise.all([
    supabase
      .from("profile_views")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorId),

    supabase
      .from("favorites")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorId),

    supabase
      .from("contact_clicks")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorId),

    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorId),
  ]);

  const [viewsRes, favRes, contactRes, inquiryRes] = results;

  if (viewsRes.error) console.error("Views error:", viewsRes.error);
  if (favRes.error) console.error("Favorites error:", favRes.error);
  if (contactRes.error) console.error("Contacts error:", contactRes.error);
  if (inquiryRes.error) console.error("Inquiries error:", inquiryRes.error);

  return {
    views: viewsRes.count || 0,
    favorites: favRes.count || 0,
    contacts: contactRes.count || 0,
    inquiries: inquiryRes.count || 0,
  };
}

/**
 * ✅ Get vendor counts (for cards / profile page)
 */
export async function getVendorCounts(vendorId: string) {
  const [{ count: views }, { count: favorites }] = await Promise.all([
    supabase
      .from("profile_views")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorId),

    supabase
      .from("favorites")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorId),
  ]);

  return {
    views: views || 0,
    favorites: favorites || 0,
  };
}
