import type { Metadata } from "next";
import Link from "next/link";
import {
  DocClose,
  DocHero,
  DocSection,
  FaqRows,
  LinkGrid,
  RelatedLinks,
  TipSteps,
} from "@/components/seo/DocParts";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo/seo";
import InterviewQuestionList from "../javascript-interview-questions/QuestionList";

export const metadata: Metadata = pageMeta({
  title: "50+ Frontend System Design Interview Questions (2026)",
  description:
    "The most complete list of frontend system design interview questions with detailed answers. Covers rendering strategies, microfrontends, bundle optimization, caching, authentication, security, state management, Core Web Vitals, and more. Asked at FAANG, Stripe, Shopify.",
  path: "/system-design-interview-questions",
});

const SD_STATIC_FAQS = [
  {
    q: "What is frontend system design?",
    a: "Frontend system design is the discipline of architecting large-scale client-side applications. It covers decisions like rendering strategy (SSR/SSG/CSR), microfrontend architecture, state management patterns, bundle optimization, caching strategies, authentication, and performance. Senior engineers are expected to reason about trade-offs, not just implementation details.",
  },
  {
    q: "What is the difference between SSR, CSR, SSG, and ISR?",
    a: "CSR (Client-Side Rendering) delivers a blank HTML shell and renders everything in the browser, best for dashboards. SSR (Server-Side Rendering) generates HTML per request, best for SEO-critical, personalized pages. SSG (Static Site Generation) pre-builds HTML at deploy time, best for blogs and docs. ISR (Incremental Static Regeneration) is SSG with background revalidation, best for pages with infrequent data changes. Streaming SSR (React 18) streams HTML progressively, improving TTFB.",
  },
  {
    q: "What are microfrontends and when should you use them?",
    a: "Microfrontends split a monolithic frontend into independently deployable units owned by separate teams. Use them when your team is large (10+ frontend engineers), different parts of the app have different release cadences, or you need independent tech stack choices per domain. The main tools are Webpack Module Federation (runtime sharing), Single-SPA (framework-agnostic orchestration), and Nx/Turborepo (monorepo management). Avoid for small teams, the operational overhead outweighs the benefits.",
  },
  {
    q: "What is Webpack Module Federation?",
    a: "Module Federation is a Webpack 5 feature that lets one JavaScript application dynamically load code from another at runtime. A 'host' app consumes 'remotes' that expose modules. Dependencies like React can be marked singleton:true so they're shared rather than duplicated. This enables truly independent deployment, each microfrontend ships its own bundle and the host loads it at runtime without a build-time dependency.",
  },
  {
    q: "How do you optimize bundle size in a frontend application?",
    a: "Tree shaking eliminates dead code, requires ES module imports and sideEffects:false in package.json. Code splitting divides the bundle into chunks loaded on demand via dynamic import(). Route-based splitting is free in Next.js. Vendor chunks separate third-party libraries from app code for better cache reuse. Analyze with webpack-bundle-analyzer or Vite's rollup-plugin-visualizer. Also audit your dependencies, lodash-es vs lodash, date-fns vs moment, and replacing heavy polyfills with native APIs.",
  },
  {
    q: "What is the difference between JWT and cookie-based authentication?",
    a: "JWTs are self-contained tokens, the server validates them without a database lookup, making them stateless. Store JWTs in HttpOnly cookies (not localStorage) to prevent XSS. Cookie-based sessions store a session ID in a cookie and validate it against a server-side store. The key trade-off: JWTs can't be revoked without a blocklist, while server sessions are immediately revocable. For most web apps, HttpOnly cookies with short-lived JWTs + refresh token rotation is the recommended pattern.",
  },
  {
    q: "What are the Core Web Vitals and how do you improve them?",
    a: "Core Web Vitals are Google's UX quality signals: LCP (Largest Contentful Paint, <2.5s), preload hero images, use SSR/SSG, optimize TTFB. INP (Interaction to Next Paint, <200ms), avoid long tasks, defer non-critical JS, use web workers for heavy computation. CLS (Cumulative Layout Shift, <0.1), set explicit width/height on images and embeds, avoid inserting content above existing content. TTFB (<800ms), use edge rendering or CDN for static assets.",
  },
  {
    q: "What is XSS and how do you prevent it in a frontend application?",
    a: "Cross-Site Scripting (XSS) injects malicious scripts into a web page viewed by other users. Prevent it by: using textContent instead of innerHTML for dynamic content, sanitizing HTML with DOMPurify if you must use innerHTML, setting a Content Security Policy (CSP) that blocks inline scripts, never storing sensitive data in localStorage (use HttpOnly cookies instead), and using frameworks like React that escape JSX output by default. The most impactful single fix is a strict CSP header.",
  },
  {
    q: "What is the difference between Turborepo and Nx?",
    a: "Both are monorepo build orchestration tools. Turborepo (by Vercel) focuses on build pipeline caching, it hashes task inputs and skips tasks whose inputs haven't changed. Configuration is minimal (turbo.json). Nx (by Nrwl) provides a full developer platform: project graph, affected commands (run only what changed), module boundary enforcement, code generators, and first-class support for React/Angular/Node. Turborepo is easier to adopt; Nx provides more power for large teams with strict boundaries.",
  },
  {
    q: "What is the difference between server state and client state?",
    a: "Server state is data that originates on the server and needs to be fetched, cached, and synchronized, user profiles, API responses, lists of items. Manage it with React Query (TanStack Query) or SWR. Client state is ephemeral UI state that lives only in the browser, modal open/closed, form input values, sidebar collapsed. Manage it with useState, useReducer, or Zustand. The most common architecture mistake is putting server state into Redux/Zustand and manually managing loading/error/caching, React Query makes this unnecessary.",
  },
];

