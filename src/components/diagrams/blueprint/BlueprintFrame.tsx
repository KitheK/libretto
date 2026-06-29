import type { ReactNode } from 'react';

export const BLUEPRINT = {
  ink: '#2563eb',
  paper: '#f1f5f9',
  panel: '#f8fafc',
  gridMinor: 'rgba(37, 99, 235, 0.08)',
  gridMajor: 'rgba(37, 99, 235, 0.15)',
  hatch: 'rgba(37, 99, 235, 0.25)',
  label: 'rgba(37, 99, 235, 0.7)',
} as const;

export function BlueprintStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&display=swap');
      .blueprint-text {
        font-family: 'Fira Code', 'Share Tech Mono', 'Courier New', monospace;
        fill: ${BLUEPRINT.ink};
      }
      .blueprint-title { font-weight: 700; letter-spacing: 1.5px; }
      .blueprint-label {
        font-size: 10px;
        fill: ${BLUEPRINT.label};
        letter-spacing: 0.5px;
      }
      .node-box { fill: ${BLUEPRINT.panel}; stroke: ${BLUEPRINT.ink}; stroke-width: 2; }
      .node-inner {
        fill: none;
        stroke: ${BLUEPRINT.ink};
        stroke-width: 1;
        stroke-dasharray: 4 4;
      }
      .wire { fill: none; stroke: ${BLUEPRINT.ink}; stroke-width: 1.5; }
      .boundary {
        fill: none;
        stroke: ${BLUEPRINT.ink};
        stroke-width: 2;
        stroke-dasharray: 10 8;
      }
      @media (prefers-reduced-motion: reduce) {
        #animated-packets { display: none; }
      }
    `}</style>
  );
}

export function BlueprintDefs() {
  const { ink, gridMinor, gridMajor, hatch } = BLUEPRINT;
  return (
    <defs>
      <pattern id="grid-small" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridMinor} strokeWidth="1" />
      </pattern>
      <pattern id="grid-large" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="url(#grid-small)" stroke={gridMajor} strokeWidth="1" />
      </pattern>
      <pattern
        id="diagonal-hatch"
        width="8"
        height="8"
        patternTransform="rotate(45 0 0)"
        patternUnits="userSpaceOnUse"
      >
        <line x1="0" y1="0" x2="0" y2="8" stroke={hatch} strokeWidth="1" />
      </pattern>
      <marker id="head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={ink} strokeWidth="1.5" />
      </marker>
      <marker id="tail" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 10 1 L 1 5 L 10 9" fill="none" stroke={ink} strokeWidth="1.5" />
      </marker>
      <filter id="blueprint-shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="3" dy="3" stdDeviation="0" floodColor={ink} floodOpacity="0.3" />
      </filter>
    </defs>
  );
}

type BlueprintFrameProps = {
  figId: string;
  title: string;
  rev?: string;
  date?: string;
  children: ReactNode;
};

export function BlueprintFrame({
  figId,
  title,
  rev = 'A',
  date = '2026-06-18',
  children,
}: BlueprintFrameProps) {
  const { ink, paper } = BLUEPRINT;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="auto" role="img">
      <BlueprintStyles />
      <BlueprintDefs />

      <rect width="100%" height="100%" fill={paper} />
      <rect width="100%" height="100%" fill="url(#grid-large)" />

      <rect x="15" y="15" width="1170" height="770" fill="none" stroke={ink} strokeWidth="2" />
      <rect x="22" y="22" width="1156" height="756" fill="none" stroke={ink} strokeWidth="1" strokeDasharray="6 4" />
      <path
        d="M 15 35 L 15 15 L 35 15 M 1185 35 L 1185 15 L 1165 15 M 15 765 L 15 785 L 35 785 M 1185 765 L 1185 785 L 1165 785"
        fill="none"
        stroke={ink}
        strokeWidth="3"
      />

      <g transform="translate(940, 720)">
        <rect x="0" y="0" width="240" height="60" fill={BLUEPRINT.panel} stroke={ink} strokeWidth="2" />
        <line x1="0" y1="25" x2="240" y2="25" stroke={ink} strokeWidth="2" />
        <line x1="120" y1="25" x2="120" y2="60" stroke={ink} strokeWidth="2" />
        <line x1="0" y1="45" x2="240" y2="45" stroke={ink} strokeWidth="2" />
        <text x="10" y="16" className="blueprint-text blueprint-title" fontSize="14">
          {figId}
        </text>
        <text x="130" y="16" className="blueprint-text blueprint-title" fontSize="14" textAnchor="middle">
          REV
        </text>
        <text x="190" y="16" className="blueprint-text" fontSize="14">
          {rev}
        </text>
        <text x="10" y="40" className="blueprint-text" fontSize="10">
          TITLE
        </text>
        <text x="130" y="40" className="blueprint-text" fontSize="10">
          DATE
        </text>
        <text x="10" y="57" className="blueprint-text blueprint-title" fontSize="12">
          {title}
        </text>
        <text x="130" y="57" className="blueprint-text" fontSize="12">
          {date}
        </text>
      </g>

      <g transform="translate(40, 740)">
        <line x1="0" y1="0" x2="100" y2="0" stroke={ink} strokeWidth="2" />
        <line x1="0" y1="-5" x2="0" y2="5" stroke={ink} strokeWidth="2" />
        <line x1="25" y1="-5" x2="25" y2="5" stroke={ink} strokeWidth="1" />
        <line x1="50" y1="-5" x2="50" y2="5" stroke={ink} strokeWidth="2" />
        <line x1="75" y1="-5" x2="75" y2="5" stroke={ink} strokeWidth="1" />
        <line x1="100" y1="-5" x2="100" y2="5" stroke={ink} strokeWidth="2" />
        <text x="50" y="-8" className="blueprint-text blueprint-label" textAnchor="middle">
          SCALE: 1:1
        </text>
      </g>

      {children}
    </svg>
  );
}

function NodeBox({
  x,
  y,
  w,
  h,
  title,
  subtitle,
  titleSize = 13,
  rx = 0,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle?: string;
  titleSize?: number;
  rx?: number;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g className="node" filter="url(#blueprint-shadow)">
      <rect x={x + 6} y={y + 6} width={w} height={h} rx={rx} fill="url(#diagonal-hatch)" stroke="none" />
      <rect x={x} y={y} width={w} height={h} rx={rx} className="node-box" />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={Math.max(0, rx - 2)} className="node-inner" />
      <text x={cx} y={subtitle ? cy - 6 : cy + 4} className="blueprint-text blueprint-title" fontSize={titleSize} textAnchor="middle">
        {title}
      </text>
      {subtitle && (
        <text x={cx} y={cy + 12} className="blueprint-text blueprint-label" textAnchor="middle">
          {subtitle}
        </text>
      )}
    </g>
  );
}

function DbCylinder({
  x,
  y,
  w,
  h,
  rx,
  title,
  subtitle,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  title: string;
  subtitle: string;
}) {
  const cx = x + w / 2;
  const bodyBottom = y + h;
  return (
    <g className="node" filter="url(#blueprint-shadow)">
      <path
        d={`M ${x + 6} ${y + 16} L ${x + 6} ${bodyBottom + 6} A ${rx} 15 0 0 0 ${x + w + 6} ${bodyBottom + 6} L ${x + w + 6} ${y + 16} Z`}
        fill="url(#diagonal-hatch)"
        stroke="none"
      />
      <ellipse cx={cx + 6} cy={y + 16} rx={rx} ry="15" fill="url(#diagonal-hatch)" stroke="none" />
      <path
        d={`M ${x} ${y + 10} L ${x} ${bodyBottom} A ${rx} 15 0 0 0 ${x + w} ${bodyBottom} L ${x + w} ${y + 10} Z`}
        className="node-box"
      />
      <ellipse cx={cx} cy={y + 10} rx={rx} ry="15" className="node-box" />
      <text x={cx} y={y + h - 18} className="blueprint-text blueprint-title" fontSize="13" textAnchor="middle">
        {title}
      </text>
      <text x={cx} y={y + h - 2} className="blueprint-text blueprint-label" textAnchor="middle">
        {subtitle}
      </text>
    </g>
  );
}

function Packet({ pathId, dur }: { pathId: string; dur: string }) {
  return (
    <circle r="3.5" fill="#ffffff" stroke={BLUEPRINT.ink} strokeWidth="1.5">
      <animateMotion dur={dur} repeatCount="indefinite">
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  );
}

export { NodeBox, DbCylinder, Packet };
