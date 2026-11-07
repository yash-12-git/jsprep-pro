/**
 * Choices for logging a real interview. Shared by the log page (to render
 * them) and the study plan prompt (to drop anything else), because logged
 * values reach the AI.
 */

export const ROUND_TYPES = [
  "Phone screen",
  "JavaScript fundamentals",
  "Machine coding",
  "Frontend system design",
  "React or framework",
  "DSA or problem solving",
  "Take-home assignment",
  "Hiring manager or behavioural",
];

export const OUTCOMES = [
  "Waiting to hear",
  "Moved to next round",
  "Got an offer",
  "Rejected",
];

export const LOG_TOPICS = [
  "Closures and scope",
  "Event loop and async",
  "Promises",
  "this and prototypes",
  "Hoisting and coercion",
  "DOM and events",
  "Polyfills",
  "React hooks",
  "React rendering and performance",
  "State management",
  "TypeScript",
  "CSS and layout",
  "Browser and networking",
  "Web performance",
  "Accessibility",
  "Testing",
  "System design",
  "DSA",
];

export const LIMITS = { company: 80, stuckOn: 600, topics: 8 };

export interface InterviewLog {
  /** Private to the user; never sent to the AI. */
  company: string;
  roundType: string;
  /** YYYY-MM-DD */
  date: string;
  outcome: string;
  topics: string[];
  stuckOn: string;
  /** Opt-in: may be used without name or contact details for company guides. */
  shareAnonymously: boolean;
  createdAt: string;
}

/**
 * The parts of a log the study plan uses, checked against the choices above.
 * Returns null if the round type is not one of them.
 */
export function logForPrompt(value: unknown) {
  const v = value as Partial<InterviewLog> | null | undefined;
  if (typeof v?.roundType !== "string" || !ROUND_TYPES.includes(v.roundType)) {
    return null;
  }
  return {
    roundType: v.roundType,
    outcome:
      typeof v.outcome === "string" && OUTCOMES.includes(v.outcome)
        ? v.outcome
        : "unknown",
    topics: Array.isArray(v.topics)
      ? v.topics.filter((t) => LOG_TOPICS.includes(t)).slice(0, LIMITS.topics)
      : [],
    stuckOn: String(v.stuckOn ?? "").slice(0, 400),
    date: String(v.date ?? "").slice(0, 10),
  };
}
