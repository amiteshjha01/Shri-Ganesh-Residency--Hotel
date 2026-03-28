'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, Calendar, Users, Save, Box } from 'lucide-react'
import { ROOMS } from '@/lib/constants'

// Sample data for charts
const REVENUE_DATA = [
  { date: 'Mon', revenue: 2400, bookings: 4 },
  { date: 'Tue', revenue: 3210, bookings: 5 },
  { date: 'Wed', revenue: 2290, bookings: 3 },
  { date: 'Thu', revenue: 2000, bookings: 4 },
  { date: 'Fri', revenue: 2181, bookings: 6 },
  { date: 'Sat', revenue: 2500, bookings: 7 },
  { date: 'Sun', revenue: 2100, bookings: 5 },
]

const ROOM_OCCUPANCY = [
  { room: ROOMS[0].name, occupancy: 85 },
  { room: ROOMS[1].name, occupancy: 90 },
  { room: ROOMS[2].name, occupancy: 60 },
  { room: ROOMS[3].name, occupancy: 75 },
]

const RECENT_BOOKINGS = [
  { id: 1, guest: 'Rajesh Kumar', room: ROOMS[0].name, checkIn: '2024-03-25', status: 'Confirmed' },
  { id: 2, guest: 'Priya Singh', room: ROOMS[1].name, checkIn: '2024-03-26', status: 'Confirmed' },
  { id: 3, guest: 'Amit Patel', room: ROOMS[2].name, checkIn: '2024-03-27', status: 'Pending' },
  { id: 4, guest: 'Neha Sharma', room: ROOMS[3].name, checkIn: '2024-03-28', status: 'Confirmed' },
]

