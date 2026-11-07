/**
 * The choices offered on the mock interview setup screen. Shared by the client
 * (to render them) and /api/ai (to reject anything else), because these strings
 * end up inside the system prompt.
 */

export const ROLES = [
  "Frontend Developer",
  "Full Stack Developer",
  "JavaScript Engineer",
  "React Developer",
  "Node.js Developer",
];
export const LEVELS = [
  { value: "junior", label: "Junior (0–2 yrs)" },
  { value: "mid", label: "Mid-level (2–4 yrs)" },
  { value: "senior", label: "Senior (4–7 yrs)" },
  { value: "lead", label: "Tech Lead (7+ yrs)" },
];
export const FOCUS_AREAS = [
  "Core JavaScript",
  "Async & Promises",
  "Closures & Scope",
  "System Design (Frontend)",
  "React & State Management",
  "Performance Optimisation",
  "Machine Coding Round",
  "Product Scenario Round",
  "Mixed (all topics)",
];

export interface SetupConfig {
  role: string;
  experience: string;
  focus: string;
}

/** Returns the config only if every field is one of the offered choices. */
export function parseSetupConfig(value: unknown): SetupConfig | null {
  const c = value as Partial<SetupConfig> | null | undefined;
  if (
    typeof c?.role === "string" &&
    typeof c?.experience === "string" &&
    typeof c?.focus === "string" &&
    ROLES.includes(c.role) &&
    LEVELS.some((l) => l.value === c.experience) &&
    FOCUS_AREAS.includes(c.focus)
  ) {
    return {
      role: c.role,
      experience: c.experience,
      focus: c.focus,
    };
  }
  return null;
}
