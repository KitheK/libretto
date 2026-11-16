export type ApiRoute = {
  id: string;
  path: string;
  methodHint: string;
  upstream: string;
  jwt: "none" | "exp + iss";
  serviceId: string;
  contract: string;
  rationale: string;
  relevance: string;
  surfaces: string[];
};

/** Kong declarative routes — technical detail for accordion expansion. */
export const apiRoutes: ApiRoute[] = [
  {
    id: "api_auth",
    path: "/api/auth",
    methodHint: "POST /login · /register · /refresh · /logout · Canvas OAuth bind",
    upstream: "authentication:8002",
    jwt: "none",
    serviceId: "auth",
    contract:
      "Open prefix at the gateway because the caller has no bearer yet. Auth issues JWTs (iss/exp claims), AES-encrypts Canvas OAuth material into schema auth, and blacklists revoked tokens in Redis until natural expiry. Peer services verify the same tokens over gRPC :50052.",
    rationale:
      "Identity must be a single vault. If every microservice minted or stored Canvas credentials, token sprawl would make rotation, logout, and audit impossible. Keeping /api/auth ungated while locking the other four prefixes is the minimal bootstrap that still preserves a hard trust boundary after login.",
    relevance:
      "Any LMS-adjacent assistant that acts under an instructor identity needs a dedicated auth boundary: credential encryption at rest, short-lived access tokens, and a revoke path that does not wait for clock skew. This route is that boundary for Capstone-scale institutional risk.",
    surfaces: ["login/register", "JWT issue + refresh", "Canvas token vault", "gRPC VerifyToken :50052"],
  },
  {
    id: "api_agent",
    path: "/api/agent",
    methodHint: "POST /sessions · /messages · HITL resolve · checkpoints",
    upstream: "agentic:8003",
    jwt: "exp + iss",
    serviceId: "agent",
    contract:
      "JWT-gated harness API. Accepts instructor goals, runs scope_guard → LiteLLM ReAct → policy classification. WRITE tools set requires_hitl; results pass sanitizer.py before re-entering model context. Long sessions offload to a Celery worker; durable steps land in Postgres schema agent; Redis publishes session:{id}:steps|hitl.",
    rationale:
      "Natural language is not an authorization primitive. The harness concentrates model risk in one process so HITL, sanitization, and course-scope filters cannot be skipped by a second caller path. Kong JWT stops anonymous invocation of that process.",
    relevance:
      "Projects that translate NL into mutating LMS operations need an explicit agent API separate from the LMS client. Without it, prompt injection and ambiguous entity resolution have no audited pause point before side effects.",
    surfaces: ["ReAct orchestrator", "scope_guard.py", "sanitizer.py", "HITL awaiting_approval", "Celery worker"],
  },
  {
    id: "api_notify",
    path: "/api/notify",
    methodHint: "HTTP control plane · WS upgrade lives on :8004 (not this prefix)",
    upstream: "notification:8004",
    jwt: "exp + iss",
    serviceId: "notify",
    contract:
      "HTTP under Kong for subscription preferences and mail triggers. The browser WebSocket attaches directly to notification:8004 and is absent from the declarative route table — intentional so socket fan-out does not share Kong’s request lifecycle. Subscribes Redis session:*:steps|hitl for live UI; mail uses disjoint channels → worker → Resend.",
    rationale:
      "Coupling live progress to the agent HTTP process would pin connection state inside the harness. A dedicated notify service lets the agent remain request/worker oriented while the desk receives step and HITL cards with low latency.",
    relevance:
      "HITL UX fails without a push channel. Separating notify HTTP (JWT via Kong) from the raw socket is a standard pattern when gateway plugins are HTTP-centric and WebSocket auth is handled at the application edge.",
    surfaces: ["Redis fan-out", "HITL socket cards", "mail channel subscribers", "Resend webhooks"],
  },
  {
    id: "api_connector",
    path: "/api/connector",
    methodHint: "HTTP inspect/admin · primary LMS path is gRPC :50055 from MCP",
    upstream: "connector:8005",
    jwt: "exp + iss",
    serviceId: "connector",
    contract:
      "Only process joined to the external canvas-lms Docker network. Fetches instructor tokens from auth by user id, executes Canvas REST with a 60s timeout, normalises payloads. Agent traffic arrives via mcp-canvas gRPC :50055; Kong /api/connector is the browser-facing control surface, not the model’s write pipe.",
    rationale:
      "Concentrating LMS I/O in one binary creates a single rate-limit, audit, and network ACL point. The model never receives a bearer; the connector injects credentials at the last hop.",
    relevance:
      "Institutional LMS integrations almost always require a choke-point service: Canvas permissions stay instructor-scoped, secrets never enter prompt context, and REST quirks stay isolated from the orchestrator.",
    surfaces: ["Canvas REST 60s", "token fetch from auth", "canvas-lms network", "gRPC :50055"],
  },
  {
    id: "api_canvas_tools",
    path: "/api/canvas-tools",
    methodHint: "HTTP tool catalog/inspect on mcp-canvas:8100 · agent uses gRPC :50056",
    upstream: "mcp-canvas:8100",
    jwt: "exp + iss",
    serviceId: "mcp",
    contract:
      "FR9.6 Dockerized MCP surface. CallTool requires access JWT; agent↔MCP is gRPC :50056 with mTLS when enabled. MCP forwards structured tools to the connector — it does not open Canvas HTTP itself. Kong exposes :8100 for authenticated tool inspection from the desk.",
    rationale:
      "Embedding Canvas HTTP inside the agent couples the orchestrator to LMS transport. MCP makes the tool catalog an explicit, swappable contract so policy.py can reason about tool names without shipping REST clients in the harness.",
    relevance:
      "Agentic LMS products benefit from an MCP (or equivalent) boundary: tool schemas version independently, mTLS authenticates the agent, and browser-side introspection stays JWT-gated without giving the model a network path to Canvas.",
    surfaces: ["ListTools / CallTool", "gRPC :50056 mTLS", "JWT on CallTool", "forward to connector"],
  },
];

