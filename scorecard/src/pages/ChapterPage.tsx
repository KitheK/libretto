import { Link, useParams } from "react-router-dom";
import { ArchitecturePlate } from "../components/ArchitecturePlate";
import { TimelinePlate } from "../components/TimelinePlate";
import { useContent } from "../lib/ContentContext";
import { ScorecardPage } from "./ScorecardPage";

export function ChapterPage() {
  const { slug = "" } = useParams();
  const { manual, scorecard } = useContent();
  if (scorecard.size === "lite") return <ScorecardPage />;
  const chapter = manual.chapters.find((c) => c.slug === slug);
  if (!chapter) {
    return (
      <main className="page">
        <h1>Missing chapter</h1>
        <Link to="/contents">Contents</Link>
      </main>
    );
  }
  return (
    <main className="page">
      <p className="mono">
        {chapter.number} / {chapter.part}
      </p>
      <h1>{chapter.title}</h1>
      {chapter.standfirst ? <p className="lede">{chapter.standfirst}</p> : null}
      {chapter.blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
        if (b.type === "p")
          return (
            <p key={i} className="claim" data-provenance={b.provenance}>
              {b.text}
            </p>
          );
        if (b.type === "architecture") return <ArchitecturePlate key={i} />;
        if (b.type === "timeline") return <TimelinePlate key={i} />;
        if (b.type === "status")
          return (
            <p key={i} className="mono">
              See the Scorecard summary for feature status.
            </p>
          );
        if (b.type === "run")
          return (
            <p key={i}>
              <Link to="/">Open Run it on the summary</Link>
            </p>
          );
        return null;
      })}
      <p>
        <Link to="/contents">Contents</Link>
      </p>
    </main>
  );
}
