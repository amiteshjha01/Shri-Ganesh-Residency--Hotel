'use client'

import { useState, useEffect } from 'react'
import { type Currency, DEFAULT_CURRENCY } from '@/lib/currency'

export function useCurrency() {
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

  return { currency, mounted }
}
