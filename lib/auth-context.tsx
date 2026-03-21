'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

export interface User {
  id: string
  email: string
  name: string | null
  isVendor: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, isVendor: boolean) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 🔹 Fetch profile
  const fetchUserProfile = async (userId: string, email: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }
    if (!data) {
      return null
    }

    return {
      id: userId,
      email,
      name: data.name,
      isVendor: data.is_vendor,
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
          } else {
            console.warn("Profile not ready yet")
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
  }

  // 🔹 Signup (FIXED PROPERLY)
  const signup = async (
    email: string,
    password: string,
    name: string,
    isVendor = false
  ) => {
    // 1. Sign up
    const {data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          is_vendor: isVendor,
        },
      },
    })

    if (error) throw error

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