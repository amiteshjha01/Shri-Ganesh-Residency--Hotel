'use client'

import { useState, useEffect } from 'react'
import { CURRENCY_SYMBOLS, type Currency } from '@/lib/currency'
import { ChevronDown } from 'lucide-react'

export default function CurrencySelector() {
  const [currency, setCurrency] = useState<Currency>('INR')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('currency') as Currency
    if (saved) {
      setCurrency(saved)
    }
  }, [])

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    localStorage.setItem('currency', newCurrency)
    setIsOpen(false)
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: newCurrency }))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        <span>{CURRENCY_SYMBOLS[currency]}</span>
        <span>{currency}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
          <button
            onClick={() => handleCurrencyChange('INR')}
            className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors ${
              currency === 'INR' ? 'bg-primary/10 text-primary font-semibold' : ''
            }`}
          >
            <span className="font-medium">Indian Rupee</span>
            <span className="ml-2 text-foreground/60">(₹)</span>
          </button>
          <button
            onClick={() => handleCurrencyChange('USD')}
            className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors ${
              currency === 'USD' ? 'bg-primary/10 text-primary font-semibold' : ''
            }`}
          >
            <span className="font-medium">US Dollar</span>
            <span className="ml-2 text-foreground/60">($)</span>
          </button>
          <button
            onClick={() => handleCurrencyChange('EUR')}
            className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors ${
              currency === 'EUR' ? 'bg-primary/10 text-primary font-semibold' : ''
            }`}
          >
            <span className="font-medium">Euro</span>
            <span className="ml-2 text-foreground/60">(€)</span>
          </button>
        </div>
      )}
    </div>
  )
}
