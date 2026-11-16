export type StackPart = {
  id: string;
  title: string;
  role: string;
  why: string;
  privacy: string;
  ports?: string;
  links?: string[];
  facts?: string[];
};

export const stackParts: Record<string, StackPart> = {
  frontend: {
    id: "frontend",
    title: "Frontend",
    role: "The desk where an instructor turns a sentence into a reviewed Canvas action.",
    why: "The page never calls Canvas and never keeps a Canvas key. All of its HTTP goes to Kong under /api, and its sockets go to Kong under /api/notify. Nested route guards keep guest, onboarding, instructor, and admin rooms apart. The assistant polls the agent for progress (about every 2.5 s) rather than waiting on a socket.",
    privacy: "Student names that appear in course pages come back through the connector, scoped to the instructor’s own Canvas key. The assistant shows an approval card before any write leaves the building, and Action History keeps what was approved.",
    ports: ":5173",
    links: ["App.tsx", "gatewayUrls.ts", "useAgentConversation.ts"],
    facts: [
      "Vite + React · GuestRoute / ProtectedRoute / OnboardingGuard / InstructorRoute / AdminRoute",
      "HTTP → Kong :8000/api · WS → Kong :8000/api/notify",
      "Agent progress by REST polling; socket used by System Health",
    ],
  },
  kong: {
    id: "kong",
    title: "Kong gateway",
    role: "The single door. Every browser call, HTTP or WebSocket, stops here first.",
    why: "DB-less Kong keeps routing in one declarative file (envsubst fills the JWT secret at start), so there is no gateway database to migrate. Rate limits sit at the edge so one busy tab cannot flood auth or the connector. Three routes run the JWT plugin; /api/auth is open because the caller has no token yet; /api/notify leaves the check to notification so a browser socket can send ?token=.",
    privacy: "Kong verifies signature, iss, and exp before a request reaches the agent, the connector, or mcp-canvas. It never sees a Canvas key: those stay encrypted in auth and are released only to the connector over gRPC.",
    ports: ":8000  ·  /api/auth, /api/agent, /api/notify, /api/connector, /api/canvas-tools",
    links: ["kong.yaml.template"],
    facts: [
      "KONG_DATABASE=off · declarative routes rendered at start",
      "JWT plugin on agent, connector, canvas-tools · auth open · notify self-checks",
      "Global CORS localhost:5173 · rate limit 500/s, 50 000/h (local)",
    ],
  },
  auth: {
    id: "auth",
    title: "Authentication service",
    role: "Issues identity, keeps the instructor’s Canvas and model keys, and answers peers over gRPC.",
    why: "Identity is one service so no other container invents its own login rules. A Canvas integration is a URL plus an API key the instructor pastes in; an LLM integration is a provider key, base URL, and model. Both are AES-GCM encrypted at rest. Logout blacklists the token’s jti in Redis, so it dies before its expiry.",
    privacy: "No other service stores raw keys. The connector asks for Canvas details (GetCanvasDetails) and the agent for model details (GetLlmDetails) by user id, at the moment they need them. A new Canvas key is checked by asking the connector over gRPC, not by auth calling Canvas.",
    ports: "HTTP :8002  ·  gRPC :50052",
    links: ["core/security.py", "routes/auth.py", "grpc/"],
    facts: [
      "VerifyToken · GetCanvasDetails · GetLlmDetails over gRPC (mTLS when enabled)",
      "Canvas API key + LLM key encrypted with AES-GCM",
      "Joins default + canvas-lms networks; makes no Canvas REST calls",
    ],
  },
  agent: {
    id: "agent",
    title: "Agentic service",
    role: "The AI harness: ReAct loop, scope guard, risk policy, HITL pauses, sanitizer, checkpoints.",
    why: "Natural language is ambiguous and a model is not a control. The harness turns a goal into tool calls, ranks each call (read_safe, read_sensitive, write), and holds every write for a person. It pauses for disambiguation when several courses or students match. Runs are queued to a Celery worker so a page refresh cannot kill one mid-tool.",
    privacy: "scope_guard refuses injection patterns and off-topic work before tools run. The sanitizer strips names, emails, SIS ids, and grader identity from sensitive results before they re-enter the model’s history, and a course-context filter drops rows from other courses.",
    ports: "HTTP :8003  ·  gRPC :50057 (action history)  ·  Celery worker",
    links: ["orchestrator.py", "scope_guard.py", "policy.py", "sanitizer.py", "llm/resolving.py"],
    facts: [
      "run_until_pause · max 16 iterations · 24 messages of context",
      "OpenAI-compatible client · per-user key from auth · team default with fallback",
      "Checkpoints steps to Postgres; publishes session:{id}:steps|hitl",
    ],
  },
  notify: {
    id: "notify",
    title: "Notification service",
    role: "Sockets for live data, admin health and log routes, and the mail room.",
    why: "Connection state should not live inside the reasoning loop. The Go service pattern-subscribes to session:*:steps and session:*:hitl and can forward them to a socket subscribed to that session. In this build the desk uses its sockets for System Health: /ws streams filtered otel_logs rows from ClickHouse, /ws/health pushes service health every 2 s.",
    privacy: "Every socket and admin route verifies the token with auth over gRPC first. Mail runs on separate channels from the session bus, so a step or a HITL pause can never become an email.",
    ports: "HTTP + WS :8004 (browser reaches it via Kong /api/notify)",
    links: ["cmd/main.go", "internal/pubsub/redis.go", "internal/wsserver/"],
    facts: [
      "/ws · /ws/health · /admin/logs/* · /admin/services/health",
      "Subscribes session:*:steps|hitl; forwards on subscribe_session",
      "Mail: three subscribers → queue → worker → Resend",
    ],
  },
  mcp: {
    id: "mcp",
    title: "mcp-canvas",
    role: "The tool server: one ToolCore, two doors.",
    why: "A Dockerized MCP server makes the tool catalog an explicit, swappable contract. The agent uses internal gRPC McpToolService (ListTools / CallTool) on :50056 with mTLS, an internal service key, and the instructor’s access JWT on CallTool. Outside MCP hosts use Streamable HTTP at /mcp on :8100, exposed through Kong as /api/canvas-tools.",
    privacy: "mcp-canvas never opens Canvas HTTP; its only upstream is the connector’s gRPC. HITL stays in the agent. Calls from outside hosts are not paused by Conductor but are appended to the agent’s action history as confirmed or failed.",
    ports: "gRPC :50056  ·  HTTP :8100 (localhost-bound) via Kong /api/canvas-tools",
    links: ["README.md", "http/mcp_asgi.py", "core/identity.py"],
    facts: [
      "ListTools / CallTool · mTLS + service key + Bearer JWT",
      "Streamable HTTP /mcp for outside MCP hosts",
      "Upstream: connector gRPC :50055 only",
    ],
  },
  connector: {
    id: "connector",
    title: "Connector (canvas-service)",
    role: "The only code that makes a Canvas REST call.",
    why: "Risk concentrates at the LMS boundary, so one service owns it. Its repository layer is the only place /api/v1 is called. It answers mcp-canvas over gRPC and the desk’s course pages over HTTP (/api/connector), so dashboards and rubric pages do not detour through the agent.",
    privacy: "A key never travels with a prompt. The connector asks auth for the instructor’s Canvas URL and key (cached 60 s), calls Canvas with a 60 s timeout, retries 429 with Retry-After, and sends idempotency keys on writes.",
    ports: "HTTP :8005  ·  gRPC :50055",
    links: ["app/repository/", "app/repository/base.py", "app/grpc/client.py"],
    facts: [
      "Joins canvas-lms network · only /api/v1 caller",
      "GetCanvasDetails from auth · credentials cached 60 s",
      "CANVAS_REQUEST_TIMEOUT 60 s · 429 retry · idempotency keys",
    ],
  },
  redis: {
    id: "redis",
    title: "Redis",
    role: "Short memory, the event bus, and Celery’s queue.",
    why: "Conversation state and pub/sub need fast reads. Treating Redis as losable forces every important fact into a Postgres checkpoint. db0 holds the conversation cache (1 h TTL), the HITL queue, the JWT blacklist, and the session:* channels; db1 and db2 are the Celery broker and result backend.",
    privacy: "Blacklisted JWTs live here until expiry. If Redis is wiped, sessions rebuild from the Postgres transcript rather than from a cached roster.",
    ports: ":6379",
    facts: [
      "session:{id}:steps · session:{id}:hitl · mail channels",
      "Conversation cache TTL 3600 s · HITL queue",
      "Celery broker db1 · results db2",
    ],
  },
  postgres: {
    id: "postgres",
    title: "PostgreSQL",
    role: "Durable memory, split by schema ownership.",
    why: "Each service keeps its own schema: auth, agent, canvas, notification. Cross-service reads go through APIs, not shared tables. db-migrate runs the auth, canvas, and agent migrators once and exits; notification applies its embedded migrations at start.",
    privacy: "Encrypted keys sit in auth. Agent steps, approval requests, and action history sit in agent. Adminer is an operator window, not a product surface.",
    ports: "host :15432  ·  postgres_db:5432",
    facts: [
      "Schemas: auth · agent · canvas · notification",
      "agent_step · approval_request · action_history",
      "Adminer :8081 for operators",
    ],
  },
  clickhouse: {
    id: "clickhouse",
    title: "ClickHouse + OTel",
    role: "Operational logs, not the gradebook.",
    why: "Logs are high volume and short-lived. Services export OTLP logs to the collector; the collector batches and writes ClickHouse otel_logs over :9000 with a 336 h TTL. The pipeline is logs only. System Health reads it over the notification socket and admin routes.",
    privacy: "Application logs are for operators and are not action history. A 14-day TTL keeps them from becoming a second student record.",
    ports: "OTel :4317 / :4318  ·  ClickHouse :8123 / :9000",
    facts: [
      "otel_logs · TTL 336 h (14 days)",
      "Collector logs pipeline only",
      "Read by notification for /system-health",
    ],
  },
  volume: {
    id: "volume",
    title: "Documents volume",
    role: "Shared disk for rubric uploads and extracted documents.",
    why: "The agent API and the Celery worker must see the same upload. A named volume, agent_documents, mounted at /data/documents on both is the smallest correct answer.",
    privacy: "Uploaded rubrics can contain student performance language. They stay on the volume and pass through the extraction pipeline rather than being pasted whole into a prompt.",
    ports: "/data/documents on agent + worker",
    facts: [
      "Volume agent_documents → /data/documents",
      "Mounted on agentic and agentic-worker",
      "Not touched by TTLs or Redis flushes",
    ],
  },
  canvas: {
    id: "canvas",
    title: "Canvas LMS",
    role: "The institutional system of record.",
    why: "Conductor is not a second LMS. Every durable course change ends as a Canvas REST call made by the connector with the instructor’s own key, so Canvas permissions remain the source of truth.",
    privacy: "Student data leaves Canvas only as scoped tool results, then through the sanitizer before the model reasons about it.",
    facts: [
      "External network canvas-lms_default",
      "Connector calls REST · auth joins but does not call",
      "Instructor key scopes every request",
    ],
  },
  llm: {
    id: "llm",
    title: "Language model",
    role: "Proposes tools. Never executes Canvas writes on its own.",
    why: "The agent speaks to an OpenAI-compatible chat endpoint. If the instructor connected a key, that provider is used; otherwise the team default, with a configured fallback provider if it fails. The model gets a system prompt, sanitized history, and the tool catalog.",
    privacy: "The model is untrusted with writes and with raw PII. It never receives a Canvas key. Scope checks, HITL, and the sanitizer exist because a prompt is not a boundary an institution can audit.",
    facts: [
      "OpenAI-compatible HTTP client · no LiteLLM at this commit",
      "Per-user key via auth GetLlmDetails",
      "Never receives Canvas keys",
    ],
  },
  resend: {
    id: "resend",
    title: "Resend",
    role: "Outbound email delivery.",
    why: "Notification owns templates, preferences, and the queue; Resend is the delivery provider. Delivery reports come back to /webhooks/resend, where bounces and complaints can mark an address.",
    privacy: "Mail is built from explicit mail events, never from the session bus, so a HITL pause cannot become a bulk email of student names.",
    facts: [
      "Provider only; templates live in notification",
      "Triggered from mail channels, not session:*",
      "Webhooks → /webhooks/resend",
    ],
  },
  model_step: {
    id: "model_step",
    title: "Model step",
    role: "One turn of the ReAct loop.",
    why: "The orchestrator calls the model with the tool definitions and at most 24 recent messages. A final answer is recorded and the run stops. A tool call is ranked by policy.py before anything runs. After 16 turns the loop stops with MaxIterationsError.",
    privacy: "Earlier tool results in the message list are already sanitized.",
    facts: [
      "Final answer → record + stop",
      "Tool call → risk rank before execute",
      "agent_max_iterations = 16",
    ],
  },
  execute_now: {
    id: "execute_now",
    title: "Execute now",
    role: "Unambiguous read tools run immediately through mcp-canvas (local tools run in-process).",
    why: "Listing assignments or reading a course overview should not wake the instructor. policy.py marks these read_safe or read_sensitive. Local tools such as the calculator and extracted-assignment lookups run inside the agent; the rest go over gRPC to mcp-canvas.",
    privacy: "Even a read is sanitized before the next model turn, and the course-context filter keeps aggregates inside the instructor’s courses.",
    facts: [
      "Non-write tools only",
      "mcp-canvas gRPC → sanitize → back to model",
      "Course-context filter on results",
    ],
  },
  pause_hitl: {
    id: "pause_hitl",
    title: "Pause for a person",
    role: "Writes and ambiguous matches wait.",
    why: "Creating or changing Canvas objects, or choosing between several students, is where the risk is. The checkpoint service records the pause, the session waits for approval, and the pause is published on session:{id}:hitl. The desk finds it by polling pending approvals.",
    privacy: "Approval is the control a clever prompt cannot talk past. Reject records the outcome without calling Canvas; edit changes the payload before it runs.",
    facts: [
      "approval_request row · session awaits a person",
      "Published on session:{id}:hitl · desk polls approvals",
      "Approve / reject / edit before any Canvas write",
    ],
  },
};
