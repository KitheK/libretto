import type { ReactNode } from "react";
import { branchMerges, laneMeta, type BranchLane } from "../content/branches";
import type { FigureId } from "../content/manual";
import { playClick } from "../lib/clickSound";
import { ApiAccordion } from "./ApiAccordion";
import { DeskMap } from "./DeskMap";
import { Flow } from "./flow";
import { InteractivePlate } from "./InteractivePlate";
import { Arrow, Band, BLUE, Box, Diagram, Legend, Oval, PAPER, Path, Store, T, VBand, WASH, tones } from "./kit";

export type PlateSpec = {
  id: FigureId;
  name: string;
  caption: string;
  canvas: ReactNode;
};

function Frame({
  x,
  y,
  w,
  h,
  title,
  dashed = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  dashed?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={dashed ? "none" : WASH}
        stroke={BLUE}
        strokeWidth="1.25"
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <T x={x + 10} y={y + 18} fill={BLUE}>
        {title}
      </T>
    </g>
  );
}

/** FIG_001 — system architecture; arrows follow the capstone architecture diagram */
function Assembly() {
  const bandY = 56;
  const bandH = 320;
  const fe = { x: 36, y: 188, w: 124, h: 72 };
  const kong = { x: 230, y: 180, w: 120, h: 88 };
  const svcX = 420;
  const svcW = 124;
  const svcH = 52;
  const svcRight = svcX + svcW;
  const frameRight = 604;
  const services = [
    { id: "auth", title: "AUTH", line: "(identity)", tone: "service" as const },
    { id: "notify", title: "NOTIFY", line: "(notification)", tone: "service" as const },
    { id: "mcp", title: "MCP", line: "(MCP tools)", tone: "service" as const },
    { id: "connector", title: "CANVAS SVC", line: "(LMS)", tone: "service" as const },
    { id: "agent", title: "AGENTIC", line: "(orchestration)", tone: "agent" as const },
  ].map((svc, index) => ({ ...svc, y: 64 + index * 62 }));
  const [auth, notify, mcp, connector, agent] = services;
  const mid = (box: { y: number; h?: number }) => box.y + (box.h ?? svcH) / 2;

  const memX = 650;
  const memW = 120;
  const bus = { x: memX, y: 66, w: memW, h: 64 };
  const redisDb = { x: memX, y: 142, w: memW, h: 64 };
  const pg = { x: memX, y: 218, w: memW, h: 64 };
  const outX = 858;
  const outW = 100;
  const lms = { x: outX, y: connector.y, w: outW, h: svcH };
  const llm = { x: outX, y: agent.y, w: outW, h: svcH };
  const obsY = 416;
  const otel = { x: 424, y: obsY + 8, w: 116, h: 48 };
  const ch = { x: 600, y: obsY, w: 124, h: 64 };

  const spine = 386;
  const storeTrunk = 624;

  return (
    <InteractivePlate id="FIG_001" defaultPart="agent" hint="Click a service for ports, privacy, and why it exists.">
      {({ pick, selected }) => (
        <Diagram
          label="System architecture. The web client talks to Kong, Kong fronts the five services, the services share Postgres and the Redis event bus, the Canvas service calls the Canvas LMS API, the agentic service calls an OpenAI-compatible model API, and logs go through the OTel collector to ClickHouse."
          viewBox="0 0 960 500"
        >
          <Legend
            x={210}
            y={12}
            items={[
              { tone: "client", label: "client" },
              { tone: "edge", label: "edge" },
              { tone: "service", label: "service" },
              { tone: "agent", label: "agent" },
              { tone: "store", label: "store" },
              { tone: "outside", label: "outside" },
            ]}
          />

          <rect x={30} y={bandY} width={136} height={bandH} fill={tones.client.fill} opacity="0.22" />
          <rect x={224} y={bandY} width={132} height={bandH} fill={tones.edge.fill} opacity="0.2" />
          <rect x={414} y={bandY} width={frameRight - 414} height={bandH} fill={tones.service.fill} opacity="0.16" />
          <rect x={410} y={bandY} width={frameRight - 410} height={bandH} fill="none" stroke={BLUE} strokeWidth="1.25" />
          <rect x={644} y={bandY} width={132} height={bandH} fill={tones.store.fill} opacity="0.2" />
          <rect x={640} y={bandY} width={140} height={bandH} fill="none" stroke={BLUE} strokeWidth="1.25" />
          <rect x={854} y={bandY} width={106} height={bandH} fill={tones.outside.fill} opacity="0.26" />
          <rect x={414} y={obsY - 16} width={320} height={92} fill={tones.store.fill} opacity="0.14" />
          <T x={414} y={obsY - 22 + 2} fill={BLUE}>
            OBSERVABILITY
          </T>

          <VBand x={8} y={bandY} h={bandH} name="CLIENT" tone="client" />
          <Box x={fe.x} y={fe.y} w={fe.w} h={fe.h} title="FRONTEND" lines={["(web app)"]} tone="client" icon="frontend" partId="frontend" selected={selected("frontend")} onSelect={pick} />

          <VBand x={200} y={bandY} h={bandH} name="EDGE" tone="edge" />
          <Box x={kong.x} y={kong.y} w={kong.w} h={kong.h} title="KONG" lines={["(gateway +", "proxy)"]} tone="edge" icon="kong" partId="kong" selected={selected("kong")} onSelect={pick} />

          <T x={410} y={bandY - 6} fill={BLUE}>
            MICROSERVICES
          </T>
          {services.map((svc) => (
            <Box key={svc.id} x={svcX} y={svc.y} w={svcW} h={svcH} title={svc.title} lines={[svc.line]} tone={svc.tone} icon={svc.id} partId={svc.id} selected={selected(svc.id)} onSelect={pick} />
          ))}

          <T x={640} y={bandY - 6} fill={BLUE}>
            STORES · BUS
          </T>
          <Store x={bus.x} y={bus.y} w={bus.w} h={bus.h} title="REDIS" lines={["(pub/sub bus)"]} tone="bus" icon="redis" partId="redis" selected={selected("redis")} onSelect={pick} />
          <Store x={redisDb.x} y={redisDb.y} w={redisDb.w} h={redisDb.h} title="REDISDB" lines={["(data)"]} tone="bus" icon="redis" partId="redis" selected={selected("redis")} onSelect={pick} />
          <Store x={pg.x} y={pg.y} w={pg.w} h={pg.h} title="POSTGRES" lines={["(persistence)"]} tone="store" icon="postgres" partId="postgres" selected={selected("postgres")} onSelect={pick} />

          <VBand x={832} y={bandY} h={bandH} name="EXTERNAL" tone="outside" />
          <Box x={lms.x} y={lms.y} w={lms.w} h={lms.h} title="CANVAS" lines={["(LMS API)"]} tone="outside" icon="canvas" partId="canvas" selected={selected("canvas")} onSelect={pick} />
          <Box x={llm.x} y={llm.y} w={llm.w} h={llm.h} title="LLM" lines={["(OpenAI API)"]} tone="outside" icon="llm" partId="llm" selected={selected("llm")} onSelect={pick} />

          <Box x={otel.x} y={otel.y} w={otel.w} h={otel.h} title="OTEL" lines={["(collector)"]} tone="store" icon="otel" partId="clickhouse" selected={selected("clickhouse")} onSelect={pick} />
          <Store x={ch.x} y={ch.y} w={ch.w} h={ch.h} title="CLICKHOUSE" lines={["(logs)"]} tone="store" icon="clickhouse" partId="clickhouse" selected={selected("clickhouse")} onSelect={pick} />

          {/* Frontend <-> Kong */}
          <Flow points={[[fe.x + fe.w, mid(fe)], [kong.x, mid(kong)]]} ends="both" duration={2.8} label="HTTP" labelAt={[fe.x + fe.w + 12, mid(fe) - 10]} />

          {/* Kong <-> every service */}
          <Flow points={[[kong.x + kong.w, mid(kong)], [spine, mid(kong)]]} ends="none" duration={2.4} />
          <Flow points={[[spine, mid(auth)], [spine, mid(agent)]]} ends="none" packets={0} />
          {services.map((svc, index) => (
            <Flow key={`kong-${svc.id}`} points={[[spine, mid(svc)], [svcX, mid(svc)]]} ends="both" duration={2.2} delay={0.12 * index} />
          ))}

          {/* Service-to-service calls inside the cluster */}
          <Flow points={[[svcRight, mid(agent) - 8], [560, mid(agent) - 8], [560, mid(mcp) - 6], [svcRight, mid(mcp) - 6]]} ends="both" duration={2.6} label="tools" labelAt={[548, mid(connector) + 30]} />
          <Flow points={[[svcRight, mid(mcp) + 8], [570, mid(mcp) + 8], [570, mid(connector) - 8], [svcRight, mid(connector) - 8]]} ends="both" duration={2.4} delay={0.2} />
          <Flow points={[[svcRight, mid(connector) + 4], [580, mid(connector) + 4], [580, mid(auth) + 6], [svcRight, mid(auth) + 6]]} duration={3} delay={0.3} />
          <Flow points={[[svcRight, mid(agent) + 8], [592, mid(agent) + 8], [592, mid(auth) - 8], [svcRight, mid(auth) - 8]]} dashed duration={3.4} delay={0.4} />
          <Flow points={[[592, mid(notify)], [svcRight, mid(notify)]]} dashed duration={2} delay={0.5} label="events" labelAt={[548, mid(notify) - 8]} />

          {/* Cluster <-> Postgres and the Redis bus */}
          <Flow points={[[frameRight, mid(redisDb)], [storeTrunk, mid(redisDb)]]} ends="start" packets={0} />
          <Flow points={[[storeTrunk, mid(bus)], [storeTrunk, mid(pg)]]} ends="none" packets={0} />
          <Flow points={[[storeTrunk, mid(bus)], [bus.x, mid(bus)]]} ends="both" duration={2.2} label="pub/sub" labelAt={[storeTrunk + 2, mid(bus) - 8]} />
          <Flow points={[[storeTrunk, mid(pg)], [pg.x, mid(pg)]]} ends="both" duration={2.2} delay={0.3} label="SQL" labelAt={[storeTrunk + 4, mid(pg) - 8]} />
          <Flow points={[[bus.x + bus.w / 2, bus.y + bus.h], [redisDb.x + redisDb.w / 2, redisDb.y]]} duration={1.6} />

          {/* Out to the external APIs */}
          <Flow points={[[svcRight, mid(connector) + 14], [lms.x, mid(connector) + 14]]} ends="both" duration={3} label="REST" labelAt={[786, mid(connector) + 8]} />
          <Flow points={[[svcRight, mid(agent)], [llm.x, mid(agent)]]} ends="both" duration={3} delay={0.2} label="chat completions" labelAt={[704, mid(agent) - 6]} />

          {/* Observability: services -> OTel -> ClickHouse, and back up for System Health */}
          <Flow points={[[otel.x + otel.w / 2, bandY + bandH], [otel.x + otel.w / 2, otel.y]]} duration={2.4} label="OTLP" labelAt={[otel.x + otel.w / 2 - 30, bandY + bandH + 34]} />
          <Flow points={[[otel.x + otel.w, mid(otel)], [ch.x, mid(otel)]]} duration={2.2} delay={0.3} />
          <Flow points={[[ch.x + ch.w / 2, ch.y], [ch.x + ch.w / 2, 396], [frameRight - 20, 396], [frameRight - 20, bandY + bandH]]} duration={2.6} delay={0.5} label="reads" labelAt={[ch.x + ch.w / 2 + 6, 392]} />
        </Diagram>
      )}
    </InteractivePlate>
  );
}

