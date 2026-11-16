/**
 * Tiny inline markup used in chapter prose: [label](href), `code`, *emphasis*.
 * Code is matched first so `session:*:steps` never turns into italics, and an
 * asterisk only opens emphasis when it is not glued to a word or a colon.
 */
export type InlineToken =
  | { kind: "text"; text: string }
  | { kind: "code"; text: string }
  | { kind: "em"; text: string }
  | { kind: "link"; text: string; href: string };

const TOKEN = /(`[^`]+`|\[[^\]]+\]\([^)]+\)|(?<![\w:])\*[^*\s](?:[^*]*[^*\s])?\*(?![\w:]))/g;

export function tokenizeInline(text: string): InlineToken[] {
  const out: InlineToken[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) out.push({ kind: "text", text: text.slice(last, start) });
    const token = match[0];
    if (token.startsWith("`")) {
      out.push({ kind: "code", text: token.slice(1, -1) });
    } else if (token.startsWith("*")) {
      out.push({ kind: "em", text: token.slice(1, -1) });
    } else {
      out.push({
        kind: "link",
        text: token.slice(1, token.indexOf("]")),
        href: token.slice(token.indexOf("(") + 1, -1),
      });
    }
    last = start + token.length;
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
  return out;
}
