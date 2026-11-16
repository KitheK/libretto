import { useId } from "react";
import { BLUE } from "./kit";

function pathFrom(points: Array<[number, number]>) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${point[0]} ${point[1]}`).join(" ");
}

export type FlowEnds = "none" | "end" | "start" | "both";

/** Uniform blue animated edges — same stroke, dash, and packet language everywhere. */
export function Flow({
  points,
  dashed = false,
  head = true,
  ends,
  color = BLUE,
  duration = 3.0,
  delay = 0,
  packets = 1,
  label,
  labelAt,
  animate = true,
}: {
  points: Array<[number, number]>;
  dashed?: boolean;
  head?: boolean;
  ends?: FlowEnds;
  color?: string;
  duration?: number;
  delay?: number;
  packets?: number;
  label?: string;
  labelAt?: [number, number];
  animate?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const d = pathFrom(points);
  const mode: FlowEnds = ends ?? (head ? "end" : "none");
  const endId = `flow-end-${uid}`;
  const startId = `flow-start-${uid}`;
  const showPackets = animate && packets > 0;
  return (
    <g className="diagram-flow" aria-hidden>
      <defs>
        <marker id={endId} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0.4 0.6 L6 3.5 L0.4 6.4 Z" fill={color} fillOpacity="0.85" />
        </marker>
        <marker id={startId} markerWidth="7" markerHeight="7" refX="1" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M6 0.6 L1 3.5 L6 6.4 Z" fill={color} fillOpacity="0.85" />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.35"
        strokeOpacity="0.55"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "5 4" : "7 9"}
        markerEnd={mode === "end" || mode === "both" ? `url(#${endId})` : undefined}
        markerStart={mode === "start" || mode === "both" ? `url(#${startId})` : undefined}
        className="flow-track"
      />
      {showPackets
        ? Array.from({ length: packets }, (_, index) => (
            <circle key={index} r="2.4" fill={color} fillOpacity="0.8" className="flow-packet">
              <animateMotion
                dur={`${duration}s`}
                repeatCount="indefinite"
                begin={`${delay + index * (duration / Math.max(packets, 1))}s`}
                path={d}
              />
            </circle>
          ))
        : null}
      {label && labelAt ? (
        <text
          x={labelAt[0]}
          y={labelAt[1]}
          fill={color}
          fontSize="9"
          fontFamily='"Departure Mono", ui-monospace, monospace'
          opacity="0.9"
          stroke="#FBFBFB"
          strokeWidth="3"
          paintOrder="stroke fill"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}
