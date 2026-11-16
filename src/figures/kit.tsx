import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { playClick } from "../lib/clickSound";
import { NodeIcon } from "./icons";

/** Making Software action blue — kept for arrows and selection rings. */
export const BLUE = "#103DFF";
export const INK = "#000000";
export const PAPER = "#FBFBFB";
export const WASH = "#E6ECFF";
export const SIDE = "#F4F7FF";

/**
 * Layer tones tuned with APCA (same algorithm as danhollick/zebra).
 * Title text targets Lc ≥ 75 on its fill; body text Lc ≥ 75; strokes Lc ≥ 60.
 */
export type ToneId = "client" | "edge" | "service" | "agent" | "bus" | "store" | "outside" | "paper";

export type Tone = {
  fill: string;
  stroke: string;
  title: string;
  body: string;
};

export const tones: Record<ToneId, Tone> = {
  client: { fill: "#D6E6FF", stroke: "#0A2FCC", title: "#061F99", body: "#0C1A4A" },
  edge: { fill: "#E4DFFF", stroke: "#4A2FD6", title: "#2A1580", body: "#1A1240" },
  service: { fill: "#D4F2E8", stroke: "#0A6B4F", title: "#064C38", body: "#0A2E24" },
  agent: { fill: "#FFE4C2", stroke: "#8A4500", title: "#7A3A00", body: "#3D2200" },
  bus: { fill: "#FFF0B8", stroke: "#8A6A00", title: "#5C4700", body: "#2E2500" },
  store: { fill: "#F0E2D4", stroke: "#7A4E2A", title: "#5A3418", body: "#2E1A0C" },
  outside: { fill: "#E8E8EC", stroke: "#4A4A55", title: "#2A2A33", body: "#1A1A22" },
  paper: { fill: PAPER, stroke: BLUE, title: BLUE, body: INK },
};

export function Diagram({
  label,
  children,
  viewBox = "0 0 720 400",
  className,
}: {
  label: string;
  children: ReactNode;
  viewBox?: string;
  className?: string;
}) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={className ? `diagram ${className}` : "diagram"}>
      <defs>
        <filter id="select-glow" x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor={BLUE} floodOpacity="0.28" />
        </filter>
      </defs>
      {children}
    </svg>
  );
}

export function T({
  x,
  y,
  children,
  fill = INK,
  size = 11,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: string;
  fill?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={size}
      textAnchor={anchor}
      fontFamily='"Departure Mono", ui-monospace, monospace'
    >
      {children}
    </text>
  );
}

export function Oval({
  x,
  y,
  w,
  h,
  title,
  lines = [],
  tone = "paper",
  partId,
  selected = false,
  onSelect,
  icon,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  tone?: ToneId;
  icon?: string;
} & HitProps) {
  const t = tones[tone];
  const stroke = selected ? BLUE : t.stroke;
  return (
    <g
      className={partId ? `diagram-hit${selected ? " is-selected" : ""}` : undefined}
      filter={selected ? "url(#select-glow)" : undefined}
      {...hitHandlers(partId, onSelect)}
    >
      <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill={t.fill} stroke={stroke} strokeWidth={selected ? 2 : 1.75} />
      {icon ? <NodeIcon name={icon} x={x + w / 2 - 8} y={y + 10} color={t.title} /> : null}
      <T x={x + w / 2} y={y + h / 2 - (lines.length ? 6 : 0) + (icon ? 8 : 0)} fill={t.title} anchor="middle">
        {title}
      </T>
      {lines.map((line, index) => (
        <T key={line} x={x + w / 2} y={y + h / 2 + 14 + index * 16 + (icon ? 8 : 0)} fill={t.body} anchor="middle">
          {line}
        </T>
      ))}
    </g>
  );
}

export function Band({ y, name, tone = "edge" }: { y: number; name: string; tone?: ToneId }) {
  const t = tones[tone];
  return (
    <g>
      <rect x={4} y={y + 2} width={100} height={22} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth="1.25" />
      <T x={12} y={y + 17} fill={t.title}>
        {name}
      </T>
      <line x1={112} y1={y + 13} x2={756} y2={y + 13} stroke={t.stroke} strokeWidth="1" strokeOpacity="0.45" />
    </g>
  );
}

/** Vertical column label for left-to-right stack plates. */
export function VBand({
  x,
  y,
  h,
  name,
  tone = "edge",
}: {
  x: number;
  y: number;
  h: number;
  name: string;
  tone?: ToneId;
}) {
  const t = tones[tone];
  return (
    <g>
      <rect x={x} y={y} width={22} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth="1.25" />
      <text
        x={x + 11}
        y={y + h / 2}
        fill={t.title}
        fontSize="10"
        textAnchor="middle"
        fontFamily='"Departure Mono", ui-monospace, monospace'
        transform={`rotate(-90 ${x + 11} ${y + h / 2})`}
      >
        {name}
      </text>
    </g>
  );
}

