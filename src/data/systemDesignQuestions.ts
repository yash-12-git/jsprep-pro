import type { Question } from './questions';

export const SYSTEM_DESIGN_CATEGORIES = [
  'Rendering Strategies',
  'Microfrontends',
  'Monorepo',
  'Bundle Optimization',
  'Caching Strategies',
  'Authentication',
  'Frontend Security',
  'State Management',
  'Network Optimization',
  'Core Web Vitals',
];

export const systemDesignQuestions: Question[] = [

  // ─── RENDERING STRATEGIES (6001–6006) ────────────────────────────────────

  {
    id: 6001, cat: 'Rendering Strategies', tags: ['core'],
    q: 'What is the difference between CSR, SSR, SSG, and ISR?',
    hint: 'Where and when HTML is generated — client, server on request, server at build time, or server with revalidation',
    answer: `<p>These are four strategies for deciding <em>where</em> and <em>when</em> HTML is produced.</p>
<p><strong>CSR (Client-Side Rendering)</strong> — the server sends a bare HTML shell; JavaScript downloads and renders everything in the browser. Fast TTFB, slow FCP, poor SEO.</p>
<p><strong>SSR (Server-Side Rendering)</strong> — HTML is generated on the server per request. Good SEO and fast FCP but higher TTFB under load; server must run Node.</p>
<p><strong>SSG (Static Site Generation)</strong> — HTML is generated once at build time and served as a static file from a CDN. Fastest possible delivery; stale for frequently changing data.</p>
<p><strong>ISR (Incremental Static Regeneration)</strong> — SSG pages are regenerated in the background after a <code>revalidate</code> interval (Next.js). First visitor after expiry may see stale content while rebuild happens.</p>
<pre><code>// Next.js ISR example
export async function getStaticProps() {
  const data = await fetchData();
  return {
    props: { data },
    revalidate: 60, // regenerate at most once per 60s
  };
}</code></pre>
<div class="tip">💡 Interview framing: choose based on <strong>how often data changes</strong> (SSG for rarely, ISR for periodically, SSR for per-request, CSR for fully private/auth-gated).</div>`,
  },

  {
    id: 6002, cat: 'Rendering Strategies', tags: ['core'],
    q: 'When would you choose SSR over SSG for a page?',
    hint: 'SSR makes sense when content is personalized, real-time, or cannot be known at build time',
    answer: `<p>Choose SSR over SSG when:</p>
<ul>
<li><strong>Content is per-user</strong> — a dashboard, cart, or profile page. SSG can't encode user-specific data at build time.</li>
<li><strong>Data changes very frequently</strong> — live scores, stock prices, breaking news. ISR revalidation windows would always show stale content.</li>
<li><strong>SEO matters AND content is real-time</strong> — SSR delivers fresh HTML to crawlers without client-side rendering delay.</li>
<li><strong>You need request-time context</strong> — cookies, headers, geolocation, A/B test assignments available only at request time.</li>
</ul>
<p><strong>Trade-offs of choosing SSR:</strong></p>
<ul>
<li>Higher server cost — every request spins up rendering work.</li>
<li>Higher TTFB vs CDN-cached static files.</li>
<li>Must manage server scaling and cold starts.</li>
</ul>
<div class="tip">💡 A common pattern: SSG the marketing/blog pages, SSR the dashboard, and CSR the deeply interactive editor.</div>`,
  },

  {
    id: 6003, cat: 'Rendering Strategies', tags: ['mid'],
    q: 'What is Streaming SSR and how does it improve perceived performance?',
    hint: 'React 18 + HTTP chunked transfer — shell arrives first, slow parts stream in as they resolve',
    answer: `<p><strong>Streaming SSR</strong> uses HTTP chunked transfer encoding to flush HTML to the browser incrementally rather than waiting for the entire page to render server-side.</p>
<p><strong>How it works (React 18 + Next.js App Router):</strong></p>
<ol>
<li>Server sends the HTML shell immediately (nav, layout, static content).</li>
<li>Slow data-fetching components are wrapped in <code>&lt;Suspense&gt;</code> with a fallback (skeleton).</li>
<li>As each suspended boundary resolves, React streams the HTML chunk followed by an inline <code>&lt;script&gt;</code> that replaces the placeholder.</li>
</ol>
<pre><code>// app/page.tsx
export default function Page() {
  return (
    &lt;Layout&gt;
      &lt;HeroBanner /&gt; {/* static, streams immediately */}
      &lt;Suspense fallback={&lt;Skeleton /&gt;}&gt;
        &lt;RecommendationFeed /&gt; {/* slow DB query, streams when ready */}
      &lt;/Suspense&gt;
    &lt;/Layout&gt;
  );
}</code></pre>
<p><strong>Performance benefit:</strong> TTFB is fast (shell), FCP is fast (visible content), and Time to Interactive is not blocked by the slowest data fetch on the page.</p>`,
  },

  {
    id: 6004, cat: 'Rendering Strategies', tags: ['mid'],
    q: 'What is hydration and what causes hydration mismatches?',
    hint: 'Hydration attaches React event listeners to server-rendered HTML; mismatches happen when server and client render different output',
    answer: `<p><strong>Hydration</strong> is the process where React takes server-rendered HTML already in the DOM and attaches event listeners + React fiber state to it without re-rendering the whole tree from scratch.</p>
<p><strong>Why mismatches happen:</strong> React compares the server HTML with what the client render would produce. If they differ, React throws a hydration error and falls back to a full client re-render (slow and potentially visually jarring).</p>
<p><strong>Common mismatch causes:</strong></p>
<ul>
<li><code>Date.now()</code> or <code>Math.random()</code> used during render — different values server vs client.</li>
<li>Accessing <code>window</code>, <code>localStorage</code>, or <code>navigator</code> during SSR — they don't exist server-side.</li>
<li>Browser extensions injecting DOM nodes (ads, dark-mode extensions).</li>
<li>Incorrect HTML nesting (e.g., <code>&lt;p&gt;</code> inside <code>&lt;p&gt;</code>) that browsers auto-correct differently.</li>
<li>Locale-dependent formatting (dates, numbers) where server and client timezones differ.</li>
</ul>
<pre><code>// Fix: defer browser-only code
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null; // renders same as server</code></pre>`,
  },

  {
    id: 6005, cat: 'Rendering Strategies', tags: ['adv'],
    q: 'What is partial hydration / islands architecture and why does it matter?',
    hint: 'Only interactive components hydrate; static parts stay inert HTML — reduces JS payload dramatically',
    answer: `<p><strong>Islands architecture</strong> (Astro, Fresh, Marko) treats a page as mostly static HTML with isolated "islands" of interactivity that hydrate independently.</p>
<p><strong>Traditional SSR problem:</strong> Even if 90% of the page is static text, the entire component tree must hydrate — downloading and parsing all JavaScript just to make a nav dropdown work.</p>
<p><strong>Islands approach:</strong></p>
<ul>
<li>Static sections are pure HTML — zero JS shipped for them.</li>
<li>Interactive widgets (carousel, form, modal) are explicit islands — each hydrates independently with only its own JS bundle.</li>
<li>Result: drastically smaller Total Blocking Time and better INP.</li>
</ul>
<pre><code>// Astro syntax
---
import Counter from './Counter.tsx'; // React component
---
&lt;main&gt;
  &lt;h1&gt;Static content — no JS&lt;/h1&gt;
  &lt;Counter client:load /&gt;  {/* hydrates this island only */}
&lt;/main&gt;</code></pre>
<p><strong>React Server Components</strong> push the same idea into React itself — server components render to HTML, client components hydrate selectively.</p>`,
  },

  {
    id: 6006, cat: 'Rendering Strategies', tags: ['mid'],
    q: 'What are the SEO implications of CSR vs SSR?',
    hint: 'Googlebot can render JS but it is deferred and unreliable; SSR guarantees crawlers get full HTML immediately',
    answer: `<p><strong>CSR SEO concerns:</strong></p>
<ul>
<li>Googlebot does render JavaScript but via a second wave deferred by days or weeks — content may not be indexed promptly.</li>
<li>Other crawlers (Bing, social previews, Slack unfurls) do <em>not</em> execute JavaScript — they see an empty shell.</li>
<li>Meta tags for OG / Twitter cards are missing on CSR pages without SSR or a pre-rendering service.</li>
</ul>
<p><strong>SSR / SSG advantages:</strong></p>
<ul>
<li>Full HTML is available on first byte — crawlers index it immediately.</li>
<li>Title, description, canonical, structured data are all present in the initial response.</li>
<li>Faster TTFB and FCP improve Google's page experience signals (LCP, CLS).</li>
</ul>
<p><strong>Mitigation options for CSR:</strong></p>
<ul>
<li>Use a pre-rendering service (Prerender.io) for non-Google crawlers.</li>
<li>Dynamic rendering — detect crawler user-agents and serve SSR HTML.</li>
<li>Migrate high-priority landing pages to SSR or SSG.</li>
</ul>`,
  },

  // ─── MICROFRONTENDS (6007–6012) ───────────────────────────────────────────

  {
    id: 6007, cat: 'Microfrontends', tags: ['core'],
    q: 'What is a microfrontend and what problem does it solve?',
    hint: 'Independently deployable frontend slices owned by separate teams — solves monolith coordination overhead',
    answer: `<p>A <strong>microfrontend</strong> extends the microservice concept to the frontend: the UI is split into independently developed, tested, and deployed pieces, each owned by a separate team.</p>
<p><strong>Problem solved:</strong></p>
<ul>
<li><strong>Coordination overhead</strong> — large teams merge into one repo; every deploy requires full-team coordination.</li>
<li><strong>Tech heterogeneity</strong> — teams can choose their framework independently (React + Vue + Angular in one app).</li>
<li><strong>Independent release cadence</strong> — checkout team deploys without waiting for recommendations team.</li>
<li><strong>Codebase scalability</strong> — bounded context prevents the monolith from becoming unmaintainable.</li>
</ul>
<p><strong>Integration approaches:</strong></p>
<ul>
<li>Build-time: npm packages (tight coupling — shared releases needed).</li>
<li>Run-time via iframes — strong isolation, poor UX.</li>
<li>Run-time via JavaScript — Module Federation, Single-SPA (most common).</li>
<li>Server-side composition — Edge Side Includes, server-side includes.</li>
</ul>`,
  },

  {
    id: 6008, cat: 'Microfrontends', tags: ['mid'],
    q: 'How does Webpack Module Federation work?',
    hint: 'Host app loads remote entry files at runtime and consumes exposed modules as if they were local — shared singleton deps avoid duplication',
    answer: `<p><strong>Module Federation</strong> (Webpack 5) lets a running application dynamically load code from another independently deployed app at runtime.</p>
<p><strong>Key concepts:</strong></p>
<ul>
<li><strong>Host</strong> — the shell app that consumes remote modules.</li>
<li><strong>Remote</strong> — an app that exposes modules. It builds a <code>remoteEntry.js</code> file.</li>
<li><strong>Shared</strong> — dependencies both apps use (React, ReactDOM) are declared shared so only one copy loads.</li>
</ul>
<pre><code>// Remote webpack.config.js
plugins: [new ModuleFederationPlugin({
  name: 'checkout',
  filename: 'remoteEntry.js',
  exposes: { './CheckoutApp': './src/CheckoutApp' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
})]

// Host webpack.config.js
plugins: [new ModuleFederationPlugin({
  remotes: { checkout: 'checkout@https://checkout.example.com/remoteEntry.js' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
})]

// Host usage
const CheckoutApp = React.lazy(() => import('checkout/CheckoutApp'));</code></pre>
<p><strong>Runtime behaviour:</strong> the host downloads <code>remoteEntry.js</code> on demand, negotiates shared module versions, and loads only what's needed.</p>`,
  },

  {
    id: 6009, cat: 'Microfrontends', tags: ['mid'],
    q: 'What are the main challenges of microfrontends in production?',
    hint: 'Shared dependencies, consistent UX, cross-app communication, testing boundaries, and operational complexity',
    answer: `<p>Microfrontends solve team scaling but introduce their own hard problems:</p>
<p><strong>1. Shared dependency versioning</strong> — if host runs React 18 and a remote ships React 17, you get two React instances, breaking hooks. Module Federation's <code>singleton: true</code> mitigates this but requires version alignment.</p>
<p><strong>2. Design consistency</strong> — each team owns their UI; without a shared design system and component library, UX fragments across the product.</p>
<p><strong>3. Cross-app communication</strong> — apps can't share React state. Common patterns: Custom Events (browser), a shared event bus, or URL/query params.</p>
<p><strong>4. CSS isolation</strong> — global styles bleed between apps. Fix: CSS Modules, shadow DOM, or a strict CSS-in-JS approach per team.</p>
<p><strong>5. Testing</strong> — integration tests across independently deployed apps are hard. E2E tests must orchestrate multiple services.</p>
<p><strong>6. Performance</strong> — multiple independent bundles, multiple network requests, risk of dependency duplication. Module Federation helps but requires careful shared config.</p>
<p><strong>7. Operational overhead</strong> — N deploys, N monitoring setups, N CI pipelines. The team must be large enough to justify this cost.</p>`,
  },

  {
    id: 6010, cat: 'Microfrontends', tags: ['adv'],
    q: 'How do you share state between microfrontends?',
    hint: 'No shared React tree — use Custom Events, a shared pub/sub singleton, URL state, or a backend-for-frontend',
    answer: `<p>Microfrontends run in separate JavaScript scopes with no shared component tree. State sharing options:</p>
<p><strong>1. Custom DOM Events</strong> — the simplest approach. Fire a <code>CustomEvent</code> on <code>window</code>; other apps listen.</p>
<pre><code>// App A fires
window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: 3 } }));

// App B listens
window.addEventListener('cart:updated', (e) => setCartCount(e.detail.count));</code></pre>
<p><strong>2. Shared event bus singleton</strong> — expose a pub/sub module via Module Federation's shared config. All apps import the same instance.</p>
<p><strong>3. URL / query params</strong> — state that should survive navigation and deep links belongs in the URL. React Router's search params work across app boundaries.</p>
<p><strong>4. Web Storage</strong> — <code>localStorage</code> / <code>sessionStorage</code> with <code>storage</code> events for cross-tab sync. Simple but no reactive binding.</p>
<p><strong>5. Backend-for-Frontend (BFF)</strong> — the authoritative state lives server-side. Each MFE re-fetches when needed. No frontend coupling at all — preferred for complex state.</p>
<div class="tip">💡 The cleanest architecture avoids shared frontend state entirely — each MFE is responsible for its own data and communicates only through well-defined events or the URL.</div>`,
  },

  {
    id: 6011, cat: 'Microfrontends', tags: ['core'],
    q: 'When should you NOT use microfrontends?',
    hint: 'Small teams, tightly coupled UX, shared data everywhere — the coordination cost exceeds the benefit',
    answer: `<p>Microfrontends are an organisational solution — they only pay off when the team and product are large enough to justify the overhead.</p>
<p><strong>Do NOT use microfrontends when:</strong></p>
<ul>
<li><strong>Small team (&lt;10 engineers)</strong> — one team can't benefit from independent deployability. You just add complexity.</li>
<li><strong>Tight UX coupling</strong> — if features constantly share components and state, you're fighting the architecture every day.</li>
<li><strong>Early-stage product</strong> — domain boundaries are unclear. Split too early and you'll get the seams wrong and need to undo them.</li>
<li><strong>Performance is critical</strong> — multiple independent bundles + runtime module loading adds latency that a monolith doesn't have.</li>
<li><strong>No strong ownership model</strong> — microfrontends require each team to own and operate their slice end-to-end. Without that culture, you just get a distributed monolith.</li>
</ul>
<div class="tip">💡 Rule of thumb: if you need microfrontends, you'll know — because merging PRs across teams is blocking your release cadence. Start with a well-structured monorepo first.</div>`,
  },

  {
    id: 6012, cat: 'Microfrontends', tags: ['mid'],
    q: 'What is Single-SPA and how does it differ from Module Federation?',
    hint: 'Single-SPA is a router/lifecycle orchestrator; Module Federation is a module-sharing mechanism — they solve different layers',
    answer: `<p><strong>Single-SPA</strong> is a JavaScript framework that acts as a top-level router for microfrontends. It manages application lifecycle hooks (bootstrap, mount, unmount) and decides which MFE is active based on the URL.</p>
<pre><code>import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@org/checkout',
  app: () => import('@org/checkout'),
  activeWhen: ['/checkout'],
});

start();</code></pre>
<p><strong>Module Federation</strong> (Webpack 5) is a <em>module loading</em> mechanism — it lets one app dynamically import code from another at runtime, sharing dependencies efficiently.</p>
<p><strong>Key differences:</strong></p>
<table>
<tr><th></th><th>Single-SPA</th><th>Module Federation</th></tr>
<tr><td>What it solves</td><td>Routing & lifecycle</td><td>Module sharing</td></tr>
<tr><td>Framework-agnostic</td><td>Yes</td><td>Webpack-only</td></tr>
<tr><td>Dependency sharing</td><td>No</td><td>Yes (singleton)</td></tr>
<tr><td>Partial page embedding</td><td>Hard</td><td>Easy</td></tr>
</table>
<p>They are often used together: Single-SPA orchestrates routing, Module Federation handles runtime code sharing.</p>`,
  },

  // ─── MONOREPO (6013–6017) ─────────────────────────────────────────────────

  {
    id: 6013, cat: 'Monorepo', tags: ['core'],
    q: 'What is a monorepo and what are its advantages over a polyrepo setup?',
    hint: 'All packages in one repo — atomic commits, easier refactors, shared tooling; trade-off is CI scale and access control',
    answer: `<p>A <strong>monorepo</strong> stores multiple projects/packages in a single Git repository. A <strong>polyrepo</strong> gives each project its own repo.</p>
<p><strong>Monorepo advantages:</strong></p>
<ul>
<li><strong>Atomic cross-package commits</strong> — one PR can change a shared library and all consumers simultaneously, keeping them in sync.</li>
<li><strong>Easier large-scale refactors</strong> — rename a function across 20 packages in one commit; no cross-repo PR coordination.</li>
<li><strong>Shared tooling</strong> — one ESLint config, one TypeScript config, one CI setup for all packages.</li>
<li><strong>Dependency visibility</strong> — you can see exactly which packages depend on what; circular deps are detectable at the repo level.</li>
<li><strong>Simpler DX</strong> — <code>pnpm install</code> at root installs everything; no npm linking hacks needed.</li>
</ul>
<p><strong>Trade-offs:</strong></p>
<ul>
<li>CI must be smart (only build/test affected packages) — tools like Turborepo and Nx handle this.</li>
<li>Access control is coarser — everyone can see all packages. CODEOWNERS files mitigate this.</li>
<li>Repo size grows — Git history includes all packages; shallow clones help.</li>
</ul>`,
  },

  {
    id: 6014, cat: 'Monorepo', tags: ['mid'],
    q: 'How does Turborepo\'s caching work and what makes it fast?',
    hint: 'Task outputs are hashed by inputs (files + env vars); cache hits skip execution entirely — local and remote caches both supported',
    answer: `<p>Turborepo speeds up monorepo builds through <strong>content-addressed caching</strong> and <strong>parallel execution</strong>.</p>
<p><strong>Caching mechanism:</strong></p>
<ol>
<li>Before running a task, Turbo computes a hash from: source files in the package, env variables listed in <code>turbo.json</code>, the task's dependencies' output hashes.</li>
<li>If a cache entry exists for that hash, Turbo replays the cached output (logs + output files) instead of running the task.</li>
<li>Cache hits are instantaneous — CI re-runs of unchanged packages take milliseconds.</li>
</ol>
<pre><code>// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],  // build deps first
      "outputs": ["dist/**"],
      "env": ["NODE_ENV"]       // include in hash
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}</code></pre>
<p><strong>Remote cache</strong> — Turborepo can push/pull cache to Vercel Remote Cache or a self-hosted HTTP cache. First CI run populates it; all subsequent machines (and developer laptops) benefit.</p>`,
  },

  {
    id: 6015, cat: 'Monorepo', tags: ['mid'],
    q: 'How does Nx differ from Turborepo?',
    hint: 'Nx has a plugin ecosystem, code generators, and module boundary enforcement; Turborepo is minimal and pipeline-focused',
    answer: `<p>Both tools optimize monorepo task running with caching and parallelism, but they differ in scope:</p>
<table>
<tr><th></th><th>Turborepo</th><th>Nx</th></tr>
<tr><td>Focus</td><td>Fast pipeline runner</td><td>Full monorepo platform</td></tr>
<tr><td>Plugin ecosystem</td><td>Minimal</td><td>Rich (React, Angular, Node, etc.)</td></tr>
<tr><td>Code generators</td><td>No</td><td>Yes (<code>nx generate</code>)</td></tr>
<tr><td>Module boundaries</td><td>No</td><td>Yes (ESLint rules per tag)</td></tr>
<tr><td>Project graph</td><td>Inferred</td><td>Explicit + visual graph UI</td></tr>
<tr><td>Remote cache</td><td>Vercel / self-hosted</td><td>Nx Cloud / self-hosted</td></tr>
<tr><td>Learning curve</td><td>Low</td><td>Higher</td></tr>
</table>
<p><strong>Nx affected commands</strong> — <code>nx affected:test</code> runs tests only for packages changed since the last main branch merge, dramatically cutting CI time.</p>
<p><strong>When to pick Turborepo:</strong> you want minimal config, your team already knows the toolchain, and you don't need generators or boundary enforcement.</p>
<p><strong>When to pick Nx:</strong> large org, multiple frameworks, need guardrails on inter-package imports, want a visual dependency graph.</p>`,
  },

  {
    id: 6016, cat: 'Monorepo', tags: ['core'],
    q: 'What are pnpm workspaces and why are they preferred in monorepos?',
    hint: 'pnpm hoists deps once via hard links — saves disk space and prevents phantom dependencies vs npm/yarn workspaces',
    answer: `<p><strong>pnpm workspaces</strong> link all packages in a monorepo together so they can import each other as if they were published packages, while sharing a single <code>node_modules</code> store.</p>
<pre><code># pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'</code></pre>
<p><strong>Why pnpm over npm/yarn workspaces:</strong></p>
<p><strong>1. Hard-link store</strong> — pnpm stores each package version once globally and hard-links into projects. A 100-package monorepo doesn't duplicate React 100 times on disk.</p>
<p><strong>2. Strict dependency resolution</strong> — pnpm only allows importing packages listed in a package's own <code>package.json</code>. npm/yarn hoist everything, enabling "phantom dependencies" (importing a transitive dep that isn't declared — breaks when the transitive dep is removed).</p>
<p><strong>3. Speed</strong> — hard links are faster to set up than copies; install times drop 2–5× vs npm on large repos.</p>
<p><strong>4. Filtering</strong> — <code>pnpm --filter @org/ui build</code> runs a command in just one package; <code>pnpm -r build</code> runs it across all.</p>`,
  },

  {
    id: 6017, cat: 'Monorepo', tags: ['mid'],
    q: 'What are module boundary rules in Nx and why do they matter?',
    hint: 'ESLint rules enforced via project tags — prevents forbidden imports between domains (e.g., feature libs importing from other features)',
    answer: `<p>Nx lets you tag each project (e.g., <code>scope:checkout</code>, <code>type:feature</code>, <code>type:util</code>) and then write ESLint rules that restrict which tags can import from which.</p>
<pre><code>// .eslintrc.json
"@nx/enforce-module-boundaries": ["error", {
  "depConstraints": [
    { "sourceTag": "type:feature", "onlyDependOnLibsWithTags": ["type:ui", "type:util", "type:data-access"] },
    { "sourceTag": "scope:checkout", "notDependOnLibsWithTags": ["scope:profile"] }
  ]
}]</code></pre>
<p><strong>Why this matters:</strong></p>
<ul>
<li>Prevents accidental coupling between business domains (checkout code importing profile internals).</li>
<li>Keeps the dependency graph a DAG — no cycles between feature libraries.</li>
<li>Catches violations at lint time (CI) before they become architectural debt.</li>
<li>Makes it safe to eventually extract a domain into its own repo or microfrontend — no hidden cross-domain dependencies.</li>
</ul>`,
  },

  // ─── BUNDLE OPTIMIZATION (6018–6023) ─────────────────────────────────────

  {
    id: 6018, cat: 'Bundle Optimization', tags: ['core'],
    q: 'What is tree shaking and what conditions must be met for it to work?',
    hint: 'Dead code elimination via static analysis of ES module imports — requires ESM, no side-effect imports, no CommonJS',
    answer: `<p><strong>Tree shaking</strong> is the process of removing unused exports from a bundle by statically analyzing which imports are referenced.</p>
<p><strong>Conditions required:</strong></p>
<ul>
<li><strong>ES Modules (ESM)</strong> — <code>import</code>/<code>export</code> are statically analyzable. CommonJS <code>require()</code> is dynamic so bundlers can't determine what's used at build time.</li>
<li><strong><code>sideEffects: false</code> in package.json</strong> — tells the bundler it's safe to drop any module that isn't imported. Without this, bundlers assume every module might have side effects (e.g., polyfills modifying globals).</li>
<li><strong>No dynamic import patterns</strong> — <code>import(variable)</code> defeats static analysis.</li>
<li><strong>Bundler support</strong> — Webpack, Rollup, esbuild, Vite all support tree shaking by default for ESM.</li>
</ul>
<pre><code>// utils.ts — only 'add' is imported, 'multiply' will be shaken out
export function add(a: number, b: number) { return a + b; }
export function multiply(a: number, b: number) { return a * b; }

// index.ts
import { add } from './utils'; // multiply never bundled</code></pre>
<div class="tip">💡 Common mistake: importing from a barrel file (<code>import { Button } from '@ui'</code>) can defeat tree shaking if the barrel re-exports from CommonJS modules. Prefer deep imports for large libraries.</div>`,
  },

  {
    id: 6019, cat: 'Bundle Optimization', tags: ['core'],
    q: 'What is code splitting and how does dynamic import() enable it?',
    hint: 'Split the bundle into chunks loaded on demand — dynamic import() is the mechanism, React.lazy is the React wrapper',
    answer: `<p><strong>Code splitting</strong> divides the JavaScript bundle into smaller chunks that are loaded on demand rather than upfront, reducing initial load time.</p>
<p><strong>How dynamic import() works:</strong></p>
<pre><code>// Without code splitting — everything in one bundle
import HeavyChart from './HeavyChart';

// With code splitting — HeavyChart loaded only when needed
const HeavyChart = React.lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;HeavyChart /&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>
<p><strong>Bundler behaviour:</strong> when the bundler (Webpack/Vite/Rollup) sees a dynamic <code>import()</code>, it emits a separate chunk file. That chunk is only downloaded when the <code>import()</code> call executes at runtime.</p>
<p><strong>Common split points:</strong></p>
<ul>
<li>Route-level — each page/route is a separate chunk (most impactful).</li>
<li>Heavy library — <code>import('chart.js')</code> only when a chart is rendered.</li>
<li>Feature flag — only load premium features for Pro users.</li>
</ul>`,
  },

  {
    id: 6020, cat: 'Bundle Optimization', tags: ['mid'],
    q: 'How do you analyze and diagnose large bundle sizes?',
    hint: 'webpack-bundle-analyzer, Vite\'s rollup-plugin-visualizer, source-map-explorer — find what is large and why',
    answer: `<p><strong>Tools:</strong></p>
<ul>
<li><code>webpack-bundle-analyzer</code> — generates an interactive treemap of all modules and their sizes. Run with <code>ANALYZE=true next build</code>.</li>
<li><code>rollup-plugin-visualizer</code> / <code>vite-bundle-visualizer</code> — equivalent for Vite/Rollup.</li>
<li><code>source-map-explorer</code> — analyzes the production source map to show the real size contribution of each module.</li>
<li>Bundlephobia — check the size of npm packages before installing them.</li>
</ul>
<p><strong>Common culprits found during analysis:</strong></p>
<ul>
<li><strong>Moment.js locale files</strong> — ~70 kB of locale data bundled even if you only use English. Fix: use <code>date-fns</code> or configure IgnorePlugin to exclude locales.</li>
<li><strong>Full lodash</strong> — <code>import _ from 'lodash'</code> bundles everything. Fix: <code>import debounce from 'lodash/debounce'</code> or use lodash-es.</li>
<li><strong>Barrel file imports</strong> — <code>import { X } from '@ui'</code> may pull in the entire library. Fix: deep imports or <code>sideEffects: false</code>.</li>
<li><strong>Duplicate packages</strong> — two versions of the same package in node_modules due to peer dep conflicts.</li>
</ul>`,
  },

  {
    id: 6021, cat: 'Bundle Optimization', tags: ['mid'],
    q: 'What is vendor chunk splitting and why is it important for caching?',
    hint: 'Separate third-party code (React, lodash) from app code — vendors change rarely so their chunk stays cached across deploys',
    answer: `<p><strong>Vendor chunk splitting</strong> separates third-party dependencies (React, ReactDOM, lodash, etc.) from your application code into a dedicated chunk.</p>
<p><strong>Why it matters for caching:</strong></p>
<ul>
<li>Your application code changes on every deploy; vendor libraries change rarely.</li>
<li>Without splitting, a single JS file changes on every deploy — users must re-download React with every code push.</li>
<li>With splitting, the vendor chunk URL (content-hashed) stays the same across deploys — it's served from the browser cache immediately.</li>
</ul>
<pre><code>// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-router': ['react-router-dom'],
        'vendor-query': ['@tanstack/react-query'],
      }
    }
  }
}</code></pre>
<p><strong>Result:</strong> users who visited before only need to download the small app chunk on the next deploy, not the large vendor chunk again.</p>`,
  },

  {
    id: 6022, cat: 'Bundle Optimization', tags: ['adv'],
    q: 'What is the module/nomodule pattern for differential serving?',
    hint: 'Ship modern ESM to capable browsers and legacy transpiled bundle to IE/old browsers — reduces bundle size for majority of users',
    answer: `<p><strong>Differential serving</strong> ships two builds: a modern one (ES2020+ with minimal transpilation) and a legacy one (ES5 for old browsers).</p>
<pre><code>&lt;!-- Modern browsers load this (smaller, faster) --&gt;
&lt;script type="module" src="app.modern.js"&gt;&lt;/script&gt;

&lt;!-- Legacy browsers (IE11) load this; modern browsers ignore it --&gt;
&lt;script nomodule src="app.legacy.js"&gt;&lt;/script&gt;</code></pre>
<p><strong>Why it matters:</strong></p>
<ul>
<li>Babel transpilation of async/await, optional chaining, nullish coalescing adds ~10–20% to bundle size in polyfills.</li>
<li>95%+ of users are on modern browsers — they get a leaner bundle.</li>
<li>IE11 and very old browsers get the bloated legacy bundle — acceptable since they're a tiny minority.</li>
</ul>
<p><strong>In practice:</strong> Vite handles this automatically via <code>@vitejs/plugin-legacy</code>. Next.js's <code>browserslist</code> config controls transpilation targets.</p>`,
  },

  {
    id: 6023, cat: 'Bundle Optimization', tags: ['core'],
    q: 'What is lazy loading and how does it apply to images and components?',
    hint: 'Defer loading of off-screen resources until needed — native loading="lazy" for images, React.lazy + Suspense for components',
    answer: `<p><strong>Lazy loading</strong> defers downloading a resource until it is needed (user scrolls to it, navigates to a route, or interacts with a feature).</p>
<p><strong>Images — native lazy loading:</strong></p>
<pre><code>&lt;img src="hero.jpg" loading="lazy" alt="Hero" /&gt;</code></pre>
<p>The browser only fetches the image when it enters (or is near) the viewport. Supported in all modern browsers. Next.js <code>&lt;Image&gt;</code> adds this automatically.</p>
<p><strong>React components — <code>React.lazy</code>:</strong></p>
<pre><code>const Modal = React.lazy(() => import('./Modal'));

function App() {
  const [open, setOpen] = useState(false);
  return open ? (
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;Modal /&gt;
    &lt;/Suspense&gt;
  ) : &lt;button onClick={() => setOpen(true)}&gt;Open&lt;/button&gt;;
}</code></pre>
<p>The Modal bundle is only downloaded when the user clicks "Open" — not on initial page load.</p>
<p><strong>Impact:</strong> route-level lazy loading is typically the highest-ROI optimization — initial bundle can shrink 40–70% for content-rich apps.</p>`,
  },

  // ─── CACHING STRATEGIES (6024–6029) ──────────────────────────────────────

  {
    id: 6024, cat: 'Caching Strategies', tags: ['core'],
    q: 'What is the Cache-Control header and what are its key directives?',
    hint: 'HTTP header that tells browsers and CDNs how long to cache a response — max-age, no-cache, no-store, immutable',
    answer: `<p><code>Cache-Control</code> is an HTTP response header that instructs browsers and intermediate caches (CDNs, proxies) how to store and serve a response.</p>
<p><strong>Key directives:</strong></p>
<ul>
<li><code>max-age=N</code> — cache the response for N seconds. After expiry the browser revalidates with the server.</li>
<li><code>s-maxage=N</code> — like max-age but only for shared caches (CDNs). Overrides max-age for CDNs.</li>
<li><code>no-cache</code> — don't serve from cache without revalidating with the server first (304 check). Despite the name, it <em>does</em> cache.</li>
<li><code>no-store</code> — never cache. Used for sensitive data (banking, personal health).</li>
<li><code>immutable</code> — tells the browser the resource will never change; don't revalidate even if max-age expires. Used with content-hashed filenames.</li>
<li><code>stale-while-revalidate=N</code> — serve stale for up to N seconds while fetching a fresh copy in the background.</li>
<li><code>public</code> — CDNs are allowed to cache. <code>private</code> — only the browser may cache (not CDNs).</li>
</ul>
<pre><code># Content-hashed JS/CSS — cache forever, never revalidate
Cache-Control: public, max-age=31536000, immutable

# HTML — revalidate every request but serve stale instantly
Cache-Control: public, max-age=0, stale-while-revalidate=86400</code></pre>`,
  },

  {
    id: 6025, cat: 'Caching Strategies', tags: ['mid'],
    q: 'What is stale-while-revalidate and why is it a good default for HTML pages?',
    hint: 'Serve the cached (stale) response immediately while fetching fresh in the background — eliminates latency without sacrificing freshness',
    answer: `<p><code>stale-while-revalidate</code> (SWR) is a Cache-Control extension that says: "serve the cached version immediately (even if stale), but simultaneously fetch a fresh version in the background."</p>
<p><strong>Without SWR:</strong> After <code>max-age</code> expires, the next request blocks waiting for the network — the user sees latency on every cache miss.</p>
<p><strong>With SWR:</strong></p>
<ol>
<li>First request within max-age → served instantly from cache.</li>
<li>Request after max-age but within SWR window → served instantly from stale cache; background revalidation starts.</li>
<li>Next request → gets the fresh version (background fetch completed).</li>
</ol>
<pre><code>Cache-Control: max-age=60, stale-while-revalidate=600
# Serve fresh for 60s; serve stale (but refresh) for 10 more minutes</code></pre>
<p><strong>Why good for HTML:</strong> HTML pages change infrequently enough that showing a 60-second-old version is fine for most users. Eliminates the "cache miss spike" at deploy time when all users hit the origin simultaneously.</p>
<p><strong>React Query / SWR library:</strong> implements the same pattern at the data-fetching layer — show cached data immediately while refetching in the background.</p>`,
  },

  {
    id: 6026, cat: 'Caching Strategies', tags: ['core'],
    q: 'What is content-based cache busting and how does it work?',
    hint: 'Hash file contents and embed the hash in the filename — hash changes when content changes, so old URLs stay cached forever',
    answer: `<p><strong>Content-based cache busting</strong> includes a fingerprint of the file's content in its URL (filename or query param). The URL changes only when the file changes, allowing infinite cache lifetimes for unchanged files.</p>
<pre><code>// Webpack/Vite output
main.a1b2c3d4.js  // hash changes when source changes
vendor.e5f6a7b8.js

// Cache-Control for hashed files
Cache-Control: public, max-age=31536000, immutable</code></pre>
<p><strong>How the browser update flow works:</strong></p>
<ol>
<li>User's browser has <code>main.a1b2c3d4.js</code> cached for 1 year.</li>
<li>You deploy a code change — the new file is <code>main.x9y0z1w2.js</code>.</li>
<li>The updated HTML references the new filename — browser fetches it fresh.</li>
<li>Old <code>main.a1b2c3d4.js</code> is simply never requested again (it expires naturally).</li>
</ol>
<p><strong>Key insight:</strong> The HTML file itself should have a short/no cache time (or use <code>no-cache</code>) because it's the entry point that references all hashed assets. If the HTML is stale, users get the old filenames.</p>`,
  },

  {
    id: 6027, cat: 'Caching Strategies', tags: ['mid'],
    q: 'What caching strategies can a service worker implement?',
    hint: 'Cache-first, network-first, stale-while-revalidate, cache-only, network-only — each suits different resource types',
    answer: `<p>A <strong>service worker</strong> intercepts network requests and can apply different caching strategies per resource type:</p>
<p><strong>Cache-first</strong> — serve from cache, fall back to network. Best for: versioned static assets (JS, CSS, fonts). Users get instant loads; stale risk is low since filenames change on update.</p>
<p><strong>Network-first</strong> — try network, fall back to cache if offline. Best for: API responses where freshness matters. If network is slow, the user waits.</p>
<p><strong>Stale-while-revalidate</strong> — serve cache immediately, update cache from network in background. Best for: content that can tolerate being one refresh cycle stale (blog posts, product listings).</p>
<p><strong>Cache-only</strong> — only serve from cache, never hit network. Best for: pre-cached app shells in offline-first PWAs.</p>
<p><strong>Network-only</strong> — never use cache. Best for: analytics, payment requests where you must not serve stale data.</p>
<pre><code>// Workbox helper (used by Next.js PWA plugin)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({ cacheName: 'images', plugins: [new ExpirationPlugin({ maxEntries: 50 })] })
);</code></pre>`,
  },

  {
    id: 6028, cat: 'Caching Strategies', tags: ['mid'],
    q: 'What is ETags and conditional requests, and when does the browser use them?',
    hint: 'ETag is a fingerprint the server sends; browser sends If-None-Match on revalidation — 304 Not Modified skips re-downloading the body',
    answer: `<p>An <strong>ETag</strong> (Entity Tag) is an opaque identifier the server assigns to a specific version of a resource.</p>
<pre><code>// Server response
HTTP/1.1 200 OK
ETag: "abc123"
Cache-Control: no-cache
Content-Type: text/html</code></pre>
<p><strong>Revalidation flow:</strong></p>
<ol>
<li>Browser stores the response with its ETag.</li>
<li>On next request (after cache expires or with <code>no-cache</code>), browser sends: <code>If-None-Match: "abc123"</code></li>
<li>If content unchanged → server responds <code>304 Not Modified</code> with no body — saves bandwidth.</li>
<li>If content changed → server responds <code>200 OK</code> with new content and new ETag.</li>
</ol>
<p><strong>Last-Modified / If-Modified-Since</strong> — older alternative using a timestamp instead of a hash. Less reliable (timestamps can be off).</p>
<p><strong>When browsers use conditional requests:</strong></p>
<ul>
<li>When <code>Cache-Control: no-cache</code> is set (revalidate every time).</li>
<li>When <code>max-age</code> has expired.</li>
<li>When the user does a soft reload (F5 on Windows).</li>
</ul>`,
  },

  {
    id: 6029, cat: 'Caching Strategies', tags: ['adv'],
    q: 'What is cache invalidation and why is it considered hard?',
    hint: 'Knowing when a cached item is stale requires global coordination — the cache has no automatic knowledge that the source changed',
    answer: `<p><strong>Cache invalidation</strong> is the process of removing or marking stale cached entries when the underlying data changes. Phil Karlton famously said: "There are only two hard things in Computer Science: cache invalidation and naming things."</p>
<p><strong>Why it's hard:</strong></p>
<ul>
<li><strong>No automatic notification</strong> — the cache doesn't know the origin changed. You must explicitly tell it.</li>
<li><strong>Distributed state</strong> — content may be cached in browsers (worldwide), CDN edge nodes (hundreds of PoPs), and application caches simultaneously. Purging all of them atomically is difficult.</li>
<li><strong>Dependency chains</strong> — a product page cache depends on the product, its price, its stock level, and the user's locale. Any of those changing should invalidate the page, but tracking all dependencies is complex.</li>
<li><strong>Stale reads</strong> — during the window between a data change and cache invalidation, some users see stale data.</li>
</ul>
<p><strong>Common patterns to manage it:</strong></p>
<ul>
<li>Content-hashed URLs — invalides automatically when content changes (no explicit purge needed).</li>
<li>Short TTLs — accept stale windows rather than trying to purge proactively.</li>
<li>CDN purge API — Cloudflare, Fastly provide tag-based purging (purge all edges caching a given tag).</li>
<li>Cache-Control: <code>no-cache</code> + ETag — always revalidate but serve from cache on 304.</li>
</ul>`,
  },

  // ─── AUTHENTICATION (6030–6035) ───────────────────────────────────────────

  {
    id: 6030, cat: 'Authentication', tags: ['core'],
    q: 'What are the security differences between storing a JWT in localStorage vs an HttpOnly cookie?',
    hint: 'localStorage is XSS-vulnerable; HttpOnly cookies are inaccessible to JS but need CSRF protection',
    answer: `<p><strong>localStorage</strong></p>
<ul>
<li>Accessible via JavaScript — any XSS vulnerability can steal the token: <code>document.cookie</code> — wait, actually <code>localStorage.getItem('token')</code>.</li>
<li>Token theft = account takeover. Attacker can make authenticated API calls from anywhere.</li>
<li>Not automatically sent to the server — must manually attach: <code>Authorization: Bearer &lt;token&gt;</code>.</li>
</ul>
<p><strong>HttpOnly cookie</strong></p>
<ul>
<li><code>HttpOnly</code> flag prevents JavaScript from reading the cookie — XSS cannot steal it.</li>
<li><code>Secure</code> flag ensures it only travels over HTTPS.</li>
<li><code>SameSite=Strict/Lax</code> prevents CSRF — cookie not sent on cross-origin requests.</li>
<li>Automatically included by the browser on every same-origin request — no manual header attachment.</li>
</ul>
<pre><code>Set-Cookie: token=&lt;jwt&gt;; HttpOnly; Secure; SameSite=Strict; Path=/</code></pre>
<p><strong>Verdict:</strong> HttpOnly cookies are strictly more secure. The main downside is CSRF risk (mitigated by SameSite) and that the token is sent on every request (including non-API routes) — use a short <code>Path</code> to scope it.</p>`,
  },

  {
    id: 6031, cat: 'Authentication', tags: ['mid'],
    q: 'What is refresh token rotation and why is it important?',
    hint: 'Each refresh issues a new refresh token and invalidates the old one — if a stolen token is used, the legitimate session is detectable',
    answer: `<p><strong>The problem:</strong> Access tokens are short-lived (15 min), but refresh tokens are long-lived (days/weeks). A stolen refresh token gives an attacker indefinite access.</p>
<p><strong>Refresh token rotation:</strong></p>
<ol>
<li>When a client uses a refresh token to get a new access token, the server issues a brand-new refresh token and invalidates the old one.</li>
<li>If an attacker steals the refresh token and tries to use it after the legitimate client already rotated it, the server detects the reuse of an already-invalidated token.</li>
<li>Server policy on reuse detection: invalidate the entire refresh token family (all sessions) — forces re-authentication.</li>
</ol>
<pre><code>// Token family concept
POST /auth/refresh { refreshToken: "rt_v1" }
→ { accessToken: "at_new", refreshToken: "rt_v2" }
// rt_v1 is now invalid

// If attacker uses rt_v1 again:
POST /auth/refresh { refreshToken: "rt_v1" }
→ 401 — AND server invalidates rt_v2 too (reuse detected)</code></pre>
<p><strong>Storage:</strong> Refresh tokens should be stored in HttpOnly cookies, never localStorage.</p>`,
  },

  {
    id: 6032, cat: 'Authentication', tags: ['mid'],
    q: 'What is OAuth 2.0 PKCE and when should you use it?',
    hint: 'PKCE replaces the client secret for public clients (SPAs, mobile apps) — proves the token recipient is the same app that started the flow',
    answer: `<p><strong>PKCE</strong> (Proof Key for Code Exchange, pronounced "pixie") is an OAuth 2.0 extension that protects the authorization code flow for public clients (SPAs, mobile apps) that can't securely store a client secret.</p>
<p><strong>The problem with SPAs:</strong> A client secret embedded in a SPA's JavaScript bundle is public — anyone can extract it and impersonate your app.</p>
<p><strong>How PKCE works:</strong></p>
<ol>
<li>App generates a random <strong>code verifier</strong> (43–128 chars) and computes its SHA-256 hash → <strong>code challenge</strong>.</li>
<li>Authorization request includes the code challenge.</li>
<li>Auth server stores the code challenge alongside the issued authorization code.</li>
<li>Token exchange request includes the original code verifier.</li>
<li>Auth server hashes the verifier and compares to stored challenge — only the original app can match.</li>
</ol>
<pre><code>// Step 1: generate
const codeVerifier = generateRandomString(64);
const codeChallenge = base64urlEncode(sha256(codeVerifier));

// Step 2: redirect with challenge
window.location.href = \`\${authServer}/authorize?
  code_challenge=\${codeChallenge}&code_challenge_method=S256&...\`;</code></pre>
<p><strong>Use PKCE for:</strong> all SPAs, mobile apps, any public client. It's now recommended even for confidential clients.</p>`,
  },

  {
    id: 6033, cat: 'Authentication', tags: ['core'],
    q: 'What is the difference between authentication and authorization?',
    hint: 'Authentication = who are you (identity); authorization = what are you allowed to do (permissions)',
    answer: `<p><strong>Authentication (AuthN)</strong> — verifying identity. "Who are you?"</p>
<ul>
<li>Mechanisms: password, OAuth, SAML, biometrics, passkeys.</li>
<li>Output: a verified identity (user ID, claims in a JWT, session record).</li>
<li>Example: checking that a submitted password matches the stored hash.</li>
</ul>
<p><strong>Authorization (AuthZ)</strong> — determining permissions. "What are you allowed to do?"</p>
<ul>
<li>Mechanisms: RBAC (Role-Based), ABAC (Attribute-Based), ACLs, scopes in OAuth tokens.</li>
<li>Input: the verified identity from authentication.</li>
<li>Example: checking that the authenticated user has the <code>admin</code> role before showing /admin.</li>
</ul>
<p><strong>On the frontend:</strong></p>
<pre><code>// Authentication check — are you logged in?
if (!user) return &lt;Redirect to="/login" /&gt;;

// Authorization check — do you have permission?
if (!user.roles.includes('admin')) return &lt;Forbidden /&gt;;</code></pre>
<p><strong>Key rule:</strong> <em>never rely on frontend-only authorization checks for security</em>. The server must enforce permissions on every request. Frontend checks are UX, not security.</p>`,
  },

  {
    id: 6034, cat: 'Authentication', tags: ['mid'],
    q: 'What is SSO (Single Sign-On) and how is it implemented on the frontend?',
    hint: 'One login grants access to multiple apps — implemented via a shared identity provider using SAML or OIDC/OAuth 2.0 redirects',
    answer: `<p><strong>SSO</strong> lets a user log in once to an identity provider (IdP) and gain access to multiple service providers (SPs) without logging in again.</p>
<p><strong>Common protocols:</strong></p>
<ul>
<li><strong>SAML 2.0</strong> — XML-based, enterprise standard (Okta, Active Directory). Browser-redirect flow. Rarely implemented directly by frontend engineers.</li>
<li><strong>OpenID Connect (OIDC)</strong> — built on OAuth 2.0, returns a JWT ID token. The modern standard for SPAs and mobile apps.</li>
</ul>
<p><strong>Frontend OIDC flow (PKCE):</strong></p>
<ol>
<li>User clicks "Login" → app redirects to IdP (<code>/authorize</code>).</li>
<li>IdP authenticates the user, redirects back with an authorization code.</li>
<li>App exchanges the code for ID + access tokens.</li>
<li>App stores tokens (HttpOnly cookie or memory); uses access token for API calls.</li>
</ol>
<p><strong>Session sharing across apps:</strong> The IdP maintains the SSO session (usually via its own cookie). When app B redirects to the IdP, it detects the existing session and redirects straight back without showing the login form.</p>`,
  },

  {
    id: 6035, cat: 'Authentication', tags: ['adv'],
    q: 'How would you implement silent token refresh in a SPA?',
    hint: 'Use a hidden iframe to hit the IdP (if SSO session exists) or an in-memory refresh token to get a new access token before expiry',
    answer: `<p>Access tokens expire (typically 15 min). Silent refresh keeps users logged in without forcing them to re-authenticate.</p>
<p><strong>Option 1: Hidden iframe (OIDC prompt=none)</strong></p>
<pre><code>// When access token is near expiry, load IdP in hidden iframe
const iframe = document.createElement('iframe');
iframe.src = \`\${idpUrl}/authorize?prompt=none&response_type=code&...\`;
iframe.style.display = 'none';
document.body.appendChild(iframe);
// Listen for redirect back to /silent-callback
// Parse new token from callback URL</code></pre>
<p>Works if the user still has an active SSO session with the IdP. Requires <code>prompt=none</code> OIDC parameter. Blocked by Safari ITP (third-party cookie restrictions).</p>
<p><strong>Option 2: Refresh token in HttpOnly cookie</strong></p>
<pre><code>// Before request, check token expiry
async function getAccessToken() {
  if (isExpiringSoon(accessToken)) {
    const { data } = await axios.post('/auth/refresh'); // sends HttpOnly cookie automatically
    accessToken = data.accessToken; // store in memory only
  }
  return accessToken;
}</code></pre>
<p>Keep the access token in memory (not localStorage) to prevent XSS theft. The refresh token in HttpOnly cookie is safe from JavaScript. This is the recommended modern approach.</p>`,
  },

  // ─── FRONTEND SECURITY (6036–6041) ───────────────────────────────────────

  {
    id: 6036, cat: 'Frontend Security', tags: ['core'],
    q: 'What is XSS (Cross-Site Scripting) and how do you prevent it?',
    hint: 'Attacker injects script that runs in another user\'s browser — prevent by escaping output, using CSP, and never using innerHTML with user data',
    answer: `<p><strong>XSS</strong> occurs when an attacker injects malicious JavaScript into a page that is then executed in another user's browser, giving the attacker access to cookies, tokens, and the DOM.</p>
<p><strong>Three types:</strong></p>
<ul>
<li><strong>Stored XSS</strong> — malicious script is saved in the database (e.g., a comment) and served to every user who views it.</li>
<li><strong>Reflected XSS</strong> — script is embedded in a URL, reflected in the response (e.g., search results page).</li>
<li><strong>DOM-based XSS</strong> — client-side JS reads attacker-controlled data (URL hash, postMessage) and writes it to the DOM unsafely.</li>
</ul>
<p><strong>Prevention:</strong></p>
<ul>
<li><strong>Never use <code>innerHTML</code>, <code>dangerouslySetInnerHTML</code>, or <code>document.write</code> with untrusted data.</strong> React auto-escapes by default — this is why it's safer.</li>
<li><strong>Output encoding</strong> — HTML-encode user content before rendering it.</li>
<li><strong>Content Security Policy (CSP)</strong> — restricts which scripts can execute; blocks inline scripts.</li>
<li><strong>Sanitize HTML input</strong> — if you must allow rich text, use DOMPurify.</li>
</ul>
<pre><code>import DOMPurify from 'dompurify';
// Safe: sanitize before dangerouslySetInnerHTML
const clean = DOMPurify.sanitize(userHtml);
&lt;div dangerouslySetInnerHTML={{ __html: clean }} /&gt;</code></pre>`,
  },

  {
    id: 6037, cat: 'Frontend Security', tags: ['core'],
    q: 'What is CSRF and how do SameSite cookies and CSRF tokens prevent it?',
    hint: 'Forged cross-origin request that rides on the victim\'s cookies — SameSite blocks cookie sending; CSRF token requires secret the attacker doesn\'t have',
    answer: `<p><strong>CSRF (Cross-Site Request Forgery)</strong> tricks a logged-in user's browser into making an unintended request to a site where they're authenticated. The browser automatically sends cookies, so the server sees it as legitimate.</p>
<pre><code>&lt;!-- On attacker's site --&gt;
&lt;img src="https://bank.com/transfer?to=attacker&amount=1000" /&gt;
&lt;!-- Browser auto-sends bank.com cookies with this request --&gt;</code></pre>
<p><strong>Prevention 1: SameSite cookies</strong></p>
<ul>
<li><code>SameSite=Strict</code> — cookie never sent on cross-origin requests. Breaks OAuth flows.</li>
<li><code>SameSite=Lax</code> — cookie sent on top-level navigations (GET links) but not on embedded requests (img, form POST from other sites). Good default.</li>
<li><code>SameSite=None; Secure</code> — sent everywhere (cross-origin). Requires HTTPS.</li>
</ul>
<p><strong>Prevention 2: CSRF tokens</strong></p>
<pre><code>// Server sets a CSRF token in a readable cookie (not HttpOnly) or in page HTML
// Client reads it and sends it as a header
const csrfToken = getCookieValue('csrf-token');
fetch('/api/transfer', {
  method: 'POST',
  headers: { 'X-CSRF-Token': csrfToken }, // attacker can't read this
});</code></pre>
<p>Attackers can't read the CSRF token from a different origin (same-origin policy), so they can't forge the header.</p>`,
  },

  {
    id: 6038, cat: 'Frontend Security', tags: ['mid'],
    q: 'What is a Content Security Policy (CSP) and how does it work?',
    hint: 'HTTP header that whitelists sources for scripts, styles, images — blocks injected inline scripts and unknown CDNs',
    answer: `<p>A <strong>Content Security Policy</strong> is an HTTP response header that tells the browser which sources are allowed to load scripts, styles, images, fonts, etc. Violations are blocked.</p>
<pre><code>Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  frame-ancestors 'none';</code></pre>
<p><strong>Key directives:</strong></p>
<ul>
<li><code>default-src</code> — fallback for all resource types not explicitly listed.</li>
<li><code>script-src</code> — which origins can serve JavaScript.</li>
<li><code>frame-ancestors</code> — which origins can embed this page in an iframe (replaces X-Frame-Options).</li>
<li><code>'nonce-{random}'</code> — whitelist an inline script by including a per-request nonce: <code>&lt;script nonce="r4nd0m"&gt;</code>.</li>
<li><code>'strict-dynamic'</code> — trust scripts loaded by trusted scripts (allows dynamic script injection from whitelisted scripts).</li>
</ul>
<p><strong>Reporting:</strong> Use <code>Content-Security-Policy-Report-Only</code> header to log violations without blocking — essential when rolling out a CSP to a production app.</p>
<div class="tip">💡 Aim for a CSP that eliminates <code>'unsafe-inline'</code> for scripts. Nonces (Next.js middleware) are the practical way to achieve this with SSR apps.</div>`,
  },

  {
    id: 6039, cat: 'Frontend Security', tags: ['core'],
    q: 'What is clickjacking and how do you prevent it?',
    hint: 'Attacker overlays your page in a transparent iframe — victim clicks on attacker UI but triggers your authenticated actions; prevent with frame-ancestors CSP',
    answer: `<p><strong>Clickjacking</strong> is an attack where a malicious page embeds your site in a transparent <code>&lt;iframe&gt;</code>. The victim sees the attacker's UI but their clicks land on your page's controls (like a "Transfer Funds" button).</p>
<p><strong>Prevention methods:</strong></p>
<p><strong>1. Content-Security-Policy: frame-ancestors</strong> (preferred)</p>
<pre><code>Content-Security-Policy: frame-ancestors 'none';
// or allow only same origin:
Content-Security-Policy: frame-ancestors 'self';</code></pre>
<p><strong>2. X-Frame-Options</strong> (legacy, still supported)</p>
<pre><code>X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN</code></pre>
<p><code>frame-ancestors</code> in CSP supersedes <code>X-Frame-Options</code> and supports more granular control (e.g., allow specific partners).</p>
<p><strong>3. Frame-busting JS</strong> (weak, not recommended)</p>
<pre><code>if (window.top !== window.self) window.top.location = window.location;</code></pre>
<p>Attackers can defeat this with <code>sandbox</code> attribute on the iframe. Always use HTTP headers instead.</p>`,
  },

  {
    id: 6040, cat: 'Frontend Security', tags: ['mid'],
    q: 'What security HTTP response headers should every production frontend set?',
    hint: 'X-Content-Type-Options, X-Frame-Options/CSP frame-ancestors, HSTS, Referrer-Policy, Permissions-Policy',
    answer: `<p>A hardened production app should set these headers on every HTML response:</p>
<pre><code>Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# Forces HTTPS for 1 year; prevents SSL-stripping attacks

X-Content-Type-Options: nosniff
# Stops browser MIME-type sniffing — prevents treating a text/plain response as JavaScript

X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none'
# Prevents clickjacking

Referrer-Policy: strict-origin-when-cross-origin
# Limits how much URL info leaks in Referer header

Permissions-Policy: camera=(), microphone=(), geolocation=()
# Disables browser features your app doesn't use

Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{n}'; ...
# Restricts resource origins; mitigates XSS</code></pre>
<p><strong>Quick audit:</strong> Run your URL through <a href="https://securityheaders.com">securityheaders.com</a> to get a score and missing header report.</p>
<p><strong>In Next.js:</strong> Set these in <code>next.config.js</code> under <code>headers()</code> or in middleware for per-request nonces.</p>`,
  },

  {
    id: 6041, cat: 'Frontend Security', tags: ['adv'],
    q: 'How do you protect a frontend app against dependency supply chain attacks?',
    hint: 'Lock file, Subresource Integrity, audit CI, minimal dependencies, private registry proxying',
    answer: `<p>Supply chain attacks target the npm packages your app depends on (e.g., the <code>event-stream</code> malware, <code>left-pad</code> removal, typosquatting).</p>
<p><strong>Defenses:</strong></p>
<p><strong>1. Lock files</strong> — commit <code>package-lock.json</code> or <code>pnpm-lock.yaml</code>. CI runs <code>npm ci</code> (not <code>npm install</code>) to install exact locked versions.</p>
<p><strong>2. Automated auditing</strong> — run <code>npm audit</code> or <code>pnpm audit</code> in CI; fail the build on high-severity CVEs. Dependabot or Renovate auto-opens PRs for patches.</p>
<p><strong>3. Subresource Integrity (SRI)</strong> — for third-party CDN scripts, add a <code>integrity</code> hash. Browser refuses to execute the script if the hash doesn't match.</p>
<pre><code>&lt;script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous"&gt;&lt;/script&gt;</code></pre>
<p><strong>4. Minimal dependency footprint</strong> — every added package is an attack surface. Prefer native browser APIs; audit new deps on Bundlephobia and Snyk before adding them.</p>
<p><strong>5. Private registry proxy</strong> — proxy npm through Artifactory or Verdaccio; allows allow-listing, caching, and scanning before packages reach developers.</p>`,
  },

  // ─── STATE MANAGEMENT (6042–6047) ────────────────────────────────────────

  {
    id: 6042, cat: 'State Management', tags: ['core'],
    q: 'What is the difference between server state and client state?',
    hint: 'Server state lives on the server and must be fetched/synchronized; client state is local to the browser and doesn\'t need network sync',
    answer: `<p>This distinction, popularized by React Query, is fundamental to choosing the right state tool.</p>
<p><strong>Server state (remote state)</strong> — data that originates on the server and is shared across users/sessions.</p>
<ul>
<li>Examples: user profile from an API, product list, blog posts.</li>
<li>Characteristics: must be fetched asynchronously, can become stale, may be mutated by other users, needs loading/error states.</li>
<li>Best managed by: React Query / TanStack Query, SWR, Apollo Client (for GraphQL).</li>
</ul>
<p><strong>Client state (UI state)</strong> — data that exists only in the browser, doesn't need to be persisted to a server.</p>
<ul>
<li>Examples: modal open/close, selected tab, form field values, theme preference.</li>
<li>Characteristics: synchronous, always available, only one user cares about it.</li>
<li>Best managed by: <code>useState</code>, <code>useReducer</code>, Zustand, Jotai, or URL state.</li>
</ul>
<div class="tip">💡 Most Redux codebases pre-2020 used Redux to manage server state (storing API responses). React Query eliminates this need — Redux becomes unnecessary for most apps once server state is handled properly.</div>`,
  },

  {
    id: 6043, cat: 'State Management', tags: ['mid'],
    q: 'When would you choose Zustand over Redux Toolkit?',
    hint: 'Zustand is minimal and boilerplate-free; Redux Toolkit shines for large teams needing strict patterns, devtools, and middleware',
    answer: `<p>Both are client state managers, but they have very different ergonomics.</p>
<p><strong>Zustand advantages:</strong></p>
<ul>
<li>Near-zero boilerplate — no actions, reducers, or dispatch. Create a store in ~10 lines.</li>
<li>Works outside React (vanilla JS, utilities) — store is a plain JS object.</li>
<li>Fine-grained subscriptions — components only re-render when the slice they subscribe to changes.</li>
<li>Easy async — just write async functions in the store; no thunks or sagas needed.</li>
</ul>
<pre><code>const useStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));</code></pre>
<p><strong>Redux Toolkit advantages:</strong></p>
<ul>
<li>Opinionated structure — good for large teams where consistency matters more than brevity.</li>
<li>Redux DevTools — time-travel debugging, action history, state diffs.</li>
<li>RTK Query — built-in server state management (competes with React Query).</li>
<li>Middleware ecosystem — logging, analytics, undo/redo.</li>
</ul>
<p><strong>Pick Zustand for:</strong> small-to-medium apps, new projects, when you want simplicity. <strong>Pick Redux Toolkit for:</strong> large existing Redux codebases, teams that need strict patterns and audit trails.</p>`,
  },

  {
    id: 6044, cat: 'State Management', tags: ['mid'],
    q: 'What is React Query\'s staleTime vs gcTime (cacheTime) and how do they interact?',
    hint: 'staleTime = how long data is considered fresh; gcTime = how long inactive cache entries are kept before garbage collection',
    answer: `<p>React Query uses two separate timers for different parts of the cache lifecycle.</p>
<p><strong>staleTime</strong> — how long a query's data is considered "fresh" after it was last fetched. During this window, React Query won't refetch even if the component remounts or the user refocuses the window.</p>
<ul>
<li>Default: <code>0</code> — data is immediately stale, so React Query refetches on every mount/focus.</li>
<li>Set to <code>Infinity</code> for data that never changes (static config, user roles).</li>
<li>Set to <code>5 * 60 * 1000</code> (5 min) for data that changes infrequently.</li>
</ul>
<p><strong>gcTime (formerly cacheTime)</strong> — how long an inactive (no subscribers) query result stays in the cache before being garbage-collected.</p>
<ul>
<li>Default: <code>5 * 60 * 1000</code> (5 min).</li>
<li>While in cache, navigating back to a page shows the cached data instantly (even if stale) while refetching in the background.</li>
</ul>
<pre><code>useQuery({
  queryKey: ['user', id],
  queryFn: fetchUser,
  staleTime: 60_000,   // fresh for 1 min — no refetch on focus
  gcTime: 300_000,     // keep in cache 5 min after last subscriber
});</code></pre>
<p><strong>Key interaction:</strong> staleTime ≤ gcTime is the natural order. staleTime controls <em>when</em> to refetch; gcTime controls <em>when</em> to forget.</p>`,
  },

  {
    id: 6045, cat: 'State Management', tags: ['mid'],
    q: 'What is optimistic updating and how do you implement it with React Query?',
    hint: 'Update the UI immediately before the server confirms — rollback on error; use onMutate to snapshot, onError to restore, onSettled to invalidate',
    answer: `<p><strong>Optimistic updating</strong> means updating the UI instantly when a user takes an action, without waiting for the server response. If the server returns an error, the UI rolls back.</p>
<p><strong>Why it matters:</strong> eliminates perceived latency for common mutations (liking a post, toggling a checkbox, re-ordering a list).</p>
<pre><code>const mutation = useMutation({
  mutationFn: (newTodo) => api.addTodo(newTodo),

  onMutate: async (newTodo) => {
    // 1. Cancel any in-flight refetches (avoid overwriting optimistic update)
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // 2. Snapshot the current value for rollback
    const previousTodos = queryClient.getQueryData(['todos']);

    // 3. Optimistically update the cache
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);

    return { previousTodos }; // context passed to onError
  },

  onError: (err, newTodo, context) => {
    // 4. Rollback on error
    queryClient.setQueryData(['todos'], context.previousTodos);
  },

  onSettled: () => {
    // 5. Always refetch to sync with server truth
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});</code></pre>`,
  },

  {
    id: 6046, cat: 'State Management', tags: ['core'],
    q: 'When should you use URL state instead of React state?',
    hint: 'If the state should survive a page refresh, be shareable via a link, or be bookmarkable — put it in the URL',
    answer: `<p>URL state (query params, path params) is the right choice whenever state should be:</p>
<ul>
<li><strong>Shareable</strong> — a user can send a link and the recipient sees the same view. Filters, pagination, search terms, selected tabs.</li>
<li><strong>Bookmarkable</strong> — browser history works correctly; back button returns to previous filter state.</li>
<li><strong>Server-renderable</strong> — the server can pre-render the correct state without JS. Important for SEO (search results pages).</li>
<li><strong>Persistent across refresh</strong> — query params survive F5; React state does not.</li>
</ul>
<pre><code>// ✅ Filters in URL — shareable, bookmarkable
const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get('category') ?? 'all';
const page = Number(searchParams.get('page')) || 1;

// ✅ UI-only state in React — modal open, tooltip hover
const [modalOpen, setModalOpen] = useState(false);</code></pre>
<p><strong>Avoid URL state for:</strong> ephemeral UI state (hover, focus, modal open), sensitive data, state that changes many times per second (animation progress).</p>`,
  },

  {
    id: 6047, cat: 'State Management', tags: ['adv'],
    q: 'What are the performance pitfalls of React Context and how do you avoid them?',
    hint: 'Every consumer re-renders when any value in context changes — split contexts by update frequency, memoize values, or use Zustand instead',
    answer: `<p><strong>The problem:</strong> All components that call <code>useContext(MyContext)</code> re-render whenever the context value changes — even if the specific part they use didn't change.</p>
<pre><code>// ❌ One context for everything — user + theme + cart
// Any cart update re-renders Header (which only uses user.name)
const { user, cart, theme } = useContext(AppContext);</code></pre>
<p><strong>Fix 1: Split contexts by update frequency</strong></p>
<pre><code>// UserContext changes rarely, CartContext changes often
// Header subscribes to UserContext only — immune to cart updates
const { user } = useContext(UserContext);</code></pre>
<p><strong>Fix 2: Memoize the context value</strong></p>
<pre><code>const value = useMemo(() => ({ user, updateUser }), [user]);
// Without useMemo, a new object is created every render → all consumers re-render</code></pre>
<p><strong>Fix 3: Use a selector (context + useContextSelector)</strong></p>
<pre><code>// use-context-selector library — only re-renders when selected slice changes
const name = useContextSelector(UserContext, (ctx) => ctx.user.name);</code></pre>
<p><strong>Fix 4: Switch to Zustand/Jotai</strong> — atomic subscriptions by design; only components subscribed to a changed slice re-render.</p>`,
  },

  // ─── NETWORK OPTIMIZATION (6048–6053) ────────────────────────────────────

  {
    id: 6048, cat: 'Network Optimization', tags: ['core'],
    q: 'What is the difference between preload, prefetch, and preconnect?',
    hint: 'preload = fetch this resource now for current page; prefetch = fetch for future navigation; preconnect = open socket to origin early',
    answer: `<p>These are <strong>resource hints</strong> — <code>&lt;link&gt;</code> tags that give the browser advance notice about resources it will need.</p>
<p><strong>preload</strong> — fetch a resource needed by the current page <em>immediately</em> at high priority. Used for critical fonts, hero images, above-the-fold CSS.</p>
<pre><code>&lt;link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin /&gt;
&lt;link rel="preload" href="/hero.jpg" as="image" /&gt;</code></pre>
<p><strong>prefetch</strong> — fetch a resource likely needed for a <em>future</em> navigation at idle priority. Browser downloads it when bandwidth is free.</p>
<pre><code>&lt;link rel="prefetch" href="/checkout/bundle.js" as="script" /&gt;
{/* Next.js &lt;Link&gt; does this automatically for in-viewport links */}</code></pre>
<p><strong>preconnect</strong> — open a TCP connection (+ TLS handshake) to an origin early, without fetching a specific resource. Eliminates connection setup latency for cross-origin resources.</p>
<pre><code>&lt;link rel="preconnect" href="https://fonts.googleapis.com" /&gt;
&lt;link rel="dns-prefetch" href="https://api.example.com" /&gt; {/* DNS only — cheaper */}</code></pre>
<div class="tip">💡 Misusing preload (adding too many, wrong <code>as</code> type, no crossorigin on fonts) causes warnings and wasted bandwidth. Only preload what's truly render-critical.</div>`,
  },

  {
    id: 6049, cat: 'Network Optimization', tags: ['mid'],
    q: 'How does HTTP/2 multiplexing improve performance over HTTP/1.1?',
    hint: 'HTTP/2 allows multiple requests on one TCP connection simultaneously — eliminates head-of-line blocking and domain sharding hacks',
    answer: `<p><strong>HTTP/1.1 limitation:</strong> One request at a time per TCP connection. Browsers open 6–8 parallel connections per domain to work around this, but each connection has overhead (TCP handshake, slow start).</p>
<p><strong>HTTP/2 multiplexing:</strong></p>
<ul>
<li>A single TCP connection carries multiple <em>streams</em> simultaneously — no waiting for one response before sending the next.</li>
<li>Requests are broken into binary <em>frames</em> that are interleaved and reassembled by the receiving end.</li>
<li>Eliminates <strong>head-of-line blocking</strong> at the HTTP layer (TCP-level HOL blocking still exists; fixed by HTTP/3 QUIC).</li>
</ul>
<p><strong>Other HTTP/2 features:</strong></p>
<ul>
<li><strong>Header compression (HPACK)</strong> — compresses repeated headers; saves bandwidth on API-heavy SPAs.</li>
<li><strong>Server push</strong> — server sends resources before the client asks (largely abandoned in practice due to poor cache interaction).</li>
<li><strong>Request prioritization</strong> — critical resources can be prioritized over background requests.</li>
</ul>
<p><strong>HTTP/2 makes these obsolete:</strong> domain sharding, CSS sprites, JS concatenation for HTTP performance (code splitting is now safe).</p>`,
  },

  {
    id: 6050, cat: 'Network Optimization', tags: ['mid'],
    q: 'What is the difference between defer and async on script tags?',
    hint: 'async executes as soon as downloaded (may block parsing); defer executes after HTML is parsed, in order',
    answer: `<p>Both attributes tell the browser to download the script without blocking HTML parsing, but they differ in <em>when</em> the script executes.</p>
<p><strong>Default (no attribute)</strong> — parsing blocks while the script is downloaded and executed. Render-blocking.</p>
<p><strong>async</strong> — downloads in parallel; executes immediately when downloaded, even if HTML isn't done parsing yet. Order not guaranteed.</p>
<pre><code>&lt;script async src="analytics.js"&gt;&lt;/script&gt;
{/* Good for: independent scripts like analytics — don't care about DOM or other scripts */}</code></pre>
<p><strong>defer</strong> — downloads in parallel; executes after HTML parsing is complete, in document order.</p>
<pre><code>&lt;script defer src="app.js"&gt;&lt;/script&gt;
{/* Good for: scripts that need the DOM or must run in order (most app scripts) */}</code></pre>
<table>
<tr><th></th><th>Blocks parsing</th><th>Execution time</th><th>Order preserved</th></tr>
<tr><td>default</td><td>Yes</td><td>Immediately</td><td>Yes</td></tr>
<tr><td>async</td><td>No</td><td>When downloaded</td><td>No</td></tr>
<tr><td>defer</td><td>No</td><td>After parse</td><td>Yes</td></tr>
</table>
<div class="tip">💡 Modern bundlers (Vite, Next.js) automatically add <code>defer</code> to script tags. You mainly need to know this for third-party scripts added manually.</div>`,
  },

  {
    id: 6051, cat: 'Network Optimization', tags: ['mid'],
    q: 'What is image optimization and what techniques does Next.js Image component apply?',
    hint: 'Modern format (WebP/AVIF), correct sizing, lazy loading, blur placeholder, priority flag for LCP images',
    answer: `<p>Images are the largest contributor to page weight in most apps. Key optimization techniques:</p>
<p><strong>1. Modern formats</strong> — WebP is 25–35% smaller than JPEG; AVIF is 50% smaller. Next.js <code>&lt;Image&gt;</code> automatically serves WebP/AVIF via the <code>/api/_next/image</code> optimizer.</p>
<p><strong>2. Correct sizing (srcset)</strong> — serve a 300px image on mobile, not a 2000px image scaled down in CSS. Wastes bandwidth otherwise. Next.js generates srcset automatically from the <code>sizes</code> prop.</p>
<p><strong>3. Lazy loading</strong> — images below the fold get <code>loading="lazy"</code> — browser only fetches when they enter the viewport.</p>
<p><strong>4. Blur placeholder</strong> — while the image loads, a tiny blurred version (base64 inline) fills the space, preventing layout shift and improving perceived performance.</p>
<p><strong>5. Priority / preload for LCP image</strong> — the hero image that will be the Largest Contentful Paint element should be preloaded.</p>
<pre><code>// Next.js — LCP hero image
&lt;Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority           // adds &lt;link rel="preload"&gt; in &lt;head&gt;
  sizes="100vw"
/&gt;</code></pre>`,
  },

  {
    id: 6052, cat: 'Network Optimization', tags: ['adv'],
    q: 'What is the critical rendering path and how do you optimize it?',
    hint: 'HTML → DOM + CSSOM → Render Tree → Layout → Paint — render-blocking CSS and JS delay the first paint',
    answer: `<p>The <strong>critical rendering path</strong> is the sequence of steps the browser takes from receiving HTML bytes to displaying pixels on screen.</p>
<p><strong>Steps:</strong></p>
<ol>
<li><strong>HTML → DOM</strong> — parse HTML, build Document Object Model.</li>
<li><strong>CSS → CSSOM</strong> — parse CSS (render-blocking by default), build CSS Object Model.</li>
<li><strong>DOM + CSSOM → Render Tree</strong> — combine visible elements with computed styles.</li>
<li><strong>Layout</strong> — calculate exact position and size of each element.</li>
<li><strong>Paint</strong> — rasterize pixels to layers.</li>
<li><strong>Composite</strong> — merge layers and push to screen.</li>
</ol>
<p><strong>Optimization techniques:</strong></p>
<ul>
<li><strong>Eliminate render-blocking CSS</strong> — inline critical CSS; load non-critical CSS async (<code>media="print" onload="this.media='all'"</code>).</li>
<li><strong>Defer non-critical JS</strong> — use <code>defer</code> or dynamic import to keep JavaScript from blocking parsing.</li>
<li><strong>Reduce CSS complexity</strong> — deep selectors slow CSSOM construction and style recalculation.</li>
<li><strong>Minimize DOM size</strong> — large DOMs slow layout; avoid rendering hidden off-screen content.</li>
<li><strong>Use CSS transforms for animation</strong> — transform/opacity run on the compositor thread without triggering layout.</li>
</ul>`,
  },

  {
    id: 6053, cat: 'Network Optimization', tags: ['mid'],
    q: 'What is TTFB (Time to First Byte) and what factors affect it?',
    hint: 'Time between the browser sending a request and receiving the first byte of the response — affected by DNS, TCP, TLS, server processing, CDN',
    answer: `<p><strong>TTFB</strong> measures the time from when the browser sends an HTTP request to when it receives the first byte of the response. Google's Core Web Vitals recommend TTFB under 800ms.</p>
<p><strong>What TTFB includes:</strong></p>
<ol>
<li>DNS resolution time.</li>
<li>TCP connection time (3-way handshake).</li>
<li>TLS negotiation time (if HTTPS).</li>
<li>Server processing time (DB queries, SSR render, API calls).</li>
<li>Time for the first byte to travel from server to client (network latency).</li>
</ol>
<p><strong>Improvement strategies:</strong></p>
<ul>
<li><strong>CDN</strong> — serve responses from edge nodes close to the user; eliminates most of the geographic latency.</li>
<li><strong>Edge computing</strong> — run SSR at edge (Vercel Edge Functions, Cloudflare Workers) to reduce round-trip to origin.</li>
<li><strong>Server-side caching</strong> — cache rendered HTML or API responses in Redis; skip DB queries on cache hit.</li>
<li><strong>HTTP/2 or HTTP/3</strong> — fewer round trips, better connection reuse.</li>
<li><strong>Optimize slow queries</strong> — profile DB and N+1 query problems; they directly inflate server processing time.</li>
<li><strong>Persistent connections</strong> — <code>Connection: keep-alive</code> avoids TCP handshake on repeated requests.</li>
</ul>`,
  },

  // ─── CORE WEB VITALS (6054–6059) ─────────────────────────────────────────

  {
    id: 6054, cat: 'Core Web Vitals', tags: ['core'],
    q: 'What are the three Core Web Vitals and what does each measure?',
    hint: 'LCP (loading), INP (interactivity), CLS (visual stability) — Google\'s user-experience signals that affect search ranking',
    answer: `<p><strong>Core Web Vitals</strong> are Google's three standardized metrics for measuring real-world user experience, incorporated into Google's Search ranking since 2021.</p>
<p><strong>LCP — Largest Contentful Paint</strong></p>
<ul>
<li>Measures: how long it takes to render the largest visible image or text block in the viewport.</li>
<li>What users feel: "How fast does the main content appear?"</li>
<li>Good: ≤ 2.5s | Needs improvement: ≤ 4s | Poor: > 4s</li>
</ul>
<p><strong>INP — Interaction to Next Paint</strong> (replaced FID in 2024)</p>
<ul>
<li>Measures: the latency of the worst interaction (click, keypress, tap) across the entire page visit.</li>
<li>What users feel: "Does the page respond quickly when I interact?"</li>
<li>Good: ≤ 200ms | Needs improvement: ≤ 500ms | Poor: > 500ms</li>
</ul>
<p><strong>CLS — Cumulative Layout Shift</strong></p>
<ul>
<li>Measures: unexpected visual shifts of page elements during the entire lifetime of the page.</li>
<li>What users feel: "Do things jump around as I try to click?"</li>
<li>Good: ≤ 0.1 | Needs improvement: ≤ 0.25 | Poor: > 0.25</li>
</ul>`,
  },

  {
    id: 6055, cat: 'Core Web Vitals', tags: ['mid'],
    q: 'What are the most common causes of poor LCP and how do you fix them?',
    hint: 'Slow TTFB, render-blocking resources, unoptimized hero image, lazy-loaded LCP element',
    answer: `<p>LCP is the time to render the largest above-the-fold element — usually a hero image, banner, or large text block.</p>
<p><strong>Common causes and fixes:</strong></p>
<p><strong>1. Slow server response (TTFB)</strong></p>
<ul>
<li>Fix: CDN, edge SSR, server-side caching, faster DB queries.</li>
</ul>
<p><strong>2. Render-blocking resources</strong></p>
<ul>
<li>CSS files in <code>&lt;head&gt;</code> block rendering until fully downloaded. Fix: inline critical CSS, defer non-critical CSS.</li>
</ul>
<p><strong>3. LCP image not preloaded</strong></p>
<ul>
<li>The browser discovers the hero image late (after parsing CSS and JS). Fix: add <code>&lt;link rel="preload" as="image"&gt;</code> in <code>&lt;head&gt;</code> or use Next.js <code>&lt;Image priority&gt;</code>.</li>
</ul>
<p><strong>4. LCP image is lazy-loaded</strong></p>
<ul>
<li>A common mistake: adding <code>loading="lazy"</code> to the hero image. Browser deliberately delays it. Fix: remove lazy from above-fold images.</li>
</ul>
<p><strong>5. Unoptimized image</strong></p>
<ul>
<li>Large JPEG served at full resolution. Fix: WebP/AVIF, correct <code>srcset</code> sizing, compression.</li>
</ul>
<p><strong>6. Web fonts blocking text LCP</strong></p>
<ul>
<li>Text is the LCP element but font isn't loaded. Fix: <code>font-display: swap</code>, preload critical fonts.</li>
</ul>`,
  },

  {
    id: 6056, cat: 'Core Web Vitals', tags: ['core'],
    q: 'What causes CLS (Cumulative Layout Shift) and how do you fix it?',
    hint: 'Elements without dimensions, late-injected content, web fonts causing FOUT, embeds without aspect-ratio containers',
    answer: `<p>CLS measures unexpected visual shifts. A score above 0.1 hurts both UX and SEO ranking.</p>
<p><strong>Common causes and fixes:</strong></p>
<p><strong>1. Images without dimensions</strong></p>
<pre><code>&lt;!-- ❌ Browser reserves no space — content shifts when image loads --&gt;
&lt;img src="hero.jpg" /&gt;

&lt;!-- ✅ Browser reserves exact space upfront --&gt;
&lt;img src="hero.jpg" width="1200" height="600" /&gt;</code></pre>
<p><strong>2. Dynamically injected content above existing content</strong></p>
<ul>
<li>Banners, cookie notices, ads injected above page content push everything down. Fix: reserve space with a fixed-height placeholder, or inject below the fold.</li>
</ul>
<p><strong>3. Web fonts causing FOUT/FOIT</strong></p>
<ul>
<li>Text re-renders when the web font loads, causing a shift if the metrics differ. Fix: <code>font-display: optional</code> or <code>size-adjust</code> CSS to match fallback font metrics.</li>
</ul>
<p><strong>4. Embeds without aspect-ratio containers</strong></p>
<pre><code>&lt;!-- ✅ Reserve 16:9 space for video --&gt;
&lt;div style={{ aspectRatio: '16/9' }}&gt;
  &lt;iframe src="..." /&gt;
&lt;/div&gt;</code></pre>
<p><strong>5. Animations that trigger layout</strong></p>
<ul>
<li>Animating <code>width</code>, <code>height</code>, <code>top</code>, <code>left</code> triggers layout and can contribute to CLS. Fix: use <code>transform: translate()</code> instead.</li>
</ul>`,
  },

  {
    id: 6057, cat: 'Core Web Vitals', tags: ['mid'],
    q: 'What is INP (Interaction to Next Paint) and how does it differ from FID?',
    hint: 'FID measured only the first interaction\'s input delay; INP measures the worst interaction delay across the full page visit',
    answer: `<p><strong>FID (First Input Delay)</strong> — measured the delay between the first user interaction and when the browser could begin processing it. Only the <em>first</em> interaction counted.</p>
<p><strong>INP (Interaction to Next Paint)</strong> — replaced FID in March 2024. Measures the full duration of the <em>worst</em> interaction across the entire page visit: input delay + processing time + presentation delay.</p>
<p><strong>Why INP is a better metric:</strong></p>
<ul>
<li>FID missed slow interactions that occurred after the first one (e.g., a slow button click on a long session).</li>
<li>FID only measured input delay, not how long the response took to render — an interaction could start instantly but still feel sluggish.</li>
<li>INP captures the full user experience of responsiveness throughout the session.</li>
</ul>
<p><strong>How to improve INP:</strong></p>
<ul>
<li><strong>Break up long tasks</strong> — tasks over 50ms block the main thread. Use <code>scheduler.yield()</code> or <code>setTimeout(0)</code> to yield between chunks.</li>
<li><strong>Avoid heavy synchronous work on interaction</strong> — defer non-critical updates, use <code>startTransition</code> in React 18 to mark non-urgent renders.</li>
<li><strong>Reduce main thread blocking</strong> — move heavy computation to Web Workers.</li>
</ul>`,
  },

  {
    id: 6058, cat: 'Core Web Vitals', tags: ['mid'],
    q: 'How do you measure Core Web Vitals in a production React app?',
    hint: 'web-vitals library for field data; Lighthouse and PageSpeed Insights for lab data; Next.js has built-in instrumentation',
    answer: `<p>Core Web Vitals should be measured in the field (real users) not just in lab conditions (Lighthouse), since real network/device conditions differ significantly.</p>
<p><strong>1. web-vitals library</strong></p>
<pre><code>import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(console.log);
onINP(console.log);
onCLS(console.log);</code></pre>
<p>Call your analytics endpoint inside these callbacks to collect real-user data.</p>
<p><strong>2. Next.js built-in</strong></p>
<pre><code>// pages/_app.tsx or app/layout.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric); // { name: 'LCP', value: 1234, ... }
  // send to your analytics
}</code></pre>
<p><strong>3. Chrome User Experience Report (CrUX)</strong> — real-field data from Chrome users, aggregated by URL. Accessible via PageSpeed Insights API or Google Search Console's Core Web Vitals report.</p>
<p><strong>4. Lab tools for debugging</strong></p>
<ul>
<li>Lighthouse (Chrome DevTools) — simulated conditions; identifies specific elements.</li>
<li>PageSpeed Insights — combines lab + field data.</li>
<li>WebPageTest — detailed waterfall and filmstrip views.</li>
</ul>`,
  },

  {
    id: 6059, cat: 'Core Web Vitals', tags: ['adv'],
    q: 'What techniques reduce INP on a React app with expensive renders?',
    hint: 'React 18 startTransition, scheduler.yield, virtualization, memoization, Web Workers for off-thread computation',
    answer: `<p>INP > 200ms usually means the main thread is too busy to respond to user input quickly. React-specific techniques:</p>
<p><strong>1. React 18 startTransition</strong></p>
<pre><code>import { startTransition } from 'react';

// Mark search results update as non-urgent
// Input stays responsive; results update when idle
const handleInput = (e) => {
  setInputValue(e.target.value); // urgent — renders immediately
  startTransition(() => {
    setSearchResults(search(e.target.value)); // deferred
  });
};</code></pre>
<p><strong>2. useDeferredValue</strong> — defers a value update until the browser is idle; downstream components that use the deferred value re-render lazily.</p>
<p><strong>3. Virtualize long lists</strong> — react-virtual, @tanstack/virtual. Rendering 1000 list items causes a massive layout. Render only what's in the viewport.</p>
<p><strong>4. Memoization</strong> — <code>React.memo</code>, <code>useMemo</code>, <code>useCallback</code> to skip re-rendering subtrees that didn't change.</p>
<p><strong>5. Web Workers</strong> — move expensive computation (search indexing, data transformation) off the main thread entirely.</p>
<p><strong>6. scheduler.yield()</strong> — yield the main thread mid-loop to let interactions interrupt long synchronous tasks.</p>`,
  },

];
