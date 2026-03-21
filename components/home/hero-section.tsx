'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

// Floating petal component
function FloatingPetal({ delay, duration, startX, startY }: { delay: number; duration: number; startX: number; startY: number }) {
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-full opacity-60"
      style={{
        background: "linear-gradient(135deg, #FADADD 0%, #D4AF37 100%)",
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      animate={{
        y: [0, -100, -200],
        x: [0, 30, -20, 40],
        rotate: [0, 180, 360],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Glowing particle component
function GlowingParticle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-[#D4AF37]"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function HeroSection() {
  const [petals, setPetals] = useState<{ id: number; delay: number; duration: number; startX: number; startY: number }[]>([]);
  const [particles, setParticles] = useState<{ id: number; delay: number; x: number; y: number }[]>([]);

  useEffect(() => {
    // Generate random values only on client
    setPetals(
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        delay: i * 0.5,
        duration: 8 + Math.random() * 4,
        startX: Math.random() * 100,
        startY: 80 + Math.random() * 20,
      }))
    );

    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: i * 0.3,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }))
    );
  }, []);
  
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full min-h-full object-cover">
          <source src="/bandhanHub.mp4" type="video/mp4" />
        </video>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
      </div>
      {/* Floating Petals */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {petals.map((petal) => (
          <FloatingPetal key={petal.id} {...petal} />
        ))}
      </div>
      {/* Glowing Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {particles.map((particle) => (
          <GlowingParticle key={particle.id} {...particle} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8,ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium tracking-wider text-[#D4AF37] border border-[#D4AF37]/30 rounded-full bg-black/20 backdrop-blur-sm">
              India&apos;s Premier Wedding Vendor Platform
            </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Where Your Wedding
            <br />
            <span className="text-accent">Comes Together</span>
          </h1>

           <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with India&apos;s finest wedding vendors. From photographers to decorators, 
            find your perfect wedding team on BandhanHub.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/vendors">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6">
                Explore Vendors
              </Button>
            </Link>
            <Link href="/signup?vendor=true">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-red hover:bg-white/10 text-lg px-8 py-6"
              >
                Join as Vendor
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">500+</div>
              <div className="text-sm text-white/70">Verified Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">50+</div>
              <div className="text-sm text-white/70">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">10K+</div>
              <div className="text-sm text-white/70">Happy Couples</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
