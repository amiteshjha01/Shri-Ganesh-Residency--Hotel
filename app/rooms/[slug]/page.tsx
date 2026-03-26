import LayoutWrapper from '../../layout-wrapper'
import { ROOMS } from '@/lib/constants'
import { constructMetadata } from '@/lib/seo/metadata'
import Breadcrumbs from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { Users, Wind, Shield, Coffee, Tv, Info, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const room = ROOMS.find((r) => r.slug === slug)
  
  return constructMetadata({
    title: room?.name || 'Room Details',
    description: room?.description || 'Details about our luxury room options.',
  })
}

export async function generateStaticParams() {
  return ROOMS.map((room) => ({
    slug: room.slug,
  }))
}

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const room = ROOMS.find((r) => r.slug === slug)
  
  if (!room) notFound()

  return (
    <LayoutWrapper>
      <main className="min-h-screen bg-background">
        {/* Header/Hero */}
        <div className="relative h-[65vh] overflow-hidden">
          <Image 
            src={room.image} 
            alt={room.name}
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1.5px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="mb-10 animate-fade-in [animation-delay:200ms]">
              <div className="px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                <Breadcrumbs items={[{ label: 'Our Rooms', href: '/rooms' }, { label: room.name }]} variant="dark" />
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-2xl animate-fade-in [animation-delay:400ms] leading-none italic">
              {room.name}
            </h1>
            <div className="w-48 h-1 bg-primary/60 mx-auto mb-8 rounded-full animate-fade-in [animation-delay:500ms]" />
            <p className="text-xl md:text-3xl text-white max-w-4xl font-light italic animate-fade-in [animation-delay:600ms] leading-relaxed tracking-wide drop-shadow-lg">
              {room.description}
            </p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            {/* Left Column: Room Details */}
            <div className="lg:col-span-2 space-y-24">
              <section className="animate-fade-in [animation-delay:800ms]">
                <div className="flex items-center gap-4 mb-10 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-12">
                    <Info className="w-6 h-6" />
                  </div>
                  <h2 className="text-4xl font-serif font-bold text-foreground">Room Sanctuary</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-2xl text-foreground font-light leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:mt-2">
                    {room.description}
                  </p>
                  <p className="text-lg text-foreground/80 leading-relaxed font-light">
                    Our {room.name} is meticulously crafted to offer an unparalleled retreat. From the curated artwork to the hand-selected linens, every detail has been chosen to provide an atmosphere of refined elegance and profound peace.
                  </p>
                </div>
              </section>

              {/* Video Showcase */}
              {room.video && (
                <section className="animate-fade-in [animation-delay:850ms]">
                  <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-10">Cinematic Experience</h3>
                  <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-border/40 bg-black group luxury-shadow">
                    <video 
                      src={room.video} 
                      controls 
                      className="w-full h-full object-cover"
                      poster={room.image}
                    />
                    <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[3rem]" />
                  </div>
                </section>
              )}

              {/* Real Room Showcase */}
              {room.images && room.images.length > 1 && (
                <section className="animate-fade-in [animation-delay:900ms]">
                  <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-10">Authentic Visuals</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {room.images.slice(1).map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-[2rem] overflow-hidden border border-border/40 group">
                        <Image
                          src={img}
                          alt={`${room.name} view ${idx + 2}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="animate-fade-in [animation-delay:1000ms]">
                <div className="flex items-center gap-4 mb-10 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:-rotate-12">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-4xl font-serif font-bold text-foreground">Premium Offerings</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-8 bg-card border border-border/40 rounded-[2rem] hover:border-primary/40 transition-all duration-500 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-foreground uppercase tracking-widest leading-tight">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Booking Card */}
            <div className="lg:col-span-1 animate-fade-in [animation-delay:1200ms]">
              <div className="bg-card border border-border/50 rounded-[3rem] p-12 sticky top-32 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.15)] group">
                <div className="mb-10 pb-10 border-b border-border/50 text-center">
                  <p className="text-[10px] font-bold text-foreground/70 uppercase tracking-[0.3em] mb-4">Investment per Night</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-6xl font-serif font-bold text-primary group-hover:scale-105 transition-transform duration-700 block">₹{room.price}</span>
                    <span className="text-sm font-light text-foreground/70 uppercase tracking-widest self-end pb-3">INR</span>
                  </div>
                </div>

                <div className="space-y-8 mb-12">
                  {[
                    { icon: <Users className="w-5 h-5" />, label: "Capacity", value: `${room.guests} Guests` },
                    { icon: <Tv className="w-5 h-5" />, label: "Entertainment", value: "Smart HD TV" },
                    { icon: <Wind className="w-5 h-5" />, label: "Climate Control", value: "Manual AC" },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-foreground/80">
                        {spec.icon}
                        <span className="text-xs font-bold uppercase tracking-widest">{spec.label}</span>
                      </div>
                      <span className="text-sm font-serif font-bold text-foreground tracking-tight">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <Button asChild className="w-full luxury-button bg-primary hover:bg-primary/90 text-white h-20 shadow-2xl shadow-primary/30 rounded-[1.5rem] transition-all duration-500 active:scale-95 group">
                  <Link href={`/booking?roomId=${room.id}`} className="flex items-center justify-center gap-3">
                    <span className="text-lg">Reserve Sanctum</span>
                    <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-2" />
                  </Link>
                </Button>
                
                <p className="text-center text-foreground/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-8">
                  Commitment-free reservation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LayoutWrapper>
  )
}
