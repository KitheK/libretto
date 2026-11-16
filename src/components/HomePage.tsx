import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { chapters, faqs, homeFigure, parts, totalWords, wordCount } from "../content/manual";
import { ContentsDrawer } from "./ContentsDrawer";
import { ContentsPanel } from "./ContentsPanel";
import { PageEnter } from "./PageEnter";
import { PixelWordmark } from "./PixelWordmark";
import { Plate } from "./Plate";
import { ScrollStage } from "./ScrollStage";
import { DeskInteractives } from "./desk/DeskInteractives";
import { ReadingControls } from "./ReadingControls";
import { ShotStrip } from "./ShotStrip";

export function HomePage() {
  const [selected, setSelected] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const faq = faqs[selected];
  const words = totalWords();

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  return (
    <PageEnter>
      <ScrollStage>
        <ContentsDrawer open={navOpen} onClose={() => setNavOpen(false)} />
        <main className="home">
          <a className="skip" href="#essay">
            Skip to the essay
          </a>
          <nav className="home-nav" aria-label="Manual">
            <ContentsPanel open={navOpen} onToggle={() => setNavOpen((value) => !value)} />
            <div className="home-nav-end">
              <ReadingControls compact />
              <span className="mono">COSC 499 · CAPSTONE</span>
            </div>
          </nav>

          <header className="home-hero">
            <div className="home-copy" id="essay">
              <PixelWordmark text="LIBRETTO" cell={11} />
              <p className="kicker">A MANUAL OF CONDUCTOR · THE SAFE CANVAS MANAGEMENT PLATFORM</p>
              <p className="lede">
                Conductor is the platform. Libretto is this guide — named for the book that accompanies a score. An
                instructor types ordinary language; Conductor’s job is to turn that sentence into a reviewed Canvas
                instruction, without treating a language model as a safe holder of student data.
              </p>
              <p className="lede">
                At institutional scale, privacy is a boundary problem. Rosters, grades, and SIS identifiers must not travel
                with a prompt. Writes must wait for a person. Only one service may call Canvas, and it does so under the
                instructor’s own token.
              </p>
              <p className="lede">
                This book is the map of Conductor’s harness: microservices, the agent loop, and the choices that keep
                student data out of places an auditor cannot defend. Click the plates. The boxes open.
              </p>
            </div>
            <Plate id={homeFigure} compact />
          </header>

          <ShotStrip />
          <DeskInteractives />

          <section className="stats" aria-label="Manual statistics">
            <p className="mono">
              CHAPTERS
              <strong>{String(chapters.length).padStart(2, "0")}</strong>
            </p>
            <p className="mono">
              FIGURES
              <strong>10</strong>
            </p>
            <p className="mono">
              WORDS
              <strong>{words.toLocaleString("en-US")}</strong>
            </p>
            <p className="mono">
              SERVICES
              <strong>14</strong>
            </p>
          </section>

          <section aria-labelledby="contents-label">
            <h2 id="contents-label" className="section-label">
              CONTENTS
            </h2>
            {parts.map((part) => (
              <div className="part-block" key={part.id}>
                <h3 className="part-name">
                  {part.id}. {part.title}
                </h3>
                <p className="part-blurb">{part.blurb}</p>
                {chapters
                  .filter((chapter) => chapter.part === part.id)
                  .map((chapter) => (
                    <Link
                      className="contents-row"
                      key={chapter.slug}
                      to={`/chapters/${chapter.slug}`}
                      data-click="nav"
                    >
                      <span className="mono">{chapter.number}</span>
                      <span className="contents-title">{chapter.title}</span>
                      <span className="mono">{wordCount(chapter)} words</span>
                    </Link>
                  ))}
              </div>
            ))}
          </section>

          <section aria-labelledby="faq-label">
            <h2 id="faq-label" className="section-label">
              COMMON QUESTIONS
            </h2>
            <div className="faq">
              <div className="faq-list" role="listbox" aria-label="Questions">
                {faqs.map((item, index) => (
                  <button
                    key={item.question}
                    type="button"
                    role="option"
                    data-click="select"
                    aria-selected={index === selected}
                    onClick={() => setSelected(index)}
                  >
                    {item.question}
                  </button>
                ))}
              </div>
              <div className="faq-panel">
                <p className="io">IN</p>
                <p>{faq.question}</p>
                <p className="io">OUT</p>
                <p>{faq.answer}</p>
              </div>
            </div>
          </section>

          <footer className="colophon mono">
            UBCO COSC 499 · CONDUCTOR LIVES IN CAPSTONE-TEAM-1 · LIBRETTO IS THE MANUAL · DEPARTURE MONO 1.500
          </footer>
        </main>
      </ScrollStage>
    </PageEnter>
  );
}
