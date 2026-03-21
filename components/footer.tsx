'use client'

import Link from 'next/link'
import { Instagram, Twitter, Facebook, Mail, Phone } from 'lucide-react'

const footerLinks = {
  vendors: [
    { name: 'All Vendors', href: '/vendors' },
    { name: 'Photographers', href: '/vendors?category=Photographer' },
    { name: 'Makeup Artists', href: '/vendors?category=Makeup Artist' },
    { name: 'Wedding Planners', href: '/vendors?category=Wedding Planner' },
    { name: 'Decorators', href: '/vendors?category=Decorator' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Blog', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'FAQ', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold">
                Bandhan<span className="text-accent">Hub</span>
              </span>
            </Link>
            <p className="text-background/70 mb-6 text-sm leading-relaxed">
              Bringing your wedding team together. Connect with the best wedding vendors across India.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/70 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Vendors */}
          <div>
            <h4 className="font-semibold mb-4">Find Vendors</h4>
            <ul className="space-y-3">
              {footerLinks.vendors.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-background/70 hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-background/70 hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Mail className="h-4 w-4" />
                hello@bandhanhub.com
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/50 text-sm">
          <p>&copy; {new Date().getFullYear()} BandhanHub. All rights reserved. Made with love in India.</p>
        </div>
      </div>
    </footer>
  )
}
