import { Link } from "react-router-dom";

/** One-pager: how to spin up a Scorecard site like Libretto. */
export function MakeYourOwnPage() {
  return (
    <main className="chapter contents-page">
      <header className="chapter-head">
        <p className="mono">LIBRETTO / SCORECARD</p>
        <h1>Make your own.</h1>
        <p className="standfirst">
          Libretto is one manual. Scorecard is the kit and Cursor skill that builds a site like this for any project —
          descriptive only, never a grade.
        </p>
        <hr className="rule" />
      </header>

      <section className="part-block">
        <h2 className="part-name">1. What you get</h2>
        <p className="part-blurb">
          A Scorecard page (what it does, what works, what doesn’t, how to run it), optional chapters, architecture and
          timeline when the repo supports them, Paleologue type and Nouveau ornaments you can turn on or off, and a local
          Write mode so day-to-day edits feel like a diary — not a coding project.
        </p>
      </section>

      <section className="part-block">
        <h2 className="part-name">2. Setup once</h2>
        <p className="part-blurb">Needs Node 20+. In this repo:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
          {`cd scorecard
npm install
npx scorecard check
npx scorecard dev`}
        </pre>
        <p className="part-blurb">
          That opens Write mode. For a new project, run the <strong>scorecard</strong> Cursor skill: interview → scan →
          scaffold → fill content JSON → hand off to Write.
        </p>
      </section>

      <section className="part-block">
        <h2 className="part-name">3. Write forever</h2>
        <p className="part-blurb">
          Edit prose, Look (colours / ornaments), and Review (confirm draft claims) in the browser. Saves go to{" "}
          <span className="mono">content/*.json</span> on your machine. Publish with{" "}
          <span className="mono">npx scorecard build</span>, then host the static <span className="mono">dist/</span>{" "}
          (Pages, Netlify, Vercel, etc.).
        </p>
      </section>

      <section className="part-block">
        <h2 className="part-name">4. Sizes</h2>
        <p className="part-blurb">
          <strong>Lite</strong> — one page (hackathons, small scripts). <strong>Standard</strong> — a few chapters and
          plates when evidence exists. <strong>Full</strong> — Libretto-scale manual. The skill proposes a size; you
          confirm.
        </p>
      </section>

      <p className="part-blurb">
        Details live in <span className="mono">scorecard/README.md</span> and{" "}
        <span className="mono">skills/scorecard/</span>.{" "}
        <Link to="/" data-click="nav">
          Back to Libretto
        </Link>
        .
      </p>
    </main>
  );
}
