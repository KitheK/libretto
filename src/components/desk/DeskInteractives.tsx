import { clips } from "../../content/live";
import { LiveConductor } from "./LiveConductor";
import { MotionClip } from "./MotionClip";

export function DeskInteractives() {
  return (
    <section className="desk-interactives" aria-labelledby="desk-play-label">
      <h2 id="desk-play-label" className="section-label">
        CONDUCTOR · TRY THE DESK
      </h2>
      <p className="desk-interactives-lede">
        This is not a picture of Conductor. It is Conductor’s own frontend, running in the plate below against a mock
        backend. Switch it between light and dark, then watch the recordings under it: the agent thinking through its
        tools, a write waiting for review, and the assistant’s greeting.
      </p>
      <LiveConductor />
      <div className="desk-motion-grid">
        {clips.map((clip) => (
          <MotionClip key={clip.id} clip={clip} />
        ))}
      </div>
    </section>
  );
}
