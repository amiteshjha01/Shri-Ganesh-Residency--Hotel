import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { HOTEL_INFO } from '@/lib/constants'

export default function LocationSection() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in group text-center">
          <div className="inline-block py-2 px-6 bg-primary/5 border border-primary/20 rounded-full mb-10 transition-transform group-hover:scale-105 duration-500 gpu-accel">
            <span className="text-[10px] font-bold text-primary tracking-[0.4em] uppercase">Prime Location</span>
          </div>
          <h2 className="text-4xl md:text-8xl font-serif font-bold text-foreground mb-12 italic leading-tight">
            Visit Us <br /><span className="text-primary">Today</span>
          </h2>
          <div className="w-24 h-1 bg-primary/30 mb-20 rounded-full mx-auto" />
          
          <div className="grid gap-10 sm:grid-cols-2">
            {[
              { 
                icon: <MapPin className="w-6 h-6" />, 
                title: "Location", 
                content: "Tirupati, Andhra Pradesh",
                link: HOTEL_INFO.location,
                linkLabel: "View on Maps"
              },
              { 
                icon: <Phone className="w-6 h-6" />, 
                title: "Contact", 
                content: HOTEL_INFO.phone,
                link: `tel:${HOTEL_INFO.phone}`,
                linkLabel: "Call Us"
              },
              { 
                icon: <Mail className="w-6 h-6" />, 
                title: "Inquiries", 
                content: HOTEL_INFO.email,
                link: `mailto:${HOTEL_INFO.email}`,
                linkLabel: "Send Email"
              },
              { 
                icon: <Clock className="w-6 h-6" />, 
                title: "Always Open", 
                content: "24/7 Concierge",
                link: null,
                linkLabel: "Round-the-clock service"
              }
            ].map((item, i) => (
              <div key={i} className="group p-10 premium-card luxury-shadow hover:luxury-shadow-hover transition-all duration-700 gpu-accel hover:-translate-y-2 text-left">
                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center text-primary mb-8 transition-all duration-700 group-hover:bg-primary group-hover:text-white gpu-accel border border-primary/10">
                  {item.icon}
                </div>
                <h3 className="text-[10px] font-bold text-foreground/70 uppercase tracking-[0.3em] mb-3">{item.title}</h3>
                <p className="text-xl font-serif font-bold text-foreground mb-6 leading-tight italic">{item.content}</p>
                {item.link ? (
                  <a href={item.link} target={item.link.startsWith('http') ? "_blank" : undefined} rel={item.link.startsWith('http') ? "noopener noreferrer" : undefined} className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] hover:text-black transition-colors duration-300">
                    {item.linkLabel}
                  </a>
                ) : (
                  <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-[0.4em]">{item.linkLabel}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
