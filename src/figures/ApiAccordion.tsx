import { useId, useState } from "react";
import { apiRoutes, type ApiRoute } from "../content/apis";
import { partIcons } from "./icons";
import { tones } from "./kit";

function RoutePanel({ route, open, onToggle }: { route: ApiRoute; open: boolean; onToggle: () => void }) {
  const panelId = useId();
  const Icon = partIcons[route.serviceId] ?? partIcons.kong;
  const tone = tones[route.serviceId === "agent" ? "agent" : route.jwt === "none" ? "edge" : "service"];
  return (
    <div className={`api-item${open ? " is-open" : ""}`} style={{ borderColor: open ? tone.stroke : undefined }}>
      <button
        type="button"
        className="api-summary"
        data-click="toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="api-summary-main">
          {Icon ? <Icon size={14} strokeWidth={1.75} color={tone.title} aria-hidden /> : null}
          <span className="mono api-path">{route.path}</span>
          <span className="mono api-up">{route.upstream}</span>
        </span>
        <span className="mono api-jwt" style={{ color: route.jwt === "none" ? tones.edge.title : tones.service.body }}>
          JWT {route.jwt}
        </span>
        <span className="api-chevron mono" aria-hidden>
          {open ? "▾" : "▸"}
        </span>
      </button>
      <div className={`api-panel-wrap${open ? " is-expanded" : ""}`} id={panelId} aria-hidden={!open}>
        <div className="api-panel">
          <p className="detail-label mono">CONTRACT</p>
          <p>{route.contract}</p>
          <p className="detail-label mono">METHODS / SURFACE</p>
          <p className="mono detail-ports">{route.methodHint}</p>
          <ul className="detail-facts">
            {route.surfaces.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="detail-label mono">DESIGN RATIONALE</p>
          <p>{route.rationale}</p>
          <p className="detail-label mono">PROJECT RELEVANCE</p>
          <p>{route.relevance}</p>
        </div>
      </div>
    </div>
  );
}

export function ApiAccordion({
  hint = "Expand a Kong prefix for contract, rationale, and why the route exists in an NL→LMS system.",
}: {
  hint?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="api-accordion">
      <p className="detail-hint mono">{hint}</p>
      <div className="api-list" role="list">
        {apiRoutes.map((route) => (
          <RoutePanel
            key={route.id}
            route={route}
            open={openId === route.id}
            onToggle={() => setOpenId((current) => (current === route.id ? null : route.id))}
          />
        ))}
      </div>
      <p className="mono api-footnote">WebSocket → notification:8004 bypasses this table (application-level auth on socket).</p>
    </div>
  );
}
