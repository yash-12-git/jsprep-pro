"use client";
/**
 * SEOHeroCTA — auth-aware CTA button for SEO pages.
 * Replaces the 3 duplicate HeroCTA.tsx files across:
 *   /javascript-interview-questions, /javascript-output-questions, /javascript-tricky-questions
 */

import { useAuth } from "@/hooks/useAuth";
import { C, RADIUS } from "@/styles/tokens";

interface Props {
  loggedInHref?: string;
  loggedInLabel?: string;
  loggedOutHref?: string;
  loggedOutLabel?: string;
  /** Override accent colour — defaults to C.accent (Notion blue) */
  bg?: string;
  color?: string;
  style?: React.CSSProperties;
}

export default function SEOHeroCTA({
  loggedInHref = "/dashboard",
  loggedInLabel = "Go to Practice Dashboard →",
  loggedOutHref = "/auth",
  loggedOutLabel = "Practice Free →",
  bg = C.accent,
  color = "#ffffff",
  style,
}: Props) {
  const { user, loading } = useAuth();
  const resolved = !loading && user;
  const href = resolved ? loggedInHref : loggedOutHref;
  const label = resolved ? loggedInLabel : loggedOutLabel;

  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.625rem 1.625rem",
        background: bg,
        color,
        borderRadius: "0.625rem",
        fontWeight: 600,
        textDecoration: "none",
        fontSize: "0.9375rem",
        transition: "opacity 0.15s ease",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {label}
    </a>
  );
}
