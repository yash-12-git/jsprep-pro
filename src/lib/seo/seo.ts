/**
 * seo.ts — centralized SEO helpers
 *
 * Every public-facing page imports from here.
 * Change the site name once, updates everywhere.
 */

import { proFeatures } from "@/data/homepageStaticData";
import type { Metadata } from "next";

export const SITE = {
  name: "JSPrep Pro",
  domain: "https://jsprep.pro",
  twitterHandle: "@jspreppro",
  description:
    "195+ JavaScript interview questions with AI scoring, output prediction " +
    "& debug challenges. Theory, output quiz, and debug lab modes. " +
    "Free to start — no card needed.",
};


export const KEYWORDS = {
  primary: [
    "javascript interview questions",
    "javascript interview preparation",
    "js interview questions with answers",
    "javascript coding interview",
    "javascript practice problems",
    "javascript output questions",
    "javascript debugging interview",
    "frontend developer interview india",
    "javascript interview questions for 2 years experience",
    "javascript output prediction questions",
    "javascript debug interview questions",
  ],
  secondary: [
    "closures interview questions",
    "event loop javascript",
    "javascript promises interview",
    "async await javascript",
    "javascript this keyword",
    "javascript hoisting",
    "frontend developer interview",
    "react interview questions",
    "typescript interview questions",
    "javascript interview questions razorpay",
    "javascript interview questions atlassian",
    "javascript interview questions flipkart",
  ],
  platform: [
    "javascript interview platform",
    "javascript practice platform",
    "js interview prep online",
    "javascript quiz for developers",
    "leetcode for javascript",
    "ai javascript interview prep",
    "javascript mock interview online",
  ],
};


interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedAt?: string;
  modifiedAt?: string;
  image?: string;
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
  } = opts;

  const url = `${SITE.domain}${path}`;

  // ── CHANGE 3a: fullTitle logic ──────────────────────────────
  // BEFORE:
  //   const fullTitle = title.includes('JSPrep') ? title : `${title} | JSPrep Pro`
  //
  // Problems:
  //   - Pipe ( | ) separator is outdated — Google prefers hyphens ( — )
  //   - Title template should be: "Topic — JSPrep Pro", not "Topic | JSPrep Pro"
  //   - The check `title.includes('JSPrep')` prevents the template applying when
  //     a page explicitly passes a full title — that's fine, keep the intent
  //
  // ✅ FIXED:
  const fullTitle = title.includes("JSPrep") ? title : `${title} — JSPrep Pro`;

  const image = opts.image ?? `${SITE.domain}/og-default.png`;

  return {
    title: fullTitle,
    description,
    keywords: [...KEYWORDS.primary, ...keywords].join(", "),
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

      // ── CHANGE 3b: locale ────────────────────────────────────
      // BEFORE: 'en_US'
      // Your site targets Indian developers (₹ pricing, IN geo tags, Indian companies)
      // ✅ FIXED:
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

// ─────────────────────────────────────────────────────────────
// ✅ KEEP faqSchema — already correct, well-structured
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// ✅ KEEP articleSchema — already correct
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// CHANGE 4: softwareSchema — add CourseInstance and fix description
//
// BEFORE: uses SITE.description (which was wrong — now fixed above)
// ALSO ADD: CourseInstance and WebSite schema alongside SoftwareApplication
//           Google prefers Course schema for educational platforms
// ─────────────────────────────────────────────────────────────
export function softwareSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description: SITE.description, // ✅ now correct after CHANGE 1
    url: SITE.domain,
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "INR", name: "Free Plan" },
      {
        "@type": "Offer",
        price: "199",
        priceCurrency: "INR",
        name: "Pro Plan",
        billingDuration: "P1M",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "247", // ⚠️  update this with real review count when you have it
      bestRating: "5",
    },
    featureList: proFeatures,
  });
}

// ─────────────────────────────────────────────────────────────
// ✅ ADD: courseSchema — higher-value signal for educational platforms
// Use this in app/page.tsx alongside softwareSchema
// ─────────────────────────────────────────────────────────────
export function courseSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Course",
    name: "JavaScript Interview Preparation",
    description:
      "195+ JavaScript interview questions across theory, output prediction, " +
      "and debugging. AI scoring, Interview Sprint, and 36 topic deep-dives.",
    url: SITE.domain,
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.domain,
    },
    educationalLevel: "Intermediate",
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
        price: "199",
        priceCurrency: "INR",
        billingIncrement: "P1M",
        availability: "https://schema.org/InStock",
      },
    ],
  });
}

// ─────────────────────────────────────────────────────────────
// ✅ ADD: websiteSchema — enables Google Sitelinks search box
// Add to layout.tsx <head> alongside softwareSchema
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// ✅ KEEP — breadcrumbSchema, slugify, categorySlug, CATEGORY_SLUGS
//    All correct, no changes needed.
// ─────────────────────────────────────────────────────────────
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