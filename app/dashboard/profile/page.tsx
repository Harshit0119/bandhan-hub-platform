'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { VENDOR_CATEGORIES } from '@/lib/types'
import { Camera, Loader2, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ProfileEditPage() {
  const { user } = useAuth()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)
  const [vendorData, setVendorData] = useState<any>(null)
  const [gallery, setGallery] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const profileInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    city: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    experience: '',
    minPrice: '',
    maxPrice: '',
    about: '',
  })

  // ✅ FETCH VENDOR DATA
  useEffect(() => {
    const fetchVendor = async () => {
      if (!user) return

      const { data: vendor, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.error(error)
        return
      }

      if (!vendor) {
        console.error('Vendor not found (trigger issue)')
        return
      }

      setVendorData(vendor)

      setFormData({
        name: vendor.name || '',
        category: vendor.category || '',
        city: vendor.city || '',
        phone: vendor.phone || '',
        whatsapp: vendor.whatsapp || '',
        instagram: vendor.instagram || '',
        experience: vendor.experience || '',
        minPrice: vendor.min_price?.toString() || '',
        maxPrice: vendor.max_price?.toString() || '',
        about: vendor.about || '',
      })
    }

    fetchVendor()

  }, [user])

  // ================= Delete Image =================
  const handleDeleteImage = async (id: string, imageUrl: string) => {
    console.log("Deleting:", id)

    const { data, error } = await supabase
      .from('vendor_images')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      console.error("DELETE ERROR:", error)
      toast.error('Delete failed')
      return
    }

    console.log("Deleted from DB:", data)

    // delete from storage
    const path = imageUrl.split('/bandhan-hub/')[1]
    if (path) {
      await supabase.storage.from('bandhan-hub').remove([path])
    }

    setGallery((prev) => prev.filter((img) => img.id !== id))

    toast.success('Image deleted')
  }

  // ================= FETCH GALLERY =================
  const fetchGallery = async () => {
    if (!vendorData) return

    const { data } = await supabase
      .from('vendor_images')
      .select('*')
      .eq('vendor_id', vendorData.id)

    setGallery(data || [])
  }

  useEffect(() => {
    if (vendorData) fetchGallery()
  }, [vendorData])

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'cover'
  ) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    const filePath = `${user.id}-${type}-${Date.now()}`

    const { error } = await supabase.storage
      .from('bandhan-hub')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      console.error(error)
      toast.error('Upload failed')
      return
    }

    const { data } = supabase.storage
      .from('bandhan-hub')
      .getPublicUrl(filePath)

    const publicUrl = data.publicUrl

    // update DB
    await supabase
      .from('vendors')
      .update({
        [type === 'profile' ? 'profile_image' : 'cover_image']: publicUrl,
      })
      .eq('user_id', user.id)

    // update UI instantly
    setVendorData((prev: any) => ({
      ...prev,
      [type === 'profile' ? 'profile_image' : 'cover_image']: publicUrl,
    }))

    toast.success('Image uploaded!')
  }

  // ================= GALLERY UPLOAD =================
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !vendorData || !user) return

    if (gallery.length + files.length > 10) {
      toast.error('Max 10 images allowed')
      return
    }

    const uploads = []

    for (let file of Array.from(files)) {
      const filePath = `${user.id}/gallery/${Date.now()}-${file.name}`

      await supabase.storage.from('bandhan-hub').upload(filePath, file)

      const { data } = supabase.storage
        .from('bandhan-hub')
        .getPublicUrl(filePath)

      uploads.push({
        vendor_id: vendorData.id,
        image_url: data.publicUrl,
      })
    }

    await supabase.from('vendor_images').insert(uploads)

    toast.success('Gallery updated')
    fetchGallery()
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // ✅ UPDATE DATA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!user) return

    const { error } = await supabase
      .from('vendors')
      .update({
        name: formData.name,
        category: formData.category,
        city: formData.city,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        experience: formData.experience,
        about: formData.about,
        min_price: parseInt(formData.minPrice),
        max_price: parseInt(formData.maxPrice),
      })
      .eq('user_id', user.id)

    if (error) {
      console.error("Error updating profile:", error)
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated successfully!')
    }

    setIsLoading(false)
  }

  // ✅ LOADING SCREEN
  if (!vendorData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update your business information and contact details
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Profile & Cover Images */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Profile Images</CardTitle>
                <CardDescription>Update your profile and cover photos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">

                  {/* COVER IMAGE */}
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="relative w-full h-48 rounded-xl overflow-hidden bg-secondary cursor-pointer group"
                  >
                    <Image
                      src={vendorData.cover_image || '/placeholder.jpg'}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Camera className="text-white" />
                    </div>
                  </div>

                  {/* PROFILE IMAGE (OVERLAPPING) */}
                  <div
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute -bottom-12 left-6 w-28 h-28 rounded-2xl border-4 border-white overflow-hidden cursor-pointer group bg-secondary"
                  >
                    <Image
                      src={vendorData.profile_image || '/placeholder.jpg'}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Camera className="text-white" />
                    </div>
                  </div>

                  {/* Hidden Inputs */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={coverInputRef}
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    ref={profileInputRef}
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                  />
                </div>

                {/* spacing for overlap */}
                <div className="h-16" />
              </CardContent>
            </Card>
            {/* GALLERY */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Images</CardTitle>
              </CardHeader>
              <CardContent>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                  {gallery.map((img, index) => (
                    <div
                      key={img.id}
                      className="relative aspect-square cursor-pointer group"

                    >
                      <Image
                        src={img.image_url}
                        alt="gallery"
                        fill
                        className="object-cover rounded-lg"
                        onClick={() => {
                          setSelectedIndex(index)
                          setZoom(1)
                        }}
                      />
                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDeleteImage(img.id, img.image_url)}
                        className="absolute top-2 right-2 bg-black/60 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="text-white w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Upload Box */}
                  <label className="border-2 border-dashed flex items-center justify-center cursor-pointer p-4 rounded-lg">
                    Upload
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                  </label>

                </div>

              </CardContent>
            </Card>

            {/* BASIC INFO */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your business details</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Business Name</FieldLabel>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Category</FieldLabel>
                      <Select
                        value={formData.category}
                        onValueChange={(v) => handleChange('category', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VENDOR_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel>City / Location</FieldLabel>
                      <Input
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Enter your city"
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Experience</FieldLabel>
                      <Input
                        value={formData.experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        placeholder="e.g., 5+ years"
                      />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>About</FieldLabel>
                    <Textarea
                      value={formData.about}
                      onChange={(e) => handleChange('about', e.target.value)}
                      rows={5}
                      placeholder="Tell couples about your services..."
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            {/* Contact & Pricing */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                  <CardDescription>How couples can reach you</CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Phone Number</FieldLabel>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </Field>

                    <Field>
                      <FieldLabel>WhatsApp Number</FieldLabel>
                      <Input
                        value={formData.whatsapp}
                        onChange={(e) => handleChange('whatsapp', e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Instagram Handle</FieldLabel>
                      <Input
                        value={formData.instagram}
                        onChange={(e) => handleChange('instagram', e.target.value)}
                        placeholder="your user name"
                      />
                    </Field>
                  </FieldGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing Range</CardTitle>
                  <CardDescription>Your service price range</CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Minimum Price (₹)</FieldLabel>
                      <Input
                        type="number"
                        value={formData.minPrice}
                        onChange={(e) => handleChange('minPrice', e.target.value)}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Maximum Price (₹)</FieldLabel>
                      <Input
                        type="number"
                        value={formData.maxPrice}
                        onChange={(e) => handleChange('maxPrice', e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="mt-8">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
      
      {/* ===== FULLSCREEN IMAGE VIEWER ===== */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">

          {/* CLOSE BUTTON */}
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={() => setSelectedIndex(null)}
          >
            ✕
          </button>

          {/* PREVIOUS */}
          <button
            className="absolute left-4 text-white text-4xl"
            onClick={() =>
              setSelectedIndex((prev) =>
                prev === 0 ? gallery.length - 1 : (prev as number) - 1
              )
            }
          >
            ‹
          </button>

          {/* IMAGE */}
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={gallery[selectedIndex].image_url}
              alt="preview"
              style={{
                transform: `scale(${zoom})`,
                transition: '0.3s',
              }}
              className="max-h-[90%] max-w-[90%] object-contain touch-none"
            />
          </div>

          {/* NEXT */}
          <button
            className="absolute right-4 text-white text-4xl"
            onClick={() =>
              setSelectedIndex((prev) =>
                prev === gallery.length - 1 ? 0 : (prev as number) + 1
              )
            }
          >
            ›
          </button>

          {/* ZOOM CONTROLS */}
          <div className="absolute bottom-6 flex gap-4">
            <button
              className="bg-white px-3 py-1 rounded"
              onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
            >
              -
            </button>
            <button
              className="bg-white px-3 py-1 rounded"
              onClick={() => setZoom((z) => z + 0.5)}
            >
              +
            </button>
          </div>

        </div>
      )}
    </div >
  )
}