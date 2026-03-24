// app/mock-interview/page.tsx
// Server component — fetches published topics once (cached), passes down to client.

import { getPublishedTopics } from "@/lib/cachedQueries";
import MockInterviewClient from "./MockInterviewClient";

export type TopicRef = { slug: string; title: string };

export default async function MockInterviewPage() {
  const all = await getPublishedTopics();
  const topics: TopicRef[] = all.map(({ slug, title }) => ({ slug, title }));
  return <MockInterviewClient topics={topics} />;
}