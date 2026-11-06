"use client";

/**
 * PracticeCTA — smart per-question CTA.
 *
 * Navigation logic:
 *   questionSlug provided → always go to /q/[slug] (public question page)
 *   no slug → fallback: logged in → /dashboard, not logged in → /auth
 */

import { useAuth } from "@/hooks/useAuth";

interface Props {
  label?: string;
  questionSlug?: string;
  style?: React.CSSProperties;
}

export default function PracticeCTA({
  label = "Practice this question",
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
    <a href={href} className="btn btn--small" style={style}>
      {label}
    </a>
  );
}
