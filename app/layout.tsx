// app/layout.tsx

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
  metadataBase: new URL('https://bandhanhub.com'),

  title: {
    default: 'Bandhan Hub - Find Best Wedding Vendors in India',
    template: '%s | Bandhan Hub',
  },

  description:
    'Discover top wedding photographers, planners, makeup artists and venues across India. Compare prices, view portfolios and book trusted vendors on Bandhan Hub.',

  keywords: [
    'wedding vendors India',
    'wedding photographers',
    'wedding planners',
    'makeup artists',
    'wedding marketplace India',
    'Bandhan Hub',
  ],

  icons: {
    icon: '/bandhanhub.ico',
  },

  openGraph: {
    title: 'Bandhan Hub - Find Best Wedding Vendors in India',
    description:
      'Browse and book top wedding vendors across India. Photographers, planners, makeup artists & more.',
    url: 'https://bandhan-hub.vercel.app',
    siteName: 'Bandhan Hub',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Bandhan Hub',
    description: 'Find the best wedding vendors across India.',
  },

  robots: {
    index: true,
    follow: true,
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
    <html lang="en-In" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://bandhan-hub.vercel.app" />
        {/* ✅ Faster Supabase connection */}
        <link
          rel="preconnect"
          href="https://ujspkyagiyezehdlxdsw.supabase.co"
        />
        <link
          rel="dns-prefetch"
          href="https://ujspkyagiyezehdlxdsw.supabase.co"
        />
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="7wYq9gRJq3xBgIblcag24FNhuqewAQGEkm9cSeTv3Ow" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Bandhan Hub",
              url: "https://bandhan-hub.vercel.app",
              logo: "https://bandhan-hub.vercel.app/bandhan-hublogo.png",
              sameAs: [
                "https://instagram.com/bandhan_hub"
              ]
            }),
          }}
        />
      </head>

      <body
        className={`${playfair.variable} ${lato.variable} font-sans antialiased overflow-x-hidden`}
      >
        <AuthProvider>
          {/* ✅ Prevent layout shift + blank feeling */}
          <div className="min-h-screen flex flex-col">
            {children}
          </div>

          {/* ✅ Toast outside layout flow */}
          <Toaster richColors closeButton />
        </AuthProvider>

        {/* ✅ Non-blocking analytics */}
        <Analytics />
      </body>
    </html>
  )
}


// app/layout.tsx

// import type { Metadata, Viewport } from 'next'
// import { Playfair_Display, Lato } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import { AuthProvider } from '@/lib/auth-context'
// import { Toaster } from '@/components/ui/sonner'
// import './globals.css'

// const playfair = Playfair_Display({
//   subsets: ['latin'],
//   variable: '--font-serif',
//   display: 'swap',
// })

// const lato = Lato({
//   subsets: ['latin'],
//   weight: ['300', '400', '700', '900'],
//   variable: '--font-sans',
//   display: 'swap',
// })

// export const metadata: Metadata = {
//   title: 'BandhanHub - Bringing Your Wedding Team Together',
//   description:
//     'Find and connect with the best wedding vendors across India.',
//   icons: {
//     icon: '/bandhanhub.ico',
//   },
//   openGraph: {
//     title: 'BandhanHub',
//     description: 'Find the best wedding vendors across India.',
//     type: 'website',
//   },
// }

// export const viewport: Viewport = {
//   themeColor: '#8B0000',
//   width: 'device-width',
//   initialScale: 1,
// }


// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <head>
//         <link
//           rel="preconnect"
//           href="https://ujspkyagiyezehdlxdsw.supabase.co"
//         />
//       </head>
//       <body className={`${playfair.variable} ${lato.variable} font-sans antialiased overflow-x-hidden`}
//       >

//         {/* ✅ Auth wrapper */}
//         <AuthProvider>
//           {/* ✅ Prevent blank screen feeling */}
//           <div className="min-h-screen">
//             {children}
//           </div>

//           <Toaster />
//         </AuthProvider>

//         {/* ✅ Analytics (non-blocking) */}
//         <Analytics />
//       </body>
//     </html>
//   )
// }
