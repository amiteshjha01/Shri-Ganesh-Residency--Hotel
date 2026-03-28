'use client'

import { useState, useMemo, useEffect } from 'react'
import RoomFilter from '@/components/room-filter'
import RoomCard from '@/components/room-card'
import Image from 'next/image'

interface Room {
  id: number
  slug: string
  name: string
  category: string
  price: number
  guests: number
  amenities: string[]
  image?: string
  images?: string[]
  video?: string
  available?: number
  total?: number
}

interface FilterState {
  type: string[]
  priceRange: [number, number]
  guests: number
}

interface RoomsContentProps {
  rooms: Room[]
  dictionary: any
}

import Breadcrumbs from '@/components/breadcrumb'

export default function RoomsContent({ rooms, dictionary }: RoomsContentProps) {
  const [localAvailability, setLocalAvailability] = useState<Record<string, number>>({})
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    priceRange: [100, 10000],
    guests: 0
  })

  // Sync availability from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sgr_room_availability')
    if (saved) {
      try {
        setLocalAvailability(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse availability')
      }
    }

    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, number>>
      setLocalAvailability(customEvent.detail)
    }

    window.addEventListener('roomAvailabilityChanged', handleUpdate)
    return () => window.removeEventListener('roomAvailabilityChanged', handleUpdate)
  }, [])

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      // Filter by type
      if (filters.type.length > 0 && !filters.type.includes(room.category)) {
        return false
      }

      // Filter by price
      if (room.price < filters.priceRange[0] || room.price > filters.priceRange[1]) {
        return false
      }

      // Filter by guests
      if (filters.guests > 0 && room.guests < filters.guests) {
        return false
      }

      return true
    })
  }, [rooms, filters])

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header with Professional Background */}
      <div className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105 gpu-accel transition-transform duration-[3000ms] hover:scale-100 ease-out">
          <Image
            src="/rooms/Deluxe/WhatsApp Image 2026-03-21 at 12.57.28.jpeg"
            alt="Stay with Us"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="mb-10 animate-fade-in [animation-delay:200ms]">
            <Breadcrumbs items={[{ label: dictionary.common.rooms }]} variant="dark" />
          </div>
          <div className="inline-block py-2 px-6 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full mb-8 animate-fade-in [animation-delay:400ms] transition-transform hover:scale-105 duration-500 gpu-accel text-white">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Private Sanctuaries</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-10 leading-[0.9] animate-fade-in [animation-delay:600ms] italic tracking-tighter drop-shadow-2xl">
            {dictionary.common.rooms_title}
          </h1>
          <div className="w-24 h-1 bg-primary/40 mx-auto mb-10 rounded-full animate-fade-in [animation-delay:700ms]" />
          <p className="text-xl text-white max-w-3xl mx-auto font-light leading-relaxed animate-fade-in [animation-delay:800ms] gpu-accel drop-shadow-md">
            {dictionary.common.rooms_subtitle} Explore our collection of boutique accommodations tailored for the discerning traveler.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Sidebar Filter */}
          <div className="lg:col-span-1 animate-fade-in [animation-delay:1000ms] gpu-accel">
            <div className="sticky top-32">
              <RoomFilter onFilterChange={setFilters} />
            </div>
          </div>

          {/* Room Grid */}
          <div className="lg:col-span-3">
            {filteredRooms.length > 0 ? (
              <div className="space-y-12">
                <div className="flex items-center justify-between animate-fade-in [animation-delay:1100ms] group">
                  <p className="text-[10px] font-bold text-foreground/70 uppercase tracking-[0.3em] transition-colors group-hover:text-primary duration-500">
                    Displaying {filteredRooms.length} of {rooms.length} Exquisite Options
                  </p>
                  <div className="h-px flex-grow mx-8 bg-border/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 gpu-accel">
                  {filteredRooms.map((room, idx) => {
                    const roomKey = room.id === 1 ? 'deluxe' : 
                                  room.id === 2 ? 'doubleDeluxe' : 
                                  room.id === 3 ? 'room10' : 'room16'
                    
                    const available = localAvailability[roomKey] !== undefined 
                      ? localAvailability[roomKey] 
                      : room.available

                    return (
                      <div key={room.id} className="animate-fade-in [animation-delay:calc(idx*100ms+1200ms)] gpu-accel">
                        <RoomCard {...room} available={available} />
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-32 bg-card rounded-[3rem] border border-border/40 luxury-shadow animate-fade-in [animation-delay:1200ms] group">
                <p className="text-2xl font-serif text-foreground/80 mb-4 italic group-hover:text-primary transition-colors duration-500">
                  No rooms match your specific criteria.
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] mb-10">
                  Try adjusting your filters for more results.
                </p>
                <div className="w-16 h-px bg-primary/30 mx-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
