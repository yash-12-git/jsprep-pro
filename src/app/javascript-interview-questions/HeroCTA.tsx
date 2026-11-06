"use client";

import { useAuth } from "@/hooks/useAuth";

export default function HeroCTA() {
  const { user, loading } = useAuth();
  const href = !loading && user ? "/dashboard" : "/auth";
  const label =
    !loading && user ? "Go to Practice Dashboard" : "Practice All Questions Free";

  return (
    <a href={href} className="btn btn--primary">
      {label}
    </a>
  );
}
