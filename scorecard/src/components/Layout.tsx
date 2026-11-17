import { Link, NavLink, Outlet } from "react-router-dom";
import { useContent } from "../lib/ContentContext";
import { FootFrieze } from "./FootFrieze";

export function Layout() {
  const { scorecard, theme } = useContent();
  const size = scorecard.size;
  return (
    <div className="shell">
      <header className="topbar no-print">
        <Link to="/" className="display" style={{ fontSize: "1.25rem", textDecoration: "none", color: "inherit" }}>
          SCORECARD
        </Link>
        <nav aria-label="Primary">
          <NavLink to="/" end>
            Summary
          </NavLink>
          {size !== "lite" ? <NavLink to="/contents">Contents</NavLink> : null}
          <NavLink to="/export">Export</NavLink>
          {import.meta.env.DEV ? <NavLink to="/write">Write</NavLink> : null}
        </nav>
        <span className="mono">{theme.scheme}</span>
      </header>
      <Outlet />
      <FootFrieze />
      <footer className="page mono" style={{ opacity: 0.7, paddingTop: 0 }}>
        Paleologue · Nouveau ornaments · descriptive only — never a grade
      </footer>
    </div>
  );
}
