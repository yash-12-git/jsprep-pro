"use client";

/**
 * src/app/admin/generate/page.tsx
 *
 * Admin question generation pipeline UI.
 *
 * Left panel:  Generation config (type, category, difficulty, topic, count)
 * Center:      Generated candidates with similarity scores + preview
 * Right panel: Approve / Reject buttons → writes to Firestore on approve
 *
 * Also shows the `questions_pending` queue from cron jobs.
 */

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Zap,
  AlertTriangle,
  Eye,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { useTrack } from "@/contexts/TrackContext";
import { Track } from "@/lib/tracks";
import { types } from "util";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Candidate {
  question: Record<string, any>;
  embedding: number[];
  isDuplicate: boolean;
  duplicateOf: { id: string; title: string; score: number } | null;
  topSimilar: { id: string; title: string; score: number }[];
  similarityScore: number;
  error?: string;
}

interface PendingQuestion {
  id: string;
  title: string;
  type: string;
  category: string;
  difficulty: string;
  status: "pending" | "approved" | "rejected";
  similarityScore: number;
  topSimilar: { title: string; score: number }[];
  generatedAt: any;
  generatedTopic: string;
  [key: string]: any;
}

// ─── Config options ───────────────────────────────────────────────────────────

const THEORY_CATEGORIES: Partial<Record<Track, string[]>> = {
  javascript: [
    "Core JS",
    "Functions",
    "Async JS",
    "Objects",
    "Arrays",
    "'this' Keyword",
    "Error Handling",
    "Modern JS",
    "Performance",
    "DOM & Events",
  ],
  react: [
    "React Fundamentals",
    "Hooks",
    "State Management",
    "Component Patterns",
    "Performance",
    "React Router",
    "Forms",
    "Advanced Patterns",
    "Concurrent React",
    "Server Components",
    "Testing",
    "Ecosystem",
  ],
  typescript: [],
  "system-design": [],
};

const OUTPUT_CATEGORIES: Partial<Record<Track, string[]>> = {
  javascript: [
    "Event Loop & Promises",
    "Closures & Scope",
    "'this' Binding",
    "Hoisting",
    "Type Coercion",
  ],
  react: [
    "Hooks & Closures",
    "State & Immutability",
    "Event Loop & Batching",
    "Memoization & Identity",
    "Component Patterns",
    "Context & Composition",
    "Async in React",
    "Refs & Side Effects",
  ],
  typescript: [],
  "system-design": [],
};

const DEBUG_CATEGORIES: Partial<Record<Track, string[]>> = {
  javascript: [
    "Async Bugs",
    "Closure Traps",
    "Event Loop Traps",
    "Fix the Code",
    "What's Wrong?",
  ],
  react: [
    "Stale Closures",
    "State & Immutability",
    "Hook Patterns",
    "Memoization",
    "Async & Effects",
    "Component Logic",
    "Performance",
  ],
  typescript: [],
  "system-design": [],
};

const TYPE_OPTIONS = ["theory", "output", "debug"];
const CATEGORY_OPTIONS = (track: Track) => ({
  theory: THEORY_CATEGORIES[track] ?? THEORY_CATEGORIES.javascript ?? [],
  output: OUTPUT_CATEGORIES[track] ?? OUTPUT_CATEGORIES.javascript ?? [],
  debug: DEBUG_CATEGORIES[track] ?? DEBUG_CATEGORIES.javascript ?? [],
});


const DIFFICULTY_OPTIONS = ["beginner", "core", "advanced", "expert"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SimilarityBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const col = pct >= 85 ? "#f76a6a" : pct >= 60 ? "#f7c76a" : "#6af7c0";
  return (
    <span
      style={{
        fontSize: "0.7rem",
        fontWeight: 800,
        padding: "2px 8px",
        borderRadius: 12,
        background: `${col}18`,
        color: col,
        border: `1px solid ${col}30`,
      }}
    >
      {pct}% similar
    </span>
  );
}

