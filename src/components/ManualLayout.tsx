import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ContentsDrawer } from "./ContentsDrawer";
import { ContentsPanel } from "./ContentsPanel";
import { PageEnter } from "./PageEnter";
import { ReadingControls } from "./ReadingControls";

export function ManualLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={`shell${open ? " shell--nav-open" : ""}`}>
      <a className="skip" href="#chapter">
        Skip to chapter
      </a>
      <header className="sheet-chrome">
        <ContentsPanel open={open} onToggle={() => setOpen((value) => !value)} />
        <ReadingControls compact />
      </header>
      <ContentsDrawer open={open} onClose={() => setOpen(false)} />
      <div className="sheet" id="chapter">
        <PageEnter>{children}</PageEnter>
      </div>
    </div>
  );
}
