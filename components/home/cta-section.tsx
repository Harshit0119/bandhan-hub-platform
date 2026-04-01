'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

const benefits = [
  'Reach thousands of couples',
  'Featured listing options',
  'Easy profile management',
  'Direct inquiries via WhatsApp',
]

export function CTASection() {
  return (
    <section className="py-20 bg-linear-to-br from-primary to-primary/80 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Are You a Wedding Vendor?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg">
              Join BandhanHub and showcase your services to thousands of couples planning their special day.
            </p>

            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-white"
                >
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul> 

            <Link href="/signup?vendor=true">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
                Join as Vendor
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Pricing Cards Preview */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-white text-xl font-semibold mb-6">Choose Your Plan</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">Free Plan</span>
                      <span className="text-accent">₹0/month</span>
                    </div>
                    <p className="text-white/60 text-sm">Basic listing on vendors page</p>
                  </div>
                  
                  <div className="bg-accent/20 rounded-lg p-4 border-2 border-accent">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">Premium Plan</span>
                      <span className="text-accent">₹199/month</span>
                    </div>
                    <p className="text-white/60 text-sm">Featured on homepage + priority listing</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
