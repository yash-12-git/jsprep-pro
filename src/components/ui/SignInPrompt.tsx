"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { C } from "@/styles/tokens";

/** For pages usable without an account: explains what signing in adds. */
export default function SignInPrompt({ message }: { message: string }) {
  const { user, loading } = useAuth();
  const path = usePathname();
  if (loading || user) return null;

  return (
    <p
      style={{
        margin: "0 0 1rem",
        fontSize: "0.8125rem",
        lineHeight: 1.5,
        color: C.muted,
      }}
    >
      {message}{" "}
      <Link
        href={`/auth?next=${encodeURIComponent(path)}`}
        style={{ color: C.text, textDecoration: "underline" }}
      >
        Sign in free
      </Link>
    </p>
  );
}
