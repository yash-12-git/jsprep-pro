// Stored answers are HTML, and their code samples often hold JSX or generics
// (`<Spinner />`, `useState<User>`) written with a raw `<`. Injected as-is, the
// browser parses those as elements and the code silently disappears. This
// escapes every tag inside <pre>/<code> except the code wrappers and <br>, so
// the sample shows as written. Already-escaped `&lt;` is left alone.

const TAG = /<\/?([A-Za-z][\w.:-]*)[^<>]*>/g;
const KEEP = new Set(["pre", "code", "br"]);

function escapePass(html: string): string {
  let depth = 0;
  return html.replace(TAG, (tag, name: string) => {
    const n = name.toLowerCase();
    if (n === "pre" || n === "code") {
      depth = Math.max(0, depth + (tag[1] === "/" ? -1 : 1));
      return tag;
    }
    if (depth === 0 || KEEP.has(n)) return tag;
    return tag.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  });
}

export function escapeCodeTags(html: string): string {
  if (!html || !/<(pre|code)\b/i.test(html)) return html;
  // Nested generics (`Promise<Array<T>>`) only match from the inside out, so
  // repeat until nothing changes.
  let out = html;
  for (let i = 0; i < 5; i++) {
    const next = escapePass(out);
    if (next === out) break;
    out = next;
  }
  return out;
}
