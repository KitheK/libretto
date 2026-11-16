const GLYPHS: Record<string, string[]> = {
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
};

export function PixelWordmark({ text, cell = 8 }: { text: string; cell?: number }) {
  const letters = text.toUpperCase().split("");
  const advance = 6 * cell;
  const width = letters.length * advance - cell;
  const height = 7 * cell;
  const rects: { key: string; x: number; y: number }[] = [];

  letters.forEach((letter, letterIndex) => {
    const rows = GLYPHS[letter];
    if (!rows) {
      return;
    }
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
      aria-label={text}
      shapeRendering="crispEdges"
    >
      {rects.map((rect) => (
        <rect key={rect.key} x={rect.x} y={rect.y} width={cell - 1} height={cell - 1} fill="currentColor" />
      ))}
    </svg>
  );
}
