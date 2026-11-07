/**
 * System prompt for the AI study plan. Server-only: imported by /api/ai.
 * Everything in `context` comes from the browser, so each value is checked
 * and capped before it reaches the prompt.
 */

const MAX_FOCUS_CANDIDATES = 40;

function focusCandidateLines(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, MAX_FOCUS_CANDIDATES)
    .filter((q) => typeof q?.id === "string" && typeof q?.title === "string")
    .map((q) => `- ${q.id}: ${String(q.category ?? "")}: ${q.title}`);
}

export function buildStudyPlanPrompt(context: Record<string, any>): string {
  const sprints = Array.isArray(context.sprintHistory)
    ? context.sprintHistory.slice(0, 3)
    : [];
  const candidates = focusCandidateLines(context.focusCandidates);

  return `You are a JavaScript interview coach creating a personalized study plan.

The developer has the following profile:
- Experience: 1-3 years frontend
- Mastered questions: ${Number(context.masteredCount) || 0} out of ${Number(context.totalQuestions) || 0}
- Weak categories (low mastery): ${JSON.stringify(context.weakCategories ?? [])}
- Strong categories (high mastery): ${JSON.stringify(context.strongCategories ?? [])}
- Recent sprints, newest first: ${sprints.length ? JSON.stringify(sprints) : "none yet"}
- Interview date: ${context.interviewDate ?? "not set"}

Questions available for "focusQuestions", each as "id: category: title":
${candidates.length ? candidates.join("\n") : "(none)"}

Choose up to 5 of those questions for "focusQuestions". Copy each id exactly as written. Never invent an id. If the list is empty, return an empty array.

Respond with ONLY a JSON object in this exact format:
{
  "readinessScore": <number 0-100>,
  "readinessLabel": "<Not Ready / Getting There / Almost Ready / Interview Ready>",
  "summary": "<2 sentence honest assessment>",
  "weakSpots": [
    {"category": "<n>", "reason": "<why they struggle>", "tip": "<specific advice>"}
  ],
  "dailyPlan": [
    {"day": 1, "focus": "<category>", "tasks": ["<task 1>", "<task 2>", "<task 3>"], "timeMinutes": <number>}
  ],
  "quickWins": ["<thing they can improve fast 1>", "<thing 2>", "<thing 3>"],
  "focusQuestions": ["<id from the list above>"]
}`;
}
