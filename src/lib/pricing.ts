// lib/pricing.ts

export interface PricingInfo {
  currency: string;
  amount: number;
  symbol: string;
  display: string;
  label: string;    // "$9.99/mo"
  isFree: string;   // "Free" tier display e.g. "$0"
}

// Two prices: India pays in rupees, everyone else in US dollars.
export const CURRENCY_PRICES: Record<'INR' | 'USD', Omit<PricingInfo, 'label' | 'isFree'>> = {
  INR: { currency: 'INR', amount: 19900, symbol: '₹', display: '199'  },
  USD: { currency: 'USD', amount: 999,   symbol: '$', display: '9.99' },
}

/** No country (local dev, or a request without the header) counts as India. */
export function getPricingForCountry(country: string | null): PricingInfo {
  const base = (country ?? 'IN').toUpperCase() === 'IN' ? CURRENCY_PRICES.INR : CURRENCY_PRICES.USD
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
 * Only INR is required. Until RAZORPAY_PLAN_ID_USD is set, visitors outside
 * India fall back to the INR plan and are billed ₹199 rather than being
 * blocked at checkout.
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

/**
 * The price this visitor will actually be charged, for anywhere a price is
 * shown. Keeps the displayed price and the checkout in step.
 *
 * Server-only, for the same reason as getPlanForCountry.
 */
export function getBilledPricing(country: string | null): PricingInfo {
  try {
    return getPlanForCountry(country).pricing
  } catch {
    return getPricingForCountry('IN')
  }
}
