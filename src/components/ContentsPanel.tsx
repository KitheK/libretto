import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { PixelWordmark } from "./PixelWordmark";

/** Compact logo + burger chrome that opens the contents side panel. */
export function ContentsPanel({ open = false, onToggle }: { open?: boolean; onToggle: () => void }) {
  return (
    <div className="contents-panel">
      <Link className="contents-panel-mark" to="/" data-click="nav" aria-label="Libretto home">
        <PixelWordmark text="LIBRETTO" cell={2} />
      </Link>
      <button
        type="button"
        className="contents-panel-burger"
        data-click="nav"
        aria-expanded={open}
        aria-controls="libretto-contents"
        aria-label={open ? "Close contents" : "Open contents"}
        onClick={onToggle}
      >
        {open ? <X size={16} strokeWidth={1.75} aria-hidden /> : <Menu size={16} strokeWidth={1.75} aria-hidden />}
      </button>
    </div>
  );
}
