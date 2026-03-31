/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";
import { css } from "@emotion/react";
import {
  writeBatch,
  doc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { C, RADIUS } from "@/styles/tokens";
// embeddings called via /api/embed (server-side) — COHERE_API_KEY not available client-side
import {
  Database,
  CheckCircle2,
  Loader2,
  BookOpen,
  Code2,
  Bug,
  Trash2,
  Zap,
  FlaskConical,
} from "lucide-react";

// ── Import all static data ─────────────────────────────────────────────────────
import { questions as theoryRaw } from "@/data/questions";
import { outputQuestions } from "@/data/outputQuestions";
import { debugQuestions } from "@/data/debugQuestions";
import { polyfillQuestions } from "@/data/polyfillQuestions";
import type { QuestionInput } from "@/types/question";

// ─── Difficulty map ────────────────────────────────────────────────────────────

const tagToDifficulty = (
  tags: string[],
): "beginner" | "core" | "advanced" | "expert" => {
  if (tags.includes("adv")) return "advanced";
  if (tags.includes("mid")) return "core";
  return "beginner";
};

const diffMap = (d: string): "beginner" | "core" | "advanced" | "expert" => {
  if (d === "hard") return "expert";
  if (d === "medium") return "advanced";
  return "core";
};

// ─── Build question arrays from static data ────────────────────────────────────

function buildTheoryQuestions(): QuestionInput[] {
  return theoryRaw.map((q, i) => ({
    slug: q.q
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60),
    type: "theory" as const,
    track: "react" as const,
    title: q.q,
    question: q.q,
    answer: q.answer,
    hint: q.hint ?? "",
    explanation: "",
    keyInsight: "",
    code: "",
    category: q.cat,
    tags: q.tags as string[],
    difficulty: tagToDifficulty(q.tags),
    status: "published" as const,
    isPro: i >= 5,
    order: i,
    expectedOutput: "",
    brokenCode: "",
    fixedCode: "",
    bugDescription: "",
  }));
}

function buildOutputQuestions(): QuestionInput[] {
  return outputQuestions.map((q, i) => ({
    slug: `output-${q.id}-${q.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40)}`,
    type: "output" as const,
    track: "react" as const,
    title: q.title,
    question: q.title,
    answer: `**Explanation:** ${q.explanation}\n\n**Key Insight:** ${q.keyInsight}`,
    hint: q.keyInsight,
    explanation: q.explanation,
    keyInsight: q.keyInsight,
    code: q.code,
    category: q.cat,
    tags: q.tags,
    difficulty: diffMap(q.difficulty),
    status: "published" as const,
    isPro: i >= 5,
    order: i,
    expectedOutput: q.answer,
    brokenCode: "",
    fixedCode: "",
    bugDescription: "",
    companies: q.companies ?? [],
  }));
}

function buildDebugQuestions(): QuestionInput[] {
  return debugQuestions.map((q, i) => ({
    slug: `debug-${q.id}-${q.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40)}`,
    type: "debug" as const,
    track: "react" as const,
    title: q.title,
    question: q.description,
    answer: `**Bug:** ${q.bugDescription}\n\n**Explanation:** ${q.explanation}\n\n**Key Insight:** ${q.keyInsight}`,
    hint: q.keyInsight,
    explanation: q.explanation,
    keyInsight: q.keyInsight,
    code: q.brokenCode,
    category: q.cat,
    tags: q.tags,
    difficulty: diffMap(q.difficulty),
    status: "published" as const,
    isPro: i >= 5,
    order: i,
    expectedOutput: q.expectedOutput, // ← reads from data file (was always '')
    brokenCode: q.brokenCode,
    fixedCode: q.fixedCode,
    bugDescription: q.bugDescription,
    companies: q.companies ?? [],
  }));
}

