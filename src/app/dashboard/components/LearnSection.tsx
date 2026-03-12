/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { C, TOPIC_DIFF_COLOR } from "@/styles/tokens";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Newspaper, ArrowRight, Clock } from "lucide-react";
import { getPublishedTopics } from "@/lib/topics";
import { getPublishedBlogPosts } from "@/lib/blogPosts";
import type { Topic } from "@/types/topic";
import type { BlogPost } from "@/types/blogPost";

// Module-level cache — survives navigation, cleared after 30min
// Prevents re-fetching topics/posts on every dashboard mount
const _cache: {
  topics?: { data: Topic[]; at: number };
  posts?: { data: BlogPost[]; at: number };
} = {};
const CACHE_MS = 30 * 60 * 1000;

const FEATURED_SLUGS = [
  "javascript-closure-interview-questions",
  "javascript-hoisting-interview-questions",
  "javascript-event-loop-interview-questions",
  "javascript-prototype-interview-questions",
  "javascript-this-keyword-interview-questions",
  "javascript-promise-interview-questions",
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const section = css`
  margin-bottom: 2rem;
`;

const sectionHeader = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.875rem;
`;

const sectionTitle = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 800;
  color: white;
`;

const seeAllLink = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: rgba(255, 255, 255, 0.75);
  }
`;

const topicsGrid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const topicCard = css`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem 1rem;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 0.875rem;
  text-decoration: none;
  transition:
    border-color 0.15s,
    background 0.15s;

  &:hover {
    border-color: rgba(106, 247, 192, 0.3);
    background: rgba(106, 247, 192, 0.04);
  }
`;

const topicName = css`
  font-size: 0.8125rem;
  font-weight: 700;
  color: white;
  line-height: 1.35;
`;

const topicMeta = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const diffDot = (color: string) => css`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${color};
  flex-shrink: 0;
`;

const diffLabel = (color: string) => css`
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${color};
`;

const metaSep = css`
  font-size: 0.5625rem;
  color: rgba(255, 255, 255, 0.2);
`;

const qCount = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.3);
`;

const blogList = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const blogCard = css`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 0.875rem;
  text-decoration: none;
  transition:
    border-color 0.15s,
    background 0.15s;

  &:hover {
    border-color: rgba(124, 106, 247, 0.3);
    background: rgba(124, 106, 247, 0.04);
  }
`;

const blogAccentBar = (color: string) => css`
  width: 3px;
  height: 2.25rem;
  border-radius: 2px;
  background: ${color};
  flex-shrink: 0;
`;

const blogInfo = css`
  flex: 1;
  min-width: 0;
`;

const blogTitle = css`
  font-size: 0.8125rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  margin-bottom: 3px;
`;

const blogMeta = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.35);
`;

const ctaBanner = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(124, 106, 247, 0.07);
  border: 1px solid rgba(124, 106, 247, 0.2);
  border-radius: 0.875rem;
  text-decoration: none;
  margin-top: 0.75rem;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover {
    background: rgba(124, 106, 247, 0.12);
    border-color: rgba(124, 106, 247, 0.35);
  }
`;

const ctaText = css`
  font-size: 0.875rem;
  font-weight: 700;
  color: #c4b5fd;
`;

const ctaSub = css`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
`;

const arrowStyle = css`
  color: rgba(124, 106, 247, 0.6);
  flex-shrink: 0;
`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function LearnSection() {
  const [featuredTopics, setFeaturedTopics] = useState<Topic[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const now = Date.now();

    // Topics — use module cache if fresh
    if (_cache.topics && now - _cache.topics.at < CACHE_MS) {
      const featured = _cache.topics.data
        .filter((t) => FEATURED_SLUGS.includes(t.slug))
        .slice(0, 4);
      setFeaturedTopics(featured);
    } else {
      getPublishedTopics()
        .then((all) => {
          _cache.topics = { data: all, at: Date.now() };
          setFeaturedTopics(
            all.filter((t) => FEATURED_SLUGS.includes(t.slug)).slice(0, 4),
          );
        })
        .catch(() => {});
    }

    // Posts — use module cache if fresh
    if (_cache.posts && now - _cache.posts.at < CACHE_MS) {
      setFeaturedPosts(_cache.posts.data.slice(0, 3));
    } else {
      getPublishedBlogPosts()
        .then((all) => {
          _cache.posts = { data: all, at: Date.now() };
          setFeaturedPosts(all.slice(0, 3));
        })
        .catch(() => {});
    }
  }, []);

  return (
    <div>
      {/* ── Interview Topics ── */}
      <div css={section}>
        <div css={sectionHeader}>
          <div css={sectionTitle}>
            <Layers size={15} color="#6af7c0" />
            Interview Topics
          </div>
          <Link href="/topics" css={seeAllLink}>
            All 36 topics <ArrowRight size={11} />
          </Link>
        </div>

        <div css={topicsGrid}>
          {featuredTopics.map((topic) => {
            const color = TOPIC_DIFF_COLOR[topic.difficulty] ?? "#fbbf24";
            const shortTitle = topic.title
              .replace("JavaScript ", "")
              .replace(" Interview Questions", "");
            return (
              <Link key={topic.slug} href={`/${topic.slug}`} css={topicCard}>
                <span css={topicName}>{shortTitle}</span>
                <div css={topicMeta}>
                  <span css={diffDot(color)} />
                  <span css={diffLabel(color)}>{topic.difficulty}</span>
                  <span css={metaSep}>·</span>
                  <span css={qCount}>{topic.questionCount} Qs</span>
                </div>
              </Link>
            );
          })}
        </div>

        <Link href="/topics" css={ctaBanner}>
          <div>
            <div css={ctaText}>Browse all interview topics</div>
            <div css={ctaSub}>
              Cheat sheets + interview tips for every concept
            </div>
          </div>
          <ArrowRight size={16} css={arrowStyle} />
        </Link>
      </div>

      {/* ── Blog ── */}
      <div css={section}>
        <div css={sectionHeader}>
          <div css={sectionTitle}>
            <Newspaper size={15} color="#a78bfa" />
            From the Blog
          </div>
          <Link href="/blog" css={seeAllLink}>
            All posts <ArrowRight size={11} />
          </Link>
        </div>

        <div css={blogList}>
          {featuredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} css={blogCard}>
              <div css={blogAccentBar(post.accentColor)} />
              <div css={blogInfo}>
                <span css={blogTitle}>{post.title}</span>
                <div css={blogMeta}>
                  <Clock size={10} />
                  {post.readTime}
                  <span>·</span>
                  <span>{post.category}</span>
                </div>
              </div>
              <ArrowRight
                size={13}
                css={css`
                  color: rgba(255, 255, 255, 0.2);
                  flex-shrink: 0;
                `}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
