// lib/pricing.ts

export interface PricingInfo {
  currency: string;
  amount: number;
  symbol: string;
  display: string;
  label: string;    // "$9.99/mo"
  isFree: string;   // "Free" tier display e.g. "$0"
}

export const CURRENCY_PRICES: Record<string, Omit<PricingInfo, 'label' | 'isFree'>> = {
  INR: { currency: 'INR', amount: 19900,  symbol: '₹',    display: '199'   },
  USD: { currency: 'USD', amount: 999,    symbol: '$',    display: '9.99'  },
  EUR: { currency: 'EUR', amount: 899,    symbol: '€',    display: '8.99'  },
  GBP: { currency: 'GBP', amount: 799,    symbol: '£',    display: '7.99'  },
  SGD: { currency: 'SGD', amount: 1299,   symbol: 'S$',   display: '12.99' },
  AED: { currency: 'AED', amount: 3699,   symbol: 'AED ', display: '36.99' },
  AUD: { currency: 'AUD', amount: 1499,   symbol: 'A$',   display: '14.99' },
  CAD: { currency: 'CAD', amount: 1299,   symbol: 'C$',   display: '12.99' },
}

const COUNTRY_CURRENCY: Record<string, string> = {
  IN: 'INR', US: 'USD', GB: 'GBP', SG: 'SGD',
  AE: 'AED', AU: 'AUD', CA: 'CAD',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  PT: 'EUR', BE: 'EUR', AT: 'EUR', CH: 'EUR', SE: 'EUR',
}

export function getPricingForCountry(country: string | null): PricingInfo {
  const currency = COUNTRY_CURRENCY[(country ?? 'IN').toUpperCase()] ?? 'USD'
  const base = CURRENCY_PRICES[currency] ?? CURRENCY_PRICES.USD
  return {
    ...base,
    label: `${base.symbol}${base.display}/mo`,
    isFree: `${base.symbol}0`,
  }
}