function CandidateCard({
  candidate,
  onApprove,
  onReject,
  approving,
}: {
  candidate: Candidate;
  onApprove: (c: Candidate) => void;
  onReject: () => void;
  approving: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const q = candidate.question;

  if (candidate.error) {
    return (
      <div
        style={{
          padding: "1rem",
          background: "rgba(247,106,106,0.06)",
          border: "1px solid rgba(247,106,106,0.2)",
          borderRadius: "0.875rem",
          fontSize: "0.85rem",
          color: "#f76a6a",
        }}
      >
        ⚠ Generation failed: {candidate.error}
      </div>
    );
  }

  return (
    <div
      style={{
        background: candidate.isDuplicate
          ? "rgba(247,106,106,0.04)"
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${candidate.isDuplicate ? "rgba(247,106,106,0.2)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <div
        style={{
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                textTransform: "uppercase",
                padding: "2px 8px",
                borderRadius: 8,
                background:
                  q.type === "theory"
                    ? "rgba(196,181,253,0.15)"
                    : q.type === "output"
                      ? "rgba(106,247,192,0.15)"
                      : "rgba(247,106,106,0.15)",
                color:
                  q.type === "theory"
                    ? "#c4b5fd"
                    : q.type === "output"
                      ? "#6af7c0"
                      : "#f76a6a",
              }}
            >
              {q.type}
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                padding: "2px 8px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
              }}
            >
              {q.difficulty}
            </span>
            <SimilarityBadge score={candidate.similarityScore} />
            {candidate.isDuplicate && (
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  color: "#f76a6a",
                  background: "rgba(247,106,106,0.12)",
                  padding: "2px 8px",
                  borderRadius: 8,
                }}
              >
                ⛔ DUPLICATE
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "white",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {q.title}
          </p>
          {candidate.isDuplicate && candidate.duplicateOf && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#f7c76a",
                marginTop: "0.375rem",
              }}
            >
              Similar to: "{candidate.duplicateOf.title}" (
              {Math.round(candidate.duplicateOf.score * 100)}% match)
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              padding: "0.4rem 0.75rem",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.5rem",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <Eye size={12} /> {expanded ? "Hide" : "Preview"}
          </button>
          {!candidate.isDuplicate && (
            <button
              onClick={() => onApprove(candidate)}
              disabled={approving}
              style={{
                padding: "0.4rem 0.875rem",
                background: "rgba(106,247,192,0.12)",
                border: "1px solid rgba(106,247,192,0.25)",
                borderRadius: "0.5rem",
                color: "#6af7c0",
                cursor: approving ? "not-allowed" : "pointer",
                fontSize: "0.75rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                opacity: approving ? 0.5 : 1,
              }}
            >
              <CheckCircle size={12} /> {approving ? "Saving…" : "Approve"}
            </button>
          )}
          <button
            onClick={onReject}
            style={{
              padding: "0.4rem 0.875rem",
              background: "rgba(247,106,106,0.1)",
              border: "1px solid rgba(247,106,106,0.2)",
              borderRadius: "0.5rem",
              color: "#f76a6a",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <XCircle size={12} /> Reject
          </button>
        </div>
      </div>

      {/* Expanded preview */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "1rem 1.25rem",
            fontSize: "0.8rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {q.code && (
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "0.375rem",
                }}
              >
                Code
              </div>
              <pre
                style={{
                  background: "#0a0a14",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  color: "#c8d8e8",
                  overflow: "auto",
                  margin: 0,
                }}
              >
                {q.code || q.brokenCode}
              </pre>
            </div>
          )}
          {q.answer && (
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "0.375rem",
                }}
              >
                Answer
              </div>
              <div
                style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: q.answer }}
              />
            </div>
          )}
          {q.expectedOutput && (
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#6af7c0",
                  marginBottom: "0.375rem",
                }}
              >
                Expected Output
              </div>
              <pre
                style={{
                  background: "rgba(106,247,192,0.05)",
                  border: "1px solid rgba(106,247,192,0.15)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  fontFamily: "monospace",
                  color: "#6af7c0",
                  margin: 0,
                }}
              >
                {q.expectedOutput}
              </pre>
            </div>
          )}
          {q.bugDescription && (
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#f76a6a",
                  marginBottom: "0.375rem",
                }}
              >
                Bug
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>
                {q.bugDescription}
              </p>
            </div>
          )}
          {q.explanation && (
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "0.375rem",
                }}
              >
                Explanation
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", margin: 0 }}>
                {q.explanation}
              </p>
            </div>
          )}
          {candidate.topSimilar.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "0.375rem",
                }}
              >
                Top Similar in DB
              </div>
              {candidate.topSimilar.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.45)",
                    padding: "0.2rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <span>{s.title}</span>
                  <SimilarityBadge score={s.score} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Slug generator ───────────────────────────────────────────────────────────

