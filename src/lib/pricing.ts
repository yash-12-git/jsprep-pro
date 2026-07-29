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

/**
 * Razorpay Subscriptions are billed against a Plan, and a Plan is locked to a
 * single currency — so each currency you want to sell in needs its own plan
 * created in the Razorpay dashboard, exposed as RAZORPAY_PLAN_ID_<CURRENCY>.
 *
 * Only INR is required. Any currency without a configured plan falls back to
 * the INR plan, so international visitors are billed ₹199 rather than being
 * blocked at checkout. Add more plan ids to charge them local rates.
 *
 * Server-only: reads process.env, so never call this from a client component.
 */
export function getPlanForCountry(
  country: string | null,
): { planId: string; pricing: PricingInfo } {
  const pricing = getPricingForCountry(country)
  const planId =
    process.env[`RAZORPAY_PLAN_ID_${pricing.currency}`] ||
    process.env.RAZORPAY_PLAN_ID_INR

  if (!planId) {
    throw new Error('RAZORPAY_PLAN_ID_INR is not configured')
  }

  // Fell back to the INR plan → the user is actually billed INR, so report
  // INR pricing rather than the local label we would otherwise have shown.
  const billedInr =
    planId === process.env.RAZORPAY_PLAN_ID_INR && pricing.currency !== 'INR'

  return {
    planId,
    pricing: billedInr ? getPricingForCountry('IN') : pricing,
  }
}