'use client'

import { ExternalLink } from 'lucide-react'

export default function MapSection() {
  return (
    <section className="py-24 bg-background animate-fade-in relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group overflow-hidden rounded-[2rem] border border-primary/10 luxury-shadow hover:luxury-shadow-hover transition-all duration-700 gpu-accel">
          {/* Map Embed */}
          <div className="h-[320px] sm:h-[450px] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.516652615756!2d79.42162577576246!3d13.626306300185247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4d4b007cc9d2a3%3A0x88165d8893744be1!2sSri%20Ganesh%20Residency!5e0!3m2!1sen!2sin!4v1774866307520!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.2] contrast-[1.1] transition-transform duration-[3000ms] group-hover:scale-105"
            ></iframe>
          </div>

          {/* Button Overlay */}
          <div className="absolute top-6 left-6 flex items-center gap-3">
            <a 
              href="https://www.google.com/maps?q=Sri+Ganesh+Residency"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-primary transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 border border-white/10"
            >
              Open in Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Decorative Corner */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-tl-[3rem] border-t border-l border-primary/20 pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
