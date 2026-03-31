// ─── Topic Types ──────────────────────────────────────────────────────────────
// Single source of truth for topic structure.
// Topics live in Firestore `topics` collection.

export type TopicDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Senior'
export type TopicStatus     = 'draft' | 'published' | 'archived'

export interface Topic {
  // Identity
  id: string                     // Firestore doc ID
  slug: string                   // URL slug e.g. 'javascript-closure-interview-questions'

  // Content
  title: string                  // 'JavaScript Closure Interview Questions'
  category: string               // Matches Question.category — 'Functions', 'Core JS', etc.
  keyword: string                // Short label e.g. 'closure' (used in SEO + subtitles)
  description: string            // One-line description for H1 subtext + meta
  extraKeywords?: string[]       // Extra terms for fuzzy question matching (legacy fallback)
  difficulty: TopicDifficulty
  questionCount: string          // '8–12' (display-only — actual count is live from Firestore)
  cheatSheet: string[]           // Bullet points shown in the cheat sheet card
  interviewTips: string[]        // Numbered tips shown in the interview tips card
  related: string[]              // Slugs of related topic pages to cross-link

  // ── Concept Hub fields (the "best explanation on the internet" layer) ────────
  mentalModel?: string           // 1–3 sentence analogy that makes the concept click
  deepDive?: string              // Full HTML explanation — progressive examples, visuals
  misconceptions?: string[]      // Each item: "Many devs think X — but actually Y"
  realWorldExamples?: string[]   // "React useState relies on closures because..."

  // Linking fields
  relatedBlogSlugs?: string[]    // Slugs of blog posts that cover this topic

  // Metadata
  status: TopicStatus
  order?: number                 // Sort order on /topics listing
  track?: string                 // Optional track for filtering (e.g. 'frontend', 'fullstack', etc.)
  createdAt: string              // ISO timestamp
  updatedAt: string
  createdBy?: string             // admin uid
}

// Used when creating/updating — Firestore assigns id, timestamps are set server-side
export type TopicInput = Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>

export interface TopicFilters {
  status?: TopicStatus
  difficulty?: TopicDifficulty
  category?: string
  track?: string
}