// app/layout.tsx

import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import Script from 'next/script'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BandhanHub - Bringing Your Wedding Team Together',
  description:
    'Find and connect with the best wedding vendors across India.',
  icons: {
    icon: '/bandhanhub.ico',
  },
  openGraph: {
    title: 'BandhanHub',
    description: 'Find the best wedding vendors across India.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#8B0000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${lato.variable} font-sans antialiased overflow-x-hidden`}
      >
        {/* ✅ Load Razorpay AFTER page load (performance fix) */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        {/* ✅ Auth wrapper */}
        <AuthProvider>
          {/* ✅ Prevent blank screen feeling */}
          <div className="min-h-screen">
            {children}
          </div>

          <Toaster />
        </AuthProvider>

        {/* ✅ Analytics (non-blocking) */}
        <Analytics />
      </body>
    </html>
  )
}