/** FIG_002 — Two wires */
function TwoWires() {
  return (
    <InteractivePlate id="FIG_002" defaultPart="kong" hint="Click browser, Kong, or notification.">
      {({ pick, selected }) => (
        <Diagram
          label="Two wires leave the browser. HTTP stops at Kong. The live socket opens on notification :8004."
          viewBox="0 0 760 380"
        >
          <Band y={8} name="CLIENT" tone="client" />
          <Box
            x={250}
            y={28}
            w={260}
            h={56}
            title="BROWSER"
            lines={["Vite app · :5173"]}
            tone="client"
            icon="frontend"
            partId="frontend"
            selected={selected("frontend")}
            onSelect={pick}
          />
          <Flow
            points={[
              [330, 84],
              [330, 156],
            ]}
            duration={2.4}
            packets={2}
            label="HTTP → /api/*"
            labelAt={[248, 120]}
          />
          <Flow
            points={[
              [450, 56],
              [600, 56],
              [600, 156],
            ]}
            dashed
            duration={3.0}
            delay={0.4}
            packets={2}
            label="WebSocket"
            labelAt={[510, 48]}
          />

          <Band y={132} name="EDGE + LIVE" tone="edge" />
          <Box
            x={100}
            y={156}
            w={340}
            h={160}
            title="KONG :8000"
            lines={[
              "/api/auth · open",
              "/api/agent · JWT",
              "/api/notify · JWT",
              "/api/connector · JWT",
              "/api/canvas-tools · JWT",
            ]}
            tone="edge"
            icon="kong"
            partId="kong"
            selected={selected("kong")}
            onSelect={pick}
          />
          <Box
            x={480}
            y={156}
            w={240}
            h={88}
            title="NOTIFICATION"
            lines={["socket :8004", "not in Kong routes"]}
            tone="service"
            icon="notify"
            partId="notify"
            selected={selected("notify")}
            onSelect={pick}
          />
          <T x={100} y={348} fill={tones.edge.body}>
            The page holds both connections. Only HTTP is in the gateway route table.
          </T>
        </Diagram>
      )}
    </InteractivePlate>
  );
}

