import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
  getRelatedTopics,
} from "@/lib/cachedQueries";
import Link from "next/link";
import { DocClose, DocHero, LinkGrid } from "@/components/seo/DocParts";
import {
  pageMeta,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo/seo";
import { BLOG_FAQS, REACT_BLOG_FAQS, TYPESCRIPT_BLOG_FAQS, SYSTEM_DESIGN_BLOG_FAQS } from "@/data/seo/blogFaqs";
import { Track } from "@/lib/tracks";

export const revalidate = 3600;

interface Props {
  params: { track: Track; slug: string };
}

export async function generateStaticParams() {
  try {
    const posts = await getPublishedBlogPosts();
    return posts.map((post) => ({
      track: post.track ?? "javascript",
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  const canonicalTrack = post.track ?? "javascript";
  return {
    ...pageMeta({
      title: post.title,
      description: post.excerpt,
      path: `/blog/${canonicalTrack}/${post.slug}`,
      keywords: post.keywords,
      type: "article",
      publishedAt: post.publishedAt,
      modifiedAt: post.modifiedAt,
    }),
    alternates: { canonical: `/blog/${canonicalTrack}/${post.slug}` },
  };
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
  if (!post) notFound();

  // The post is looked up by slug alone, so every post used to resolve at all
  // four track paths (/blog/javascript/x, /blog/react/x, …) with a 200 — four
  // crawlable URLs for one article. Send the mismatched ones to the canonical
  // path with a 308 instead of serving duplicate content.
  const track = post.track ?? "javascript";
  if (params.track !== track) permanentRedirect(`/blog/${track}/${post.slug}`);

  const [relatedTopics, allPosts] = await Promise.all([
    post.relatedTopicSlugs?.length
      ? getRelatedTopics(post.relatedTopicSlugs.slice(0, 4))
      : Promise.resolve([]),
    getPublishedBlogPosts(),
  ]);

  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const blogFaqItems = (
    track === 'javascript' ? BLOG_FAQS[post.slug] :
    track === 'typescript' ? TYPESCRIPT_BLOG_FAQS[post.slug] :
    track === 'system-design' ? SYSTEM_DESIGN_BLOG_FAQS[post.slug] :
    REACT_BLOG_FAQS[post.slug]
  ) ?? [];
  const blogFaq = blogFaqItems?.length > 0 ? faqSchema(blogFaqItems) : null;

  return (
    <div>
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

      <main className="doc doc--narrow">
        <DocHero
          crumbs={
            <>
              <Link href="/">JSPrep Pro</Link>
              <span>/</span>
              <Link href={`/blog/${track}`}>Blog</Link>
              <span>/</span>
              <span>{post.category}</span>
            </>
          }
          title={post.title}
          lede={post.excerpt}
          meta={
            <>
              <span className="chip chip--cool">{post.category}</span>
              <span className="measured">{post.readTime}</span>
              <time>Updated {post.modifiedAt}</time>
            </>
          }
        />

        {/* Inline practice CTA banner */}
        <div className="doc-panel doc-panel__head">
          <p className="doc-line">
            Practice these concepts interactively with AI feedback
          </p>
          <Link href="/auth" className="btn btn--small">
            Start Practicing
          </Link>
        </div>

        {/* Article body */}
        {post.content ? (
          <article
            className="blog-content doc-prose"
            dangerouslySetInnerHTML={{ __html: md(post.content) }}
          />
        ) : (
          <article className="blog-content doc-prose">
            <p>
              Full article coming soon.{" "}
              <Link href="/dashboard">Practice in the app</Link>.
            </p>
          </article>
        )}

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <section className="doc-section">
            <div className="doc-head">
              <h2 className="doc-h2">Practice These Topics</h2>
            </div>
            <LinkGrid
              items={relatedTopics.map((t) => ({
                href: `/${t.slug}`,
                title: t.keyword.charAt(0).toUpperCase() + t.keyword.slice(1),
                note: `${t.questionCount} questions`,
              }))}
            />
          </section>
        )}

        <DocClose
          title="Put This Into Practice"
          line="Reading articles is passive. JSPrep Pro makes you actively recall, predict output, and get AI feedback."
          actions={
            <>
              <Link href="/auth" className="btn btn--primary">
                Start Free
              </Link>
              <Link href={`/${track}-interview-questions`} className="btn">
                Browse All Questions
              </Link>
            </>
          }
        />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="doc-section">
            <div className="doc-head">
              <h2 className="doc-h2">Related Articles</h2>
            </div>
            <LinkGrid
              items={relatedPosts.map((p) => ({
                href: `/blog/${p.track ?? "javascript"}/${p.slug}`,
                title: p.title,
                note: `${p.category}, ${p.readTime}`,
              }))}
            />
          </section>
        )}
      </main>
    </div>
  );
}
