'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Image from 'next/image'
import { ROOMS } from '@/lib/constants'

interface GalleryItem {
  id: string
  title: string
  category: string
  image?: string
  video?: string
  type: 'image' | 'video'
  span?: string
}

const GALLERY_CATEGORIES = ['All', 'Rooms', 'Lobby', 'Interior', 'Exterior']

// Generate gallery items from rooms and existing categories
const ROOM_IMAGES: GalleryItem[] = ROOMS.flatMap((room) => {
  const items: GalleryItem[] = []

  // Add main images
  if (room.images) {
    room.images.forEach((img, idx) => {
      if (img) {
        items.push({
          id: `room-${room.id}-img-${idx}`,
          title: room.name,
          category: 'Rooms',
          image: img,
          type: 'image',
          span: idx % 4 === 0 ? 'md:col-span-2' : ''
        })
      }
    })
  }

  // Add video if exists
  if (room.video) {
    items.push({
      id: `room-${room.id}-vdo`,
      title: `${room.name} Virtual Tour`,
      category: 'Rooms',
      video: room.video,
      image: room.image, // use as poster
      type: 'video',
      span: 'md:col-span-2 md:row-span-1'
    })
  }

  return items
})

const OTHER_IMAGES: GalleryItem[] = [
  { id: 'lobby-1', title: 'Reception Area', category: 'Lobby', image: '/lobby.jpeg', type: 'image', span: 'md:col-span-2' },
  { id: 'int-1', title: 'Hotel Interior', category: 'Interior', image: '/interior.jpeg', type: 'image' },
  { id: 'ext-1', title: 'Hotel Exterior', category: 'Exterior', image: '/exterior.jpeg', type: 'image', span: 'md:row-span-2' },
]

const GALLERY_ITEMS = [...ROOM_IMAGES, ...OTHER_IMAGES].filter(item => item.image || item.video)

export default function GalleryContent() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory)

  const selectedItem = GALLERY_ITEMS.find(i => i.id === selectedImage)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      {/* Category Filter */}
      <div className="mb-24 flex flex-wrap gap-4 justify-center animate-fade-in [animation-delay:1000ms]">
        {GALLERY_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-10 h-14 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 border ${selectedCategory === category
              ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-110'
              : 'bg-transparent border-border/60 text-foreground/70 hover:border-primary/40 hover:text-primary hover:bg-primary/5'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Grid - Using dense flow to eliminate gaps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 grid-flow-dense">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item.id)}
            className={`group relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-700 animate-fade-in [animation-delay:calc(idx*50ms+200ms)] hover:shadow-2xl hover:shadow-black/10 ${item.span || ''}`}
          >
            <div className="aspect-square relative overflow-hidden group bg-muted/20">
              {item.type === 'video' ? (
                <>
                  <Image
                    src={item.image || ''}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-2" />
                    </div>
                  </div>
                </>
              ) : (
                <Image
                  src={item.image || ''}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-8 text-center backdrop-blur-[2px]">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">{item.category}</p>
                <p className="text-xl font-serif font-bold text-white leading-tight">{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-6 transition-all duration-500 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-10 right-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-500 active:scale-90 z-20"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative max-w-6xl w-full flex flex-col items-center gap-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content */}
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-4 w-full aspect-video flex flex-col items-center justify-center relative overflow-hidden group">
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.video}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={selectedItem.image || ''}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                />
              )}
              <div className="absolute bottom-10 left-10 text-white z-10 space-y-2 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">
                  {selectedItem.category}
                </p>
                <h3 className="text-3xl font-serif font-bold tracking-tight">
                  {selectedItem.title}
                </h3>
              </div>
            </div>

            {/* Lightbox Navigation */}
            <div className="flex gap-8">
              <button
                onClick={() => {
                  const currentIndex = filteredItems.findIndex(i => i.id === selectedImage)
                  if (currentIndex > 0) {
                    setSelectedImage(filteredItems[currentIndex - 1].id)
                  }
                }}
                disabled={filteredItems.findIndex(i => i.id === selectedImage) === 0}
                className="w-20 h-20 rounded-full border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed active:scale-90"
              >
                Prev
              </button>
              <button
                onClick={() => {
                  const currentIndex = filteredItems.findIndex(i => i.id === selectedImage)
                  if (currentIndex < filteredItems.length - 1) {
                    setSelectedImage(filteredItems[currentIndex + 1].id)
                  }
                }}
                disabled={filteredItems.findIndex(i => i.id === selectedImage) === filteredItems.length - 1}
                className="w-20 h-20 rounded-full border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed active:scale-90"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
