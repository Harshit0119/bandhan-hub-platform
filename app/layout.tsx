import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

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
  description: 'Find and connect with the best wedding vendors across India. From photographers to makeup artists, planners to decorators - BandhanHub is your one-stop destination for all wedding services.',
  keywords: ['wedding vendors', 'wedding planners', 'photographers', 'makeup artists', 'Indian weddings', 'wedding marketplace',],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: 'BandhanHub - Bringing Your Wedding Team Together',
    description: 'Find and connect with the best wedding vendors across India.',
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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
