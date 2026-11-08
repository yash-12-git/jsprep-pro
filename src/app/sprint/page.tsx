import type { Metadata } from "next";
import { pageMeta, SITE } from "@/lib/seo/seo";
import SprintWrapper from "./SprintWrapper";
import { getServerTrack } from "@/lib/getServerTrack";
import { getQuestions } from "@/lib/cachedQueries";

export const metadata: Metadata = pageMeta({
  title: "JavaScript Interview Sprint — Are You Truly Interview Ready?",
  description:
    "A timed challenge mixing theory, output prediction, and debugging questions. AI-evaluated answers, gamified scoring, and shareable results. The best way to test if you're JavaScript interview ready.",
  path: `/sprint`,
});

// The sprint itself renders in the browser, so this is what search engines and
// visitors without JavaScript can read.
function SprintGuide() {
  return (
    <section className="doc doc--narrow" aria-label="About the Interview Sprint" data-focus-hide>
      <div className="legal">
        <h2>What is the Interview Sprint?</h2>
        <p>
          A timed frontend interview practice round that mixes three question
          types, so you have to switch between them as you would in a real
          technical screen. It covers JavaScript, React, TypeScript and frontend
          system design. Choose your track from the top of the page.
        </p>
        <h2>How it works</h2>
        <ul>
          <li><strong>Theory:</strong> write your answer in your own words, and AI scores it from 1 to 10 and lists what you covered and missed.</li>
          <li><strong>Output:</strong> read a code snippet and type exactly what it logs to the console.</li>
          <li><strong>Debug:</strong> find the bug in a snippet, then check the fix and mark yourself.</li>
        </ul>
        <p>
          A correct answer earns 10 points, an attempt earns 3, and a skipped
          question earns none. At the end you get a score, your accuracy and a
          breakdown by category showing where to focus. Answers the AI
          couldn&apos;t score are left out of the result.
        </p>
        <h2>Is it free?</h2>
        <p>
          Yes. The 5-question warmup takes 5 minutes and needs no account. A
          free account adds 10-question sprints and 3 AI scorings of your
          written answers. Pro scores every answer and adds sprints of 15 and
          20 questions.
        </p>
      </div>
    </section>
  );
}

export default async function SprintPage() {
  const track = await getServerTrack();
  const [theory, output, debug] = await Promise.all([
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
  ]);
  const allQuestions = {
    theory: theory.questions,
    debug: debug.questions,
    output: output.questions,
  };
  return (
    <>
      <SprintWrapper allQuestions={allQuestions} />
      <SprintGuide />
    </>
  );
}
