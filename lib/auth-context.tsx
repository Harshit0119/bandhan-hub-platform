'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// TODO: connect Supabase auth

export interface User {
  id: string
  email: string
  name: string
  isVendor: boolean
  vendorId?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, isVendor?: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Check Supabase session
    const storedUser = localStorage.getItem('bandhan_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // TODO: connect Supabase auth
    // Simulated login for UI demonstration
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      isVendor: true,
      vendorId: 'vendor-1',
    }
    setUser(mockUser)
    localStorage.setItem('bandhan_user', JSON.stringify(mockUser))
  }

  const signup = async (email: string, password: string, name: string, isVendor = false) => {
    // TODO: connect Supabase auth
    // Simulated signup for UI demonstration
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      isVendor,
      vendorId: isVendor ? `vendor-${Date.now()}` : undefined,
    }
    setUser(mockUser)
    localStorage.setItem('bandhan_user', JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bandhan_user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
