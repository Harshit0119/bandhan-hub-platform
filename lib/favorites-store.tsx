'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// TODO: favorites table in Supabase

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
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])

  useEffect(() => {
    // TODO: Load from Supabase based on user
    const storedFavorites = localStorage.getItem('bandhan_favorites')
    const storedRecent = localStorage.getItem('bandhan_recently_viewed')
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites))
    if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent))
  }, [])

  const addFavorite = (vendorId: string) => {
    setFavorites(prev => {
      const updated = [...prev, vendorId]
      localStorage.setItem('bandhan_favorites', JSON.stringify(updated))
      return updated
    })
  }

  const removeFavorite = (vendorId: string) => {
    setFavorites(prev => {
      const updated = prev.filter(id => id !== vendorId)
      localStorage.setItem('bandhan_favorites', JSON.stringify(updated))
      return updated
    })
  }

  const isFavorite = (vendorId: string) => favorites.includes(vendorId)

  const addRecentlyViewed = (vendorId: string) => {
    setRecentlyViewed(prev => {
      // Remove if already exists, then add to front
      const filtered = prev.filter(id => id !== vendorId)
      const updated = [vendorId, ...filtered].slice(0, 10) // Keep last 10
      localStorage.setItem('bandhan_recently_viewed', JSON.stringify(updated))
      return updated
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
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
