"use client";
import { useAuth } from "@/hooks/useAuth";

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.75rem 1.75rem",
  background: "#f7c76a",
  color: "#0a0a10",
  borderRadius: "0.875rem",
  fontWeight: 800,
  textDecoration: "none",
  fontSize: "0.9375rem",
};

export default function HeroCTA() {
  const { user, loading } = useAuth();
  const href = !loading && user ? "/output-quiz" : "/auth";
  const label =
    !loading && user
      ? "⚡ Open Interactive Quiz"
      : "⚡ Practice Free — Sign Up";
  return (
    <a href={href} style={btn}>
      {label}
    </a>
  );
}
