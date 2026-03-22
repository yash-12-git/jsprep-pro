"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getQuestion, updateQuestion, deleteQuestion } from "@/lib/questions";
import { C } from "@/styles/tokens";
import type { Question, QuestionInput } from "@/types/question";
import QuestionForm from "../../components/QuestionForm";

interface Props {
  params: { id: string };
}

export default function EditQuestionPage({ params }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuestion(params.id)
      .then((q) => {
        if (!q) setNotFound(true);
        else setQuestion(q);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleSubmit(data: QuestionInput) {
    await updateQuestion(params.id, data);
    // Stay on the page — user may want to keep editing
  }

  async function handleDelete() {
    await deleteQuestion(params.id);
    router.push("/admin/questions");
  }

  if (loading) {
    return (
      <div
        style={{
          padding: "4rem 1rem",
          textAlign: "center",
          color: C.muted,
          fontSize: "0.875rem",
        }}
      >
        Loading…
      </div>
    );
  }

  if (notFound) {
    return (
      <div
        style={{ padding: "4rem 1rem", textAlign: "center", color: C.muted }}
      >
        Question not found.{" "}
        <Link href="/admin/questions" style={{ color: C.accent }}>
          Back to all questions
        </Link>
      </div>
    );
  }

  // Build the initial form data — spread question so all fields (incl. polyfill ones) are passed through
  const initial: Partial<Question> = question ?? {};

  return (
    <div style={{ maxWidth: "60rem" }}>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.75rem",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/admin/questions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            color: C.muted,
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          <ArrowLeft size={15} /> All Questions
        </Link>
        <span style={{ color: C.border }}>/</span>
        <span style={{ fontSize: "0.875rem", color: C.muted }}>
          {question?.type && (
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "0.125rem 0.5rem",
                borderRadius: "9999px",
                background: TYPE_BG[question.type] ?? "#f0f0f0",
                color: TYPE_COLOR[question.type] ?? "#666",
                marginRight: "0.5rem",
              }}
            >
              {question.type}
            </span>
          )}
        </span>
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: 900,
            color: C.text,
            flex: 1,
          }}
        >
          {question?.title ?? "Edit Question"}
        </h1>
      </div>

      <QuestionForm
        mode="edit"
        initial={initial}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}

// ─── Type badge colours ───────────────────────────────────────────────────────
const TYPE_COLOR: Record<string, string> = {
  theory: "#2383e2",
  output: "#d97706",
  debug: "#c53030",
  polyfill: "#2d7a4f",
};
const TYPE_BG: Record<string, string> = {
  theory: "#e8f4fd",
  output: "#fffbeb",
  debug: "#fff5f5",
  polyfill: "#f0fff4",
};
