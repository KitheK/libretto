import { liveShots } from "../content/shots";
import { ShotFigure } from "./ShotFigure";

const HOME_SHOTS = ["live-dashboard", "live-course", "live-assistant", "live-history"] as const;

export function ShotStrip() {
  const shots = HOME_SHOTS.map((id) => liveShots.find((shot) => shot.id === id)).filter(
    (shot): shot is (typeof liveShots)[number] => Boolean(shot),
  );

  return (
    <section className="shot-strip" aria-labelledby="desk-label">
      <h2 id="desk-label" className="section-label">
        CONDUCTOR · THE DESK
      </h2>
      <p className="shot-strip-lede">
        Screens from the real Conductor frontend, with a Canvas key connected and mock course data. Each one has a light
        and a dark capture. Libretto is the score; these pages are the instrument.
      </p>
      <div className="shot-strip-grid">
        {shots.map((shot) => (
          <ShotFigure key={shot.id} shot={shot} />
        ))}
      </div>
    </section>
  );
}