function buildPolyfillQuestions(): QuestionInput[] {
  return polyfillQuestions.map((q, i) => ({
    slug: `polyfill-${q.id}-${q.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50)}`,
    type: "polyfill" as const,
    track: "react" as const,
    title: q.title,
    question: q.description,
    answer: `**Key Insight:** ${q.keyInsight}`,
    hint: "",
    explanation: q.description,
    keyInsight: q.keyInsight,
    code: q.stubCode,
    category: q.cat,
    tags: [q.cat.toLowerCase().replace(/[^a-z0-9]+/g, "-"), q.difficulty],
    companies: q.companies,
    difficulty: diffMap(q.difficulty),
    status: "published" as const,
    isPro: i >= 5,
    order: i,
    expectedOutput: "",
    brokenCode: "",
    fixedCode: "",
    bugDescription: "",
    // Polyfill-specific fields (schema matches existing question format)
    stubCode: q.stubCode,
    testCode: q.testCode,
    solutionCode: q.solutionCode,
  }));
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const S = {
  page: css`
    max-width: 48rem;
  `,

  heading: css`
    font-size: 1.5rem;
    font-weight: 900;
    margin-bottom: 0.375rem;
    color: ${C.text};
  `,
  sub: css`
    color: ${C.muted};
    font-size: 0.875rem;
    margin-bottom: 2rem;
    line-height: 1.7;
  `,

  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  `,

  dataCard: (color: string, done: boolean) => css`
    background: ${C.card};
    border: 1px solid ${done ? color + "44" : C.border};
    border-radius: ${RADIUS.xl};
    padding: 1.25rem;
    transition: border-color 0.2s;
  `,

  dataIcon: (color: string) => css`
    width: 2.25rem;
    height: 2.25rem;
    background: ${color}14;
    border: 1px solid ${color}30;
    border-radius: ${RADIUS.md};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
  `,

  dataTitle: css`
    font-size: 0.9375rem;
    font-weight: 800;
    color: ${C.text};
    margin-bottom: 0.25rem;
  `,
  dataCount: (color: string) => css`
    font-size: 1.5rem;
    font-weight: 900;
    color: ${color};
  `,
  dataMeta: css`
    font-size: 0.6875rem;
    color: ${C.muted};
    margin-top: 0.25rem;
  `,

  doneBadge: (color: string) => css`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.625rem;
    font-weight: 800;
    text-transform: uppercase;
    background: ${color}14;
    border: 1px solid ${color}33;
    color: ${color};
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    margin-top: 0.5rem;
  `,

  seedBtn: (loading: boolean) => css`
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.875rem 2rem;
    background: ${loading ? C.accent + "80" : C.accent};
    border: none;
    border-radius: ${RADIUS.xl};
    color: white;
    font-weight: 800;
    font-size: 1rem;
    cursor: ${loading ? "not-allowed" : "pointer"};
    transition: all 0.15s;
    &:hover {
      background: ${loading ? "" : C.accent + "ee"};
    }
  `,

  embedBtn: (loading: boolean) => css`
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1.5rem;
    background: ${loading ? C.accent3 + "40" : C.accent3 + "18"};
    border: 1px solid ${C.accent3}44;
    border-radius: ${RADIUS.xl};
    color: ${C.accent3};
    font-weight: 700;
    font-size: 0.875rem;
    cursor: ${loading ? "not-allowed" : "pointer"};
    transition: all 0.15s;
    &:hover {
      background: ${loading ? "" : C.accent3 + "28"};
    }
  `,

  dangerBtn: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: transparent;
    border: 1px solid ${C.danger}44;
    border-radius: ${RADIUS.xl};
    color: ${C.danger};
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    &:hover {
      background: ${C.danger}12;
    }
  `,

  log: css`
    background: var(--color-code-bg, #f7f7f5);
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.xl};
    padding: 1rem 1.25rem;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    line-height: 1.8;
    max-height: 20rem;
    overflow-y: auto;
    margin-top: 1.5rem;
  `,

  logLine: (type: "info" | "success" | "error" | "warn") => {
    const colors = {
      info: C.muted,
      success: C.green,
      error: C.red,
      warn: C.amber,
    };
    return css`
      color: ${colors[type]};
    `;
  },

  warningBox: css`
    padding: 1rem 1.25rem;
    background: ${C.amberSubtle};
    border: 1px solid ${C.amberBorder};
    border-radius: ${RADIUS.xl};
    font-size: 0.875rem;
    color: ${C.amber};
    margin-bottom: 1.5rem;
    line-height: 1.7;
  `,

  successBox: css`
    padding: 1rem 1.25rem;
    background: ${C.greenSubtle};
    border: 1px solid ${C.greenBorder};
    border-radius: ${RADIUS.xl};
    font-size: 0.9rem;
    color: ${C.green};
    margin-bottom: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.625rem;
  `,

  divider: css`
    border: none;
    border-top: 1px solid ${C.border};
    margin: 1.5rem 0;
  `,

  sectionTitle: css`
    font-size: 0.6875rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: ${C.muted};
    margin-bottom: 0.875rem;
  `,
};

interface LogEntry {
  type: "info" | "success" | "error" | "warn";
  text: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function SeedPage() {
  const { user } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [embedding, setEmbedding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [done, setDone] = useState<Record<string, number>>({});

  const theoryQs = buildTheoryQuestions();
  const outputQs = buildOutputQuestions();
  const debugQs = buildDebugQuestions();
  const polyfillQs = buildPolyfillQuestions();
  const totalQs = debugQs.length + outputQs.length + theoryQs.length + polyfillQs.length;

  function addLog(type: LogEntry["type"], text: string) {
    setLog((prev) => [...prev, { type, text }]);
  }

  // ── Batch write one question type ──────────────────────────────────────────

  async function seedBatch(
    questions: QuestionInput[],
    label: string,
    color: string,
  ): Promise<number> {
    addLog("info", `Seeding ${label}: ${questions.length} questions...`);
    let created = 0;
    const BATCH_SIZE = 400;

    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const chunk = questions.slice(i, i + BATCH_SIZE);
      for (const q of chunk) {
        const ref = doc(collection(db, "questions"));
        batch.set(ref, {
          ...q,
          createdBy: user!.uid,
          viewCount: 0,
          solveCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        created++;
      }
      await batch.commit();
      addLog(
        "success",
        `  ${label}: committed ${Math.min(i + BATCH_SIZE, questions.length)}/${questions.length}`,
      );
    }

    addLog("success", `${label} done — ${created} questions added`);
    setDone((prev) => ({ ...prev, [label]: created }));
    return created;
  }

  // ── Generate embeddings for output + debug questions ───────────────────────
  // Theory questions don't need embeddings — they're not run through RAG dedup.

  // Calls /api/embed which runs server-side where COHERE_API_KEY is available
  async function embedText(text: string): Promise<number[]> {
    const res = await fetch("/api/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? `embed API error ${res.status}`);
    }
    const data = await res.json();
    return data.embedding as number[];
  }

  function buildEmbedText(q: QuestionInput): string {
    // Same logic as buildEmbeddingInput in embeddings.ts
    const parts = [
      q.title,
      q.category ?? "",
      q.explanation ?? "",
      q.keyInsight ?? "",
    ];
    if (q.type === "output") parts.push(q.code ?? "", q.expectedOutput ?? "");
    if (q.type === "debug")
      parts.push(q.brokenCode ?? "", q.bugDescription ?? "");
    return parts.filter(Boolean).join(" ").slice(0, 4000);
  }

  async function generateEmbeddings(questions: QuestionInput[]) {
    const toEmbed = questions.filter(
      (q) => q.type === "output" || q.type === "debug",
    );
    addLog(
      "info",
      `Generating embeddings for ${toEmbed.length} output/debug questions...`,
    );
    addLog("info", "This takes ~1 min. Do not close this page.");

    let done = 0;
    let failed = 0;

    for (const q of toEmbed) {
      try {
        const text = buildEmbedText(q);
        const embedding = await embedText(text);

        const snap = await getDocs(
          query(collection(db, "questions"), where("slug", "==", q.slug)),
        );
        if (!snap.empty) {
          await updateDoc(snap.docs[0].ref, { embedding });
          done++;
        } else {
          addLog("warn", `  Slug not found: ${q.slug}`);
          failed++;
        }

        await new Promise((r) => setTimeout(r, 150));
      } catch (e: any) {
        failed++;
        addLog("error", `  Embedding failed for "${q.title}": ${e.message}`);
      }
    }

    addLog(
      failed === 0 ? "success" : "warn",
      `Embeddings done — ${done} success, ${failed} failed`,
    );
  }

  // ── Main seed handler ──────────────────────────────────────────────────────

  async function handleSeed() {
    if (!user) return;
    setSeeding(true);
    setLog([]);
    setDone({});

    try {
      addLog("info", `Starting seed as ${user.email}`);
      addLog("info", `Total: ${totalQs} questions`);
      addLog("info", "─────────────────────────────");

      await seedBatch(theoryQs, "Theory", C.accent);
      await seedBatch(outputQs,   'Output',   C.amber)
      await seedBatch(debugQs,    'Debug',    C.red)
      await seedBatch(polyfillQs, "Polyfill", C.green);

      addLog("info", "─────────────────────────────");
      addLog("success", `Seed complete! ${totalQs} questions in Firestore.`);
      addLog("info", "Generating embeddings for output + debug questions...");

      // Polyfill questions don't need embeddings (no RAG dedup needed)
      setEmbedding(true);
      await generateEmbeddings([...theoryQs]);
      setEmbedding(false);

      addLog(
        "success",
        "All done! Questions are ready for the dedup pipeline.",
      );
    } catch (e: any) {
      addLog("error", `Error: ${e.message}`);
    } finally {
      setSeeding(false);
      setEmbedding(false);
    }
  }

  // ── Re-embed only (run after adding new questions manually) ───────────────

  async function handleReEmbed() {
    if (!user) return;
    setEmbedding(true);
    setLog([]);

    try {
      addLog("info", "Fetching all output + debug questions...");
      const snap = await getDocs(
        query(collection(db, "questions"), where("status", "==", "published")),
      );
      const all = snap.docs.map((d) => ({
        ...d.data(),
        slug: d.data().slug,
      })) as QuestionInput[];
      const toEmbed = all.filter(
        (q: any) =>
          (q.type === "theory" || q.type === "output" || q.type === "debug") &&
          !q.embedding?.length,
      );
      addLog("info", `Found ${toEmbed.length} questions without embeddings`);

      let done = 0;
      for (const q of toEmbed) {
        try {
          const text = buildEmbedText(q as QuestionInput);
          const embedding = await embedText(text);
          const snap2 = await getDocs(
            query(collection(db, "questions"), where("slug", "==", q.slug)),
          );
          if (!snap2.empty) {
            await updateDoc(snap2.docs[0].ref, { embedding });
            done++;
            addLog(
              "success",
              `  [${done}/${toEmbed.length}] ${(q as any).title}`,
            );
          }
          await new Promise((r) => setTimeout(r, 150));
        } catch (e: any) {
          addLog("error", `  Failed: ${(q as any).title} — ${e.message}`);
        }
      }
      addLog(
        "success",
        `Re-embed complete — ${done}/${toEmbed.length} updated`,
      );
    } catch (e: any) {
      addLog("error", `Error: ${e.message}`);
    } finally {
      setEmbedding(false);
    }
  }

  // ── Clear all ──────────────────────────────────────────────────────────────

  async function handleClearAll() {
    if (!user) return;
    if (
      !window.confirm(
        "Delete ALL questions from Firestore? This cannot be undone.",
      )
    )
      return;
    setClearing(true);
    setLog([]);

    try {
      addLog("warn", "Fetching all question IDs...");
      const snap = await getDocs(collection(db, "questions"));
      addLog("warn", `Found ${snap.docs.length} documents to delete.`);

      const BATCH_SIZE = 400;
      for (let i = 0; i < snap.docs.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        snap.docs.slice(i, i + BATCH_SIZE).forEach((d) => batch.delete(d.ref));
        await batch.commit();
        addLog(
          "info",
          `  Deleted ${Math.min(i + BATCH_SIZE, snap.docs.length)}/${snap.docs.length}`,
        );
      }

      addLog("success", "All questions deleted. Ready for a fresh seed.");
      setDone({});
    } catch (e: any) {
      addLog("error", `Error: ${e.message}`);
    } finally {
      setClearing(false);
    }
  }

  const allDone =
    done["Theory"] && done["Output"] && done["Debug"] && done["Polyfill"];
  const isBusy = seeding || clearing || embedding;

  return (
    <div css={S.page}>
      <h1 css={S.heading}>Seed / Import Questions</h1>
      <p css={S.sub}>
        Import static question files into Firestore. Run once after setup. Use{" "}
        <strong>Clear All</strong> before re-seeding to avoid duplicates.
        <br />
        Embeddings are generated automatically after seeding — required for the
        dedup pipeline in the AI generator.
      </p>

      {allDone && (
        <div css={S.successBox}>
          <CheckCircle2 size={18} />
          All {totalQs} questions successfully imported!
        </div>
      )}

      {/* Data cards */}
      <div css={S.sectionTitle}>Data to import</div>
      <div css={S.grid}>
        {[
          {
            label: "Theory",
            count: theoryQs.length,
            icon: BookOpen,
            color: C.accent,
            desc: "Core JS, Functions, Async, Objects",
            key: "Theory",
          },
          {
            label: "Output",
            count: outputQs.length,
            icon: Code2,
            color: C.amber,
            desc: "Predict console output — event loop, scope",
            key: "Output",
          },
          {
            label: "Debug",
            count: debugQs.length,
            icon: Bug,
            color: C.red,
            desc: "Find & fix silent JS bugs — pure sandbox JS",
            key: "Debug",
          },
          {
            label: "Polyfill",
            count: polyfillQs.length,
            icon: FlaskConical,
            color: C.green,
            desc: "Implement JS methods from scratch with tests",
            key: "Polyfill",
          },
        ].map(({ label, count, icon: Icon, color, desc, key }) => (
          <div key={key} css={S.dataCard(color, !!done[key])}>
            <div css={S.dataIcon(color)}>
              <Icon size={16} color={color} />
            </div>
            <div css={S.dataTitle}>{label} Questions</div>
            <div css={S.dataCount(color)}>{count}</div>
            <div css={S.dataMeta}>{desc}</div>
            {done[key] && (
              <div css={S.doneBadge(C.green)}>
                <CheckCircle2 size={9} /> Imported
              </div>
            )}
          </div>
        ))}
      </div>

      <div css={S.warningBox}>
        ⚠ <strong>Run this only once.</strong> Running again creates duplicates.
        Use "Clear All Questions" first if you need to re-seed from scratch.
      </div>

      {/* Action buttons */}
      <div
        css={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <button css={S.seedBtn(seeding)} onClick={handleSeed} disabled={isBusy}>
          {seeding ? (
            <>
              <Loader2
                size={16}
                css={{ animation: "spin 1s linear infinite" }}
              />{" "}
              {embedding ? "Generating embeddings…" : "Seeding…"}
            </>
          ) : (
            <>
              <Database size={16} /> Seed {totalQs} Questions + Embeddings
            </>
          )}
        </button>

        <button
          css={S.embedBtn(embedding)}
          onClick={handleReEmbed}
          disabled={isBusy}
        >
          {embedding ? (
            <>
              <Loader2
                size={14}
                css={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Embedding…
            </>
          ) : (
            <>
              <Zap size={14} /> Re-Embed Missing
            </>
          )}
        </button>

        <button css={S.dangerBtn} onClick={handleClearAll} disabled={isBusy}>
          {clearing ? (
            <>
              <Loader2
                size={14}
                css={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Clearing…
            </>
          ) : (
            <>
              <Trash2 size={14} /> Clear All Questions
            </>
          )}
        </button>
      </div>

      {/* Live log */}
      {log.length > 0 && (
        <div css={S.log}>
          {log.map((entry, i) => (
            <div key={i} css={S.logLine(entry.type)}>
              {entry.text}
            </div>
          ))}
          {isBusy && (
            <div css={S.logLine("info")}>
              <Loader2
                size={11}
                style={{
                  display: "inline",
                  animation: "spin 1s linear infinite",
                  marginRight: "0.375rem",
                }}
              />
              running…
            </div>
          )}
        </div>
      )}

      <hr css={S.divider} />

      <div css={S.sectionTitle}>After seeding</div>
      <ol
        style={{
          paddingLeft: "1.25rem",
          fontSize: "0.875rem",
          lineHeight: 2.1,
          color: C.text,
        }}
      >
        <li>
          Go to{" "}
          <a href="/admin/questions" style={{ color: C.accent }}>
            Admin → All Questions
          </a>{" "}
          to verify all rows appear.
        </li>
        <li>
          Create Firestore composite indexes:
          <pre
            style={{
              background: "var(--color-code-bg, #f7f7f5)",
              border: `1px solid ${C.border}`,
              borderRadius: "0.5rem",
              padding: "0.75rem",
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: C.text,
              overflowX: "auto",
            }}
          >
            {`Collection: questions
Index 1:  status ASC + order ASC
Index 2:  status ASC + type ASC + order ASC
Index 3:  status ASC + track ASC + order ASC
Index 4:  status ASC + category ASC + order ASC`}
          </pre>
        </li>
        <li>
          Open your{" "}
          <a href="/dashboard" style={{ color: C.accent }}>
            dashboard
          </a>{" "}
          — questions now load from Firestore.
        </li>
        <li>
          If embedding generation failed for some questions, click{" "}
          <strong>Re-Embed Missing</strong> to retry. The AI generator's dedup
          feature requires embeddings on all output + debug questions.
        </li>
      </ol>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
