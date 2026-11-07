/**
 * When earned (free) Pro ends. Shared by the server's Pro check and the
 * browser, so both agree. No Firebase imports, so either side can use it.
 *
 * Two kinds of earned time:
 * - promoProUntil: a fixed end date, for anyone without a renewing subscription.
 * - bankedProDays: days earned while a subscription was renewing. A renewal
 *   keeps moving the paid end date, so a fixed date would be swallowed;
 *   banked days instead start whenever the paid period finally ends.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export interface PromoFields {
  promoProUntil?: string | null;
  bankedProDays?: number | null;
}

export interface PaidFields {
  isPro?: boolean;
  proExpiresAt?: string | null;
  subscriptionStatus?: string;
}

/** A subscription that will charge again, so its end date keeps moving. */
export function hasRenewingSubscription(user: PaidFields | undefined) {
  return (
    user?.isPro === true &&
    user.subscriptionStatus === "active" &&
    !!user.proExpiresAt &&
    new Date(user.proExpiresAt) > new Date()
  );
}

/** End of earned Pro as a timestamp, or 0 if there is none. */
export function promoProEnd(promo: PromoFields | undefined, user: PaidFields | undefined) {
  const fixed = promo?.promoProUntil ? new Date(promo.promoProUntil).getTime() || 0 : 0;
  const banked = promo?.bankedProDays ?? 0;
  const paidEnd = user?.proExpiresAt ? new Date(user.proExpiresAt).getTime() || 0 : 0;
  // Banked days run on from the end of the paid period.
  const fromBank = banked > 0 && paidEnd ? paidEnd + banked * DAY_MS : 0;
  return Math.max(fixed, fromBank);
}

export function hasActivePromo(promo: PromoFields | undefined, user: PaidFields | undefined) {
  return promoProEnd(promo, user) > Date.now();
}
