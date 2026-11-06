// app/mock-interview/page.tsx
// Server component — fetches published topics once (cached), passes down to client.

import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo/seo";
import { getPublishedTopics } from "@/lib/cachedQueries";
import MockInterviewClient from "./MockInterviewClient";
import { getServerTrack } from "@/lib/getServerTrack";

export type TopicRef = { slug: string; title: string };

export const metadata: Metadata = pageMeta({
  title: "AI Mock Interview",
  description: "Practice a frontend interview with an AI interviewer.",
  path: "/mock-interview",
  noindex: true,
});

export default async function MockInterviewPage() {
  const track = await getServerTrack();
  const all = await getPublishedTopics({ track });
  const topics: TopicRef[] = all.map(({ slug, title }) => ({ slug, title }));
  return <MockInterviewClient topics={topics} />;
}