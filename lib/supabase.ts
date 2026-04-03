// lib/supabase.ts

import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,          // ✅ keep user logged in
      autoRefreshToken: true,        // ✅ refresh token automatically
      detectSessionInUrl: true,      // ✅ needed for auth redirects
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          cache: 'no-cache', // ✅ prevent stale data bugs
        })
      },
    },
  }
)

export async function safeQuery(fn: () => Promise<any>, retries = 2) {
  try {
    return await fn()
  } catch (err) {
    if (retries > 0) {
      return safeQuery(fn, retries - 1)
    }
    throw err
  }
}