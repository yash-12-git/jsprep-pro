# JSPrep Pro — Project Context Document

> **Generated:** 2026-05-31  
> **Purpose:** Comprehensive onboarding reference for engineers and AI agents.  
> **Source of truth:** This document reflects the codebase as of the generation date. Re-generate when significant architecture changes occur.

---

## 1. Executive Summary

**JSPrep Pro** is a SaaS platform for frontend developer interview preparation targeting developers with 1–3 years of experience. It delivers 600+ curated questions across JavaScript, React, TypeScript, and System Design with AI-powered answer evaluation, gamified progress tracking, and multi-format practice modes.

**Problem solved:** Frontend interview prep is fragmented — scattered blog posts, generic LeetCode-style platforms, and YouTube videos. JSPrep Pro consolidates concept-level JS/React mastery into one platform with immediate, personalized feedback powered by LLMs.

**Target users:** Frontend developers with 1–3 years experience preparing for interviews at Indian and global tech companies (Razorpay, Flipkart, Swiggy, Google, etc.).

**Core workflows:**
1. **Practice** — Theory Q&A, output prediction, debugging challenges, polyfill exercises
2. **Sprint** — Timed mock interview sessions with mixed question types
3. **AI Mock Interview** — Conversational simulation with a "senior engineer" persona
4. **Study Plan** — AI-analyzed weak spots with a day-by-day preparation schedule
5. **Progress tracking** — XP system, streaks, leaderboard, per-question mastery status

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          VERCEL (Edge + Serverless)                 │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Next.js 14 App Router                     │  │
│  │                                                              │  │
│  │  Server Components ──── fetch + cache ────► Firestore        │  │
│  │  (pages, layouts)        unstable_cache                      │  │
│  │                                                              │  │
│  │  Client Components ──► React hooks ──► Firebase SDK (client) │  │
│  │  (all interactivity)    (useAuth,         Firestore reads     │  │
│  │                          useQuestions)    progress writes     │  │
│  │                                                              │  │
│  │  API Routes ─────────────────────────────────────────────    │  │
│  │  /api/ai          ──► Groq API (llama-3.3-70b)              │  │
│  │  /api/create-order──► Razorpay REST API                     │  │
│  │  /api/razorpay/   ──► Firebase Admin SDK ──► Firestore       │  │
│  │    webhook                                                   │  │
│  │  /api/pricing     ──► Vercel geo headers                     │  │
│  │  /api/embeddings  ──► Cohere API                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

External Services:
  Firebase Auth      — Google OAuth, session tokens
  Firestore          — Primary database (questions, users, topics, blog)
  Groq               — LLM inference (llama-3.3-70b-versatile)
  Cohere             — Embeddings for RAG (embed-english-light-v3.0)
  Razorpay           — Payment processing and subscriptions
  Vercel Analytics   — Page view tracking
  Microsoft Clarity  — Session recording / heatmaps
  Google Analytics   — GA4 events
```

### Frontend Architecture

Next.js 14 App Router with a clear **server/client split**:
- Server components fetch and cache Firestore data via `unstable_cache`.
- Client wrapper components (`*ClientWrapper.tsx`) receive data as props and manage all interactive state.
- Emotion (CSS-in-JS) handles all component styling via design tokens in `src/styles/tokens.ts`. Tailwind is used for utility classes only.

### Backend Architecture

Serverless API routes under `src/app/api/`. No dedicated backend server. Firebase Admin SDK is initialized lazily per-request in API routes that need privileged Firestore access (webhook handler).

### Database Architecture

Google Firestore (NoSQL, document-oriented):
- `questions/{id}` — content library
- `users/{uid}` — user state root (Pro status, XP, streaks)
- `users/{uid}/progress/{questionId}` — per-question progress subcollection
- `topics/{id}` — topic hub pages
- `blog_posts/{id}` — editorial content

### Authentication Flow

1. User clicks "Sign in with Google" → `signInWithPopup(auth, googleProvider)` (Firebase)
2. Firebase returns a `User` object; `onAuthStateChanged` fires in `useAuth`
3. `getUserProgressAndStreak(uid)` is called — creates user doc if new, returns full progress
4. Streak is updated inline (fire-and-forget `updateDoc`)
5. `progress.isPro` controls Pro gate; `applyExpiryCheck()` enforces client-side expiry
6. Admin status lives in Firestore (`users/{uid}.isAdmin`), server-validated per API route

### Deployment Architecture

Deployed on Vercel. Environment variables in Vercel dashboard. `x-vercel-ip-country` header used for geo-based pricing. Firebase connection via client SDK (public, rules-controlled) + Admin SDK (server-only, service account).

---

## 3. Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.2.35 |
| Language | TypeScript | ^5 |
| UI Runtime | React | ^18 |
| Styling | Emotion (`@emotion/react`) | ^11.14.0 |
| Utility CSS | Tailwind CSS | ^3.4.1 |
| Icons | Lucide React | ^0.577.0 |
| Code Editor | Monaco Editor (`@monaco-editor/react`) | ^4.7.0 |
| Database | Firebase Firestore | ^10.12.0 |
| Auth | Firebase Auth (Google OAuth) | ^10.12.0 |
| Server DB | Firebase Admin SDK | ^13.7.0 |
| Payments | Razorpay | ^2.9.6 |
| LLM | Groq API (llama-3.3-70b-versatile) | — |
| Embeddings | Cohere API (embed-english-light-v3.0) | — |
| HTTP | Axios | ^1.7.2 |
| Date utils | date-fns | ^3.6.0 |
| Analytics | @vercel/analytics | ^1.6.1 |
| Build | Next.js built-in (webpack/turbopack) | — |
| Linting | ESLint + eslint-config-next | ^8 |
| Testing | None (no test suite exists) | — |

**State management:** React Context (AuthContext, ThemeContext, TrackContext) + custom hooks. No Redux or Zustand.

---

## 4. Project Structure

```
/
├── package.json                    # Dependencies (no monorepo)
├── next.config.js                  # Next.js config
├── postcss.config.js               # PostCSS (Tailwind)
├── .env.local.example              # Required env vars template
├── public/                         # Static assets
│   └── og-default.png, llms.txt, icon files
├── scripts/                        # One-time admin scripts (Node.js)
│   ├── set-admin-claim.js          # Promote a user to admin in Firestore
│   └── backfill-embeddings.js      # Generate Cohere embeddings for all questions
└── src/
    ├── app/                        # Next.js App Router root
    │   ├── layout.tsx              # Root layout — providers, fonts, analytics
    │   ├── page.tsx                # Homepage (server component, fetches stats)
    │   ├── globals.css             # CSS custom properties (theme vars), resets
    │   ├── api/                    # Serverless API routes
    │   ├── admin/                  # Admin CMS panel (protected)
    │   └── [feature pages]/        # One directory per feature/page
    ├── components/
    │   ├── layout/Navbar.tsx       # Top navigation, track selector, auth state
    │   ├── ui/                     # Reusable interactive components
    │   ├── home/                   # Homepage-only components
    │   ├── md/                     # Markdown rendering
    │   └── seo/                    # SEO card components
    ├── hooks/                      # Custom React hooks
    ├── contexts/                   # React Context providers
    ├── lib/                        # Server and client library code
    ├── styles/                     # Design tokens and shared Emotion CSS
    ├── types/                      # TypeScript interfaces
    └── data/                       # Static/seed data (roadmap, homepage copy)
