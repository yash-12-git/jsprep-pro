"use client";

/**
 * src/app/javascript-interview-questions/QuestionList.tsx
 *
 * Client component — loads questions via useQuestions (client-side Firebase SDK).
 * The parent page.tsx is a server component and cannot call getQuestions directly.
 */

import { useState } from "react";
import Link from "next/link";
import type { Question } from "@/types/question";

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuestionListClientWrapper({
  questions,
  categories,
}: {
  questions: Question[];
  categories: string[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  

  // Return null — parent renders static fallback
  if (!questions.length) return null;

  // Company counts
  const companyCounts: Record<string, number> = {};
  questions.forEach((q) => {
    (((q as any).companies as string[]) ?? []).forEach((c: string) => {
      companyCounts[c] = (companyCounts[c] ?? 0) + 1;
    });
  });

  const byCategory = questions.reduce<Record<string, Question[]>>((acc, q) => {
    const cat = q.category ?? "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(q);
    return acc;
  }, {});

  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name]) => name);

  return (
    <>
      {/* Live stats */}
      <div className="doc-figures">
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
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Companies banner */}
      {topCompanies.length > 0 && (
        <div className="doc-meta" style={{ marginBlock: "var(--space-lg)" }}>
          <span>Asked at:</span>
          {topCompanies.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Category sections */}
      <section className="doc-section">
        <div className="doc-head">
          <h2 className="doc-h2">All Questions by Category</h2>
        </div>

        {categories.map((cat) => {
          const qs = byCategory[cat];
          const isExpanded = expanded === cat;
          const visible = isExpanded ? qs : qs.slice(0, 6);

          return (
            <div key={cat} className="q-group">
              <div className="q-group__head">
                <h3 className="doc-h3">{cat}</h3>
                <span className="measured">{qs.length}</span>
              </div>

              <div className="q-list">
                {visible.map((q) => {
                  const companies = (q as any).companies as string[] | undefined;
                  return (
                    <Link key={q.id} href={`/q/${q.slug}`} className="q-row">
                      <span className="chip">{q.difficulty}</span>
                      <span className="q-row__title">{q.title}</span>
                      {companies &&
                        companies.slice(0, 2).map((c) => (
                          <span key={c} className="chip">
                            {c}
                          </span>
                        ))}
                      {(q.type === "output" || q.type === "debug") && (
                        <span className="chip chip--cool">{q.type}</span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {qs.length > 6 && (
                <button
                  type="button"
                  className="q-more"
                  onClick={() => setExpanded(isExpanded ? null : cat)}
                >
                  {isExpanded
                    ? "Show less"
                    : `${qs.length - 6} more in ${cat}`}
                </button>
              )}
            </div>
          );
        })}
      </section>
    </>
  );
}
