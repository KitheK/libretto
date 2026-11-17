import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { applyTheme } from "../theme/applyTheme";
import { loadContent, type ContentBundle } from "./loadContent";
import type { ThemeJson } from "./schemas";

type Ctx = ContentBundle & {
  setTheme: (t: ThemeJson) => void;
  replaceBundle: (b: ContentBundle) => void;
};

const ContentContext = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [bundle, setBundle] = useState(loadContent);
  useEffect(() => {
    applyTheme(bundle.theme);
  }, [bundle.theme]);

  const value = useMemo<Ctx>(
    () => ({
      ...bundle,
      setTheme: (theme) => setBundle((b) => ({ ...b, theme })),
      replaceBundle: setBundle,
    }),
    [bundle],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent outside provider");
  return ctx;
}
