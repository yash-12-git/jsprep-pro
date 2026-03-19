import { NextRequest, NextResponse } from "next/server";
import { buildRAGContext } from "@/lib/embeddings";
import type { SimilarQuestion } from "@/lib/embeddings";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

async function callGroq(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxTokens = 1024,
): Promise<string> {
  const response = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Groq error:", response.status, err);
    throw new Error(`Groq error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, messages, context, similarQuestions } = body;

    // RAG context — injected into relevant prompts when provided
    const ragContext = similarQuestions?.length
      ? buildRAGContext(similarQuestions as SimilarQuestion[])
      : "";

    let systemPrompt = "";

    switch (type) {
      // ── Q&A Tutor ─────────────────────────────────────────────────────────
      case "qa":
        systemPrompt = `You are an expert JavaScript interview coach helping a developer prepare for frontend interviews (1-3 years experience level).

The user is asking about this specific JS interview question:
"${context.question}"

The official answer/explanation is:
${context.answer}
${ragContext ? `\n${ragContext}\n\nBuild on or contrast these related questions. Avoid repeating what they already cover.` : ""}

Your role:
- Answer follow-up questions clearly and concisely
- Use simple code examples when helpful (use plain text code blocks, not markdown)
- Connect concepts to real-world React/frontend use cases
- If they seem confused, try a different explanation angle
- Keep responses focused and under 200 words unless a longer answer is truly needed
- Be encouraging and supportive`;
        break;

      // ── Answer Evaluator ──────────────────────────────────────────────────
      case "evaluate":
        systemPrompt = `You are a strict but fair JavaScript interview evaluator.

The interview question is: "${context.question}"

The ideal answer covers: ${context.idealAnswer}
${ragContext ? `\n${ragContext}\n\nConsider these related concepts when evaluating depth of understanding.` : ""}

Evaluate the candidate's answer and respond with ONLY a JSON object in this exact format:
{
  "score": <number 1-10>,
  "grade": "<A/B/C/D/F>",
  "verdict": "<one line summary>",
  "strengths": ["<point 1>", "<point 2>"],
  "missing": ["<concept 1>", "<concept 2>"],
  "betterAnswer": "<a concise improved version of their answer in 2-3 sentences>"
}

Be honest. Score 8+ only if they covered the key concepts well. Score 1-4 if they missed the main point.`;
        break;

      // ── Debug Checker ─────────────────────────────────────────────────────
      case "debugcheck":
        systemPrompt = `You are a strict JavaScript code reviewer checking if a developer correctly fixed a buggy snippet.

ORIGINAL BROKEN CODE:
${context.brokenCode}

THE BUG: ${context.bugDescription}

REFERENCE FIX:
${context.fixedCode}

DEVELOPER'S SUBMITTED FIX:
${context.userFix}

Evaluate and respond ONLY with this JSON (no markdown, no extra text):
{
  "correct": <true or false>,
  "score": <1-10>,
  "verdict": "<one line summary>",
  "whatTheyGotRight": "<what they fixed correctly, or 'Nothing' if totally wrong>",
  "remainingIssues": "<bugs still present, or 'None' if fully correct>",
  "betterApproach": "<cleaner solution if theirs works but is suboptimal, or null>",
  "hint": "<nudge toward fix if wrong, without giving it away>",
  "explanation": "<2-3 sentences on the core bug and correct fix>"
}

Accept alternative correct solutions. A fix is correct if it solves the core bug even if different from the reference.`;
        break;

      // ── Study Plan ────────────────────────────────────────────────────────
      case "studyplan":
        systemPrompt = `You are a JavaScript interview coach creating a personalized study plan.

The developer has the following profile:
- Experience: 1-3 years frontend
- Mastered questions: ${context.masteredIds?.length ?? 0} out of ${context.totalQuestions ?? 150}
- Weak categories (low mastery): ${JSON.stringify(context.weakCategories ?? [])}
- Strong categories (high mastery): ${JSON.stringify(context.strongCategories ?? [])}
- Sprint history: ${JSON.stringify(context.sprintHistory?.slice(-3) ?? [])}
- Interview date: ${context.interviewDate ?? "not set"}

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
  "focusQuestions": ["<question id 1>", "<question id 2>", "<question id 3>", "<question id 4>", "<question id 5>"]
}`;
        break;

      // ── Mock Interview ────────────────────────────────────────────────────
      case "mock":
        systemPrompt = `You are a senior frontend engineer conducting a realistic JavaScript technical interview at a product company (think Razorpay, Swiggy, Flipkart level).

Interview style:
- Start with a mid-level JS question
- Follow up based on their answer — dig deeper, probe edge cases, ask "what if" scenarios
- If they answer well, increase difficulty. If they struggle, offer a hint or simplify
- Be professional but conversational, not robotic
- Ask ONE question or follow-up at a time
- After 6-8 exchanges, wrap up with honest feedback

Rules:
- Never reveal you are an AI during the interview
- React naturally to their answers ("Interesting approach", "Good point, but what about...")
- Keep your messages concise (2-4 sentences max per turn)
- End the interview after ~8 turns with a realistic verdict: "I think we have enough to evaluate, thanks for your time. Overall feedback: [honest assessment]"

Start the interview now with your first question.`;
        break;

      // ── Question Generator ────────────────────────────────────────────────
      case "generate":
        systemPrompt = `You are an expert JavaScript interview question author creating high-quality questions for developers with 1-5 years experience.

Generate a ${context.difficulty} ${context.type} JavaScript interview question about: ${context.topic}
Category: ${context.category}
${ragContext ? `\n${ragContext}\n\nIMPORTANT: Do NOT generate a question similar to any of the above. Cover a distinct angle, edge case, or sub-concept.` : ""}

${
  context.type === "theory"
    ? `Respond ONLY with this JSON (no markdown, no backticks):
{
  "title": "<clear question title>",
  "answer": "<comprehensive HTML answer using <p>, <pre><code>, <strong> tags>",
  "explanation": "<plain text 1-2 sentence explanation>",
  "keyInsight": "<the single most important takeaway for interviews>",
  "hint": "<a subtle hint that guides thinking without giving the answer>"
}`
    : context.type === "output"
      ? `Respond ONLY with this JSON (no markdown, no backticks):
{
  "title": "<What does this output? question title>",
  "code": "<the JavaScript code snippet, use \\n for newlines>",
  "expectedOutput": "<exact output, each value on its own line>",
  "explanation": "<why this is the output — step by step>",
  "keyInsight": "<the JS concept this tests>"
}`
      : `Respond ONLY with this JSON (no markdown, no backticks):
{
  "title": "<Find the bug question title>",
  "brokenCode": "<the buggy JavaScript code, use \\n for newlines>",
  "fixedCode": "<the corrected code, use \\n for newlines>",
  "bugDescription": "<one sentence describing the bug>",
  "explanation": "<why it was broken and how the fix works>",
  "keyInsight": "<the JS concept this teaches>"
}`
}`;
        break;

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const text = await callGroq(
      systemPrompt,
      messages,
      type === "generate" ? 2048 : 1024,
    );
    return NextResponse.json({ text });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json(
      { error: "Internal error", detail: String(err) },
      { status: 500 },
    );
  }
}
