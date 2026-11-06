// app/blog/[track]/page.tsx
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { DocClose, DocHero } from "@/components/seo/DocParts";
import type { Metadata } from "next";
import { TRACKS, TRACK_MAP } from "@/lib/tracks";
import type { Track } from "@/lib/tracks";
import { TRACK_META } from "@/lib/seo/trackMeta";
import { getPublishedBlogPosts } from "@/lib/cachedQueries";
import { breadcrumbSchema, pageMeta } from "@/lib/seo/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return TRACKS.filter((t) => t.available).map((t) => ({ track: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: Track }>;
}): Promise<Metadata> {
  const { track } = await params;
  if (!TRACK_MAP[track]?.available) return {};
  const meta = TRACK_META[track];
  return pageMeta({
    title: meta.blogTitle,
    description: meta.blogDescription,
    path: `/blog/${track}`,
    keywords: meta.blogKeywords,
  });
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ track: Track }>;
}) {
  const { track } = await params;
  if (!TRACK_MAP[track]?.available) {
    // Legacy flat blog URLs (/blog/<slug>) were once indexed without the track
    // segment and now 404. If this param is actually a known post slug, 301 it
    // to its canonical /blog/<track>/<slug> path instead of 404-ing.
    const allPosts = await getPublishedBlogPosts();
    const match = allPosts.find((p) => p.slug === (track as string));
    if (match) permanentRedirect(`/blog/${match.track}/${match.slug}`);
    notFound();
  }

  const meta = TRACK_META[track];
  const posts = await getPublishedBlogPosts({ track });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: `/blog/${track}` },
          ]),
        }}
      />
      <main className="doc">
        <DocHero
          crumbs={
            <>
              <Link href="/">JSPrep Pro</Link>
              <span>/</span>
              <Link href={`/blog/${track}`}>Blog</Link>
            </>
          }
          title="Guides, Tips & Deep Dives"
          lede={`In-depth articles on ${meta.label} concepts that come up most in frontend interviews. Written by developers, for developers.`}
        />

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="doc-panel doc-panel__body">
            <p className="doc-h3">No posts yet for {meta.label}.</p>
            <p className="doc-line">Check back soon, we’re adding content.</p>
          </div>
        )}

        {/* Post list */}
        <div className="post-list">
          {posts.map((post) => (
            <article key={post.slug} className="post-row">
              <div className="doc-meta" style={{ marginTop: 0 }}>
                <span className="chip chip--cool">{post.category}</span>
                <span className="measured">{post.readTime}</span>
                <time>{post.publishedAt}</time>
              </div>
              <div>
                <h2 className="post-row__title">
                  <Link href={`/blog/${track}/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="doc-line">{post.excerpt}</p>
                <Link href={`/blog/${track}/${post.slug}`} className="link post-row__more">
                  Read article
                </Link>
              </div>
            </article>
          ))}
        </div>

        <DocClose
          title="Practice What You Learn"
          line="Every article in this blog has an interactive practice section in JSPrep Pro."
          actions={
            <Link href="/auth" className="btn btn--primary">
              Start Practicing Free
            </Link>
          }
        />
      </main>
    </div>
  );
}
