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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { C, RADIUS } from "@/styles/tokens";
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  BookOpen,
  Code2,
  Bug,
  Trash2,
  RefreshCw,
} from "lucide-react";

// ── Import all legacy static data ─────────────────────────────────────────────
import { questions as theoryRaw } from "@/data/questions";
import { outputQuestions } from "@/data/outputQuestions";
import { debugQuestions } from "@/data/debugQuestions";
import type { QuestionInput } from "@/types/question";

// ─── Tag → difficulty map ─────────────────────────────────────────────────────
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

// ─── Convert legacy questions to new Firestore schema ─────────────────────────

function buildTheoryQuestions(): QuestionInput[] {
  return theoryRaw.map((q, i) => ({
    slug: q.q
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60),
    type: "theory" as const,
    track: "javascript" as const,
    title: q.q,
    question: q.q,
    answer: q.answer, // will be stored as-is (HTML), renderer handles both)
    hint: q.hint ?? "",
    explanation: "",
    keyInsight: "",
    code: "",
    category: q.cat,
    tags: q.tags as string[],
    difficulty: tagToDifficulty(q.tags),
    status: "published" as const,
    isPro: i >= 5, // first 5 free, rest pro (matches existing FREE_LIMIT)
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
    track: "javascript" as const,
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
  }));
}

