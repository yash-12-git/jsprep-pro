/**
 * Interview readiness, calculated from what the user has done rather than
 * guessed by the AI, so the same activity always gives the same score and
 * each part can be explained.
 *
 * Four parts, each 0–100. A part with no data yet is "not measured" and left
 * out, and the weights of the measured parts are scaled up to 100, so a new
 * user isn't scored as failing interviews they haven't taken.
 */

export const COVERAGE_TARGET = 0.5; // half of each mode counts as full coverage

const WEIGHTS = { coverage: 35, practice: 25, mock: 25, real: 15 } as const;

const OUTCOME_SCORES: Record<string, number> = {
  "Got an offer": 100,
  "Moved to next round": 75,
  Rejected: 25,
  // "Waiting to hear" says nothing yet, so it isn't counted.
};

export type ReadinessKey = keyof typeof WEIGHTS;

export interface ModeProgress {
  done: number;
  total: number;
}

export interface QuestionTotals {
  theoryTotal: number;
  outputTotal: number;
  debugTotal: number;
  polyfillTotal: number;
  outputIds: string[];
  debugIds: string[];
  polyfillIds: string[];
}

export interface ReadinessInputs {
  /** Theory, output, debug and polyfill. */
  modes: ModeProgress[];
  /** Accuracy (0–100) of recent sprints where something was answered, newest first. */
  sprintAccuracies: number[];
  /** Overall scores (0–100) of recent scored mock interviews, newest first. */
  mockScores: number[];
  /** Outcomes of recent logged real interviews, newest first. */
  realOutcomes: string[];
}

export interface ReadinessPart {
  key: ReadinessKey;
  label: string;
  weight: number;
  /** null when there is no data for this part yet. */
  value: number | null;
  detail: string;
  /** Where to go to improve or measure this part. */
  href: string;
}

export interface Readiness {
  score: number;
  label: string;
  parts: ReadinessPart[];
}

const average = (xs: number[]) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function readinessLabel(score: number) {
  if (score >= 80) return "Interview ready";
  if (score >= 60) return "Almost ready";
  if (score >= 40) return "Getting there";
  return "Not ready";
}

/** Done/total per mode; theory counts mastered questions, the rest count solved ones. */
export function modeProgress(
  totals: QuestionTotals,
  masteredIds: string[],
  solvedIds: string[],
): ModeProgress[] {
  const solved = new Set(solvedIds);
  const count = (ids: string[]) => ids.filter((id) => solved.has(id)).length;
  return [
    { done: Math.min(masteredIds.length, totals.theoryTotal), total: totals.theoryTotal },
    { done: count(totals.outputIds), total: totals.outputTotal },
    { done: count(totals.debugIds), total: totals.debugTotal },
    { done: count(totals.polyfillIds), total: totals.polyfillTotal },
  ];
}

export function computeReadiness(input: ReadinessInputs): Readiness {
  const modes = input.modes.filter((m) => m.total > 0);
  const coverage = modes.length
    ? average(
        modes.map((m) => Math.min(1, m.done / Math.max(1, m.total * COVERAGE_TARGET)) * 100),
      )
    : null;
  const done = modes.reduce((s, m) => s + m.done, 0);

  const sprints = input.sprintAccuracies.slice(0, 5);
  const mocks = input.mockScores.slice(0, 3);
  const outcomes = input.realOutcomes
    .filter((o) => o in OUTCOME_SCORES)
    .slice(0, 5);

  const rawParts: ReadinessPart[] = [
    {
      key: "coverage",
      label: "Coverage",
      weight: WEIGHTS.coverage,
      value: coverage,
      detail: `${plural(done, "question")} done. Half of each practice mode counts as full coverage.`,
      href: "/theory",
    },
    {
      key: "practice",
      label: "Sprint accuracy",
      weight: WEIGHTS.practice,
      value: average(sprints),
      detail: sprints.length
        ? `Average of your last ${plural(sprints.length, "sprint")}.`
        : "Run an Interview Sprint to measure this.",
      href: "/sprint",
    },
    {
      key: "mock",
      label: "Mock interviews",
      weight: WEIGHTS.mock,
      value: average(mocks),
      detail: mocks.length
        ? `Average of your last ${plural(mocks.length, "mock interview")}.`
        : "Take a mock interview to measure this.",
      href: "/mock-interview",
    },
    {
      key: "real",
      label: "Real interviews",
      weight: WEIGHTS.real,
      value: average(outcomes.map((o) => OUTCOME_SCORES[o])),
      detail: outcomes.length
        ? `From the outcomes of ${plural(outcomes.length, "logged interview")}.`
        : "Log a real interview with its outcome to include this.",
      href: "/interview-log",
    },
  ];
  const parts = rawParts.map((p) => ({
    ...p,
    value: p.value === null ? null : Math.round(p.value),
  }));

  const measured = parts.filter((p) => p.value !== null);
  const weightSum = measured.reduce((s, p) => s + p.weight, 0);
  const score = weightSum
    ? Math.round(measured.reduce((s, p) => s + (p.value as number) * p.weight, 0) / weightSum)
    : 0;

  return { score, label: readinessLabel(score), parts };
}
