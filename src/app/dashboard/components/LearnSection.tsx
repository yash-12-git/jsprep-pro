/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { C, RADIUS, TOPIC_DIFF_COLOR } from "@/styles/tokens";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Newspaper, ArrowRight, Clock } from "lucide-react";
import { getPublishedTopics } from "@/lib/topics";
import { getPublishedBlogPosts } from "@/lib/blogPosts";
import type { Topic } from "@/types/topic";
import type { BlogPost } from "@/types/blogPost";

// ─── Module-level cache — 30 min TTL ─────────────────────────────────────────
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

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  font-weight: 600;
  color: ${C.text};
`;

const seeAllLink = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${C.muted};
  text-decoration: none;
  transition: color 0.12s ease;
  &:hover {
    color: ${C.text};
  }
`;

const topicsGrid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const topicCard = css`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem 1rem;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  text-decoration: none;
  transition:
    border-color 0.12s ease,
    background 0.12s ease;
  &:hover {
    border-color: ${C.borderStrong};
    background: ${C.bgHover};
  }
`;

const topicName = css`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.text};
  line-height: 1.4;
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
  font-weight: 500;
  color: ${color};
`;

const metaSep = css`
  font-size: 0.5625rem;
  color: ${C.borderStrong};
`;

const qCount = css`
  font-size: 0.6875rem;
  color: ${C.muted};
`;

const blogList = css`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const blogCard = css`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  text-decoration: none;
  transition:
    border-color 0.12s ease,
    background 0.12s ease;
  &:hover {
    border-color: ${C.borderStrong};
    background: ${C.bgHover};
  }
`;

// Post accent bar — keeps per-post identity colour
const blogAccentBar = (color: string) => css`
  width: 3px;
  height: 2rem;
  border-radius: 2px;
  background: ${color};
  flex-shrink: 0;
  opacity: 0.8;
`;

const blogInfo = css`
  flex: 1;
  min-width: 0;
`;

const blogTitle = css`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.text};
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
  color: ${C.muted};
`;

const ctaBanner = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.125rem;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  text-decoration: none;
  margin-top: 0.625rem;
  transition: border-color 0.12s ease;
  &:hover {
    border-color: ${C.accent};
  }
`;

const ctaText = css`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${C.text};
`;

const ctaSub = css`
  font-size: 0.75rem;
  color: ${C.muted};
  margin-top: 2px;
`;

const arrowStyle = css`
  color: ${C.accent};
  flex-shrink: 0;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function LearnSection() {
  const [featuredTopics, setFeaturedTopics] = useState<Topic[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const now = Date.now();

    if (_cache.topics && now - _cache.topics.at < CACHE_MS) {
      setFeaturedTopics(
        _cache.topics.data
          .filter((t) => FEATURED_SLUGS.includes(t.slug))
          .slice(0, 4),
      );
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
            <Layers size={15} color={C.green} />
            Interview Topics
          </div>
          <Link href="/topics" css={seeAllLink}>
            All 36 topics <ArrowRight size={11} />
          </Link>
        </div>

        <div css={topicsGrid}>
          {featuredTopics.map((topic) => {
            const color = TOPIC_DIFF_COLOR[topic.difficulty] ?? C.amber;
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
            <Newspaper size={15} color={C.accent} />
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
                  color: ${C.muted};
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
