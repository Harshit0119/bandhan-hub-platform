'use client'

import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { mockTestimonials } from '@/lib/mock-data'
export function TestimonialsSection() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Love Stories We Helped Create
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from the happy couples who found their perfect wedding team through BandhanHub.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {mockTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 lg:p-8 shadow-lg border border-border relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-6 bg-accent p-2 rounded-full">
                <Quote className="h-5 w-5 text-accent-foreground" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4 pt-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 mb-6 leading-relaxed">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="/blur.png"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
