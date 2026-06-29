import { BlueprintFrame, NodeBox, Packet } from './blueprint/BlueprintFrame';

/** FIG_002 — Level 1 agentic request flow from design DFDs */
export default function Fig002AgenticFlow() {
  return (
    <BlueprintFrame figId="FIG_002" title="AGENTIC REQUEST FLOW">
      <g className="wire" markerStart="url(#tail)" markerEnd="url(#head)">
        <path id="a-user-handler" d="M 120 400 L 280 400" />
        <path id="a-handler-llm" d="M 420 400 L 560 400" />
        <path id="a-llm-handler-data" d="M 560 340 L 420 340 L 420 280 L 280 280" />
        <path id="a-handler-canvas" d="M 340 280 L 720 280" />
        <path id="a-canvas-handler" d="M 720 320 L 340 320 L 340 360 L 280 360" />
        <path id="a-handler-user-dry" d="M 280 440 L 120 440" />
        <path id="a-user-handler-ok" d="M 120 480 L 280 480" />
        <path id="a-handler-llm-exec" d="M 340 420 L 560 420" />
        <path id="a-llm-handler-exec" d="M 560 460 L 340 460" />
        <path id="a-handler-canvas-exec" d="M 340 500 L 720 500" />
        <path id="a-handler-user-result" d="M 280 540 L 120 540" />
      </g>

      <g id="animated-packets">
        <Packet pathId="a-user-handler" dur="1.4s" />
        <Packet pathId="a-handler-llm" dur="1.2s" />
        <Packet pathId="a-handler-canvas" dur="1.6s" />
        <Packet pathId="a-canvas-handler" dur="1.6s" />
        <Packet pathId="a-handler-user-dry" dur="1.5s" />
        <Packet pathId="a-user-handler-ok" dur="1.3s" />
        <Packet pathId="a-handler-canvas-exec" dur="1.8s" />
        <Packet pathId="a-handler-user-result" dur="1.4s" />
      </g>

      <NodeBox x={40} y={360} w={80} h={200} title="USER" subtitle="INSTRUCTOR" titleSize={12} />
      <NodeBox x={280} y={320} w={140} h={240} title="AGENT" subtitle="REQUEST HANDLER" />
      <NodeBox x={560} y={320} w={140} h={200} title="LLM" subtitle="EXTERNAL API" />
      <NodeBox x={720} y={240} w={140} h={320} title="CANVAS API" subtitle="DATA + EXECUTE" />

      <text x={200} y={385} className="blueprint-text blueprint-label">
        1. NL request
      </text>
      <text x={480} y={325} className="blueprint-text blueprint-label">
        2. plan
      </text>
      <text x={520} y={270} className="blueprint-text blueprint-label">
        3. data request
      </text>
      <text x={200} y={455} className="blueprint-text blueprint-label">
        4. dry-run preview
      </text>
      <text x={200} y={495} className="blueprint-text blueprint-label">
        5. confirm
      </text>
      <text x={520} y={505} className="blueprint-text blueprint-label">
        6. execute
      </text>
      <text x={200} y={555} className="blueprint-text blueprint-label">
        7. results
      </text>
    </BlueprintFrame>
  );
}
