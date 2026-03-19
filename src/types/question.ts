// ─── Question Types ───────────────────────────────────────────────────────────
// Single source of truth. Add a new QuestionType here when you launch
// React / System Design / Behavioral / Coding tracks.

export type QuestionType =
  | "theory" // What is closure? / Explain event loop
  | "output" // What does this code print?
  | "debug" // Find and fix the bug
  | "coding" // Write a function that... (future)
  | "system" // Design a rate limiter (future)
  | "behavioral"; // Tell me about a time... (future)

export type Difficulty = "beginner" | "core" | "advanced" | "expert";

export type QuestionStatus = "draft" | "published" | "archived";

export type Track =
  | "javascript"
  | "react"
  | "typescript"
  | "system-design"
  | "behavioral";

// ─── Core Question ────────────────────────────────────────────────────────────

export interface Question {
  // Identity
  id: string; // Firestore doc ID (string, not number)
  slug: string; // URL-safe identifier e.g. "what-is-closure"
  type: QuestionType;
  track: Track;

  // Content — stored as Markdown
  title: string; // Short question title shown in list
  question: string; // Full question text (Markdown)
  answer: string; // Full answer (Markdown, supports code blocks)
  hint?: string; // Optional hint shown before answer
  explanation?: string; // Extra explanation (used in output/debug)
  keyInsight?: string; // One-liner insight card
  code?: string; // Starter code for output/debug/coding

  // Classification
  category: string; // e.g. "Closures", "Event Loop", "Promises"
  tags: string[]; // ["core", "scope", "interview-favorite"]
  difficulty: Difficulty;

  // Output quiz specific
  expectedOutput?: string; // The correct output answer

  // Debug specific
  brokenCode?: string;
  fixedCode?: string;
  bugDescription?: string;

  // Linking fields — connect questions to topics and blog posts
  topicSlug?: string; // Foreign key → topics.slug (e.g. 'javascript-closure-interview-questions')
  relatedBlogSlugs?: string[]; // Slugs of blog posts that explain this question in depth

  // Metadata
  status: QuestionStatus;
  isPro: boolean; // false = free tier, true = pro only
  order: number; // Sort order within category
  viewCount: number; // Analytics
  solveCount: number; // Analytics
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  createdBy?: string; // admin uid
  isTricky?: boolean; // for future "tricky" tag
  embedding?: number[]
}

// ─── Firestore helpers ────────────────────────────────────────────────────────

export type QuestionInput = Omit<
  Question,
  "id" | "viewCount" | "solveCount" | "createdAt" | "updatedAt"
>;

export interface QuestionFilters {
  type?: QuestionType;
  track?: Track;
  category?: string;
  topicSlug?: string; // Filter by topic page slug — used in topic hub pages
  difficulty?: Difficulty;
  isPro?: boolean;
  status?: QuestionStatus;
  tags?: string[];
  isTricky?: boolean; // for future "tricky" tag filter
}

// ─── User progress (per-question, not global) ─────────────────────────────────
// Stored at users/{uid}/progress/{questionId}

export interface QuestionProgress {
  questionId: string;
  status:
    | "unseen"
    | "attempted"
    | "solved"
    | "mastered"
    | "bookmarked"
    | "revealed";
  attempts: number;
  lastAttemptAt?: string;
  solvedAt?: string;
  masteredAt?: string;
  score?: number; // AI eval score (1–10)
  userAnswer?: string; // last answer they typed
  isBookmarked?: boolean;
}