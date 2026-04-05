'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

interface Notification {
    id: string
    title: string
    message: string
    link: string | null
    is_read: boolean
    created_at: string
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const router = useRouter()
    const { user } = useAuth()

    // ✅ fetch notifications
    const fetchNotifications = async () => {
        if (!user) return

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)

        setNotifications(data || [])
    }

    useEffect(() => {
        if (!user) return

        fetchNotifications()

        // ❗ REMOVE OLD CHANNEL (VERY IMPORTANT)
        const existing = supabase.getChannels()
        existing.forEach((ch) => supabase.removeChannel(ch))

        // ✅ CREATE CHANNEL
        const channel = supabase.channel(`notifications-${user.id}`)

        // ✅ ADD LISTENER FIRST
        channel.on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
                console.log('🔥 NEW NOTIFICATION:', payload)

                setNotifications((prev) => [payload.new as Notification, ...prev])

                // 🔊 SOUND
                const audio = new Audio('/notification.mp3')
                audio.volume = 0.5
                audio.play().catch(() => { })
            }
        )

        // ✅ THEN SUBSCRIBE (IMPORTANT ORDER)
        channel.subscribe((status) => {
            console.log('Realtime status:', status)
        })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user])

    const unreadCount = notifications.filter((n) => !n.is_read).length

    const handleClick = async (n: Notification) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', n.id)

        if (n.link) router.push(n.link)

        fetchNotifications()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <div className="relative">
                        <Bell className="h-5 w-5" />

                        {/* 🔴 Dot */}
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full" />
                        )}
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b font-semibold">
                    Notifications
                </div>

                {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => handleClick(n)}
                                className={cn(
                                    'p-3 border-b cursor-pointer hover:bg-muted transition',
                                    !n.is_read && 'bg-primary/10'
                                )}
                            >
                                <div className="text-sm font-medium">
                                    {n.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {n.message}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}