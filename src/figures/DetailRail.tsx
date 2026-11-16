import { stackParts } from "../content/stack";
import { partIcons } from "./icons";
import { tones, type ToneId } from "./kit";

const partTone: Record<string, ToneId> = {
  frontend: "client",
  kong: "edge",
  auth: "service",
  agent: "agent",
  notify: "service",
  mcp: "service",
  connector: "service",
  redis: "bus",
  postgres: "store",
  clickhouse: "store",
  volume: "store",
  canvas: "outside",
  llm: "outside",
  resend: "outside",
  model_step: "outside",
  execute_now: "service",
  pause_hitl: "agent",
};

export function DetailRail({
  partId,
  hint = "Click a box for the choice, the ports, and the privacy rule.",
}: {
  partId: string | null;
  hint?: string;
}) {
  const part = partId ? stackParts[partId] : undefined;
  if (!part) {
    return (
      <aside className="detail-rail" aria-live="polite">
        <p className="detail-hint mono">{hint}</p>
      </aside>
    );
  }
  const tone = tones[partTone[part.id] ?? "paper"];
  const Icon = partIcons[part.id];
  return (
    <aside
      key={part.id}
      className="detail-rail detail-rail--active"
      aria-live="polite"
      style={{ borderTopColor: tone.stroke }}
    >
      <p className="detail-kicker mono" style={{ color: tone.title }}>
        <span className="detail-swatch" style={{ background: tone.fill, borderColor: tone.stroke }} />
        {Icon ? <Icon size={14} color={tone.title} strokeWidth={1.75} aria-hidden /> : null}
        {part.id.toUpperCase()}
      </p>
      <h3 className="detail-title" style={{ color: tone.title }}>
        {part.title}
      </h3>
      <p className="detail-role">{part.role}</p>
      {part.facts?.length ? (
        <>
          <p className="detail-label mono">FACTS</p>
          <ul className="detail-facts">
            {part.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="detail-label mono">WHY</p>
      <p>{part.why}</p>
      <p className="detail-label mono">PRIVACY</p>
      <p>{part.privacy}</p>
      {part.ports ? (
        <>
          <p className="detail-label mono">PORTS</p>
          <p className="mono detail-ports">{part.ports}</p>
        </>
      ) : null}
      {part.links?.length ? (
        <>
          <p className="detail-label mono">CODE</p>
          <p className="mono detail-ports">{part.links.join(" · ")}</p>
        </>
      ) : null}
    </aside>
  );
}
