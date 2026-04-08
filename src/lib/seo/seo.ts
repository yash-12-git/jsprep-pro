/**
 * seo.ts — centralized SEO helpers
 *
 * Every public-facing page imports from here.
 * Change the site name once, updates everywhere.
 */

import { proFeatures } from "@/data/homepageStaticData";
import type { Metadata } from "next";
import { Track } from "../tracks";

export const SITE = {
  name: "JSPrep Pro",
  domain: "https://jsprep.pro",
  twitterHandle: "@jspreppro",
  description:
    "500+ frontend interview questions covering JavaScript, React & core concepts. AI scoring, mock interviews, output prediction & debugging.",
};

// ─── Keywords ─────────────────────────────────────────────────────────────────

export const KEYWORDS = {
  primary: [
    // Frontend (umbrella)
    "frontend interview questions",
    "frontend developer interview preparation",
    "frontend coding interview",
    "frontend interview questions india",
    "frontend developer interview questions for 2 years experience",
    // JavaScript
    "javascript interview questions",
    "javascript interview preparation",
    "js interview questions with answers",
    "javascript coding interview",
    "javascript practice problems",
    "javascript output questions",
    "javascript debugging interview",
    "javascript debug interview questions",
    "javascript output prediction questions",
    // React
    "react interview questions",
    "react hooks interview questions",
    "react interview preparation",
    // TypeScript
    "typescript interview questions",
    "typescript interview preparation",
    // System Design
    "frontend system design interview",
    "system design interview questions frontend",
  ],
  secondary: [
    // JS concepts
    "closures interview questions",
    "event loop javascript",
    "javascript promises interview",
    "async await javascript",
    "javascript this keyword",
    "javascript hoisting",
    // React concepts
    "react usememo vs usecallback",
    "react hooks interview",
    "react state management interview",
    // TS concepts
    "typescript generics interview",
    "typescript utility types",
    // Companies
    "javascript interview questions razorpay",
    "javascript interview questions atlassian",
    "javascript interview questions flipkart",
    "react interview questions swiggy",
    "frontend interview questions zepto",
  ],
  platform: [
    "frontend interview platform",
    "javascript practice platform",
    "react interview prep online",
    "ai frontend interview prep",
    "javascript mock interview online",
    "frontend developer quiz",
    "leetcode for javascript",
    "leetcode for frontend developers",
    "ai javascript interview scorer",
  ],
};

// ─── Track-specific keyword sets ──────────────────────────────────────────────

export const TRACK_KEYWORDS: Record<Track, string[]> = {
  javascript: [
    "javascript interview questions",
    "javascript output prediction",
    "javascript closures hoisting scope",
    "js debugging interview",
    "javascript polyfill questions",
  ],
  react: [
    "react interview questions",
    "react hooks interview preparation",
    "react useeffect usememo interview",
    "react component lifecycle interview",
    "react state management interview questions",
  ],
  typescript: [
    "typescript interview questions",
    "typescript generics interview",
    "typescript utility types interview",
    "typescript type narrowing interview",
    "typescript vs javascript interview",
  ],
  "system-design": [
    "frontend system design interview",
    "system design interview frontend developer",
    "micro frontend interview questions",
    "frontend architecture interview",
    "web performance interview questions",
  ],
};

// ─── Page metadata helper ─────────────────────────────────────────────────────

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedAt?: string;
  modifiedAt?: string;
  image?: string;
  track?: Track;
}

export function pageMeta(opts: PageMetaOptions): Metadata {
  const {
    title,
    description,
    path,
    type = "website",
    keywords = [],
    publishedAt,
    modifiedAt,
    track,
  } = opts;

  const url = `${SITE.domain}${path}`;
  const fullTitle = title.includes("JSPrep") ? title : `${title} — JSPrep Pro`;
  const image = opts.image ?? `${SITE.domain}/og-default.png`;

  const trackKw = track ? TRACK_KEYWORDS[track] : [];

  return {
    title: fullTitle,
    description,
    keywords: [...KEYWORDS.primary, ...trackKw, ...keywords].join(", "),
    authors: [{ name: "JSPrep Pro Team" }],
    creator: SITE.name,
    publisher: SITE.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: SITE.name,
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
      ...(modifiedAt ? { modifiedTime: modifiedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitterHandle,
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

// ─── FAQ schema ───────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FAQItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}

// ─── Article schema ───────────────────────────────────────────────────────────

export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  modifiedAt?: string;
  image?: string;
}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: `${SITE.domain}${opts.path}`,
    datePublished: opts.publishedAt,
    dateModified: opts.modifiedAt ?? opts.publishedAt,
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.domain}/logo.png` },
    },
    image: opts.image ?? `${SITE.domain}/og-default.png`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.domain}${opts.path}`,
    },
  });
}

