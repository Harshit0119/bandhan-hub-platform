// app/auth/callback/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login`)
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.session) {
    console.error('Auth error:', error)
    return NextResponse.redirect(`${origin}/login`)
  }

  // ✅ USER IS NOW LOGGED IN
  const user = data.user

  // 👉 For now send everyone to dashboard
  return NextResponse.redirect(`${origin}/dashboard`)
}