export function Legend({
  x,
  y,
  items,
}: {
  x: number;
  y: number;
  items: Array<{ tone: ToneId; label: string }>;
}) {
  return (
    <g>
      {items.map((item, index) => {
        const t = tones[item.tone];
        const lx = x + index * 108;
        return (
          <g key={item.tone}>
            <rect x={lx} y={y} width={14} height={14} fill={t.fill} stroke={t.stroke} strokeWidth="1.25" />
            <T x={lx + 20} y={y + 11} fill={t.body} size={10}>
              {item.label}
            </T>
          </g>
        );
      })}
    </g>
  );
}

type HitProps = {
  partId?: string;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

function hitHandlers(partId: string | undefined, onSelect: ((id: string) => void) | undefined) {
  if (!partId || !onSelect) return {};
  return {
    role: "button" as const,
    tabIndex: 0,
    "data-click": "select",
    style: { cursor: "pointer" },
    onClick: (event: MouseEvent) => {
      event.stopPropagation();
      onSelect(partId);
    },
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect(partId);
        // Pointer clicks are handled by the document bridge; keyboard needs an explicit tick.
        playClick("select");
      }
    },
  };
}

export function Store({
  x,
  y,
  w,
  h,
  title,
  lines = [],
  partId,
  selected = false,
  onSelect,
  tone = "store",
  icon,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  tone?: ToneId;
  icon?: string;
} & HitProps) {
  const t = tones[tone];
  const ry = 9;
  const stroke = selected ? BLUE : t.stroke;
  const width = selected ? 2 : 1.75;
  const textX = icon ? x + 34 : x + 14;
  return (
    <g
      className={partId ? `diagram-hit${selected ? " is-selected" : ""}` : undefined}
      filter={selected ? "url(#select-glow)" : undefined}
      {...hitHandlers(partId, onSelect)}
    >
      <rect x={x} y={y + ry} width={w} height={Math.max(0, h - ry * 2)} fill={t.fill} stroke="none" />
      <path
        d={`M${x} ${y + ry} V${y + h - ry} A${w / 2} ${ry} 0 0 0 ${x + w} ${y + h - ry} V${y + ry}`}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
      />
      <ellipse cx={x + w / 2} cy={y + ry} rx={w / 2} ry={ry} fill={t.fill} stroke={stroke} strokeWidth={width} />
      {icon ? <NodeIcon name={icon} x={x + 12} y={y + 18} color={t.title} /> : null}
      <T x={textX} y={y + 32} fill={t.title}>
        {title}
      </T>
      {lines.map((line, index) => (
        <T key={line} x={textX} y={y + 50 + index * 16} fill={t.body}>
          {line}
        </T>
      ))}
    </g>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  title,
  lines = [],
  wash = false,
  partId,
  selected = false,
  onSelect,
  tone = "paper",
  icon,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  wash?: boolean;
  tone?: ToneId;
  icon?: string;
} & HitProps) {
  const t = wash && tone === "paper" ? tones.agent : tones[tone];
  const stroke = selected ? BLUE : t.stroke;
  const textX = icon ? x + 34 : x + 12;
  return (
    <g
      className={partId ? `diagram-hit${selected ? " is-selected" : ""}` : undefined}
      filter={selected ? "url(#select-glow)" : undefined}
      {...hitHandlers(partId, onSelect)}
    >
      <rect x={x} y={y} width={w} height={h} fill={t.fill} stroke={stroke} strokeWidth={selected ? 2 : 1.75} />
      {icon ? <NodeIcon name={icon} x={x + 12} y={y + 8} color={t.title} /> : null}
      <T x={textX} y={y + 20} fill={t.title}>
        {title}
      </T>
      {lines.map((line, index) => (
        <T key={line} x={textX} y={y + 38 + index * 14} fill={t.body} size={line.startsWith("(") ? 10 : 11}>
          {line}
        </T>
      ))}
    </g>
  );
}

export function Path({
  points,
  dashed = false,
  head = true,
  color = BLUE,
}: {
  points: Array<[number, number]>;
  dashed?: boolean;
  head?: boolean;
  color?: string;
}) {
  const id = `mk-${points.map((point) => point.join("x")).join("-")}-${dashed ? "d" : "s"}-${color.slice(1)}`;
  const d = points.map((point, index) => `${index === 0 ? "M" : "L"}${point[0]} ${point[1]}`).join(" ");
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0.4 0.6 L6 3.5 L0.4 6.4 Z" fill={color} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.35"
        strokeOpacity="0.7"
        strokeDasharray={dashed ? "5 4" : undefined}
        markerEnd={head ? `url(#${id})` : undefined}
      />
    </g>
  );
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  dashed = false,
  color = BLUE,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
  color?: string;
}) {
  const id = `mk-${x1}-${y1}-${x2}-${y2}-${dashed ? "d" : "s"}-${color.slice(1)}`;
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0.4 0.6 L6 3.5 L0.4 6.4 Z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="1.35"
        strokeOpacity="0.7"
        strokeDasharray={dashed ? "5 4" : undefined}
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}
