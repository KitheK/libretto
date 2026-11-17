import { Claim } from "../components/Claim";
import { ArchitecturePlate } from "../components/ArchitecturePlate";
import { useContent } from "../lib/ContentContext";

export function ScorecardPage() {
  const { scorecard, run, decisions, stack } = useContent();
  const showArch = scorecard.size !== "lite" && stack.parts.length >= 3;

  return (
    <main className="page">
      <header className="scorecard-hero">
        <h1 className="display">SCORECARD</h1>
        <Claim claim={scorecard.job} as="p" />
      </header>

      <section className="panel" aria-labelledby="brief">
        <h2 id="brief">Brief and outcome</h2>
        <Claim claim={scorecard.brief} />
        <Claim claim={scorecard.outcome} />
      </section>

      <section className="panel" aria-labelledby="status">
        <h2 id="status">Status per feature</h2>
        {scorecard.features.map((f) => (
          <div className="feature-row" key={f.name} data-provenance={f.provenance}>
            <span className="badge" data-status={f.status}>
              {f.status}
            </span>
            <span>
              {f.name}
              {f.note ? ` — ${f.note}` : ""}
            </span>
          </div>
        ))}
        {scorecard.knownGap ? (
          <p>
            <strong>Biggest gap:</strong> <Claim claim={scorecard.knownGap} as="span" />
          </p>
        ) : null}
      </section>

      <section className="panel" aria-labelledby="built">
        <h2 id="built">Built vs borrowed</h2>
        <p>
          <strong>Built:</strong> <Claim claim={scorecard.built} as="span" />
        </p>
        <p>
          <strong>Borrowed:</strong> <Claim claim={scorecard.borrowed} as="span" />
        </p>
      </section>

      {scorecard.proof ? (
        <section className="panel" aria-labelledby="proof">
          <h2 id="proof">Proof</h2>
          <Claim claim={scorecard.proof} />
        </section>
      ) : null}

      <section className="panel" aria-labelledby="run">
        <h2 id="run">Run it</h2>
        <ol>
          {run.steps.map((s, i) => (
            <li key={i} data-provenance={s.provenance}>
              <strong>{s.title}</strong>
              {s.command ? <pre className="mono">{s.command}</pre> : null}
              {s.body ? <p>{s.body}</p> : null}
            </li>
          ))}
        </ol>
        <Claim claim={run.demoScript} />
      </section>

      {decisions.decisions.length > 0 && scorecard.size !== "lite" ? (
        <section className="panel" aria-labelledby="decisions">
          <h2 id="decisions">Decisions</h2>
          {decisions.decisions.map((d) => (
            <div key={d.id} data-provenance={d.provenance}>
              <p>
                <strong>{d.decision}</strong>
              </p>
              {d.reason ? <p>{d.reason}</p> : null}
            </div>
          ))}
        </section>
      ) : null}

      {showArch ? (
        <section className="panel" aria-labelledby="arch">
          <h2 id="arch">How it fits together</h2>
          <ArchitecturePlate />
        </section>
      ) : null}

      {scorecard.next ? (
        <section className="panel" aria-labelledby="next">
          <h2 id="next">Next</h2>
          <Claim claim={scorecard.next} />
        </section>
      ) : null}
    </main>
  );
}
