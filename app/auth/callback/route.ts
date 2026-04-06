// app/auth/callback/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // ✅ FIX: await client
  const supabase = await createClient();

  // ✅ FIX: destructure properly
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth error:", error);
    return NextResponse.redirect(`${origin}/login`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // ✅ fetch profile AFTER session is set
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_vendor")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile fetch error:", profileError);
    return NextResponse.redirect(`${origin}/login`);
  }

  // ✅ role-based redirect
  if (profile?.is_vendor) {
    return NextResponse.redirect(`${origin}/dashboard`);
  } else {
    return NextResponse.redirect(`${origin}/vendors`);
  }
}