'use client'

import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatPrice, type Currency, DEFAULT_CURRENCY } from '@/lib/currency'

interface BookingCardProps {
  room: {
    id: number
    price: number
    guests: number
  }
}

export default function BookingCard({ room }: BookingCardProps) {
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [guests, setGuests] = useState(1)
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

  if (!mounted) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8 sticky top-28 h-fit soft-shadow">
      {/* Price */}
      <div className="mb-8 pb-8 border-b border-border">
        <p className="text-sm text-foreground/60 mb-2">Price per night</p>
        <p className="text-4xl font-serif font-bold text-primary">
          {formatPrice(room.price, currency)}
        </p>
      </div>

      {/* Guests */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-foreground mb-2">
          <Users className="w-5 h-5" />
          <span className="font-semibold">Max {room.guests} Guests</span>
        </div>
      </div>

      {/* Booking Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Check-in
          </label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Check-out
          </label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            {Array.from({ length: room.guests }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Book Button */}
      <Button asChild className="w-full luxury-button bg-primary text-primary-foreground hover:bg-primary/90 py-3 h-auto text-base">
        <Link href={`/booking?roomId=${room.id}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}`}>
          Book Now
        </Link>
      </Button>

      {/* Contact Concierge */}
      <Button variant="outline" asChild className="w-full mt-3 luxury-button border-border hover:bg-accent/5">
        <Link href="/contact">
          Contact Concierge
        </Link>
      </Button>
    </div>
  )
}
