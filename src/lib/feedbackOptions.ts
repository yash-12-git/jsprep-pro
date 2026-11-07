/**
 * The feedback form's questions. Shared by the form and /api/rewards/feedback,
 * which rejects anything that isn't one of these choices.
 */

export const FOUND_VIA = [
  "Google search",
  "LinkedIn",
  "A friend or colleague",
  "Reddit",
  "YouTube",
  "Other",
];

export const PREPARING_FOR = [
  "Switching jobs",
  "My first job",
  "Campus placements",
  "Just improving my skills",
];

export const FEEDBACK_LIMITS = { min: 30, max: 1000 };

export interface FeedbackAnswers {
  foundVia: string;
  preparingFor: string;
  /** 0–10: how likely they are to recommend JSPrep Pro. */
  recommend: number;
  mostUseful: string;
  missing: string;
}

/** Returns the cleaned answers, or a message saying what to fix. */
export function parseFeedback(value: unknown): FeedbackAnswers | string {
  const v = value as Partial<FeedbackAnswers> | null;
  if (!v || !FOUND_VIA.includes(v.foundVia as string)) return "Tell us how you found JSPrep Pro.";
  if (!PREPARING_FOR.includes(v.preparingFor as string)) return "Tell us what you're preparing for.";
  const recommend = Number(v.recommend);
  if (!Number.isInteger(recommend) || recommend < 0 || recommend > 10) {
    return "Pick a number from 0 to 10.";
  }
  const missing = String(v.missing ?? "").trim();
  if (missing.length < FEEDBACK_LIMITS.min) {
    return `Tell us a bit more about what's missing (at least ${FEEDBACK_LIMITS.min} characters).`;
  }
  return {
    foundVia: v.foundVia as string,
    preparingFor: v.preparingFor as string,
    recommend,
    mostUseful: String(v.mostUseful ?? "").trim().slice(0, FEEDBACK_LIMITS.max),
    missing: missing.slice(0, FEEDBACK_LIMITS.max),
  };
}
