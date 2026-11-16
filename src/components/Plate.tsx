import { plates } from "../figures/plates";
import type { FigureId } from "../content/manual";

export function Plate({ id, compact = false }: { id: FigureId; compact?: boolean }) {
  const plate = plates[id];
  const captionId = `${plate.id}-caption`;
  return (
    <figure className={compact ? "plate plate--compact" : "plate"} aria-labelledby={captionId}>
      <div className="plate-sheet">
        <span className="fig-index">{plate.id}</span>
        {plate.canvas}
        <span className="plate-name">[ {plate.name} ]</span>
      </div>
      <figcaption id={captionId}>{plate.caption}</figcaption>
    </figure>
  );
}
