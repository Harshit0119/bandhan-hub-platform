'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

function FloatingPetal({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full opacity-50"
      style={{
        background: "linear-gradient(135deg, #FADADD, #D4AF37)",
        left: `${x}%`,
        top: '100%',
      }}
      animate={{ y: [-200], opacity: [0, 0.6, 0] }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

export function HeroSection() {
  const [petals, setPetals] = useState<any[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)

    setPetals(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        delay: i * 0.5,
        x: Math.random() * 100,
      }))
    )
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 🎥 BACKGROUND */}
      <div className="absolute inset-0 z-0">

        {/* ✅ MOBILE OR VIDEO FAIL → IMAGE */}
        {isMobile || videoError ? (
          <img
            src="/cover-5.jpg"
            alt="Wedding background"
            className="w-full h-full object-cover filter brightness-44"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)} // ✅ fallback trigger
            className="w-full h-full object-cover filter brightness-55"
          >
            <source src="/bandhanHub.mp4" type="video/mp4" />
          </video>
        )}

        {/* 🌫 GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-linear-b from-black/90 via-black/90 to-black/90" />
      </div>

      {/* 🌸 PETALS (only desktop) */}
      {!isMobile && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {petals.map(p => <FloatingPetal key={p.id} {...p} />)}
        </div>
      )}

      {/* 🧠 CONTENT */}
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

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

        </motion.div>
      </div>

    </section>
  )
}