export default function AdminContent() {
  const [roomAvailability, setRoomAvailability] = useState<Record<string, number>>({
    deluxe: ROOMS[0].available || 3,
    doubleDeluxe: ROOMS[1].available || 3,
    room10: ROOMS[2].available || 1,
    room16: ROOMS[3].available || 1
  })

  const [prices, setPrices] = useState<Record<string, string>>({
    deluxe: String(ROOMS[0].price),
    doubleDeluxe: String(ROOMS[1].price),
    room10: String(ROOMS[2].price),
    room16: String(ROOMS[3].price)
  })

  const [saveStatus, setSaveStatus] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const savedAvailability = localStorage.getItem('sgr_room_availability')
    if (savedAvailability) {
      try {
        setRoomAvailability(JSON.parse(savedAvailability))
      } catch (e) {
        console.error('Failed to load availability from localStorage')
      }
    }

    const savedPrices = localStorage.getItem('sgr_room_prices')
    if (savedPrices) {
      try {
        setPrices(JSON.parse(savedPrices))
      } catch (e) {
        console.error('Failed to load prices from localStorage')
      }
    }
  }, [])

  const handleAvailabilityChange = (room: string, value: string) => {
    const numValue = parseInt(value)
    if (isNaN(numValue)) return

    // Get total from ROOMS constant
    const roomRef = ROOMS.find(r => 
      (room === 'deluxe' && r.id === 1) ||
      (room === 'doubleDeluxe' && r.id === 2) ||
      (room === 'room10' && r.id === 3) ||
      (room === 'room16' && r.id === 4)
    )
    
    const total = roomRef?.total || 1

    if (numValue >= 0 && numValue <= total) {
      setRoomAvailability(prev => ({ ...prev, [room]: numValue }))
    }
  }

  const handlePriceChange = (room: string, value: string) => {
    setPrices(prev => ({ ...prev, [room]: value }))
  }

  const handleSave = () => {
    localStorage.setItem('sgr_room_availability', JSON.stringify(roomAvailability))
    localStorage.setItem('sgr_room_prices', JSON.stringify(prices))
    
    // Dispatch custom event to notify other components (like RoomsContent)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('roomAvailabilityChanged', { detail: roomAvailability }))
    }

    setSaveStatus('System updated successfully!')
    setTimeout(() => setSaveStatus(''), 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-12 sm:space-y-20">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {[
          { icon: DollarSign, label: 'Weekly Revenue', value: '₹1,16,681', delay: '600ms' },
          { icon: Calendar, label: 'Bookings This Week', value: '34', delay: '700ms' },
          { icon: Users, label: 'Avg Occupancy', value: '82.5%', delay: '800ms' },
          { icon: TrendingUp, label: 'Growth Status', value: '+12.5%', delay: '900ms' }
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            className="group bg-card border border-border/50 rounded-[2rem] p-6 lg:p-10 hover:border-primary/40 hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 animate-fade-in"
            style={{ animationDelay: kpi.delay }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em] mb-4">{kpi.label}</p>
                <p className="text-2xl lg:text-4xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{kpi.value}</p>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-muted/50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700">
                <kpi.icon className="w-6 h-6 lg:w-8 lg:h-8 stroke-[1.5]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Revenue Chart */}
        <div className="bg-card border border-border/50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 transition-all duration-700 hover:shadow-2xl hover:shadow-black/5 animate-fade-in [animation-delay:1000ms]">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-8 sm:mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Revenue Performance
          </h2>
          <div className="h-[250px] sm:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" stroke="rgba(0,0,0,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(0,0,0,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid rgba(0,0,0,0.1)`,
                    borderRadius: '20px',
                    padding: '16px'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 10, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Chart */}
        <div className="bg-card border border-border/50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 transition-all duration-700 hover:shadow-2xl hover:shadow-black/5 animate-fade-in [animation-delay:1100ms]">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-8 sm:mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Room Analytics
          </h2>
          <div className="h-[250px] sm:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ROOM_OCCUPANCY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="room" stroke="rgba(0,0,0,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(0,0,0,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid rgba(0,0,0,0.1)`,
                    borderRadius: '20px',
                    padding: '16px'
                  }}
                />
                <Bar dataKey="occupancy" fill="var(--primary)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Room Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Availability Management */}
        <div className="bg-card border border-border/50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 animate-fade-in [animation-delay:1200ms]">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-8 sm:mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Inventory Control
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(roomAvailability).map(([room, available]) => {
              const roomRef = ROOMS.find(r => 
                (room === 'deluxe' && r.id === 1) ||
                (room === 'doubleDeluxe' && r.id === 2) ||
                (room === 'room10' && r.id === 3) ||
                (room === 'room16' && r.id === 4)
              )
              const total = roomRef?.total || 1
              
              return (
                <div key={room} className="flex flex-col gap-4 p-5 sm:p-8 bg-muted/20 border border-border/40 rounded-[2rem] sm:rounded-[2.5rem] hover:bg-white hover:border-primary/20 transition-all duration-500 group">
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-serif font-bold text-foreground">
                      {room === 'deluxe' ? 'Deluxe' : room === 'doubleDeluxe' ? 'Double Deluxe' : room === 'room10' ? 'Room for 10' : 'Room for 16'}
                    </span>
                    <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">Total: {total}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex-1 flex items-center justify-between bg-background rounded-2xl border border-border/40 px-4 sm:px-6 h-12 sm:h-14 group-hover:border-primary/20 transition-colors">
                      <span className="text-[8px] sm:text-[9px] font-bold text-foreground/40 uppercase tracking-widest">Available</span>
                      <input
                        type="number"
                        min="0"
                        max={total}
                        value={available}
                        onChange={(e) => handleAvailabilityChange(room, e.target.value)}
                        className="bg-transparent border-none outline-none text-right w-12 sm:w-16 text-lg sm:text-xl font-serif font-bold text-primary"
                      />
                    </div>
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center border transition-all duration-500 ${
                      available === 0 
                        ? 'bg-destructive/10 border-destructive/20 text-destructive' 
                        : 'bg-primary/10 border-primary/20 text-primary'
                    }`}>
                      <span className="text-lg sm:text-xl font-serif font-bold leading-none">{available}</span>
                      <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-tighter mt-0.5">Live</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Price Management */}
        <div className="bg-card border border-border/50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 animate-fade-in [animation-delay:1300ms]">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-8 sm:mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Financial Controls
          </h2>
          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            {Object.entries(prices).map(([room, price]) => (
              <div key={room} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <label className="sm:w-32 text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] shrink-0">
                  {room === 'deluxe' ? 'Deluxe' : room === 'doubleDeluxe' ? 'Double' : room === 'room10' ? 'Room 10' : 'Room 16'}
                </label>
                <div className="flex-1 flex items-center gap-4 bg-muted/20 border border-border/40 rounded-2xl px-5 h-14 group hover:border-primary/20 hover:bg-white transition-all duration-500">
                  <span className="text-primary font-bold">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => handlePriceChange(room, e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-lg sm:text-xl font-serif font-bold text-foreground"
                  />
                  <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest shrink-0">/ NIGHT</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleSave} 
            className="w-full h-16 sm:h-20 bg-primary hover:bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:shadow-black/20 active:scale-[0.98] transition-all duration-700 flex items-center justify-center gap-4 mt-auto"
          >
            <Save className="w-5 h-5 stroke-[2.5]" />
            Authorize Core Updates
          </button>
          {saveStatus && (
            <p className="mt-6 text-center text-[10px] font-bold text-primary uppercase tracking-[0.3em] animate-fade-in">{saveStatus}</p>
          )}
        </div>
      </div>

      {/* Registry of Arrivals */}
      <div className="bg-card border border-border/50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 animate-fade-in [animation-delay:1400ms]">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-8 sm:mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Registry of Arrivals
        </h2>
        <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-[9px] sm:text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Guest Identity</th>
                <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-[9px] sm:text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Accommodation</th>
                <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-[9px] sm:text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Arrival Date</th>
                <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-[9px] sm:text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_BOOKINGS.map((booking) => (
                <tr key={booking.id} className="group border-b border-border/10 hover:bg-muted/30 transition-all duration-500">
                  <td className="py-6 sm:py-8 px-4 sm:px-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold transition-all duration-500 group-hover:bg-primary group-hover:text-white shrink-0">
                        {booking.guest.charAt(0)}
                      </div>
                      <span className="font-serif font-bold text-base sm:text-lg text-foreground whitespace-nowrap">{booking.guest}</span>
                    </div>
                  </td>
                  <td className="py-6 sm:py-8 px-4 sm:px-8">
                    <span className="text-foreground/60 font-medium whitespace-nowrap">{booking.room}</span>
                  </td>
                  <td className="py-6 sm:py-8 px-4 sm:px-8">
                    <span className="text-foreground/40 text-xs sm:text-sm font-medium whitespace-nowrap">{booking.checkIn}</span>
                  </td>
                  <td className="py-6 sm:py-8 px-4 sm:px-8">
                    <span className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                      booking.status === 'Confirmed'
                        ? 'bg-primary/5 text-primary border border-primary/20'
                        : 'bg-accent/10 text-accent-foreground border border-accent/20'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