// ─── Software schema ──────────────────────────────────────────────────────────

export function softwareSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description: SITE.description,
    url: SITE.domain,
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "INR", name: "Free Plan" },
      {
        "@type": "Offer",
        price: process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 199,
        priceCurrency: "INR",
        name: "Pro Plan",
        billingDuration: "P1M",
      },
    ],
    featureList: proFeatures,
  });
}

// ─── Course schema — track-aware ─────────────────────────────────────────────

const TRACK_COURSE_META: Record<
  Track,
  { name: string; description: string; teaches: string[] }
> = {
  javascript: {
    name: "JavaScript Interview Preparation",
    description:
      "200+ JavaScript interview questions across theory, output prediction, and debugging. " +
      "AI scoring, Interview Sprint, and 36 topic deep-dives.",
    teaches: [
      "JavaScript Closures",
      "JavaScript Event Loop",
      "JavaScript Promises and async/await",
      "JavaScript Hoisting",
      "JavaScript Prototypes",
      "JavaScript this keyword",
      "JavaScript Output Prediction",
      "JavaScript Debugging",
    ],
  },
  react: {
    name: "React Interview Preparation",
    description:
      "150+ React interview questions covering hooks, state management, rendering, and patterns. " +
      "AI scoring, output prediction, and debug challenges.",
    teaches: [
      "React Hooks (useState, useEffect, useMemo, useCallback)",
      "React Component Lifecycle",
      "React State Management",
      "React Context API",
      "React Performance Optimisation",
      "React Design Patterns",
      "React Rendering Behaviour",
    ],
  },
  typescript: {
    name: "TypeScript Interview Preparation",
    description:
      "100+ TypeScript interview questions covering types, generics, utility types, and type narrowing. " +
      "AI scoring and debug challenges.",
    teaches: [
      "TypeScript Types and Interfaces",
      "TypeScript Generics",
      "TypeScript Utility Types",
      "TypeScript Type Narrowing",
      "TypeScript Conditional Types",
      "TypeScript Mapped Types",
      "TypeScript with React",
    ],
  },
  "system-design": {
    name: "Frontend System Design Interview Preparation",
    description:
      "Frontend system design questions covering architecture, APIs, micro-frontends, " +
      "performance, and real-time systems. AI-scored answers.",
    teaches: [
      "Frontend Architecture Patterns",
      "Micro-frontend Design",
      "API Design (REST vs GraphQL)",
      "Web Performance and Core Web Vitals",
      "Real-time Systems (WebSockets)",
      "CDN and Caching Strategies",
      "Frontend at Scale",
    ],
  },
};

export function courseSchema(track: Track = "javascript"): string {
  const meta = TRACK_COURSE_META[track];
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Course",
    name: meta.name,
    description: meta.description,
    url: SITE.domain,
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.domain,
    },
    educationalLevel: "Intermediate",
    teaches: meta.teaches,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: "en",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Free Plan",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Pro Plan",
        price: process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 199,
        priceCurrency: "INR",
        billingIncrement: "P1M",
        availability: "https://schema.org/InStock",
      },
    ],
  });
}

// ─── Website schema — enables Google Sitelinks search ────────────────────────

export function websiteSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.domain,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.domain}/topics?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}

// ─── Breadcrumb schema ────────────────────────────────────────────────────────

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.domain}${item.path}`,
    })),
  });
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function categorySlug(cat: string): string {
  return slugify(cat.replace(/'/g, "").replace(/&/g, "and"));
}

export const CATEGORY_SLUGS: Record<string, string> = {
  "core-js": "Core JS",
  functions: "Functions",
  "async-js": "Async JS",
  objects: "Objects",
  arrays: "Arrays",
  "this-keyword": "'this' Keyword",
  "error-handling": "Error Handling",
  "modern-js": "Modern JS",
  performance: "Performance",
  "dom-and-events": "DOM & Events",
};

export function catToSlug(cat: string): string {
  const entry = Object.entries(CATEGORY_SLUGS).find(([, v]) => v === cat);
  return entry?.[0] ?? slugify(cat);
}