```

### Key Directory Details

**`src/app/api/`** — All backend logic. Each subdirectory is one serverless route. No shared middleware; auth validation is per-route.

**`src/lib/`** — The data access layer. Every Firestore interaction flows through files here. Never import Firebase directly in page components.
- `questions.ts` — Full CRUD + progress subcollection ops
- `userProgress.ts` — User root doc, XP, streaks, leaderboard
- `topics.ts` / `blogPosts.ts` — Content read APIs
- `ai.ts` — Groq wrapper utility
- `embeddings.ts` — Cohere + cosine similarity for RAG
- `cachedQueries.ts` — `unstable_cache` wrappers for all public reads
- `codeRunner.ts` — Sandboxed iframe JS execution

**`src/hooks/`** — Client-side state management layer on top of `src/lib/`.
- `useAuth.tsx` — The single most important hook; manages Firebase auth state + progress
- `useQuestions.ts` — In-memory caching over Firestore question reads
- `useUpgrade.ts` — Razorpay payment flow orchestration

**`src/contexts/`**
- `ThemeContext.tsx` — Dark/light mode, stored in localStorage, no flash on mount
- `TrackContext.tsx` — Active track (JS/React/TS/SystemDesign), stored in cookie for SSR access

**`src/styles/`**
- `tokens.ts` — All design tokens imported by every styled component
- `shared.ts` — Reusable Emotion CSS atoms (`pageWrapper`, `card`, `primaryBtn`, etc.)

---

## 5. Data Flow

### Theory Question Practice

1. User navigates to `/theory`
2. `page.tsx` (server) calls `cachedQueries.ts` → `getQuestions({type:'theory'})` → Firestore (cached)
3. Props passed to `TheoryPageClientWrapper` (client)
4. User selects category filter → local `useState` filters displayed questions
5. User clicks question → `QuestionCard` expands, reveals answer button
6. User types answer → `InlineEvaluater` or `AnswerEvaluator` calls `POST /api/ai?type=evaluate`
7. API: builds prompt with question context + RAG, calls Groq, returns JSON `{score, grade, verdict, ...}`
8. Client shows scorecard; on "Mark Mastered" → `markMasteredV2(uid, qid, true)` via `scheduleProgressWrite` (600ms debounce)
9. `awardProgressXP(uid, XP.MASTER_QUESTION, +1)` called immediately (not debounced)
10. `invalidateProgressCache(uid)` ensures next read reflects new status

### Payment / Pro Upgrade

1. User clicks "Go Pro" → `useUpgrade` hook fires `POST /api/create-order`
2. Server detects country from `x-vercel-ip-country` header, calls `getPricingForCountry()`
3. Returns `{orderId, currency, amount}` from Razorpay API
4. Client loads Razorpay checkout script, opens payment modal
5. On success: Razorpay fires `POST /api/razorpay/webhook`
6. Webhook validates HMAC signature; on `payment.captured` → `users/{uid}.isPro = true`
7. Client calls `refreshProgress()` → re-reads Firestore, updates `progress` in context
8. PaywallBanner disappears; Pro features unlock

### Mock Interview

1. User at `/mock-interview`, fills role/company/experience form
2. Clicks "Start" → sends `POST /api/ai?type=mock` with context + `["Begin"]` message
3. API detects opener message, enriches with entropy token + company context to prevent caching
4. Groq streams back first interview question
5. User types response → next API call with full message history
6. After N exchanges, user clicks "End" → client adds `GENERATE_SCORECARD` message
7. API returns JSON scorecard with per-topic ratings
8. `InterviewResult.tsx` renders structured feedback

---

## 6. Database Analysis

### Collection: `questions`

| Field | Type | Notes |
|---|---|---|
| `id` | string | Firestore document ID |
| `slug` | string | URL-safe identifier, unique |
| `type` | `theory\|output\|debug\|polyfill\|coding\|system\|behavioral` | — |
| `track` | `javascript\|react\|typescript\|system-design` | — |
| `title` | string | Display title |
| `question` | string | Question text (HTML or markdown) |
| `answer` | string | Official answer (HTML) |
| `hint` | string | Hint text |
| `explanation` | string | Plain-text explanation |
| `keyInsight` | string | Single most important takeaway |
| `code` | string? | For output/debug questions |
| `expectedOutput` | string? | Expected console output |
| `brokenCode` | string? | Buggy version for debug type |
| `fixedCode` | string? | Reference fix for debug type |
| `bugDescription` | string? | One-sentence bug description |
| `category` | string | Grouping (e.g., "Closures", "Promises") |
| `tags` | string[] | Searchable tags |
| `companies` | string[]? | Companies known to ask this |
| `difficulty` | `beginner\|core\|advanced\|expert` | — |
| `isPro` | boolean | Gates content behind paywall |
| `order` | number | Sort order within type |
| `topicSlug` | string? | FK to `topics` collection |
| `relatedBlogSlugs` | string[]? | FK to `blog_posts` |
| `status` | `draft\|published\|archived` | Only `published` shown to users |
| `viewCount` | number | Incremented on question detail view |
| `solveCount` | number | Incremented on solve/master |
| `embedding` | number[]? | 384-dim Cohere vector for RAG |
| `createdAt` | string | ISO timestamp |
| `updatedAt` | string | ISO timestamp |

**Relationships:** `topicSlug` links to `topics/{slug}` (virtual FK, not enforced by Firestore).

### Collection: `users`

| Field | Type | Notes |
|---|---|---|
| `uid` | string | Firebase Auth UID |
| `isPro` | boolean | Current Pro status |
| `isAdmin` | boolean? | Admin panel access |
| `subscriptionId` | string? | Razorpay subscription or payment ID |
| `razorpaySubscriptionId` | string? | Used by webhook to look up user |
| `masteredIds` | number[] | Legacy — replaced by subcollection |
| `bookmarkedIds` | number[] | Legacy — replaced by subcollection |
| `solvedOutputIds` | number[] | Output questions solved |
| `revealedOutputIds` | number[] | Output answers revealed |
| `solvedDebugIds` | number[] | Debug questions solved |
| `revealedDebugIds` | number[] | Debug answers revealed |
| `streakDays` | number | Consecutive active days |
| `lastActiveDate` | string | Last `toDateString()` |
| `totalSessions` | number | Sprint/quiz completions |
| `xp` | number | All-time XP |
| `weeklyXp` | number | XP since last Monday (leaderboard) |
| `weeklyXpResetDate` | string | ISO date of last Monday |
| `masteredCount` | number? | Counter field (increment-only) |
| `displayName` | string? | Cached from Firebase Auth for leaderboard |
| `photoURL` | string? | Cached for leaderboard |
| `proActivatedAt` | string? | ISO timestamp |
| `proExpiresAt` | string\|null? | Non-null only during grace/cancelled |
| `subscriptionStatus` | string? | `halted\|cancelled\|expired\|completed` |
| `lastRenewedAt` | string? | Last successful renewal |
| `joinedAt` | string | ISO timestamp |

**Subcollection: `users/{uid}/progress/{questionId}`**

| Field | Type | Notes |
|---|---|---|
| `questionId` | string | Matches Firestore document ID of question |
| `status` | `unseen\|attempted\|solved\|mastered\|revealed` | Learning progress |
| `isBookmarked` | boolean | Independent of status |
| `attempts` | number | Times attempted |
| `lastAttemptAt` | string | ISO timestamp |
| `solvedAt` | string? | When first solved |
| `masteredAt` | string? | When first mastered |
| `score` | number? | AI evaluation score (1–10) |
| `userAnswer` | string? | Last typed answer |

### Collection: `topics`

Topic hub pages. Each topic aggregates questions, blog posts, cheat sheets, and tips.

| Key Fields | Notes |
|---|---|
| `slug` | URL segment (e.g., `closures`, `event-loop`) |
| `title` | Display name |
| `track` | Which track this belongs to |
| `difficulty` | beginner/intermediate/advanced |
| `questionCount` | Cached count of linked questions |
| `cheatSheet` | Markdown content for cheat sheet tab |
| `interviewTips` | Markdown content for tips tab |
| `mentalModel` | Conceptual explanation |
| `deepDive` | Advanced explanation |
| `misconceptions` | Common wrong mental models |
| `relatedBlogSlugs` | FK to blog_posts |
| `status` | `draft\|published\|archived` |

### Collection: `blog_posts`

Editorial articles. Linked to topics and question categories for sidebar suggestions.

| Key Fields | Notes |
|---|---|
| `slug` | URL segment |
| `track` | Which track |
| `content` | Full markdown body |
| `topicSlug` | Primary topic FK |
| `relatedTopicSlugs` | Multi-topic FK |
| `questionCategories` | For "related questions" sidebar |
| `status` | `draft\|published\|archived` |

**No Firestore Security Rules** are visible in the repo (assumed to be configured directly in the Firebase console). Admin writes should enforce `isAdmin` check in API route layer (server-side) — the Firebase Admin SDK bypasses all rules.

---

## 7. Authentication & Authorization

### Login Flow

```
User clicks "Sign in with Google"
  → signInWithPopup(auth, googleProvider)    [Firebase JS SDK]
  → Google OAuth redirect/popup
  → Firebase issues ID token
  → onAuthStateChanged fires with User object
  → getUserProgressAndStreak(uid) called
    → getDoc(users/{uid})
    → if !exists: setDoc with DEFAULT_PROGRESS
    → streak updated inline (fire-and-forget)
  → AuthContext.user + AuthContext.progress populated
  → Loading spinner removed, page renders with user state
