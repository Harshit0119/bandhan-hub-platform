'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 🎥 BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/cover-5.webp"
          alt="Wedding background"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover brightness-110 will-change-transform"
          placeholder="blur"
          blurDataURL="/blur.png"
        />

        {/* 🌫 GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* 🧠 CONTENT */}
      <div className="relative z-20 text-center px-4 max-w-4xl">

        <span className="inline-block px-4 py-2 mb-6 text-sm text-[#D4AF37] border border-[#D4AF37]/30 rounded-full bg-black/40 backdrop-blur">
          India&apos;s Premier Wedding Vendor Platform
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Where Your Wedding
          <br />
          <span className="text-accent">Comes Together</span>
        </h1>

        <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl mx-auto">
          Find trusted vendors for your perfect wedding — photographers, decorators & more.
        </p>

        {/* 🔥 BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/vendors" prefetch>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg"
            >
              Explore Vendors
            </Button>
          </Link>

          <Link href="/signup?vendor=true" prefetch>
            <Button
              size="lg"
              className="border border-white text-white bg-white/10 backdrop-blur hover:bg-white/20 px-8 py-6 text-lg"
            >
              Join as Vendor
            </Button>
          </Link>

          {/* 🎥 DEMO BUTTON */}
          <Link href="#" onClick={(e) => {
            e.preventDefault();
            setShowVideo(true);
          }}>
            <Button
              size="lg"
              className="border border-white text-white bg-black hover:bg-black/20 px-8 py-6 text-lg"
            >
              Watch Demo
            </Button>
          </Link>
        </div>

        {/* 📊 STATS */}
        <div className="mt-12 flex justify-center gap-8 text-center">
          {[
            { value: "Growing", label: "Vendor Network" },
            { value: "Expanding", label: "Across India" },
            { value: "Connecting", label: "Couples & Services" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-bold text-accent">{item.value}</div>
              <div className="text-xs text-white/70">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* 🎬 VIDEO MODAL */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="relative w-full max-w-3xl">

            {/* ❌ CLOSE BUTTON */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-10 right-0 text-white text-2xl"
            >
              ✕
            </button>


            {/* ▶️ YOUTUBE EMBED */}
            <div className="w-full max-w-md mx-auto">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/qYASE9G12bg"
                  title="BandhanHub Tutorial | Seamless Wedding Vendor Onboarding & Payments"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}




//components\home\hero-section.tsx
// 'use client'

// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import Image from 'next/image'

// export function HeroSection() {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

//       {/* 🎥 BACKGROUND */}
//       <div className="absolute inset-0 z-0">
//         <Image
//           src="/cover-5.webp"
//           alt="Wedding background"
//           fill
//           priority
//           sizes="100vw" // ✅ VERY IMPORTANT (LCP FIX)
//           quality={60}
//           className="object-cover brightness-120"
//           placeholder="blur"
//           blurDataURL="/blur.png"
//         />

//         {/* 🌫 GRADIENT OVERLAY */}
//         <div className="absolute inset-0 bg-black/70" />
//       </div>

//       {/* 🧠 CONTENT */}
//       <div className="relative z-20 text-center px-4 max-w-4xl">

//         <span className="inline-block px-4 py-2 mb-6 text-sm text-[#D4AF37] border border-[#D4AF37]/30 rounded-full bg-black/40 backdrop-blur">
//           India&apos;s Premier Wedding Vendor Platform
//         </span>

//         <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
//           Where Your Wedding
//           <br />
//           <span className="text-accent">Comes Together</span>
//         </h1>

//         <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl mx-auto">
//           Find trusted vendors for your perfect wedding — photographers, decorators & more.
//         </p>

//         {/* 🔥 BUTTONS */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">

//           <Link href="/vendors">
//             <Button
//               size="lg"
//               className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg"
//             >
//               Explore Vendors
//             </Button>
//           </Link>

//           <Link href="/signup?vendor=true">
//             <Button
//               size="lg"
//               className="border border-white text-white bg-white/10 backdrop-blur hover:bg-white/20 px-8 py-6 text-lg"
//             >
//               Join as Vendor
//             </Button>
//           </Link>

//         </div>

//         {/* 📊 STATS */}
//         <div className="mt-12 flex justify-center gap-8 text-center">
//           <div>
//             <div className="text-2xl font-bold text-accent">500+</div>
//             <div className="text-xs text-white/70">Vendors</div>
//           </div>
//           <div>
//             <div className="text-2xl font-bold text-accent">50+</div>
//             <div className="text-xs text-white/70">Cities</div>
//           </div>
//           <div>
//             <div className="text-2xl font-bold text-accent">10K+</div>
//             <div className="text-xs text-white/70">Couples</div>
//           </div>
//         </div>

//       </div>

//     </section>
//   )
// }