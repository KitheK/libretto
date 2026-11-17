import type { ClaimMeta } from "./provenance";

export const SCHEMA_VERSION = 1;

export type FeatureStatus = "works" | "partial" | "stubbed" | "cut";

export type Size = "lite" | "standard" | "full";

export type ProjectKind =
  | "personal"
  | "coursework"
  | "hackathon"
  | "team"
  | "work"
  | "oss"
  | "research"
  | "other";

export type ThemeScheme = "libretto" | "plate" | "poster" | "plain" | "custom";
export type FrameVariant = "coins46" | "pavot30" | "lys33" | "halo01" | "none";
export type FriezeVariant = "lys33" | "pavot30" | "none";
export type RailVariant = "pavot30" | "band01" | "none";

export type ThemeJson = {
  schemaVersion: number;
  scheme: ThemeScheme;
  tone: "manual" | "plain" | "poster";
  tokens: { canvas: string; ink: string; action: string; rule: string; muted: string };
  fonts: {
    display: "paleologue" | "paleologue-poster";
    body: "newsreader";
    ui: "source-sans";
    mono: "departure";
  };
  ornaments: {
    plateFrame: FrameVariant;
    demoFrame: FrameVariant;
    footFrieze: FriezeVariant;
    footCrop: "full" | "band";
    footAnimate: boolean;
    rail: RailVariant;
    ornamentPalette: "plate" | "libretto" | "theme";
  };
};

export type ScorecardJson = {
  schemaVersion: number;
  size: Size;
  job: string & ClaimMeta;
  brief: string & ClaimMeta;
  outcome: string & ClaimMeta;
  features: Array<{ name: string; status: FeatureStatus; note?: string } & ClaimMeta>;
  knownGap?: string & ClaimMeta;
  built: string & ClaimMeta;
  borrowed: string & ClaimMeta;
  proof?: string & ClaimMeta;
  next?: string & ClaimMeta;
};

// Claim fields are stored as objects with text + meta for JSON clarity
export type TextClaim = { text: string } & ClaimMeta;

export type ScorecardFile = {
  schemaVersion: number;
  size: Size;
  job: TextClaim;
  brief: TextClaim;
  outcome: TextClaim;
  features: Array<{ name: string; status: FeatureStatus; note?: string } & ClaimMeta>;
  knownGap?: TextClaim;
  built: TextClaim;
  borrowed: TextClaim;
  proof?: TextClaim;
  next?: TextClaim;
};

export type RunFile = {
  schemaVersion: number;
  steps: Array<{ title: string; command?: string; body?: string } & ClaimMeta>;
  envNames: string[];
  deployUrl?: string;
  demoScript: TextClaim;
};

export type DecisionFile = {
  schemaVersion: number;
  decisions: Array<{
    id: string;
    decision: string;
    alternatives?: string;
    reason?: string;
    outcome?: string;
    deadEnd?: boolean;
  } & ClaimMeta>;
};

export type RequirementsFile = {
  schemaVersion: number;
  items: Array<{ id: string; text: string; where?: string; evidence?: string } & ClaimMeta>;
};

export type TeamFile = {
  schemaVersion: number;
  people: Array<{ name: string; role?: string; areas?: string[] } & ClaimMeta>;
};

export type InterviewFile = {
  schemaVersion: number;
  depth: "quick" | "standard" | "deep";
  profile: {
    kind?: ProjectKind;
    builders?: string;
    purpose?: string;
    readerGoal?: string;
    scale?: string;
  };
  answers: Record<string, unknown>;
  look?: Partial<ThemeJson>;
};

export type ManualBlock =
  | { type: "h2"; text: string } & ClaimMeta
  | { type: "p"; text: string } & ClaimMeta
  | { type: "figure"; id: string } & ClaimMeta
  | { type: "status" } & ClaimMeta
  | { type: "run" } & ClaimMeta
  | { type: "decision"; id?: string } & ClaimMeta
  | { type: "requirement" } & ClaimMeta
  | { type: "contribution" } & ClaimMeta
  | { type: "architecture" } & ClaimMeta
  | { type: "timeline" } & ClaimMeta
  | { type: "live"; url?: string } & ClaimMeta;

