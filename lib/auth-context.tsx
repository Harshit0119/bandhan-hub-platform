// lib\auth-context.tsx

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

export interface User {
  id: string
  email: string
  name: string | null
  isVendor: boolean
  vendorId: string | null
  isPremium: boolean
  subscription_plan?: 'free' | 'premium' | 'annual' // 🔥 ADDED PLAN FIELD
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  signup: (email: string, password: string, name: string, isVendor: boolean) => Promise<any>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 🔹 Fetch profile
  const fetchUserProfile = async (userId: string, email: string): Promise<User | null> => {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      clearTimeout(timeout)

      if (!profile) return null

      const { data: vendor } = await supabase
        .from('vendors')
        .select('id, is_premium, subscription_plan')
        .eq('user_id', userId)
        .maybeSingle()

      return {
        id: userId,
        email,
        name: profile.name,
        isVendor: profile.is_vendor ?? false,
        vendorId: vendor?.id ?? null,
        isPremium: vendor?.is_premium ?? false,
        subscription_plan: vendor?.subscription_plan ?? 'free',
      }
    } catch (err) {
      console.error("Auth fetch error:", err)
      return null
    }
  }

  // 🔹 Session check
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session?.user) {
        const u = data.session.user
        const profile = await fetchUserProfile(u.id, u.email!)
        setUser(profile)
      }

      setIsLoading(false)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          const u = session.user
          const profile = await fetchUserProfile(u.id, u.email!)

          if (profile) {
            setUser(profile)
          }
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🔹 Login
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    const u = data.user
    if (!u) throw new Error('Login failed')

    const profile = await fetchUserProfile(u.id, u.email!)
    if (!profile) throw new Error('Profile not found')

    setUser(profile)
    return profile
  }

  // 🔹 Signup (FIXED PROPERLY)
  const signup = async (
    email: string,
    password: string,
    name: string,
    isVendor = false
  ) => {
    // 1. Sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          name,
          is_vendor: isVendor,
        },
      },
    })

    if (error) throw error

    const user = data.user
    if (!user) return data

    // 2. Wait a bit (important for Supabase sync)
    await new Promise((res) => setTimeout(res, 500))

    // 3. Create profile manually (SAFE)
    await supabase.from('profiles').upsert({
      id: user.id,
      name,
      is_vendor: isVendor,
    })

    // 4. ✅ Create vendor row if vendor
    if (isVendor) {
      await supabase.from('vendors').upsert({
        user_id: user.id,
        name: '',
        category: '',
        city: '',
        experience: '',
        about: '',
        min_price: 0,
        max_price: 0,
      })
    }

    return data
  }

  // 🔹 Logout
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
