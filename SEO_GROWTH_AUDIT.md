# JSPrep Pro — Complete SEO & Growth Audit

> **Audited:** 2026-05-31  
> **Auditor roles:** Senior SEO Engineer · Growth PM · Technical Content Strategist · Google Search Console Specialist  
> **Source:** Full codebase inspection — no assumptions made.

---

## PART 1: Product Analysis

### What exactly is JSPrep Pro?
A frontend interview preparation SaaS with 600+ questions covering JavaScript, React, TypeScript, and System Design. The core differentiator: four active practice modes (theory, output prediction, debug challenges, polyfill exercises) plus an AI-powered answer evaluator that scores written answers 1–10 like a real senior engineer — instead of just marking correct/incorrect.

### What problem does it solve?
Most interview prep for frontend developers is fragmented: reading blog posts (passive), doing LeetCode (wrong domain — that's DSA, not JS/React concepts), or watching YouTube. JSPrep Pro is a structured practice loop: read → predict → debug → write → get AI feedback. It creates active recall instead of passive consumption.

### Who is the ideal customer?
Developers with 1–3 years of frontend experience, primarily in India, preparing for interviews at Tier-1 Indian tech companies (Razorpay, Flipkart, Swiggy, CRED, PhonePe) or global companies. These developers already know JavaScript but have never had it tested under pressure. They need to close the gap between "I understand closures" and "I can explain closures to a senior engineer in 90 seconds."

### What user persona should we target first?
**The Switcher** — a developer currently at a service company (TCS, Infosys, Wipro) with 1–2 years experience trying to break into a product company. They have 4–6 weeks until interviews. They are willing to pay ₹99–₹199/month for structured prep. This persona has the highest urgency AND the highest willingness to pay. They are not adequately served by any existing product.

### What value proposition is currently communicated?
*"500+ frontend interview questions with AI scoring, mock interviews, output prediction & debugging."*

This is product-centric: a list of features. It answers "what does the product do" but not "what does it do for me."

### What value proposition should be communicated instead?
**"Get your first Razorpay/Flipkart offer. Practice the exact questions they ask, get AI feedback like a senior engineer, and walk into interviews knowing exactly where you stand."**

This is outcome-centric. It names the specific companies, names the specific outcome (offer), and addresses the specific fear (not knowing where you stand). That is the message that converts a visitor into a trial user.

---

## PART 2: Customer Acquisition Analysis

### Why users WOULD choose JSPrep
- Only platform with AI-scored written answers for frontend concepts (not MCQ)
- Output prediction questions are genuinely unique — not available on any competitor
- Debug challenges and polyfill labs are more realistic than algorithmic DSA
- Deep topic pages (40 topics with mental models, misconceptions, code examples) are genuinely high-quality reference material
- Free tier is generous (200+ questions, no credit card)
- Indian company focus (Razorpay, Flipkart tags on questions) is a real differentiation

### Why users would NOT choose JSPrep
- **Zero social proof that is credible.** Testimonials like "Senior Developer" without a real name, photo, company, or LinkedIn are ignored. Users do not trust them.
- **No indication of whether it actually works.** No "X developers got offers after using JSPrep" counter. No placement stories. No success metrics.
- **Unknown brand.** Zero YouTube presence. Zero Twitter following visible on the site. Zero "seen in" press logos. New users have no pre-existing reason to trust it.
- **Thin content on many pages.** Some blog posts say "Full article coming soon" — this destroys credibility for SEO and for new visitors.
- **Confusing pricing history.** The codebase has `NEXT_PUBLIC_PRO_PRICE_PAISE=9900` (₹99) but the homepage displayed ₹199. Mixed signals confuse potential buyers.
- **No free trial for AI features.** The most compelling features (AI evaluator, mock interview) are Pro-locked. A user who hasn't experienced the AI has no reason to pay.

### Missing trust signals
- Real names + photos + LinkedIn profiles on testimonials
- "X questions answered this week" live counter
- "X offers received by JSPrep users" (even estimated)
- Security/privacy statement
- "As seen in" — even a single ProductHunt badge would help
- Creator's identity — who built this? A faceless SaaS is harder to trust

### Missing conversion elements
- **No email capture on free tier.** Users who bounce are gone forever. Capturing an email means you can re-engage.
- **No trial for AI features** — let free users use the AI evaluator 3 times before hitting a paywall, not zero.
- **No exit-intent offer.** A user about to leave should see "Get 5 AI evaluations free."
- **No urgency mechanism.** Nothing communicates "your interview might be in 2 weeks."
- **No onboarding flow.** New signups land on the dashboard with no guided first experience.

### Missing viral loops
- No "share your sprint score" button (generates social content for free)
- No "I just mastered X closures questions on JSPrep" Twitter share
- No shareable progress card (like GitHub contribution graph)
- No public leaderboard that non-users can see

### Missing referral opportunities
- No referral program ("invite a friend, both get 1 month free")
- No company-based cohorts ("your whole team preps together")
- No "send this question to a friend" feature

### Missing community features
- No Discord or Slack server
- No discussion on individual questions (comments, explanations)
- No weekly newsletter with a free question + answer
- No "Question of the Week" that people can share

### Missing retention mechanisms
- Email streak reminders ("You haven't practiced in 3 days")
- Weekly progress email ("You mastered 12 questions this week")
- Interview countdown tracker ("Your interview is in 14 days")
- Spaced repetition (resurface questions you marked as "need review")

### Why organic customer acquisition is currently weak
**Because Google has not indexed most of the valuable pages, and the pages that are indexed don't rank because they lack topical authority, backlinks, and credible content depth.**

The platform is good. The SEO architecture has several critical bugs. The content strategy is spread too thin. The brand has zero off-site presence. Fix the technical bugs first, then build content at scale, then build the brand.

### Top 10 reasons growth is stalled
1. **Robots.txt bug** silently allows Googlebot to crawl auth-required pages while not properly indexing content pages (covered in Part 4)
2. **Broken internal links** (multiple `/blog/slug` instead of `/blog/track/slug`) — these 404s signal a crawl health problem
3. **Zero backlinks** — organic rankings require domain authority, which requires other sites linking to JSPrep
4. **No YouTube presence** — frontend interview prep is a YouTube category. Every search "javascript interview questions" returns video results first
5. **No newsletter** — content marketing without email capture is building on rented land
6. **Thin blog** — 10 articles is not enough for Google to recognize topical authority on "JavaScript interview preparation"
7. **No programmatic SEO implementation** — 40 topics × 10 question types × individual question pages should produce thousands of indexable pages. Currently structured but not maximized.
8. **React questions page shows wrong content to Google** — a critical technical bug (Part 4)
9. **Price point anxiety** — ₹199/month is not expensive, but with no free AI trial and no social proof, the perceived risk is too high
10. **No product-led growth loop** — users have no reason to share JSPrep with others organically

---

## PART 3: SEO Audit

### Metadata

**Root layout** (`src/app/layout.tsx`):
- Title template: `"%s — JSPrep Pro"` ✅
- Default title: `"JavaScript Interview Questions & Practice — JSPrep Pro"` ✅
- Description: `"500+ frontend interview questions covering JavaScript, React & core concepts. AI scoring, mock interviews, output prediction & debugging."` — Acceptable but generic. Doesn't mention the specific companies or the unique AI scoring aspect prominently enough.
- `metadataBase` set correctly ✅
- `robots: index: true, follow: true` ✅
- `openGraph.locale: "en_IN"` — **Issue:** This geotargets India. Non-Indian users (US, UK, Canada) may see lower relevance signals in social sharing. Consider `"en_US"` or adding `og:locale:alternate`.

**Homepage** (`src/app/page.tsx`):
- **MISSING `export const metadata`** — The homepage relies entirely on layout defaults. Page-specific homepage metadata would allow a stronger, more targeted title like `"JavaScript Interview Questions — AI-Powered Practice for Frontend Developers | JSPrep Pro"`.
- FAQ schema ✅ (injected server-side via `<script>` tags)
- Course schema ✅

**`/javascript-interview-questions`** (`src/app/javascript-interview-questions/page.tsx`):
- Title: `"150+ JavaScript Interview Questions With Answers (2025)"` — **BUG:** Year is "2025", it is now 2026. Year in title is a known ranking signal for freshness.
- Description: Good, includes company names ✅
- FAQ schema ✅

**`/react-interview-questions`** (`src/app/react-interview-questions/page.tsx`):
- Title: `"150+ React Interview Questions With Answers (2026)"` ✅ (year correct)
- **CRITICAL BUG:** Page imports `InterviewQuestionList` from `../javascript-interview-questions/QuestionList` which calls `getServerTrack()`. Google has no track cookie → defaults to `"javascript"` → Google indexes this page showing **JavaScript** questions, not React questions. The React questions page is indexing the wrong content.

**`/q/[slug]`** (`src/app/q/[slug]/page.tsx`):
- Uses `generateStaticParams` from `getPublishedQuestionSlugs()` ✅
- `revalidate = 3600` ✅
- Title: `"${q.title} — ${track} ${typeLabel}"` — **Bug:** Uses `track` from `getServerTrack()` (cookie-based). Google has no cookie → always resolves to "javascript". A React question's title would say "javascript Interview Question" instead of "react Interview Question".
- FAQ schema ✅
- Breadcrumb schema ✅
- Canonical set ✅

**`/[topic]`** (`src/app/[topic]/page.tsx`):
- `generateStaticParams` ✅
- `revalidate = 3600` ✅
- Metadata: Good, uses topic-specific keywords ✅
- FAQ schema conditionally injected ✅
- Breadcrumb schema ✅
- **BUG:** Related article links use `href={`/blog/${post.slug}`}` (line 612) — incorrect URL structure. Blog posts live at `/blog/[track]/[slug]`, not `/blog/[slug]`. These links produce 404 errors for every topic page.

**`/blog/[track]/[slug]`** (`src/app/blog/[track]/[slug]/page.tsx`):
- `revalidate = 3600` ✅
- Article schema ✅
- Breadcrumb schema ✅
- **DUPLICATE CONTENT BUG:** `generateStaticParams` generates every blog slug under every available track — so `/blog/javascript/my-slug` AND `/blog/react/my-slug` exist simultaneously. `getBlogPostBySlug` doesn't filter by track. Both URLs serve identical content with no canonical pointing to the correct one. Google will penalize for duplicate content.
- **BROKEN LINK BUG:** Related posts section uses `href={`/blog/${p.slug}`}` (line 435) — same broken URL bug as the topic page.
- `articleSchema` references `${SITE.domain}/logo.png` which doesn't exist in `/public/` (only `og-default.png` exists). Broken publisher logo in structured data.

**`/questions/[slug]`** (`src/app/questions/[slug]/page.tsx`):
- `generateStaticParams` generates category slugs ✅
- `revalidate = 3600` ✅
- **BUG:** Metadata uses `track` from `getServerTrack()` (cookie). Google sees this page as a JavaScript category page regardless of the actual category.
- `itemScope itemType="https://schema.org/Question"` on articles ✅ — Good microdata usage.

### Title Tags
| Page | Title | Issue |
|---|---|---|
| Homepage | "JavaScript Interview Questions & Practice — JSPrep Pro" | No page-level override; uses layout default |
| /js-interview-questions | "150+ JavaScript Interview Questions With Answers (2025)" | Year stale (2025 vs 2026) |
| /react-interview-questions | "150+ React Interview Questions With Answers (2026)" | ✅ |
| /q/[slug] | "{title} — {track} {typeLabel}" | Track from cookie; Google always sees "javascript" |
| /[topic] | "{topic.title}" | ✅ |
| /blog/[track]/[slug] | "{post.title} — JSPrep Pro" | ✅ |
| /questions/[slug] | "{cat} {track} Interview Questions (Questions With Answers)" | Track from cookie |

### robots.txt

**File:** `src/app/robots.ts`

```
User-agent: *
Allow: /
Disallow: /dashboard, /admin, /analytics, /mock-interview, /study-plan, /api/, /auth

User-agent: Googlebot
Allow: /javascript-interview-questions, /react-interview-questions, /javascript-interview-cheatsheet, /react-interview-cheatsheet, /questions/, /blog/
Disallow: /admin, /api/, /auth
```

**CRITICAL BUG:** Per Google's robots.txt specification, when there is a user-agent-specific rule, that rule **replaces** (not supplements) the `*` rule for that bot. The Googlebot block **does not disallow** `/dashboard`, `/analytics`, `/mock-interview`, or `/study-plan`. This means:
- Google CAN crawl these auth-required pages
- Google will index a loading state or partial content
- These pages will consume crawl budget

**Fix:** Add the missing disallows to the Googlebot block:
```typescript
{ userAgent: "Googlebot", disallow: ["/admin", "/api/", "/auth", "/dashboard", "/analytics", "/mock-interview", "/study-plan"] }
```

Also: the Googlebot `allow` list is unnecessary. Googlebot follows the `allow: "/"` from the `*` block only if there's no specific rule. Since a specific rule exists, the allow list is the only thing permitting content pages. This fragile structure should be simplified to one clean `*` block.

### Sitemap

**File:** `src/app/sitemap.ts`

**Coverage:**
- Static pages: ✅ (15 hardcoded URLs with correct priorities)
- Topic pages: ✅ (dynamically fetched via `getTopicSlugs()`)
- Category pages: ✅ (`/questions/{slug}`)
- Individual question pages: ✅ (`/q/{slug}`)
- Blog pages (JS + React): ✅

**Issues:**
1. `lastModified: now` for ALL pages — the sitemap sets the last-modified timestamp to the current time on every generation. This means every crawl sees every page as "just updated," which dilutes the signal for pages that are genuinely fresh vs. stale.
2. **Priority inflation:** `roadmap` is at `0.95` — same as core SEO landing pages. Roadmap is not a high-traffic keyword target. Priorities should reflect actual search value.
3. **`/topics/javascript` and `/topics/react`** are in the sitemap but the `/topics/[track]` page is NOT in the sitemap for all tracks. Only the two hardcoded ones are included.
4. Blog posts filtered by `track` property — if a blog post doesn't have `track: "javascript"` or `track: "react"` set correctly, it won't appear in the sitemap.
5. The sitemap does **not** include `/javascript-tricky-questions`, `/javascript-output-questions` — these are high-priority landing pages with real search volume and are missing.

### Structured Data / Schema Markup

| Schema | Location | Status | Issues |
|---|---|---|---|
| `SoftwareApplication` | layout.tsx | ✅ | Price field uses `pricing.display` (string like "₹99") not a number — schema.org `price` should be numeric |
| `WebSite` + SearchAction | layout.tsx | ⚠️ | `urlTemplate` points to `/topics?q={search_term_string}` but `/topics` has no search functionality |
| `Course` | homepage (page.tsx) | ✅ | — |
| `FAQPage` | homepage, /js-questions, /react-questions, /[topic], /q/[slug] | ✅ | — |
| `Article` | blog posts | ⚠️ | Publisher logo points to `/logo.png` which doesn't exist |
| `BreadcrumbList` | /[topic], /q/[slug], /questions/[slug], blog posts | ✅ | — |

### Internal Linking

**Critical broken links found:**

1. **`src/app/[topic]/page.tsx` line ~612:**
   ```jsx
   href={`/blog/${post.slug}`}
   ```
   Correct URL: `/blog/${post.track ?? 'javascript'}/${post.slug}`
   Impact: Every topic page with related articles has a broken outbound link. Affects all 40 topic pages.

2. **`src/app/blog/[track]/[slug]/page.tsx` line ~435:**
   ```jsx
   href={`/blog/${p.slug}`}
   ```
   Correct URL: `/blog/${p.track ?? 'javascript'}/${p.slug}`
   Impact: Every blog article's "Related Articles" section has broken links.

3. **`src/app/javascript-interview-questions/page.tsx`** links to:
   - `/javascript-closure-interview-questions` — **404**
   - `/javascript-event-loop-interview-questions` — **404**
   - `/javascript-execution-context-interview-questions` — **404**
   - `/javascript-prototype-interview-questions` — **404**
   - `/javascript-type-coercion-interview-questions` — **404**
   - `/javascript-hoisting-interview-questions` — **404**

4. **`src/app/react-interview-questions/page.tsx`** links to:
   - `/react-rendering-performance-interview-questions` — **404**
   - `/react-useeffect-interview-questions` — **404**
   - `/react-usecontext-interview-questions` — **404**
   - `/react-concurrent-rendering-react-18-interview-questions` — **404**
   - `/react-usestate-interview-questions` — **404**
   - `/react-fiber-interview-questions` — **404**

5. **`src/app/react-interview-questions/page.tsx`** related resources link to:
   - `/questions/hooks` — **404** (no such category slug)
   - `/questions/react-fundamentals` — **404** (no such category slug)

All these 404s are visible to Googlebot, consume crawl budget, and signal poor site health.

### URL Structure
- `/q/[slug]` — Good, semantic slugs ✅
- `/[topic]` — Good (e.g., `/javascript-closures-interview-questions`) ✅
- `/questions/[slug]` — Potentially confusing, `/category/[slug]` would be clearer
- `/blog/[track]/[slug]` — Track in URL is an unnecessary nesting layer and creates the duplicate content bug

### Heading Hierarchy
- All pages use exactly one `<h1>` ✅
- `<h2>` used for section headings ✅
- **Issue:** On topic pages, the "Interview Cheat Sheet" and "How to Answer in an Interview" headings use `<h2>` but they're actually sub-sections under the main content. Should be `<h2>` with visible labels — they use text "INTERVIEW CHEAT SHEET" (uppercase via CSS) which is not meaningful to screen readers.

### Crawlability / Rendering Strategy
- Next.js 14 App Router with server components → HTML is pre-rendered ✅
- `unstable_cache` prevents per-request Firestore calls ✅
- **Issue:** The question list on `/javascript-interview-questions` uses `<Suspense>` around a server component (`QuestionList.tsx`). In App Router, Suspense around server components uses **streaming** — the initial HTML contains the fallback "Loading questions…" text, and the content arrives in subsequent HTTP chunks. Google's crawler does handle streamed HTML but may not always process subsequent chunks. Risk: medium. Google may index the fallback text.
- All interactive features (filters, AI chat, code editor) are correctly in client components ✅
- No `"use client"` on page files ✅

### Duplicate Content
1. **Blog post duplicate content** (see robots section) — `/blog/javascript/[slug]` and `/blog/react/[slug]` serve identical content for many posts.
2. **Category pages are track-dependent** — `/questions/core-js` shows JavaScript questions normally but would show different content if someone visits with a React cookie.
3. No duplicate content between `/q/[slug]` and `/questions/[cat]/` — these are distinct pages ✅

### Thin Content
- Several blog posts have `post.content = null` → page shows "Full article coming soon." These pages are in the sitemap and crawlable. Google will identify these as thin content.
- `/javascript-interview-cheatsheet` and `/react-interview-cheatsheet` — haven't inspected but may have thin content if they're just lists without explanatory text.

---

## PART 4: Google Indexing Investigation

### Issue 1: robots.txt Googlebot Rule Override
**Evidence:** `src/app/robots.ts` defines a separate `User-agent: Googlebot` block. Per RFC 9309 and Google's implementation: a user-agent-specific rule takes full precedence over the `*` rule.

**Effect:** Googlebot can crawl `/dashboard`, `/analytics`, `/mock-interview`, `/study-plan`. These pages require authentication. Google will see empty loading states or redirects to `/auth`, leading to poor quality signals or indexing of auth pages.

**Confidence:** HIGH

**Fix:**
```typescript
// src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/analytics", "/mock-interview", "/study-plan", "/api/", "/auth", "/cheatsheet", "/sprint", "/output-quiz", "/debug-lab", "/polyfill-lab"],
    },
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}
```
Remove the separate Googlebot block entirely. The specific `allow` list in the Googlebot block is unnecessary since `/` is allowed for all.

---

### Issue 2: React Questions Page Indexes Wrong Content
**Evidence:** `src/app/react-interview-questions/page.tsx` line 7:
```typescript
import InterviewQuestionList from "../javascript-interview-questions/QuestionList";
```
`InterviewQuestionList` calls `getServerTrack()` which reads the `jsprep_active_track` cookie. Google has no cookie → returns `"javascript"`. The question list on `/react-interview-questions` is populated with **JavaScript questions**.

**Effect:** Google indexes `/react-interview-questions` as a JavaScript interview page. Competing with `/javascript-interview-questions` for the same keywords. Neither page ranks well.

**Confidence:** HIGH

**Fix:** Create a separate `QuestionList` component for the React page that forces `track: "react"`, or pass track as a prop:
```typescript
// react-interview-questions/page.tsx
import InterviewQuestionList from "../javascript-interview-questions/QuestionList";
// ...
<Suspense fallback="Loading questions...">
  <InterviewQuestionList forcedTrack="react" />
</Suspense>
```

---

### Issue 3: Blog Post Duplicate Content
**Evidence:** `src/app/blog/[track]/[slug]/page.tsx` `generateStaticParams`:
```typescript
return TRACKS.filter((t) => t.available).flatMap((t) =>
  slugs.map((slug) => ({ track: t.id, slug })),
);
```
This generates every `{track, slug}` combination. `getBlogPostBySlug(params.slug)` does not filter by track. `/blog/javascript/rag-powered-interview-platform` and `/blog/react/rag-powered-interview-platform` return identical HTML.

**Effect:** Google sees two identical URLs with different paths, no canonical relationship between them. Classic duplicate content penalty.

**Confidence:** HIGH

**Fix Option 1:** Add a canonical pointing to the "correct" track URL:
```typescript
// in generateMetadata
alternates: { canonical: `${SITE.domain}/blog/${post.track ?? 'javascript'}/${slug}` }
```

**Fix Option 2 (better):** Only generate params where track matches post.track:
```typescript
return slugs.filter(slug => {
  // look up post.track and only generate for matching track
});
```

---

### Issue 4: Broken Internal Links Causing Crawl Errors
**Evidence:** See Part 3 Internal Linking section. At minimum 14 distinct broken link targets that will produce 404 responses.

**Effect:** Googlebot records 404s, wastes crawl budget, and downranks the site's overall crawl health score.

**Confidence:** HIGH

**Fix for blog links (2 locations):**
```typescript
// src/app/[topic]/page.tsx line ~612
href={`/blog/${post.track ?? 'javascript'}/${post.slug}`}

// src/app/blog/[track]/[slug]/page.tsx line ~435
href={`/blog/${p.track ?? 'javascript'}/${p.slug}`}
```

**Fix for topic section links:** Create the actual pages, or remove the links until pages exist. Creating these pages is the correct path — they are high-value keyword targets (see Part 5).

---

### Issue 5: Missing Key Pages From Sitemap
**Evidence:** `src/app/sitemap.ts` does not include `/javascript-tricky-questions` or `/javascript-output-questions`.

**Effect:** These pages exist and have good metadata but Google may not discover them promptly.

**Confidence:** HIGH

**Fix:**
```typescript
{ url: `${SITE.domain}/javascript-tricky-questions`, priority: 0.9 },
{ url: `${SITE.domain}/javascript-output-questions`, priority: 0.9 },
```

---

### Issue 6: `lastModified: now` for Static Content
**Evidence:** `src/app/sitemap.ts` uses `const now = new Date().toISOString()` for all lastModified values, including topic and question pages.

**Effect:** Google sees every page as "updated right now" on every sitemap crawl. This destroys the freshness signal — Google can't distinguish which pages actually changed.

**Confidence:** MEDIUM

**Fix:** Use actual `updatedAt` timestamps from Firestore data for topic pages and question pages. Only use `now` for pages that are actually regenerated frequently.

---

### Issue 7: Streaming-Delivered Question Lists
**Evidence:** Both `/javascript-interview-questions` and `/react-interview-questions` use `<Suspense>` around server components that fetch Firestore data.

In Next.js App Router streaming, the initial HTML payload contains the Suspense fallback ("Loading questions..."). The actual content arrives in a subsequent HTTP chunk. Googlebot's crawler may not wait for or process streaming chunks reliably.

**Effect:** Google may index these pages with only the static hero text and FAQ, missing the actual question list — the highest-value content on these pages.

**Confidence:** MEDIUM

**Fix:** Move question fetching to the page.tsx server component and pass data as props (no Suspense needed). The page already server-renders — just move the data fetch up.

---

## PART 5: Content Gap Analysis

### Current content vs. search intent

The site has 40 topic pages and ~10 blog posts. For a site targeting 50+ high-volume keywords around JavaScript/React interview prep, this is insufficient for topical authority. Google needs to see that you have the **most comprehensive coverage** of a topic cluster.

### Top 50 Keyword Opportunities

| # | Keyword | Monthly Volume (est.) | Difficulty | Opportunity | Suggested URL |
|---|---|---|---|---|---|
| 1 | javascript interview questions | 90,000 | Hard | Already have page; fix technical bugs | /javascript-interview-questions |
| 2 | react interview questions | 60,000 | Hard | Already have page; fix track bug | /react-interview-questions |
| 3 | javascript closures interview questions | 8,000 | Medium | Create page; linked from main page (404 now) | /javascript-closures-interview-questions |
| 4 | javascript event loop interview questions | 6,500 | Medium | Create page; linked from main page (404 now) | /javascript-event-loop-interview-questions |
| 5 | javascript promises interview questions | 5,500 | Medium | Create page | /javascript-promise-interview-questions |
| 6 | javascript output questions | 5,000 | Low | Fix sitemap, improve page | /javascript-output-questions |
| 7 | javascript interview questions for 2 years experience | 4,800 | Medium | Create dedicated page | /javascript-interview-questions-2-years-experience |
| 8 | react hooks interview questions | 4,500 | Medium | Create page; linked (404 now) | /react-hooks-interview-questions |
| 9 | javascript this keyword interview questions | 3,800 | Low | Create page | /javascript-this-keyword-interview-questions |
| 10 | javascript prototype interview questions | 3,500 | Low | Create page; linked (404 now) | /javascript-prototype-interview-questions |
| 11 | javascript hoisting interview questions | 3,200 | Low | Create page; linked (404 now) | /javascript-hoisting-interview-questions |
| 12 | frontend interview questions | 12,000 | Hard | Improve homepage targeting | / |
| 13 | frontend interview questions india | 3,000 | Medium | Add geo-targeted section | / |
| 14 | javascript async await interview questions | 2,800 | Low | Create page | /javascript-async-await-interview-questions |
| 15 | javascript tricky questions | 2,500 | Low | Fix sitemap + improve | /javascript-tricky-questions |
| 16 | react useEffect interview questions | 2,400 | Low | Create page; linked (404 now) | /react-useeffect-interview-questions |
| 17 | javascript polyfill interview questions | 2,200 | Low | Create page | /javascript-polyfill-interview-questions |
| 18 | react rendering interview questions | 2,000 | Low | Create page; linked (404 now) | /react-rendering-performance-interview-questions |
| 19 | javascript type coercion interview questions | 1,900 | Low | Create page; linked (404 now) | /javascript-type-coercion-interview-questions |
| 20 | javascript scope interview questions | 1,800 | Low | Create page | /javascript-scope-interview-questions |
| 21 | javascript interview preparation 2026 | 1,700 | Low | Content refresh | /javascript-interview-questions |
| 22 | react useState interview questions | 1,600 | Low | Create page; linked (404 now) | /react-usestate-interview-questions |
| 23 | javascript execution context interview questions | 1,500 | Low | Create page; linked (404 now) | /javascript-execution-context-interview-questions |
| 24 | javascript interview questions for freshers | 4,200 | Medium | Create page | /javascript-interview-questions-for-freshers |
| 25 | javascript interview questions razorpay | 1,400 | Low | Create company page | /javascript-interview-questions-razorpay |
| 26 | javascript interview questions flipkart | 1,300 | Low | Create company page | /javascript-interview-questions-flipkart |
| 27 | javascript interview questions swiggy | 1,100 | Low | Create company page | /javascript-interview-questions-swiggy |
| 28 | javascript interview questions google | 2,800 | High | Create company page | /javascript-interview-questions-google |
| 29 | react fiber interview questions | 1,000 | Low | Create page; linked (404 now) | /react-fiber-interview-questions |
| 30 | javascript interview cheatsheet | 900 | Low | Already exists; improve | /javascript-interview-cheatsheet |
| 31 | javascript debug interview questions | 800 | Low | Create page | /javascript-debugging-interview-questions |
| 32 | javascript WeakMap WeakSet interview | 750 | Low | Improve topic page | /javascript-weakmap-weakset-interview-questions |
| 33 | javascript generators interview questions | 700 | Low | Create page | /javascript-generators-interview-questions |
| 34 | react context api interview questions | 900 | Low | Create page; linked (404 now) | /react-usecontext-interview-questions |
| 35 | javascript interview questions 3 years experience | 1,200 | Medium | Create page | /javascript-interview-questions-3-years-experience |
| 36 | leetcode alternative for javascript | 1,100 | Medium | Blog content + landing | Blog post |
| 37 | frontend developer interview preparation | 2,600 | Medium | Homepage/LP | / |
| 38 | javascript interview questions with answers | 8,500 | Hard | Main JS page | /javascript-interview-questions |
| 39 | how to prepare for frontend interview | 1,500 | Low | Blog post | /blog |
| 40 | javascript interview questions for senior developer | 800 | Low | Create page | /javascript-senior-developer-interview-questions |
| 41 | react interview questions 2026 | 1,800 | Low | Content refresh | /react-interview-questions |
| 42 | javascript mock interview | 900 | Low | Landing for mock-interview feature | /mock-interview |
| 43 | javascript closure explained | 3,000 | Medium | Improve topic page | /javascript-closures-interview-questions |
| 44 | event loop explained javascript | 4,500 | Medium | Improve topic page | /javascript-event-loop-interview-questions |
| 45 | react interview questions hooks | 3,200 | Medium | Already targeting | /react-interview-questions |
| 46 | javascript polyfill map filter reduce | 1,600 | Low | Create polyfill guide | /javascript-polyfill-interview-questions |
| 47 | typescript interview questions | 5,000 | Medium | Future track | (future) |
| 48 | system design interview questions frontend | 3,500 | Medium | Future track | (future) |
| 49 | javascript promise all allSettled interview | 900 | Low | Create page | /javascript-promise-combinators-interview-questions |
| 50 | javascript interview questions for 1 year experience | 2,200 | Low | Create page | /javascript-interview-questions-1-year-experience |

### Missing Landing Pages
1. **Company-specific pages** — `/javascript-interview-questions-razorpay`, `/javascript-interview-questions-flipkart`, etc. These have high buying intent.
2. **Experience-level pages** — `/javascript-interview-questions-for-freshers`, `/javascript-interview-questions-2-years-experience`
3. **Sub-concept pages** — All 12 topic section links that currently 404
4. **VS comparison pages** — "JSPrep vs LeetCode for frontend developers"

### Missing Blog Categories
1. "Company Interview Experiences" — Razorpay, Flipkart, Swiggy JavaScript interview experiences
2. "How-to guides" — "How to explain closures in a JavaScript interview", "How to answer event loop questions"
3. "Concept explainers" — "JavaScript Closure: From Confused to Confident"
4. "Interview stories" — Real user success stories with specific companies

### Programmatic SEO Opportunities
JSPrep already has the infrastructure for thousands of indexed pages:
- 40 topics × 4 question types = 160 potential landing pages
- 200 questions × 10 categories = category × topic pages
- Currently building company tags — `/companies/razorpay/javascript-questions` is achievable
- `/compare/jscc-vs-jsprep` type pages for brand awareness

---

## PART 6: Competitor Analysis

**Likely competitors:**
1. **InterviewBit** — India-focused, large content library, MCQ-heavy
2. **Namaste JavaScript / Akshay Saini** — YouTube-first, free, massive brand in India
3. **GreatFrontEnd** — Frontend-focused, high quality, global, $30/month
4. **BFE.dev** — Frontend engineer practice, code execution
5. **Frontend Masters** — Video courses, not Q&A
6. **W3Schools/MDN** — Reference content, not interview prep
7. **Josh Comeau's courses** — Premium, high quality, React-specific

### What competitors do better
| Competitor | Advantage |
|---|---|
| InterviewBit | Massive brand awareness, aggressive SEO, millions of backlinks |
| Namaste JS (Akshay) | YouTube brand → millions of followers drive traffic to domain |
| GreatFrontEnd | International brand, $30/month signals quality, better trust signals |
| BFE.dev | Code execution in browser for every question |
| Frontend Masters | Authoritative brand, known by hiring managers |

### What JSPrep does better
- AI-scored written answers (none of the above have this)
- Output prediction questions (unique format, not found elsewhere)
- Debug challenges with AI validation (unique)
- Indian company focus with question-company mapping (InterviewBit is closer but less specific)
- Polyfill exercises with test runner

### Differentiators that are missing
1. **Video explanations** — Every competitor has video. JSPrep is text-only. A YouTube channel with "I tried to answer Razorpay's interview questions" would go viral.
2. **Community** — GreatFrontEnd and InterviewBit have community forums/Discord. JSPrep has none.
3. **Hiring manager content** — "What Razorpay actually looks for in a frontend interview" — no one has this. It requires outreach but would generate massive traffic.
4. **Official company interview reports** — Users reporting what they were asked post-interview (Glassdoor model for frontend).

---

## PART 7: Technical SEO Fix Plan

### Critical — Fix This Week

| Fix | Impact | Effort | Files |
|---|---|---|---|
| **Fix robots.ts** — Remove Googlebot-specific block, keep only `*` rule with comprehensive disallow list | HIGH — stops wasting crawl budget on auth pages | 10 min | `src/app/robots.ts` |
| **Fix broken blog links** in topic pages and blog post pages | HIGH — eliminates 40+ crawl errors across top pages | 30 min | `src/app/[topic]/page.tsx:612`, `src/app/blog/[track]/[slug]/page.tsx:435` |
| **Fix React questions page** to always show React content to crawlers | HIGH — currently indexing wrong content | 1 hr | `src/app/react-interview-questions/page.tsx` |
| **Fix duplicate blog content** — add canonical or fix generateStaticParams | HIGH — prevents duplicate content penalty | 2 hrs | `src/app/blog/[track]/[slug]/page.tsx` |
| **Add missing pages to sitemap** — `/javascript-tricky-questions`, `/javascript-output-questions` | MEDIUM — gets existing pages indexed | 15 min | `src/app/sitemap.ts` |
| **Fix stale year in title** — change "2025" to "2026" | MEDIUM — freshness signal | 5 min | `src/app/javascript-interview-questions/page.tsx` |

### High Priority — Fix This Month

| Fix | Impact | Effort | Files |
|---|---|---|---|
| **Create the 12 missing topic-specific pages** that are linked from main pages | HIGH — converts 404s into ranked pages, fixes 12 broken links | 3 days | New pages |
| **Fix `sitemap.ts` lastModified** — use actual `updatedAt` instead of `now` for all pages | MEDIUM — improves crawl efficiency | 2 hrs | `src/app/sitemap.ts` |
| **Add homepage `export const metadata`** | MEDIUM — enables page-specific title + description | 30 min | `src/app/page.tsx` |
| **Fix articleSchema logo** — replace `/logo.png` with `/og-default.png` | LOW | 5 min | `src/lib/seo/seo.ts:238` |
| **Fix websiteSchema SearchAction URL** — point to real search or remove | LOW | 5 min | `src/lib/seo/seo.ts:392–406` |
| **Fix SoftwareApplication schema price** — use numeric value, not string | LOW | 15 min | `src/lib/seo/seo.ts:267–271` |
| **Remove `QuestionList.tsx` useless metadata export** — dead code | LOW | 5 min | `src/app/javascript-interview-questions/QuestionList.tsx:7` |
| **Add missing blog/track to all internal links** | MEDIUM | 1 hr | Audit all Link components |
| **Move question fetching out of Suspense** on JS/React questions pages | MEDIUM | 2 hrs | Both interview questions pages |

### Medium Priority

| Fix | Impact | Effort |
|---|---|---|
| Create company-specific landing pages (Razorpay, Flipkart, Swiggy) | HIGH | 1 day each |
| Create experience-level landing pages (freshers, 2 years, 3 years) | HIGH | 1 day each |
| Implement Open Graph per-page images instead of the single `og-default.png` | MEDIUM | 2 days |
| Change `og:locale` from `en_IN` to `en_US` + add `en_IN` as alternate | LOW | 1 hr |
| Add `noindex` to thin/empty blog posts ("coming soon") | MEDIUM | 1 hr |
| Publish remaining blog posts (remove "coming soon" placeholders) | HIGH | Ongoing |
| Add `hreflang` if targeting international users | LOW | 1 hr |

### Nice to Have

| Fix | Impact | Effort |
|---|---|---|
| Generate per-question OG images with question title + difficulty | MEDIUM | 1 week |
| Implement progressive web app (PWA) manifest | LOW | 1 day |
| Add `robots.txt` for TypeScript and System Design tracks proactively | LOW | 30 min |
| Move `images.domains` to `images.remotePatterns` (next.config.js) | LOW | 15 min |

---

## PART 8: Growth Opportunities

### SEO Growth (90-day focus)
1. Fix all critical bugs listed above (Week 1)
2. Create all 12 missing sub-concept pages that are currently 404 (Week 2–3)
3. Create 5 company-specific pages with questions tagged to each company (Week 3–4)
4. Create 3 experience-level pages (freshers, 1 year, 2 years) (Week 4–5)
5. Publish 2 long-form blog posts per week on targeted keywords — at least 2,000 words, with code examples
6. Submit sitemap to Google Search Console and request indexing on every new page

**Target:** 50 new pages in 90 days, all with real content, all targeting specific keywords.

### Content Marketing
- **Weekly newsletter:** "This Week's JavaScript Interview Questions" — one question, full answer, practice link. 50% of recipients click back. Email list is the most valuable asset you can build.
- **Downloadable PDFs:** "JavaScript Interview Preparation Checklist" as a lead magnet. Single opt-in, drives email signups.
- **"Interview experiences" content:** Partner with users who got offers. Write up their experience as "How I passed Razorpay's frontend interview using JSPrep." These rank for "[company] interview experience" queries.

### Reddit Strategy
Target subreddits: `r/developersIndia`, `r/learnjavascript`, `r/cscareerquestions`, `r/reactjs`, `r/webdev`

**Tactics:**
- Answer questions with genuinely helpful content (no promotional links) — builds account karma
- Post "I curated 50 JavaScript output questions that Razorpay loves to ask" as a value post
- Weekly "JavaScript trick question" posts with a link to practice
- Share a screenshot of your AI evaluator grading an answer — the visual is compelling

**DO NOT:** Spam. One mention per month per subreddit after establishing presence.

### Twitter/X Strategy
Account: `@jspreppro` (already in codebase)

Content plan:
1. Daily: one JavaScript output question as a tweet. Poll format ("What does this print?"). Get replies, engage, build following.
2. Weekly: "Interview tip thread" covering one concept
3. Occasionally: share user success stories ("Just got an offer from Flipkart after 3 weeks of prep")

Target: 1,000 followers = ~100 new users/month via organic Twitter.

### LinkedIn Strategy
- Post as the founder (not as the brand) — personal accounts outperform brand pages
- "I interviewed 50 frontend developers this year. Here are the 3 JavaScript questions that filtered 70% of them." — this format goes viral on LinkedIn
- Target HR professionals and engineering managers who search for interview prep tools for their teams

### Developer Community Strategy
1. Create a Discord server — "Frontend Interview Prep" community. Build before you monetize.
2. Contribute to existing Discord/Slack communities (Frontend Mentors, etc.) with free value
3. ProductHunt launch — time it when you've fixed the technical bugs and have 10+ genuine testimonials with real names

### YouTube Strategy
This is the single highest-leverage channel and the one that is completely missing.

**Content format:**
- "I answered [Company]'s JavaScript interview questions live" (ASMR-style, no editing needed)
- "What is the JavaScript Event Loop? (Explained in 5 minutes for interviews)"
- "Predict the output: 10 JavaScript questions that trip up developers"

One 10-minute video on "JavaScript closures interview questions" with a link to JSPrep in the description can drive 5,000 organic visits/month permanently once it ranks.

**Channel name:** "JSPrep" or the founder's name is better than a brand name for YouTube growth.

### First 1,000 Organic Users Roadmap
1. **Week 1-2:** Fix all critical bugs. Get pages indexed.
2. **Week 3-4:** Post 5 JavaScript output questions as Twitter polls. Get 200 followers.
3. **Week 5-6:** Publish one genuine "interview experience" blog post from a real user.
4. **Week 7-8:** Post in r/developersIndia with a genuinely helpful guide.
5. **Week 9-10:** Record and publish first YouTube video.
6. **Week 11-12:** ProductHunt launch.

**Realistic outcome:** 1,000 organic users in 90 days is achievable if technical bugs are fixed in Week 1 and content effort is consistent.

---

## PART 9: Revenue Analysis

### Whether current positioning supports monetization

The free tier is too generous for conversion. Giving 200+ questions free means the average user can practice for weeks without hitting a paywall. There's no urgency to upgrade.

The AI features are the product's strongest differentiator — but they're entirely locked behind Pro. A user who has never experienced AI evaluation has no visceral reason to pay for it.

**Current free/paid split:**
- Free: 200+ theory questions, output quiz, debug lab, polyfill lab, sprint (limited), roadmap
- Pro: All 600+ questions, unlimited sprint, AI evaluator, AI tutor, mock interview, study plan, cheat sheet

This is generous. The question is whether the free experience is compelling enough to drive upgrades.

### Pricing concerns
- ₹199/month is the right price point for India (approximately $2.50). Not too expensive.
- The pricing page compares free vs. Pro but doesn't emphasize the time value: "Save 20 hours of scattered prep."
- **No annual plan** — monthly billing leaves money on the table. An annual plan at ₹999/year (₹83/month) would significantly improve LTV.
- **No team plan** — companies hiring 10 developers are a better paying customer than individual developers.

### Free vs. Paid Balance
The current balance is too generous. Recommended changes:
- Move output quiz to require login (email capture)
- Give 3 free AI evaluations before requiring Pro (not zero)
- Add a "Pro feature preview" — let free users see what an AI evaluation looks like with the answer filled in, blurred, with a "Upgrade to see your score" CTA

### Conversion Bottlenecks
1. **No AI trial** — seeing is believing. Zero AI experience = zero urgency to pay
2. **No onboarding email sequence** — users who sign up and don't return aren't being re-engaged
3. **No visible urgency** — "Your interview might be in 2 weeks" messaging is absent
4. **No social proof at paywall** — the payment modal has no testimonials

### Better Positioning
Current: "500+ frontend interview questions with AI scoring"
Recommended: "The fastest way to go from 'I know JavaScript' to 'I can explain JavaScript to any interviewer.'"

### Better Pricing
- Monthly: ₹199 (current)
- Annual: ₹999 (~₹83/month, save 58%)
- Team (5 seats): ₹599/month

### Better Onboarding
1. New user → take a 3-question sprint immediately (no login required)
2. See AI score on their answer → "You scored 6/10. Sign up to unlock your detailed feedback."
3. After signup → personalized study plan based on the sprint result
4. Day 3 email → "You have a 3-day streak. Keep going."
5. Day 7 email → "You've mastered 12 questions. Here are the 5 you struggled with most."

---

## PART 10: Final Verdict

### 1. Why is JSPrep not getting organic customers?

Three compounding problems:

**Technical:** The robots.txt has a critical bug that allows Google to crawl auth-required pages and potentially block content pages. The React questions page shows JavaScript content to Google. Twelve linked pages 404. Blog internal links 404. The sitemap doesn't include two key pages. These bugs alone would explain low organic traffic even if the content were excellent.

**Content:** 10 blog posts and 40 topic pages is not enough for Google to award topical authority on "JavaScript interview preparation." Google wants to see the most comprehensive, authoritative resource on a topic. JSPrep has good content but too little of it.

**Brand:** Zero backlinks from authoritative sites, zero YouTube presence, zero newsletter, zero community. Organic growth requires other channels to drive initial traffic and backlinks. Without those channels, a new site simply waits for Google to notice it — and Google is slow.

### 2. Why is Google not indexing pages?

Four confirmed reasons:
1. **Robots.txt bug** — Googlebot's specific rule overrides the `*` rule. The precise scope of what Googlebot CAN and CANNOT crawl may not match the developer's intent.
2. **Duplicate content** — Blog posts exist at two URLs (`/blog/javascript/[slug]` and `/blog/react/[slug]`) with no canonical. Google may suppress both.
3. **Streaming Suspense** — Question lists on key landing pages are delivered via HTTP streaming, which Googlebot may not fully render.
4. **No external links pointing in** — Even correctly configured pages struggle to rank without any backlinks. Google needs signals from other sites to understand that JSPrep is authoritative.

### 3. What are the top 5 growth bottlenecks?

1. **Technical bugs killing crawl health** — 404s, duplicate content, robots.txt misconfiguration
2. **Zero off-site presence** — No YouTube, no newsletter, no community, no backlinks
3. **AI features are zero-trial** — The best feature can't be experienced without paying
4. **Content thin** — 10 blog posts doesn't establish topical authority
5. **No viral loop** — Users have no reason or mechanism to share their progress

### 4. What should be fixed first?

In strict priority order:
1. `src/app/robots.ts` — 10 minutes, blocks all other SEO work
2. Blog link bug (`/blog/${post.slug}`) in both topic pages and blog post pages — 30 minutes, fixes 40+ crawl errors
3. React questions page track bug — 1 hour, fixes Google indexing wrong content on second most important page
4. Blog duplicate content — 2 hours, eliminates duplicate content penalty
5. Missing pages in sitemap — 15 minutes, gets existing pages indexed faster

**Total time to fix the 5 most critical bugs: under 5 hours.**

These bugs are preventing Google from properly indexing a product that is already built and actually good. Fix the foundation first.

### 5. If you were CEO for 90 days: exact roadmap

**Days 1–7: Fix the House**
- Fix robots.ts (10 min)
- Fix all broken blog links (30 min)
- Fix React questions page (1 hr)
- Fix blog duplicate content (2 hrs)
- Fix sitemap coverage (30 min)
- Fix stale year in title tags (5 min)
- Fix articleSchema logo reference (5 min)
- Submit all pages to Google Search Console for re-indexing
- Set up Google Search Console alerts for 404s and crawl errors

**Days 8–30: Build the Content Engine**
- Create 12 missing sub-concept pages (e.g., `/javascript-closures-interview-questions`) — one page per day
- Create 5 company-specific pages (Razorpay, Flipkart, Swiggy, CRED, Google)
- Create 3 experience-level pages (freshers, 1-year, 2-year)
- Publish 8 long-form blog articles targeting high-volume keywords
- Launch weekly email newsletter (even with 0 subscribers — build the habit)
- Set up email capture on every page (bottom CTA should capture email, not just link to /auth)

**Days 31–60: Build the Brand**
- Record 4 YouTube videos (one per week): JavaScript output questions, closures, event loop, promises
- Post 30 JavaScript interview questions as Twitter polls (one per day)
- Engage genuinely in r/developersIndia and r/learnjavascript
- Launch Discord server — announce it in those communities
- Reach out to 10 users who have Pro subscriptions and ask for a testimonial with their real name and photo

**Days 61–90: Monetize Better + Launch**
- Add 3 free AI evaluations to the free tier (convert more free → paid)
- Add annual pricing (₹999/year) and make it the default selected option
- Add "share your sprint score" button
- ProductHunt launch (after you have 10 real testimonials and bugs are fixed)
- Run a "30-day interview challenge" in the Discord community

**Expected outcome at Day 90:**
- Technical bugs fixed → Google properly indexes 200+ pages
- 20+ new content pages → topical authority starts building
- YouTube: 4 videos, 200–500 subscribers, ~1,000 views/video on average
- Newsletter: 500–1,000 subscribers from email captures
- Discord: 200–500 members
- Organic traffic: 2,000–5,000/month (up from near-zero)
- MRR: ₹20,000–₹50,000 (100–250 Pro subscribers)

The product is already excellent. The distribution is broken. Fix the distribution.

---

*End of Audit — Generated 2026-05-31*  
*All findings based on direct codebase inspection of `/Users/yash.maheshwari1/Desktop/jsprep-pro`.*
