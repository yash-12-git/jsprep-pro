/**
 * Builds the open-source "JavaScript output questions" repository from the
 * published questions in Firestore.
 *
 *   node scripts/build-oss-repo.cjs            → writes oss/javascript-output-questions/
 *   node scripts/build-oss-repo.cjs <out-dir>  → writes there instead
 *
 * Read-only against Firestore: one read per published JavaScript output
 * question. Each question links to its playable page on jsprep.pro
 * (/q/<slug>), tagged so analytics can tell GitHub visitors apart.
 *
 * Re-run it after adding or fixing questions, then commit the result in the
 * repository's own git (oss/ is ignored by this project).
 */

const fs = require("fs");
const path = require("path");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const SITE = "https://jsprep.pro";
const UTM = "utm_source=github&utm_medium=oss&utm_campaign=output-questions";
const REPO_NAME = "javascript-output-questions";
const outDir = path.resolve(process.argv[2] || path.join(__dirname, "../oss", REPO_NAME));

// Same labels as the site (DIFF_LABEL in styles/tokens).
const DIFFICULTY = { beginner: "Easy", core: "Easy", advanced: "Medium", expert: "Hard" };

function loadEnv() {
  const file = path.join(__dirname, "../.env.local");
  return Object.fromEntries(
    fs
      .readFileSync(file, "utf8")
      .split("\n")
      .filter((l) => /^[A-Z_0-9]+=/.test(l))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, "")];
      }),
  );
}

/** GitHub's heading anchor: lower case, punctuation dropped, spaces to hyphens. */
function anchor(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N} _-]/gu, "")
    .replace(/ /g, "-");
}

const playUrl = (slug) => `${SITE}/q/${slug}?${UTM}`;

/** A fence that can't be closed early by backticks inside the content. */
function fence(body, lang = "") {
  const longest = Math.max(2, ...(body.match(/`+/g) || []).map((m) => m.length));
  const ticks = "`".repeat(longest + 1);
  return `${ticks}${lang}\n${body.replace(/\s+$/, "")}\n${ticks}`;
}

function renderQuestion(q, n) {
  const lines = [
    `### ${n}. ${q.title}`,
    "",
    `**Difficulty:** ${DIFFICULTY[q.difficulty] ?? "Medium"}. **Topic:** ${q.category}.`,
    "",
    "What does this print?",
    "",
    fence(q.code, "javascript"),
    "",
    `**[Predict the output and check it on JSPrep Pro](${playUrl(q.slug)})**`,
    "",
    "<details>",
    "<summary>Show the answer</summary>",
    "",
    "Output:",
    "",
    fence(q.expectedOutput),
    "",
  ];
  if (q.explanation) lines.push(q.explanation.trim(), "");
  if (q.keyInsight) lines.push(`**Key insight:** ${q.keyInsight.trim()}`, "");
  lines.push("</details>", "", "---", "");
  return lines.join("\n");
}

function renderReadme(groups, total) {
  const toc = groups
    .map(([cat, qs]) => `- [${cat}](#${anchor(cat)}) (${qs.length})`)
    .join("\n");

  let n = 0;
  const body = groups
    .map(([cat, qs]) => {
      const items = qs.map((q) => renderQuestion(q, ++n)).join("\n");
      return `## ${cat}\n\n${items}`;
    })
    .join("\n");

  return `# JavaScript Output Questions

${total} "what does this print?" questions, the kind frontend interviews use to test how well you really know JavaScript: closures, \`this\`, the event loop, hoisting, coercion and more.

Each question has the answer and a short explanation, hidden until you open it. Try to predict the output first. Better still, **play each one on [JSPrep Pro](${SITE}/javascript-output-questions?${UTM})**: type your prediction, check it, and see where your reasoning went wrong.

If this helps your prep, a star helps other people find it.

## Contents

${toc}

---

${body}
## More practice

- [Interview Sprint](${SITE}/sprint?${UTM}): a timed mix of theory, output and debugging questions, with a shareable result.
- [Debug Lab](${SITE}/debug-lab?${UTM}): find and fix the bug in real code.
- [Polyfill Lab](${SITE}/polyfill-lab?${UTM}): write \`Promise.all\`, \`bind\`, \`debounce\` and more, with tests that run in your browser.

## Found a mistake?

[Open an issue](../../issues) with the question number and what's wrong. Questions are maintained on [jsprep.pro](${SITE}?${UTM}), and this list is regenerated from there, so fixes land in both.

## License

The questions and explanations are licensed under [CC BY-NC-SA 4.0](LICENSE.md). You can share and adapt them for non-commercial use, with credit and a link to [jsprep.pro](${SITE}).
`;
}

const LICENSE = `# License

Copyright (c) ${new Date().getFullYear()} JSPrep Pro (${SITE})

The questions, code samples and explanations in this repository are licensed under the
**Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License**
(CC BY-NC-SA 4.0).

You may share and adapt this material for non-commercial purposes, provided you give
appropriate credit with a link to ${SITE}, indicate if changes were made, and distribute
your contributions under the same license.

Full legal text: https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
`;

const CONTRIBUTING = `# Contributing

Thanks for helping improve these questions.

- **Wrong answer or unclear explanation?** [Open an issue](../../issues) with the question number, what you expected and what you saw. Include your browser or Node version if the output depends on it.
- **New question idea?** Open an issue with the code and the expected output.

The README is generated from the question bank on [jsprep.pro](${SITE}), so please suggest changes in an issue rather than editing the README directly: a direct edit would be overwritten on the next update.
`;

async function main() {
  const env = loadEnv();
  const db = getFirestore(
    initializeApp({
      credential: cert({
        projectId: env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    }),
  );

  const snap = await db
    .collection("questions")
    .where("status", "==", "published")
    .where("track", "==", "javascript")
    .where("type", "==", "output")
    .select("slug", "title", "category", "difficulty", "order", "code", "expectedOutput", "explanation", "keyInsight")
    .get();

  const questions = snap.docs
    .map((d) => d.data())
    .filter((q) => q.slug && q.code && q.expectedOutput);
  const skipped = snap.size - questions.length;

  // Categories in the order their first question appears, questions by order.
  questions.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const byCat = new Map();
  for (const q of questions) {
    if (!byCat.has(q.category)) byCat.set(q.category, []);
    byCat.get(q.category).push(q);
  }
  const groups = [...byCat.entries()];

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "README.md"), renderReadme(groups, questions.length));
  fs.writeFileSync(path.join(outDir, "LICENSE.md"), LICENSE);
  fs.writeFileSync(path.join(outDir, "CONTRIBUTING.md"), CONTRIBUTING);

  console.log(
    `Wrote ${questions.length} questions in ${groups.length} categories to ${outDir}` +
      (skipped ? ` (skipped ${skipped} without a slug, code or expected output)` : ""),
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err.code ?? "", String(err.message).slice(0, 300));
    process.exit(1);
  });
