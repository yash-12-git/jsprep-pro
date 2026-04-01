// ─── Blog Post Types ──────────────────────────────────────────────────────────
// Blog posts live in Firestore `blog_posts` collection.

export type BlogStatus = 'draft' | 'published' | 'archived'
export interface BlogPost {
  // Identity
  id: string                     // Firestore doc ID
  slug: string                   // URL slug e.g. 'javascript-event-loop-explained'

  // Content
  title: string
  excerpt: string                // Short summary shown on listing + meta description
  category: string               // Display category e.g. 'Deep Dive', 'Interview Prep'
  accentColor: string            // Hex color used for borders/labels e.g. '#6af7c0'
  readTime: string               // '8 min read'
  publishedAt: string            // 'YYYY-MM-DD'
  modifiedAt: string             // 'YYYY-MM-DD'
  keywords: string[]             // For SEO meta keywords
  content: string                // Full Markdown content

  // Linking fields — the critical addition
  topicSlug?: string             // Primary topic this post belongs to (foreign key → topics)
  relatedTopicSlugs: string[]    // All related topics (for cross-links in sidebar)
  questionCategories: string[]   // Question categories to pull into sidebar e.g. ['Functions', 'Core JS']

  // Metadata
  status: BlogStatus
  createdAt: string
  updatedAt: string
  createdBy?: string
  track?: string                   // Optional track association for filtering by track
}

export type BlogPostInput = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>

export interface BlogPostFilters {
  status?: BlogStatus
  category?: string
  topicSlug?: string
  track?: string
}