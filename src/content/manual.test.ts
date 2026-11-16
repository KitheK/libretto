import { describe, expect, it } from "vitest";
import { chapterBySlug, chapters, faqs, parts, wordCount } from "./manual";

const prose = chapters
  .map((chapter) =>
    [
      chapter.title,
      chapter.standfirst,
      ...chapter.blocks.map((block) =>
        block.type === "p" || block.type === "h2" ? block.text : "",
      ),
    ].join(" "),
  )
  .join("\n");

describe("manual", () => {
  it("has one chapter for each part of the running stack", () => {
    expect(chapters.map((chapter) => chapter.slug)).toEqual([
      "01-shape",
      "02-desk",
      "03-door",
      "04-asking",
      "05-loop",
      "06-canvas",
      "07-wire",
      "08-kept",
      "09-road",
    ]);
    expect(new Set(chapters.map((chapter) => chapter.part))).toEqual(new Set(parts.map((part) => part.id)));
  });

  it("gives every chapter a plate and a source", () => {
    for (const chapter of chapters) {
      const figures = chapter.blocks.filter((block) => block.type === "figure");
      expect(figures.length).toBeGreaterThanOrEqual(1);
      expect(chapter.sources.length).toBeGreaterThan(0);
      expect(wordCount(chapter)).toBeGreaterThan(120);
      expect(chapterBySlug(chapter.slug)?.title).toBe(chapter.title);
    }
  });

  it("names Conductor, Libretto, and the paths a reader must be able to find", () => {
    expect(prose).toContain("Conductor");
    expect(prose).toContain("Libretto");
    const required = [
      "Kong",
      "8000",
      "8004",
      "microservices",
      "agentic service",
      "Celery",
      "mcp-canvas",
      "connector",
      "session:*:steps",
      "session:*:hitl",
      "Redis",
      "Postgres",
      "ClickHouse",
      "OpenTelemetry",
      "otel_logs",
      "Adminer",
      "System Health",
      "/data/documents",
      "grading queue",
      "sanitizer",
      "scope_guard",
      "HITL",
      "natural language",
    ];
    for (const name of required) {
      expect(prose).toContain(name);
    }
  });

  it("answers the questions the homepage asks", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(5);
    expect(faqs.every((item) => item.answer.length > 40)).toBe(true);
  });
});
