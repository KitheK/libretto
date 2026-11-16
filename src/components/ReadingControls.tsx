import { BookOpen, BookOpenText, Volume2, VolumeX } from "lucide-react";
import { playClick } from "../lib/clickSound";
import { usePrefs } from "./PrefsProvider";

export function ReadingControls({ compact = false }: { compact?: boolean }) {
  const { reading, face, sound, toggleReading, toggleFace, toggleSound } = usePrefs();

  return (
    <div className={`reading-controls ${compact ? "reading-controls--compact" : ""}`} role="group" aria-label="Reading preferences">
      <button
        type="button"
        className="reading-control"
        data-click="toggle"
        aria-pressed={reading}
        aria-label={reading ? "Exit reading mode" : "Enter reading mode"}
        title="Reading mode (R)"
        onClick={toggleReading}
      >
        {reading ? <BookOpenText size={16} strokeWidth={1.75} aria-hidden /> : <BookOpen size={16} strokeWidth={1.75} aria-hidden />}
        {!compact ? <span>{reading ? "Reading" : "Browse"}</span> : null}
      </button>
      <button
        type="button"
        className="reading-control"
        data-click="toggle"
        aria-pressed={face === "sans"}
        aria-label={face === "serif" ? "Use sans-serif for reading" : "Use serif for reading"}
        title="Toggle typeface (F)"
        onClick={toggleFace}
      >
        <span className={`reading-face-mark reading-face-mark--${face}`} aria-hidden>
          Aa
        </span>
        {!compact ? <span>{face === "serif" ? "Serif" : "Sans"}</span> : null}
      </button>
      <button
        type="button"
        className="reading-control"
        aria-pressed={sound}
        aria-label={sound ? "Mute click sounds" : "Enable click sounds"}
        title="Click sounds (M)"
        onClick={() => {
          const enabling = !sound;
          toggleSound();
          if (enabling) {
            Promise.resolve().then(() => playClick("toggle"));
          }
        }}
      >
        {sound ? <Volume2 size={16} strokeWidth={1.75} aria-hidden /> : <VolumeX size={16} strokeWidth={1.75} aria-hidden />}
        {!compact ? <span>{sound ? "Sound" : "Muted"}</span> : null}
      </button>
    </div>
  );
}
