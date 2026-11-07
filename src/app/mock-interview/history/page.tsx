import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo/seo";
import InterviewHistoryClient from "./InterviewHistoryClient";

export const metadata: Metadata = pageMeta({
  title: "Past Mock Interviews",
  description: "Your saved mock interview scorecards.",
  path: "/mock-interview/history",
  noindex: true,
});

export default function InterviewHistoryPage() {
  return <InterviewHistoryClient />;
}
