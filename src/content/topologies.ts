import type { FigureId } from "./manual";

/** Mermaid topologies that define node/edge layout for each plate. */
export const topologies: Record<FigureId, { title: string; mermaid: string }> = {
  FIG_001: {
    title: "Capstone stack",
    mermaid: `flowchart LR
  subgraph Client
    FE["Frontend :5173"]
  end
  subgraph Edge
    KONG["Kong :8000"]
  end
  subgraph Services
    AUTH["Auth :8002"]
    AGENT["Agentic :8003"]
    NOTIFY["Notify :8004"]
    MCP["mcp-canvas"]
    CONN["Connector"]
  end
  subgraph Memory
    REDIS[("Redis")]
    PG[("Postgres")]
    CH[("ClickHouse")]
    VOL["/data/documents"]
  end
  subgraph Outside
    LMS["Canvas"]
    LLM["LiteLLM"]
    MAIL["Resend"]
  end
  FE -->|HTTP| KONG
  FE -.->|WS| NOTIFY
  KONG --> AUTH & AGENT & NOTIFY & MCP & CONN
  AGENT --> MCP --> CONN --> LMS
  AGENT --> REDIS --> NOTIFY
  AGENT --> LLM
  NOTIFY --> MAIL
  AUTH --> PG
  AGENT --> PG & VOL`,
  },
  FIG_002: {
    title: "Two wires",
    mermaid: `flowchart LR
  FE["Browser :5173"]
  KONG["Kong :8000\\n5 /api routes"]
  NOTIFY["Notification :8004\\nsocket"]
  FE -->|HTTP| KONG
  FE -.->|WebSocket| NOTIFY`,
  },
  FIG_003: {
    title: "The desk",
    mermaid: `flowchart TB
  GUEST["GuestRoute\\n/  /login"]
  PROT["ProtectedRoute"]
  ONB["OnboardingGuard"]
  INST["InstructorRoute"]
  ADM["AdminRoute"]
  SET["/settings"]
  GUEST -.-> PROT
  PROT --> ONB
  ONB --> INST & ADM & SET`,
  },
  FIG_004: {
    title: "The door",
    mermaid: `flowchart TB
  KONG["Kong DB-less :8000\\nCORS + rate limit"]
  AUTH["/api/auth → authentication:8002\\nopen"]
  AGENT["/api/agent → agentic:8003\\nJWT"]
  NOTIFY["/api/notify → notification:8004\\nJWT"]
  CONN["/api/connector → connector:8005\\nJWT"]
  MCP["/api/canvas-tools → mcp-canvas:8100\\nJWT"]
  KONG --> AUTH & AGENT & NOTIFY & CONN & MCP`,
  },
  FIG_005: {
    title: "Who is asking",
    mermaid: `flowchart LR
  USER["User"] --> VERIFY["Auth verify :8002"]
  VERIFY --> PG[("Postgres auth")]
  VERIFY --> REDIS[("Redis blacklist")]
  VERIFY --> KONG["Kong JWT plugin\\nexp + iss"]
  VERIFY -.->|gRPC :50052| PEERS["Agent + Notify"]`,
  },
  FIG_006: {
    title: "The AI harness",
    mermaid: `flowchart TB
  MSG["Instructor message"] --> SCOPE["Scope guard"]
  SCOPE --> MODEL["LLM via LiteLLM"]
  MODEL -->|final answer| STOP["Record + stop"]
  MODEL -->|tool| POLICY{"requires_hitl?"}
  POLICY -->|no known read| RUN["Execute MCP\\nsanitize result"]
  POLICY -->|write or ambiguous| HITL["HITL pause\\nsession:id:hitl"]
  RUN --> MODEL
  HITL -->|yes| RUN
  HITL -->|no| MODEL`,
  },
  FIG_007: {
    title: "The corridor",
    mermaid: `flowchart LR
  LLM["Model"] --> AGENT["Agentic\\nHITL here"]
  AGENT -->|"gRPC :50056 mTLS"| MCP["mcp-canvas"]
  MCP -->|"gRPC :50055"| CONN["Connector"]
  CONN -->|REST 60s| LMS["Canvas LMS"]`,
  },
  FIG_008: {
    title: "The fan-out",
    mermaid: `flowchart TB
  AGENT["Agentic"] -->|session:*:steps/hitl| REDIS[("Redis")]
  REDIS --> NOTIFY["Notify socket :8004"]
  AUTH["Auth channels"] --> SUB["Email subscribers"]
  PROD["Digest channels"] --> SUB
  FORM["email.notification.requested"] --> SUB
  SUB --> WORK["Mail worker → Resend"]`,
  },
  FIG_009: {
    title: "Four memories",
    mermaid: `flowchart LR
  PG[("Postgres\\nauth agent canvas notification")]
  REDIS[("Redis losable")]
  CH[("ClickHouse\\notel_logs TTL 14d")]
  VOL["Volume\\n/data/documents"]
  OTEL["OTel collector"] --> CH
  ADM["Adminer"] --> PG`,
  },
  FIG_010: {
    title: "The course",
    mermaid: `timeline
  title Capstone weeks 2–13
  May 18 : Charter
  May 22 : DFDs + architecture
  May 29 : Compose stack
  Jun 5 : Canvas-only caller
  Jun 20 : Agent + HITL
  Jul 3 : Live assistant
  Jul 10 : Celery sessions
  Jul 17 : MCP tools
  Jul 24 : Mail room
  Aug 4 : Close-out`,
  },
  FIG_011: {
    title: "Branches into development",
    mermaid: `gitGraph
  commit id: "compose"
  branch auth
  commit id: "auth-login"
  checkout main
  merge auth
  branch agent
  commit id: "react-loop"
  checkout main
  merge agent
  branch mcp
  commit id: "mcp-pr1"
  commit id: "mcp-wire"
  checkout main
  merge mcp
  branch notify
  commit id: "mail-room"
  checkout main
  merge notify
  commit id: "PR-946"`,
  },
  FIG_012: {
    title: "Sentence to Canvas",
    mermaid: `flowchart LR
  S["Instructor sentence"] --> A["Agentic plan"]
  A --> H{"HITL pause\\nwrite tools"}
  H -->|approve| M["mcp-canvas"]
  H -->|deny / edit| A
  M --> C["Connector"]
  C --> LMS["Canvas REST"]`,
  },
};