function generateSlug(title: string, type: string): string {
  const prefix = type === "output" ? "output" : type === "debug" ? "debug" : "";
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return prefix ? `${prefix}-${base}` : base;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminGeneratePage() {
  const { user, progress } = useAuth();
  const { track } = useTrack();

  // Generation config
  const [type, setType] = useState("theory");
  const [category, setCategory] = useState("Async JS");
  const [difficulty, setDifficulty] = useState("core");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(3);

  // State
  const [generating, setGenerating] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [approvingIdx, setApprovingIdx] = useState<number | null>(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [error, setError] = useState("");
  const [pendingQueue, setPendingQueue] = useState<PendingQuestion[]>([]);
  const [showPending, setShowPending] = useState(false);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    if (type in CATEGORY_OPTIONS(track)) {
      setCategory((CATEGORY_OPTIONS(track) as any)[type][0]);
    }
  }, [type]);

  async function generate() {
    if (!topic.trim()) {
      setError("Enter a topic or concept to generate questions about");
      return;
    }
    setError("");
    setGenerating(true);
    setCandidates([]);
    setApprovedCount(0);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, category, difficulty, topic, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCandidates(data.candidates ?? []);
      setMeta(data.meta);
    } catch (err: any) {
      setError(err.message ?? "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function approveCandidateAt(idx: number) {
    const candidate = candidates[idx];
    if (!candidate || !candidate.question) return;
    setApprovingIdx(idx);

    try {
      const q = candidate.question;
      const slug = q.slug || generateSlug(q.title ?? "", q.type ?? "theory");
      await addDoc(collection(db, "questions"), {
        ...q,
        slug,
        embedding: candidate.embedding,
        status: "published",
        isPro: true,
        order: 9000 + (Date.now() % 10000),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        viewCount: 0,
        solveCount: 0,
        track: track,
      });
      setCandidates((prev) => prev.filter((_, i) => i !== idx));
      setApprovedCount((n) => n + 1);
    } catch (err: any) {
      setError(`Approve failed: ${err.message}`);
    } finally {
      setApprovingIdx(null);
    }
  }

  function rejectCandidateAt(idx: number) {
    setCandidates((prev) => prev.filter((_, i) => i !== idx));
  }

  async function loadPendingQueue() {
    try {
      // No orderBy — avoids needing a composite index. Sort in JS instead.
      const snap = await getDocs(
        query(
          collection(db, "questions_pending"),
          where("status", "==", "pending"),
        ),
      );
      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as PendingQuestion)
        .sort((a, b) => {
          const aTime = a.generatedAt?.seconds ?? 0;
          const bTime = b.generatedAt?.seconds ?? 0;
          return bTime - aTime;
        });
      setPendingQueue(items);
      setShowPending(true);
    } catch (err: any) {
      setError(`Failed to load cron queue: ${err.message}`);
    }
  }

  async function approvePending(item: PendingQuestion) {
    const slug =
      (item.slug as string) ||
      generateSlug(item.title ?? "", item.type ?? "theory");
    await addDoc(collection(db, "questions"), {
      ...item,
      id: undefined,
      slug,
      status: "published",
      isPro: true,
      order: 9000 + (Date.now() % 10000),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    await updateDoc(doc(db, "questions_pending", item.id), {
      status: "approved",
      reviewedAt: Timestamp.now(),
    });
    setPendingQueue((prev) => prev.filter((q) => q.id !== item.id));
  }

  async function rejectPending(item: PendingQuestion) {
    await updateDoc(doc(db, "questions_pending", item.id), {
      status: "rejected",
      reviewedAt: Timestamp.now(),
    });
    setPendingQueue((prev) => prev.filter((q) => q.id !== item.id));
  }

  if (!progress?.isAdmin) {
    return (
      <div
        style={{
          padding: "2rem",
          color: "rgba(255,255,255,0.4)",
          textAlign: "center",
        }}
      >
        Admin only
      </div>
    );
  }

  const cats = (CATEGORY_OPTIONS(track) as any)[type] ?? [];

  return (
    <div
      style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "2rem 1.25rem 5rem",
        color: "#c8c8d8",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "white",
            marginBottom: "0.375rem",
            letterSpacing: "-0.02em",
          }}
        >
          ⚡ Question Generator
        </h1>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>
          AI generates questions → dedup check → preview → approve to publish
        </p>
      </div>

      {/* ── Config panel ── */}
      <div
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <label style={labelStyle}>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={selectStyle}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={selectStyle}
            >
              {cats.map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={selectStyle}
            >
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Count</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              style={selectStyle}
            >
              {[1, 2, 3, 5].map((n) => (
                <option key={n} value={n}>
                  {n} question{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Topic / Concept</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Promise.allSettled vs Promise.all, closure in async callbacks..."
            onKeyDown={(e) => e.key === "Enter" && generate()}
            style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
          />
        </div>

        {error && (
          <div
            style={{
              fontSize: "0.8rem",
              color: "#f76a6a",
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <AlertTriangle size={13} />
            {error}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={generate}
            disabled={generating}
            style={generateBtnStyle(generating)}
          >
            {generating ? (
              <>
                <RefreshCw
                  size={14}
                  style={{ animation: "spin 1s linear infinite" }}
                />{" "}
                Generating…
              </>
            ) : (
              <>
                <Zap size={14} /> Generate Questions
              </>
            )}
          </button>
          <button onClick={loadPendingQueue} style={secondaryBtnStyle}>
            <Clock size={13} /> Cron Queue{" "}
            {pendingQueue.length > 0 && `(${pendingQueue.length})`}
          </button>
          {approvedCount > 0 && (
            <span
              style={{ fontSize: "0.8rem", color: "#6af7c0", fontWeight: 700 }}
            >
              ✓ {approvedCount} approved this session
            </span>
          )}
        </div>

        {meta && (
          <div
            style={{
              marginTop: "0.75rem",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Context: {meta.existingCount} existing questions,{" "}
            {meta.withEmbeddings} with embeddings, RAG:{" "}
            {meta.ragContextUsed ? "yes" : "no"}
          </div>
        )}
      </div>

      {/* ── Generated candidates ── */}
      {candidates.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: "0.875rem",
            }}
          >
            Generated — {candidates.length} candidate
            {candidates.length > 1 ? "s" : ""}
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {candidates.map((c, i) => (
              <CandidateCard
                key={i}
                candidate={c}
                onApprove={() => approveCandidateAt(i)}
                onReject={() => rejectCandidateAt(i)}
                approving={approvingIdx === i}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Cron pending queue ── */}
      {showPending && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.875rem",
            }}
          >
            <h2
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Cron Pending Queue — {pendingQueue.length} waiting
            </h2>
            <button
              onClick={() => setShowPending(false)}
              style={secondaryBtnStyle}
            >
              Hide
            </button>
          </div>
          {pendingQueue.length === 0 ? (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "rgba(255,255,255,0.25)",
                fontSize: "0.875rem",
              }}
            >
              No pending questions — cron hasn't run yet or all reviewed.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {pendingQueue.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "1rem",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        marginBottom: "0.375rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.35)",
                          background: "rgba(255,255,255,0.06)",
                          padding: "2px 8px",
                          borderRadius: 8,
                        }}
                      >
                        {item.type}
                      </span>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.35)",
                          background: "rgba(255,255,255,0.06)",
                          padding: "2px 8px",
                          borderRadius: 8,
                        }}
                      >
                        {item.difficulty}
                      </span>
                      <SimilarityBadge score={item.similarityScore} />
                    </div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "white",
                        margin: "0 0 0.25rem",
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.35)",
                        margin: 0,
                      }}
                    >
                      Topic: {item.generatedTopic} · {item.category}
                    </p>
                  </div>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}
                  >
                    <button
                      onClick={() => approvePending(item)}
                      style={{
                        padding: "0.4rem 0.875rem",
                        background: "rgba(106,247,192,0.12)",
                        border: "1px solid rgba(106,247,192,0.25)",
                        borderRadius: "0.5rem",
                        color: "#6af7c0",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => rejectPending(item)}
                      style={{
                        padding: "0.4rem 0.875rem",
                        background: "rgba(247,106,106,0.1)",
                        border: "1px solid rgba(247,106,106,0.2)",
                        borderRadius: "0.5rem",
                        color: "#f76a6a",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── Style constants ──────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "rgba(255,255,255,0.35)",
  marginBottom: "0.375rem",
};
const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5625rem 0.75rem",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.625rem",
  color: "white",
  fontSize: "0.875rem",
  outline: "none",
  cursor: "pointer",
};
const generateBtnStyle = (loading: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.6875rem 1.25rem",
  background: "linear-gradient(135deg, #7c6af7, #a78bfa)",
  border: "none",
  borderRadius: "0.75rem",
  color: "white",
  fontSize: "0.875rem",
  fontWeight: 800,
  cursor: loading ? "not-allowed" : "pointer",
  opacity: loading ? 0.7 : 1,
});
const secondaryBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.6875rem 1rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.75rem",
  color: "rgba(255,255,255,0.6)",
  fontSize: "0.8rem",
  fontWeight: 700,
  cursor: "pointer",
};
