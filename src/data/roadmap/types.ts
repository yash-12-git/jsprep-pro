// ─── Roadmap Domain Types ─────────────────────────────────────────────────────

export type TaskType = "read" | "build" | "mock";

export interface RoadmapTask {
  /** Display text for the task */
  text: string;
  /**
   * Optional slug of a JSPrep topic page this task links to.
   * Resolves to /[topicSlug] via the existing [topic] dynamic route.
   */
  topicSlug?: string;
  /** Visual icon hint: read = 📖, build = 🛠️, mock = 🎤 */
  type?: TaskType;
}

export interface RoadmapDay {
  day: number;
  tasks: RoadmapTask[];
  /** Short labels shown as tags on the day card e.g. ["JS", "critical"] */
  tags?: string[];
  /** Pre-fill the mock interview focus when user clicks "Start mock" on this day */
  mockFocus?: string;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  days: RoadmapDay[];
}

export interface RoadmapMonth {
  month: number;
  title: string;
  /** Accent color key for the month tab (maps to CSS vars) */
  accent: "green" | "blue" | "amber" | "coral";
  /** One-line phase description shown under the month header */
  description?: string;
  /** Time commitment shown in the phase banner e.g. "2–3h/day" */
  timeCommitment?: string;
  weeks: RoadmapWeek[];
}

export interface RoadmapProgress {
  /** dayNumber → timestamp when completed */
  [day: number]: number;
}

export interface WeekStats {
  week: number;
  done: number;
  total: number;
  pct: number;
  isComplete: boolean;
}

export interface MonthStats {
  month: number;
  done: number;
  total: number;
  pct: number;
}

export interface GlobalStats {
  totalDone: number;
  totalDays: number;
  pct: number;
  weeksComplete: number;
  streak: number;
}