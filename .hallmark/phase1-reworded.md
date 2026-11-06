# Phase 1: lines changed on the homepage and nav

Removed, per Hallmark's eyebrow rule (54): the four track badges ("Train for Real JavaScript Interviews" and its siblings), "AI Answer Evaluator" as an eyebrow (now the panel caption), "New: Interview Sprint" ("Interview Sprint" is now the panel caption), "Four Practice Modes", "Beyond Questions", "Real developers. Real offers.", "N Topic Deep-Dives", "6 AI Features". "Pricing" moved from eyebrow to the heading; "Simple. Transparent." now opens the line under it.

Reworded (dashes, arrows, dots, stock labels):
- "Get started" -> "Start free" (nav); "Get Started Free" -> "Start free" (Free plan)
- "Start Free — No Card Needed" -> "Start free, no card needed"
- "Type your answer. Get scored 1–10 with specific gaps — not "great job"." -> "...scored 1 to 10 with specific gaps, not "great job"."
- "Good — room to grow" -> "Good, room to grow"; "Good — missing one key detail" -> "Good, missing one key detail"
- "Previous — AI scored" -> "Previous, AI scored"; "8/10 · B+" -> "8/10" and a "B+" chip; "✗ Edge cases" -> "Missed: edge cases"
- "Question of the Day — Free" -> "Question of the Day, free"; "Join the leaderboard — earn XP →" -> "Join the leaderboard, earn XP"
- "Free 5-question warmup — no card needed" -> comma; "Forever free — no card needed" -> comma
- "You're Pro — Go to Dashboard" -> "You're Pro. Go to Dashboard"; "Upgrade to Pro →", "Start with Pro →", "Skip →" lose the arrow
- "POPULAR" -> "Popular"; "PRO" -> "Pro"
- Roadmap: "112 daily tasks — JS → React → Machine Coding → DSA → Interviews." -> "112 daily tasks: JS, React, machine coding, DSA, interviews."; "Weeks 1–4" -> "Weeks 1 to 4"; "✓ Free · Works offline · Progress synced to browser" -> "Free, works offline, progress synced to browser"
- Footer: "© 2026 JSPrep Pro · jsprep.pro · Built for frontend developers" -> three lines, same words
- src/data/homepageStaticData.ts: every " — " in mode, why and feature copy became a comma, colon or brackets; "1–10" -> "1 to 10". proFeatures is also read by src/lib/seo/seo.ts and the paywall banner, so "Interview Sprint — unlimited" changes there too.

Removed decoration: all emoji, the drawn window bar on the evaluator, glow blobs, 5-star rows and the large quote mark on testimonials, medal emoji, avatar initials.
