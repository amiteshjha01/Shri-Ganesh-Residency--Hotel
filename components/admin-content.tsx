'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, Calendar, Users, SwitchCamera as Toggle, Save } from 'lucide-react'
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
  const [roomAvailability, setRoomAvailability] = useState<Record<string, boolean>>({
    deluxe: true,
    doubleDeluxe: true,
    room10: true,
    room16: true
  })

  const [prices, setPrices] = useState<Record<string, string>>({
    deluxe: String(ROOMS[0].price),
    doubleDeluxe: String(ROOMS[1].price),
    room10: String(ROOMS[2].price),
    room16: String(ROOMS[3].price)
  })

  const [saveStatus, setSaveStatus] = useState('')

  const handleAvailabilityToggle = (room: string) => {
    setRoomAvailability(prev => ({ ...prev, [room]: !prev[room] }))
  }

  const handlePriceChange = (room: string, value: string) => {
    setPrices(prev => ({ ...prev, [room]: value }))
  }

  const handleSave = () => {
    setSaveStatus('Changes saved successfully!')
    setTimeout(() => setSaveStatus(''), 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { icon: DollarSign, label: 'Weekly Revenue', value: '₹1,16,681', delay: '600ms' },
          { icon: Calendar, label: 'Bookings This Week', value: '34', delay: '700ms' },
          { icon: Users, label: 'Avg Occupancy', value: '82.5%', delay: '800ms' },
          { icon: TrendingUp, label: 'Growth Status', value: '+12.5%', delay: '900ms' }
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            className="group bg-card border border-border/50 rounded-[2.5rem] p-10 hover:border-primary/40 hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 animate-fade-in"
            style={{ animationDelay: kpi.delay }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em] mb-4">{kpi.label}</p>
                <p className="text-4xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{kpi.value}</p>
              </div>
              <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700">
                <kpi.icon className="w-8 h-8 stroke-[1.5]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Revenue Chart */}
        <div className="bg-card border border-border/50 rounded-[3rem] p-12 transition-all duration-700 hover:shadow-2xl hover:shadow-black/5 animate-fade-in [animation-delay:1000ms]">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Revenue Performance
          </h2>
          <div className="h-[350px] w-full">
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
        <div className="bg-card border border-border/50 rounded-[3rem] p-12 transition-all duration-700 hover:shadow-2xl hover:shadow-black/5 animate-fade-in [animation-delay:1100ms]">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Room Analytics
          </h2>
          <div className="h-[350px] w-full">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Availability Management */}
        <div className="bg-card border border-border/50 rounded-[3rem] p-12 animate-fade-in [animation-delay:1200ms]">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Status Oversight
          </h2>
          <div className="space-y-6">
            {Object.entries(roomAvailability).map(([room, available]) => (
              <div key={room} className="flex items-center justify-between p-6 bg-muted/20 border border-border/40 rounded-[2rem] hover:bg-white hover:border-primary/20 transition-all duration-500 group">
                <span className="text-lg font-serif font-bold text-foreground capitalize">
                  {room === 'deluxe' ? 'Deluxe Suite' : room === 'doubleDeluxe' ? 'Grand Double' : room === 'room10' ? 'Heritage 10' : 'Regal 16'}
                </span>
                <button
                  onClick={() => handleAvailabilityToggle(room)}
                  className={`px-8 h-12 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                    available
                      ? 'bg-primary/5 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white'
                      : 'bg-destructive/5 text-destructive border border-destructive/20 group-hover:bg-destructive group-hover:text-white'
                  }`}
                >
                  {available ? 'Available' : 'Booked'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Price Management */}
        <div className="bg-card border border-border/50 rounded-[3rem] p-12 animate-fade-in [animation-delay:1300ms]">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Financial Controls
          </h2>
          <div className="space-y-6 mb-12">
            {Object.entries(prices).map(([room, price]) => (
              <div key={room} className="flex items-center gap-6">
                <label className="w-40 text-sm font-bold text-foreground/40 uppercase tracking-[0.2em] capitalize shrink-0">
                  {room === 'deluxe' ? 'Deluxe' : room === 'doubleDeluxe' ? 'Double' : room === 'room10' ? 'Room 10' : 'Room 16'}
                </label>
                <div className="flex-1 flex items-center gap-6 bg-muted/20 border border-border/40 rounded-[1.5rem] px-6 h-16 group hover:border-primary/20 hover:bg-white transition-all duration-500">
                  <span className="text-primary font-bold">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => handlePriceChange(room, e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-xl font-serif font-bold text-foreground"
                  />
                  <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest shrink-0">/ NIGHT</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleSave} 
            className="w-full h-20 bg-primary hover:bg-black text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:shadow-black/20 active:scale-[0.98] transition-all duration-700 flex items-center justify-center gap-4"
          >
            <Save className="w-5 h-5 stroke-[2.5]" />
            Authorize Price Changes
          </button>
          {saveStatus && (
            <p className="mt-6 text-center text-xs font-bold text-primary uppercase tracking-[0.3em] animate-fade-in">{saveStatus}</p>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-card border border-border/50 rounded-[3rem] p-12 animate-fade-in [animation-delay:1400ms]">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Registry of Arrivals
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-6 px-8 text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Guest Identity</th>
                <th className="text-left py-6 px-8 text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Accommodation</th>
                <th className="text-left py-6 px-8 text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Arrival Date</th>
                <th className="text-left py-6 px-8 text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_BOOKINGS.map((booking) => (
                <tr key={booking.id} className="group border-b border-border/10 hover:bg-muted/30 transition-all duration-500">
                  <td className="py-8 px-8 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                        {booking.guest.charAt(0)}
                      </div>
                      <span className="font-serif font-bold text-lg text-foreground">{booking.guest}</span>
                  </td>
                  <td className="py-8 px-8 text-foreground/60 font-medium">{booking.room}</td>
                  <td className="py-8 px-8 text-foreground/40 text-sm font-medium">{booking.checkIn}</td>
                  <td className="py-8 px-8">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
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
