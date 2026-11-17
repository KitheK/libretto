import { existsSync } from "node:fs";
import { join } from "node:path";
import { SCHEMA_VERSION, type ArchitectureFile } from "../lib/schemas";

export type GraphInput = {
  overview?: string;
  nodes: Array<{ id: string; label: string; path?: string; group?: string }>;
  edges: Array<{ from: string; to: string; label?: string }>;
  root?: string;
};

/** Build architecture.json; drop nodes whose paths do not exist. */
export function buildArchitecture(input: GraphInput): ArchitectureFile {
  const root = input.root ?? process.cwd();
  const nodes = input.nodes.filter((n) => !n.path || existsSync(join(root, n.path)));
  const ids = new Set(nodes.map((n) => n.id));
  const edges = input.edges.filter((e) => ids.has(e.from) && ids.has(e.to));
  const mermaid = [
    "flowchart LR",
    ...nodes.map((n) => `  ${n.id}["${n.label.replace(/"/g, "'")}"]`),
    ...edges.map((e) => `  ${e.from} -->|${(e.label ?? "").replace(/\|/g, "/")} | ${e.to}`),
  ].join("\n");

  return {
    schemaVersion: SCHEMA_VERSION,
    overview: input.overview
      ? { text: input.overview, provenance: "inferred", source: "generated", evidence: "repo-scan" }
      : undefined,
    nodes,
    edges,
    mermaid,
  };
}
