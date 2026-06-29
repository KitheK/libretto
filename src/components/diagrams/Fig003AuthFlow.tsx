import { BlueprintFrame, DbCylinder, NodeBox, Packet } from './blueprint/BlueprintFrame';

/** FIG_003 — Level 1 authentication flow from design DFDs */
export default function Fig003AuthFlow() {
  return (
    <BlueprintFrame figId="FIG_003" title="AUTHENTICATION FLOW">
      <g className="wire" markerStart="url(#tail)" markerEnd="url(#head)">
        <path id="f-user-verify" d="M 120 400 L 300 400" />
        <path id="f-verify-pg-q" d="M 440 360 L 600 360" />
        <path id="f-pg-verify" d="M 600 440 L 440 440" />
      </g>
      <g className="wire" markerEnd="url(#head)">
        <path id="f-verify-redis" d="M 370 320 L 370 200 L 780 200" />
        <path id="f-verify-user" d="M 300 460 L 120 460" />
      </g>

      <g id="animated-packets">
        <Packet pathId="f-user-verify" dur="1.3s" />
        <Packet pathId="f-verify-pg-q" dur="1.5s" />
        <Packet pathId="f-pg-verify" dur="1.5s" />
        <Packet pathId="f-verify-redis" dur="2s" />
        <Packet pathId="f-verify-user" dur="1.4s" />
      </g>

      <NodeBox x={40} y={360} w={80} h={120} title="USER" subtitle="BROWSER" titleSize={12} />
      <NodeBox x={300} y={360} w={140} h={120} title="VERIFY" subtitle="CREDENTIALS" />
      <DbCylinder x={600} y={320} w={120} h={140} rx={60} title="POSTGRES" subtitle="USER RECORDS" />
      <DbCylinder x={780} y={160} w={120} h={70} rx={60} title="REDIS" subtitle="JWT SESSION" />

      <text x={210} y={385} className="blueprint-text blueprint-label">
        credentials
      </text>
      <text x={520} y={350} className="blueprint-text blueprint-label">
        lookup user_id
      </text>
      <text x={520} y={450} className="blueprint-text blueprint-label">
        hashed password
      </text>
      <text x={210} y={475} className="blueprint-text blueprint-label">
        JWT token
      </text>
    </BlueprintFrame>
  );
}
