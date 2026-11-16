import { conductorWalk, shotById } from "../content/shots";
import { ShotFigure } from "./ShotFigure";

export function Walkthrough() {
  return (
    <ol className="walk">
      {conductorWalk.map((step) => {
        const shot = step.shot ? shotById(step.shot) : undefined;
        return (
          <li className="walk-step" key={step.n}>
            <p className="mono walk-n">{step.n}</p>
            <h3 className="walk-title">{step.title}</h3>
            <p className="walk-text">{step.text}</p>
            {shot ? <ShotFigure shot={shot} /> : null}
          </li>
        );
      })}
    </ol>
  );
}
