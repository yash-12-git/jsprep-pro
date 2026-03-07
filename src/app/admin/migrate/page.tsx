/** @jsxImportSource @emotion/react */
'use client'

import { useState } from 'react'
import { css } from '@emotion/react'
import { Layers, Newspaper, CheckCircle2, AlertTriangle, Loader2, Database } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { C, RADIUS } from '@/styles/tokens'
import { seedTopicsFromArray } from '@/lib/topics'
import { seedBlogPostsFromArray } from '@/lib/blogPosts'

// ── Import legacy static data ─────────────────────────────────────────────────
import { TOPICS as STATIC_TOPICS } from '@/data/seo/topics'
import { BLOG_POSTS as STATIC_POSTS } from '@/data/seo/blogPosts'

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  page: css`max-width: 48rem;`,

  heading: css`font-size: 1.5rem; font-weight: 900; margin-bottom: 0.375rem;`,

  sub: css`color: ${C.muted}; font-size: 0.875rem; line-height: 1.7; margin-bottom: 2rem; max-width: 38rem;`,

  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  `,

  card: (color: string, done: boolean) => css`
    background: ${C.card};
    border: 1px solid ${done ? color + '55' : C.border};
    border-radius: ${RADIUS.xl};
    padding: 1.25rem;
    position: relative;
    transition: border-color 0.2s;
  `,

  cardIcon: (color: string) => css`
    width: 2.25rem; height: 2.25rem;
    background: ${color}14;
    border: 1px solid ${color}30;
    border-radius: ${RADIUS.md};
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.75rem;
  `,

  cardTitle: css`font-size: 0.875rem; font-weight: 700; margin-bottom: 0.25rem;`,

  cardCount: (color: string) => css`
    font-size: 1.875rem; font-weight: 900; color: ${color}; line-height: 1;
    margin-bottom: 0.25rem;
  `,

  cardMeta: css`font-size: 0.75rem; color: ${C.muted};`,

  doneBadge: css`
    position: absolute; top: 0.875rem; right: 0.875rem;
    display: flex; align-items: center; gap: 0.25rem;
    font-size: 0.5625rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.06em;
    color: ${C.accent3}; background: ${C.accent3}14;
    border: 1px solid ${C.accent3}33;
    padding: 0.1875rem 0.5rem; border-radius: 0.25rem;
  `,

  warningBox: css`
    display: flex; align-items: flex-start; gap: 0.75rem;
    background: ${C.accent2}0d;
    border: 1px solid ${C.accent2}33;
    border-radius: ${RADIUS.xl};
    padding: 1rem 1.25rem;
    font-size: 0.8125rem; color: ${C.accent2}; line-height: 1.65;
    margin-bottom: 1.5rem;
  `,

  successBox: css`
    display: flex; align-items: center; gap: 0.75rem;
    background: ${C.accent3}0d;
    border: 1px solid ${C.accent3}33;
    border-radius: ${RADIUS.xl};
    padding: 1rem 1.25rem;
    font-size: 0.875rem; font-weight: 700; color: ${C.accent3};
    margin-bottom: 1.5rem;
  `,

  errorBox: css`
    background: ${C.danger}0d;
    border: 1px solid ${C.danger}33;
    border-radius: ${RADIUS.xl};
    padding: 1rem 1.25rem;
    font-size: 0.8125rem; color: ${C.danger};
    margin-bottom: 1.5rem;
  `,

  sectionTitle: css`
    font-size: 0.75rem; font-weight: 900; text-transform: uppercase;
    letter-spacing: 0.08em; color: ${C.muted}; margin-bottom: 0.875rem;
  `,

  migrateBtn: (loading: boolean) => css`
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    background: ${loading ? C.accent + '80' : C.accent};
    border: none; border-radius: ${RADIUS.xl};
    color: white; font-weight: 800; font-size: 0.9375rem;
    cursor: ${loading ? 'not-allowed' : 'pointer'};
    transition: all 0.15s ease;
    &:hover { background: ${loading ? '' : C.accent + 'ee'}; }
  `,

  log: css`
    margin-top: 1.5rem;
    background: #0a0a10;
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.xl};
    padding: 1rem 1.25rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    line-height: 1.9;
    max-height: 16rem;
    overflow-y: auto;
  `,

  logLine: (type: 'info' | 'success' | 'warn' | 'error') => css`
    color: ${
      type === 'success' ? C.accent3 :
      type === 'warn'    ? C.accent2 :
      type === 'error'   ? C.danger  :
      C.muted
    };
  `,

  divider: css`border: none; border-top: 1px solid ${C.border}; margin: 2rem 0;`,

  indexBox: css`
    background: #0a0a10;
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    padding: 0.875rem 1rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    line-height: 1.9;
    color: ${C.text};
    overflow-x: auto;
    margin-top: 0.5rem;
  `,
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface LogEntry { type: 'info' | 'success' | 'warn' | 'error'; text: string }
interface DoneState { topics?: boolean; blogs?: boolean }

// ─── Component ────────────────────────────────────────────────────────────────

export default function MigratePage() {
  const { user } = useAuth()
  const [migrating, setMigrating] = useState(false)
  const [done, setDone] = useState<DoneState>({})
  const [log, setLog] = useState<LogEntry[]>([])

  function addLog(type: LogEntry['type'], text: string) {
    setLog(prev => [...prev, { type, text }])
  }


  async function handleMigrate() {
    if (!user) return
    setMigrating(true)
    setLog([])

    try {
      addLog('info', `── Migrating ${STATIC_TOPICS.length} topics ──────────────────────`)

      const topicsToSeed = STATIC_TOPICS.map((t, i) => ({
        ...t,
        status: 'published' as const,
        order: i,
        relatedBlogSlugs: [] as string[],
      }))

      const { created: topicsCreated, errors: topicErrors } = await seedTopicsFromArray(topicsToSeed, user.uid)
      topicErrors.forEach(e => addLog('error', `  ✗ ${e}`))
      addLog('success', `  ✓ ${topicsCreated} topics written to Firestore`)
      setDone(prev => ({ ...prev, topics: true }))

      addLog('info', `── Migrating ${STATIC_POSTS.length} blog posts ─────────────────`)

      const postsToSeed = STATIC_POSTS.map(p => ({
        ...p,
        status: 'published' as const,
        topicSlug: '',
        relatedTopicSlugs: [] as string[],
        questionCategories: [] as string[],
      }))

      const { created: postsCreated, errors: postErrors } = await seedBlogPostsFromArray(postsToSeed, user.uid)
      postErrors.forEach(e => addLog('error', `  ✗ ${e}`))
      addLog('success', `  ✓ ${postsCreated} blog posts written to Firestore`)
      setDone(prev => ({ ...prev, blogs: true }))

      addLog('info', '─────────────────────────────────────────────────')
      addLog('success', `🎉 Done! ${topicsCreated} topics + ${postsCreated} posts in Firestore.`)
      addLog('warn', 'Next: open /admin/blog and set topicSlug on each post.')

    } catch (e: any) {
      addLog('error', `❌ ${e.message}`)
      addLog('warn', 'Check: are Firestore security rules deployed? See instructions below.')
    } finally {
      setMigrating(false)
    }
  }

  const allDone = done.topics && done.blogs

  return (
    <div css={S.page}>
      <h1 css={S.heading}>Migrate Content to Firestore</h1>
      <p css={S.sub}>
        One-time migration of your static <code style={{ color: C.accent3 }}>.ts</code> data files
        into Firestore. After this runs, topics and blog posts are managed entirely from the admin panel —
        no code changes needed to add, edit, or delete content.
      </p>

      {allDone && (
        <div css={S.successBox}>
          <CheckCircle2 size={18} />
          Migration complete! Topics and blog posts are now in Firestore.
        </div>
      )}

      {/* Data overview */}
      <div css={S.sectionTitle}>Data to migrate</div>
      <div css={S.grid}>
        {[
          { key: 'topics', label: 'Topics', count: STATIC_TOPICS.length, Icon: Layers,    color: C.accent,  desc: '36 interview topic pages with cheat sheets' },
          { key: 'blogs',  label: 'Blog Posts', count: STATIC_POSTS.length, Icon: Newspaper, color: C.purple, desc: '12 deep-dive articles with full content' },
        ].map(({ key, label, count, Icon, color, desc }) => (
          <div key={key} css={S.card(color, !!done[key as keyof DoneState])}>
            <div css={S.cardIcon(color)}><Icon size={16} color={color} /></div>
            <div css={S.cardTitle}>{label}</div>
            <div css={S.cardCount(color)}>{count}</div>
            <div css={S.cardMeta}>{desc}</div>
            {done[key as keyof DoneState] && (
              <div css={S.doneBadge}><CheckCircle2 size={9} /> Migrated</div>
            )}
          </div>
        ))}
      </div>

      <div css={S.sectionTitle}>Before migrating — deploy security rules</div>
      <div css={S.warningBox}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          <strong>Deploy Firestore rules first.</strong> The <code>topics</code> and <code>blog_posts</code> collections
          are new — Firestore will deny writes until the rules are deployed. Run this once from your project root:
          <pre style={{ margin: '0.5rem 0 0', fontFamily: 'monospace', fontSize: '0.8125rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', color: C.accent3 }}>
            firebase deploy --only firestore:rules
          </pre>
        </span>
      </div>

      <div css={S.warningBox}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          <strong>Run this only once.</strong> Running it again will create duplicates in Firestore.
          If you need to re-run, go to Firebase Console → Firestore and delete the <code>topics</code> and <code>blog_posts</code> collections first.
        </span>
      </div>

      <button css={S.migrateBtn(migrating)} onClick={handleMigrate} disabled={migrating}>
        {migrating
          ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Migrating…</>
          : <><Database size={16} /> Migrate {STATIC_TOPICS.length + STATIC_POSTS.length} items to Firestore</>
        }
      </button>

      {log.length > 0 && (
        <div css={S.log}>
          {log.map((entry, i) => (
            <div key={i} css={S.logLine(entry.type)}>{entry.text}</div>
          ))}
          {migrating && (
            <div css={S.logLine('info')}>
              <Loader2 size={11} style={{ display: 'inline', animation: 'spin 1s linear infinite', marginRight: '0.25rem' }} />
              running…
            </div>
          )}
        </div>
      )}

      <hr css={S.divider} />

      {/* After migration instructions */}
      <div css={S.sectionTitle}>After migrating</div>
      <ol style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 2.2, color: C.text }}>
        <li>
          Go to <a href="/admin/topics" style={{ color: C.accent }}>Admin → Topics</a> to verify all 36 topics appear.
        </li>
        <li>
          Go to <a href="/admin/blog" style={{ color: C.accent }}>Admin → Blog Posts</a> and set <code style={{ color: C.accent3 }}>topicSlug</code> and <code style={{ color: C.accent3 }}>relatedTopicSlugs</code> on each post.
        </li>
        <li>
          When adding new questions via <a href="/admin/questions/new" style={{ color: C.accent }}>Add Question</a>, use the "Topic Page" dropdown — questions will appear on that topic's page automatically.
        </li>
        <li>
          Create these Firestore composite indexes (Firebase Console → Firestore → Indexes):
          <pre css={S.indexBox}>{`Collection: topics
Index 1:  status ASC + order ASC
Index 2:  status ASC + difficulty ASC + order ASC

Collection: blog_posts
Index 1:  status ASC + publishedAt DESC
Index 2:  status ASC + topicSlug ASC + publishedAt DESC
Index 3:  status ASC + relatedTopicSlugs ARRAY + publishedAt DESC
Index 4:  status ASC + questionCategories ARRAY + publishedAt DESC`}
          </pre>
        </li>
        <li>
          Visit a topic page like <a href="/javascript-closure-interview-questions" style={{ color: C.accent }}>/javascript-closure-interview-questions</a> to confirm it loads from Firestore.
        </li>
      </ol>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}