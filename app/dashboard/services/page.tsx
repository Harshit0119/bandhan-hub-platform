'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'

import { Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Empty } from '@/components/ui/empty'
import { set } from 'date-fns'

export default function ServicesPage() {
  const { user } = useAuth()

  const [vendorId, setVendorId] = useState<string | null>(null)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    price_type: 'starting',
  })

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user: supaUser },
      } = await supabase.auth.getUser()

      if (!supaUser) {
        console.log("NO SUPABASE USER")
        return
      }

      console.log('USER:', user)

      const session = await supabase.auth.getSession()
      console.log("SESSION:", session)

      const userCheck = await supabase.auth.getUser()
      console.log("USER CHECK:", userCheck)

      // 1. get vendor
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (vendorError) {
        console.error('VENDOR ERROR:', vendorError)
        toast.error('Failed to load vendor')
        return
      }

      if (!vendor) {
        toast.error('Vendor not found')
        return
      }

      console.log('VENDOR:', vendor)

      setVendorId(vendor.id)

      // 2. get services
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('vendor_id', vendor.id)

      if (error) {
        console.error('FETCH SERVICES ERROR:', error)
        toast.error('Failed to fetch services')
        setLoading(false)
        return
      }

      console.log('SERVICES:', data)

      setServices(data || [])
      setLoading(false)
    }

    fetchData()
  }, [user])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      price_type: 'starting',
    })
    setEditingService(null)
  }

  const handleEdit = (service: any) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price?.toString() || '',
      price_type: service.price_type || 'starting',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id)

    if (error) {
      console.error(error)
      toast.error('Delete failed')
      return
    }

    setServices(prev => prev.filter(s => s.id !== id))
    toast.success('Service deleted')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!vendorId) {
      toast.error('Vendor not loaded')
      return
    }

    const payload = {
      vendor_id: vendorId,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      price_type: formData.price_type,
    }

    console.log('PAYLOAD:', payload)

    if (editingService) {
      const { data, error } = await supabase
        .from('services')
        .update(payload)
        .eq('id', editingService.id)
        .select()
        .single()

      if (error) {
        console.error(error)
        toast.error('Update failed')
        return
      }

      setServices(prev =>
        prev.map(s => (s.id === editingService.id ? data : s))
      )

      toast.success('Service updated')
    } else {
      const { data, error } = await supabase
        .from('services')
        .insert(payload)
        .select()
        .single()

      if (error) {
        console.error('INSERT ERROR:', error)
        toast.error('Failed to add service')
        return
      }

      setServices(prev => [data, ...prev])
      toast.success('Service added')
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const formatPrice = (price: number) => {
    if (!price) return '₹0'
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lakh`
    }
    return `₹${price.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Services & Pricing</h1>
            <p className="text-muted-foreground">
              Manage your offerings
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>

            <DialogContent className="space-y-4">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Edit Service' : 'Add Service'}
                </DialogTitle>
                <DialogDescription>
                  Add details about your service
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Service Name"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />

                <Input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={e =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />

                <Select
                  value={formData.price_type}
                  onValueChange={v =>
                    setFormData({ ...formData, price_type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starting">Starting</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="per-day">Per Day</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="w-full">
                  {editingService ? 'Update' : 'Add'} Service
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* LIST */}
        {services.length === 0 ? (
          <Card className="p-10 text-center flex flex-col items-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

            <p className="text-lg font-semibold mb-2">
              No services yet
            </p>

            <p className="text-sm text-muted-foreground mb-4">
              Add your first service to start getting leads 🚀
            </p>

            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {services
              .filter((s) => s && s.name)
              .map((s) => (
                <Card key={s.id}>
                  <CardHeader>
                    <CardTitle>{s.name}</CardTitle>
                    <CardDescription>{s.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex justify-between items-center">
                    <span className="font-bold text-primary">
                      {formatPrice(s.price)}
                    </span>

                    <div className="flex gap-2">
                      <Button size="icon" onClick={() => handleEdit(s)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
