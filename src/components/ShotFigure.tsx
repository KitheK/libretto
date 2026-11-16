import { useState } from "react";
import type { Shot } from "../content/shots";

export function ShotFigure({ shot }: { shot: Shot }) {
  const [dark, setDark] = useState(false);
  const src = dark && shot.srcDark ? shot.srcDark : shot.src;

  return (
    <figure className="shot">
      <div className="shot-frame">
        <img src={src} alt={dark ? `${shot.alt} (dark mode)` : shot.alt} loading="lazy" decoding="async" />
        {shot.srcDark ? (
          <div className="shot-theme" role="group" aria-label="Screenshot theme">
            <button type="button" className="mono" data-click="toggle" aria-pressed={!dark} onClick={() => setDark(false)}>
              LIGHT
            </button>
            <button type="button" className="mono" data-click="toggle" aria-pressed={dark} onClick={() => setDark(true)}>
              DARK
            </button>
          </div>
        ) : null}
      </div>
      <figcaption>
        <span className="mono">{shot.page}</span>
        <span>{shot.caption}</span>
      </figcaption>
    </figure>
  );
}
