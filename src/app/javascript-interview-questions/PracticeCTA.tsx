"use client";

/**
 * PracticeCTA — smart per-question CTA.
 *
 * Navigation logic:
 *   questionSlug provided → always go to /q/[slug] (public question page)
 *   no slug → fallback: logged in → /dashboard, not logged in → /auth
 */

import { useAuth } from "@/hooks/useAuth";
import { C } from "@/styles/tokens";

interface Props {
  label?: string;
  questionSlug?: string;
  style?: React.CSSProperties;
}

export default function PracticeCTA({
  label = "Practice this question →",
  questionSlug,
  style,
}: Props) {
  const { user, loading } = useAuth();

  const href = questionSlug
    ? `/q/${questionSlug}`
    : !loading && user
      ? "/dashboard"
      : "/auth";

  return (
    <a
      href={href}
      style={{
        fontSize: "0.75rem",
        color: C.accentText,
        background: C.accentSubtle,
        border: `1px solid ${C.border}`,
        padding: "0.25rem 0.75rem",
        borderRadius: "0.375rem",
        textDecoration: "none",
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        transition: "border-color 0.12s ease",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.accent)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
    >
      {label}
    </a>
  );
}
