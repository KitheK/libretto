const REPO = "https://github.com/UBCO-COSC499-S2026/capstone-team-1/blob/development";

export type Source = { label: string; href: string };

export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "figure"; id: FigureId }
  | { type: "shot"; id: string }
  | { type: "walk" }
  | { type: "live"; route?: string }
  | { type: "motion"; id: string };

export type FigureId =
  | "FIG_001"
  | "FIG_002"
  | "FIG_003"
  | "FIG_004"
  | "FIG_005"
  | "FIG_006"
  | "FIG_007"
  | "FIG_008"
  | "FIG_009"
  | "FIG_010"
  | "FIG_011"
  | "FIG_012";

export type Chapter = {
  number: string;
  slug: string;
  part: string;
  title: string;
  standfirst: string;
  blocks: Block[];
  sources: Source[];
};

export type Part = { id: string; title: string; blurb: string };

export const parts: Part[] = [
  {
    id: "I",
    title: "Orientation",
    blurb: "Conductor’s promise: natural language into Canvas instructions, under institutional privacy.",
  },
  {
    id: "II",
    title: "Entry",
    blurb: "Who may ask, and how the edge refuses anyone else.",
  },
  {
    id: "III",
    title: "The work",
    blurb: "The AI harness, the tool corridor, and the wire that returns a reviewed result.",
  },
  {
    id: "IV",
    title: "The record",
    blurb: "What is allowed to vanish, and what is written down.",
  },
  {
    id: "V",
    title: "The course",
    blurb: "How the drawings became the stack, week by week.",
  },
];

