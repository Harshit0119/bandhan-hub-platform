'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function InquiriesPage() {
    const { user } = useAuth()
    const [inquiries, setInquiries] = useState<any[]>([])
    const [vendorSlug, setVendorSlug] = useState<string | null>(null)
    const [vendorId, setVendorId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return

            // 1. get vendor id
            const { data: vendor } = await supabase
                .from('vendors')
                .select('id, slug')
                .eq('user_id', user.id)
                .single()

            if (!vendor) return

            setVendorId(vendor.id)
            setVendorSlug(vendor.slug)

            // 2. get inquiries
            const { data } = await supabase
                .from('inquiries')
                .select('*')
                .eq('vendor_id', vendor.id)
                .order('created_at', { ascending: false })

            setInquiries(data || [])
            setLoading(false)
        }

        fetchData()
    }, [user])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="animate-spin h-6 w-6" />
            </div>
        )
    }

    return (
        <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6">Inquiries</h1>

            {inquiries.length === 0 ? (
                // ✅ EMPTY STATE UI
                <div className="flex flex-col items-center justify-center text-center h-[60vh]">
                    <Mail className="h-12 w-12 text-muted-foreground mb-4" />

                    <h2 className="text-xl font-semibold mb-2">
                        No inquiries yet
                    </h2>

                    <p className="text-muted-foreground mb-6 max-w-sm">
                        Share your profile with customers to start receiving booking inquiries.
                    </p>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => {
                                const link = `${window.location.origin}/vendor/${vendorSlug || vendorId}`
                                navigator.clipboard.writeText(link)
                                toast.success("Link Copied!", {
                                    description: "Share it with your customers🚀"
                                })
                            }}
                        >
                            Copy Profile Link
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                const link = `${window.location.origin}/vendor/${vendorSlug || vendorId}`
                                window.open(`https://wa.me/?text=${link}`, '_blank')
                            }}
                        >
                            Share on WhatsApp
                        </Button>
                    </div>
                </div>
            ) : (
                // ✅ WHEN DATA EXISTS
                <div className="space-y-4">
                    {inquiries.map((inq) => (
                        <Card key={inq.id}>
                            <CardContent className="p-5 space-y-3">

                                {/* TOP */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{inq.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(inq.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span className="text-xs px-2 py-1 rounded bg-gray-100">
                                        {inq.status || 'new'}
                                    </span>
                                </div>

                                {/* MESSAGE */}
                                <p className="text-sm text-muted-foreground">
                                    {inq.message}
                                </p>

                                {/* CONTACT */}
                                <div className="text-sm">
                                    <p><b>Phone:</b> {inq.phone}</p>
                                    {inq.email && <p><b>Email:</b> {inq.email}</p>}
                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        size="sm"
                                        onClick={async () => {
                                            await supabase
                                                .from('inquiries')
                                                .update({ status: 'contacted' })
                                                .eq('id', inq.id)

                                            setInquiries(prev =>
                                                prev.map(i =>
                                                    i.id === inq.id ? { ...i, status: 'contacted' } : i
                                                )
                                            )
                                        }}
                                    >
                                        Contacted
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={async () => {
                                            await supabase
                                                .from('inquiries')
                                                .update({ status: 'booked' })
                                                .eq('id', inq.id)

                                            setInquiries(prev =>
                                                prev.map(i =>
                                                    i.id === inq.id ? { ...i, status: 'booked' } : i
                                                )
                                            )
                                        }}
                                    >
                                        Booked 💰
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={async () => {
                                            await supabase
                                                .from('inquiries')
                                                .update({ status: 'ignored' })
                                                .eq('id', inq.id)
                                            setInquiries(prev =>
                                                prev.map(i =>
                                                    i.id === inq.id ? { ...i, status: 'ignored' } : i
                                                )
                                            )
                                        }}
                                    >
                                        Ignore
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}