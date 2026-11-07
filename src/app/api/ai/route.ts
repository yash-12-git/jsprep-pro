/**
 * src/app/api/ai/route.ts
 *
 * All AI features — Groq only (free, fast).
 * RAG context injected into the generate prompt.
 *
 * Access is decided here, never by the client (see ACCESS below). System prompts
 * are built on the server; the client only supplies values for them.
 *
 * Env vars needed:
 *   GROQ_API_KEY=gsk_...   (free at console.groq.com)
 */

import { NextRequest, NextResponse } from "next/server";
import { buildRAGContext } from "@/lib/embeddings";
import type { SimilarQuestion } from "@/lib/embeddings";
import {
  consumeAIQuota,
  resolveAICaller,
  withFirestoreTimeout,
} from "@/lib/aiAccess";
import { getPublishedTopics } from "@/lib/cachedQueries";
import { verifyAdmin } from "@/lib/firebaseAdmin";
import { getServerTrack } from "@/lib/getServerTrack";
import { callGroq, GroqError } from "@/lib/groq";
import { parseSetupConfig } from "@/lib/mockInterviewOptions";
import { buildPrompt } from "@/lib/mockInterviewPrompt";
import { buildStudyPlanPrompt } from "@/lib/studyPlanPrompt";

// evaluate stays open to everyone because the free sprint warmup and Question
// of the Day use it without an account. Daily limits bound what that can cost.
const ACCESS: Record<string, "any" | "pro" | "internal"> = {
  evaluate: "any",
  qa: "pro",
  debugcheck: "pro",
  studyplan: "pro",
  mock: "pro",
  generate: "internal",
};

const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 8_000;
const MAX_CONTEXT_CHARS = 20_000;

