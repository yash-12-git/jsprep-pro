/**
 * Content counts quoted in static copy, metadata and schema. Everything public
 * should use these rather than typing a number.
 *
 * Deliberately rounded down so they stay true as content is added. Counted from
 * Firestore on 7 Nov 2026: 529 published questions (JavaScript 257, React 156,
 * System Design 59, TypeScript 57) and 83 topics.
 */

export const CONTENT_COUNTS = {
  total: "500+",
  javascript: "250+",
  react: "150+",
  typescript: "50+",
  systemDesign: "50+",
  theory: "200+",
  topics: "80+",
};
