"use client";

/**
 * src/app/javascript-interview-questions/QuestionList.tsx
 *
 * Client component — loads questions via useQuestions (client-side Firebase SDK).
 * The parent page.tsx is a server component and cannot call getQuestions directly.
 */

import { useState } from "react";
import Link from "next/link";
import { useQuestions } from "@/hooks/useQuestions";
import type { Question } from "@/types/question";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function diffBg(d: string) {
  return d === "beginner"
    ? "#f0fff4"
    : d === "core"
      ? "#e8f4fd"
      : d === "advanced"
        ? "#fffbeb"
        : "#fff5f5";
}
function diffColor(d: string) {
  return d === "beginner"
    ? "#2d7a4f"
    : d === "core"
      ? "#2383e2"
      : d === "advanced"
        ? "#d97706"
        : "#c53030";
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.625rem",
  padding: "0.625rem 0.875rem",
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.5rem",
  textDecoration: "none",
};

function TypeBadge({ type }: { type: string }) {
  const color = type === "output" ? "#2383e2" : "#e53e3e";
  return (
    <span
      style={{
        fontSize: "10px",
        padding: "1px 6px",
        borderRadius: "4px",
        background: color + "14",
        border: `1px solid ${color}33`,
        color,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {type}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuestionList() {
  const { questions, loading } = useQuestions({
    track: "javascript",
    enabled: true,
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) {
    return (
      <div
        style={{
          padding: "1.5rem 0",
          color: "var(--color-muted)",
          fontSize: "0.875rem",
        }}
      >
        Loading questions…
      </div>
    );
  }

  // Return null — parent renders static fallback
  if (!questions.length) return null;

  // Group by category
  const byCategory = questions.reduce<Record<string, Question[]>>((acc, q) => {
    const cat = q.category ?? "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(q);
    return acc;
  }, {});
  const categories = Object.keys(byCategory).sort();

  // Company counts
  const companyCounts: Record<string, number> = {};
  questions.forEach((q) => {
    (((q as any).companies as string[]) ?? []).forEach((c: string) => {
      companyCounts[c] = (companyCounts[c] ?? 0) + 1;
    });
  });
  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name]) => name);

  return (
    <>
      {/* Live stats */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { label: "Questions", value: `${questions.length}+` },
          { label: "Categories", value: `${categories.length}` },
          {
            label: "Companies",
            value: `${Object.keys(companyCounts).length}+`,
          },
          {
            label: "With Code",
            value: `${questions.filter((q) => q.type === "output" || q.type === "debug").length}+`,
          },
        ].map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontSize: "1.375rem",
                fontWeight: 900,
                color: "var(--color-accent)",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--color-muted)",
                fontWeight: 500,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Companies banner */}
      {topCompanies.length > 0 && (
        <div
          style={{
            padding: "0.875rem 1.125rem",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.75rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--color-muted)",
              whiteSpace: "nowrap",
            }}
          >
            🏢 Asked at:
          </span>
          {topCompanies.map((c) => (
            <span
              key={c}
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                padding: "0.25rem 0.75rem",
                background: "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
                borderRadius: "9999px",
                color: "var(--color-text)",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Category sections */}
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 900,
          color: "var(--color-text)",
          marginBottom: "1.25rem",
          paddingBottom: "0.625rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        All Questions by Category
      </h2>

      {categories.map((cat) => {
        const qs = byCategory[cat];
        const isExpanded = expanded === cat;
        const visible = isExpanded ? qs : qs.slice(0, 6);

        return (
          <div key={cat} style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "var(--color-text)",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {cat}
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  background: "var(--color-bg-subtle)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "9999px",
                  padding: "0.125rem 0.5rem",
                  color: "var(--color-muted)",
                }}
              >
                {qs.length}
              </span>
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
              }}
            >
              {visible.map((q) => {
                const companies = (q as any).companies as string[] | undefined;
                return (
                  <Link
                    key={q.id}
                    href={`/q/${q.slug}`}
                    style={rowStyle}
                  >
                    <span
                      style={{
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        padding: "0.125rem 0.4rem",
                        borderRadius: "4px",
                        background: diffBg(q.difficulty),
                        color: diffColor(q.difficulty),
                        flexShrink: 0,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {q.difficulty}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "var(--color-text)",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      {q.title}
                    </span>
                    {companies && companies.length > 0 && (
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        {companies.slice(0, 2).map((c) => (
                          <span
                            key={c}
                            style={{
                              fontSize: "10px",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              background: "var(--color-bg-subtle)",
                              border: "1px solid var(--color-border)",
                              color: "var(--color-muted)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                    {(q.type === "output" || q.type === "debug") && (
                      <TypeBadge type={q.type} />
                    )}
                  </Link>
                );
              })}
            </div>

            {qs.length > 6 && (
              <button
                onClick={() => setExpanded(isExpanded ? null : cat)}
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.8125rem",
                  color: "var(--color-accent)",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.375rem 0",
                }}
              >
                {isExpanded
                  ? "▲ Show less"
                  : `+ ${qs.length - 6} more in ${cat}`}
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}
