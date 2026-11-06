# Design: JSPrep Pro

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: modern-minimal
- Shape of the first page: Narrative Workflow
- Theme: Console (graphite for dark mode, paper for light mode)
- Axes: dark/grotesk-sans/chromatic-amber · posture: restrained

## Tokens
`src/app/tokens.css` is the source of truth. `src/styles/tokens.ts` exposes the same values to Emotion as `C` and `FONT`. The roles:
```css
:root {
  --color-paper: oklch(17% 0.008 250);  --color-paper-2: oklch(21% 0.009 250);  --color-paper-3: oklch(13.5% 0.007 250);
  --color-ink: oklch(95% 0.005 250);  --color-ink-2: oklch(83% 0.008 250);  --color-muted: oklch(71% 0.01 250);  --color-rule: oklch(31% 0.01 250);
  --color-accent: oklch(82% 0.15 80);  --color-accent-ink: oklch(18% 0.04 75);  --color-focus: oklch(82% 0.15 80);
  --color-cool: oklch(77% 0.12 245);
  --font-display: "Host Grotesk", ui-sans-serif, system-ui, sans-serif;  --font-body: var(--font-display);  --font-outlier: "Atkinson Hyperlegible Mono", ui-monospace, monospace;
  --radius-card: 10px;  --radius-pill: 6px;  --rule-hair: 1px;  --shadow-card: none;
}
```
`[data-theme="light"]` in the same file holds the paper colourway. The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `tokens.css`.

## Meanings
- Amber is a person and the one primary control. Cool is an instrument: a score, a count, a timer. Ok and bad are for diffs and status only.
- Mono is for what the system wrote (code, scores, counts, times), never a label, a head or a button.

## Controls
- Primary: amber fill with `--color-accent-ink` · 6px radius · 48px tall on marketing pages, 32 to 40px on app screens
- Secondary: 1px `--color-rule-2` outline on `--color-paper-2` · same radius and height

## Motion
- Character: still. No reveals or hover lifts; a value changes when its source does. Under reduced motion everything ends at once.

## App screens
- Logged-in tools keep their own shell. Progress and scores are cool, mono and tabular; no load-in reveals; tables and ledgers before cards.

## Exports
`src/app/tokens.css` in this project. Tailwind, DTCG or shadcn blocks are added here on request, per `export-formats.md`.