function buildDebugQuestions(): QuestionInput[] {
  return debugQuestions.map((q, i) => ({
    slug: `debug-${q.id}-${q.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40)}`,
    type: "debug" as const,
    track: "javascript" as const,
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
    expectedOutput: "",
    brokenCode: q.brokenCode,
    fixedCode: q.fixedCode,
    bugDescription: q.bugDescription,
  }));
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  page: css`
    max-width: 48rem;
  `,

  heading: css`
    font-size: 1.5rem;
    font-weight: 900;
    margin-bottom: 0.375rem;
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
    color: white;
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
    background: #050508;
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.xl};
    padding: 1rem 1.25rem;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    line-height: 1.8;
    max-height: 16rem;
    overflow-y: auto;
    margin-top: 1.5rem;
  `,

  logLine: (type: "info" | "success" | "error" | "warn") => {
    const colors = {
      info: C.muted,
      success: C.accent3,
      error: C.danger,
      warn: C.accent2,
    };
    return css`
      color: ${colors[type]};
    `;
  },

  warningBox: css`
    padding: 1rem 1.25rem;
    background: ${C.accent2}0f;
    border: 1px solid ${C.accent2}33;
    border-radius: ${RADIUS.xl};
    font-size: 0.875rem;
    color: ${C.accent2};
    margin-bottom: 1.5rem;
    line-height: 1.7;
  `,

  successBox: css`
    padding: 1rem 1.25rem;
    background: ${C.accent3}0f;
    border: 1px solid ${C.accent3}33;
    border-radius: ${RADIUS.xl};
    font-size: 0.9rem;
    color: ${C.accent3};
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

// ─── Log entry type ───────────────────────────────────────────────────────────

interface LogEntry {
  type: "info" | "success" | "error" | "warn";
  text: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SeedPage() {
  const { user } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [done, setDone] = useState<Record<string, number>>({});

  const theoryQs = buildTheoryQuestions();
  const outputQs = buildOutputQuestions();
  const debugQs = buildDebugQuestions();
  const totalQs = theoryQs.length + outputQs.length + debugQs.length;

  function addLog(type: LogEntry["type"], text: string) {
    setLog((prev) => [...prev, { type, text }]);
  }

  async function seedBatch(
    questions: QuestionInput[],
    label: string,
    color: string,
  ): Promise<number> {
    addLog("info", `Starting ${label}: ${questions.length} questions...`);
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
        `  ✓ ${label}: committed batch (${Math.min(i + BATCH_SIZE, questions.length)}/${questions.length})`,
      );
    }

    addLog("success", `✅ ${label} done — ${created} questions added`);
    setDone((prev) => ({ ...prev, [label]: created }));
    return created;
  }

  async function handleSeed() {
    if (!user) return;
    setSeeding(true);
    setLog([]);
    setDone({});

    try {
      addLog("info", `Starting full seed as ${user.email}...`);
      addLog("info", `Total to import: ${totalQs} questions`);
      addLog("info", "─────────────────────────────────");

      await seedBatch(theoryQs, "Theory", C.accent);
      await seedBatch(outputQs, "Output", C.accent2);
      await seedBatch(debugQs, "Debug", C.danger);

      addLog("info", "─────────────────────────────────");
      addLog(
        "success",
        `🎉 Seed complete! ${totalQs} questions are now in Firestore.`,
      );
      addLog(
        "warn",
        "Go to /admin/questions to verify. Then update Firestore indexes if queries fail.",
      );
    } catch (e: any) {
      addLog("error", `❌ Error: ${e.message}`);
    } finally {
      setSeeding(false);
    }
  }

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
          `  Deleted batch ${Math.min(i + BATCH_SIZE, snap.docs.length)}/${snap.docs.length}`,
        );
      }

      addLog("success", "✅ All questions deleted. Ready for a fresh seed.");
      setDone({});
    } catch (e: any) {
      addLog("error", `❌ Error: ${e.message}`);
    } finally {
      setClearing(false);
    }
  }

  const allDone = done["Theory"] && done["Output"] && done["Debug"];

  return (
    <div css={S.page}>
      <h1 css={S.heading}>Seed / Import Questions</h1>
      <p css={S.sub}>
        Migrate your existing static{" "}
        <code
          style={{
            background: C.surface,
            padding: "0.1rem 0.4rem",
            borderRadius: "0.25rem",
            fontSize: "0.8125rem",
            color: C.accent3,
          }}
        >
          .ts
        </code>{" "}
        question files into Firestore in one click. Run this once. After
        seeding, manage questions via the admin panel — no more code changes
        needed to add/edit questions.
      </p>

      {allDone && (
        <div css={S.successBox}>
          <CheckCircle2 size={18} />
          All {totalQs} questions successfully imported into Firestore!
        </div>
      )}

      {/* Data overview cards */}
      <div css={S.sectionTitle}>Data to import</div>
      <div css={S.grid}>
        {[
          {
            label: "Theory Questions",
            count: theoryQs.length,
            icon: BookOpen,
            color: C.accent,
            desc: "Core JS, Functions, Async, Objects…",
            key: "Theory",
          },
          {
            label: "Output Questions",
            count: outputQs.length,
            icon: Code2,
            color: C.accent2,
            desc: "Event loop, closures, type coercion…",
            key: "Output",
          },
          {
            label: "Debug Questions",
            count: debugQs.length,
            icon: Bug,
            color: C.danger,
            desc: "Async bugs, closure traps, fix the code…",
            key: "Debug",
          },
        ].map(({ label, count, icon: Icon, color, desc, key }) => (
          <div key={key} css={S.dataCard(color, !!done[key])}>
            <div css={S.dataIcon(color)}>
              <Icon size={16} color={color} />
            </div>
            <div css={S.dataTitle}>{label}</div>
            <div css={S.dataCount(color)}>{count}</div>
            <div css={S.dataMeta}>{desc}</div>
            {done[key] && (
              <div css={S.doneBadge(C.accent3)}>
                <CheckCircle2 size={9} /> Imported
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Warning */}
      <div css={S.warningBox}>
        ⚠️ <strong>Run this only once.</strong> If you run it again it will
        create duplicate questions. Use "Clear All" first if you need to
        re-seed.
      </div>

      {/* Seed button */}
      <div
        css={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          css={S.seedBtn(seeding)}
          onClick={handleSeed}
          disabled={seeding || clearing}
        >
          {seeding ? (
            <>
              <Loader2
                size={16}
                css={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Importing…
            </>
          ) : (
            <>
              <Database size={16} /> Import {totalQs} Questions to Firestore
            </>
          )}
        </button>

        <button
          css={S.dangerBtn}
          onClick={handleClearAll}
          disabled={seeding || clearing}
        >
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
          {seeding && (
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

      {/* Instructions */}
      <div css={S.sectionTitle}>After importing</div>
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
          In Firebase Console → Firestore → <strong>Indexes</strong>, create
          these composite indexes:
          <pre
            style={{
              background: "#0a0a10",
              border: `1px solid ${C.border}`,
              borderRadius: "0.5rem",
              padding: "0.75rem",
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: "#c8c8d8",
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
          — it should now load questions from Firestore.
        </li>
        <li>
          Your old{" "}
          <code style={{ color: C.accent3, fontSize: "0.8125rem" }}>
            src/data/questions.ts
          </code>{" "}
          is still imported here but no longer used by the app. You can keep it
          as a backup.
        </li>
      </ol>
    </div>
  );
}
