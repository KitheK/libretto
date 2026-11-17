import { lazy, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import { chapters, parts } from "../content/manual";
import { PixelWordmark } from "./PixelWordmark";
import { ReadingControls } from "./ReadingControls";

const LazyFrieze = lazy(() => import("./nouveau").then((m) => ({ default: m.NouveauFrieze })));

export function ContentsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation();

  return (
    <>
      {open ? (
        <button className="backdrop" type="button" data-click="nav" aria-label="Close contents" onClick={onClose} />
      ) : null}
      <aside id="libretto-contents" className={open ? "sidebar open" : "sidebar"} aria-hidden={!open}>
        <Link className="mark" to="/" data-click="nav" onClick={onClose}>
          <PixelWordmark text="LIBRETTO" cell={3} />
        </Link>
        {open ? (
          <div className="sidebar-frieze" aria-hidden="true">
            <Suspense fallback={null}>
              <LazyFrieze variant="lys33" height={48} palette="libretto" crop="band" ground={false} animate={false} />
            </Suspense>
          </div>
        ) : null}
        <div className="sidebar-prefs">
          <ReadingControls compact />
        </div>
        <nav aria-label="Chapters">
          {parts.map((part) => (
            <div className="nav-part" key={part.id}>
              <p>
                {part.id} {part.title}
              </p>
              {chapters
                .filter((chapter) => chapter.part === part.id)
                .map((chapter) => {
                  const href = `/chapters/${chapter.slug}`;
                  return (
                    <Link
                      key={chapter.slug}
                      className="nav-link"
                      to={href}
                      data-click="nav"
                      aria-current={pathname === href ? "page" : undefined}
                      onClick={onClose}
                    >
                      <span>{chapter.number}</span>
                      {chapter.title}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
