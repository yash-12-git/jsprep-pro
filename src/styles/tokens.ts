// ─── Global design tokens ─────────────────────────────────────────────────────
// Uses CSS variables → dynamic theme switching works everywhere automatically

export const C = {
  // ─── Surfaces ───────────────────────────────────────────────────────────────
  bg:       "var(--color-bg)",
  bgSubtle: "var(--color-bg-subtle)",
  bgHover:  "var(--color-bg-hover)",
  bgActive: "var(--color-bg-active)",
  card:     "var(--color-bg)",
  surface:  "var(--color-bg-subtle)",

  // ─── Borders ────────────────────────────────────────────────────────────────
  border:       "var(--color-border)",
  borderStrong: "var(--color-border-strong)",
  borderHover:  "var(--color-border-strong)",   // alias used by some components

  // ─── Text ───────────────────────────────────────────────────────────────────
  text:        "var(--color-text)",
  text2:       "var(--color-muted)",             // alias used by some components
  muted:       "var(--color-muted)",
  placeholder: "var(--color-placeholder)",
  disabled:    "var(--color-placeholder)",

  // ─── Accent ─────────────────────────────────────────────────────────────────
  accent:       "var(--color-accent)",
  accentHover:  "var(--color-accent-hover)",
  accentSubtle: "var(--color-accent-subtle)",
  accentText:   "var(--color-accent-text)",
  accentDim:    "var(--color-accent-subtle)",    // alias
  accentBorder: "var(--color-accent-subtle)",    // alias

  // ─── Code ───────────────────────────────────────────────────────────────────
  codeBg:       "var(--color-code-bg)",
  codeText:     "var(--color-code-text)",
  codeInlineBg: "var(--color-code-inline-bg)",

  // ─── Semantic: Green ────────────────────────────────────────────────────────
  green:        "var(--color-green)",
  greenSubtle:  "var(--color-green-subtle)",
  greenBorder:  "var(--color-green-border)",
  success:      "var(--color-green)",
  successDim:   "var(--color-green-subtle)",
  successBorder:"var(--color-green-border)",

  // ─── Semantic: Amber ────────────────────────────────────────────────────────
  amber:        "var(--color-amber)",
  amberSubtle:  "var(--color-amber-subtle)",
  amberBorder:  "var(--color-amber-border)",
  warning:      "var(--color-amber)",
  warningDim:   "var(--color-amber-subtle)",
  warningBorder:"var(--color-amber-border)",

  // ─── Semantic: Red ──────────────────────────────────────────────────────────
  red:          "var(--color-red)",
  redSubtle:    "var(--color-red-subtle)",
  redBorder:    "var(--color-red-border)",
  danger:       "var(--color-red)",
  dangerDim:    "var(--color-red-subtle)",
  dangerBorder: "var(--color-red-border)",

  // ─── Legacy aliases (keep for compatibility) ────────────────────────────────
  orange:  "var(--color-amber)",
  accent2: "var(--color-amber)",
  accent3: "var(--color-green)",
  purple:  "var(--color-accent)",
} as const;

// ─── Fonts ────────────────────────────────────────────────────────────────────
export const FONT = {
  sans: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
  mono: `"JetBrains Mono", "Fira Code", monospace`,
} as const;

// ─── Breakpoints ──────────────────────────────────────────────────────────────
export const BP = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;

// ─── Border radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  none: "0",
  sm:   "0.375rem",
  md:   "0.5rem",
  lg:   "0.75rem",
  xl:   "1rem",
  xxl:  "1.25rem",
  full: "9999px",
} as const;

// ─── Difficulty badge styles ──────────────────────────────────────────────────
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
  beginner: { bg: C.greenSubtle, color: C.green, border: C.greenBorder },
  core:     { bg: C.greenSubtle, color: C.green, border: C.greenBorder },
  easy:     { bg: C.greenSubtle, color: C.green, border: C.greenBorder },

  advanced: { bg: C.amberSubtle, color: C.amber, border: C.amberBorder },
  medium:   { bg: C.amberSubtle, color: C.amber, border: C.amberBorder },

  expert:   { bg: C.redSubtle,   color: C.red,   border: C.redBorder   },
  hard:     { bg: C.redSubtle,   color: C.red,   border: C.redBorder   },
};

export const DIFF_LABEL: Record<string, string> = {
  beginner: "Easy",
  core:     "Easy",
  easy:     "Easy",
  advanced: "Medium",
  medium:   "Medium",
  expert:   "Hard",
  hard:     "Hard",
};

// ─── Topic-level difficulty ───────────────────────────────────────────────────
export const TOPIC_DIFF_COLOR: Record<string, string> = {
  Beginner:     C.green,
  Intermediate: C.amber,
  Advanced:     C.orange,
  Senior:       C.red,
};

export const TOPIC_DIFF_BG: Record<string, string> = {
  Beginner:     C.greenSubtle,
  Intermediate: C.amberSubtle,
  Advanced:     C.amberSubtle,
  Senior:       C.redSubtle,
};