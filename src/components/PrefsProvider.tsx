import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { installClickSoundBridge, playClick } from "../lib/clickSound";
import {
  applyDocumentPrefs,
  getReadingFace,
  getReadingMode,
  getSoundEnabled,
  setReadingFace as persistFace,
  setReadingMode as persistReading,
  setSoundEnabled as persistSound,
  type ReadingFace,
} from "../lib/prefs";

type Prefs = {
  reading: boolean;
  face: ReadingFace;
  sound: boolean;
  toggleReading: () => void;
  setFace: (face: ReadingFace) => void;
  toggleFace: () => void;
  toggleSound: () => void;
};

const PrefsContext = createContext<Prefs | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [reading, setReading] = useState(() => getReadingMode());
  const [face, setFaceState] = useState<ReadingFace>(() => getReadingFace());
  const [sound, setSound] = useState(() => getSoundEnabled());

  useEffect(() => {
    applyDocumentPrefs(reading, face);
  }, [reading, face]);

  useEffect(() => installClickSoundBridge(), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        setReading((value) => {
          const next = !value;
          persistReading(next);
          return next;
        });
        playClick("toggle");
      }
      if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        setFaceState((value) => {
          const next = value === "serif" ? "sans" : "serif";
          persistFace(next);
          return next;
        });
        playClick("toggle");
      }
      if (event.key === "m" || event.key === "M") {
        event.preventDefault();
        setSound((value) => {
          const next = !value;
          persistSound(next);
          if (next) {
            // Defer so getSoundEnabled() sees the new value.
            Promise.resolve().then(() => playClick("toggle"));
          }
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleReading = useCallback(() => {
    setReading((value) => {
      const next = !value;
      persistReading(next);
      return next;
    });
  }, []);

  const setFace = useCallback((next: ReadingFace) => {
    setFaceState(next);
    persistFace(next);
  }, []);

  const toggleFace = useCallback(() => {
    setFaceState((value) => {
      const next = value === "serif" ? "sans" : "serif";
      persistFace(next);
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSound((value) => {
      const next = !value;
      persistSound(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ reading, face, sound, toggleReading, setFace, toggleFace, toggleSound }),
    [reading, face, sound, toggleReading, setFace, toggleFace, toggleSound],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): Prefs {
  const value = useContext(PrefsContext);
  if (!value) throw new Error("usePrefs must be used within PrefsProvider");
  return value;
}
