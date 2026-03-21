'use client'

import Link from 'next/link'
import { Camera, Heart, Music, UtensilsCrossed, Palette, Sparkles, Users, Mic2, Flower2, Scissors } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  { name: 'Photographer', icon: Camera, color: 'bg-rose-100 text-rose-600' },
  { name: 'Wedding Planner', icon: Heart, color: 'bg-pink-100 text-pink-600' },
  { name: 'DJ', icon: Music, color: 'bg-purple-100 text-purple-600' },
  { name: 'Caterer', icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-600' },
  { name: 'Makeup Artist', icon: Palette, color: 'bg-fuchsia-100 text-fuchsia-600' },
  { name: 'Mehendi Artist', icon: Sparkles, color: 'bg-amber-100 text-amber-600' },
  { name: 'Decorator', icon: Flower2, color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Anchor', icon: Mic2, color: 'bg-blue-100 text-blue-600' },
  { name: 'Pre-wedding Shoot', icon: Users, color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Beauty Parlour', icon: Scissors, color: 'bg-red-100 text-red-600' },
]

export function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect vendors for every aspect of your wedding celebration.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/vendors?category=${encodeURIComponent(category.name)}`}>
                  <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                    <div className={`p-4 rounded-full ${category.color} transition-transform group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">
                      {category.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
