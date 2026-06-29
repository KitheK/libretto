import { BlueprintFrame, DbCylinder, NodeBox, Packet } from './blueprint/BlueprintFrame';

/** FIG_001 — aligned with SystemArchitecture.md + docker-compose + kong.yaml */
export default function Fig001SystemArchitecture() {
  return (
    <BlueprintFrame figId="FIG_001" title="SYSTEM ARCHITECTURE">
      {/* Client ↔ Kong */}
      <g className="wire" markerStart="url(#tail)" markerEnd="url(#head)">
        <path id="p-fe-gw" d="M 140 400 L 190 400" />
        <path id="p-gw-auth" d="M 290 330 L 320 330 L 320 200 L 390 200" />
        <path id="p-gw-agent" d="M 290 370 L 390 300" />
        <path id="p-gw-canvas" d="M 290 410 L 320 410 L 320 400 L 390 400" />
        <path id="p-gw-notif" d="M 290 450 L 320 450 L 320 500 L 390 500" />
        <path id="p-auth-eb" d="M 550 200 L 700 200" />
        <path id="p-agent-eb" d="M 550 300 L 700 300" />
        <path id="p-canvas-eb" d="M 550 400 L 700 380" />
        <path id="p-notif-eb" d="M 550 500 L 700 460" />
        <path id="p-eb-redis" d="M 740 170 L 740 135" />
      </g>

      <g className="wire" markerEnd="url(#head)">
        {/* Auth → Redis blacklist */}
        <path id="p-auth-redis" d="M 470 170 L 470 110 L 680 110" />
        {/* Agent → Postgres checkpoints */}
        <path id="p-agent-pg" d="M 470 280 L 470 650 L 680 650" />
        {/* Canvas → Postgres canvas schema */}
        <path id="p-canvas-pg" d="M 470 430 L 470 680 L 680 680" />
        {/* Agent → Canvas gRPC tool calls */}
        <path id="p-agent-canvas" d="M 470 310 L 470 360" />
        {/* Canvas connector → external REST API */}
        <path id="p-canvas-api" d="M 550 395 L 1040 395" />
        {/* Docker Compose management */}
        <path id="p-mgt-ms" d="M 405 620 L 405 560" />
        <path id="p-mgt-sd" d="M 450 650 L 490 650" />
        <path id="p-sd-ms" d="M 535 620 L 535 560" />
      </g>

      <g id="animated-packets">
        <Packet pathId="p-fe-gw" dur="1.2s" />
        <Packet pathId="p-gw-auth" dur="1.5s" />
        <Packet pathId="p-gw-agent" dur="1s" />
        <Packet pathId="p-gw-canvas" dur="1.3s" />
        <Packet pathId="p-gw-notif" dur="1.7s" />
        <Packet pathId="p-auth-eb" dur="1.3s" />
        <Packet pathId="p-agent-eb" dur="1.1s" />
        <Packet pathId="p-canvas-eb" dur="1.4s" />
        <Packet pathId="p-notif-eb" dur="1.2s" />
        <Packet pathId="p-auth-redis" dur="2.5s" />
        <Packet pathId="p-agent-pg" dur="2.2s" />
        <Packet pathId="p-canvas-pg" dur="2.4s" />
        <Packet pathId="p-agent-canvas" dur="1.6s" />
        <Packet pathId="p-canvas-api" dur="1.2s" />
        <Packet pathId="p-eb-redis" dur="1.2s" />
      </g>

      <NodeBox x={40} y={250} w={100} h={300} title="FRONTEND" subtitle="REACT / VITE :5173" />
      <NodeBox x={190} y={250} w={100} h={300} title="KONG" subtitle="API GATEWAY :8000" />

      <rect x={360} y={130} width={220} height={500} className="boundary" />
      <text x={370} y={122} className="blueprint-text blueprint-title" fontSize="12">
        BACKEND SERVICES (DOCKER COMPOSE)
      </text>

      <NodeBox x={390} y={160} w={160} h={70} title="AUTH SERVICE" subtitle="JWT / OAUTH :8002" />
      <NodeBox x={390} y={260} w={160} h={70} title="AGENT SERVICE" subtitle="REACT LOOP :8003" />
      <NodeBox x={390} y={360} w={160} h={70} title="CANVAS SERVICE" subtitle="CONNECTOR :8005" />
      <NodeBox x={390} y={460} w={160} h={70} title="NOTIFICATION" subtitle="WEBSOCKET :8004" />

      <NodeBox x={360} y={580} w={90} h={60} title="MANAGEMENT" titleSize={11} />
      <NodeBox x={490} y={580} w={90} h={60} title="SERVICE DISCOVERY" titleSize={10} />

      <g className="node" filter="url(#blueprint-shadow)">
        <rect x={706} y={176} width={80} height={360} fill="url(#diagonal-hatch)" stroke="none" />
        <rect x={700} y={170} width={80} height={360} className="node-box" />
        <rect x={705} y={175} width={70} height={350} className="node-inner" />
        <text
          x={740}
          y={350}
          className="blueprint-text blueprint-title"
          fontSize="14"
          textAnchor="middle"
          transform="rotate(-90 740 350)"
        >
          EVENT BUS
        </text>
        <text
          x={740}
          y={375}
          className="blueprint-text blueprint-label"
          textAnchor="middle"
          transform="rotate(-90 740 375)"
        >
          REDIS PUB/SUB
        </text>
      </g>

      <DbCylinder x={680} y={60} w={120} h={70} rx={60} title="REDIS" subtitle="CACHE + BUS" />
      <DbCylinder x={680} y={630} w={120} h={70} rx={60} title="POSTGRES" subtitle="PER-SERVICE SCHEMAS" />

      <NodeBox
        x={1040}
        y={355}
        w={120}
        h={80}
        rx={4}
        title="CANVAS REST"
        subtitle="EXTERNAL API"
        titleSize={12}
      />

      <text x={600} y={95} className="blueprint-text blueprint-label" textAnchor="middle">
        session:{'{id}'}:steps · hitl · tool-use
      </text>
    </BlueprintFrame>
  );
}
