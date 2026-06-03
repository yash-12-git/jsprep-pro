// ─── System Design Topics Static Data ────────────────────────────────────────
// Full "Concept Hub" content for each topic.
// ─────────────────────────────────────────────────────────────────────────────

export interface SystemDesignTopic {
  slug: string;
  title: string;
  category: string;
  keyword: string;
  description: string;
  extraKeywords?: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Senior";
  questionCount: string;
  track: "system-design";
  status: "published";
  order: number;
  mentalModel: string;
  deepDive: string;
  misconceptions: string[];
  realWorldExamples: string[];
  cheatSheet: string[];
  interviewTips: string[];
  related: string[];
  relatedBlogSlugs: string[];
}

export const SYSTEM_DESIGN_TOPICS: SystemDesignTopic[] = [

  // ─── 1. Rendering Strategies ──────────────────────────────────────────────

  {
    slug: "system-design-rendering-strategies-interview-questions",
    title: "Rendering Strategies (SSR, CSR, SSG, ISR) — System Design Interview Guide",
    category: "Architecture",
    keyword: "Rendering Strategies",
    description:
      "Master the four core rendering strategies — CSR, SSR, SSG, ISR — and Streaming SSR. Know when to use each, how they affect SEO and performance, and how to confidently answer any rendering question in a frontend system design interview.",
    extraKeywords: [
      "server side rendering vs client side rendering",
      "SSR vs CSR vs SSG",
      "ISR nextjs",
      "static site generation",
      "incremental static regeneration",
      "streaming SSR react 18",
      "rendering strategy interview",
      "nextjs getServerSideProps vs getStaticProps",
    ],
    difficulty: "Senior",
    questionCount: "10–15",
    track: "system-design",
    status: "published",
    order: 1,

    mentalModel:
      "Imagine running a restaurant. CSR is handing customers a raw recipe — they cook at home with their device. SSR is cooking to order — a hot plate per request, always fresh, but the kitchen is always busy. SSG is a pre-made buffet — every plate identical, served instantly. ISR is a buffet that quietly replaces cold dishes in the background while guests are already eating, without closing the kitchen.",

    deepDive: `
<h3>The Four Rendering Modes in One Line Each</h3>
<ul>
  <li><strong>CSR</strong> — browser downloads a JS bundle, renders everything client-side. Blank HTML until JS runs.</li>
  <li><strong>SSR</strong> — server generates full HTML per request. Content is immediately readable by bots and users.</li>
  <li><strong>SSG</strong> — HTML generated once at build time. Served as a static file from a CDN.</li>
  <li><strong>ISR</strong> — SSG with background regeneration. Stale page served while a new one is built silently.</li>
</ul>

<h3>CSR — Client-Side Rendering</h3>
<p>The browser receives an almost-empty HTML shell and a JavaScript bundle. React mounts and renders the UI after the bundle downloads, parses, and executes. This means:</p>
<pre><code>// What Googlebot sees immediately for a CSR app
&lt;html&gt;
  &lt;body&gt;
    &lt;div id="root"&gt;&lt;/div&gt; &lt;!-- empty until JS runs --&gt;
    &lt;script src="/bundle.js"&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
<p><strong>Best for:</strong> authenticated dashboards, admin panels, highly interactive tools. Personalized content where pre-rendering adds no value.</p>
<p><strong>Worst for:</strong> SEO-critical marketing pages, e-commerce product pages, anything that needs fast First Contentful Paint.</p>

<h3>SSR — Server-Side Rendering</h3>
<p>The server runs your React component tree and sends complete HTML. The browser displays content immediately, then React "hydrates" — attaches event listeners to the existing HTML without re-rendering.</p>
<pre><code>// Next.js SSR — runs on every request
export async function getServerSideProps(context) {
  const data = await fetchLiveData(context.params.id);
  return { props: { data } };
}
// HTML is fully populated before it reaches the browser</code></pre>
<p><strong>Best for:</strong> pages with frequently changing data (news, stock prices), personalized pages that still need SEO, anything requiring request-time cookies or headers.</p>
<p><strong>Cost:</strong> higher TTFB, server must be running and scaling, no CDN caching of the HTML itself.</p>

<h3>SSG — Static Site Generation</h3>
<p>React runs at <em>build time</em>. The output is a collection of HTML files — no server needed at runtime. Pages are served from a CDN with near-zero latency.</p>
<pre><code>// Next.js SSG — runs once at build time
export async function getStaticProps() {
  const data = await fetchData(); // called at build, not at request time
  return { props: { data }, revalidate: false };
}

export async function getStaticPaths() {
  const slugs = await getAllSlugs();
  return { paths: slugs.map(s =&gt; ({ params: { slug: s } })), fallback: false };
}</code></pre>
<p><strong>Best for:</strong> blogs, docs, marketing pages, anything where content doesn't change between deploys.</p>

<h3>ISR — Incremental Static Regeneration</h3>
<p>Pages are statically generated at build time but can be regenerated in the background after a set interval. The first visitor after the stale period triggers a background regeneration — they still see the old page; the next visitor sees the new one.</p>
<pre><code>export async function getStaticProps() {
  const data = await fetchData();
  return {
    props: { data },
    revalidate: 3600, // regenerate at most every 1 hour
  };
}</code></pre>
<p><strong>Best for:</strong> e-commerce (prices/inventory update hourly), news sites, product pages. The sweet spot between SSG speed and SSR freshness.</p>

<h3>Streaming SSR (React 18)</h3>
<p>Instead of waiting for the full page to render server-side, the server streams HTML in chunks using Suspense boundaries. Above-the-fold content arrives immediately; slower sections (comments, recommendations) stream in later. This improves TTFB dramatically for data-heavy pages.</p>
<pre><code>// React 18 Streaming with Suspense
export default function Page() {
  return (
    &lt;div&gt;
      &lt;Hero /&gt; {/* fast — renders immediately */}
      &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
        &lt;SlowDataSection /&gt; {/* streamed after slow data resolves */}
      &lt;/Suspense&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h3>Decision Framework</h3>
<p>Ask three questions: <strong>(1)</strong> Does this page need SEO? If no → CSR is fine. <strong>(2)</strong> How often does the data change? If rarely → SSG. If hourly → ISR. If per-request → SSR. <strong>(3)</strong> Is the content personalized to the user? If yes → CSR or SSR.</p>`,

    misconceptions: [
      "CSR can't be indexed by Google — Googlebot does execute JavaScript and can index CSR content, but it's slower and less reliable than pre-rendered HTML. For critical SEO pages, don't rely on it.",
      "SSR always beats SSG for SEO — SSG pages are often better because they respond in milliseconds from a CDN with no server-side delay. Google values page speed as a ranking signal.",
      "ISR and SSG are the same thing — SSG is fixed at build time; ISR regenerates deployed pages in the background without a rebuild. They're architecturally different.",
      "Hydration is free — SSR sends HTML but the browser still downloads and runs the full JS bundle to attach event listeners. This 'hydration cost' can cause poor TTI even when FCP is fast.",
      "You must pick one strategy for the whole app — Next.js and similar frameworks let you mix strategies per page: marketing pages as SSG, dashboard as CSR, product pages as ISR.",
    ],

    realWorldExamples: [
      "Next.js e-commerce (Vercel, Shopify): product pages use ISR with revalidate: 3600 — inventory updates hourly without full rebuilds, CDN serves static HTML instantly",
      "News sites (The Guardian, BBC): SSR for breaking news pages where freshness matters more than caching, CSR for comment sections that don't need SEO",
      "Documentation sites (Next.js docs, Tailwind CSS): pure SSG — content changes only on deploy, CDN delivery is near-instant globally",
      "Authenticated SaaS dashboards (Vercel, Linear): CSR — content is user-specific, no SEO benefit from pre-rendering, full interactivity needed",
      "React 18 streaming on large pages: Vercel uses Suspense streaming for their dashboard to show the shell immediately while data-heavy sections stream in",
    ],

    cheatSheet: [
      "CSR: blank HTML shell + JS bundle; worst for SEO; best for authenticated/interactive apps",
      "SSR: full HTML per request; best for dynamic + SEO-critical pages; highest server cost",
      "SSG: HTML at build time; fastest delivery from CDN; content stale until rebuild",
      "ISR: SSG + background regen on interval; best of both; first post-stale visitor sees old page",
      "Streaming SSR (React 18): stream HTML chunks via Suspense; improves TTFB on slow-data pages",
      "Hydration: SSR/SSG HTML + JS bundle still needed; mismatch = hydration error",
      "TTFB: SSG fastest → ISR (CDN hit) → CSR → SSR (server processing)",
      "Next.js: getStaticProps = SSG, getServerSideProps = SSR, revalidate = ISR, no data = SSG",
    ],

    interviewTips: [
      "Always frame rendering choices around trade-offs: SEO needs, data freshness, personalization, and TTFB — never say one is universally better",
      "Interviewers love this question for a blog-vs-dashboard comparison: blog → SSG, dashboard → CSR, product listing → ISR, user profile page → SSR",
      "Mention hydration cost as a caveat of SSR/SSG — sending pre-rendered HTML is not free, the browser still needs to run JS to make the page interactive",
      "React 18 Streaming SSR shows senior-level knowledge — mention it when discussing pages with mixed fast/slow data sources",
      "In Next.js interviews, know that App Router uses React Server Components by default — a different mental model where components can be server-only without getServerSideProps",
    ],

    related: [
      "system-design-bundle-optimization-interview-questions",
      "system-design-network-optimization-interview-questions",
      "system-design-caching-strategies-interview-questions",
    ],
    relatedBlogSlugs: ["rendering-strategies-ssr-csr-ssg-isr"],
  },

  // ─── 2. Microfrontends & Module Federation ────────────────────────────────

  {
    slug: "system-design-microfrontends-interview-questions",
    title: "Microfrontends & Module Federation — System Design Interview Guide",
    category: "Architecture",
    keyword: "Microfrontends",
    description:
      "Learn when and why to split a frontend into microfrontends, how Webpack Module Federation works, how Single-SPA compares, and how to design a microfrontend architecture that actually scales — all the questions interviewers ask seniors about frontend composition.",
    extraKeywords: [
      "microfrontend architecture",
      "webpack module federation",
      "single-spa vs module federation",
      "micro frontend interview questions",
      "monolith vs microfrontend",
      "frontend composition patterns",
      "independent deployment frontend",
    ],
    difficulty: "Senior",
    questionCount: "8–12",
    track: "system-design",
    status: "published",
    order: 2,

    mentalModel:
      "Microfrontends apply the microservices pattern to the UI. Instead of one giant React app deployed by one team, you split the frontend into independently deployable vertical slices — each owned by a team that controls everything from database to UI. The browser stitches these pieces together at runtime or build time, like assembling a page from Lego blocks where each block is a self-contained app.",

    deepDive: `
<h3>The Problem Microfrontends Solve</h3>
<p>In large organisations, a single frontend monolith becomes a bottleneck: 20 teams all commit to the same repo, CI takes 30 minutes, one bad deploy blocks everyone. Microfrontends decouple teams so they can build, test, and deploy independently — exactly like microservices did for backends.</p>

<h3>Four Integration Approaches</h3>

<h4>1. Webpack Module Federation (Most Common)</h4>
<p>Webpack 5's built-in mechanism for sharing code at runtime across separate builds. One app exposes components; another app consumes them — no npm publishing required. The host app downloads the remote bundle lazily when needed.</p>
<pre><code>// Remote (Team B — Cart MFE) — webpack.config.js
new ModuleFederationPlugin({
  name: 'cart',
  filename: 'remoteEntry.js',
  exposes: {
    './CartWidget': './src/CartWidget',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
})

// Host (Shell App) — webpack.config.js
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    cart: 'cart@https://cart.example.com/remoteEntry.js',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
})

// Shell — usage at runtime
const CartWidget = React.lazy(() =&gt; import('cart/CartWidget'));
// &uarr; loads from cart.example.com at runtime, not bundled into shell</code></pre>
<p><strong>Key insight:</strong> <code>shared: { react: { singleton: true } }</code> ensures both apps use the same React instance — critical to avoid the "two Reacts" bug.</p>

<h4>2. Single-SPA</h4>
<p>A JavaScript framework for orchestrating multiple micro-apps. Each app registers with a root-config that controls when to mount/unmount them based on the URL. Unlike Module Federation, Single-SPA is framework-agnostic — you can mix React, Vue, and Angular in the same shell.</p>
<pre><code>// Root config — registers microfrontends
registerApplication({
  name: '@company/navbar',
  app: () =&gt; import('@company/navbar'),
  activeWhen: ['/'], // always active
});
registerApplication({
  name: '@company/products',
  app: () =&gt; import('@company/products'),
  activeWhen: ['/products'],
});</code></pre>

<h4>3. iframes</h4>
<p>Strongest isolation — each microfrontend is sandboxed in its own browsing context. Zero risk of CSS or JS conflicts. But terrible UX: poor accessibility, fixed height issues, hard to share state, navigation breaks browser history.</p>

<h4>4. Web Components</h4>
<p>Native custom elements that can encapsulate framework-specific UI. A React microfrontend wrapped in a Web Component can be dropped into any HTML page. Good for widgets and embeds, not great for complex composed applications.</p>

<h3>Shared State — The Hard Problem</h3>
<p>Microfrontends that need shared state (user session, cart count, notifications) should communicate through <strong>events</strong> not direct references. The shell owns global state; MFEs fire custom events or use a lightweight event bus. Direct imports between MFEs create hidden coupling and break independent deployability.</p>
<pre><code>// Event bus pattern for cross-MFE communication
window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: 3 } }));

// Another MFE listens
window.addEventListener('cart:updated', (e) =&gt; setCount(e.detail.count));</code></pre>

<h3>When NOT to Use Microfrontends</h3>
<p>Small teams and small apps do not benefit — you get all the operational complexity with none of the team-scaling benefit. The overhead of separate repos, CI pipelines, versioning, and bundle size management is only justified when multiple independent teams work on the same product simultaneously.</p>`,

    misconceptions: [
      "Microfrontends mean different frameworks — you can have a React-only microfrontend architecture. Framework diversity is a capability, not a requirement, and usually increases complexity.",
      "Module Federation replaces npm packages — MF is for runtime-loaded UI components, not shared utilities. Shared logic (utils, hooks) should still be published as internal npm packages.",
      "Each microfrontend should have its own design system — shared UI components should come from a single design system package to ensure visual consistency across teams.",
      "Microfrontends are always faster — having 5 separate bundles that all load React independently is often slower. The `shared: singleton` config and careful chunk splitting are needed to avoid duplicate dependencies.",
    ],

    realWorldExamples: [
      "Spotify: different teams own the music player, podcast section, and search — each deployed independently. The shell composes them at runtime.",
      "IKEA: product pages, cart, and checkout are separate deployable frontends that share a design system but are owned by different teams",
      "Amazon: their product page is notoriously composed of hundreds of independent services rendering HTML that is assembled server-side — a server-driven MFE pattern",
      "Large enterprise portals: a financial services platform might have trading, analytics, and portfolio teams each owning their screen within one shell application",
    ],

    cheatSheet: [
      "Microfrontend = independently deployable UI slice, owned by one team end-to-end",
      "Module Federation: Webpack 5 native; share code at runtime; singleton react to avoid dual-React bug",
      "Single-SPA: framework-agnostic orchestrator; route-based mounting; good for multi-framework apps",
      "iframes: strongest isolation; worst UX; use only for truly sandboxed embeds",
      "Shared state: use custom events or event bus, not direct imports between MFEs",
      "Design system: must be shared — one package, consumed by all MFEs",
      "When to use: 3+ teams, same product, independent release cadence needed",
      "When NOT to use: small team (<10 devs), early-stage product, shared release cycle",
    ],

    interviewTips: [
      "Lead with the problem, not the solution — explain why team scaling requires independent deployment before describing the technology",
      "The Module Federation webpack config is commonly asked — know the host/remote/exposes/shared properties and why singleton: true matters for React",
      "Always mention the trade-offs: increased complexity, bundle size management, cross-MFE state sharing, design system coordination, and the debugging overhead of distributed deploys",
      "The 'monolith vs microfrontend' question is really about team size and deployment cadence — anchor your answer on those two factors",
    ],

    related: [
      "system-design-rendering-strategies-interview-questions",
      "system-design-monorepo-interview-questions",
      "system-design-bundle-optimization-interview-questions",
    ],
    relatedBlogSlugs: ["microfrontends-vs-monolith"],
  },

  // ─── 3. Monorepo Architecture ─────────────────────────────────────────────

  {
    slug: "system-design-monorepo-interview-questions",
    title: "Monorepo Architecture (Nx vs Turborepo) — System Design Interview Guide",
    category: "Build Systems",
    keyword: "Monorepo",
    description:
      "Understand monorepo vs polyrepo trade-offs, how Turborepo and Nx solve the scaling problem, what workspace protocols do, and when a monorepo is the right architectural choice — with the depth senior engineers need for system design interviews.",
    extraKeywords: [
      "monorepo vs polyrepo",
      "turborepo vs nx",
      "nx monorepo",
      "turborepo caching",
      "pnpm workspaces",
      "monorepo interview questions",
      "frontend monorepo architecture",
      "code sharing across packages",
    ],
    difficulty: "Advanced",
    questionCount: "6–10",
    track: "system-design",
    status: "published",
    order: 3,

    mentalModel:
      "A monorepo is a single Git repository containing multiple related projects — apps, libraries, design systems, and tools — each with its own package.json but all sharing tooling, CI, and version control history. Think of it as a single office building where each team has its own floor but shares the lobby, elevators, and security system. A polyrepo is each team renting their own building — full independence, but crossing the street every time they need to collaborate.",

    deepDive: `
<h3>Monorepo vs Polyrepo</h3>
<p>In a <strong>polyrepo</strong>, each app or library lives in its own repository. Changes to shared code require publishing a new npm package version, updating dependents, and coordinating cross-repo PRs. In a <strong>monorepo</strong>, all packages live together — atomic cross-package changes, unified CI, and shared tooling.</p>

<h3>The Scaling Problem — Why You Need a Build Tool</h3>
<p>A naive monorepo with 50 packages and <code>npm run build --workspaces</code> rebuilds everything on every change. With 100 packages this takes 20 minutes. Turborepo and Nx solve this with <strong>content-addressed caching</strong> and <strong>task graph parallelization</strong>.</p>

<h3>Turborepo</h3>
<p>Turborepo (by Vercel) is a high-performance build system that wraps your existing package.json scripts. It adds a task graph layer on top of npm/pnpm/yarn workspaces.</p>
<pre><code>// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"], // build dependencies first
      "outputs": ["dist/**"]   // cache these outputs
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    }
  }
}</code></pre>
<p><strong>Remote caching:</strong> <code>turbo run build --remote-cache</code> stores build artifacts in the cloud (Vercel or self-hosted). If the inputs (source files + dependencies) haven't changed, the cache hit restores the output instantly — CI goes from 10 minutes to 30 seconds.</p>

<h3>Nx</h3>
<p>Nx (by Nrwl) is a more opinionated and feature-rich monorepo framework. It provides generators (scaffolding), executors (build/test/lint runners), a visual dependency graph, and deep integration with frameworks like Next.js, Nest.js, and Angular.</p>
<pre><code>// Run only affected packages since main branch
npx nx affected --target=build --base=main

// Visualise the dependency graph
npx nx graph</code></pre>
<p>Nx's <code>affected</code> command is its killer feature — it analyses your import graph and only rebuilds/tests packages whose source or dependencies changed. This is more precise than Turborepo's file-hash-based caching for large repositories.</p>

<h3>Turborepo vs Nx — When to Use Which</h3>
<table>
  <tr><th>Turborepo</th><th>Nx</th></tr>
  <tr><td>Minimal config, wraps existing scripts</td><td>Opinionated, replaces scripts with executors</td></tr>
  <tr><td>Great for JS/TS monorepos already using workspaces</td><td>Great for enterprise projects needing generators/scaffolding</td></tr>
  <tr><td>Vercel remote cache built-in</td><td>Nx Cloud or self-hosted cache</td></tr>
  <tr><td>Lower learning curve</td><td>Steeper, but more power</td></tr>
</table>

<h3>Workspace Protocols</h3>
<p>pnpm and Yarn Berry support <code>workspace:*</code> protocol — packages reference each other directly without publishing to npm. Changes in a shared library are immediately available to all consumers in the repo without a version bump.</p>
<pre><code>// packages/web/package.json
{
  "dependencies": {
    "@company/ui": "workspace:*",   // always the local version
    "@company/utils": "workspace:*"
  }
}</code></pre>`,

    misconceptions: [
      "Monorepos mean one deployable app — a monorepo can contain dozens of apps and libraries, each deployed independently. The repo boundary and the deployment boundary are orthogonal concerns.",
      "Turborepo and Nx replace package managers — they sit on top of npm/pnpm/yarn workspaces. You still need a package manager that understands workspaces; Turborepo/Nx add the smart task running layer.",
      "Monorepos are only for big companies — small teams with shared code (e.g., a web app and a React Native app sharing business logic) benefit significantly from a monorepo.",
      "Git becomes slow in a monorepo — with shallow clones, sparse checkout, and partial clones, git performance in large monorepos is manageable. GitHub/GitLab have specific monorepo optimisations.",
    ],

    realWorldExamples: [
      "Google: the world's largest monorepo (billions of lines of code in a single repo). All internal tools, services, and frontends share the same codebase with a custom build system (Blaze/Bazel).",
      "Meta: React, Jest, and dozens of related packages all live in the facebook/react monorepo — contributors can make atomic changes across packages in a single PR",
      "Vercel: the Next.js repo itself is a Turborepo-powered monorepo — the framework, CLI, docs, and playground are all managed together",
      "Design system teams: a component library, icons package, tokens package, and Storybook all in one monorepo — component changes, token updates, and docs are all committed together atomically",
    ],

    cheatSheet: [
      "Monorepo: one git repo, multiple packages — shared tooling, unified CI, atomic cross-package commits",
      "Polyrepo: separate repos — independent versioning, but cross-repo changes require PRs across repos",
      "Turborepo: lightweight, wraps existing scripts, content-addressed cache, pipeline config in turbo.json",
      "Nx: opinionated, generators + executors, `affected` command for precise change detection, visual graph",
      "workspace:* — pnpm/Yarn Berry protocol to reference local packages without publishing",
      "Remote cache: Turborepo (Vercel) or Nx Cloud — skip rebuilding unchanged packages in CI",
      "Affected commands: only rebuild/test what changed — key to keeping CI fast at scale",
    ],

    interviewTips: [
      "Frame the answer around the code-sharing problem: 'When you have shared libraries consumed by multiple apps, a monorepo makes atomic changes and unified CI possible'",
      "Know the difference between workspace protocols and npm publishing — workspace:* means no publishing required, but you need to publish for external consumers",
      "Turborepo vs Nx is a common follow-up — Turborepo is simpler and wraps existing scripts; Nx is more opinionated with generators and deeper framework integration",
      "Mention remote caching as the key performance feature — 'the same input hash always produces the same output, so CI can skip tasks it has already done'",
    ],

    related: [
      "system-design-microfrontends-interview-questions",
      "system-design-bundle-optimization-interview-questions",
    ],
    relatedBlogSlugs: ["monorepo-turborepo-vs-nx"],
  },

  // ─── 4. Bundle Optimization ───────────────────────────────────────────────

  {
    slug: "system-design-bundle-optimization-interview-questions",
    title: "Bundle Optimization (Tree Shaking, Code Splitting) — System Design Interview Guide",
    category: "Performance",
    keyword: "Bundle Optimization",
    description:
      "Deep-dive into tree shaking, code splitting, dynamic imports, chunk strategy, and module analysis. Understand how to reduce JS bundle size, what tools to use, and how to answer every bundle optimization question with concrete techniques and numbers.",
    extraKeywords: [
      "tree shaking javascript",
      "code splitting webpack",
      "dynamic import react",
      "bundle size optimization",
      "webpack bundle analyzer",
      "lazy loading javascript",
      "dead code elimination",
      "chunk splitting strategy",
    ],
    difficulty: "Advanced",
    questionCount: "8–12",
    track: "system-design",
    status: "published",
    order: 4,

    mentalModel:
      "Think of your JavaScript bundle like a grocery shipment. Without optimization, you send the entire warehouse to every customer — even if they only ordered milk. Tree shaking removes the products nobody ordered (dead code). Code splitting breaks the warehouse into departments — each department is shipped only when the customer walks into that aisle. Dynamic imports are the 'deliver on demand' option — you only request the department when the customer actually needs it.",

    deepDive: `
<h3>Tree Shaking — Eliminating Dead Code</h3>
<p>Tree shaking is the build-time elimination of exported-but-never-imported code. It relies on ES module static analysis — <code>import/export</code> statements are analyzable at build time; <code>require()</code> is not.</p>
<pre><code>// math.js — only add is used by the app
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; } // never imported

// main.js
import { add } from './math';    // only add is included in the bundle
// multiply is tree-shaken out — never shipped to the browser</code></pre>
<p><strong>Common mistakes that break tree shaking:</strong></p>
<ul>
  <li>Importing the entire library: <code>import _ from 'lodash'</code> — use <code>import { debounce } from 'lodash-es'</code> instead (lodash-es uses ES modules)</li>
  <li>Side-effect imports: files that run code on import cannot be shaken. Mark your package as side-effect-free: <code>"sideEffects": false</code> in package.json</li>
  <li>CommonJS dependencies — CJS <code>require()</code> is not statically analyzable. Many older packages must be explicitly configured for tree shaking.</li>
</ul>

<h3>Code Splitting — Splitting One Bundle Into Many</h3>
<p>Instead of shipping one huge JS file, code splitting produces multiple smaller chunks. The browser only downloads what it needs for the current page.</p>

<h4>Route-Based Splitting (Most Impactful)</h4>
<pre><code>// React Router + dynamic import — each route is a separate chunk
const Dashboard = React.lazy(() =&gt; import('./pages/Dashboard'));
const Settings = React.lazy(() =&gt; import('./pages/Settings'));

function App() {
  return (
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;Routes&gt;
        &lt;Route path="/dashboard" element={&lt;Dashboard /&gt;} /&gt;
        &lt;Route path="/settings" element={&lt;Settings /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>

<h4>Vendor Splitting</h4>
<p>Separate your code from third-party libraries. Your code changes on every deploy; React, lodash, etc. don't. Split them so users keep the vendor chunk cached while only redownloading your application code.</p>
<pre><code>// Vite — manual chunks
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        charts: ['recharts'],
      }
    }
  }
}</code></pre>

<h3>Dynamic Imports — Load on Demand</h3>
<pre><code>// Load a heavy library only when the user opens the modal
async function openChartModal() {
  const { Chart } = await import('chart.js'); // downloaded now, not at page load
  renderChart(Chart);
}</code></pre>
<p>Dynamic imports are ideal for: rich text editors, charting libraries, PDF generators, anything large that isn't needed on initial load.</p>

<h3>Analyzing Your Bundle</h3>
<p>You can't optimize what you can't measure. Tools:</p>
<ul>
  <li><strong>webpack-bundle-analyzer</strong> — interactive treemap of what's in your bundle</li>
  <li><strong>vite-bundle-visualizer</strong> — similar for Vite projects</li>
  <li><strong>source-map-explorer</strong> — works on any build with source maps</li>
  <li><strong>bundlephobia.com</strong> — check npm package size before installing</li>
</ul>`,

    misconceptions: [
      "Tree shaking removes all unused code — it only removes unused *exports*. Code that has side effects on import (modifying globals, etc.) cannot be safely removed even if it's never called.",
      "Webpack automatically tree-shakes everything — only works with ES modules (import/export). If a dependency ships CommonJS, you need special plugins or to find an ESM-compatible alternative.",
      "More code splitting is always better — too many tiny chunks means more HTTP requests and more overhead. The optimal chunk size is typically 50–200KB. Below 20KB chunks add more overhead than they save.",
      "Dynamic imports are the same as lazy loading — React.lazy is a React-specific wrapper around dynamic import. The import() syntax itself is a JavaScript language feature.",
    ],

    realWorldExamples: [
      "Lodash: switching from `import _ from 'lodash'` to `import { debounce } from 'lodash-es'` can reduce bundle by 50-70KB",
      "Next.js: automatic code splitting per page — visiting /home only downloads the home page chunk, not the entire app",
      "Rich text editors (TipTap, Quill): loaded dynamically only when user focuses a text area, not on initial page load",
      "Stripe.js: loaded via dynamic import only on payment pages — unnecessary on most pages of a site",
    ],

    cheatSheet: [
      "Tree shaking: dead export elimination; requires ES modules (import/export not require)",
      "sideEffects: false in package.json — tells bundler the package has no side-effect imports",
      "Code splitting: one bundle → many chunks; route-based splitting is highest impact",
      "React.lazy() + Suspense: lazy-load React components with automatic code splitting",
      "dynamic import(): load any module on demand — works without React",
      "Vendor splitting: separate node_modules from app code for better long-term caching",
      "Target chunk size: 50–200KB per chunk; below 20KB adds more overhead than it saves",
      "Analysis tools: webpack-bundle-analyzer, vite-bundle-visualizer, bundlephobia",
    ],

    interviewTips: [
      "Start with measurement — mention bundle-analyzer before talking about solutions. 'I'd first visualize the bundle to find the biggest wins' shows senior thinking.",
      "Route-based code splitting is almost always the highest-impact optimization — mention it first, then discuss granular dynamic imports",
      "Know the three conditions for tree shaking: ES modules, no side effects, and bundler optimization mode (production build)",
      "Vendor chunk splitting and long-term caching is a follow-up many miss — separating vendor code lets browsers cache React across deploys",
    ],

    related: [
      "system-design-rendering-strategies-interview-questions",
      "system-design-network-optimization-interview-questions",
      "system-design-core-web-vitals-interview-questions",
    ],
    relatedBlogSlugs: ["bundle-optimization-tree-shaking-code-splitting"],
  },

  // ─── 5. Caching Strategies ────────────────────────────────────────────────

  {
    slug: "system-design-caching-strategies-interview-questions",
    title: "Caching Strategies — System Design Interview Guide",
    category: "Performance",
    keyword: "Caching Strategies",
    description:
      "Master HTTP caching headers, CDN strategy, service worker caching, stale-while-revalidate, browser storage, and API response caching. Know exactly when to use each caching layer and how to answer every caching question in a frontend system design interview.",
    extraKeywords: [
      "http caching headers",
      "cdn caching",
      "service worker cache",
      "stale-while-revalidate",
      "cache-control max-age",
      "browser storage strategies",
      "frontend caching interview",
      "cache invalidation",
    ],
    difficulty: "Advanced",
    questionCount: "8–10",
    track: "system-design",
    status: "published",
    order: 5,

    mentalModel:
      "Caching is a series of progressively closer copies of your data. The origin server has the source of truth. The CDN has a regional copy. The browser has a local copy. The service worker has an offline copy. Each layer trades freshness for speed — the closer the cache, the faster the response. Your job as a frontend architect is to decide how stale is acceptable and for how long.",

    deepDive: `
<h3>The Caching Layers (Closest to Furthest from User)</h3>

<h4>1. Memory Cache</h4>
<p>The fastest cache — assets already downloaded and held in browser memory for the current session. Zero network requests. Evicted when the browser tab closes.</p>

<h4>2. Disk Cache (Browser HTTP Cache)</h4>
<p>The HTTP cache stores responses based on <code>Cache-Control</code> headers. This is the most important cache layer to understand.</p>
<pre><code># Static assets with content hashes — cache forever
Cache-Control: public, max-age=31536000, immutable
# ^ bundle.abc123.js — if the hash is in the filename, the URL changes on update

# HTML pages — always revalidate
Cache-Control: no-cache
# ^ "no-cache" does NOT mean "don't cache" — it means "revalidate before using"
# ^ "no-store" means "never cache" — completely different

# API responses — short cache
Cache-Control: public, max-age=60, stale-while-revalidate=300</code></pre>
<p><strong>Key directives:</strong> <code>max-age</code> = serve from cache for N seconds. <code>stale-while-revalidate</code> = after max-age, serve stale while fetching fresh in background. <code>immutable</code> = never revalidate (for content-hashed files). <code>no-store</code> = never cache. <code>private</code> = CDN cannot cache, only browser.</p>

<h4>3. Service Worker Cache</h4>
<p>A JavaScript worker that intercepts network requests and can respond from a programmable cache. Enables offline support and fine-grained caching strategies per resource type.</p>
<pre><code>// Service worker — cache-first strategy for static assets
self.addEventListener('fetch', (event) =&gt; {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cached) =&gt;
        cached ?? fetch(event.request).then((response) =&gt; {
          caches.open('images-v1').then((cache) =&gt; cache.put(event.request, response.clone()));
          return response;
        })
      )
    );
  }
});</code></pre>
<p><strong>Common strategies:</strong> Cache-first (static assets), Network-first (API calls), Stale-while-revalidate (semi-dynamic), Network-only (auth), Cache-only (offline fallback).</p>

<h4>4. CDN (Content Delivery Network)</h4>
<p>A globally distributed network of proxy servers that cache responses at edge locations near users. The CDN respects <code>Cache-Control: public</code> directives from your origin server. Reduces latency from 200ms (cross-continent) to 10ms (local PoP).</p>
<p><strong>Cache invalidation:</strong> The hardest problem. Strategies: content hashing (file.abc123.js, never needs invalidation), cache-busting query params (<code>?v=2</code>), and CDN purge APIs for emergency invalidation.</p>

<h3>stale-while-revalidate — The Best of Both Worlds</h3>
<p>The browser (or CDN) serves the stale cached response immediately, then revalidates in the background. The user sees instant response; the cache is fresh for the next request.</p>
<pre><code>Cache-Control: max-age=60, stale-while-revalidate=300
# Serve from cache for 60s. Between 60-300s, serve stale + revalidate.
# After 300s: wait for network response.

// React Query implements the same pattern at the app level
const { data } = useQuery({
  queryKey: ['posts'],
  staleTime: 60_000,   // treat as fresh for 60s
  gcTime: 300_000,     // keep in memory for 5 min after unmount
});</code></pre>`,

    misconceptions: [
      "'no-cache' means don't cache — it actually means 'revalidate before using the cached copy'. To prevent caching entirely, use 'no-store'.",
      "CDNs only cache static files — CDNs can cache API responses too, using Cache-Control: public. This is how edge caching for API routes works in Vercel/Cloudflare.",
      "Service workers are just for offline apps — they're a powerful performance tool. Caching static assets in a service worker means zero-network loads for returning users even on fast connections.",
      "Cache invalidation is easy — it's notoriously hard. Content hashing (embedding a file hash in the filename) is the most reliable solution: the URL itself changes when the file changes, so old caches are never served stale.",
    ],

    realWorldExamples: [
      "Next.js static assets: _next/static/* served with Cache-Control: public, max-age=31536000, immutable — the hash in the filename guarantees freshness without CDN invalidation",
      "React Query / SWR: stale-while-revalidate at the application level — components show cached data instantly, background refetch updates the UI when fresh data arrives",
      "Cloudflare Workers: running JavaScript at the edge, combining CDN caching with dynamic logic — serve cached HTML for anonymous users, bypass cache for authenticated sessions",
      "GitHub's API uses ETag-based conditional requests — `If-None-Match: etag-value`, server returns 304 Not Modified saving bandwidth when data hasn't changed",
    ],

    cheatSheet: [
      "Cache-Control: max-age=N — serve from cache for N seconds",
      "Cache-Control: no-cache — revalidate before use (not 'don't cache'!)",
      "Cache-Control: no-store — never cache",
      "Cache-Control: immutable — never revalidate (use only with content-hashed URLs)",
      "stale-while-revalidate: serve stale, refresh in background",
      "Content hashing: embed file hash in filename — CDN cache never goes stale",
      "Service worker strategies: cache-first (static), network-first (API), SWR (semi-dynamic)",
      "ETag + If-None-Match: conditional requests — 304 response saves bandwidth",
    ],

    interviewTips: [
      "The no-cache vs no-store distinction is a common trick question — interviewers love it. no-cache revalidates, no-store never caches.",
      "Content hashing is the senior answer to 'how do you cache assets forever without serving stale content' — file.abc123.js URL changes on update, old URL stays cached forever safely",
      "React Query / SWR implement stale-while-revalidate at the application layer — this connection to HTTP cache concepts shows breadth",
      "Frame caching decisions around: how often does data change? Is stale data acceptable? Who can see it (public vs private/CDN cacheable)?",
    ],

    related: [
      "system-design-rendering-strategies-interview-questions",
      "system-design-network-optimization-interview-questions",
      "system-design-state-management-interview-questions",
    ],
    relatedBlogSlugs: [],
  },

  // ─── 6. Authentication Architecture ──────────────────────────────────────

  {
    slug: "system-design-authentication-interview-questions",
    title: "Authentication Architecture (JWT, Cookies, SSO) — System Design Interview Guide",
    category: "Security",
    keyword: "Authentication Architecture",
    description:
      "Master JWT vs cookie-based auth, refresh token rotation, httpOnly cookie storage, OAuth 2.0, session management, and SSO. The complete guide to authentication architecture questions that appear in every senior frontend system design interview.",
    extraKeywords: [
      "JWT vs cookie authentication",
      "refresh token rotation",
      "httpOnly cookie",
      "oauth 2.0 frontend",
      "SSO single sign on",
      "session management frontend",
      "token storage security",
      "authentication interview questions",
    ],
    difficulty: "Senior",
    questionCount: "10–15",
    track: "system-design",
    status: "published",
    order: 6,

    mentalModel:
      "Authentication is fundamentally a trust problem: 'How does the server know the next request comes from the same user who logged in?' Cookie-based auth delegates this to the browser — cookies are automatically sent with every request. JWT-based auth hands the user a signed badge they carry themselves — stateless, portable, but impossible to revoke without extra infrastructure. The right choice depends on your threat model, your backend architecture, and whether you need cross-domain sessions.",

    deepDive: `
<h3>The Core Approaches</h3>

<h4>Session-Based (Server-Side Session)</h4>
<p>The server creates a session record on login and returns a session ID as a cookie. On every request, the server looks up the session ID. Session state lives on the server (memory, Redis, DB).</p>
<pre><code>// Login — server creates session, sets cookie
POST /login → server creates session { userId, expires }
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict

// Subsequent requests — browser sends cookie automatically
GET /profile
Cookie: sessionId=abc123  // server looks up session in Redis</code></pre>
<p><strong>Pro:</strong> instant revocation — delete the session record. <strong>Con:</strong> requires session store, doesn't scale horizontally without sticky sessions or shared Redis.</p>

<h4>JWT — JSON Web Tokens</h4>
<p>The server issues a signed token containing claims (userId, roles, expiry). The token is self-verifiable — no database lookup needed. It has three base64-encoded parts: header.payload.signature.</p>
<pre><code>// JWT payload (decoded — NOT encrypted, just base64)
{
  "sub": "user_123",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1700000000,
  "exp": 1700003600  // expires in 1 hour
}
// Signed with a server secret — tampering invalidates the signature</code></pre>
<p><strong>Pro:</strong> stateless — works across microservices without a shared session store. <strong>Con:</strong> cannot revoke individual tokens before expiry without a blocklist (defeating the stateless benefit).</p>

<h3>Token Storage — The Critical Question</h3>
<p>This is the most common interview question in this area:</p>
<ul>
  <li><strong>localStorage</strong> — simple, persists across tabs. Vulnerable to XSS — any JavaScript on your page can read it: <code>localStorage.getItem('token')</code>.</li>
  <li><strong>sessionStorage</strong> — cleared on tab close, still XSS-vulnerable.</li>
  <li><strong>httpOnly cookie</strong> — JavaScript cannot read it (<code>document.cookie</code> won't show it). Protected from XSS. Must mitigate CSRF separately. <strong>This is the recommended storage for access tokens.</strong></li>
</ul>
<pre><code>// Secure token storage — set by server, httpOnly
Set-Cookie: access_token=&lt;jwt&gt;; HttpOnly; Secure; SameSite=Strict; Path=/

// Client code cannot access it
document.cookie  // won't show access_token
localStorage     // empty — token not stored here</code></pre>

<h3>Refresh Token Rotation</h3>
<p>Access tokens are short-lived (15 min). Refresh tokens are long-lived (7–30 days) and stored securely (httpOnly cookie). When the access token expires, the client uses the refresh token to get a new one.</p>
<pre><code>// Token refresh flow
1. Access token expires (401 response)
2. Client sends refresh token to /auth/refresh
3. Server validates refresh token, issues new access + new refresh token
4. Old refresh token is invalidated (rotation — prevents token reuse attacks)
5. Client retries original request with new access token</code></pre>
<p>Rotation means each refresh token is single-use. If a stolen token is used, the legitimate user's next refresh attempt fails, alerting the system to a potential breach.</p>

<h3>OAuth 2.0 and SSO</h3>
<p><strong>OAuth 2.0</strong> is an authorization framework — "Sign in with Google" delegates authentication to a trusted provider. The frontend uses the Authorization Code flow with PKCE (no client secret exposed in browser).</p>
<pre><code>// PKCE Authorization Code Flow
1. Generate code_verifier (random string) + code_challenge (SHA256 hash)
2. Redirect to OAuth provider: /authorize?code_challenge=...&response_type=code
3. User authenticates at provider, redirected back with ?code=...
4. Exchange code + code_verifier for tokens at /token endpoint
// ^ code_verifier proves the same client that started the flow is completing it</code></pre>
<p><strong>SSO (Single Sign-On):</strong> one authentication session works across multiple apps. Implemented via shared cookies on the same domain, or via OAuth/SAML with a central identity provider (Auth0, Okta, Cognito).</p>`,

    misconceptions: [
      "JWT is more secure than sessions — JWT is stateless (convenient for scale) but cannot be revoked without a blocklist. A stolen JWT is valid until expiry. Session IDs can be invalidated instantly.",
      "Storing tokens in localStorage is fine — localStorage is readable by any JavaScript, including injected XSS scripts. An httpOnly cookie prevents this attack vector entirely.",
      "SameSite=Strict fully prevents CSRF — SameSite cookies aren't sent on cross-site requests, which does mitigate most CSRF. But Strict breaks OAuth redirects and legitimate cross-site navigation. Lax is usually the right balance.",
      "OAuth is an authentication protocol — OAuth 2.0 is an *authorization* framework. OpenID Connect (OIDC) is the authentication layer built on top of OAuth 2.0.",
    ],

    realWorldExamples: [
      "GitHub: uses httpOnly session cookies for web authentication; separate API tokens for programmatic access — different token types for different threat models",
      "Vercel dashboard: short-lived JWTs for API calls + refresh token rotation in httpOnly cookies — balance of statelessness and security",
      "Google Sign-In: Authorization Code + PKCE flow; Google issues an ID token (OpenID Connect); your backend validates the signature using Google's public keys",
      "Enterprise SSO (Okta, Azure AD): SAML or OIDC — user logs in once, identity provider issues assertions accepted by dozens of internal apps",
    ],

    cheatSheet: [
      "Session auth: server stores state; instant revocation; requires shared session store for horizontal scaling",
      "JWT: stateless; self-verifiable; no revocation without blocklist; good for microservices",
      "Never store tokens in localStorage — XSS readable; use httpOnly cookies instead",
      "httpOnly cookie: JS cannot read it; automatic on requests; CSRF protection needed",
      "Access token: short-lived (15m); Refresh token: long-lived (7-30d); stored in httpOnly cookie",
      "Refresh token rotation: single-use; detect replay attacks; new pair on every refresh",
      "OAuth 2.0 PKCE: Authorization Code flow for SPAs — code_verifier prevents interception",
      "SSO: central identity provider (Auth0, Okta); OIDC for web; SAML for enterprise",
    ],

    interviewTips: [
      "'Where should tokens be stored?' — httpOnly cookie is the correct answer with the XSS reason. Show you know the CSRF trade-off too.",
      "Explain refresh token rotation in depth — single-use tokens with rotation detect stolen refresh tokens: if the server sees a reused token, it revokes the entire family",
      "JWT vs sessions is a scale + revocation trade-off — JWT scales better (stateless) but can't be revoked without complexity; sessions revoke instantly but need a shared store",
      "PKCE knowledge separates senior candidates — explain why the code_verifier prevents the authorization code interception attack in SPAs",
    ],

    related: [
      "system-design-frontend-security-interview-questions",
      "system-design-state-management-interview-questions",
    ],
    relatedBlogSlugs: ["jwt-vs-cookie-authentication"],
  },

  // ─── 7. Frontend Security ─────────────────────────────────────────────────

  {
    slug: "system-design-frontend-security-interview-questions",
    title: "Frontend Security (XSS, CSRF, CSP) — System Design Interview Guide",
    category: "Security",
    keyword: "Frontend Security",
    description:
      "Master XSS, CSRF, CSP, clickjacking, and token security. Understand attack vectors, prevention strategies, and security headers. Frontend security appears far more often in interviews than most developers expect — this guide covers everything.",
    extraKeywords: [
      "XSS cross site scripting",
      "CSRF cross site request forgery",
      "content security policy CSP",
      "clickjacking prevention",
      "frontend security interview",
      "OWASP frontend",
      "security headers",
      "DOM-based XSS",
    ],
    difficulty: "Senior",
    questionCount: "10–15",
    track: "system-design",
    status: "published",
    order: 7,

    mentalModel:
      "Frontend security is about controlling what runs on your page (XSS), controlling what your browser sends automatically (CSRF), and controlling what your page can do (CSP). XSS injects malicious code into your page. CSRF tricks your browser into sending authenticated requests to another site. CSP is a whitelist that tells the browser which sources are allowed to run scripts, load images, and connect to APIs — even if an attacker injects code, CSP can block it from executing.",

    deepDive: `
<h3>XSS — Cross-Site Scripting</h3>
<p>XSS occurs when an attacker injects executable JavaScript into your page, which runs in other users' browsers in your site's context — with access to cookies, localStorage, DOM, and the ability to make requests as the victim.</p>

<h4>The Three Types</h4>
<ul>
  <li><strong>Stored XSS:</strong> malicious script saved in the database (comment, username) and rendered for other users.</li>
  <li><strong>Reflected XSS:</strong> malicious script in a URL parameter, reflected immediately in the response.</li>
  <li><strong>DOM-based XSS:</strong> malicious script injected via client-side JS that writes to the DOM (innerHTML, document.write, eval).</li>
</ul>
<pre><code>// Vulnerable — sets innerHTML from URL param
const name = new URLSearchParams(location.search).get('name');
document.getElementById('greeting').innerHTML = 'Hello ' + name;
// Attack URL: /page?name=&lt;img src=x onerror="stealCookies()"&gt;

// Safe — textContent doesn't parse HTML
document.getElementById('greeting').textContent = 'Hello ' + name;</code></pre>

<h4>Prevention</h4>
<ul>
  <li>Always use <code>textContent</code> over <code>innerHTML</code> for user-controlled content</li>
  <li>React's JSX auto-escapes by default — <code>dangerouslySetInnerHTML</code> opts out</li>
  <li>Sanitize HTML with DOMPurify before any innerHTML assignment</li>
  <li>Set <code>httpOnly</code> on session cookies — XSS can't steal what JS can't read</li>
</ul>

<h3>CSRF — Cross-Site Request Forgery</h3>
<p>CSRF tricks a logged-in user's browser into sending an authenticated request to your server from a malicious page. Since the browser automatically attaches cookies to same-domain requests, the server can't tell the legitimate request from the forged one.</p>
<pre><code>&lt;!-- Attacker's page -- victim visits this while logged into bank.com --&gt;
&lt;img src="https://bank.com/transfer?to=attacker&amp;amount=1000" /&gt;
&lt;!-- Browser sends GET with bank.com cookies — authenticated by accident --&gt;</code></pre>

<h4>Prevention</h4>
<ul>
  <li><strong>CSRF tokens:</strong> server generates a random token per session; client includes it in forms and AJAX headers; server validates it. Attacker's page cannot read the token (same-origin policy).</li>
  <li><strong>SameSite cookie attribute:</strong> <code>SameSite=Strict</code> — cookies not sent on any cross-site request. <code>SameSite=Lax</code> — sent on top-level navigations (links), not on forms or sub-requests. Both prevent CSRF for most cases.</li>
  <li>Modern APIs: use <code>Authorization: Bearer &lt;token&gt;</code> header instead of cookies — custom headers can't be sent in CSRF attacks.</li>
</ul>

<h3>CSP — Content Security Policy</h3>
<p>CSP is an HTTP header that whitelists which sources are trusted to load scripts, styles, images, and make connections. Even if an attacker injects a script tag, CSP prevents it from executing if the source isn't whitelisted.</p>
<pre><code># Strong CSP header
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.trusted.com;
  style-src 'self' 'unsafe-inline';  # unsafe-inline should be avoided
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';  # prevents clickjacking</code></pre>
<p><code>frame-ancestors 'none'</code> is the CSP equivalent of the X-Frame-Options header — prevents your page from being embedded in iframes (clickjacking protection).</p>

<h3>Clickjacking</h3>
<p>An attacker loads your site in a transparent iframe on their page and tricks users into clicking elements they can't see. Protection: <code>X-Frame-Options: DENY</code> or <code>Content-Security-Policy: frame-ancestors 'none'</code>.</p>

<h3>Key Security Headers</h3>
<pre><code>Content-Security-Policy: default-src 'self'; script-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()</code></pre>`,

    misconceptions: [
      "HTTPS prevents XSS — HTTPS encrypts the transmission but doesn't prevent malicious scripts in your own page's content. XSS runs in your origin, not from a network interception.",
      "React is XSS-proof — React escapes JSX output, but dangerouslySetInnerHTML, eval(), and direct DOM manipulation bypass this. React apps can still have XSS vulnerabilities.",
      "CSRF only affects form submissions — CSRF can use img tags, script tags, fetch with cookies, and any request the browser makes automatically with credentials.",
      "CSP with 'unsafe-inline' still helps — 'unsafe-inline' completely defeats the purpose of CSP for script injection. Use nonces or hashes instead if inline scripts are unavoidable.",
    ],

    realWorldExamples: [
      "GitHub: strict CSP prevents script injection; all user content (README, comments) rendered through a sanitization pipeline that strips dangerous HTML",
      "Banking apps: double-submit CSRF tokens on all state-changing requests; SameSite=Strict cookies; short session expiry",
      "Intercom, Zendesk widgets: loaded via script tags from CDN with SRI (Subresource Integrity) hash — browser verifies the file hasn't been tampered with",
      "Large SaaS platforms (Notion, Figma): use nonce-based CSP — each page load generates a random nonce; only scripts with that nonce in the script tag are executed",
    ],

    cheatSheet: [
      "XSS: use textContent not innerHTML; React JSX escapes by default; sanitize with DOMPurify for rich text",
      "CSRF: SameSite=Strict/Lax cookies; CSRF tokens in headers; use Authorization header (not cookies) for APIs",
      "CSP: whitelist script/style/connect sources; frame-ancestors 'none' stops clickjacking",
      "httpOnly cookie: JS can't read it — protects tokens from XSS theft",
      "Secure cookie: only sent over HTTPS",
      "HSTS: forces HTTPS for all future visits (Strict-Transport-Security)",
      "SRI (Subresource Integrity): integrity='sha256-...' on script/link tags — verifies CDN files haven't changed",
      "X-Content-Type-Options: nosniff — prevents MIME type sniffing attacks",
    ],

    interviewTips: [
      "Explain XSS with a concrete example — the innerHTML from URL params example is clear and memorable",
      "The token storage answer (httpOnly cookie > localStorage) connects XSS to authentication architecture — shows cross-topic depth",
      "CSRF and SameSite cookies — know the difference between Strict (breaks OAuth), Lax (default in modern browsers), and None (requires Secure, allows cross-site)",
      "CSP nonces are the gold standard — mention them for senior-level positions: 'each page load generates a cryptographic nonce; only inline scripts with that nonce execute'",
    ],

    related: [
      "system-design-authentication-interview-questions",
    ],
    relatedBlogSlugs: ["frontend-security-xss-csrf-csp"],
  },

  // ─── 8. State Management Architecture ────────────────────────────────────

  {
    slug: "system-design-state-management-interview-questions",
    title: "State Management Architecture — System Design Interview Guide",
    category: "Architecture",
    keyword: "State Management Architecture",
    description:
      "Master server state vs client state, when to use React Query / SWR vs Redux / Zustand, global vs local state patterns, and how to design scalable state architecture for complex applications — the complete system design answer for state management.",
    extraKeywords: [
      "server state vs client state",
      "React Query vs Redux",
      "Zustand vs Redux",
      "global state management",
      "state management interview",
      "SWR react query comparison",
      "frontend state architecture",
      "when to use redux",
    ],
    difficulty: "Advanced",
    questionCount: "8–12",
    track: "system-design",
    status: "published",
    order: 8,

    mentalModel:
      "The most important insight in modern frontend state management is that there are two fundamentally different types of state: server state (data that lives on the server and you're synchronizing with) and client state (UI state that exists only on the frontend). Mixing them in the same store is the root cause of most state management complexity. Once you separate them, the right tool for each becomes obvious.",

    deepDive: `
<h3>The Two Types of State</h3>

<h4>Server State</h4>
<p>Data that <em>originates on the server</em> and your app displays. It's always potentially stale — another user might have changed it. It needs loading/error states, background refetching, caching, and pagination.</p>
<ul>
  <li>User list from an API</li>
  <li>Product inventory</li>
  <li>Dashboard metrics</li>
</ul>
<p><strong>Best managed by:</strong> React Query, SWR, RTK Query</p>

<h4>Client State</h4>
<p>State that exists <em>only in your frontend</em> — the server doesn't know or care about it.</p>
<ul>
  <li>Modal open/closed</li>
  <li>Currently selected tab</li>
  <li>Form input in progress</li>
  <li>Filter sidebar expanded</li>
</ul>
<p><strong>Best managed by:</strong> useState, useReducer, Zustand, or Context</p>

<h3>React Query — Server State Done Right</h3>
<p>React Query handles all the complexity of server state: caching, background refetching, deduplication, pagination, optimistic updates. You declare what you want; React Query handles when and how to fetch it.</p>
<pre><code>function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () =&gt; fetch(\`/api/users/\${userId}\`).then(r =&gt; r.json()),
    staleTime: 60_000,     // treat as fresh for 1 min
    refetchOnWindowFocus: true, // refetch when tab regains focus
  });

  // Mutations with optimistic updates
  const mutation = useMutation({
    mutationFn: updateUser,
    onMutate: async (newUser) =&gt; {
      await queryClient.cancelQueries(['user', userId]);
      const previous = queryClient.getQueryData(['user', userId]);
      queryClient.setQueryData(['user', userId], newUser); // optimistic
      return { previous };
    },
    onError: (err, newUser, context) =&gt; {
      queryClient.setQueryData(['user', userId], context.previous); // rollback
    },
  });
}</code></pre>

<h3>When Does Redux Actually Make Sense?</h3>
<p>Redux is often added out of habit. Ask before reaching for it:</p>
<ul>
  <li>Is this server state? → Use React Query/SWR instead</li>
  <li>Is this local to one component? → Use useState</li>
  <li>Is this shared across many components but client-only? → Use Zustand or Context</li>
</ul>
<p>Redux genuinely shines for: complex client-side state with many actors and time-travel debugging needs (undo/redo, replaying actions), or large teams needing strict action-based patterns for auditability.</p>

<h3>Zustand — Minimal Global State</h3>
<p>When you need shared client state without Redux's boilerplate. A Zustand store is a hook.</p>
<pre><code>import { create } from 'zustand';

const useUIStore = create((set) =&gt; ({
  sidebarOpen: false,
  theme: 'light',
  toggleSidebar: () =&gt; set((s) =&gt; ({ sidebarOpen: !s.sidebarOpen })),
  setTheme: (theme) =&gt; set({ theme }),
}));

// In any component — no Provider required
const { sidebarOpen, toggleSidebar } = useUIStore();</code></pre>

<h3>The Decision Framework</h3>
<pre><code>Is it from a server/API?
  Yes → React Query / SWR / RTK Query
  No →
    Is it needed by more than one component tree?
      No → useState / useReducer
      Yes →
        Is it simple? → Context (or Zustand)
        Is it complex with many mutations? → Zustand (or Redux if team prefers)</code></pre>`,

    misconceptions: [
      "Redux is required for large React apps — many large production apps (including parts of Facebook) use React Query + local state with no global store. Redux is one option, not a requirement.",
      "Context API is a state management solution — Context is a dependency injection mechanism, not a state manager. It doesn't handle caching, async, or performance optimization. Use it for stable, rarely-changing values.",
      "You should store API responses in Redux — this is the root cause of 'why is Redux so complicated'. Server state (API data) should live in React Query, which handles caching and synchronization natively.",
      "More state in global store = better — global state is harder to reason about, test, and colocate. Keep state as local as possible and only hoist when genuinely shared.",
    ],

    realWorldExamples: [
      "GitHub.com: uses React Query for PR/issue data, local state for UI (selected files in diff), and minimal global state for user session",
      "Notion: document state is server-synced with real-time updates (similar to React Query mutations) + local state for selection, cursor position, panel open/closed",
      "Linear: uses Zustand-like patterns for UI state + a custom sync layer for server state — the issue list is always synced from the server, not stored in Redux",
    ],

    cheatSheet: [
      "Server state: data from API, always potentially stale → React Query / SWR / RTK Query",
      "Client state: UI-only state, frontend owns it → useState, Zustand, Context",
      "React Query: queryKey for cache identity, staleTime for freshness, mutations for updates",
      "Zustand: minimal boilerplate global store; no Provider; select only what you use (avoid re-renders)",
      "Context: fine for stable values (theme, locale, user); bad for frequently changing values (causes re-renders)",
      "Redux: justified for complex client state with undo/redo, devtools, or strict audit requirements",
      "colocation principle: keep state as close to where it's used as possible",
    ],

    interviewTips: [
      "Open with the server state vs client state distinction — most candidates skip it and immediately say 'Redux'. This insight alone elevates your answer.",
      "The 'when would you NOT use Redux' follow-up is common — answer: most server state should be in React Query; most simple UI state should be local useState",
      "Optimistic updates with rollback is a strong signal of senior-level experience — describe the pattern: update cache immediately, rollback on error",
      "React Query's staleTime and gcTime are commonly confused — staleTime is when data becomes 'stale' (still used, but triggers background refetch); gcTime is when unmounted query data is garbage collected",
    ],

    related: [
      "system-design-caching-strategies-interview-questions",
      "system-design-rendering-strategies-interview-questions",
      "system-design-authentication-interview-questions",
    ],
    relatedBlogSlugs: [],
  },

  // ─── 9. Network Optimization ──────────────────────────────────────────────

  {
    slug: "system-design-network-optimization-interview-questions",
    title: "Network Optimization (Prefetch, Preload, HTTP/2) — System Design Interview Guide",
    category: "Performance",
    keyword: "Network Optimization",
    description:
      "Master resource hints (preload, prefetch, preconnect), HTTP/2 multiplexing, image optimization (WebP, lazy loading, srcset), connection management, and network performance patterns. The complete guide to network optimization questions in frontend system design.",
    extraKeywords: [
      "preload vs prefetch",
      "resource hints browser",
      "http2 multiplexing",
      "image optimization webp",
      "lazy loading images",
      "network performance optimization",
      "preconnect dns-prefetch",
      "srcset responsive images",
    ],
    difficulty: "Advanced",
    questionCount: "8–10",
    track: "system-design",
    status: "published",
    order: 9,

    mentalModel:
      "Network optimization is about predicting the future. The browser can only download what it knows it needs. Resource hints are a way to tell the browser what it will need next — before it figures it out itself. Preconnect starts the TCP handshake early. Prefetch downloads future-page assets in idle time. Preload tells the browser 'you'll discover this in 2 seconds anyway — start now'. The goal is eliminating the gap between 'browser discovers a resource' and 'browser starts downloading it'.",

    deepDive: `
<h3>Resource Hints</h3>

<h4>preload — Download Now, Use Soon</h4>
<p>Tells the browser to download a resource with high priority immediately — even before the parser discovers it naturally. Use for critical resources on the current page.</p>
<pre><code>&lt;!-- Preload the LCP image before the parser reaches the img tag --&gt;
&lt;link rel="preload" as="image" href="/hero.webp" /&gt;

&lt;!-- Preload a critical font to avoid FOIT (Flash of Invisible Text) --&gt;
&lt;link rel="preload" as="font" href="/fonts/inter.woff2" crossorigin /&gt;

&lt;!-- Preload a critical JS module --&gt;
&lt;link rel="preload" as="script" href="/critical-chunk.js" /&gt;</code></pre>
<p><strong>Warning:</strong> only preload resources you'll use on the current page. Unused preloads waste bandwidth and trigger browser warnings.</p>

<h4>prefetch — Download Later, Use on Next Page</h4>
<p>Downloads a resource at low priority during browser idle time, for use on a future navigation. The browser may ignore it if the connection is slow or the device is battery-constrained.</p>
<pre><code>&lt;!-- Prefetch the JS chunk for a page the user is likely to navigate to --&gt;
&lt;link rel="prefetch" href="/checkout-chunk.js" /&gt;

// Next.js does this automatically for visible &lt;Link&gt; components
// React Router's &lt;Link&gt; with preload prop does similar</code></pre>

<h4>preconnect — Start the TCP Handshake Early</h4>
<p>Establishes a TCP connection, TLS handshake, and DNS resolution for a third-party origin before any requests are made. Saves 100–500ms when the first actual request goes to that origin.</p>
<pre><code>&lt;link rel="preconnect" href="https://fonts.googleapis.com" /&gt;
&lt;link rel="preconnect" href="https://api.example.com" crossorigin /&gt;
&lt;link rel="dns-prefetch" href="https://analytics.third-party.com" /&gt;
&lt;!-- dns-prefetch: only resolves DNS — lower cost, less benefit than preconnect --&gt;</code></pre>

<h3>Image Optimization</h3>
<p>Images are the #1 cause of slow LCP (Largest Contentful Paint). Three strategies:</p>

<h4>Modern Formats</h4>
<pre><code>&lt;picture&gt;
  &lt;source srcset="/hero.avif" type="image/avif" /&gt;
  &lt;source srcset="/hero.webp" type="image/webp" /&gt;
  &lt;img src="/hero.jpg" alt="Hero" loading="lazy" /&gt;
&lt;/picture&gt;
&lt;!-- AVIF: 50% smaller than JPEG. WebP: 30% smaller. JPEG: fallback --&gt;</code></pre>

<h4>Responsive Images with srcset</h4>
<pre><code>&lt;img
  src="/photo-800.webp"
  srcset="/photo-400.webp 400w, /photo-800.webp 800w, /photo-1200.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  alt="Photo"
/&gt;
&lt;!-- Browser picks the appropriate resolution for the current viewport --&gt;</code></pre>

<h4>Lazy Loading</h4>
<pre><code>&lt;img src="/below-fold.webp" loading="lazy" alt="..." /&gt;
&lt;!-- Native lazy loading — browser defers download until image near viewport --&gt;
&lt;!-- Do NOT lazy-load the LCP image — it will delay your most important metric --&gt;</code></pre>

<h3>HTTP/2 and HTTP/3</h3>
<p><strong>HTTP/1.1</strong> allows ~6 concurrent connections per domain. Workarounds included domain sharding and bundling many files together.</p>
<p><strong>HTTP/2</strong> multiplexes multiple requests over a single TCP connection. Domain sharding is now counterproductive. Many small files are fine because they share one connection.</p>
<p><strong>HTTP/3</strong> uses QUIC (UDP-based) — eliminates TCP head-of-line blocking, faster reconnection on mobile network switches. Chrome uses HTTP/3 for Google services.</p>`,

    misconceptions: [
      "preload and prefetch are the same — preload is high-priority for the current page; prefetch is low-priority for future pages. Confusing them wastes bandwidth or misses the optimization.",
      "More parallel connections = faster — HTTP/1.1 domain sharding (splitting assets across sub-domains) is harmful in HTTP/2 because it breaks multiplexing and adds connection overhead.",
      "Lazy loading all images improves performance — lazy loading the LCP (Largest Contentful Paint) image delays the most important metric. Only lazy-load below-the-fold images.",
      "WebP is always better than JPEG — AVIF is significantly better than WebP (~50% vs ~30% savings over JPEG). Serve AVIF with WebP and JPEG as fallbacks using the picture element.",
    ],

    realWorldExamples: [
      "Next.js Image component: automatic WebP/AVIF conversion, srcset generation, lazy loading, blur placeholder — abstracts all image optimization into one component",
      "Vercel edge network: preconnect headers injected automatically for common third-party origins (Google Fonts, etc.) on all Next.js deployments",
      "React Router future flag (preloadData): automatically prefetches route data for Link components in the viewport, not just the chunk",
      "E-commerce product pages: preload the hero product image (LCP), prefetch the cart page chunk, preconnect to the payments API origin",
    ],

    cheatSheet: [
      "preload: high-priority, current page — use for LCP image, critical fonts, critical scripts",
      "prefetch: low-priority, future pages — use for next-navigation chunks",
      "preconnect: start TCP+TLS early for known third-party origins",
      "dns-prefetch: DNS only — cheaper than preconnect, use for less-critical origins",
      "loading=lazy: native lazy loading — only for below-fold images, never for LCP image",
      "WebP/AVIF: 30-50% smaller than JPEG; serve with picture element for fallback",
      "srcset + sizes: serve appropriately sized image for each viewport — never load 1200px image on mobile",
      "HTTP/2: multiplexing — many small files are fine; domain sharding is harmful",
    ],

    interviewTips: [
      "The preload vs prefetch distinction is a reliable filter question — most developers confuse them; knowing both with examples signals depth",
      "Lazy loading the LCP image is a common mistake to mention — 'I would not lazy-load the hero image because it delays the Largest Contentful Paint metric'",
      "HTTP/2 multiplexing is why Next.js/Vite are happy to split into many small chunks — one connection, many parallel streams, no penalty",
      "Connect image optimization to Core Web Vitals metrics: LCP is almost always images — AVIF/WebP, preload, no lazy-load on LCP image",
    ],

    related: [
      "system-design-bundle-optimization-interview-questions",
      "system-design-caching-strategies-interview-questions",
      "system-design-core-web-vitals-interview-questions",
    ],
    relatedBlogSlugs: [],
  },

  // ─── 10. Core Web Vitals & Performance ───────────────────────────────────

  {
    slug: "system-design-core-web-vitals-interview-questions",
    title: "Core Web Vitals & Performance — System Design Interview Guide",
    category: "Performance",
    keyword: "Core Web Vitals",
    description:
      "Master LCP, INP, CLS, and TTFB — what they measure, what causes them to be poor, and exactly how to fix each one. Understand why Google uses Core Web Vitals as ranking signals and how to design for performance from the architecture level down.",
    extraKeywords: [
      "core web vitals",
      "LCP largest contentful paint",
      "INP interaction to next paint",
      "CLS cumulative layout shift",
      "TTFB time to first byte",
      "web performance interview",
      "lighthouse performance",
      "frontend performance optimization",
    ],
    difficulty: "Senior",
    questionCount: "8–12",
    track: "system-design",
    status: "published",
    order: 10,

    mentalModel:
      "Core Web Vitals measure three aspects of user experience: loading (LCP — how quickly the main content appears), interactivity (INP — how quickly the page responds to input), and visual stability (CLS — how much the layout unexpectedly shifts). Google uses them as ranking signals because they correlate with whether users stay or leave. Improving them is not just a performance exercise — it's a business metric.",

    deepDive: `
<h3>LCP — Largest Contentful Paint</h3>
<p>Measures the time from navigation to when the largest visible element renders in the viewport. Usually a hero image, banner, or above-the-fold heading. <strong>Good: &lt; 2.5s. Needs improvement: 2.5–4s. Poor: &gt; 4s.</strong></p>

<h4>Common LCP Causes and Fixes</h4>
<ul>
  <li><strong>Slow server response (TTFB)</strong> → Use CDN, SSG/ISR instead of SSR, optimize database queries</li>
  <li><strong>Render-blocking resources</strong> → Inline critical CSS, defer non-critical scripts</li>
  <li><strong>Unoptimized LCP image</strong> → Use WebP/AVIF, add <code>rel="preload"</code>, set proper dimensions, never lazy-load it</li>
  <li><strong>Client-side rendering</strong> → Browser sees blank HTML until JS runs; use SSR/SSG to deliver rendered HTML</li>
</ul>
<pre><code>&lt;!-- Optimal LCP image setup --&gt;
&lt;link rel="preload" as="image" href="/hero.avif" /&gt;
&lt;img
  src="/hero.avif"
  fetchpriority="high"
  width="1200" height="600"
  alt="Hero"
  &lt;!-- NO loading="lazy" — lazy loading kills LCP --&gt;
/&gt;</code></pre>

<h3>INP — Interaction to Next Paint</h3>
<p>Replaced FID in 2024. Measures the time from user input (click, tap, key press) to when the browser paints the next frame in response. <strong>Good: &lt; 200ms. Poor: &gt; 500ms.</strong></p>

<h4>Causes and Fixes</h4>
<ul>
  <li><strong>Long Tasks on the main thread</strong> → Break up with <code>scheduler.yield()</code> or setTimeout, use Web Workers for CPU-heavy work</li>
  <li><strong>Heavy event handlers</strong> → Debounce, defer non-critical work, avoid synchronous layout recalculations</li>
  <li><strong>Large React re-renders</strong> → memo, useMemo, useCallback, virtualize long lists (react-virtual)</li>
</ul>
<pre><code>// Yield to the browser between expensive operations
async function processLargeDataset(items) {
  for (let i = 0; i &lt; items.length; i++) {
    process(items[i]);
    if (i % 100 === 0) {
      await scheduler.yield(); // let browser handle pending interactions
    }
  }
}</code></pre>

<h3>CLS — Cumulative Layout Shift</h3>
<p>Measures unexpected visual movement of page elements during loading. An image that loads and pushes text down is a CLS violation. <strong>Good: &lt; 0.1. Poor: &gt; 0.25.</strong></p>

<h4>Causes and Fixes</h4>
<ul>
  <li><strong>Images without dimensions</strong> → Always set width and height on img tags; browser reserves space before the image loads</li>
  <li><strong>Dynamically injected content</strong> → Reserve space with min-height or skeleton placeholders</li>
  <li><strong>Web fonts causing FOIT/FOUT</strong> → Use <code>font-display: swap</code> and preload the font</li>
</ul>
<pre><code>&lt;!-- Reserve space — no layout shift when image loads --&gt;
&lt;img src="/photo.webp" width="800" height="600" alt="..." /&gt;

/* CSS — aspect-ratio maintains space */
.image-container {
  aspect-ratio: 4 / 3;
  width: 100%;
}</code></pre>

<h3>TTFB — Time to First Byte</h3>
<p>Time from navigation start to the first byte of the HTML response. Affected by server processing time, redirects, and network latency. A slow TTFB affects all other metrics because nothing can render before HTML arrives.</p>
<p><strong>Fix:</strong> CDN edge caching (serves HTML from a server near the user), SSG/ISR (serve pre-built HTML instantly), optimize server-side queries.</p>

<h3>Measuring and Monitoring</h3>
<pre><code>// web-vitals library — report in real user monitoring (RUM)
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(({ value, rating }) =&gt; analytics.track('LCP', { value, rating }));
onINP(({ value, rating }) =&gt; analytics.track('INP', { value, rating }));
onCLS(({ value, rating }) =&gt; analytics.track('CLS', { value, rating }));</code></pre>`,

    misconceptions: [
      "Lighthouse score = Core Web Vitals — Lighthouse is a lab tool (simulated, controlled). Core Web Vitals measured by Google are from real users (field data). A 100 Lighthouse score doesn't guarantee good field CWV.",
      "CLS is only caused by images — any element that shifts: ads loading, cookie banners, dynamic content injected above existing content, web fonts swapping — all cause CLS.",
      "INP replaced FID and measures the same thing — FID measured only the first interaction and only the input delay. INP measures all interactions throughout the page lifetime and includes processing time and render time.",
      "Improving one metric automatically improves others — optimizations can conflict: SSR improves LCP but adds server processing time (TTFB). Heavy JavaScript frameworks hurt INP. Trade-offs must be measured.",
    ],

    realWorldExamples: [
      "Next.js Image component: sets width/height automatically (fixes CLS), serves WebP/AVIF (improves LCP), lazy-loads off-screen images (improves initial page weight)",
      "News sites after CWV rollout: BBC, Guardian significantly improved LCP by moving from CSR to SSR/SSG and preloading hero images — correlated with ranking improvements",
      "E-commerce: product image CLS is a common issue — fixed by CSS aspect-ratio on image containers; Pinterest improved CLS by 50% this way",
      "web-vitals library used in production by large sites to collect real user metrics and alert on regressions before they affect rankings",
    ],

    cheatSheet: [
      "LCP < 2.5s: optimize hero image (WebP, preload, no lazy), reduce TTFB (CDN, SSG), remove render-blocking resources",
      "INP < 200ms: break up long tasks, defer non-critical work, virtualize lists, avoid layout thrashing",
      "CLS < 0.1: always set width/height on images, reserve space for dynamic content, preload fonts",
      "TTFB < 800ms: CDN edge caching, SSG/ISR, optimize server queries",
      "fetchpriority='high': on LCP image (tells browser to prioritize this fetch)",
      "font-display: swap: use fallback font while web font loads — prevents FOIT",
      "scheduler.yield(): yield main thread between long tasks to maintain INP",
      "web-vitals library: measure real user CWV in production",
    ],

    interviewTips: [
      "Know all four metrics cold: LCP (loading), INP (interactivity), CLS (stability), TTFB (server). Explain what each measures and the good/poor thresholds.",
      "The connection between rendering strategy and LCP is key: CSR pages have poor LCP because the browser sees blank HTML; SSG serves rendered HTML instantly from CDN",
      "Mention real user monitoring vs lab testing — Lighthouse is useful for development, but real user data (field data) is what Google uses for rankings",
      "scheduler.yield() is an advanced technique that shows current knowledge — it's the modern replacement for setTimeout-based task yielding",
    ],

    related: [
      "system-design-rendering-strategies-interview-questions",
      "system-design-network-optimization-interview-questions",
      "system-design-bundle-optimization-interview-questions",
    ],
    relatedBlogSlugs: [],
  },
];