export const chapters: Chapter[] = [
  {
    number: "01",
    slug: "01-shape",
    part: "I",
    title: "The shape of it",
    standfirst:
      "A sentence goes in, a Canvas change comes out. In the background we orchestrate the entire process so instructors get a safer way to work with course management platforms.",
    blocks: [
      {
        type: "p",
        text: "Conductor is an instructor assistant primarily designed for Canvas, the learning management system UBC runs its courses on. Libretto is named after the little book that stores opera and orchestra scores: a libretto is the book that goes with a score, and this is the book that goes with Conductor.",
      },
      {
        type: "p",
        text: "Conductor’s goal was taking natural instructions and converting them into Canvas actions through tool-calling inside the MCP microservice. Take a sentence such as “move the midterm to next week and tell the class.” Conductor’s job is to understand what the instructor wants (find when the midterm is, move it by a week, and announce why), then turn that into a set of Canvas API calls — without ever letting the language model become aware of student information.",
      },
      { type: "figure", id: "FIG_012" },
      {
        type: "p",
        text: "That is why Conductor is built as microservices. Identity, orchestration, tool execution, the Canvas service, live delivery and logging run as separate containers in [app/docker-compose.yaml](https://github.com/UBCO-COSC499-S2026/capstone-team-1/blob/development/app/docker-compose.yaml). Fourteen services start from that file. Docker DNS is the address book: services find each other as `authentication`, `agentic`, `connector` and `mcp-canvas`, not by IP. Health checks decide start order, so the migrator waits for Postgres and ClickHouse, and the services wait for the migrator.",
      },
      { type: "h2", text: "Why we went with a microservices split" },
      {
        type: "p",
        text: "One process that both talked to a model, held Canvas keys, and had access to session data would collect every privacy failure in a single place. The microservices architecture let us draw boundaries around that risk. The system also talks to many external tools, and separate services make those integrations easier to swap and review.",
      },
      {
        type: "p",
        text: "The authentication service is the vault: it holds each instructor’s Canvas URL and API key, and their model key, encrypted with AES-GCM. The agentic service is the harness that plans and decides when to stop and ask. mcp-canvas lists the tools and runs them. The connector (canvas-service) is the only code that sends REST requests to Canvas. Notification delivers live data and mail, and owns none of the agent’s memory.",
      },
      {
        type: "p",
        text: "Click the boxes on the home plate. Each one opens with the technical choice, the ports and the privacy rule behind it, and the arrows that touch it light up. The amber agent box is where natural language becomes a plan. The connector box is where that plan, once a person has agreed, becomes a Canvas REST call made with the instructor’s own key.",
      },
      { type: "h2", text: "Two wires, one door" },
      {
        type: "p",
        text: "The browser holds two kinds of connection, and both go through Kong on port 8000. HTTP calls use VITE_API_BASE_URL, which defaults to `http://localhost:8000/api`. WebSockets use VITE_WS_BASE_URL, which defaults to `ws://localhost:8000/api/notify`. Kong strips the prefix and passes the upgrade to the notification service. That service is also published directly on port 8004, but the page does not use that port in the default configuration. Earlier builds did; the change to route the socket through Kong landed shortly before the commit this book follows.",
      },
      { type: "figure", id: "FIG_002" },
      { type: "h2", text: "Canvas stays on its own network" },
      {
        type: "p",
        text: "Canvas LMS sits on an external Docker network, `canvas-lms_default`. Two Conductor containers join it: the connector and the authentication service. Only the connector makes Canvas REST calls. Every file that calls `/api/v1` is in its repository layer. Auth is on that network but does not call Canvas itself. When an instructor pastes a new key, auth asks the connector over gRPC (TestCanvasToken) to check it, then stores the normalized URL. The model process has no route to the LMS, and the browser never holds a Canvas key for agent work.",
      },
    ],
    sources: [
      { label: "app/docker-compose.yaml", href: `${REPO}/app/docker-compose.yaml` },
      { label: "app/frontend/src/utils/gatewayUrls.ts", href: `${REPO}/app/frontend/src/utils/gatewayUrls.ts` },
      {
        label: "infrastructure/api_gateway/config/kong.yaml.template",
        href: `${REPO}/app/infrastructure/api_gateway/config/kong.yaml.template`,
      },
    ],
  },
  {
    number: "02",
    slug: "02-desk",
    part: "I",
    title: "The instructor's desk",
    standfirst:
      "The frontend is the room the instructor sees. The rest of the building is behind one door, and the room keeps very little.",
    blocks: [
      {
        type: "p",
        text: "Conductor’s desk is a Vite React application. In the compose stack it is published on port 5173 and runs with npm run dev. It has pages for login, onboarding, the dashboard, courses with their assignments and rubrics, the grading queue, the AI assistant, and Action History, the record of what the assistant has already done. The screenshots below come from the development branch at the merge of PR #946, running on a rebuilt docker compose stack with the e2e instructor and admin accounts.",
      },
      { type: "h2", text: "A walk through the desk" },
      {
        type: "p",
        text: "An instructor’s path is short. Sign in, connect Canvas and a model key, read the dashboard, ask in ordinary language, approve any write, then check Action History. Admins use user management and System Health instead. The walkthrough follows the live pages, and the architecture plate under it shows how those pages connect.",
      },
      { type: "walk" },
      { type: "h2", text: "Try the desk itself" },
      {
        type: "p",
        text: "The plate below is not a mock-up. It is Conductor’s frontend from the development branch, built unchanged and running inside this page. A small mock backend answers its calls to Kong, so the courses, students and agent replies are invented. Every component, route guard and animation is the shipped one. Try switching it between light and dark: the Libretto switch presses Conductor’s own ThemeToggle, which puts the dark class on the document and saves the choice under `canvas-ai-theme`.",
      },
      { type: "live", route: "/dashboard" },
      { type: "motion", id: "theme-toggle" },
      { type: "motion", id: "desk-tour" },
      {
        type: "p",
        text: "Here is the same build, captured page by page with a Canvas key connected. Each screenshot has a dark twin; switch between them under the image.",
      },
      { type: "shot", id: "live-courses" },
      { type: "shot", id: "live-course" },
      { type: "shot", id: "live-grading" },
      { type: "shot", id: "live-settings" },
      {
        type: "p",
        text: "These earlier captures come from the full compose stack with the e2e accounts, taken before a Canvas key was connected.",
      },
      { type: "shot", id: "courses" },
      { type: "shot", id: "settings" },
      { type: "shot", id: "users" },
      { type: "h2", text: "Who may open which room" },
      {
        type: "p",
        text: "Routes in [App.tsx](https://github.com/UBCO-COSC499-S2026/capstone-team-1/blob/development/app/frontend/src/App.tsx) sit inside nested guards. GuestRoute covers `/` and `/login`, both of which show the login page. ProtectedRoute needs a session. Inside it, OnboardingGuard sends a user whose account is not yet marked onboarding_completed to `/onboarding`. Instructors may still open the Canvas and model key pages while onboarding. InstructorRoute covers the dashboard, the grading queue, courses with their assignments and rubrics, the AI assistant, Action History, and the two key-connection pages. AdminRoute covers System Health and user management. Settings needs only a signed-in user.",
      },
      { type: "figure", id: "FIG_003" },
      { type: "h2", text: "What the page is willing to hold" },
      {
        type: "p",
        text: "The page keeps only what the instructor can see: the conversation on screen, the chosen course, and the approval card in front of them. Course pages ask the connector for data through `/api/connector`. The assistant asks the agent through `/api/agent`. While a session runs, the assistant page checks the session and the list of pending approvals about every two and a half seconds. It does not listen on a socket for that progress. Canvas and model keys are entered on their own pages, sent to auth once, and never read back in plain text.",
      },
    ],
    sources: [
      { label: "app/frontend/src/App.tsx", href: `${REPO}/app/frontend/src/App.tsx` },
      {
        label: "app/frontend/src/hooks/useAgentConversation.ts",
        href: `${REPO}/app/frontend/src/hooks/useAgentConversation.ts`,
      },
      { label: "app/frontend/README.md", href: `${REPO}/app/frontend/README.md` },
    ],
  },
  {
    number: "03",
    slug: "03-door",
    part: "II",
    title: "The door",
    standfirst:
      "Every call from the desk, HTTP or WebSocket, arrives at one proxy, and that proxy keeps no database of its own.",
    blocks: [
      {
        type: "p",
        text: "Kong is the API gateway. The compose service is kong-gateway. It listens on 0.0.0.0:8000 inside the container and publishes port 8000 on the host. KONG_DATABASE is off, so Kong runs DB-less. The route table is a declarative file, `kong.yaml.template`. At container start, envsubst fills in the JWT signing secret. The table is not stored as rows in a database.",
      },
      {
        type: "p",
        text: "There are five routes. `/api/auth` goes to authentication:8002 with no token check, because someone logging in has no token yet. `/api/agent`, `/api/connector` and `/api/canvas-tools` go to agentic:8003, connector:8005 and mcp-canvas:8100. Each of those three runs Kong’s JWT plugin: it verifies the signature against the auth-service consumer, finds the key through the iss claim, and checks exp. `/api/notify` goes to notification:8004 with the prefix stripped and no Kong JWT. Browsers cannot set headers on a WebSocket, so the notification service checks the token itself, from a Bearer header or a `?token=` query parameter.",
      },
      { type: "figure", id: "FIG_004" },
      { type: "h2", text: "Limits at the edge" },
      {
        type: "p",
        text: "Two global plugins apply to every route. CORS allows the desk’s origin, `http://localhost:5173`, with credentials and the Authorization header. Rate limiting allows 500 requests a second and 50,000 an hour, counted in Kong’s own memory (policy local). A runaway assistant tab hits that limit before it reaches auth or the connector. The connector has its own back-off for Canvas’s rate limits, covered in chapter 06.",
      },
      { type: "h2", text: "The same door on every engine" },
      {
        type: "p",
        text: "Docker Desktop resolves host.docker.internal by itself. The Linux engine used by GitHub Actions does not, so the compose file adds that name as an extra host mapped to the host gateway. The routes themselves point at compose service names, not host.docker.internal. A comment in the template explains why: going out to the host and back in caused intermittent connection resets.",
      },
    ],
    sources: [
      {
        label: "infrastructure/api_gateway/config/kong.yaml.template",
        href: `${REPO}/app/infrastructure/api_gateway/config/kong.yaml.template`,
      },
      { label: "app/docker-compose.yaml", href: `${REPO}/app/docker-compose.yaml` },
    ],
  },
  {
    number: "04",
    slug: "04-asking",
    part: "II",
    title: "Who is asking",
    standfirst: "Identity has one owner. The other services ask it, then get on with their own work.",
    blocks: [
      {
        type: "p",
        text: "The authentication service is a FastAPI app. It publishes HTTP on port 8002 and gRPC on port 50052. Its HTTP routes handle login, register, refresh and logout. They also connect and disconnect a Canvas instance or a model key, manage users, and issue MCP keys for outside tools. Its tables are users, Canvas integrations, LLM integrations and MCP API keys, in its own Postgres schema.",
      },
      {
        type: "p",
        text: "Two kinds of secret live here, and neither is an OAuth token. A Canvas integration is a Canvas URL plus a Canvas API key the instructor pasted in. An LLM integration is a provider key with its base URL and model. Both are encrypted with AES-GCM before they are written (`core/security.py`). They are decrypted only when a peer asks over gRPC: the connector calls GetCanvasDetails, and the agent calls GetLlmDetails.",
      },
      { type: "figure", id: "FIG_005" },
      { type: "h2", text: "One verifier, many callers" },
      {
        type: "p",
        text: "Other services do not trust a token just because it arrives. Kong checks the signature and expiry on three of its routes. Behind it, the notification service and mcp-canvas call auth’s VerifyToken over gRPC before they serve a socket or run a tool. Logout writes the token’s jti to a Redis blacklist, so a signed-out token stops working before it expires. When TLS is on, these gRPC calls use mutual TLS. The certificates come from [shared/certs/generate-certs.sh](https://github.com/UBCO-COSC499-S2026/capstone-team-1/blob/development/app/shared/certs/generate-certs.sh) and are mounted read-only.",
      },
      { type: "h2", text: "A token is not a Canvas session" },
      {
        type: "p",
        text: "The JWT tells Conductor who is calling. The Canvas key is what the connector later shows Canvas. Auth keeps both and edits no courses. Auth also refuses to swap an instructor’s model key while one of their agent sessions is running. It asks the agent over gRPC on port 50057 first, so a session never changes provider halfway through a thought.",
      },
    ],
    sources: [
      { label: "app/services/auth-service/README.md", href: `${REPO}/app/services/auth-service/README.md` },
      {
        label: "app/services/auth-service/app/core/security.py",
        href: `${REPO}/app/services/auth-service/app/core/security.py`,
      },
      { label: "app/docker-compose.yaml", href: `${REPO}/app/docker-compose.yaml` },
    ],
  },
  {
    number: "05",
    slug: "05-loop",
    part: "III",
    title: "The AI harness",
    standfirst:
      "A ReAct loop, a scope guard, a sanitizer, and a pause before every write. The harness is what keeps it safe, not the model.",
    blocks: [
      {
        type: "p",
        text: "The agentic service is where natural language becomes a plan. It is FastAPI on port 8003, with a gRPC server on 50057 for action history. AgentOrchestrator.run_until_pause runs a ReAct loop. The model gets the system prompt, the conversation and the tool catalog. It answers or asks for tools. The harness records each step, runs or holds the tools, and goes round again. It stops after `agent_max_iterations` turns (16 by default), and it keeps at most the last 24 messages in context.",
      },
      {
        type: "p",
        text: "The model sits behind a small provider interface, not LiteLLM. For each run, a resolving provider asks auth for the instructor’s own key over gRPC. If one is connected, the agent talks to that OpenAI-compatible endpoint directly over HTTPS. If not, it uses the team’s default endpoint, with a configured fallback provider if that fails. You can swap the model; the harness stays the same. Approval, risk policy and privacy filters live in the harness, so changing provider cannot remove them.",
      },
      {
        type: "p",
        text: "Before any tool runs, scope_guard checks the instructor’s message. First comes a fixed set of injection patterns, such as a fake closing `</system>` tag or “ignore previous instructions”. These need no model call and are refused outright. Then a model classifier asks whether the request can be done with the Canvas tool catalog at all; if not, it gets a polite off-topic refusal. Only after that does policy.py rank each requested tool as read_safe, read_sensitive or write. requires_hitl is true exactly when the rank is write.",
      },
      { type: "h2", text: "What the model is allowed to see" },
      {
        type: "p",
        text: "Privacy fails if a roster comes back from Canvas and gets pasted into the next prompt. The sanitizer, `tools/sanitizer.py`, has a list of sensitive tools, such as roster, submissions, grades and analytics. For those tools it removes personal fields from the results before they go back into the model’s history. The fields are name, user_name, display_name, sortable_name, short_name, email, sis_user_id and every grader field. A separate filter drops rows from courses outside the instructor’s current course context. What the model remembers of the chat has already been redacted.",
      },
      {
        type: "p",
        text: "When several courses or students match, the harness pauses for a person to choose, even on a read. Ambiguity is treated like risk. Every step (model reasoning, tool call, tool result, pause, outcome) goes to the agent_step table in Postgres through the checkpoint service. The live conversation sits in Redis with a one-hour TTL and may disappear. If it does, the session is rebuilt from the Postgres transcript.",
      },
      { type: "figure", id: "FIG_006" },
      { type: "h2", text: "The loop, as the instructor sees it" },
      {
        type: "p",
        text: "On the desk the loop looks quieter than the plate. While the session runs, the AI Assistant shows one shimmering line, “Agent is thinking …”, and polls the agent for the latest step. When the turn ends, the tools it used collapse into a stack of icons above the answer; open the stack to see each call with its status. The recordings below are the real frontend running against the mock backend, so the tool names are real and the data is not.",
      },
      { type: "motion", id: "agent-think" },
      {
        type: "p",
        text: "A write stops the loop. create_announcement is a write tool, so the agent drafts the announcement and pauses for HITL (human-in-the-loop) review. The review panel says nothing will change in Canvas until the instructor approves. The tool record turns Approved only after the instructor clicks Send Announcement.",
      },
      { type: "motion", id: "agent-review" },
      { type: "motion", id: "assistant-greeting" },
      { type: "h2", text: "Why Celery sits beside the loop" },
      {
        type: "p",
        text: "agentic-worker runs the same image under Celery with a concurrency of 2. The broker and result backend are Redis databases 1 and 2. The HTTP handler queues a run (`run_agent_session.delay`) and returns. The session then runs in the worker, so refreshing the browser cannot kill the orchestrator halfway through a tool. Both containers mount /data/documents, where uploaded rubrics and extracted assignments live. As each step is recorded, the checkpoint service also publishes it on Redis, as `session:{id}:steps` and `session:{id}:hitl`. Chapter 07 follows those messages and explains why this build’s desk does not wait for them.",
      },
    ],
    sources: [
      {
        label: "app/services/agentic-service/app/agent/orchestrator.py",
        href: `${REPO}/app/services/agentic-service/app/agent/orchestrator.py`,
      },
      {
        label: "app/services/agentic-service/app/tools/policy.py",
        href: `${REPO}/app/services/agentic-service/app/tools/policy.py`,
      },
      {
        label: "app/services/agentic-service/app/tools/sanitizer.py",
        href: `${REPO}/app/services/agentic-service/app/tools/sanitizer.py`,
      },
      {
        label: "app/services/agentic-service/app/agent/scope_guard.py",
        href: `${REPO}/app/services/agentic-service/app/agent/scope_guard.py`,
      },
      {
        label: "app/services/agentic-service/app/llm/resolving.py",
        href: `${REPO}/app/services/agentic-service/app/llm/resolving.py`,
      },
    ],
  },
  {
    number: "06",
    slug: "06-canvas",
    part: "III",
    title: "The only hand on Canvas",
    standfirst:
      "The model proposes. mcp-canvas lists and runs the tools. Only the connector speaks REST to the LMS.",
    blocks: [
      {
        type: "p",
        text: "Early builds had the agent call canvas-service tools over gRPC directly. The team then added a Dockerized MCP server, so the tool catalog became a clear, swappable layer. mcp-canvas exposes one tool core in two ways. The agent reaches it over internal gRPC, `McpToolService` (ListTools and CallTool), on port 50056. Those calls use mutual TLS and an internal service key, and CallTool also needs the instructor’s access JWT, which sets auth_user_id. The second way is Streamable HTTP at `/mcp` on port 8100, which Kong exposes as `/api/canvas-tools`. That door is for outside MCP hosts, such as a desktop assistant the instructor already uses. They connect with a key issued from the desk’s MCP settings.",
      },
      {
        type: "p",
        text: "mcp-canvas never calls Canvas over HTTP; that rule keeps the model away from Canvas. Its only upstream is the connector’s gRPC service on port 50055. The connector (canvas-service, HTTP 8005) asks auth for the instructor’s Canvas URL and key with GetCanvasDetails and caches the answer for 60 seconds. It then makes the REST call itself, with a 60-second request timeout. It retries a 429 and honours Canvas’s Retry-After header. Writes carry an idempotency key, so a retried request does not create the same thing twice.",
      },
      { type: "figure", id: "FIG_007" },
      { type: "h2", text: "Where the model stops" },
      {
        type: "p",
        text: "A language model holding a Canvas key would act inside the LMS with no audit trail. This stack never gives it one. The model asks for a tool by name. The agent decides whether HITL is needed and holds the call until a person agrees. mcp-canvas runs the tool, and the connector presents the instructor’s key. Canvas permissions still decide what that instructor may change.",
      },
      { type: "h2", text: "The outside door is recorded, not paused" },
      {
        type: "p",
        text: "HITL belongs to Conductor’s own assistant. When an outside MCP host calls a tool through `/api/canvas-tools`, mcp-canvas checks the token with auth and runs the tool. It then sends a record to the agent’s action-history gRPC service, marked confirmed or failed, with the IDs it touched. So the instructor’s Action History shows outside calls too, but the approval step is the outside host’s job, not Conductor’s.",
      },
    ],
    sources: [
      { label: "app/services/mcp-canvas-service/README.md", href: `${REPO}/app/services/mcp-canvas-service/README.md` },
      {
        label: "app/services/mcp-canvas-service/app/http/mcp_asgi.py",
        href: `${REPO}/app/services/mcp-canvas-service/app/http/mcp_asgi.py`,
      },
      {
        label: "app/services/canvas-service/app/repository/base.py",
        href: `${REPO}/app/services/canvas-service/app/repository/base.py`,
      },
    ],
  },
  {
    number: "07",
    slug: "07-wire",
    part: "III",
    title: "The live wire",
    standfirst:
      "The agent publishes. Redis carries. Notification can forward it to a socket, but in this build the desk polls and uses the socket for logs.",
    blocks: [
      {
        type: "p",
        text: "The notification service is written in Go and listens on port 8004. When it starts, a Redis subscriber pattern-subscribes to `session:*:steps` and `session:*:hitl`. A browser can open `/ws`, which Kong serves at `/api/notify/ws`, and send a `subscribe_session` message for a session ID. From then on, the service forwards that session’s step and HITL events down the socket. Every socket checks its token with auth’s VerifyToken first.",
      },
      {
        type: "p",
        text: "In this build the desk does not use that path. The frontend has a hook for it, useAgentWebSocket, but the hook defaults to disabled. The assistant page instead polls `/api/agent/sessions/{id}` and the pending-approvals list about every 2.5 seconds, and builds the shimmer, the tool stack and the approval card from those answers. The Redis events are still published and the socket can still forward them. They are simply not what the instructor is watching today. If the hook is turned on later, nothing else in the system needs to change.",
      },
      { type: "h2", text: "What the socket does carry" },
      {
        type: "p",
        text: "The socket the desk really holds belongs to System Health. When an admin opens it, the page connects to `/ws?token=…` with log filters. The service then polls ClickHouse and streams matching rows from otel_logs. A second socket, `/ws/health`, sends service-health snapshots every two seconds: Kong, auth, connector, agent and mcp-canvas over HTTP, plus checks on ClickHouse, Postgres, Redis and the frontend. Plain HTTP admin routes on the same process give log health, a log time series, per-user activity logs and service health.",
      },
      { type: "figure", id: "FIG_008" },
      { type: "h2", text: "The mail room" },
      {
        type: "p",
        text: "The same process is also the mail room, on separate Redis channels. One subscriber takes ready-made requests on email.notification.requested. A second turns auth events, such as verification and password reset, into transactional mail. A third handles reminder and digest channels and applies their rules before anything is queued. A worker takes jobs from the queue, renders them and sends them through Resend. Delivery reports come back to `/webhooks/resend`, where a bounce or complaint can mark an address. Health and counters for that path are at `/admin/email/health` and `/admin/email/metrics`. Live events and mail never share a channel, so a HITL pause cannot turn into an email.",
      },
    ],
    sources: [
      { label: "notification-service/cmd/main.go", href: `${REPO}/app/services/notification-service/cmd/main.go` },
      {
        label: "notification-service/internal/pubsub/redis.go",
        href: `${REPO}/app/services/notification-service/internal/pubsub/redis.go`,
      },
      {
        label: "app/frontend/src/hooks/useAgentWebSocket.ts",
        href: `${REPO}/app/frontend/src/hooks/useAgentWebSocket.ts`,
      },
      {
        label: "app/frontend/src/hooks/useLoggingWebSocket.ts",
        href: `${REPO}/app/frontend/src/hooks/useLoggingWebSocket.ts`,
      },
    ],
  },
  {
    number: "08",
    slug: "08-kept",
    part: "IV",
    title: "What is kept",
    standfirst: "Four memories, each with its own rules for forgetting.",
    blocks: [
      {
        type: "p",
        text: "Postgres 16 is the durable store. It is published on the host as port 15432 and reached inside the network as postgres_db. Each service owns its schema. Auth holds users and encrypted integrations. The agent holds sessions, steps, approval requests, action history, memory, chat logs, documents and message drafts. The connector has a schema of its own. A one-shot container, db-migrate, waits until Postgres and ClickHouse are healthy, runs the auth, canvas and agent migrations, and exits. Notification applies its own embedded migrations when it starts. Adminer, on port 8081, is an operator’s window onto Postgres, not a product page.",
      },
      {
        type: "p",
        text: "Redis, the alpine image on port 6379, is short-term memory. Database 0 holds the agent’s conversation cache, its HITL queue, the JWT blacklist and the pub/sub channels. Databases 1 and 2 are Celery’s broker and result store. Treat all of it as losable. Anything that must survive a restart is checkpointed in Postgres.",
      },
      { type: "figure", id: "FIG_009" },
      { type: "h2", text: "Logs take a different road" },
      {
        type: "p",
        text: "ClickHouse stores logs. Each Python service sets up an OpenTelemetry log exporter that sends OTLP to the collector on 4317 over gRPC; the collector also accepts HTTP on 4318. The collector batches the records and writes them over the native port 9000 to the ClickHouse table otel_logs. The collector config sets a TTL of 336 hours, so logs are purged after 14 days. That file defines a logs pipeline only, with no traces and no metrics. Admins read the result on the System Health page.",
      },
      {
        type: "p",
        text: "Agent documents are the fourth memory: the agent_documents volume, mounted at /data/documents on both the agent and the Celery worker. Rubric uploads and the extraction pipeline’s files live there. A file is not a log line or a session row, so neither a TTL nor a Redis flush will remove it. It stays on the volume until something deletes it.",
      },
    ],
    sources: [
      { label: "app/docker-compose.yaml", href: `${REPO}/app/docker-compose.yaml` },
      {
        label: "infrastructure/otel/config/otel-collector-config.yaml",
        href: `${REPO}/app/infrastructure/otel/config/otel-collector-config.yaml`,
      },
      {
        label: "app/services/agentic-service/app/core/config.py",
        href: `${REPO}/app/services/agentic-service/app/core/config.py`,
      },
    ],
  },
  {
    number: "09",
    slug: "09-road",
    part: "V",
    title: "How it turned",
    standfirst:
      "The team logs run from a charter in May to a close-out in August. Three of those weeks changed the shape.",
    blocks: [
      {
        type: "p",
        text: "Week 2, opening May 18, is the charter and the project plan, and the board fills with stories. Week 3, May 22, is still on paper: the level-0 context diagram, the level-1 flows, the component diagram, the entity diagram and a design pattern. The system architecture written that week is the drawing the first plate still follows. Services sit behind a gateway, Redis is the bus, and one integration service may call Canvas. For most of the build, the live socket was the one exception to that drawing and skipped the gateway. The development commit this book follows routes it through Kong as well.",
      },
      {
        type: "p",
        text: "Week 4, May 29, is the move from paper to containers. The frontend, Kong, Redis and Postgres come up under Compose, and the auth, agent, notification and Canvas services get scaffolds. Week 5, June 5, fills in the Canvas service: a repository, a facade, a Redis and gRPC path for the agent, and read-only REST. Auth can log someone in, and the login page and the Canvas token page exist. Week 6, June 12, joins the two: auth checks a user’s Canvas key through the Canvas service, and Kong gains its CORS and JWT checks.",
      },
      { type: "h2", text: "The agent, then the real page" },
      {
        type: "p",
        text: "Week 7, June 20, is when the agent arrives. The early architecture had sketched a separate HITL service and a history service. What actually merged is a ReAct loop inside the agentic service, with approval and action history kept there. Canvas gains a messaging foundation, and user management gets its API. Week 8, June 29, connects the pages that had been showing mock data to those live APIs, and the agent stack lands on development. Week 9, July 3, is when the assistant stops being a mock. Sessions can be read and continued, a course can be disambiguated, and the chat page talks to the agent.",
      },
      { type: "figure", id: "FIG_010" },
      { type: "h2", text: "Branches into development" },
      {
        type: "p",
        text: "The week log is one story. The GitHub history is another: each feature leaves `development` on its own branch, gathers commits, and returns as a pull request. The plate below is a visual exercise — not every push, but the waves that changed the shape. Early nodes follow the team logs. From Celery onward the labels are real merges into `development` on [capstone-team-1](https://github.com/UBCO-COSC499-S2026/capstone-team-1), ending at PR #946.",
      },
      { type: "figure", id: "FIG_011" },
      { type: "h2", text: "Three turns, then the close" },
      {
        type: "p",
        text: "Week 10, July 10, moves the session off the request process and onto a Celery worker. The same week, the team starts splitting the MCP server and a LiteLLM gateway into separate, reviewable pull requests, and dashboard work turns to caching. Week 11, July 17, is the tool-path turn. The agent stops calling the Canvas service for every tool, and a Dockerized MCP server sits between them. A rubric can be uploaded and turned into a draft, scope_guard refuses work that is not a course task, and multi-turn chats survive a Redis expiry because the checkpoint is in Postgres. The model gateway did not last. By the development commit this book follows there is no LiteLLM in the agent, only an OpenAI-compatible client with per-user keys and a fallback.",
      },
      {
        type: "p",
        text: "Week 12, July 24, brings peer testing and the mail turn. Until then, notification had been a socket and nothing else. It gains a second set of Redis channels, a worker and Resend, for verification, password reset, reminders and digests. The same week adds files on assignments, bulk messages, announcements and a live System Health page. Week 13, August 4, is the close. Grading with rubrics, quick actions, instructors’ own model keys and the last peer-testing fixes land, and the charter is updated. The logs end there. The socket’s move behind Kong, PR #946, came after them.",
      },
    ],
    sources: [
      {
        label: "docs/design/System Architecture/SystemArchitecture.md",
        href: "https://github.com/UBCO-COSC499-S2026/capstone-team-1/blob/Documents/docs/design/System%20Architecture/SystemArchitecture.md",
      },
      {
        label: "docs/weekly logs/team_logs",
        href: "https://github.com/UBCO-COSC499-S2026/capstone-team-1/tree/Documents/docs/weekly%20logs/team_logs",
      },
      {
        label: "Merged pull requests into development",
        href: "https://github.com/UBCO-COSC499-S2026/capstone-team-1/pulls?q=is%3Apr+is%3Amerged+base%3Adevelopment",
      },
    ],
  },
];