export type ManualFile = {
  schemaVersion: number;
  title: string;
  parts: Array<{ id: string; title: string; blurb?: string }>;
  chapters: Array<{
    slug: string;
    number: string;
    part: string;
    title: string;
    standfirst?: string;
    blocks: ManualBlock[];
  }>;
  faqs?: Array<{ question: string; answer: string } & ClaimMeta>;
};

export type ArchitectureFile = {
  schemaVersion: number;
  overview?: TextClaim;
  nodes: Array<{ id: string; label: string; path?: string; group?: string }>;
  edges: Array<{ from: string; to: string; label?: string }>;
  mermaid?: string;
};

export type BranchesFile = {
  schemaVersion: number;
  form: "river" | "build-log" | "hourly";
  events: Array<{ id: string; label: string; t: number; blurb?: string; branch?: string } & ClaimMeta>;
};

export type StackFile = {
  schemaVersion: number;
  parts: Array<{ id: string; title: string; role?: string; why?: string; path?: string } & ClaimMeta>;
};

export type ApisFile = {
  schemaVersion: number;
  routes: Array<{
    id: string;
    path: string;
    methodHint?: string;
    upstream?: string;
    contract?: string;
  } & ClaimMeta>;
};

const SCHEMES: Record<Exclude<ThemeScheme, "custom">, ThemeJson["tokens"]> = {
  libretto: { canvas: "#fbfbfb", ink: "#000000", action: "#103dff", rule: "#d0d0d0", muted: "#666666" },
  plate: { canvas: "#f3ebdd", ink: "#12141c", action: "#2a7a66", rule: "#c9bfa8", muted: "#5c5648" },
  poster: { canvas: "#fbf7f2", ink: "#1a120c", action: "#e87a3a", rule: "#e0d2c4", muted: "#7a6558" },
  plain: { canvas: "#ffffff", ink: "#111111", action: "#222222", rule: "#e5e5e5", muted: "#666666" },
};

export function themePresets(scheme: ThemeScheme, tone: ThemeJson["tone"] = "manual"): ThemeJson {
  const tokens = scheme === "custom" ? SCHEMES.libretto : SCHEMES[scheme];
  const plainOrnaments = scheme === "plain" || tone === "plain";
  return {
    schemaVersion: SCHEMA_VERSION,
    scheme,
    tone,
    tokens,
    fonts: {
      display: tone === "poster" ? "paleologue-poster" : "paleologue-poster",
      body: "newsreader",
      ui: "source-sans",
      mono: "departure",
    },
    ornaments: {
      plateFrame: plainOrnaments ? "none" : "coins46",
      demoFrame: plainOrnaments ? "none" : "pavot30",
      footFrieze: plainOrnaments ? "none" : "lys33",
      footCrop: "full",
      footAnimate: !plainOrnaments,
      rail: "none",
      ornamentPalette: "theme",
    },
  };
}

export function validateTheme(t: ThemeJson): string[] {
  const errors: string[] = [];
  if (t.schemaVersion !== SCHEMA_VERSION) errors.push(`theme schemaVersion ${t.schemaVersion}`);
  if (!t.tokens?.canvas || !t.tokens?.ink || !t.tokens?.action) errors.push("theme.tokens incomplete");
  return errors;
}

export function validateScorecard(s: ScorecardFile): string[] {
  const errors: string[] = [];
  if (s.schemaVersion !== SCHEMA_VERSION) errors.push("scorecard schemaVersion");
  if (!s.job?.text) errors.push("scorecard.job required");
  if (!["lite", "standard", "full"].includes(s.size)) errors.push("scorecard.size invalid");
  for (const f of s.features ?? []) {
    if (f.provenance === "confirmed" && f.source === "generated") {
      errors.push(`feature ${f.name}: agent cannot confirm`);
    }
  }
  return errors;
}

export function validateArchitecture(a: ArchitectureFile, exists: (path: string) => boolean): string[] {
  const errors: string[] = [];
  for (const n of a.nodes) {
    if (n.path && !exists(n.path)) errors.push(`architecture node ${n.id}: missing path ${n.path}`);
  }
  return errors;
}
