import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { chapterBySlug, chapters, wordCount } from "../content/manual";
import { shotById } from "../content/shots";
import { OrnamentFrame } from "./OrnamentFrame";
import { Plate } from "./Plate";
import { RichText } from "./RichText";
import { clipById } from "../content/live";
import { LiveConductor } from "./desk/LiveConductor";
import { MotionClip } from "./desk/MotionClip";
import { ShotFigure } from "./ShotFigure";
import { Walkthrough } from "./Walkthrough";

export function ChapterPage() {
  const { slug = "" } = useParams();
  const chapter = chapterBySlug(slug);
  const index = chapters.findIndex((item) => item.slug === slug);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!chapter) {
      document.title = "Missing plate — Libretto";
      return;
    }
    document.title = `${chapter.number} ${chapter.title} — Libretto`;
    window.scrollTo(0, 0);
  }, [chapter]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!chapter) {
    return (
      <main className="missing">
        <h1>That plate is not in the book.</h1>
        <p>
          <Link to="/contents" data-click="nav">
            Return to the contents.
          </Link>
        </p>
      </main>
    );
  }

  const previous = index > 0 ? chapters[index - 1] : undefined;
  const next = index < chapters.length - 1 ? chapters[index + 1] : undefined;

  return (
    <>
      <p className="ruler-readout" aria-hidden="true">
        {progress.toFixed(2)}
      </p>
      <div className="ruler" aria-hidden="true" />
      <main className="chapter">
        <header className="chapter-head">
          <p className="mono">
            <Link className="crumb" to="/" data-click="nav">
              Libretto
            </Link>
            {" / "}
            <Link className="crumb" to="/contents" data-click="nav">
              {chapter.number}
            </Link>
          </p>
          <p className="mono">{wordCount(chapter)} WORDS</p>
          <h1>{chapter.title}</h1>
          <p className="standfirst">{chapter.standfirst}</p>
          <hr className="rule" />
        </header>
        <div className="prose">
          {chapter.blocks.map((block, blockIndex) => {
            if (block.type === "h2") {
              return <h2 key={block.text}>{block.text}</h2>;
            }
            if (block.type === "p") {
              return (
                <p key={blockIndex}>
                  <RichText text={block.text} />
                </p>
              );
            }
            if (block.type === "walk") {
              return <Walkthrough key={`walk-${blockIndex}`} />;
            }
            if (block.type === "shot") {
              const shot = shotById(block.id);
              return shot ? <ShotFigure key={shot.id} shot={shot} /> : null;
            }
            if (block.type === "live") {
              return (
                <div className="chapter-desk" key={`live-${blockIndex}`}>
                  <OrnamentFrame variant="pavot30" scale={0.78} gap={10} className="demo-callout">
                    <LiveConductor initialRoute={block.route} />
                  </OrnamentFrame>
                </div>
              );
            }
            if (block.type === "motion") {
              const clip = clipById(block.id);
              return clip ? (
                <div className="chapter-desk" key={`motion-${block.id}`}>
                  <OrnamentFrame variant="pavot30" scale={0.72} gap={6} className="demo-callout">
                    <MotionClip clip={clip} wide />
                  </OrnamentFrame>
                </div>
              ) : null;
            }
            return <Plate key={block.id} id={block.id} />;
          })}
        </div>
        <p className="section-label" style={{ maxWidth: "38rem", marginInline: "auto" }}>
          SOURCE
        </p>
        <ul className="sources">
          {chapter.sources.map((source) => (
            <li key={source.href}>
              <a href={source.href}>{source.label}</a>
            </li>
          ))}
        </ul>
        <nav className="pager" aria-label="Chapters">
          {previous ? (
            <Link to={`/chapters/${previous.slug}`} data-click="nav">
              {previous.number} {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/chapters/${next.slug}`} data-click="nav">
              {next.number} {next.title}
            </Link>
          ) : (
            <Link to="/contents" data-click="nav">
              Contents
            </Link>
          )}
        </nav>
      </main>
    </>
  );
}