/** FIG_003 — Desk map with expandable guard groups */
function Desk() {
  return (
    <InteractivePlate id="FIG_003" rail={false}>
      {() => <DeskMap />}
    </InteractivePlate>
  );
}

/** FIG_004 — Kong overview + API route dropdowns */
function Door() {
  return (
    <InteractivePlate
      id="FIG_004"
      defaultPart="kong"
      hint="Click Kong for gateway facts. Expand a prefix below for full API contracts."
      footer={<ApiAccordion />}
    >
      {({ pick, selected }) => (
        <Diagram
          label="Kong DB-less edge. Declarative routes, local rate-limit, CORS. Expand API prefixes under the figure for contracts."
          viewBox="0 0 760 200"
        >
          <Frame x={16} y={16} w={360} h={168} title="GATEWAY" />
          <Box
            x={32}
            y={48}
            w={328}
            h={112}
            title="KONG :8000"
            lines={["KONG_DATABASE=off", "declarative config at boot", "CORS · localhost:5173"]}
            tone="edge"
            icon="kong"
            partId="kong"
            selected={selected("kong")}
            onSelect={pick}
          />
          <Frame x={392} y={16} w={352} h={168} title="EDGE LIMIT" />
          <Box
            x={408}
            y={48}
            w={320}
            h={112}
            title="RATE-LIMIT"
            lines={["policy: local", "500 req / second", "50 000 / hour"]}
            tone="edge"
            icon="kong"
            partId="kong"
            selected={selected("kong")}
            onSelect={pick}
          />
        </Diagram>
      )}
    </InteractivePlate>
  );
}

