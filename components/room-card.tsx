'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Users, Wind, Heart, Star, Box } from 'lucide-react'
import { formatPrice, type Currency, DEFAULT_CURRENCY } from '@/lib/currency'
import { cn } from '@/lib/utils'

interface RoomCardProps {
  id: number
  slug: string
  name: string
  category: string
  price: number
  guests: number
  amenities: string[]
  image?: string
  available?: number
  total?: number
}

export default function RoomCard({ id, slug, name, category, price, guests, amenities, image, available, total }: RoomCardProps) {
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('currency') as Currency
    if (saved) {
      setCurrency(saved)
    }

    const handleCurrencyChange = (event: Event) => {
      const customEvent = event as CustomEvent<Currency>
      setCurrency(customEvent.detail)
    }

    window.addEventListener('currencyChanged', handleCurrencyChange)
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange)
  }, [])

  if (!mounted) return null

  return (
    <div className="group premium-card flex flex-col luxury-shadow hover:luxury-shadow-hover transition-all duration-500 hover:-translate-y-1 gpu-accel h-full">
      {/* Room Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted group-hover:after:opacity-50 after:opacity-0 after:absolute after:inset-0 after:bg-black/20 after:transition-opacity after:duration-500">
        <Image
          src={image || `/rooms/deluxe-room.jpg`}
          alt={name}
          fill
          className="object-cover transition-transform duration-[1000ms] group-hover:scale-110 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-6 left-6 z-10">
          <span className="inline-block px-4 py-1.5 bg-white/95 backdrop-blur-md text-[10px] font-bold text-primary tracking-[0.2em] uppercase rounded-full shadow-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-10 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-primary text-primary" />
          ))}
        </div>
        
        <h3 className="text-2xl font-serif font-bold text-foreground mb-5 group-hover:text-primary transition-colors duration-300 italic">
          {name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[10px] font-bold text-muted-foreground mb-8 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            <span>{guests} Guests</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <div className="flex items-center gap-2">
            <Wind className="w-3.5 h-3.5" />
            <span>A/C Room</span>
          </div>
          
          {available !== undefined && (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-border" />
              <div className={cn("flex items-center gap-2", available === 0 ? "text-destructive" : "text-primary")}>
                <Box className="w-3.5 h-3.5" />
                <span>{available === 0 ? "Fully Booked" : `Available: ${available} Rooms`}</span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4 mb-10 shrink-0">
          {amenities.slice(0, 3).map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm text-foreground/80">
              <div className="w-2 h-0.5 bg-primary/40 rounded-full" />
              <span className="font-light tracking-wide">{amenity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 pt-8 mt-auto flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest mb-2 italic">Refined Stay</p>
            <p className="text-3xl font-serif font-bold text-primary flex items-baseline gap-1">
              {formatPrice(price, currency)}
              <span className="text-[10px] font-medium text-foreground/70 uppercase tracking-widest">/ Night</span>
            </p>
          </div>
          
          <Button asChild className="luxury-button bg-primary text-white hover:bg-black px-6 py-4 rounded-2xl h-auto border-none shadow-lg shadow-primary/20">
            <Link href={`/rooms/${slug}`}>
              Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

