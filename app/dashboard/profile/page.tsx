'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
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
import { mockVendors } from '@/lib/mock-data'
import { Camera, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ProfileEditPage() {
  const { user } = useAuth()
  
  // TODO: Fetch actual vendor data from Supabase
  const vendorData = mockVendors[0]

  const [formData, setFormData] = useState({
    name: vendorData.name,
    category: vendorData.category,
    city: vendorData.city,
    phone: vendorData.phone || '',
    whatsapp: vendorData.whatsapp || '',
    instagram: vendorData.instagram || '',
    experience: vendorData.experience,
    minPrice: vendorData.minPrice.toString(),
    maxPrice: vendorData.maxPrice.toString(),
    about: vendorData.about,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Update vendor data in Supabase
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success('Profile updated successfully!')
    setIsLoading(false)
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Edit Profile
          </h1>
          <p className="text-muted-foreground mt-1">
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
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Image */}
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-secondary">
                      <Image
                        src={vendorData.profileImage}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Camera className="h-6 w-6 text-white" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Profile Photo</p>
                    {/* TODO: Image upload integration */}
                  </div>

                  {/* Cover Image */}
                  <div className="flex-1">
                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-secondary">
                      <Image
                        src={vendorData.coverImage}
                        alt="Cover"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Camera className="h-6 w-6 text-white" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Cover Photo</p>
                    {/* TODO: Image upload integration */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your business details</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="name">Business Name</FieldLabel>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="category">Category</FieldLabel>
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
                      <FieldLabel htmlFor="city">City / Location</FieldLabel>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Enter your city"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="experience">Experience</FieldLabel>
                      <Input
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        placeholder="e.g., 5+ years"
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="about">About</FieldLabel>
                    <Textarea
                      id="about"
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
                      <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="whatsapp">WhatsApp Number</FieldLabel>
                      <Input
                        id="whatsapp"
                        value={formData.whatsapp}
                        onChange={(e) => handleChange('whatsapp', e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="instagram">Instagram Handle</FieldLabel>
                      <Input
                        id="instagram"
                        value={formData.instagram}
                        onChange={(e) => handleChange('instagram', e.target.value)}
                        placeholder="yourusername"
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
                      <FieldLabel htmlFor="minPrice">Minimum Price (₹)</FieldLabel>
                      <Input
                        id="minPrice"
                        type="number"
                        value={formData.minPrice}
                        onChange={(e) => handleChange('minPrice', e.target.value)}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="maxPrice">Maximum Price (₹)</FieldLabel>
                      <Input
                        id="maxPrice"
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

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button 
              type="submit" 
              size="lg"
              className="bg-primary text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
