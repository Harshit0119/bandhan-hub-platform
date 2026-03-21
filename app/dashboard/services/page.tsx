'use client'

import { useState } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { mockVendors } from '@/lib/mock-data'
import { Service } from '@/lib/types'
import { Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function ServicesPage() {
  // TODO: Fetch from Supabase
  const vendorData = mockVendors[0]
  const [services, setServices] = useState<Service[]>(vendorData.services)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    priceType: 'starting' as Service['priceType'],
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      priceType: 'starting',
    })
    setEditingService(null)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      priceType: service.priceType,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (serviceId: string) => {
    // TODO: Delete from Supabase
    setServices(prev => prev.filter(s => s.id !== serviceId))
    toast.success('Service deleted')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Save to Supabase
    await new Promise(resolve => setTimeout(resolve, 500))

    if (editingService) {
      setServices(prev => 
        prev.map(s => 
          s.id === editingService.id 
            ? { ...s, ...formData, price: parseInt(formData.price) }
            : s
        )
      )
      toast.success('Service updated')
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        priceType: formData.priceType,
      }
      setServices(prev => [...prev, newService])
      toast.success('Service added')
    }

    setIsLoading(false)
    setIsDialogOpen(false)
    resetForm()
  }

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lakh`
    }
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Services & Pricing
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your service offerings and pricing
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
                <DialogDescription>
                  {editingService 
                    ? 'Update your service details' 
                    : 'Add a new service to your profile'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="serviceName">Service Name</FieldLabel>
                    <Input
                      id="serviceName"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Wedding Photography"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="serviceDesc">Description</FieldLabel>
                    <Textarea
                      id="serviceDesc"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what's included..."
                      rows={3}
                      required
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="servicePrice">Price (₹)</FieldLabel>
                      <Input
                        id="servicePrice"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="50000"
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="priceType">Price Type</FieldLabel>
                      <Select 
                        value={formData.priceType} 
                        onValueChange={(v) => setFormData(prev => ({ ...prev, priceType: v as Service['priceType'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="starting">Starting From</SelectItem>
                          <SelectItem value="fixed">Fixed Price</SelectItem>
                          <SelectItem value="hourly">Per Hour</SelectItem>
                          <SelectItem value="per-day">Per Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </FieldGroup>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-primary text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingService ? 'Update Service' : 'Add Service'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(service)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-sm text-muted-foreground capitalize">
                        {service.priceType.replace('-', ' ')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No services added yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first service to start attracting couples
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
