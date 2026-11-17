import { Link } from "react-router-dom";
import { chapters, parts, totalWords, wordCount } from "../content/manual";
import { LazyFrieze, OrnamentSuspense, useIdleReady } from "./ornamentLazy";

export function ContentsPage() {
  const ornamentsReady = useIdleReady(180);

  return (
    <main className="contents-page">
      <header className="chapter-head">
        <p className="mono">LIBRETTO / CONTENTS</p>
        <h1>Table of contents.</h1>
        <p className="standfirst">
          {chapters.length} chapters, {totalWords().toLocaleString("en-US")} words, ten plates. Libretto describes
          Conductor — the stack in the capstone compose file.
        </p>
        <hr className="rule" />
      </header>
      {parts.map((part) => (
        <section className="part-block" key={part.id} aria-labelledby={`part-${part.id}`}>
          <h2 className="part-name" id={`part-${part.id}`}>
            {part.id}. {part.title}
          </h2>
          <p className="part-blurb">{part.blurb}</p>
          {chapters
            .filter((chapter) => chapter.part === part.id)
            .map((chapter) => (
              <Link className="contents-row" data-click="nav" key={chapter.slug} to={`/chapters/${chapter.slug}`}>
                <span className="mono">{chapter.number}</span>
                <span className="contents-title">{chapter.title}</span>
                <span className="mono">{wordCount(chapter)} words</span>
              </Link>
            ))}
        </section>
      ))}
      {ornamentsReady ? (
        <div className="toc-frieze toc-frieze--foot" aria-hidden="true">
          <OrnamentSuspense>
            <LazyFrieze variant="pavot30" height={64} palette="libretto" crop="band" ground={false} animate={false} />
          </OrnamentSuspense>
        </div>
      ) : null}
    </main>
  );
}
