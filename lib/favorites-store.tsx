// lib/favorites-store.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

interface FavoritesContextType {
  favorites: string[]
  recentlyViewed: string[]
  addFavorite: (vendorId: string) => void
  removeFavorite: (vendorId: string) => void
  isFavorite: (vendorId: string) => boolean
  addRecentlyViewed: (vendorId: string) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])

  // ✅ LOAD FROM DB
  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      // FAVORITES
      const { data: favs } = await supabase
        .from('favorites')
        .select('vendor_id')
        .eq('user_id', user.id)

      if (favs) setFavorites(favs.map(f => f.vendor_id))

      // RECENTLY VIEWED
      const { data: recent } = await supabase
        .from('recently_viewed')
        .select('vendor_id')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(10)

      if (recent) setRecentlyViewed(recent.map(r => r.vendor_id))
    }

    loadData()
  }, [user])

  const addFavorite = async (vendorId: string) => {
    if (!user) return

    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      vendor_id: vendorId
    })

    if (!error) {
      setFavorites(prev => [...prev, vendorId])
    }
  }

  const removeFavorite = async (vendorId: string) => {
    if (!user) return

    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('vendor_id', vendorId)

    setFavorites(prev => prev.filter(id => id !== vendorId))
  }

  const isFavorite = (vendorId: string) => favorites.includes(vendorId)

  const addRecentlyViewed = async (vendorId: string) => {
    if (!user) return

    await supabase.from('recently_viewed').insert({
      user_id: user.id,
      vendor_id: vendorId
    })

    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== vendorId)
      return [vendorId, ...filtered].slice(0, 10)
    })
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      recentlyViewed,
      addFavorite,
      removeFavorite,
      isFavorite,
      addRecentlyViewed
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used within provider')
  return context
}