```

### Session Management

Firebase handles token refresh automatically. The `onAuthStateChanged` listener persists across page refreshes (IndexedDB persistence). No custom session cookies.

### Role-Based Access

| Role | Detection | Capabilities |
|---|---|---|
| Anonymous | `user === null` in AuthContext | Read public content, limited question access |
| Free user | `user !== null && !progress.isPro` | Practice all free questions, tracking |
| Pro user | `progress.isPro === true` | All questions, AI features, mock interview |
| Admin | `progress.isAdmin === true` | Admin panel at `/admin/*` |

**Client-side expiry check** (`applyExpiryCheck` in `useAuth.tsx`): If `proExpiresAt` is in the past, `isPro` is forced to `false` client-side without a Firestore read.

### Protected Routes

- Pro content: `PaywallBanner` component wraps gated sections; checks `progress.isPro`
- Admin routes: `src/app/admin/layout.tsx` checks `useAuth().progress.isAdmin`
- No server-side middleware for auth (Vercel Edge middleware not used for auth)
- API routes that write privileged data use Firebase Admin SDK (webhook) — no user-facing token validation in other API routes (potential gap — see Security Review)

---

## 8. Feature Inventory

### Theory Practice (`/theory`)
- Paginated question list with category filter tabs
- Difficulty badges, Pro lock indicator
- Expandable answer reveal
- AI Answer Evaluator (Pro): inline score, gaps, better answer
- Q&A Tutor (Pro): follow-up chat with RAG context
- Mark Mastered / Bookmark
- **Components:** `TheoryPageClientWrapper`, `QuestionCards/TheoryCard`, `AnswerEvaluator`, `AIChat`, `PaywallBanner`

### Output Quiz (`/output-quiz`)
- Predict the `console.log` output of JS snippets
- Sandboxed iframe execution validates answers
- Score XP on correct prediction
- **Components:** `OutputClientWrapper`, `QuestionCards/OutputCard`, `CodeEditor`

### Debug Lab (`/debug-lab`)
- Find and fix bugs in broken JS code
- Monaco Editor for code submission
- AI validates fix against reference solution
- **Components:** `DebugLabClientWrapper`, `QuestionCards/DebugCard`, `CodeEditor`

### Polyfill Lab (`/polyfill-lab`)
- Implement JS built-in methods from scratch
- Inline test runner validates implementation
- **Components:** `PolyfillClientWrapper`, `QuestionCards/PolyfillCard`, `CodeEditor`

### Interview Sprint (`/sprint`)
- Timed challenge (15–30 min), mixed question types
- AI evaluates all open-ended answers at end
- Final scorecard with strengths/weaknesses
- **Components:** `SprintWrapper`, `InterviewResult`

### AI Mock Interview (`/mock-interview`)
- Configure company, role, experience level
- Conversational interface simulating senior engineer
- Per-request entropy prevents duplicate questions
- Generates structured scorecard on completion
- **Components:** `MockInterviewClient`, `InterviewResult`
- **API:** `POST /api/ai` with `type=mock`

### Study Plan (`/study-plan`)
- AI analyzes weak categories from progress data
- Generates readiness score + day-by-day plan
- **Components:** `StudyPlanClientWrapper`
- **API:** `POST /api/ai` with `type=studyplan`

### Cheatsheet (`/cheatsheet`)
- 36-topic quick-revision cards
- Markdown content rendered per topic
- **Components:** `CheatsheetClientWrapper`

### Roadmap (`/roadmap`)
- 30-day learning path with daily tasks
- Progress tracked in localStorage
- **Components:** `RoadmapClient`, `Roadmap/` directory
- **Data:** `src/data/roadmap/roadmapData.ts`

### Analytics Dashboard (`/analytics`)
- User XP, mastered count, streak display
- Weekly leaderboard
- **Components:** `AnalyticsClientPage`, `Leaderboard`, `LeaderboardWrapper`
- **Data:** `getWeeklyLeaderboard()` from `userProgress.ts`

### Topics Hub (`/topics`, `/topics/[track]`, `/[topic]`)
- 36 curated topic pages
- Each has: questions list, cheat sheet tab, interview tips tab, related blogs
- **Components:** `TopicQuestionList`, `[topic]/page.tsx`

### Blog (`/blog`, `/blog/[track]/[slug]`)
- Markdown articles with related question sidebars
- Track-filtered listing pages
- **Components:** `blog/` pages, `MarkdownRenderer`

### Admin Panel (`/admin/*`)
- CRUD for questions, topics, blog posts
- AI question generator
- Seed/migrate tools
- **Components:** `QuestionForm`, `TopicForm`, `BlogForm`, `admin/generate/page.tsx`

---

## 9. API Documentation

### `POST /api/ai`

**Purpose:** Central AI endpoint for all LLM-powered features.

**Authorization:** None (no server-side auth check — rate limited only by Groq quotas)

**Request body:**
```json
{
  "type": "qa | evaluate | debugcheck | studyplan | mock | generate",
  "messages": [{ "role": "user | assistant", "content": "..." }],
  "context": { /* type-specific fields — see below */ },
  "similarQuestions": [/* SimilarQuestion[] for RAG */],
  "system": "optional custom system prompt for mock"
}
```

**Context shapes by type:**

| Type | Context Fields |
|---|---|
| `qa` | `question`, `answer` |
| `evaluate` | `question`, `idealAnswer` |
| `debugcheck` | `brokenCode`, `bugDescription`, `fixedCode`, `userFix` |
| `studyplan` | `masteredIds`, `totalQuestions`, `weakCategories`, `strongCategories`, `sprintHistory`, `interviewDate` |
| `mock` | `company`, `role`, `experience`, `focus`, `isFinal` |
| `generate` | `type`, `difficulty`, `topic`, `category` |

**Response:** `{ text: string }` — Raw LLM output (JSON string for evaluate/debugcheck/studyplan/generate; prose for qa/mock)

**Model:** Groq `llama-3.3-70b-versatile`; `maxTokens=1024` for most, `2048` for mock/generate; `temperature=0.7` for mock, `1` otherwise.

---

### `POST /api/create-order`

**Purpose:** Create a Razorpay payment order with geo-detected pricing.

**Authorization:** None explicit (caller should be authenticated — not enforced server-side)

**Request body:**
```json
{
  "userId": "firebase-uid"
}
```

**Response:**
```json
{
  "orderId": "order_xxx",
  "currency": "INR",
  "amount": 9900,
  "symbol": "₹",
  "display": "₹99"
}
```

**Note:** `userId` is embedded in Razorpay order `notes` for webhook attribution.

---

### `POST /api/razorpay/webhook`

**Purpose:** Handle all Razorpay subscription lifecycle events.

**Authorization:** HMAC-SHA256 signature validation (`x-razorpay-signature` header vs `RAZORPAY_WEBHOOK_SECRET`)

**Events handled:**
| Event | Action |
|---|---|
| `payment.captured` | Set `isPro=true`, clear `proExpiresAt` |
| `subscription.activated` | Set `isPro=true` |
| `subscription.charged` | Renew: `isPro=true`, clear expiry, set `lastRenewedAt` |
| `subscription.halted` | 3-day grace: `proExpiresAt = now + 3d` |
| `subscription.cancelled` | Pro until `current_end` billing period |
| `subscription.completed / expired` | `isPro=false` |

**User lookup:** By `notes.userId` (from order creation) or by `razorpaySubscriptionId` field.

---

### `GET /api/pricing`

**Purpose:** Return pricing for the user's country.

**Authorization:** None

**Response:**
```json
{
  "currency": "INR",
  "amount": 9900,
  "symbol": "₹",
  "display": "₹99",
  "label": "per month"
}
```

---

### `POST /api/embeddings`

**Purpose:** Generate and store Cohere embeddings for questions (admin/backfill use).

**Authorization:** None (should be admin-only — see Security Review)

**Request body:** `{ "questionId": "...", "text": "question text" }`

---

### `POST /api/embed`

**Purpose:** Thin wrapper for real-time embedding generation.

**Authorization:** None

---

### `POST /api/generate`

**Purpose:** AI-generate new questions (admin use, called from `/admin/generate`).

**Authorization:** None server-side (relies on admin UI being behind `isAdmin` check)

---

### `GET /api/cron`

**Purpose:** Scheduled maintenance (leaderboard resets, cleanup). Called by Vercel cron.

---

## 10. State Management Analysis

### Global State (React Context)

| Context | Provider Location | State |
|---|---|---|
| `AuthContext` | `src/hooks/useAuth.tsx` | `user`, `progress`, `loading` |
| `ThemeContext` | `src/contexts/ThemeContext.tsx` | `isDark`, `toggleTheme` |
| `TrackContext` | `src/contexts/TrackContext.tsx` | `activeTrack`, `setTrack` |

All three contexts are mounted in `src/app/layout.tsx`.

### Local State

Each page's client wrapper manages its own local state (filters, pagination, modal open/close, answer input). State is reset on navigation — no persistence except through Firestore writes.

### Caching

| Layer | Mechanism | TTL | Scope |
|---|---|---|---|
| Server (Next.js) | `unstable_cache` | Until `revalidateTag()` | Per-tag, per-deploy |
| Client (module) | `Map<uid, {data, fetchedAt}>` | 5 minutes | Per-session in-memory |
| Client (module) | `usePricing` module-level var | Until reload | Single pricing response |
| Client (localStorage) | Roadmap progress | Persistent | `roadmap-progress` key |
| Cookie | Active track | Persistent | `active-track` cookie |

### Data Fetching Patterns

1. **Server prefetch + client hydration:** Pages pre-fetch public data server-side and pass as props to client wrappers.
2. **Hook-level caching:** `useQuestions` wraps `getQuestions` with in-memory TTL cache.
3. **Debounced writes:** `scheduleProgressWrite` batches rapid Firestore writes with 600ms debounce.
4. **Fire-and-forget:** Streak updates and XP awards use `.catch(() => {})` to avoid blocking UI.

### Potential Issues

- **Stale progress across tabs:** Multiple tabs can have different XP values (fire-and-forget writes, no real-time listener on `users/{uid}`)
- **Weekly XP reset:** Not enforced server-side — relies on `weeklyXpResetDate` filter in `getWeeklyLeaderboard`. A user who earned XP last week but never opened the app this week keeps their old `weeklyXp` value until they log in and trigger a reset.
- **No Firestore real-time listeners:** All reads are one-shot `getDoc`/`getDocs`. `refreshProgress()` must be called manually.

---

## 11. Component Map

### Layout System

- `src/app/layout.tsx` — Root layout: providers (Auth, Theme, Track), Navbar, Analytics
- `src/components/layout/Navbar.tsx` — Top nav with dropdown menus, track switcher, auth state
- `src/components/ui/PageGuard.tsx` — Redirect wrapper for auth-required pages

### Shared UI Components

| Component | Location | Purpose |
|---|---|---|
| `PaywallBanner` | `ui/PaywallBanner/` | Pro upgrade prompt with pricing |
| `CodeEditor` | `ui/CodeEditor/` | Monaco + console output panel |
| `AIChat` | `ui/AIChat/` | Chat interface for Q&A Tutor |
| `AnswerEvaluator` | `ui/AnswerEvaluator/` | Score display + feedback UI |
| `PaginationControls` | `ui/PaginationControls.tsx` | Generic page navigation |
| `InlineEvaluater` | `ui/InlineEvaluater.tsx` | Compact inline answer evaluation |
| `TrackSwitcher` | `ui/TrackSwitcher.tsx` | Track tab selector |
| `MarkdownRenderer` | `md/MarkdownRenderer.tsx` | Renders markdown to HTML |

### Question Card Components

All in `src/components/ui/QuestionCards/`:
- `TheoryCard` — expandable theory question with answer reveal + AI eval
- `OutputCard` — code snippet + input prediction + sandbox execution
- `DebugCard` — Monaco editor + submit fix + AI validation
- `PolyfillCard` — Monaco editor + test runner

### Feature-Specific Components

- `dashboard/components/` — HomeClient, Leaderboard, QuestionOfTheDay, LearnSection
- `mock-interview/InterviewResult.tsx` — Scorecard renderer
- `[topic]/TopicQuestionList.tsx` — Question list for topic pages
- `admin/components/` — QuestionForm, TopicForm, BlogForm
- `home/` — AuthCTAs, ProCTA, RoadmapBanner (homepage only)

### Design Patterns

- **Page → Server Component → Client Wrapper** (always this pattern)
- **Emotion `css` objects + design tokens** (never inline styles)
- **Compound styles files** (`page.styles.ts` colocated with `page.tsx`)
- **Types imported from `src/types/`**, never redeclared inline

---

## 12. Business Logic

### XP System

Defined in `src/lib/userProgress.ts`:
```typescript
XP.MASTER_QUESTION = 10
XP.SOLVE_OUTPUT = 8
XP.SOLVE_DEBUG = 8
XP.QUIZ_CORRECT = 5
XP.STREAK_BONUS = 3  // per day, added on login
```

`awardProgressXP(uid, points, masteredDelta)` is the sole writer of `xp` and `weeklyXp`. `masteredDelta` keeps `masteredCount` counter in sync without reading the array.

### Streak Calculation

In `getUserProgressAndStreak()`:
1. Compare `lastActiveDate` to today's `toDateString()`
2. If `lastActiveDate === yesterday`: `streakDays + 1`
3. Else: `streakDays = 1` (reset — no gap tolerance)
4. Fired on every login, fire-and-forget

### Pro Expiry Logic

1. Webhook sets `proExpiresAt` for cancelled/halted subscriptions
2. `applyExpiryCheck()` in `useAuth.tsx` client-side forces `isPro=false` if `proExpiresAt < now`
3. 3-day grace period on `subscription.halted` before `proExpiresAt` is written

### Leaderboard Filter

`getWeeklyLeaderboard()` filters entries where `weeklyXpResetDate >= thisMonday`. Stale entries (from previous weeks) are naturally excluded without requiring a cron reset.

### Track System

Tracks are defined in `src/lib/tracks.ts` as a typed array. Adding a new track requires updating this file + the `Track` union type in `src/types/question.ts`. TypeScript will enforce updates everywhere.

### Sandbox Rules (Code Runner)

Enforced both in `src/lib/codeRunner.ts` (iframe `srcdoc` + `sandbox="allow-scripts"`) and documented in `/api/ai` generate prompt:
- No fetch, DOM, Node.js, React APIs
- All output via `console.log`
- Debug questions: broken code must run without throwing (no ReferenceError/TypeError)
- 3-second hard timeout

### Content Relationship Rules

- `questions.topicSlug` → must match a `topics.slug` (not enforced by DB, enforced in admin form)
- `topics.relatedBlogSlugs` → must match `blog_posts.slug`
- `blog_posts.topicSlug` → must match `topics.slug`

---

## 13. Environment & Configuration

### Required Environment Variables

```bash
# Firebase (client-side — safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...      # or rzp_test_... for dev
RAZORPAY_KEY_SECRET=                           # server-only
RAZORPAY_WEBHOOK_SECRET=                       # server-only

