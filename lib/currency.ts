// Currency conversion rates (1 INR = X)
export const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012, // 1 INR = 0.012 USD
  EUR: 0.011  // 1 INR = 0.011 EUR
}

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€'
}

export const CURRENCY_NAMES = {
  INR: 'Indian Rupee',
  USD: 'US Dollar',
  EUR: 'Euro'
}

export type Currency = 'INR' | 'USD' | 'EUR'

export const DEFAULT_CURRENCY: Currency = 'INR'

// Format price based on currency
export function formatPrice(priceInINR: number, currency: Currency): string {
  const rate = EXCHANGE_RATES[currency]
  const convertedPrice = priceInINR * rate
  const symbol = CURRENCY_SYMBOLS[currency]

  if (currency === 'INR') {
    return `${symbol}${Math.round(convertedPrice).toLocaleString('en-IN')}`
  } else if (currency === 'USD') {
    return `${symbol}${convertedPrice.toFixed(2)}`
  } else {
    return `${symbol}${convertedPrice.toFixed(2)}`
  }
}

// Get price in specific currency
export function convertPrice(priceInINR: number, currency: Currency): number {
  const rate = EXCHANGE_RATES[currency]
  return currency === 'INR' ? priceInINR : Math.round(priceInINR * rate * 100) / 100
}
