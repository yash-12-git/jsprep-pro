"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getQuestions } from "@/lib/questions";
import { useUserProgress } from "@/hooks/useQuestions";
import type { Question } from "@/types/question";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import { FileDown, Printer, Lock, Sparkles } from "lucide-react";

export default function CheatSheetPage() {
  const { user, progress, loading } = useAuth();
  const { masteredIds: masteredSubIds } = useUserProgress({
    uid: user?.uid ?? null,
  });
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [includeAll, setIncludeAll] = useState(false);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  useEffect(() => {
    getQuestions({
      filters: { status: "published", type: "theory" },
      pageSize: 500,
    })
      .then(({ questions: qs }) => setAllQuestions(qs))
      .catch(() => {});
  }, []);

  if (loading || !user || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!progress.isPro) {
    return (
      <>
        <PaywallBanner reason="Cheat Sheet Generator is a Pro feature. Upgrade to generate a printable PDF of all your mastered concepts!" />
      </>
    );
  }

  const masteredQs = allQuestions.filter((q) =>
    includeAll ? true : masteredSubIds.includes(q.id),
  );

  function handlePrint() {
    window.print();
  }

  const byCategory: Record<string, Question[]> = {};
  masteredQs.forEach((q) => {
    if (!byCategory[q.category]) byCategory[q.category] = [];
    byCategory[q.category].push(q);
  });

  return (
    <>
      {/* Screen UI - hidden on print */}
      <div className="print:hidden">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent2/20 rounded-xl flex items-center justify-center">
              <FileDown size={20} className="text-accent2" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Cheat Sheet Generator</h1>
              <p className="text-muted text-sm">
                Auto-generates a printable 1-page PDF of your mastered concepts
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-black mb-1">What to include?</h2>
                <p className="text-muted text-sm">
                  {includeAll
                    ? `All ${allQuestions.length} questions`
                    : `${masteredSubIds.length} mastered questions`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIncludeAll(false)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${!includeAll ? "bg-accent border-accent text-white" : "border-border text-muted"}`}
                >
                  Mastered Only
                </button>
                <button
                  onClick={() => setIncludeAll(true)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${includeAll ? "bg-accent border-accent text-white" : "border-border text-muted"}`}
                >
                  All Questions
                </button>
              </div>
            </div>

            {masteredSubIds.length === 0 && !includeAll && (
              <div className="bg-accent2/10 border border-accent2/20 rounded-xl p-4 mb-4 text-sm text-accent2">
                ⚠️ You haven't mastered any questions yet. Switch to "All
                Questions" or go mark some questions as mastered first.
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                disabled={masteredQs.length === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-accent2 hover:bg-accent2/90 disabled:opacity-40 text-black font-black py-3.5 rounded-xl transition-colors"
              >
                <Printer size={18} />
                Print / Save as PDF
              </button>
            </div>
            <p className="text-muted text-xs text-center mt-3">
              In the print dialog, select "Save as PDF" to download. Works in
              Chrome, Safari, and Firefox.
            </p>
          </div>

          {/* Preview */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-accent2" />
              <h2 className="font-bold text-sm">Preview</h2>
              <span className="text-muted text-xs">
                ({masteredQs.length} questions, {Object.keys(byCategory).length}{" "}
                categories)
              </span>
            </div>
            <div className="bg-white rounded-xl p-5 text-black max-h-96 overflow-y-auto text-xs">
              <div className="text-center mb-4 border-b border-gray-200 pb-3">
                <h1 className="text-lg font-black text-gray-900">
                  JavaScript Interview Cheat Sheet
                </h1>
                <p className="text-gray-500 text-xs">
                  {user.displayName} · Generated{" "}
                  {new Date().toLocaleDateString()} · JSPrep Pro
                </p>
              </div>
              {Object.entries(byCategory).map(([cat, qs]) => (
                <div key={cat} className="mb-4">
                  <h2 className="font-black text-purple-700 text-sm border-b border-purple-200 pb-1 mb-2">
                    {cat}
                  </h2>
                  {qs.map((q) => (
                    <div key={q.id} className="mb-3">
                      <p className="font-bold text-gray-800 mb-0.5">
                        Q: {q.title}
                      </p>
                      {q.hint && (
                        <p className="text-gray-500 italic text-[10px] mb-0.5">
                          💡 {q.hint}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRINT LAYOUT - only visible when printing */}
      <div ref={printRef} className="hidden print:block">
        <style>{`
          @media print {
            @page { margin: 15mm; size: A4; }
            body { font-family: -apple-system, sans-serif; color: #000; background: white; }
            .print-header { text-align: center; border-bottom: 2px solid #7c6af7; padding-bottom: 10px; margin-bottom: 16px; }
            .print-header h1 { font-size: 22px; font-weight: 900; color: #1a1a2e; margin: 0 0 4px; }
            .print-header p { font-size: 10px; color: #666; margin: 0; }
            .cat-header { font-size: 13px; font-weight: 900; color: #7c6af7; border-bottom: 1px solid #e5e5ff; padding-bottom: 4px; margin: 14px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }
            .q-item { margin-bottom: 10px; padding: 8px 10px; background: #f9f9ff; border-left: 3px solid #7c6af7; border-radius: 0 6px 6px 0; page-break-inside: avoid; }
            .q-text { font-size: 11px; font-weight: 700; color: #1a1a2e; margin: 0 0 2px; }
            .q-hint { font-size: 9px; color: #888; font-style: italic; margin: 0 0 3px; }
            .q-answer { font-size: 10px; color: #333; line-height: 1.5; margin: 4px 0 0; }
            .q-answer code { background: #f0f0ff; padding: 1px 3px; border-radius: 2px; font-family: monospace; font-size: 9px; }
            .tag { display: inline-block; font-size: 8px; padding: 1px 5px; border-radius: 3px; font-weight: 700; margin-right: 4px; background: #e8e4ff; color: #7c6af7; }
            .footer { margin-top: 20px; text-align: center; font-size: 9px; color: #aaa; border-top: 1px solid #eee; padding-top: 8px; }
            pre { background: #f5f5f5; padding: 6px 8px; border-radius: 4px; font-size: 8.5px; overflow: visible; white-space: pre-wrap; word-break: break-all; }
          }
        `}</style>

        <div className="print-header">
          <h1>JavaScript Interview Cheat Sheet</h1>
          <p>
            {user.displayName} · {user.email} · Generated{" "}
            {new Date().toLocaleDateString("en-IN")} · JSPrep Pro
          </p>
        </div>

        {Object.entries(byCategory).map(([cat, qs]) => (
          <div key={cat}>
            <div className="cat-header">{cat}</div>
            {qs.map((q) => (
              <div key={q.id} className="q-item">
                <p className="q-text">Q: {q.title}</p>
                {q.hint && <p className="q-hint">💡 Hint: {q.hint}</p>}
                <div className="q-tags" style={{ marginBottom: "4px" }}>
                  {q.tags.map((t) => (
                    <span key={t} className="tag">
                      {t.toUpperCase()}
                    </span>
                  ))}
                </div>
                <div
                  className="q-answer"
                  dangerouslySetInnerHTML={{
                    __html:
                      q.answer ??
                      ""
                        .replace(/<pre><code>/g, "<pre>")
                        .replace(/<\/code><\/pre>/g, "</pre>")
                        .replace(
                          /<div class="tip">/g,
                          '<div style="background:#f0fff4;border-left:2px solid #6af7a0;padding:4px 6px;border-radius:0 4px 4px 0;margin-top:4px;font-size:9px;color:#333">',
                        ),
                  }}
                />
              </div>
            ))}
          </div>
        ))}

        <div className="footer">
          JSPrep Pro — JavaScript Interview Mastery · jsprep-pro.vercel.app
        </div>
      </div>
    </>
  );
}
