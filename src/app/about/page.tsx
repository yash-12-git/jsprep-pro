import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo/seo";
import { LEGAL } from "@/lib/legal";
import { CONTENT_COUNTS } from "@/lib/contentCounts";
import { ContactEmail, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMeta({
  title: "About",
  description: `JSPrep Pro is an independent frontend interview practice platform built and run by ${LEGAL.operator}.`,
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

      <h2>What to expect</h2>
      <p>
        AI feedback is a practice tool, and it can be wrong. We can&apos;t promise
        interview results, and we don&apos;t claim to know which company asks
        which question unless we can show evidence for it.
      </p>

      <h2>Get in touch</h2>
      <p>
        See something wrong, or have an idea? Email <ContactEmail />. You can also
        see <Link className="link" href="/pricing">pricing</Link> or start with
        the free <Link className="link" href="/sprint">Interview Sprint</Link>.
      </p>
    </LegalPage>
  );
}
