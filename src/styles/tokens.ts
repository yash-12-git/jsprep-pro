// Global design tokens — import into every styles.ts file
// Change here = changes everywhere

export const C = {
  accent: "#7c6af7",
  accent2: "#f7c76a",
  accent3: "#6af7c0",
  danger: "#f76a6a",
  purple: "#a78bfa",
  orange: "#f97316",
  bg: "#0a0a10",
  card: "#111118",
  surface: "#16161f",
  border: "rgba(255,255,255,0.07)",
  muted: "rgba(255,255,255,0.45)",
  text: "#c8c8d8",
};

export const BP = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
};

export const RADIUS = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  xxl: "1.5rem",
};

// ─── Difficulty badge styles — shared between QuestionCards and SEO pages ─────
// Plain JS objects so they work in both Emotion css`` and inline style={{}}

export type DiffLevel =
  | "beginner"
  | "core"
  | "advanced"
  | "expert"
  | "easy"
  | "medium"
  | "hard";

export const DIFF_STYLE: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  beginner: {
    bg: `${C.accent3}1a`,
    color: C.accent3,
    border: `${C.accent3}33`,
  },
  core: { bg: `${C.accent3}1a`, color: C.accent3, border: `${C.accent3}33` },
  easy: { bg: `${C.accent3}1a`, color: C.accent3, border: `${C.accent3}33` },
  advanced: {
    bg: `${C.accent2}1a`,
    color: C.accent2,
    border: `${C.accent2}33`,
  },
  medium: { bg: `${C.accent2}1a`, color: C.accent2, border: `${C.accent2}33` },
  expert: { bg: `${C.danger}1a`, color: C.danger, border: `${C.danger}33` },
  hard: { bg: `${C.danger}1a`, color: C.danger, border: `${C.danger}33` },
};

export const DIFF_LABEL: Record<string, string> = {
  beginner: "🟢 Easy",
  core: "🟢 Easy",
  easy: "🟢 Easy",
  advanced: "🟡 Medium",
  medium: "🟡 Medium",
  expert: "🔴 Hard",
  hard: "🔴 Hard",
};

// Topic difficulty keys use Title Case ("Beginner/Intermediate/Advanced/Senior")
// Question difficulty keys use lowercase — see DIFF_STYLE above
export const TOPIC_DIFF_COLOR: Record<string, string> = {
  Beginner: C.accent3, // green
  Intermediate: C.accent2, // yellow
  Advanced: C.orange, // orange
  Senior: C.danger, // red
};

export const TOPIC_DIFF_BG: Record<string, string> = {
  Beginner: `${C.accent3}1a`,
  Intermediate: `${C.accent2}1a`,
  Advanced: `${C.orange}1a`,
  Senior: `${C.danger}1a`,
};
