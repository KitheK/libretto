import { plates } from "../figures/plates";
import type { FigureId } from "../content/manual";
import { OrnamentFrame } from "./OrnamentFrame";

/** System architecture diagrams use the coins46 drawing frame. */
export function Plate({ id, compact = false }: { id: FigureId; compact?: boolean }) {
  const plate = plates[id];
  const captionId = `${plate.id}-caption`;
  return (
    <figure className={compact ? "plate plate--compact plate--framed" : "plate plate--framed"} aria-labelledby={captionId}>
      <OrnamentFrame variant="coins46" scale={compact ? 0.72 : 0.88} gap={compact ? 6 : 10} className="plate-frame">
        <div className="plate-sheet">
          <span className="fig-index">{plate.id}</span>
          {plate.canvas}
          <span className="plate-name">[ {plate.name} ]</span>
        </div>
      </OrnamentFrame>
      <figcaption id={captionId}>{plate.caption}</figcaption>
    </figure>
  );
}
