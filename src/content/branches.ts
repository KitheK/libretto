/** Curated feature-branch merges into `development` — a visual history, not every PR. */

export type BranchLane = "foundation" | "agent" | "mcp" | "desk" | "canvas" | "notify" | "infra";

export type BranchMerge = {
  id: string;
  /** Short label drawn on the branch. */
  label: string;
  /** Branch name as pushed on GitHub. */
  branch: string;
  /** First PR that landed the feature, when known. */
  pr?: number;
  /** Rough calendar slot along the development trunk (0 = early May, 1 = mid-August). */
  t: number;
  lane: BranchLane;
  /** Stack part id used by InteractivePlate detail rail. */
  partId: string;
  blurb: string;
};

export const DEVELOPMENT = "development";

/**
 * Feature waves that built Conductor. Early spine follows the team logs;
 * July–August nodes are real merges into development on capstone-team-1.
 */
export const branchMerges: BranchMerge[] = [
  {
    id: "compose",
    label: "Compose stack",
    branch: "infra/compose-scaffold",
    t: 0.08,
    lane: "foundation",
    partId: "kong",
    blurb: "Week 4: frontend, Kong, Redis and Postgres come up under Compose — the spine every later branch merges into.",
  },
  {
    id: "auth",
    label: "Auth door",
    branch: "backend/auth-login",
    t: 0.16,
    lane: "foundation",
    partId: "auth",
    blurb: "Login, register, and JWT issue land first. Later credential and LLM-key branches keep returning to this service.",
  },
  {
    id: "connector",
    label: "Canvas caller",
    branch: "backend/canvas-service-implementation",
    t: 0.22,
    lane: "canvas",
    partId: "connector",
    blurb: "The connector becomes the only process that may call Canvas REST. Auth starts checking pasted keys through it.",
  },
  {
    id: "agent",
    label: "ReAct agent",
    branch: "93-ai-agent-microservice",
    t: 0.32,
    lane: "agent",
    partId: "agent",
    blurb: "Week 7–8: the agentic service merges with HITL and action history inside it, not as separate containers.",
  },
  {
    id: "desk-live",
    label: "Desk joins APIs",
    branch: "frontend/live-api-wiring",
    t: 0.38,
    lane: "desk",
    partId: "frontend",
    blurb: "Week 8–9: pages that showed mock data start talking to Kong. The assistant leaves the mock.",
  },
  {
    id: "celery",
    label: "Celery sessions",
    branch: "feat/agent-celery-sessions",
    pr: 518,
    t: 0.48,
    lane: "agent",
    partId: "agent",
    blurb: "PR #518 moves agent sessions onto a Celery worker so a long thought does not hold the request process.",
  },
  {
    id: "scope",
    label: "Scope guard",
    branch: "feat/agent-scope-guard",
    pr: 534,
    t: 0.52,
    lane: "agent",
    partId: "agent",
    blurb: "PR #534 refuses injection and off-topic prompts before the ReAct loop spends a tool call.",
  },
  {
    id: "mcp",
    label: "MCP server",
    branch: "feat/mcp-pr1-server",
    pr: 565,
    t: 0.56,
    lane: "mcp",
    partId: "mcp",
    blurb: "PRs #565–567 dockerize mcp-canvas and wire the agent through TOOL_BACKEND instead of calling Canvas tools directly.",
  },
  {
    id: "rubric",
    label: "Rubric drafts",
    branch: "feat/agent-document-upload",
    pr: 519,
    t: 0.58,
    lane: "agent",
    partId: "agent",
    blurb: "PRs #519–522: upload a rubric, extract dates on Celery, draft Canvas assignments the instructor can review.",
  },
  {
    id: "mail",
    label: "Mail room",
    branch: "feat/email-notifications-pr1-contracts",
    pr: 723,
    t: 0.68,
    lane: "notify",
    partId: "notify",
    blurb: "PRs #723–744: notification grows contracts, a worker, transactional mail, digests, then Resend as the ESP.",
  },
  {
    id: "health",
    label: "System Health",
    branch: "feat/admin-live-logs",
    pr: 697,
    t: 0.7,
    lane: "infra",
    partId: "clickhouse",
    blurb: "PRs #697–709: live admin logs and metrics on System Health, fed from the logging path into ClickHouse.",
  },
  {
    id: "llm-keys",
    label: "LLM keys",
    branch: "split/auth-llm-api",
    pr: 505,
    t: 0.78,
    lane: "foundation",
    partId: "auth",
    blurb: "Split PRs #505–527 and #825: instructors store their own model keys; the agent resolves them over gRPC each call.",
  },
  {
    id: "quick",
    label: "Quick actions",
    branch: "feature/quick-actions-annoucements",
    pr: 858,
    t: 0.84,
    lane: "desk",
    partId: "frontend",
    blurb: "PRs #858–897: announcement, message, quiz, and create-assignment quick actions — each a branch into development.",
  },
  {
    id: "grading",
    label: "Grading queue",
    branch: "feature/grading-queue",
    pr: 935,
    t: 0.9,
    lane: "desk",
    partId: "frontend",
    blurb: "PRs #908–935: grade_with_rubric and the grading queue land as the close-out desk features.",
  },
  {
    id: "safe-errors",
    label: "Safe errors",
    branch: "feat/safe-errors-1-auth",
    pr: 916,
    t: 0.93,
    lane: "infra",
    partId: "kong",
    blurb: "PRs #916–920: five stacked branches sanitize user-facing errors across auth, canvas, agent, MCP, and the desk.",
  },
  {
    id: "kong-ws",
    label: "WS through Kong",
    branch: "fix/mcp-ws-kong",
    pr: 946,
    t: 0.98,
    lane: "infra",
    partId: "kong",
    blurb: "PR #946 routes MCP and notification WebSockets through Kong — the live edge this book’s screenshots follow.",
  },
];

export const laneMeta: Record<BranchLane, { title: string; tone: "client" | "edge" | "service" | "agent" | "bus" | "store" | "outside" }> = {
  foundation: { title: "Foundation", tone: "edge" },
  agent: { title: "Agent", tone: "agent" },
  mcp: { title: "MCP", tone: "service" },
  desk: { title: "Desk", tone: "client" },
  canvas: { title: "Canvas", tone: "outside" },
  notify: { title: "Notify", tone: "bus" },
  infra: { title: "Infra", tone: "store" },
};
