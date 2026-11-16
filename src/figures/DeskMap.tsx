import { useId, useState } from "react";
import { deskGroups, type DeskGroup } from "../content/apis";
import { partIcons } from "./icons";
import { tones } from "./kit";

function GroupPanel({
  group,
  open,
  onToggle,
  dashed = false,
}: {
  group: DeskGroup;
  open: boolean;
  onToggle: () => void;
  dashed?: boolean;
}) {
  const panelId = useId();
  return (
    <section className={`desk-frame${dashed ? " is-dashed" : ""}${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="desk-frame-head"
        data-click="toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>
          <span className="mono desk-frame-title">{group.title}</span>
          <span className="desk-frame-guard">{group.guard}</span>
        </span>
        <span className="mono api-chevron" aria-hidden>
          {open ? "▾" : "▸"}
        </span>
      </button>
      <div className="desk-chips" aria-hidden={open ? undefined : true}>
        {group.routes.map((route) => {
          const Icon = route.serviceId ? partIcons[route.serviceId] : null;
          return (
            <span key={route.path} className="desk-chip mono">
              {Icon ? <Icon size={12} strokeWidth={1.75} color={tones.client.title} aria-hidden /> : null}
              {route.path}
            </span>
          );
        })}
      </div>
      <div className={`api-panel-wrap${open ? " is-expanded" : ""}`} id={panelId} aria-hidden={!open}>
        <div className="api-panel desk-panel">
          <p className="detail-label mono">ROUTES</p>
          <ul className="detail-facts">
            {group.routes.map((route) => (
              <li key={route.path}>
                <span className="mono">{route.path}</span> — {route.note}
              </li>
            ))}
          </ul>
          <p className="detail-label mono">DESIGN RATIONALE</p>
          <p>{group.rationale}</p>
          <p className="detail-label mono">PROJECT RELEVANCE</p>
          <p>{group.relevance}</p>
        </div>
      </div>
    </section>
  );
}

export function DeskMap() {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id));
  const guest = deskGroups.find((g) => g.id === "desk_guest")!;
  const onboarding = deskGroups.find((g) => g.id === "desk_onboarding")!;
  const instructor = deskGroups.find((g) => g.id === "desk_instructor")!;
  const admin = deskGroups.find((g) => g.id === "desk_admin")!;
  const settings = deskGroups.find((g) => g.id === "desk_settings")!;

  return (
    <div className="desk-map">
      <p className="detail-hint mono">Expand a guard group for route contracts and why the desk is partitioned this way.</p>
      <div className="desk-layout">
        <GroupPanel group={guest} open={openId === guest.id} onToggle={() => toggle(guest.id)} dashed />
        <div className="desk-signed">
          <p className="mono desk-signed-label">SIGNED IN · ProtectedRoute</p>
          <GroupPanel group={onboarding} open={openId === onboarding.id} onToggle={() => toggle(onboarding.id)} dashed />
          <div className="desk-roles">
            <GroupPanel group={instructor} open={openId === instructor.id} onToggle={() => toggle(instructor.id)} />
            <div className="desk-side">
              <GroupPanel group={admin} open={openId === admin.id} onToggle={() => toggle(admin.id)} />
              <GroupPanel group={settings} open={openId === settings.id} onToggle={() => toggle(settings.id)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