const TOPIC_SECTIONS = [
  {
    title: "Rendering Strategies",
    href: "/system-design-rendering-strategies-interview-questions",
  },
  {
    title: "Microfrontends",
    href: "/system-design-microfrontends-interview-questions",
  },
  {
    title: "Monorepo (Nx & Turborepo)",
    href: "/system-design-monorepo-interview-questions",
  },
  {
    title: "Bundle Optimization",
    href: "/system-design-bundle-optimization-interview-questions",
  },
  {
    title: "Caching Strategies",
    href: "/system-design-caching-strategies-interview-questions",
  },
  {
    title: "Authentication Architecture",
    href: "/system-design-authentication-interview-questions",
  },
  {
    title: "Frontend Security",
    href: "/system-design-frontend-security-interview-questions",
  },
  {
    title: "State Management",
    href: "/system-design-state-management-interview-questions",
  },
  {
    title: "Network Optimization",
    href: "/system-design-network-optimization-interview-questions",
  },
  {
    title: "Core Web Vitals",
    href: "/system-design-core-web-vitals-interview-questions",
  },
];

const PREP_TIPS = [
  {
    title: "Think in trade-offs",
    desc: "System design interviews are about trade-off reasoning, not memorizing APIs. For every approach (SSR, microfrontends, JWT), know the cost alongside the benefit.",
  },
  {
    title: "Anchor answers in metrics",
    desc: "LCP, INP, CLS, TTFB, use real numbers. Say '<2.5s LCP' not 'fast load'. Interviewers at senior levels expect you to quantify performance goals.",
  },
  {
    title: "Security is always in scope",
    desc: "Every system design answer should address XSS, CSRF, and token storage. Senior engineers are expected to proactively raise security concerns.",
  },
  {
    title: "Know when NOT to scale",
    desc: "Microfrontends and monorepos add complexity. The best answer often starts: 'This depends on team size and release cadence.' Show you understand the org-level context.",
  },
  {
    title: "Performance is a feature",
    desc: "Core Web Vitals directly impact Google ranking. Know which vitals matter for which page types and have a concrete optimization checklist ready.",
  },
];

export default async function SystemDesignInterviewQuestionsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SD_STATIC_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        key="faq-schema-sd-interview-questions"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="doc">
        <DocHero
          title="50+ Frontend System Design Interview Questions"
          lede={
            <>
              Senior-level system design interview prep covering rendering strategies, microfrontend
            architecture, bundle optimization, caching, authentication, security, state management,
            and Core Web Vitals. Questions asked at{" "}
            <strong>Google, Meta, Stripe, Shopify, Atlassian, Razorpay, Flipkart</strong>{" "}
            and other top tech companies.
            </>
          }
          actions={
            <>
              <Link href="/dashboard" className="btn btn--primary">
                Practice Now, It&apos;s Free
              </Link>
              <Link href="/topics/system-design" className="btn">
                Browse All Topics
              </Link>
              <Link href="/blog/system-design" className="btn">
                Deep-Dive Blogs
              </Link>
            </>
          }
        />

        {/* ── Live question list (client component, loads from Firestore) ── */}
        <Suspense fallback={<p className="doc-line">Loading questions…</p>}>
          <InterviewQuestionList forcedTrack="system-design" />
        </Suspense>

        {/* ── Static topic overview (always visible, good for SEO + fallback) ── */}
        <DocSection title="Core System Design Topics">
          <LinkGrid
            items={[
              ...TOPIC_SECTIONS,
              { title: "Browse All Topics", href: `/topics/system-design` },
            ]}
          />
        </DocSection>

        <DocSection title="Frequently Asked System Design Questions">
          <FaqRows items={SD_STATIC_FAQS} />
        </DocSection>

        <DocSection title="How to Prepare for System Design Interviews">
          <TipSteps items={PREP_TIPS} />
        </DocSection>

        <DocSection title="Related Resources">
          <RelatedLinks
            items={[
              { href: "/topics/system-design", text: "System Design Concept Hubs (All Topics)" },
              { href: "/blog/system-design", text: "System Design Deep-Dive Blog Posts" },
              { href: "/blog/system-design/rendering-strategies-ssr-csr-ssg-isr", text: "Rendering Strategies: SSR vs CSR vs SSG vs ISR" },
              { href: "/blog/system-design/microfrontends-vs-monolith", text: "Microfrontends vs Monolith: When to Split" },
              { href: "/blog/system-design/frontend-security-xss-csrf-csp", text: "Frontend Security: XSS, CSRF, and CSP" },
              { href: "/javascript-interview-questions", text: "JavaScript Interview Questions" },
              { href: "/react-interview-questions", text: "React Interview Questions" },
            ]}
          />
        </DocSection>

        <DocClose
          title="Ready to practice?"
          line="Theory questions, architecture walkthroughs, and AI-graded answers. Prep for senior-level frontend system design interviews."
          actions={
            <>
              <Link href="/dashboard" className="btn btn--primary">
                Start Practicing Free
              </Link>
              <Link href="/sprint" className="btn">
                Daily Sprint
              </Link>
            </>
          }
        />
      </main>
    </>
  );
}
