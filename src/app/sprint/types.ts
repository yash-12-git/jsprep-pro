export type SprintOutcome = "correct" | "attempted" | "skipped";
export type SprintPhase = "lobby" | "active" | "results";

export interface QuestionResult {
  questionId: string;
  type: "theory" | "output" | "debug";
  category: string;
  points: number; // actual points earned
  outcome: SprintOutcome;
  aiScore?: number; // 1-10 from AI eval (theory/debug only)
  timeSpentSecs?: number;
}

export interface SprintConfig {
  questionCount: 5 | 10 | 15 | 20;
}

// Points per outcome
export const SPRINT_POINTS: Record<SprintOutcome, number> = {
  correct: 10,
  attempted: 3,
  skipped: 0,
};

export const MAX_POINTS = 10; // per question

export interface SprintSummary {
  score: number;
  maxScore: number;
  accuracy: number; // 0–100
  timeUsedSecs: number;
  results: QuestionResult[];
  strengths: string[]; // top category names
  weakAreas: string[]; // weak category names
  questionCount: number;
  completedAt: string; // ISO string
}
