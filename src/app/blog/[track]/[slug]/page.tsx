import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getBlogPostBySlug,
  getBlogPostSlugs,
  getPublishedBlogPosts,
  getRelatedTopics,
} from "@/lib/cachedQueries";
import Link from "next/link";
import {
  pageMeta,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo/seo";
import { BLOG_FAQS } from "@/data/seo/blogFaqs";
import { C } from "@/styles/tokens";
import { Track, TRACKS } from "@/lib/tracks";
import { getServerTrack } from "@/lib/getServerTrack";

export const revalidate = 3600;

interface Props {
  params: { track: Track; slug: string };
}

export async function generateStaticParams() {
  try {
    const slugs = await getBlogPostSlugs();
    return TRACKS.filter((t) => t.available).flatMap((t) =>
      slugs.map((slug) => ({
        track: t.id,
        slug,
      })),
    );
  } catch {
    return [];
  }
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, track } = params;

  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${track}/${post.slug}`,
    keywords: post.keywords,
    type: "article",
    publishedAt: post.publishedAt,
    modifiedAt: post.modifiedAt,
  });
}

// ─── Lightweight Markdown → HTML ─────────────────────────────────────────────
function md(content: string): string {
  return content
    .replace(
      /```(\w*)\n([\s\S]*?)```/g,
      (_, lang, code) =>
        `<pre><code class="language-${lang}">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim()}</code></pre>`,
    )
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^[*\-] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
    .split("\n\n")
    .map((b) => {
      const t = b.trim();
      if (!t) return "";
      if (/^<(h[1-2]|pre|ul|blockquote)/.test(t)) return t;
      return `<p>${t.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  const track = getServerTrack();
  if (!post) notFound();

  const [relatedTopics, allPosts] = await Promise.all([
    post.relatedTopicSlugs?.length
      ? getRelatedTopics(post.relatedTopicSlugs.slice(0, 4))
      : Promise.resolve([]),
    getPublishedBlogPosts(),
  ]);

  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const blogFaqItems = BLOG_FAQS[post.slug] ?? [];
  const blogFaq = blogFaqItems.length > 0 ? faqSchema(blogFaqItems) : null;

  return (
    <div
      style={{
        backgroundColor: C.bg,
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: articleSchema({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${track}/${post.slug}`,
            publishedAt: post.publishedAt,
            modifiedAt: post.modifiedAt,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: `/blog/${track}` },
            { name: post.title, path: `/blog/${track}/${post.slug}` },
          ]),
        }}
      />
      {blogFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: blogFaq }}
        />
      )}

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
          <Link
            href="/blog"
            style={{ color: C.accent, textDecoration: "none" }}
          >
            Blog
          </Link>
          <span style={{ margin: "0 0.375rem", color: C.borderStrong }}>›</span>
          <span style={{ color: C.muted }}>{post.category}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              flexWrap: "wrap",
              marginBottom: "0.875rem",
            }}
          >
            {/* Category chip — keeps post.accentColor for per-post identity */}
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
              {post.readTime} · Updated {post.modifiedAt}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.625rem,4vw,2.25rem)",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.2,
              marginBottom: "1rem",
              letterSpacing: "-0.025em",
            }}
          >
            {post.title}
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: C.muted,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {post.excerpt}
          </p>
        </header>

        {/* Inline practice CTA banner */}
        <div
          style={{
            background: C.accentSubtle,
            border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.accent}`,
            borderRadius: "0.625rem",
            padding: "0.875rem 1.125rem",
            marginBottom: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: "0.875rem", color: C.text, margin: 0 }}>
            💡 Practice these concepts interactively with AI feedback
          </p>
          <Link
            href="/auth"
            style={{
              fontSize: "0.8125rem",
              color: C.accent,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Start Practicing →
          </Link>
        </div>

        {/* Article body */}
        {post.content ? (
          <article
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: md(post.content) }}
          />
        ) : (
          <article className="blog-content">
            <p>
              Full article coming soon.{" "}
              <Link href="/dashboard" style={{ color: C.accent }}>
                Practice in the app
              </Link>
              .
            </p>
          </article>
        )}

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <section
            style={{
              margin: "2.5rem 0",
              background: C.bgSubtle,
              border: `1px solid ${C.border}`,
              borderRadius: "0.875rem",
              padding: "1.125rem 1.375rem",
            }}
          >
            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: C.muted,
                marginBottom: "0.875rem",
              }}
            >
              📚 Practice These Topics
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(min(100%,14rem),1fr))",
                gap: "0.5rem",
              }}
            >
              {relatedTopics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.slug}`}
                  style={{
                    display: "block",
                    padding: "0.75rem 1rem",
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: C.text,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {t.keyword.charAt(0).toUpperCase() + t.keyword.slice(1)}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: C.muted }}>
                    {t.questionCount} questions
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section
          style={{
            background: C.accentSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: "0.875rem",
            padding: "2rem",
            textAlign: "center",
            margin: "3rem 0",
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
            Put This Into Practice
          </h2>
          <p
            style={{
              color: C.muted,
              marginBottom: "1.25rem",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
            }}
          >
            Reading articles is passive. JSPrep Pro makes you actively recall,
            predict output, and get AI feedback.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/auth"
              style={{
                padding: "0.625rem 1.375rem",
                background: C.accent,
                color: "#ffffff",
                borderRadius: "0.625rem",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.9375rem",
              }}
            >
              Start Free →
            </Link>
            <Link
              href="/javascript-interview-questions"
              style={{
                padding: "0.625rem 1.375rem",
                background: C.bg,
                border: `1px solid ${C.border}`,
                color: C.muted,
                borderRadius: "0.625rem",
                textDecoration: "none",
                fontSize: "0.9375rem",
              }}
            >
              Browse All Questions
            </Link>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "1.0625rem",
                fontWeight: 600,
                color: C.text,
                marginBottom: "1rem",
                letterSpacing: "-0.01em",
                paddingBottom: "0.75rem",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              Related Articles
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(min(100%,16rem),1fr))",
                gap: "0.75rem",
              }}
            >
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  style={{
                    textDecoration: "none",
                    display: "block",
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.75rem",
                    padding: "1.125rem 1.25rem",
                  }}
                >
                  {/* Per-post accent colour kept for visual differentiation */}
                  <div
                    style={{
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      color: p.accentColor,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {p.category}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: C.text,
                      lineHeight: 1.45,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {p.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: C.muted }}>
                    {p.readTime}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ─── Blog prose styles — light theme ──────────────────────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .blog-content {
          color: ${C.text};
          font-size: 0.9375rem;
          line-height: 1.85;
        }
        .blog-content h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: ${C.text};
          margin: 2rem 0 1rem;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }
        .blog-content h2 {
          font-size: 1.1875rem;
          font-weight: 600;
          color: ${C.text};
          margin: 2rem 0 0.875rem;
          line-height: 1.3;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid ${C.border};
          letter-spacing: -0.01em;
        }
        .blog-content p {
          margin: 0 0 1rem;
          line-height: 1.85;
          font-size: 0.9375rem;
          color: ${C.text};
        }
        .blog-content pre {
          background: ${C.codeBg};
          border: 1px solid ${C.border};
          border-left: 3px solid ${C.accent};
          border-radius: 0.625rem;
          padding: 1rem 1.25rem;
          overflow-x: auto;
          margin: 1.25rem 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8125rem;
          line-height: 1.75;
          color: ${C.codeText};
        }
        .blog-content code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8125rem;
          color: ${C.codeText};
        }
        .blog-content p > code,
        .blog-content li > code {
          background: ${C.codeInlineBg};
          border: 1px solid ${C.border};
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.8em;
          color: ${C.codeText};
        }
        .blog-content ul {
          padding-left: 1.5rem;
          margin: 0 0 1rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
          font-size: 0.9375rem;
          color: ${C.text};
        }
        .blog-content strong {
          color: ${C.text};
          font-weight: 600;
        }
        .blog-content em {
          color: ${C.amber};
          font-style: italic;
        }
        .blog-content blockquote {
          border-left: 3px solid ${C.accent};
          padding: 0.5rem 1rem;
          margin: 1.25rem 0;
          background: ${C.accentSubtle};
          border-radius: 0 0.5rem 0.5rem 0;
          color: ${C.accentText};
          font-style: italic;
        }
      `,
        }}
      />
    </div>
  );
}
