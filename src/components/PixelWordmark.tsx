import { useId } from "react";

const GLYPHS: Record<string, string[]> = {
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
};

/**
 * Hero (cell > 8): arched Paleologue poster capitals.
 * Chrome: original blue pixel mark (hamburger / drawer).
 */
export function PixelWordmark({ text, cell = 8 }: { text: string; cell?: number }) {
  const label = text.toUpperCase();

  if (cell > 8) {
    const pathId = useId().replace(/:/g, "");
    // Stronger STANDARD-style arch; viewBox keeps copy-column width.
    const w = 720;
    const h = 200;
    const y = 168;
    const rise = 88;
    return (
      <svg
        className="wordmark wordmark-pal wordmark-pal--lg wordmark-pal--poster"
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={label}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <path id={pathId} d={`M 16 ${y} Q ${w / 2} ${y - rise} ${w - 16} ${y}`} />
        </defs>
        <text className="wordmark-pal-arc-text">
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
      </svg>
    );
  }

  const letters = label.split("");
  const advance = 6 * cell;
  const width = letters.length * advance - cell;
  const height = 7 * cell;
  const rects: { key: string; x: number; y: number }[] = [];

  letters.forEach((letter, letterIndex) => {
    const rows = GLYPHS[letter];
    if (!rows) return;
    rows.forEach((row, y) => {
      [...row].forEach((bit, x) => {
        if (bit === "1") {
          rects.push({ key: `${letterIndex}-${x}-${y}`, x: letterIndex * advance + x * cell, y: y * cell });
        }
      });
    });
  });

  return (
    <svg
      className="wordmark"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      {rects.map((rect) => (
        <rect key={rect.key} x={rect.x} y={rect.y} width={cell - 1} height={cell - 1} fill="currentColor" />
      ))}
    </svg>
  );
}
