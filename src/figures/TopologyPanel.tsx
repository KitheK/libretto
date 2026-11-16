import { topologies } from "../content/topologies";
import type { FigureId } from "../content/manual";

export function TopologyPanel({ id }: { id: FigureId }) {
  const topo = topologies[id];
  if (!topo) return null;
  return (
    <details className="topology-panel">
      <summary className="mono">Topology · {topo.title}</summary>
      <pre className="topology-mermaid mono" tabIndex={0}>
        {topo.mermaid.trim()}
      </pre>
    </details>
  );
}
