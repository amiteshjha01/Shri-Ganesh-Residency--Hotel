'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState({ hour: '12', minute: '00', period: 'PM' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateTime: '',
    guests: ''
  })

  // Update dateTime in formData when date or time changes
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'do MMM yyyy')
      const formattedTime = `${time.hour}:${time.minute} ${time.period}`
      setFormData(prev => ({ ...prev, dateTime: `${formattedDate}, ${formattedTime}` }))
    }
  }, [date, time])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
      alert('Please select a check-in date and time.')
      return
    }
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      // Formspree submission
      const response = await fetch('https://formspree.io/f/xaqlqgnq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSuccess(true)
        
        // WhatsApp redirection
        const message = `Name : ${formData.name}\nDate of check in & time: ${formData.dateTime}\nPhone number: ${formData.phone}\nNo. Of people : ${formData.guests}`
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/919171899992?text=${encodedMessage}`
        
        // smooth UX: wait briefly for success animation then redirect
        setTimeout(() => {
          window.location.href = whatsappUrl
        }, 1500)
      } else {
        alert('Something went wrong. Please try again or contact us directly.')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form. Please check your connection.')
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-primary/5 rounded-[2rem] border border-primary/20 animate-fade-in gpu-accel min-h-[400px]">
        <CheckCircle2 className="w-16 h-16 text-primary mb-6 animate-bounce" />
        <h3 className="text-2xl font-serif font-bold text-foreground mb-4 text-center">Inquiry Received!</h3>
        <p className="text-lg text-foreground/60 text-center mb-8">
          Your inquiry has been sent to our email. Redirecting you to WhatsApp to complete your booking...
        </p>
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in gpu-accel">
      <div className="space-y-3">
        <label className="text-[9px] font-bold text-foreground/80 uppercase tracking-[0.3em] ml-2">Full Identity</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 rounded-2xl border border-border/60 bg-background focus:ring-4 focus:ring-primary/5 transition-[border-color,background-color] duration-300 outline-none text-foreground font-bold placeholder:text-foreground/70"
          placeholder="E.g. Ashish Singh"
        />
      </div>

      <div className="space-y-3">
        <label className="text-[9px] font-bold text-foreground/80 uppercase tracking-[0.3em] ml-2">Digital Contact (Email)</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 rounded-2xl border border-border/60 bg-background focus:ring-4 focus:ring-primary/5 transition-[border-color,background-color] duration-300 outline-none text-foreground font-bold placeholder:text-foreground/70"
          placeholder="E.g. ashish@residency.com"
        />
      </div>

      <div className="space-y-3">
        <label className="text-[9px] font-bold text-foreground/80 uppercase tracking-[0.3em] ml-2">Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 rounded-2xl border border-border/60 bg-background focus:ring-4 focus:ring-primary/5 transition-[border-color,background-color] duration-300 outline-none text-foreground font-bold placeholder:text-foreground/70"
          placeholder="E.g. +91 98765 43210"
        />
      </div>

      <div className="space-y-3">
        <label className="text-[9px] font-bold text-foreground/80 uppercase tracking-[0.3em] ml-2">Number of Guests</label>
        <input
          type="number"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          required
          min="1"
          className="w-full px-6 py-4 rounded-2xl border border-border/60 bg-background focus:ring-4 focus:ring-primary/5 transition-[border-color,background-color] duration-300 outline-none text-foreground font-bold placeholder:text-foreground/70"
          placeholder="E.g. 2"
        />
      </div>

      <div className="md:col-span-2 space-y-3">
        <label className="text-[9px] font-bold text-foreground/80 uppercase tracking-[0.3em] ml-2">Check-in Date & Time</label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full px-6 py-4 rounded-2xl border border-border/60 bg-background text-left font-bold transition-[border-color,background-color] duration-300 outline-none flex items-center gap-3",
                !date && "text-foreground/70"
              )}
            >
              <CalendarIcon className="w-4 h-4 text-primary" />
              {date ? (
                <span>{formData.dateTime}</span>
              ) : (
                <span>Select Date & Time</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-3xl border-border/30 shadow-2xl bg-card overflow-hidden" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="p-4"
            />
            <div className="p-6 border-t border-border/30 bg-muted/20 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/60">Time Selection</span>
              </div>
              <div className="flex gap-2">
                <Select value={time.hour} onValueChange={(v) => setTime(t => ({ ...t, hour: v }))}>
                  <SelectTrigger className="w-18 h-10 rounded-xl border border-border/40 bg-background text-[10px] font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/40 max-h-48 rounded-xl shadow-xl">
                    {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                      <SelectItem key={h} value={h} className="text-[10px] font-bold">{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={time.minute} onValueChange={(v) => setTime(t => ({ ...t, minute: v }))}>
                  <SelectTrigger className="w-18 h-10 rounded-xl border border-border/40 bg-background text-[10px] font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/40 max-h-48 rounded-xl shadow-xl">
                    {['00', '15', '30', '45'].map(m => (
                      <SelectItem key={m} value={m} className="text-[10px] font-bold">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={time.period} onValueChange={(v) => setTime(t => ({ ...t, period: v }))}>
                  <SelectTrigger className="w-18 h-10 rounded-xl border border-border/40 bg-background text-[10px] font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/40 rounded-xl shadow-xl">
                    <SelectItem value="AM" className="text-[10px] font-bold">AM</SelectItem>
                    <SelectItem value="PM" className="text-[10px] font-bold">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="md:col-span-2 pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="luxury-button w-full h-16 bg-primary hover:bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-none gpu-accel flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Processing Inquiry...
            </>
          ) : (
            'Submit Formal Inquiry'
          )}
        </Button>
      </div>
    </form>
  )
}
