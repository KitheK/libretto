import { Link } from "react-router-dom";
import { useContent } from "../lib/ContentContext";

export function ContentsPage() {
  const { manual, scorecard } = useContent();
  if (scorecard.size === "lite") {
    return (
      <main className="page">
        <p>Lite Scorecards are a single page. Return to the summary.</p>
        <Link to="/">Summary</Link>
      </main>
    );
  }
  return (
    <main className="page">
      <h1>Contents</h1>
      {manual.parts.map((part) => (
        <section key={part.id} className="panel">
          <h2>
            {part.id}. {part.title}
          </h2>
          {part.blurb ? <p>{part.blurb}</p> : null}
          <div className="chapter-list">
            {manual.chapters
              .filter((c) => c.part === part.id)
              .map((c) => (
                <Link key={c.slug} to={`/chapters/${c.slug}`}>
                  <span className="mono">{c.number}</span> {c.title}
                </Link>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}
