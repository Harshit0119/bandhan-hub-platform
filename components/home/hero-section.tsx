'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function HeroSection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 🎥 BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/cover-5.webp"
          alt="Wedding background"
          fill
          priority
          quality={60}
          className="w-full h-full object-cover filter brightness-44"
        />
        {/* 🌫 GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-linear-b from-black/90 via-black/90 to-black/90" />
      </div>

      {/* 🧠 CONTENT */}
      <div className="relative z-20 text-center px-4 max-w-4xl animate-fade-in">
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        > */}

        <span className="inline-block px-4 py-2 mb-6 text-sm text-[#D4AF37] border border-[#D4AF37]/30 rounded-full bg-black/40 backdrop-blur">
          India&apos;s Premier Wedding Vendor Platform
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          Where Your Wedding
          <br />
          <span className="text-accent">Comes Together</span>
        </h1>

        <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl mx-auto">
          Find trusted vendors for your perfect wedding — photographers, decorators & more.
        </p>

        {/* 🔥 BUTTONS FIXED */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link href="/vendors">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg"
            >
              Explore Vendors
            </Button>
          </Link>

          <Link href="/signup?vendor=true">
            <Button
              size="lg"
              className="border border-white text-white bg-white/10 backdrop-blur hover:bg-white/20 px-8 py-6 text-lg"
            >
              Join as Vendor
            </Button>
          </Link>

        </div>

        {/* 📊 STATS */}
        <div className="mt-12 flex justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-accent">500+</div>
            <div className="text-xs text-white/70">Vendors</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">50+</div>
            <div className="text-xs text-white/70">Cities</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">10K+</div>
            <div className="text-xs text-white/70">Couples</div>
          </div>
        </div>

        {/* </motion.div> */}
      </div>

    </section>
  )
}