export const homeFigure: FigureId = "FIG_001";

export const faqs: { question: string; answer: string }[] = [
  {
    question: "Is this Conductor?",
    answer:
      "No. Libretto is the manual. Conductor is the safe Canvas management platform, the compose stack in UBCO-COSC499-S2026/capstone-team-1. The live desk embedded here runs against a mock backend: nothing on these pages changes a course or shows a real roster.",
  },
  {
    question: "Why is the guide called Libretto?",
    answer:
      "The platform is Conductor. A libretto is the text that goes with a musical score; this book is the text that goes with Conductor’s architecture and desk.",
  },
  {
    question: "Why not give the model a Canvas key?",
    answer:
      "A model with a key would act inside the LMS with no audit trail. The harness proposes tools and holds writes for a person. The connector fetches the instructor’s encrypted Canvas key from auth over gRPC and is the only process that makes the REST call.",
  },
  {
    question: "How is student data kept out of prompts?",
    answer:
      "The sanitizer removes names, emails, SIS IDs and grader identity from sensitive tool results before they go back into the model’s history, and a course-context filter drops rows from other courses. scope_guard refuses injection and off-topic prompts. Every write waits for HITL approval.",
  },
  {
    question: "Who agrees to a Canvas write?",
    answer:
      "The instructor. When policy.py ranks a tool as write, or several matches need a choice, the agentic service pauses, records the pause, and shows it as a pending approval. Calls from outside MCP hosts are recorded in Action History but are not paused by Conductor.",
  },
  {
    question: "Does the assistant stream over a WebSocket?",
    answer:
      "Not in this build. The agent publishes step and HITL events on Redis, and notification can forward them over /api/notify/ws, but the desk polls the agent about every 2.5 seconds. The socket it does use carries System Health logs and service health.",
  },
  {
    question: "What if Redis disappears?",
    answer:
      "The conversation cache, the JWT blacklist, Celery’s queue and the event bus are short-term memory. Finished steps are checkpointed to Postgres, and a session can be rebuilt from that transcript.",
  },
  {
    question: "Where do the logs go?",
    answer:
      "Services send OTLP logs to the collector on port 4317 (it also accepts 4318). The collector writes them to the ClickHouse table otel_logs and drops them after 14 days. Admins read that record on System Health.",
  },
];

function plain(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*`]/g, "");
}

export function wordCount(chapter: Chapter): number {
  const chunks = [chapter.standfirst];
  for (const block of chapter.blocks) {
    if (block.type === "p" || block.type === "h2") {
      chunks.push(block.text);
    }
  }
  return plain(chunks.join(" "))
    .split(/\s+/)
    .filter(Boolean).length;
}

export function totalWords(): number {
  return chapters.reduce((sum, chapter) => sum + wordCount(chapter), 0);
}

export function chapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.slug === slug);
}
