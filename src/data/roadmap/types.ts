// ─── Roadmap Domain Types ─────────────────────────────────────────────────────

export interface RoadmapTask {
  /** Display text for the task */
  text: string;
  /**
   * Optional slug of a JSPrep topic page this task links to.
   * Resolves to /[topicSlug] via the existing [topic] dynamic route.
   */
  topicSlug?: string;
}

export interface RoadmapDay {
  day: number;
  tasks: RoadmapTask[];
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