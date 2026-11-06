import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMeta } from "@/lib/seo/seo";

export const metadata: Metadata = pageMeta({
  title: "Sign in",
  description: "Sign in to JSPrep Pro to save your interview practice progress.",
  path: "/auth",
  noindex: true,
});

export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