/** FIG_005 — Who is asking */
function Asking() {
  return (
    <InteractivePlate id="FIG_005" defaultPart="auth" hint="Click a hop in the identity path.">
      {({ pick, selected }) => (
        <Diagram
          label="Login and verify. Auth reads Postgres, blacklists logout in Redis, Kong checks exp + iss, peers use gRPC :50052."
          viewBox="0 0 760 400"
        >
          <Box
            x={16}
            y={40}
            w={150}
            h={72}
            title="USER"
            lines={["email · password"]}
            tone="client"
            icon="user"
            partId="frontend"
            selected={selected("frontend")}
            onSelect={pick}
          />
          <Arrow x1={166} y1={76} x2={210} y2={72} />
          <Oval
            x={210}
            y={28}
            w={200}
            h={96}
            title="AUTH VERIFY"
            lines={["HTTP :8002"]}
            tone="service"
            icon="auth"
            partId="auth"
            selected={selected("auth")}
            onSelect={pick}
          />
          <Arrow x1={410} y1={52} x2={470} y2={52} />
          <Path points={[[410, 100], [440, 100], [440, 156], [470, 156]]} />
          <Store
            x={470}
            y={16}
            w={260}
            h={80}
            title="POSTGRES"
            lines={["schema auth · encrypted tokens"]}
            tone="store"
            icon="postgres"
            partId="postgres"
            selected={selected("postgres")}
            onSelect={pick}
          />
          <Store
            x={470}
            y={120}
            w={260}
            h={80}
            title="REDIS"
            lines={["JWT blacklist until expiry"]}
            tone="bus"
            icon="redis"
            partId="redis"
            selected={selected("redis")}
            onSelect={pick}
          />
          <Arrow x1={310} y1={124} x2={310} y2={176} />
          <Box
            x={210}
            y={176}
            w={200}
            h={72}
            title="KONG JWT"
            lines={["checks exp + iss"]}
            tone="edge"
            icon="kong"
            partId="kong"
            selected={selected("kong")}
            onSelect={pick}
          />
          <Path points={[[310, 248], [310, 300], [470, 300]]} dashed />
          <Box
            x={470}
            y={268}
            w={260}
            h={56}
            title="PEERS"
            lines={["agent + notify · gRPC :50052"]}
            tone="service"
            icon="auth"
            partId="agent"
            selected={selected("agent")}
            onSelect={pick}
          />
          <T x={16} y={320} fill={tones.service.body}>
            /api/auth stays open — login has no token yet.
          </T>
          <T x={16} y={344} fill={tones.service.body}>
            Canvas tokens never leave the auth vault into the model prompt.
          </T>
        </Diagram>
      )}
    </InteractivePlate>
  );
}

/** FIG_012 — Natural language → HITL → Canvas */
function SentenceToCanvas() {
  return (
    <InteractivePlate
      id="FIG_012"
      defaultPart="pause_hitl"
      hint="Follow the sentence left to right. Writes stop at HITL until the instructor approves."
    >
      {({ pick, selected }) => (
        <Diagram
          label="Natural language becomes Canvas actions only after human-in-the-loop review."
          viewBox="0 0 920 280"
        >
          <T x={24} y={28} fill={BLUE}>
            FROM A SENTENCE TO A CANVAS ACTION
          </T>
          <Box
            x={16}
            y={56}
            w={150}
            h={88}
            title="1  SENTENCE"
            lines={["ordinary language", "instructor desk"]}
            tone="client"
            icon="frontend"
            partId="frontend"
            selected={selected("frontend")}
            onSelect={pick}
          />
          <Flow points={[[166, 100], [196, 100]]} duration={1.8} packets={1} />
          <Box
            x={196}
            y={56}
            w={160}
            h={88}
            title="2  PLAN"
            lines={["agentic ReAct", "scope · sanitize"]}
            tone="agent"
            icon="agent"
            partId="agent"
            selected={selected("agent")}
            onSelect={pick}
          />
          <Flow points={[[356, 100], [386, 100]]} duration={1.8} delay={0.15} packets={1} />
          <Box
            x={386}
            y={44}
            w={176}
            h={112}
            title="3  HITL PAUSE"
            lines={["write tools stop", "instructor reviews", "approve · edit · deny"]}
            tone="agent"
            icon="pause_hitl"
            partId="pause_hitl"
            selected={selected("pause_hitl")}
            onSelect={pick}
          />
          <rect
            x={382}
            y={40}
            width={184}
            height={120}
            fill="none"
            stroke={BLUE}
            strokeWidth={2.25}
            strokeDasharray="5 4"
          />
          <T x={478} y={28} fill={BLUE} size={10} anchor="middle">
            required for writes
          </T>
          <Flow points={[[562, 100], [592, 100]]} duration={1.8} delay={0.3} packets={1} />
          <Box
            x={592}
            y={56}
            w={148}
            h={88}
            title="4  TOOLS"
            lines={["mcp-canvas", "named tools only"]}
            tone="service"
            icon="mcp"
            partId="mcp"
            selected={selected("mcp")}
            onSelect={pick}
          />
          <Flow points={[[740, 100], [770, 100]]} duration={1.8} delay={0.45} packets={1} />
          <Box
            x={770}
            y={56}
            w={134}
            h={88}
            title="5  CANVAS"
            lines={["connector REST", "instructor key"]}
            tone="outside"
            icon="canvas"
            partId="connector"
            selected={selected("connector")}
            onSelect={pick}
          />
          <T x={24} y={188} fill={tones.agent.title} size={11}>
            Example · “move the midterm to next week and tell the class”
          </T>
          <T x={24} y={214} fill={tones.edge.body} size={11}>
            Agent drafts date change + announcement → HITL card → only then does the connector call Canvas.
          </T>
          <T x={24} y={248} fill={tones.store.body} size={10}>
            The model never holds the Canvas key. Student fields are stripped before they re-enter the prompt.
          </T>
        </Diagram>
      )}
    </InteractivePlate>
  );
}

