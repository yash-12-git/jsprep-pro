import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo/seo";
import InterviewLogClient from "./InterviewLogClient";

export const metadata: Metadata = pageMeta({
  title: "Interview Log",
  description: "Log your real interviews so your study plan focuses on what was asked.",
  path: "/interview-log",
  noindex: true,
});

export default function InterviewLogPage() {
  return <InterviewLogClient />;
}
