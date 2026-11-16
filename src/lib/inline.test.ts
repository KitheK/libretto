import { describe, expect, it } from "vitest";
import { tokenizeInline } from "./inline";

describe("tokenizeInline", () => {
  it("keeps Redis channel globs literal", () => {
    const tokens = tokenizeInline("subscribes to session:*:steps and session:*:hitl.");
    expect(tokens).toEqual([{ kind: "text", text: "subscribes to session:*:steps and session:*:hitl." }]);
  });

  it("reads code, links, and emphasis", () => {
    const tokens = tokenizeInline("Open `/ws` in [Kong](https://x.test) — *calmly*.");
    expect(tokens.map((token) => token.kind)).toEqual(["text", "code", "text", "link", "text", "em", "text"]);
    expect(tokens[1]).toEqual({ kind: "code", text: "/ws" });
    expect(tokens[3]).toEqual({ kind: "link", text: "Kong", href: "https://x.test" });
  });

  it("does not parse markup inside code", () => {
    expect(tokenizeInline("`session:*:hitl`")).toEqual([{ kind: "code", text: "session:*:hitl" }]);
  });
});