/** FIG_006 — AI harness loop */
function Loop() {
  return (
    <InteractivePlate id="FIG_006" defaultPart="pause_hitl" hint="Click MESSAGE, MODEL, EXECUTE NOW, or PAUSE.">
      {({ pick, selected }) => (
        <Diagram
          label="AI harness. Scope guard → LiteLLM → tool policy → execute or HITL → sanitize → model again."
          viewBox="0 0 760 480"
        >
          <Box
            x={246}
            y={8}
            w={220}
            h={48}
            title="1  MESSAGE"
            lines={["scope guard first"]}
            tone="agent"
            icon="agent"
            partId="agent"
            selected={selected("agent")}
            onSelect={pick}
          />
          <Flow points={[[356, 56], [356, 72]]} duration={2.0} packets={1} />
          <Box
            x={246}
            y={72}
            w={220}
            h={56}
            title="2  MODEL"
            lines={["LiteLLM · ReAct turn"]}
            tone="outside"
            icon="model_step"
            partId="model_step"
            selected={selected("model_step")}
            onSelect={pick}
          />
          <Flow
            points={[[466, 100], [510, 100]]}
            duration={2.2}
            packets={1}
            label="final"
            labelAt={[472, 90]}
          />
          <Box
            x={510}
            y={72}
            w={226}
            h={56}
            title="FINAL ANSWER"
            lines={["record · stop"]}
            tone="service"
            icon="execute_now"
          />
          <Flow points={[[356, 128], [356, 148]]} duration={2.0} delay={0.2} packets={1} />
          <Box x={246} y={148} w={220} h={44} title="3  TOOL CALL" tone="agent" icon="mcp" />
          <Flow
            points={[[356, 192], [356, 212], [164, 212], [164, 236]]}
            duration={2.8}
            packets={2}
          />
          <Flow
            points={[[356, 212], [580, 212], [580, 236]]}
            duration={2.8}
            delay={0.35}
            packets={2}
          />
          <T x={176} y={204} fill={tones.service.title}>
            known read
          </T>
          <T x={400} y={204} fill={tones.agent.title}>
            write / ambiguous
          </T>
          <Box
            x={24}
            y={236}
            w={300}
            h={112}
            title="EXECUTE NOW"
            lines={["call MCP · sanitize result", "return to model context"]}
            tone="service"
            icon="execute_now"
            partId="execute_now"
            selected={selected("execute_now")}
            onSelect={pick}
          />
          <Box
            x={420}
            y={236}
            w={316}
            h={128}
            title="PAUSE · HITL"
            lines={["session:{id}:hitl", "yes → execute · no → record", "edit payload · then model"]}
            tone="agent"
            icon="pause_hitl"
            partId="pause_hitl"
            selected={selected("pause_hitl")}
            onSelect={pick}
          />
          <T x={24} y={380} fill={tones.agent.body}>
            Scope guard before tools. Sanitizer before the next model turn.
          </T>
          <T x={24} y={404} fill={tones.agent.body}>
            {"Publishes session:{id}:steps and session:{id}:hitl on Redis."}
          </T>
          <T x={24} y={428} fill={tones.agent.body}>
            Celery worker owns long sessions — separate container from HTTP :8003.
          </T>
        </Diagram>
      )}
    </InteractivePlate>
  );
}

/** FIG_007 — Corridor */
function Corridor() {
  return (
    <InteractivePlate id="FIG_007" defaultPart="connector" hint="Click a hop — the model never holds a Canvas token.">
      {({ pick, selected }) => (
        <Diagram
          label="Tool corridor: Model → Agentic (HITL) → mcp-canvas :50056 → Connector :50055 → Canvas REST."
          viewBox="0 0 760 400"
        >
          <Box
            x={24}
            y={24}
            w={200}
            h={72}
            title="MODEL"
            lines={["proposes tool only"]}
            tone="outside"
            icon="llm"
            partId="llm"
            selected={selected("llm")}
            onSelect={pick}
          />
          <Flow
            points={[
              [224, 60],
              [268, 60],
            ]}
            duration={2.2}
            packets={2}
            label="propose"
            labelAt={[228, 50]}
          />
          <Box
            x={268}
            y={16}
            w={220}
            h={88}
            title="AGENTIC"
            lines={["HITL · sanitize", "HTTP :8003"]}
            tone="agent"
            icon="agent"
            partId="agent"
            selected={selected("agent")}
            onSelect={pick}
          />
          <Flow
            points={[
              [488, 60],
              [532, 60],
            ]}
            duration={2.5}
            packets={2}
            label="gRPC :50056"
            labelAt={[490, 48]}
          />
          <Box
            x={532}
            y={16}
            w={204}
            h={88}
            title="MCP-CANVAS"
            lines={["mTLS + JWT", ":50056 · :8100"]}
            tone="service"
            icon="mcp"
            partId="mcp"
            selected={selected("mcp")}
            onSelect={pick}
          />
          <Flow
            points={[
              [634, 104],
              [634, 148],
            ]}
            duration={2.3}
            delay={0.3}
            packets={1}
            label=":50055"
            labelAt={[648, 132]}
          />
          <Box
            x={480}
            y={148}
            w={256}
            h={80}
            title="CONNECTOR"
            lines={["fetches token · REST 60s"]}
            tone="service"
            icon="connector"
            partId="connector"
            selected={selected("connector")}
            onSelect={pick}
          />
          <Flow
            points={[
              [608, 228],
              [608, 268],
            ]}
            duration={2.8}
            delay={0.5}
            packets={2}
            label="REST 60s"
            labelAt={[620, 252]}
          />
          <Box
            x={500}
            y={268}
            w={220}
            h={64}
            title="CANVAS LMS"
            lines={["system of record"]}
            tone="outside"
            icon="canvas"
            partId="canvas"
            selected={selected("canvas")}
            onSelect={pick}
          />
          <T x={24} y={200} fill={tones.service.body}>
            Kong /api/canvas-tools is the browser HTTP door.
          </T>
          <T x={24} y={224} fill={tones.service.body}>
            The agent uses the gRPC hop — never embeds Canvas HTTP.
          </T>
          <T x={24} y={320} fill={tones.outside.body}>
            Credential path: auth vault → connector only → LMS.
          </T>
        </Diagram>
      )}
    </InteractivePlate>
  );
}

