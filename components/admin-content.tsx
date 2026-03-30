'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, Calendar, Users, Save, Search, PlusCircle, LogOut, Key, User as UserIcon, Download, Power, Clock } from 'lucide-react'
import { ROOMS } from '@/lib/constants'

export default function AdminContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [stats, setStats] = useState<any>({ totalRevenue: 0, totalBookings: 0 })
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [roomData, setRoomData] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' })
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' })

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    startDate: '',
    endDate: ''
  })

  const [dbRooms, setDbRooms] = useState<any[]>([])
  const [isExporting, setIsExporting] = useState(false)

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
  const [saving, setSaving] = useState(false)

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/analytics')
      if (res.ok) {
        const data = await res.json()
        setRevenueData(data.revenueData)
        setRoomData(data.roomData)
        setStats(data.stats)
      } else if (res.status === 401) {
        setIsLoggedIn(false)
      }
    } catch (err) {
      console.error('Failed to fetch analytics', err)
    }
  }, [])

  const fetchBookings = useCallback(async () => {
    try {
      const query = new URLSearchParams(filters as any).toString()
      const res = await fetch(`/api/admin/bookings?${query}`)
      if (res.ok) {
        const data = await res.json()
        setBookings(data.bookings)
      }
    } catch (err) {
      console.error('Failed to fetch bookings', err)
    }
  }, [filters])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/all')
      if (res.ok) {
        const data = await res.json()
        setAllUsers(data.users)
      }
    } catch (err) {
      console.error('Failed to fetch users', err)
    }
  }, [])

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch('/api/rooms')
      if (res.ok) {
        const data = await res.json()
        setDbRooms(data.rooms)
        
        const newAvail: Record<string, number> = {}
        data.rooms.forEach((r: any) => {
          const key = r.roomId === '1' ? 'deluxe' : 
                      r.roomId === '2' ? 'doubleDeluxe' : 
                      r.roomId === '3' ? 'room10' : 
                      r.roomId === '4' ? 'room16' : null
          if (key) newAvail[key] = r.availableRooms
        })
        if (Object.keys(newAvail).length > 0) setRoomAvailability(prev => ({...prev, ...newAvail}))
      }
    } catch (err) {
      console.error('Failed to fetch rooms', err)
    }
  }, [])

  const checkAuth = useCallback(async () => {
    const res = await fetch('/api/admin/me')
    if (res.ok) {
      const data = await res.json()
      setCurrentUser(data.user)
      setIsLoggedIn(true)
      fetchAnalytics()
      fetchBookings()
      fetchUsers()
      fetchRooms()
    }
  }, [fetchAnalytics, fetchBookings, fetchUsers, fetchRooms])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
      if (res.ok) {
        await checkAuth()
      } else {
        const data = await res.json()
        const errorMessage = data.error ? `${data.message}: ${data.error}` : (data.message || 'Login failed')
        setError(errorMessage)
      }
    } catch (err) {
      setError('Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordStatus({ type: '', message: '' })
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData)
      })
      const data = await res.json()
      if (res.ok) {
        setPasswordStatus({ type: 'success', message: 'Password updated successfully' })
        setPasswordData({ oldPassword: '', newPassword: '' })
        setTimeout(() => {
          setShowPasswordChange(false)
          setPasswordStatus({ type: '', message: '' })
        }, 2000)
      } else {
        setPasswordStatus({ type: 'error', message: data.message || 'Update failed' })
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', message: 'Connection error' })
    }
  }

  const handleAddAddon = async (bookingId: string) => {
    const name = prompt('Enter addon name (e.g. Extra Bed):')
    const price = prompt('Enter price:')
    if (!name || !price) return

    try {
      const res = await fetch(`/api/bookings/${bookingId}/add-addon`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: Number(price) })
      })
      if (res.ok) {
        fetchBookings()
        fetchAnalytics()
      }
    } catch (err) {
      alert('Failed to add addon')
    }
  }

  const handleExport = async () => {
     setIsExporting(true)
     try {
       const query = new URLSearchParams(filters as any).toString()
       const res = await fetch(`/api/admin/bookings/export?${query}`)
       if (res.ok) {
         const blob = await res.blob()
         const url = window.URL.createObjectURL(blob)
         const a = document.createElement('a')
         a.href = url
         a.download = `sgr_registry_export_${new Date().toISOString().split('T')[0]}.csv`
         document.body.appendChild(a)
         a.click()
         a.remove()
       }
     } catch (err) {
       alert('Export failed')
     } finally {
       setIsExporting(false)
     }
  }

  const handleSaveInventory = async () => {
     setSaving(true)
     try {
       for (const [key, availableRooms] of Object.entries(roomAvailability)) {
         const roomRef = ROOMS.find(r => 
           (key === 'deluxe' && r.id === 1) ||
           (key === 'doubleDeluxe' && r.id === 2) ||
           (key === 'room10' && r.id === 3) ||
           (key === 'room16' && r.id === 4)
         )
         if (roomRef) {
           await fetch('/api/rooms', {
             method: 'PATCH',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ 
               roomId: roomRef.id.toString(), 
               availableRooms,
               totalRooms: roomRef.total || 5 
             })
           })
         }
       }
       setSaveStatus('Inventory successfully committed to database.')
       setTimeout(() => setSaveStatus(''), 3000)
       fetchRooms()
     } catch (err) {
       alert('Transaction failure')
     } finally {
       setSaving(false)
     }
  }

  const handleToggleRoom = async (roomId: string, current: boolean) => {
     try {
       const res = await fetch(`/api/rooms/${roomId}/toggle-availability`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ isAvailable: !current })
       })
       if (res.ok) fetchRooms()
     } catch (err) {
       alert('Toggle failed')
     }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    window.location.reload()
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 animate-fade-in">
        <div className="bg-card border border-border/50 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16" />
          <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center relative z-10">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest ml-2">Electronic Mail</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-6 py-4 rounded-xl border border-border/60 bg-muted/30 focus:bg-background outline-none transition-all placeholder:text-foreground/20 text-sm"
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest ml-2">Security Key</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-6 py-4 rounded-xl border border-border/60 bg-muted/30 focus:bg-background outline-none transition-all placeholder:text-foreground/20 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-destructive text-[10px] font-bold uppercase tracking-widest text-center animate-shake">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-black active:scale-95 transition-all"
            >
              {isLoading ? 'Verifying...' : 'Authenticate'}
            </button>
          </form>
          <p className="mt-8 text-center text-[9px] text-foreground/30 uppercase tracking-[0.15em] leading-relaxed">
            Sri Ganesh Residency Management Terminal. <br /> Unauthorized access is strictly prohibited.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-12 sm:space-y-20">
      
      {/* Header Profile Section (Hidden 'super_admin' role text) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border/50 rounded-[2rem] p-8 sm:p-12 animate-fade-in">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group transition-all duration-700 hover:bg-primary hover:text-white">
                <UserIcon className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div>
               <h3 className="text-2xl font-serif font-bold text-foreground">{currentUser?.email}</h3>
               <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em] mt-1">
                 {currentUser?.role === 'super_admin' ? 'Strategic Oversight' : 'Operations Management'}
               </p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <Button 
               onClick={() => setShowPasswordChange(!showPasswordChange)}
               className="h-12 px-6 rounded-xl bg-muted text-foreground/60 hover:bg-black hover:text-white transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
            >
               <Key className="w-4 h-4 mr-2" /> Security Settings
            </Button>
            <button 
               onClick={handleLogout}
               className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all group"
            >
                <LogOut className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </button>
         </div>
      </div>

      {/* Password Change Overlay/Section */}
      {showPasswordChange && (
        <div className="bg-card border border-primary/20 rounded-[2rem] p-8 sm:p-12 animate-fade-in shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
           <h3 className="text-xl font-serif font-bold text-foreground mb-8">Change Management Password</h3>
           <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                  <label className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest ml-2">Legacy Password</label>
                  <input 
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                    className="w-full px-6 py-4 rounded-xl border border-border/60 bg-muted/30 focus:bg-background outline-none text-sm transition-all"
                    placeholder="Enter current"
                    required
                  />
              </div>
              <div className="space-y-2">
                  <label className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest ml-2">New Security Key</label>
                  <input 
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-6 py-4 rounded-xl border border-border/60 bg-muted/30 focus:bg-background outline-none text-sm transition-all"
                    placeholder="Enter new"
                    required
                  />
              </div>
              <Button type="submit" className="h-14 rounded-xl bg-primary text-white hover:bg-black transition-all text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/20">
                Authorize Update
              </Button>
           </form>
           {passwordStatus.message && (
             <p className={`mt-6 text-[10px] font-bold uppercase tracking-widest animate-fade-in ${passwordStatus.type === 'success' ? 'text-primary' : 'text-destructive'}`}>
               {passwordStatus.message}
             </p>
           )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {[
          { icon: DollarSign, label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString()}`, delay: '0ms' },
          { icon: Calendar, label: 'Total Bookings', value: String(stats.totalBookings), delay: '100ms' },
          { icon: Users, label: 'Active Directory', value: String(allUsers.length), delay: '200ms' },
          { icon: TrendingUp, label: 'System Status', value: 'Active', delay: '300ms' }
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            className="group bg-card border border-border/50 rounded-[2rem] p-6 lg:p-10 hover:border-primary/40 hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 animate-fade-in"
            style={{ animationDelay: kpi.delay }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-[0.3em] mb-4">{kpi.label}</p>
                <p className="text-2xl lg:text-3xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{kpi.value}</p>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-muted/50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700">
                <kpi.icon className="w-6 h-6 lg:w-8 lg:h-8 stroke-[1.5]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registry Filters */}
      <div className="bg-card border border-border/50 rounded-[2rem] p-8 sm:p-12 animate-fade-in [animation-delay:400ms]">
         <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
               <Search className="w-6 h-6 text-primary" />
               <h2 className="text-xl font-serif font-bold text-foreground">Registry Filters</h2>
            </div>
            <Button onClick={() => setFilters({name:'', email:'', phone:'', checkIn:'', startDate:'', endDate:''})} className="h-10 px-6 rounded-xl bg-muted text-foreground/70 hover:bg-black hover:text-white transition-all text-[10px] font-bold uppercase tracking-[0.2em] border-none shadow-none">
               Clear All
            </Button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
                <label className="text-[9px] font-bold text-foreground/70 uppercase tracking-widest ml-2">Guest Identity</label>
                <input 
                  type="text" 
                  placeholder="Name or Phone"
                  value={filters.name}
                  onChange={(e) => setFilters({...filters, name: e.target.value})}
                  className="w-full px-6 py-4 rounded-xl border border-border/60 bg-muted/30 focus:bg-background outline-none text-sm transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-bold text-foreground/70 uppercase tracking-widest ml-2">Electronic Mail</label>
                <input 
                  type="text" 
                  placeholder="Email address"
                  value={filters.email}
                  onChange={(e) => setFilters({...filters, email: e.target.value})}
                  className="w-full px-6 py-4 rounded-xl border border-border/60 bg-muted/30 focus:bg-background outline-none text-sm transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-bold text-foreground/70 uppercase tracking-widest ml-2">Cycle Start</label>
                <input 
                  type="date" 
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  className="w-full px-6 py-4 rounded-xl border border-border/60 bg-muted/30 focus:bg-background outline-none text-sm transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-bold text-foreground/70 uppercase tracking-widest ml-2">Cycle End</label>
                <input 
                  type="date" 
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  className="w-full px-6 py-4 rounded-xl border border-border/60 bg-muted/30 focus:bg-background outline-none text-sm transition-all"
                />
            </div>
         </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bookings Performance (Line) */}
        <div className="bg-card border border-border/50 rounded-[2rem] p-8 transition-all hover:shadow-2xl hover:shadow-black/5 animate-fade-in [animation-delay:500ms]">
          <h2 className="text-lg font-serif font-bold text-foreground mb-8 flex items-center gap-3">
             <Calendar className="w-5 h-5 text-primary" /> Bookings Cycle
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="date" 
                  fontSize={10} 
                  tickFormatter={(str) => {
                    const date = new Date(str);
                    return isNaN(date.getTime()) ? str : date.toLocaleDateString('en-US', { weekday: 'short' });
                  }}
                />
                <YAxis fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Analytics (Bar) */}
        <div className="bg-card border border-border/50 rounded-[2rem] p-8 transition-all hover:shadow-2xl hover:shadow-black/5 animate-fade-in [animation-delay:600ms]">
          <h2 className="text-lg font-serif font-bold text-foreground mb-8 flex items-center gap-3">
             <DollarSign className="w-5 h-5 text-primary" /> Revenue Logic
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Spread (Pie) */}
        <div className="bg-card border border-border/50 rounded-[2rem] p-8 transition-all hover:shadow-2xl hover:shadow-black/5 animate-fade-in [animation-delay:700ms]">
          <h2 className="text-lg font-serif font-bold text-foreground mb-8 flex items-center gap-3">
             <Users className="w-5 h-5 text-primary" /> Room Spectrum
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="occupancy"
                  nameKey="room"
                >
                  {roomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Registry of Arrivals */}
      <div className="bg-card border border-border/50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 animate-fade-in [animation-delay:700ms]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground flex items-center gap-4">
              <span className="w-2 h-8 bg-primary/20 rounded-full" /> Registry of Arrivals
          </h2>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="h-12 px-6 rounded-xl bg-primary text-white hover:bg-black transition-all text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
          >
             <Download className="w-4 h-4 mr-2" /> {isExporting ? 'Processing...' : 'Export Management Data'}
          </Button>
        </div>
        <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
          <table className="w-full min-w-[950px] border-collapse">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-[9px] sm:text-[10px] font-bold text-foreground/70 uppercase tracking-[0.3em]">Guest Identity</th>
                <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-[9px] sm:text-[10px] font-bold text-foreground/70 uppercase tracking-[0.3em]">Accommodation</th>
                <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-[9px] sm:text-[10px] font-bold text-foreground/70 uppercase tracking-[0.3em]">Stay Cycle</th>
                <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-[9px] sm:text-[10px] font-bold text-foreground/70 uppercase tracking-[0.3em]">Base / Token</th>
                <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-[9px] sm:text-[10px] font-bold text-foreground/70 uppercase tracking-[0.3em]">Final / Rem.</th>
                <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-[9px] sm:text-[10px] font-bold text-foreground/70 uppercase tracking-[0.3em]">State</th>
                <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-[9px] sm:text-[10px] font-bold text-foreground/70 uppercase tracking-[0.3em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="group border-b border-border/10 hover:bg-muted/30 transition-all duration-500">
                  <td className="py-6 sm:py-8 px-4 sm:px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold transition-all duration-500 group-hover:bg-primary group-hover:text-white shrink-0">
                        {booking.firstName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-serif font-bold text-base sm:text-lg text-foreground block whitespace-nowrap">{booking.firstName} {booking.lastName}</span>
                        <span className="text-[10px] text-foreground/30 font-bold tracking-widest">{booking.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 sm:py-8 px-4 sm:px-8">
                    <span className="text-foreground/60 font-medium whitespace-nowrap italic">{booking.roomName}</span>
                  </td>
                  <td className="py-6 sm:py-8 px-4 sm:px-8">
                    <span className="text-foreground/70 text-xs sm:text-sm font-medium whitespace-nowrap">
                      {new Date(booking.checkIn).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                    </span>
                  </td>
                  <td className="py-6 sm:py-8 px-4 sm:px-8">
                    <div className="flex flex-col">
                       <span className="text-foreground/80 font-bold whitespace-nowrap">₹{booking.totalAmount?.toLocaleString()}</span>
                       <span className="text-[10px] text-primary font-bold">Paid: ₹{booking.tokenAmount}</span>
                    </div>
                  </td>
                  <td className="py-6 sm:py-8 px-4 sm:px-8">
                    <div className="flex flex-col">
                       <span className="text-foreground/80 font-bold whitespace-nowrap">₹{booking.finalAmount?.toLocaleString()}</span>
                       <span className="text-destructive font-bold text-[10px]">Due: ₹{booking.remainingAmount?.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-6 sm:py-8 px-4 sm:px-8">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      booking.bookingStatus === 'confirmed' ? 'bg-primary/10 text-primary' : 
                      booking.bookingStatus === 'checked_in' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-foreground/70'
                    }`}>
                      {booking.bookingStatus?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-6 sm:py-8 px-4 sm:px-8">
                    <button 
                      onClick={() => handleAddAddon(booking._id)}
                      className="flex items-center gap-3 px-5 py-2.5 bg-primary/5 border border-primary/20 rounded-xl text-[9px] font-bold text-primary uppercase tracking-[0.15em] hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Addon
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
             <div className="py-24 text-center">
                <p className="text-[10px] font-bold text-foreground/10 uppercase tracking-[1em]">Log Spectrum Empty</p>
             </div>
          )}
        </div>
      </div>

       {/* Room Management */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-20">
        <div className="bg-card border border-border/50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 animate-fade-in [animation-delay:800ms]">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-8 sm:mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Inventory Control
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(roomAvailability).map(([roomId, available]) => {
              const roomRef = ROOMS.find(r => 
                (roomId === 'deluxe' && r.id === 1) ||
                (roomId === 'doubleDeluxe' && r.id === 2) ||
                (roomId === 'room10' && r.id === 3) ||
                (roomId === 'room16' && r.id === 4)
              )
              const dbRoom = dbRooms.find(r => r.roomId === roomRef?.id.toString())
              const total = roomRef?.total || 1
              const isAvailable = dbRoom ? dbRoom.isAvailable : true
              
              return (
                <div key={roomId} className="flex flex-col gap-4 p-5 sm:p-8 bg-muted/20 border border-border/40 rounded-[2rem] hover:bg-white hover:border-primary/20 transition-all duration-500 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-destructive animate-pulse'}`} />
                       <span className="text-lg sm:text-xl font-serif font-bold text-foreground">
                         {roomRef?.name}
                       </span>
                    </div>
                    <button 
                      onClick={() => handleToggleRoom(roomRef?.id.toString() || '', isAvailable)}
                      className={`h-10 px-5 rounded-xl flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest transition-all ${
                        isAvailable ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/10' : 'bg-destructive text-white shadow-xl shadow-destructive/10'
                      }`}
                    >
                       <Power className="w-3 h-3" /> {isAvailable ? 'Available' : 'Currently Blocked'}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex-1 flex items-center justify-between bg-background rounded-2xl border border-border/40 px-5 sm:px-8 h-16 transition-all hover:border-primary/40 focus-within:border-primary/40">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest leading-none mb-1">Available Count</span>
                        <span className="text-[8px] text-foreground/30 uppercase tracking-tighter italic">Total Capacity: {total}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="0"
                          max={total}
                          value={available}
                          onChange={(e) => {
                            const val = Math.min(total, Math.max(0, parseInt(e.target.value) || 0))
                            setRoomAvailability({...roomAvailability, [roomId]: val})
                          }}
                          className="bg-muted/10 border-none outline-none text-right w-16 text-xl sm:text-2xl font-serif font-bold text-primary focus:text-black transition-colors"
                        />
                        <span className="text-sm font-bold text-foreground/20 italic">/ {total}</span>
                      </div>
                    </div>
                    {dbRoom?.unavailableDates?.length > 0 && (
                      <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 h-12 rounded-2xl border border-primary/20">
                         <Clock className="w-3 h-3" /> Blocked Schedule
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
           <button 
             onClick={handleSaveInventory} 
             disabled={saving}
             className="w-full mt-8 h-18 bg-primary hover:bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-primary/10 hover:shadow-black/20 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
           >
             <Save className="w-4 h-4" />
             {saving ? 'Synchronizing...' : 'Commit Inventory Changes'}
           </button>
        </div>

        <div className="bg-card border border-border/50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 animate-fade-in [animation-delay:900ms]">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-8 sm:mb-10 flex items-center gap-4">
            <span className="w-2 h-8 bg-primary/20 rounded-full" /> Financial Controls
          </h2>
          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            {Object.entries(prices).map(([room, price]) => (
              <div key={room} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <label className="sm:w-32 text-[9px] font-bold text-foreground/70 uppercase tracking-[0.2em] shrink-0">
                  {room === 'deluxe' ? 'Deluxe' : room === 'doubleDeluxe' ? 'Double' : room === 'room10' ? 'Room 10' : 'Room 16'}
                </label>
                <div className="flex-1 flex items-center gap-4 bg-muted/20 border border-border/40 rounded-2xl px-5 h-14 group hover:border-primary/20 hover:bg-white transition-all duration-500">
                  <span className="text-primary font-bold">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrices({...prices, [room]: e.target.value})}
                    className="flex-1 bg-transparent border-none outline-none text-lg sm:text-xl font-serif font-bold text-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => { setSaveStatus('Pricing policy updated locally.'); setTimeout(() => setSaveStatus(''), 3000); }} 
            className="w-full h-16 sm:h-20 bg-primary hover:bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:shadow-black/20 active:scale-95 transition-all flex items-center justify-center gap-4 mt-auto"
          >
            <Save className="w-5 h-5 stroke-[2.5]" />
            Authorize Updates
          </button>
          {saveStatus && (
            <p className="mt-6 text-center text-[10px] font-bold text-primary uppercase tracking-[0.3em] animate-fade-in">{saveStatus}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-8 py-20 border-t border-border/40">
         <p className="text-[8px] text-foreground/10 uppercase tracking-[0.5em]">Sri Ganesh Residency Terminal v2.0.0</p>
      </div>
    </div>
  )
}
