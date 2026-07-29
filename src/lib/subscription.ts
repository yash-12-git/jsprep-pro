/**
 * Subscription expiry rules (server-side).
 *
 * Pro access is always time-boxed to the period the user has actually paid
 * for. Every successful charge pushes `proExpiresAt` forward to the end of the
 * new billing period. If a renewal never happens — card declined, webhook lost,
 * Razorpay outage — nothing extends the date and access lapses on its own.
 *
 * This is deliberately fail-closed: the old flow wrote `proExpiresAt: null`
 * (never expires), so a single payment granted permanent access.
 */

/** Days of slack after the paid period ends, to absorb retry/webhook delay. */
export const GRACE_DAYS = 3;

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * DAY_MS;

/**
 * @param currentEnd Razorpay `current_end`, Unix seconds. Absent on some
 *                   events, in which case we assume one month from now.
 */
export function proExpiryFrom(currentEnd?: number | null): string {
  const periodEnd = currentEnd ? currentEnd * 1000 : Date.now() + MONTH_MS;
  return new Date(periodEnd + GRACE_DAYS * DAY_MS).toISOString();
}

/** Expiry for a subscription that has stopped renewing but is still in grace. */
export function graceExpiry(): string {
  return new Date(Date.now() + GRACE_DAYS * DAY_MS).toISOString();
}