/** FIG_008 — Fan-out */
function Wire() {
  return (
    <InteractivePlate id="FIG_008" defaultPart="notify" hint="Click agent, Redis, notify, or Resend.">
      {({ pick, selected }) => (
        <Diagram
          label="Fan-out: agent steps/HITL → Redis → socket. Mail uses other channels → subscribers → Resend."
          viewBox="0 0 760 500"
        >
          <Box
            x={24}
            y={20}
            w={230}
            h={88}
            title="AGENTIC"
            lines={["session:{id}:steps", "session:{id}:hitl"]}
            tone="agent"
            icon="agent"
            partId="agent"
            selected={selected("agent")}
            onSelect={pick}
          />
          <Flow
            points={[
              [254, 64],
              [290, 64],
            ]}
            duration={2.2}
            packets={2}
            label="publish"
            labelAt={[256, 54]}
          />
          <Store
            x={290}
            y={28}
            w={140}
            h={72}
            title="REDIS"
            lines={["pub/sub"]}
            tone="bus"
            icon="redis"
            partId="redis"
            selected={selected("redis")}
            onSelect={pick}
          />
          <Flow
            points={[
              [430, 64],
              [466, 64],
            ]}
            duration={2.4}
            delay={0.3}
            packets={2}
            label="fan-out"
            labelAt={[432, 54]}
          />
          <Box
            x={466}
            y={16}
            w={270}
            h={100}
            title="NOTIFY :8004"
            lines={["subscribes session:*", "forwards on open socket"]}
            tone="service"
            icon="notify"
            partId="notify"
            selected={selected("notify")}
            onSelect={pick}
          />
          <T x={24} y={140} fill={tones.service.body}>
            The page already holds that socket. This path never sends mail.
          </T>

          <Frame x={24} y={160} w={712} h={300} title="MAIL · SAME PROCESS · OTHER CHANNELS" />
          <Box
            x={40}
            y={196}
            w={220}
            h={80}
            title="AUTH"
            lines={["verification · reset"]}
            tone="service"
            icon="auth"
            partId="auth"
            selected={selected("auth")}
            onSelect={pick}
          />
          <Box
            x={276}
            y={196}
            w={220}
            h={80}
            title="DIGESTS"
            lines={["reminder · urgent · weekly"]}
            tone="service"
            icon="notify"
            partId="notify"
            selected={selected("notify")}
            onSelect={pick}
          />
          <Box
            x={512}
            y={196}
            w={208}
            h={80}
            title="FORMED"
            lines={["email.notification…"]}
            tone="service"
            icon="resend"
            partId="resend"
            selected={selected("resend")}
            onSelect={pick}
          />
          <Path points={[[150, 276], [150, 308], [380, 308]]} head={false} />
          <Path points={[[386, 276], [386, 308]]} head={false} />
          <Path points={[[616, 276], [616, 308], [380, 308]]} head={false} />
          <Arrow x1={380} y1={308} x2={380} y2={324} />
          <Box
            x={196}
            y={324}
            w={368}
            h={48}
            title="SUBSCRIBERS"
            lines={["auth · digests · formed event"]}
            tone="service"
            icon="notify"
          />
          <Arrow x1={380} y1={372} x2={380} y2={388} />
          <Box
            x={196}
            y={388}
            w={368}
            h={48}
            title="QUEUE → WORKER → RESEND"
            lines={["webhooks → /webhooks/resend"]}
            tone="outside"
            icon="resend"
            partId="resend"
            selected={selected("resend")}
            onSelect={pick}
          />
        </Diagram>
      )}
    </InteractivePlate>
  );
}

/** FIG_009 — Four memories */
function Cabinets() {
  return (
    <InteractivePlate id="FIG_009" defaultPart="postgres" hint="Click a store for ownership and retention.">
      {({ pick, selected }) => (
        <Diagram
          label="Four memories: Postgres schemas, losable Redis, ClickHouse logs TTL 14d, shared document volume."
          viewBox="0 0 760 420"
        >
          <Store
            x={16}
            y={48}
            w={180}
            h={180}
            title="POSTGRES"
            lines={[":15432", "auth · agent", "canvas · notification"]}
            tone="store"
            icon="postgres"
            partId="postgres"
            selected={selected("postgres")}
            onSelect={pick}
          />
          <Box
            x={16}
            y={248}
            w={180}
            h={56}
            title="ADMINER"
            lines={[":8081"]}
            tone="outside"
            icon="adminer"
            partId="postgres"
            selected={selected("postgres")}
            onSelect={pick}
          />
          <Arrow x1={106} y1={228} x2={106} y2={248} />
          <Store
            x={214}
            y={48}
            w={170}
            h={180}
            title="REDIS"
            lines={[":6379", "conversation", "blacklist", "pub/sub · losable"]}
            tone="bus"
            icon="redis"
            partId="redis"
            selected={selected("redis")}
            onSelect={pick}
          />
          <Box
            x={404}
            y={16}
            w={160}
            h={56}
            title="OTEL"
            lines={[":4317 · :4318"]}
            tone="edge"
            icon="otel"
            partId="clickhouse"
            selected={selected("clickhouse")}
            onSelect={pick}
          />
          <Arrow x1={484} y1={72} x2={484} y2={100} />
          <T x={496} y={90} fill={tones.edge.title}>
            logs
          </T>
          <Store
            x={404}
            y={100}
            w={170}
            h={128}
            title="CLICKHOUSE"
            lines={[":9000", "otel_logs · TTL 14d"]}
            tone="store"
            icon="clickhouse"
            partId="clickhouse"
            selected={selected("clickhouse")}
            onSelect={pick}
          />
          <Box
            x={592}
            y={80}
            w={148}
            h={148}
            title="VOLUME"
            lines={["/data/documents", "agent + worker"]}
            tone="store"
            icon="volume"
            partId="volume"
            selected={selected("volume")}
            onSelect={pick}
          />
          <T x={16} y={340} fill={tones.store.body}>
            db-migrate runs auth, canvas, agent migrators once, then exits.
          </T>
          <T x={16} y={364} fill={tones.store.body}>
            Notification migrates its own schema on boot. Redis wipe → rebuild from Postgres checkpoints.
          </T>
        </Diagram>
      )}
    </InteractivePlate>
  );
}

