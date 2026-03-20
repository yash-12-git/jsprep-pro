import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta, breadcrumbSchema } from "@/lib/seo/seo";
import { getPublishedBlogPosts } from "@/lib/blogPosts";
import { C, RADIUS } from "@/styles/tokens";

export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title: "JavaScript Interview Blog — Tips, Guides & Practice",
  description:
    "In-depth guides on JavaScript interview topics. Learn closures, event loop, promises, async/await, and more with real code examples and interview tips.",
  path: "/blog",
  keywords: [
    "javascript interview blog",
    "javascript tutorials",
    "js interview tips",
  ],
});

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div
      style={{
        backgroundColor: C.bg,
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        }}
      />

      <div
        style={{
          maxWidth: "52rem",
          margin: "0 auto",
          padding: "2.5rem 1.25rem 5rem",
          color: C.text,
        }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            fontSize: "0.8125rem",
            color: C.muted,
            marginBottom: "2rem",
          }}
        >
          <Link href="/" style={{ color: C.accent, textDecoration: "none" }}>
            JSPrep Pro
          </Link>
          <span style={{ margin: "0 0.375rem", color: C.borderStrong }}>›</span>
          <span style={{ color: C.muted }}>Blog</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: C.accentText,
              marginBottom: "0.625rem",
            }}
          >
            JavaScript Interview Blog
          </p>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: C.text,
              marginBottom: "0.875rem",
              letterSpacing: "-0.025em",
            }}
          >
            Guides, Tips & Deep Dives
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: C.muted,
              lineHeight: 1.75,
              maxWidth: "38rem",
            }}
          >
            In-depth articles on the JavaScript concepts that come up most in
            frontend interviews. Written by developers, for developers.
          </p>
        </header>

        {/* Post list */}
        <main
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {posts.map((post) => (
            <article
              key={post.slug}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: "0.75rem",
                padding: "1.375rem 1.5rem",
              }}
            >
              {/* Meta row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    background: C.bgSubtle,
                    border: `1px solid ${C.border}`,
                    color: post.accentColor,
                    padding: "0.125rem 0.5rem",
                    borderRadius: "0.25rem",
                  }}
                >
                  {post.category}
                </span>
                <span style={{ fontSize: "0.6875rem", color: C.muted }}>
                  {post.readTime} · {post.publishedAt}
                </span>
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 600,
                  color: C.text,
                  marginBottom: "0.375rem",
                  lineHeight: 1.4,
                }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  style={{ color: C.text, textDecoration: "none" }}
                >
                  {post.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p
                style={{
                  fontSize: "0.875rem",
                  color: C.muted,
                  lineHeight: 1.7,
                  marginBottom: "0.875rem",
                }}
              >
                {post.excerpt}
              </p>

              {/* Read link */}
              <Link
                href={`/blog/${post.slug}`}
                style={{
                  fontSize: "0.8125rem",
                  color: C.accent,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Read article →
              </Link>
            </article>
          ))}
        </main>

        {/* Bottom CTA */}
        <section
          style={{
            marginTop: "3rem",
            background: C.accentSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: "0.875rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Practice What You Learn
          </h2>
          <p
            style={{
              color: C.muted,
              marginBottom: "1.25rem",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
            }}
          >
            Every article in this blog has an interactive practice section in
            JSPrep Pro.
          </p>
          <Link
            href="/auth"
            style={{
              display: "inline-flex",
              padding: "0.625rem 1.375rem",
              background: C.accent,
              color: "#ffffff",
              borderRadius: "0.625rem",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.9375rem",
            }}
          >
            Start Practicing Free →
          </Link>
        </section>
      </div>
    </div>
  );
}
