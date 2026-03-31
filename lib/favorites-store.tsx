// lib/favorites-store.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

interface FavoritesContextType {
  favorites: string[]
  recentlyViewed: string[]
  addFavorite: (vendorId: string) => Promise<void>
  removeFavorite: (vendorId: string) => Promise<void>
  isFavorite: (vendorId: string) => boolean
  addRecentlyViewed: (vendorId: string) => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])

  // ✅ LOAD FROM DB
  useEffect(() => {
    if (!user?.id) return

    const loadData = async () => {
      try {
        const [favRes, recentRes] = await Promise.all([
          supabase
            .from('favorites')
            .select('vendor_id')
            .eq('user_id', user.id),

          supabase
            .from('recently_viewed')
            .select('vendor_id')
            .eq('user_id', user.id)
            .order('viewed_at', { ascending: false })
            .limit(10)
        ])

        if (favRes.data) {
          setFavorites(favRes.data.map(f => f.vendor_id))
        }

        if (recentRes.data) {
          setRecentlyViewed(recentRes.data.map(r => r.vendor_id))
        }

      } catch (err) {
        console.error('❌ Favorites load error:', err)
      }
    }

    loadData()
  }, [user?.id])

  // ✅ ADD FAVORITE (SAFE + NO DUPLICATE)
  const addFavorite = async (vendorId: string) => {
    if (!user?.id) return

    // prevent duplicate
    if (favorites.includes(vendorId)) return

    // optimistic UI
    setFavorites((prev) => [...prev, vendorId])

    const { error } = await supabase.from('favorites').insert({
      vendor_id: vendorId,
      user_id: user.id,
    })

    if (error) {
      console.error('❌ Add favorite failed:', error)

      // rollback UI
      setFavorites((prev) => prev.filter(id => id !== vendorId))
    }
  }

  // ✅ REMOVE FAVORITE (SAFE)
  const removeFavorite = async (vendorId: string) => {
    if (!user?.id) return

    // optimistic UI
    setFavorites((prev) => prev.filter((id) => id !== vendorId))

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('vendor_id', vendorId)
      .eq('user_id', user.id)

    if (error) {
      console.error('❌ Remove favorite failed:', error)

      // rollback UI
      setFavorites((prev) => [...prev, vendorId])
    }
  }

  const isFavorite = (vendorId: string) => favorites.includes(vendorId)

  // ✅ RECENTLY VIEWED (NO SPAM)
  const addRecentlyViewed = async (vendorId: string) => {
    if (!user?.id) return

    try {
      // insert (unique constraint already exists)
      await supabase.from('recently_viewed').upsert({
        user_id: user.id,
        vendor_id: vendorId,
        viewed_at: new Date().toISOString(),
      })

      setRecentlyViewed(prev => {
        const filtered = prev.filter(id => id !== vendorId)
        return [vendorId, ...filtered].slice(0, 10)
      })

    } catch (err) {
      console.error('❌ Recently viewed error:', err)
    }
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