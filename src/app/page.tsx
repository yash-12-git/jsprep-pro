// app/page.tsx — SERVER COMPONENT
// Emotion cannot run in server components (uses createContext internally).
// Solution: this file is a pure server shell that:
//   1. Exports metadata (works because no "use client")
//   2. Injects JSON-LD schema tags server-side
//   3. Renders <HomePageClient> which handles all Emotion styling
//
// Googlebot sees: <title>, meta description, OG tags, JSON-LD schemas
// in the initial HTML response — which is all that matters for SEO.

import { courseSchema, faqSchema } from "@/lib/seo/seo";
import HomePageClient from "./HomePageClient";
import { getServerTrack } from "@/lib/getServerTrack";
import {
  getPublishedBlogPosts,
  getPublishedTopics,
  getQuestions,
} from "@/lib/cachedQueries";

// ── FAQ data lives here so it's part of the server render ────────────────────
const HOME_FAQ = [
  {
    question: "What is JSPrep Pro?",
    answer:
      "JSPrep Pro is a JavaScript interview preparation platform with 200+ questions across theory, output prediction, and debugging. It includes AI scoring, an Interview Sprint mode, and 36 topic deep-dives tailored for 1–3 year frontend developers.",
  },
  {
    question: "Is JSPrep Pro free to use?",
    answer:
      "Yes. JSPrep Pro offers 91 theory questions completely free, forever — no credit card required. The Pro plan (₹199/month) unlocks all 200+ questions, unlimited Interview Sprints, AI tools, and more.",
  },
  {
    question: "What JavaScript topics are covered?",
    answer:
      "JSPrep Pro covers 36 JavaScript topics including Closures, Event Loop, Promises, async/await, Hoisting, Prototypes, the this keyword, Type Coercion, Scope, and more.",
  },
  {
    question: "What is the Interview Sprint?",
    answer:
      "The Interview Sprint is a timed mixed-question challenge combining theory, output prediction, and debugging questions. AI scores your theory answers 1–10, and you get a final score card showing your strengths and areas to improve.",
  },
  {
    question:
      "How is JSPrep Pro different from other JavaScript interview prep sites?",
    answer:
      "Unlike most prep sites that only offer theory Q&A, JSPrep Pro includes output prediction questions and debug challenges. It also uses AI to score open-ended written answers, not just multiple choice.",
  },
];

export default async function HomePage() {
  const track = await getServerTrack();
  const [theory, output, debug, polyfill, topics, blogs] = await Promise.all([
    getQuestions({
      filters: { track, status: "published", type: "theory" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
    getQuestions({
      filters: { track, status: "published", type: "output" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
    getQuestions({
      filters: { track, status: "published", type: "debug" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
    getQuestions({
      filters: { track, status: "published", type: "polyfill" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
    getPublishedTopics({ track }),
    getPublishedBlogPosts({ track }),
  ]);

  const homepageProps = {
    track,
    theory: theory.questions,
    debug: debug.questions,
    output: output.questions,
    polyfill: polyfill.questions,
    topics,
    blogs,
  };

  return (
    <>
      {/* Schema injected server-side — crawlers see this immediately */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: courseSchema() }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchema(HOME_FAQ) }}
      />
      <HomePageClient />
    </>
  );
}
