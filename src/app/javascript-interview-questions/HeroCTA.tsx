"use client";

import { useAuth } from "@/hooks/useAuth";
import { C } from "@/styles/tokens";

export default function HeroCTA() {
  const { user, loading } = useAuth();
  const href = !loading && user ? "/dashboard" : "/auth";
  const label =
    !loading && user
      ? "Go to Practice Dashboard →"
      : "Practice All Questions Free →";

  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.625rem 1.375rem",
        background: C.accent,
        color: "#ffffff",
        borderRadius: "0.625rem",
        fontWeight: 600,
        textDecoration: "none",
        fontSize: "0.9375rem",
        transition: "opacity 0.12s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {label}
    </a>
  );
}
