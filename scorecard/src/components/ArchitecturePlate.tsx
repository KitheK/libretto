import { useContent } from "../lib/ContentContext";
import { Claim } from "./Claim";

export function ArchitecturePlate() {
  const { architecture, theme } = useContent();
  const frame = theme.ornaments.plateFrame;
  return (
    <div className="frame-wrap" data-frame={frame}>
      {frame !== "none" ? (
        <p className="mono frame-ornament" style={{ marginTop: 0 }}>
          Frame: {frame}
        </p>
      ) : null}
      {architecture.overview ? <Claim claim={architecture.overview} /> : null}
      <ul>
        {architecture.nodes.map((n) => (
          <li key={n.id}>
            <strong>{n.label}</strong>
            {n.path ? <span className="mono"> — {n.path}</span> : null}
          </li>
        ))}
      </ul>
      {architecture.mermaid ? <pre className="mermaid-block">{architecture.mermaid}</pre> : null}
    </div>
  );
}