/** FIG_010 — Course roadmap */
function Roadmap() {
  const weeks: Array<[string, string, string, boolean, string]> = [
    ["02", "May 18", "Charter and plan", false, "frontend"],
    ["03", "May 22", "DFDs and component diagram", false, "kong"],
    ["04", "May 29", "Compose stack comes up", false, "postgres"],
    ["05", "Jun 5", "Canvas service is the only caller", false, "connector"],
    ["06", "Jun 12", "Credentials cross auth and Canvas", false, "auth"],
    ["07", "Jun 20", "The agent lands, HITL inside it", false, "agent"],
    ["08", "Jun 29", "The frontend joins the live APIs", false, "frontend"],
    ["09", "Jul 3", "The assistant leaves the mock", false, "agent"],
    ["10", "Jul 10", "Sessions move onto Celery", true, "agent"],
    ["11", "Jul 17", "Tools move onto MCP", true, "mcp"],
    ["12", "Jul 24", "Notification grows a mail room", true, "notify"],
    ["13", "Aug 4", "Grading, health, close-out", false, "clickhouse"],
  ];
  return (
    <InteractivePlate id="FIG_010" defaultPart="mcp" hint="Click a week to open the component that week introduced.">
      {({ pick, selected }) => (
        <Diagram
          label="Team-log roadmap weeks 2–13. Highlighted rows are architecture turns (Celery, MCP, mail)."
          viewBox="0 0 760 460"
        >
          <T x={24} y={28} fill={BLUE}>
            WEEK
          </T>
          <T x={90} y={28} fill={BLUE}>
            OPENS
          </T>
          <T x={200} y={28} fill={BLUE}>
            WHAT CHANGED
          </T>
          {weeks.map(([week, opens, change, turn, part], index) => {
            const on = selected(part);
            return (
              <g
                key={week}
                className="diagram-hit"
                role="button"
                tabIndex={0}
                data-click="select"
                onClick={() => pick(part)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    pick(part);
                    playClick("select");
                  }
                }}
              >
                <rect
                  x={16}
                  y={40 + index * 32}
                  width={728}
                  height={28}
                  fill={on ? tones.agent.fill : turn ? WASH : PAPER}
                  stroke={on ? BLUE : tones.edge.stroke}
                  strokeWidth={on ? 2 : 1}
                />
                <T x={24} y={58 + index * 32} fill={BLUE}>
                  {week}
                </T>
                <T x={90} y={58 + index * 32}>
                  {opens}
                </T>
                <T x={200} y={58 + index * 32}>
                  {turn ? `${change}  · turn` : change}
                </T>
              </g>
            );
          })}
        </Diagram>
      )}
    </InteractivePlate>
  );
}

