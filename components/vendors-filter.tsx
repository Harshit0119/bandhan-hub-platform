// \components\vendors-filter.tsx
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, MapPin, X, SlidersHorizontal } from 'lucide-react'
import { VENDOR_CATEGORIES } from '@/lib/types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'

interface VendorsFilterProps {
  initialCategory?: string
  initialCity?: string
  initialMinBudget?: number
  initialMaxBudget?: number
}

export function VendorsFilter({
  initialCategory = '',
  initialCity = '',
  initialMinBudget,
  initialMaxBudget,
}: VendorsFilterProps) {
  const router = useRouter()

  const [category, setCategory] = useState(initialCategory)
  const [city, setCity] = useState(initialCity)
  const [minBudget, setMinBudget] = useState(initialMinBudget?.toString() || '')
  const [maxBudget, setMaxBudget] = useState(initialMaxBudget?.toString() || '')
  const [isOpen, setIsOpen] = useState(false)

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (city) params.set('city', city)
    if (minBudget) params.set('minBudget', minBudget)
    if (maxBudget) params.set('maxBudget', maxBudget)

    router.push(`/vendors?${params.toString()}`)
    setIsOpen(false)
  }

  const clearFilters = () => {
    setCategory('')
    setCity('')
    setMinBudget('')
    setMaxBudget('')
    router.push('/vendors')
    setIsOpen(false)
  }

  const hasFilters = category || city || minBudget || maxBudget

  // ✅ FIXED: Prevent re-render causing keyboard close
  const FilterContent = useCallback(() => (
    <FieldGroup className="gap-4">
      <Field>
        <FieldLabel>Category</FieldLabel>
        <Select
          value={category}
          onValueChange={(v) => setCategory(v === 'all' ? '' : v)}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {VENDOR_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel>City</FieldLabel>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            inputMode='text'
            autoComplete='off'
            placeholder="Enter city (e.g., Bhopal, Indore)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Min Budget</FieldLabel>
          <Input
            type="number"
            placeholder="₹ Min"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            className="bg-card"
          />
        </Field>

        <Field>
          <FieldLabel>Max Budget</FieldLabel>
          <Input
            type="number"
            placeholder="₹ Max"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            className="bg-card"
          />
        </Field>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          onClick={applyFilters}
          className="flex-1 bg-primary text-primary-foreground"
        >
          <Search className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>

        {hasFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </FieldGroup>
  ), [category, city, minBudget, maxBudget])

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden lg:block bg-card rounded-xl p-6 mb-8 border border-border">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Select
              value={category}
              onValueChange={(v) => setCategory(v === 'all' ? '' : v)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {VENDOR_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter city (e.g., Bhopal, Indore)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>

          <div className="w-32">
            <Input
              type="number"
              placeholder="₹ Min"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="w-32">
            <Input
              type="number"
              placeholder="₹ Max"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="bg-background"
            />
          </div>

          <Button onClick={applyFilters} className="bg-primary text-primary-foreground">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>

          {hasFilters && (
            <Button variant="outline" onClick={clearFilters} size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Filter */}
      <div className="lg:hidden mb-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasFilters && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {[category, city, minBudget, maxBudget].filter(Boolean).length}
                </span>
              )}
            </Button>
          </SheetTrigger>

          {/* ✅ FIXED: Prevent focus reset */}
          <SheetContent
            side="bottom"
            className="h-auto max-h-[80vh]"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle>Filter Vendors</SheetTitle>
            </SheetHeader>

            <div className="py-4">
              {FilterContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}