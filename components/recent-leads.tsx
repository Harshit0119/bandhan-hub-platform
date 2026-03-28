'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

export function RecentLeads() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => {
    if (!user?.vendorId) return

    const fetchLeads = async () => {
      const { data } = await supabase
        .from('inquiries')
        .select('id, name, status, created_at')
        .eq('vendor_id', user.vendorId)
        .order('created_at', { ascending: false })
        .limit(3)

      setLeads(data || [])
    }

    fetchLeads()
  }, [user])

  return (
    <div className="space-y-2">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="flex justify-between items-center border rounded-lg px-3 py-2"
        >
          <div>
            <p className="text-sm font-medium">{lead.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(lead.created_at).toLocaleDateString()}
            </p>
          </div>

          <span className="text-xs px-2 py-1 rounded bg-gray-100">
            {lead.status || 'new'}
          </span>
        </div>
      ))}
    </div>
  )
}