export type DeskGroup = {
  id: string;
  title: string;
  guard: string;
  routes: Array<{ path: string; note: string; serviceId?: string }>;
  rationale: string;
  relevance: string;
};

export const deskGroups: DeskGroup[] = [
  {
    id: "desk_guest",
    title: "GuestRoute",
    guard: "Unauthenticated shell",
    routes: [
      { path: "/", note: "Marketing/entry redirect into login when anonymous", serviceId: "frontend" },
      { path: "/login", note: "Credential form → POST /api/auth", serviceId: "auth" },
    ],
    rationale:
      "Guest routes must not mount instructor data loaders. Isolating them under GuestRoute prevents accidental fetch of course rosters before a JWT exists.",
    relevance:
      "Capstone assistants handle FERPA-sensitive payloads; the router itself is part of the control plane. Guest isolation is the first fail-closed gate.",
  },
  {
    id: "desk_onboarding",
    title: "ProtectedRoute → OnboardingGuard",
    guard: "Signed-in, incomplete setup",
    routes: [
      { path: "/onboarding", note: "Forces Canvas/LLM binding before product surfaces", serviceId: "auth" },
      { path: "/home", note: "Role switch into instructor or admin home", serviceId: "frontend" },
    ],
    rationale:
      "OnboardingGuard blocks the assistant until Canvas and LLM credentials exist. That removes a class of runtime failures where the harness would call tools with an empty vault.",
    relevance:
      "Any multi-token integration (LMS + model gateway) needs a setup gate; otherwise NL sessions start in a half-configured state and leak confusing errors into HITL.",
  },
  {
    id: "desk_instructor",
    title: "InstructorRoute",
    guard: "Role = instructor",
    routes: [
      { path: "/dashboard", note: "Course overview widgets", serviceId: "frontend" },
      { path: "/grading-queue", note: "Submission worklist", serviceId: "frontend" },
      { path: "/courses", note: "Course tree; nested assignments/rubrics", serviceId: "connector" },
      { path: "/ai-assistant", note: "NL → harness; opens HITL cards via notify socket", serviceId: "agent" },
      { path: "/action-history", note: "Durable agent/approval trail", serviceId: "agent" },
      { path: "/canvas-token-connection", note: "OAuth bind into auth vault", serviceId: "auth" },
      { path: "/llm-token-connection", note: "Provider key via LiteLLM path", serviceId: "llm" },
    ],
    rationale:
      "InstructorRoute is where mutating LMS intent is authored. Pairing /ai-assistant with /action-history keeps proposal and audit adjacent in the IA, matching the harness’s HITL model.",
    relevance:
      "For NL→LMS products, the desk must expose approval and history as first-class routes, not modal afterthoughts — auditors need a stable URL surface for reviewed writes.",
  },
  {
    id: "desk_admin",
    title: "AdminRoute",
    guard: "Role = admin",
    routes: [
      { path: "/system-health", note: "OTel → ClickHouse operational view", serviceId: "clickhouse" },
      { path: "/user-management", note: "Account administration via auth", serviceId: "auth" },
    ],
    rationale:
      "Ops surfaces stay out of the instructor tree so PII-heavy course UIs are not mixed with cluster telemetry. ClickHouse TTL keeps health data from becoming a second student store.",
    relevance:
      "Production LMS assistants need a privileged health plane; separating it by route guard is cheaper and clearer than feature-flagging widgets inside instructor pages.",
  },
  {
    id: "desk_settings",
    title: "Settings",
    guard: "Any signed-in role",
    routes: [{ path: "/settings", note: "Account preferences; not role-gated beyond login", serviceId: "frontend" }],
    rationale:
      "Settings remains available under ProtectedRoute without InstructorRoute so admins and instructors share account hygiene without duplicating pages.",
    relevance:
      "Shared settings under a common guard reduces authz matrix complexity in small teams while still excluding guests.",
  },
];
