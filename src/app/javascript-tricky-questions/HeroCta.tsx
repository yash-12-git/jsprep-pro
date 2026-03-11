"use client";
import { useAuth } from "@/hooks/useAuth";

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.75rem 1.75rem",
  background: "#f76a6a",
  color: "white",
  borderRadius: "0.875rem",
  fontWeight: 800,
  textDecoration: "none",
  fontSize: "0.9375rem",
  marginBottom: "1rem",
};

export default function HeroCTA() {
  const { user, loading } = useAuth();
  const href = !loading && user ? "/output-quiz" : "/auth";
  const label =
    !loading && user
      ? "🎯 Practice These Interactively"
      : "🎯 Try the Interactive Quiz Free";
  return (
    <a href={href} style={btn}>
      {label}
    </a>
  );
}
