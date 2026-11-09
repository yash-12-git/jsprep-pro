import type { Metadata } from "next";
import Link from "next/link";
import { FOUNDER, SITE, founderSchema, pageMeta } from "@/lib/seo/seo";
import { LEGAL } from "@/lib/legal";
import { CONTENT_COUNTS } from "@/lib/contentCounts";
import { ContactEmail, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMeta({
  title: "About",
  description: `JSPrep Pro is an independent frontend interview practice platform built and run by ${LEGAL.operator}, a working frontend engineer.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <LegalPage
      title="About JSPrep Pro"
      lede={`JSPrep Pro is an independent frontend interview practice platform, built and run by ${LEGAL.operator}.`}
      showUpdated={false}
    >
      <h2>What it is</h2>
      <p>
        Frontend interviews often test more than definitions, so JSPrep Pro lets
        you practice explaining concepts, predicting code output, fixing bugs
        and writing polyfills, with AI feedback on your answers. It includes{" "}
        {CONTENT_COUNTS.total} questions and {CONTENT_COUNTS.topics} topic guides
        across JavaScript, React, TypeScript and frontend system design.
      </p>

      <h2>Who builds it</h2>
      <p>
        I&apos;m {FOUNDER.name}, a {FOUNDER.jobTitle.toLowerCase()} based in
        Pune. I&apos;ve worked as an engineer since 2023, building production
        frontends with React, Next.js and TypeScript, along with
        Node.js services. Much of that work is frontend performance: cutting
        unnecessary re-renders, debouncing search and virtualising long lists.
      </p>
      <p>
        JSPrep Pro is my own project, built and run on my own time. I curate and
        review the questions, build the AI feedback and run the site. You can
        find me on{" "}
        <a className="link" href={FOUNDER.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>

      <h2>What to expect</h2>
      <p>
        AI feedback is a practice tool, and it can be wrong. We can&apos;t promise
        interview results, and we don&apos;t claim to know which company asks
        which question unless we can show evidence for it.
      </p>

      <h2>Get in touch</h2>
      <p>
        See something wrong, or have an idea? Email <ContactEmail /> or message
        us on{" "}
        <a className="link" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        . You can also
        see <Link className="link" href="/pricing">pricing</Link> or start with
        the free <Link className="link" href="/sprint">Interview Sprint</Link>.
      </p>
      {/* Last, so it doesn't take the first child's spacing rules. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: founderSchema() }}
      />
    </LegalPage>
  );
}