# Firebase Admin (server-only — never expose)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=                    # Multi-line; use \\n escaping in Vercel

# AI Services
GROQ_API_KEY=gsk_...                           # Free at console.groq.com
COHERE_API_KEY=                                # For embeddings

# Pricing
NEXT_PUBLIC_PRO_PRICE_PAISE=9900               # INR display
NEXT_PUBLIC_PRO_PRICE_DISPLAY=99
```

### `next.config.js`

Assumed to have standard Next.js config. Image domains likely include `lh3.googleusercontent.com` (Google avatar CDN).

### Third-Party Integrations

| Service | Purpose | Auth method |
|---|---|---|
| Firebase Auth | Google OAuth | Firebase JS SDK |
| Firestore | Database | Firebase JS SDK (client) + Admin SDK (server) |
| Groq | LLM inference | API key in header |
| Cohere | Embeddings | API key in header |
| Razorpay | Payments | Key + secret + webhook HMAC |
| Vercel | Hosting + analytics | Platform-level |
| Microsoft Clarity | Session recording | Script in layout |
| Google Analytics | Events | Script in layout |

---

## 14. Security Review

### Strengths

- Razorpay webhook signature validated with HMAC-SHA256 (`crypto.createHmac`)
- Firebase Admin SDK used server-side only (not exposed to client)
- Code runner uses `sandbox="allow-scripts"` iframe with `srcdoc` (no DOM access, no network)
- Pro expiry enforced client-side without extra Firestore reads
- Admin SDK private key `\\n` unescaping handled correctly
- No direct SQL — Firestore queries are parameterized by nature

### Vulnerabilities / Missing Protections

**High priority:**

1. **No server-side auth on `/api/ai`** — Any unauthenticated user can call the AI endpoint. A bot can drain the Groq quota without even having an account. Fix: validate Firebase ID token in the route.

2. **No server-side auth on `/api/create-order`** — Anyone can create Razorpay orders without being logged in. `userId` in notes is user-supplied, not server-verified. Fix: verify Firebase ID token; derive `userId` from token claims, not request body.

3. **No rate limiting on AI routes** — A single IP can fire unlimited Groq requests. Fix: add Vercel KV or upstash rate limiting middleware.

4. **Admin routes only client-guarded** — `/admin/*` relies on `useAuth().progress.isAdmin` check in the layout. A user with modified local state could browse the admin UI. Fix: add a middleware or server-side check in the admin layout's server component.

5. **`/api/embeddings` and `/api/generate` unprotected** — Should only be callable by admins.

**Medium priority:**

6. **`subscriptionStatus` comment in `userProgress.ts`** references "Stripe subscription" — vestigial comment suggesting a provider migration; actual code uses Razorpay. Not a vulnerability but a maintenance risk.

7. **No CSRF protection** on API routes — Next.js App Router mitigates some CSRF risk (Origin header checks), but explicit tokens would be safer for state-mutating routes.

### Sensitive Operations

- `users/{uid}.isPro` write in webhook — protected by HMAC
- Admin Firestore writes — protected by Admin SDK (bypass security rules by design)
- Payment order creation — unprotected (see above)

---

## 15. Performance Review

### Strengths

- `unstable_cache` for public Firestore reads — eliminates DB calls on popular pages
- Client-side `Map` cache (5 min TTL) for question lists
- Write debouncing (600ms) prevents per-keystroke Firestore writes
- Server component prefetch pattern avoids client waterfalls
- `masteredCount` counter field avoids full array reads for leaderboard

### Potential Bottlenecks

1. **`getAllProgress(uid)`** — fetches the entire `users/{uid}/progress` subcollection on every page load (after TTL expires). For power users with 200+ attempted questions, this is a large read. Consider pagination or lazy loading.

2. **`getWeeklyLeaderboard()`** — `orderBy("weeklyXp", "desc")` requires a Firestore composite index. Without the index, this query falls back to a full collection scan.

3. **`getPublishedCategories()`** — fetches all published questions just to extract unique category values. Should be replaced with a materialized `categories` collection or cached aggressively.

4. **Monaco Editor** — `@monaco-editor/react` is ~1.5MB. Loaded on debug-lab, polyfill-lab, and admin pages. Should be lazy-loaded with `dynamic(() => import(...), { ssr: false })`.

5. **Groq latency** — AI features add 1–3s per request. No streaming implemented — full response buffered before display. Adding streaming would improve perceived performance.

6. **No ISR (Incremental Static Regeneration)** — Topic and blog pages could use `revalidate` for time-based cache instead of only tag-based revalidation.

### Unnecessary Re-renders

- `TrackContext` re-renders all consumers on any track change. Components that only need to read the track (not react to changes) should use `useMemo` or `memo`.

---

## 16. Technical Debt

### Code Smells

1. **Legacy array fields on `users` doc** — `masteredIds`, `bookmarkedIds`, `solvedOutputIds`, `revealedOutputIds`, `solvedDebugIds`, `revealedDebugIds` are deprecated. New code uses the `progress` subcollection, but these arrays remain in the interface and Firestore. Cleanup needed.

2. **`subscriptionId` vs `razorpaySubscriptionId`** — Two fields storing subscription IDs with different names. The webhook writes `razorpaySubscriptionId`; `userProgress.ts` declares `subscriptionId`. Likely inconsistent.

3. **Static data files alongside Firestore** — `src/data/questions.ts`, `outputQuestions.ts`, `debugQuestions.ts`, `polyfillQuestions.ts` exist as seed sources. Once seeded to Firestore, these files serve no runtime purpose but are kept (dead code risk).

4. **`console.log` in `create-order` route** (line ~15) — Leftover debug logging.

5. **`mockMesssages` typo** in `api/ai/route.ts` line 62 — Three `s` in `Messsages`. Minor but visible.

### Duplicate Logic

- Category filtering happens both server-side (Firestore query) and client-side (JS filter). Inconsistent approach across pages.
- Theme detection logic duplicated between `ThemeContext` and inline script in layout.

### Refactoring Opportunities

- Extract common "page with filters + pagination" pattern into a reusable hook
- `admin/components/QuestionForm.tsx`, `TopicForm.tsx`, `BlogForm.tsx` — likely share form field patterns that could be extracted
- `src/lib/cachedQueries.ts` could consolidate all `unstable_cache` wrappers currently spread across `lib/` files

---

## 17. Development Workflow

### Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.local.example .env.local
# Edit .env.local with Firebase, Razorpay, Groq, Cohere keys

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

### Building

```bash
npm run build    # Production build
npm start        # Run production build locally
```

### Linting

```bash
npm run lint     # ESLint + Next.js rules
```

### Testing

**No test suite exists.** Zero test files in the repository. Manual testing only.

### Admin Operations

```bash
# Promote a user to admin (run once with Firebase service account configured)
node scripts/set-admin-claim.js <uid>

# Backfill Cohere embeddings for all questions
node scripts/backfill-embeddings.js
```

### Deploying

Push to `main` branch → Vercel auto-deploys. Environment variables managed in Vercel dashboard.

### Adding a New Track

1. Add entry to `TRACKS` array in `src/lib/tracks.ts`
2. Update `Track` union type in `src/types/question.ts`
3. Set `available: false` until content is ready
4. TypeScript will surface all call sites that need updating

### Adding a New Question Type

1. Add to `QuestionType` union in `src/types/question.ts`
2. Create a new `QuestionCards/[TypeName]Card.tsx`
3. Add case to `api/ai/route.ts` switch statement
4. Add admin form fields to `admin/components/QuestionForm.tsx`
5. Update sandbox rules in generate prompt if code execution needed

---

## 18. Knowledge Graph

```
Pages                    Components              APIs               Database
─────────────────────────────────────────────────────────────────────────────

/theory ─────────────► TheoryPageClient ──►  POST /api/ai ──► Groq
                      TheoryCard           (evaluate, qa)
                      AnswerEvaluator                    ──► questions
                      AIChat                             ──► users/{uid}/progress
                      PaywallBanner

/output-quiz ────────► OutputClientWrapper ──► codeRunner.ts  ──► questions
                      OutputCard            (iframe sandbox)   ──► users/{uid}/progress

/debug-lab ──────────► DebugLabClientWrapper ──► POST /api/ai ──► Groq
                      DebugCard            (debugcheck)       ──► questions
                      CodeEditor (Monaco)                     ──► users/{uid}/progress

/polyfill-lab ───────► PolyfillClientWrapper ──► test runner  ──► questions
                      PolyfillCard         (iframe sandbox)   ──► users/{uid}/progress

/sprint ─────────────► SprintWrapper ──────────► POST /api/ai ──► questions
                      InterviewResult      (evaluate, mock)   ──► users/{uid}
                                                              ──► Groq

/mock-interview ─────► MockInterviewClient ──► POST /api/ai   ──► Groq
                      InterviewResult      (mock)

/study-plan ─────────► StudyPlanClient ────► POST /api/ai    ──► users/{uid}
                                         (studyplan)         ──► Groq

/dashboard ──────────► HomeClient ─────────► getWeeklyLeaderboard ──► users
                      Leaderboard          getQuestion       ──► questions
                      QuestionOfTheDay     useAuth           ──► users/{uid}

/analytics ──────────► AnalyticsClientPage ► getWeeklyLeaderboard ──► users
                      Leaderboard          getAllProgress    ──► users/{uid}/progress

/[topic] ────────────► TopicQuestionList ──► getQuestions    ──► questions
                      MarkdownRenderer     getTopicBySlug   ──► topics

/blog/[t]/[slug] ────► BlogPost page ──────► getBlogPost     ──► blog_posts
                      MarkdownRenderer     getTopicBySlug   ──► topics

/admin/* ────────────► QuestionForm ───────► createQuestion  ──► questions
                      TopicForm            updateTopic      ──► topics
                      BlogForm             POST /api/generate ──► Groq

Payments:
/[any page] ──► PaywallBanner ──► useUpgrade ──► POST /api/create-order ──► Razorpay
                                              ◄── POST /api/razorpay/webhook
                                                   (Firebase Admin SDK)  ──► users

Auth:
/auth ───────────────► AuthPage ───────────► Firebase Auth (Google OAuth)
                                          ► getUserProgressAndStreak ──► users
```

---

## 19. Important Files (Top 50)

| Rank | File | Why Important |
|---|---|---|
| 1 | [src/hooks/useAuth.tsx](src/hooks/useAuth.tsx) | Central auth + progress state; every protected feature depends on it |
| 2 | [src/lib/userProgress.ts](src/lib/userProgress.ts) | XP system, streaks, leaderboard — core business logic |
| 3 | [src/app/api/ai/route.ts](src/app/api/ai/route.ts) | All AI features in one file; defines all LLM prompts |
| 4 | [src/app/api/razorpay/webhook/route.ts](src/app/api/razorpay/webhook/route.ts) | Subscription lifecycle; bugs here lose revenue |
| 5 | [src/lib/questions.ts](src/lib/questions.ts) | All question CRUD + progress subcollection; used everywhere |
| 6 | [src/app/layout.tsx](src/app/layout.tsx) | Root providers, analytics, fonts |
| 7 | [src/types/question.ts](src/types/question.ts) | Core domain type; union types gate all features |
| 8 | [src/styles/tokens.ts](src/styles/tokens.ts) | Design tokens; changing breaks all styling |
| 9 | [src/styles/shared.ts](src/styles/shared.ts) | Reusable CSS atoms used in every page |
| 10 | [src/lib/cachedQueries.ts](src/lib/cachedQueries.ts) | Server-side cache layer; wrong tags = stale content |
| 11 | [src/contexts/TrackContext.tsx](src/contexts/TrackContext.tsx) | Track state; affects all question queries |
| 12 | [src/app/api/create-order/route.ts](src/app/api/create-order/route.ts) | Payment order creation; connects pricing to Razorpay |
| 13 | [src/lib/embeddings.ts](src/lib/embeddings.ts) | RAG implementation; quality of AI answers depends on this |
| 14 | [src/lib/pricing.ts](src/lib/pricing.ts) | Multi-currency pricing; wrong values = wrong charges |
| 15 | [src/lib/codeRunner.ts](src/lib/codeRunner.ts) | Sandbox execution; security-critical |
| 16 | [src/hooks/useQuestions.ts](src/hooks/useQuestions.ts) | Client-side caching for question lists |
| 17 | [src/hooks/useUpgrade.ts](src/hooks/useUpgrade.ts) | Payment flow; Razorpay script loading + checkout |
| 18 | [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx) | Navigation + auth state display |
| 19 | [src/app/page.tsx](src/app/page.tsx) | Homepage server component; SEO and first impression |
| 20 | [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx) | User home after login |
| 21 | [src/app/theory/page.tsx](src/app/theory/page.tsx) | Most-used feature page |
| 22 | [src/app/theory/TheoryPageClientWrapper.tsx](src/app/theory/TheoryPageClientWrapper.tsx) | (assumed colocated) Theory interactive layer |
| 23 | [src/components/ui/QuestionCards/TheoryCard.tsx](src/components/ui/QuestionCards/) | Core question interaction component |
| 24 | [src/components/ui/AnswerEvaluator/index.tsx](src/components/ui/AnswerEvaluator/) | AI evaluation UI |
| 25 | [src/components/ui/PaywallBanner/index.tsx](src/components/ui/PaywallBanner/) | Revenue-critical: Pro gate |
| 26 | [src/components/ui/CodeEditor/index.tsx](src/components/ui/CodeEditor/) | Monaco + console; used in 3 practice modes |
| 27 | [src/app/mock-interview/MockInterviewClient.tsx](src/app/mock-interview/MockInterviewClient.tsx) | Premium AI feature |
| 28 | [src/app/mock-interview/InterviewResult.tsx](src/app/mock-interview/InterviewResult.tsx) | Scorecard renderer |
| 29 | [src/app/sprint/SprintWrapper.tsx](src/app/sprint/) | Timed challenge orchestration |
| 30 | [src/lib/tracks.ts](src/lib/tracks.ts) | Track configuration; extend to add new tracks |
| 31 | [src/lib/topics.ts](src/lib/topics.ts) | Topic data access layer |
| 32 | [src/lib/blogPosts.ts](src/lib/blogPosts.ts) | Blog data access layer |
| 33 | [src/app/[topic]/page.tsx](src/app/[topic]/page.tsx) | Dynamic topic pages; SEO-important |
| 34 | [src/app/blog/[track]/[slug]/page.tsx](src/app/blog/) | Blog article pages; SEO content |
| 35 | [src/app/admin/components/QuestionForm.tsx](src/app/admin/components/QuestionForm.tsx) | Content management |
| 36 | [src/app/admin/generate/page.tsx](src/app/admin/generate/page.tsx) | AI question generation UI |
| 37 | [src/app/analytics/AnalyticsClientPage.tsx](src/app/analytics/AnalyticsClientPage.tsx) | User stats + leaderboard |
| 38 | [src/app/globals.css](src/app/globals.css) | CSS custom properties (theme system foundation) |
| 39 | [src/data/roadmap/roadmapData.ts](src/data/roadmap/roadmapData.ts) | 30-day curriculum structure |
| 40 | [src/app/api/pricing/route.ts](src/app/api/pricing/route.ts) | Geo-based pricing API |
| 41 | [src/app/api/cron/route.ts](src/app/api/cron/route.ts) | Scheduled maintenance |
| 42 | [src/lib/firebase.ts](src/lib/firebase.ts) | Firebase initialization; misconfiguration breaks auth + DB |
| 43 | [src/contexts/ThemeContext.tsx](src/contexts/ThemeContext.tsx) | Theme system |
| 44 | [src/hooks/useRoadmapProgress.ts](src/hooks/useRoadmapProgress.ts) | localStorage-persisted roadmap state |
| 45 | [src/hooks/usePricing.ts](src/hooks/usePricing.ts) | Client-side pricing with module cache |
| 46 | [src/hooks/usePagination.ts](src/hooks/usePagination.ts) | Generic pagination logic |
| 47 | [src/app/javascript-interview-questions/page.tsx](src/app/javascript-interview-questions/page.tsx) | High-SEO landing page |
| 48 | [scripts/set-admin-claim.js](scripts/set-admin-claim.js) | Admin promotion script |
| 49 | [scripts/backfill-embeddings.js](scripts/backfill-embeddings.js) | RAG data pipeline |
| 50 | [.env.local.example](.env.local.example) | Required secrets template; must be complete |

---

## 20. AI Agent Context

### Project Purpose

JSPrep Pro is a **frontend interview prep SaaS** built with Next.js 14 + Firebase + Groq AI. The core value loop is: practice → AI feedback → track mastery → unlock Pro features. Revenue is purely subscription-based (Razorpay, ₹99/month with multi-currency support).

### Core Architecture

- **Stack:** Next.js 14 App Router, TypeScript, Firebase (Auth + Firestore), Groq (LLM), Cohere (embeddings), Razorpay
- **Pattern:** Server components pre-fetch data → client wrapper components handle all interactivity
- **Database:** Firestore only. No SQL. Two layers: `users/{uid}` root doc (summary stats) + `users/{uid}/progress/{qid}` subcollection (per-question state)
- **AI:** Single endpoint `/api/ai` with `type` parameter. All prompts live in `src/app/api/ai/route.ts`
- **Styling:** Emotion CSS-in-JS. Design tokens in `src/styles/tokens.ts`. Import `tokens.ts` for all colors/spacing, `shared.ts` for reusable atoms

### Key Business Rules

1. `isPro` in `users/{uid}` is the single source of truth for Pro access
2. `applyExpiryCheck()` in `useAuth.tsx` must be called after every progress load
3. XP writes go through `awardProgressXP()` only — never write `xp`/`weeklyXp` directly
4. Write to `users/{uid}/progress/{qid}` via `scheduleProgressWrite()` — never call `upsertProgress` directly from UI code
5. Firestore batch max is 500 ops; flush every 400 in seed scripts
6. Admin check in API routes must use Firebase Admin SDK, not trust client-supplied `isAdmin`
7. Code runner sandbox: debug questions must run without throwing, only produce wrong output
8. Track filtering is cookie-based for SSR; always read from `TrackContext` in client components

### Common Pitfalls

1. **Do not** write `xp` or `weeklyXp` directly — always use `awardProgressXP()`
2. **Do not** call Firestore from page components — go through `src/lib/` functions
3. **Do not** use `progress.masteredIds` or `progress.bookmarkedIds` — they are legacy arrays; use the `progress` subcollection
4. **Do not** add `console.log` to production API routes
5. **Do not** trust `isAdmin` from the client request body — re-read from Firestore via Admin SDK
6. **When adding a new question type**, update `QuestionType` union in `src/types/question.ts` first — TypeScript will guide the rest
7. **When adding a new track**, set `available: false` initially and only flip to `true` when content exists
8. **Pro gating**: check `progress.isPro` (from `useAuth()`), then render `<PaywallBanner>` if false — do not write custom gate logic

### Recommended Coding Conventions

- **File colocation:** Each feature page has a `page.tsx` (server), a `*ClientWrapper.tsx` (client), and a `styles.ts` (Emotion CSS)
- **Imports:** Use `@/` alias for all internal imports
- **Emotion:** Use `css` from `@emotion/react`, import tokens as `import C from '@/styles/tokens'`
- **Types:** All domain types live in `src/types/`. Never redeclare inline
- **Firestore reads:** Always wrap in `unstable_cache` for server components; use in-memory map cache for client hooks
- **API routes:** Return `NextResponse.json({...})`, handle errors with try/catch and explicit status codes
- **No comments** unless the WHY is non-obvious; no JSDoc blocks
- **No default exports** from library files; named exports only