function parseMessages(value: unknown) {
  if (!Array.isArray(value) || value.length > MAX_MESSAGES) return null;
  const valid = value.every(
    (m) =>
      (m?.role === "user" || m?.role === "assistant") &&
      typeof m?.content === "string" &&
      m.content.length <= MAX_MESSAGE_CHARS,
  );
  return valid
    ? (value as { role: string; content: string }[]).map(({ role, content }) => ({
        role,
        content,
      }))
    : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, similarQuestions } = body;
    const context = body.context ?? {};

    const access = Object.prototype.hasOwnProperty.call(ACCESS, type)
      ? ACCESS[type]
      : null;
    if (!access) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const messages = parseMessages(body.messages);
    if (!messages || JSON.stringify(context).length > MAX_CONTEXT_CHARS) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (access === "internal") {
      // Question generation: the weekly cron or an admin, via /api/generate.
      const authHeader = req.headers.get("authorization");
      const isCron =
        !!process.env.CRON_SECRET &&
        authHeader === `Bearer ${process.env.CRON_SECRET}`;
      if (!isCron && !(await verifyAdmin(authHeader))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else {
      // If Firestore can't answer, Pro can't be confirmed, so paid features
      // stop. Free evaluation carries on unmetered: Groq's own rate limits still
      // cap the cost, and a database problem shouldn't break the free sprint.
      const firestoreDown = (err: unknown) => {
        console.error("[ai] access check unavailable:", err);
        return null;
      };
      let checksFailed = false;
      const caller = await withFirestoreTimeout(resolveAICaller(req)).catch(
        (err) => {
          checksFailed = true;
          return firestoreDown(err);
        },
      );
      if (checksFailed && access === "pro") {
        return NextResponse.json(
          { error: "AI is busy, try again shortly" },
          { status: 503 },
        );
      }
      if (!checksFailed) {
        if (!caller || (access === "pro" && caller.tier === "anon")) {
          return NextResponse.json(
            { error: "Sign in required" },
            { status: 401 },
          );
        }
        if (access === "pro" && caller.tier !== "pro") {
          return NextResponse.json({ error: "Pro required" }, { status: 403 });
        }
        const allowed = await withFirestoreTimeout(consumeAIQuota(caller)).catch(
          (err) => {
            firestoreDown(err);
            return access !== "pro" ? true : null;
          },
        );
        if (allowed === null) {
          return NextResponse.json(
            { error: "AI is busy, try again shortly" },
            { status: 503 },
          );
        }
        if (!allowed) {
          return NextResponse.json(
            { error: "Daily AI limit reached" },
            { status: 429 },
          );
        }
      }
    }

    // RAG context — only the admin-only generate prompt uses it
    const ragContext =
      access === "internal" && similarQuestions?.length
        ? buildRAGContext(similarQuestions as SimilarQuestion[])
        : "";

    let systemPrompt = "";
    let mockMesssages: { role: string; content: string }[] = [];

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
        systemPrompt = buildStudyPlanPrompt(context);
        break;

      // ── Mock Interview ────────────────────────────────────────────────────
      case "mock":
        const ctx = parseSetupConfig(context);
        if (!ctx) {
          return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }
        const track = await getServerTrack();
        const topics = await getPublishedTopics({ track });
        systemPrompt = buildPrompt(
          ctx,
          topics.map(({ title, slug }) => ({ title, slug })),
        );

        const isFinal = context.isFinal === true;
        const clientMsgs = messages;

        // The timer can end an interview before all 10 answers are in.
        const answered = clientMsgs.filter(
          (m: { role: string; content: string }) =>
            m.role === "user" && m.content !== "GENERATE_SCORECARD",
        ).length;
        if (isFinal && answered < 10) {
          systemPrompt += `\n\nThis interview ended early because time ran out. The candidate gave ${answered} of 10 answers. Score only those answers, and do not penalise questions that were never asked or answered. Say in the summary that the score is based on ${answered} answers.`;
        }

        // Per-request entropy prevents model caching / identical responses
        const entropy = Math.random().toString(36).slice(2, 8);
        const tsNow = Date.now();

        // Detect the very first exchange: single user message containing "Begin"
        const isOpener =
          clientMsgs.length === 1 &&
          clientMsgs[0].role === "user" &&
          (clientMsgs[0].content.toLowerCase().includes("begin") ||
            clientMsgs[0].content.toLowerCase().includes("start"));

        const enrichedMessages = isOpener
          ? [
              {
                role: "user",
                content: [
                  `[req:${entropy} t:${tsNow}]`,
                  ``,
                  `Start the interview NOW. Ask the FIRST question from your opening topics list.`,
                  ``,
                  `Candidate context for this specific session:`,
                  `  Role:       ${ctx.role}`,
                  `  Level:      ${ctx.experience}`,
                  `  Focus:      ${ctx.focus}`,
                  ``,
                  `CRITICAL: Do NOT ask "null vs undefined" or "var let const differences".`,
                  `Those are banned. Use the opening question from your system prompt.`,
                  `Ask exactly ONE question. Make it feel like a real technical interview.`,
                ].join("\n"),
              },
            ]
          : clientMsgs.map((m) => ({ role: m.role, content: m.content }));

        // For non-opener messages, add the GENERATE_SCORECARD message when final
        mockMesssages =
          isFinal && !isOpener
            ? [
                ...enrichedMessages,
                { role: "user", content: "GENERATE_SCORECARD" },
              ]
            : enrichedMessages;
        break;
      case "generate":
        // ── SANDBOX CONTRACT (enforced for all output + debug questions) ────────
        // Output questions: code must run → console.log matches expectedOutput
        // Debug questions:  brokenCode must run → produce WRONG output (not throw)
        //                   fixedCode must run → produce correct expectedOutput
        // BANNED: fetch, XMLHttpRequest, DOM, React, Node.js APIs, error-output
        const sandboxRules =
          context.type === "output" || context.type === "debug"
            ? `
CRITICAL SANDBOX RULES — you MUST follow these exactly:
1. Use ONLY pure JavaScript — no fetch, no XMLHttpRequest, no DOM APIs,
   no document, no window, no React, no Node.js (fs, path, process, require)
2. ALL output must be via console.log — no alert, confirm, prompt
3. The code must be deterministic — same output every single run
4. setTimeout and Promise are ALLOWED for event-loop questions only
5. For DEBUG questions specifically:
   - brokenCode must RUN without throwing — it must produce WRONG output
   - The bug must be subtle and conceptual (scope, this, closure, coercion)
   - fixedCode must produce the correct expectedOutput
   - NEVER generate a bug that throws a ReferenceError, TypeError, or SyntaxError
   - expectedOutput must NEVER contain the word "Error"
6. Teach exactly ONE core JavaScript concept per question`
            : "";

        systemPrompt = `You are an expert JavaScript interview question author creating questions for developers with 1-3 years experience.
${sandboxRules}

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
  "title": "<concise question title — describes the concept, not 'what does this output'>",
  "code": "<the JavaScript code, use \\n for newlines — must run in sandbox>",
  "expectedOutput": "<exact console.log output, one value per line — NEVER an error string>",
  "explanation": "<why this is the output — step by step reasoning>",
  "keyInsight": "<the one JS concept this question tests>",
  "hint": "<a hint that guides thinking without revealing the answer>"
}`
      : `Respond ONLY with this JSON (no markdown, no backticks):
{
  "title": "<concise title describing the bug>",
  "brokenCode": "<the RUNNABLE buggy code that produces WRONG output — must not throw>",
  "fixedCode": "<the corrected code that produces the correct expectedOutput>",
  "bugDescription": "<one sentence: what the bug is and why it produces wrong output>",
  "expectedOutput": "<what fixedCode logs — NEVER contains 'Error' or 'error'>",
  "explanation": "<why it was broken and exactly how the fix works>",
  "keyInsight": "<the JS concept this teaches>",
  "hint": "<a hint pointing toward the bug without revealing it>"
}`
}`;
        break;

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const text = await callGroq({
      systemPrompt,
      messages: type === "mock" ? mockMesssages : messages,
      maxTokens: type === "qa" || type === "evaluate" || type === "debugcheck" ? 1024 : 2048,
      temperature: type === "mock" ? 0.7 : 1,
      json: type !== "qa" && type !== "mock",
    });
    return NextResponse.json({ text });
  } catch (err) {
    console.error("AI route error:", err);
    if (err instanceof GroqError && err.status === 429) {
      return NextResponse.json(
        { error: "AI is busy, try again shortly" },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
