import { useState, type ReactNode } from "react";
import type { FigureId } from "../content/manual";
import { DetailRail } from "./DetailRail";
import { TopologyPanel } from "./TopologyPanel";

export function InteractivePlate({
  id,
  hint,
  defaultPart,
  children,
  rail = true,
  footer,
}: {
  id: FigureId;
  hint?: string;
  defaultPart?: string | null;
  rail?: boolean;
  footer?: ReactNode;
  children: (args: {
    partId: string | null;
    pick: (id: string) => void;
    selected: (id: string) => boolean;
  }) => ReactNode;
}) {
  const [partId, setPartId] = useState<string | null>(defaultPart ?? null);
  const pick = (next: string) => setPartId((current) => (current === next ? null : next));
  const selected = (next: string) => partId === next;
  return (
    <div className="interactive-plate">
      {children({ partId, pick, selected })}
      {footer}
      {rail ? <DetailRail partId={partId} hint={hint} /> : null}
      <TopologyPanel id={id} />
    </div>
  );
}
