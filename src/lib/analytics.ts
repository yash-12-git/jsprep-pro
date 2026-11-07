// Funnel events. Each one goes to Google Analytics (for funnels and
// conversion) and to Clarity (so session recordings can be filtered by
// outcome). Both scripts load after hydration, so an event fired before they
// arrive is dropped by Clarity; gtag queues it through dataLayer.
//
// Never pass personal data (email, name, answer text) as a parameter.

type Params = Record<string, string | number | boolean | undefined>;

export type FunnelEvent =
  | "sign_up"
  | "login"
  | "practice_answered"
  | "ai_evaluation_shown"
  | "sprint_started"
  | "sprint_completed"
  | "study_plan_generated"
  | "mock_interview_started"
  | "mock_interview_completed"
  | "interview_logged"
  | "feedback_submitted"
  | "referral_shared"
  | "paywall_shown"
  | "begin_checkout"
  | "checkout_failed"
  | "purchase"
  | "subscription_cancelled";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    clarity?: (...args: unknown[]) => void;
  }
}

export function track(event: FunnelEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  try {
    // GA4 drops string parameters past 100 characters.
    const clean = Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, typeof v === "string" ? v.slice(0, 100) : v]),
    );
    // Before gtag.js loads, queue the call the way its stub does: gtag.js only
    // replays `arguments` objects, not plain arrays.
    const gtag =
      window.gtag ??
      function () {
        // eslint-disable-next-line prefer-rest-params
        (window.dataLayer ??= []).push(arguments);
      };
    gtag("event", event, clean);
    window.clarity?.("event", event);
  } catch {
    // Analytics must never break the page.
  }
}
