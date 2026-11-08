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

  const byCategory = questions.reduce<Record<string, Question[]>>((acc, q) => {
    const cat = q.category ?? "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(q);
    return acc;
  }, {});

  return (
    <>
      {/* Live stats */}
      <div className="doc-figures doc-figures--3">
        {[
          { label: "Questions", value: `${questions.length}+` },
          { label: "Categories", value: `${categories.length}` },
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
                  return (
                    <Link key={q.id} href={`/q/${q.slug}`} className="q-row">
                      <span className="chip">{q.difficulty}</span>
                      <span className="q-row__title">{q.title}</span>
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
