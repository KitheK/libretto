import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";

/** True after first idle slice (or timeout) so first paint stays free of ornament JS. */
export function useIdleReady(timeoutMs = 900) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const go = () => {
      if (!cancelled) setReady(true);
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(go, { timeout: timeoutMs });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }
    const id = window.setTimeout(go, Math.min(timeoutMs, 120));
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [timeoutMs]);
  return ready;
}

export const LazyFrieze = lazy(() => import("./nouveau").then((m) => ({ default: m.NouveauFrieze })));
export const LazyFrame = lazy(() => import("./nouveau").then((m) => ({ default: m.NouveauFrame })));

export function OrnamentSuspense({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