/** FIG_011 — Feature branches into development */
function BranchRiver() {
  const trunkY = 210;
  const x0 = 56;
  const x1 = 880;
  const laneY: Record<BranchLane, number> = {
    foundation: 56,
    agent: 100,
    mcp: 144,
    desk: 276,
    canvas: 320,
    notify: 364,
    infra: 400,
  };
  const months = [
    { label: "MAY", t: 0.06 },
    { label: "JUN", t: 0.28 },
    { label: "JUL", t: 0.55 },
    { label: "AUG", t: 0.88 },
  ];

  return (
    <InteractivePlate
      id="FIG_011"
      defaultPart="mcp"
      hint="Click a branch tip to open the component that feature changed. Nodes with a PR number are real merges into development."
    >
      {({ pick, selected }) => (
        <Diagram
          label="Feature branches leaving and merging into the development trunk on capstone-team-1."
          viewBox="0 0 920 448"
        >
          <T x={x0} y={24} fill={BLUE}>
            development
          </T>
          <T x={x1} y={24} fill={tones.edge.body} anchor="end" size={10}>
            capstone-team-1 · visual history
          </T>

          {/* Trunk */}
          <line x1={x0} y1={trunkY} x2={x1} y2={trunkY} stroke={BLUE} strokeWidth={3} />
          <circle cx={x0} cy={trunkY} r={4} fill={BLUE} />
          <circle cx={x1} cy={trunkY} r={5} fill={BLUE} />
          <T x={x1 + 8} y={trunkY + 4} fill={BLUE} size={10}>
            #946
          </T>

          {months.map((month) => {
            const x = x0 + month.t * (x1 - x0);
            return (
              <g key={month.label}>
                <line x1={x} y1={trunkY - 8} x2={x} y2={trunkY + 8} stroke={tones.edge.stroke} strokeWidth={1} />
                <T x={x} y={trunkY + 28} fill={tones.edge.body} size={10} anchor="middle">
                  {month.label}
                </T>
              </g>
            );
          })}

          {branchMerges.map((merge) => {
            const tone = tones[laneMeta[merge.lane].tone];
            const mx = x0 + merge.t * (x1 - x0);
            const fy = laneY[merge.lane];
            const above = fy < trunkY;
            const forkX = mx - 36;
            const on = selected(merge.partId);
            const midY = above ? (fy + trunkY) / 2 - 8 : (fy + trunkY) / 2 + 8;
            const d = `M ${forkX} ${trunkY} Q ${forkX} ${midY} ${mx} ${fy} Q ${mx + 28} ${midY} ${mx} ${trunkY}`;

            return (
              <g
                key={merge.id}
                className="diagram-hit"
                role="button"
                tabIndex={0}
                data-click="select"
                onClick={() => pick(merge.partId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    pick(merge.partId);
                    playClick("select");
                  }
                }}
              >
                <path d={d} fill="none" stroke={on ? BLUE : tone.stroke} strokeWidth={on ? 2.25 : 1.5} />
                <circle cx={forkX} cy={trunkY} r={3} fill={on ? BLUE : tone.stroke} />
                <circle cx={mx} cy={trunkY} r={on ? 5 : 3.5} fill={on ? BLUE : tone.stroke} />
                <rect
                  x={mx - 54}
                  y={fy - 14}
                  width={108}
                  height={28}
                  rx={14}
                  fill={on ? tone.fill : PAPER}
                  stroke={on ? BLUE : tone.stroke}
                  strokeWidth={on ? 2 : 1.25}
                />
                <T x={mx} y={fy + 4} fill={on ? tone.title : tone.body} size={10} anchor="middle">
                  {merge.pr ? `${merge.label} · #${merge.pr}` : merge.label}
                </T>
              </g>
            );
          })}

          {/* Lane key */}
          {(Object.keys(laneMeta) as BranchLane[]).map((lane, index) => {
            const meta = laneMeta[lane];
            const tone = tones[meta.tone];
            const lx = 56 + index * 118;
            return (
              <g key={lane}>
                <rect x={lx} y={428} width={10} height={10} fill={tone.fill} stroke={tone.stroke} strokeWidth={1} />
                <T x={lx + 14} y={437} fill={tone.body} size={9}>
                  {meta.title}
                </T>
              </g>
            );
          })}
        </Diagram>
      )}
    </InteractivePlate>
  );
}

export const plates: Record<FigureId, PlateSpec> = {
  FIG_001: {
    id: "FIG_001",
    name: "CAPSTONE STACK",
    caption: "Compose spine: HTTP into Kong, WS bypass to notify, gRPC tool corridor to Canvas, pub/sub to Redis.",
    canvas: <Assembly />,
  },
  FIG_002: {
    id: "FIG_002",
    name: "TWO WIRES",
    caption: "HTTP enters Kong. The live socket opens on :8004 beside the gateway — not in the route table.",
    canvas: <TwoWires />,
  },
  FIG_003: {
    id: "FIG_003",
    name: "THE DESK",
    caption: "Nested guard map. Expand a group for route contracts, design rationale, and why the partition matters for NL→LMS systems.",
    canvas: <Desk />,
  },
  FIG_004: {
    id: "FIG_004",
    name: "THE DOOR",
    caption: "Kong edge summary above; each /api prefix is a dropdown with contract, surfaces, rationale, and project relevance.",
    canvas: <Door />,
  },
  FIG_005: {
    id: "FIG_005",
    name: "WHO IS ASKING",
    caption: "Login path: Auth → Postgres / Redis blacklist → Kong JWT → peers on gRPC :50052.",
    canvas: <Asking />,
  },
  FIG_006: {
    id: "FIG_006",
    name: "THE LOOP",
    caption: "AI harness. Scope guard and sanitizer sit around the model. Writes pause for HITL.",
    canvas: <Loop />,
  },
  FIG_007: {
    id: "FIG_007",
    name: "THE CORRIDOR",
    caption: "Model proposes → agent HITL → MCP → connector → Canvas. Credential never enters the prompt.",
    canvas: <Corridor />,
  },
  FIG_008: {
    id: "FIG_008",
    name: "THE FAN-OUT",
    caption: "Steps and pauses reach the open socket. Mail is other Redis channels, then Resend.",
    canvas: <Wire />,
  },
  FIG_009: {
    id: "FIG_009",
    name: "FOUR MEMORIES",
    caption: "Postgres holds four schemas. Redis may be lost. Logs last 14 days. Documents sit on a shared volume.",
    canvas: <Cabinets />,
  },
  FIG_010: {
    id: "FIG_010",
    name: "THE COURSE",
    caption: "Twelve logged weeks. Washed rows are architecture turns — click a week for the component it introduced.",
    canvas: <Roadmap />,
  },
  FIG_011: {
    id: "FIG_011",
    name: "INTO DEVELOPMENT",
    caption:
      "Feature branches leave the development trunk and merge back. PR numbers are real merges on capstone-team-1; earlier nodes follow the team log.",
    canvas: <BranchRiver />,
  },
  FIG_012: {
    id: "FIG_012",
    name: "SENTENCE → CANVAS",
    caption:
      "Natural language becomes Canvas actions only after HITL. The dashed box is the required pause on every write.",
    canvas: <SentenceToCanvas />,
  },
};
