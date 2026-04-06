// lib/seo/trackMeta.ts
import type { Track } from "@/contexts/TrackContext";

export const TRACK_META: Record<
  Track,
  {
    label: string;
    topicsTitle: string;
    topicsDescription: string;
    topicsKeywords: string[];
    blogTitle: string;
    blogDescription: string;
    blogKeywords: string[];
    heroTagline: string;
  }
> = {
  javascript: {
    label: "JavaScript",
    topicsTitle:
      "JavaScript Interview Topics — Practice by Concept",
    topicsDescription:
      "Browse all JavaScript interview topics organised by concept. Closures, event loop, promises, prototypes, and 30+ more.",
    topicsKeywords: [
      "javascript interview topics",
      "javascript concepts interview",
      "js interview practice by topic",
      "javascript interview preparation guide",
    ],
    blogTitle: "JavaScript Interview Blog — Tips, Guides & Deep Dives",
    blogDescription:
      "In-depth guides on JavaScript interview topics. Closures, event loop, promises, async/await with real code examples.",
    blogKeywords: [
      "javascript interview blog",
      "js interview tips",
      "javascript tutorials",
    ],
    heroTagline: "Closures, async, prototypes and more",
  },
  react: {
    label: "React",
    topicsTitle: "React Interview Topics — Practice by Concept",
    topicsDescription:
      "Browse all React interview topics. Hooks, state management, component patterns, and 20+ more — each with cheat sheets and practice questions.",
    topicsKeywords: [
      "react interview topics",
      "react hooks interview",
      "react interview prep",
    ],
    blogTitle: "React Interview Blog — Tips, Guides & Deep Dives",
    blogDescription:
      "In-depth guides on React interview topics. Hooks, reconciliation, state patterns and more with real code examples.",
    blogKeywords: [
      "react interview blog",
      "react interview tips",
      "react tutorials",
    ],
    heroTagline: "Hooks, state, patterns and more",
  },
  typescript: {
    label: "TypeScript",
    topicsTitle: "TypeScript Interview Topics",
    topicsDescription:
      "TypeScript interview topics — generics, utility types, and more.",
    topicsKeywords: ["typescript interview topics"],
    blogTitle: "TypeScript Interview Blog",
    blogDescription: "Guides on TypeScript interview concepts.",
    blogKeywords: ["typescript interview blog", "typescript tutorials"],
    heroTagline: "Types, generics, utility types and more",
  },
  "system-design": {
    label: "System Design",
    topicsTitle: "System Design Interview Topics",
    topicsDescription:
      "Frontend system design interview topics — architecture, scalability, and more.",
    topicsKeywords: ["system design interview topics"],
    blogTitle: "System Design Interview Blog",
    blogDescription: "Guides on frontend system design concepts.",
    blogKeywords: ["system design interview blog", "system design tutorials"],
    heroTagline: "Architecture, scalability and more",
  },
};
