import { ExternalLink, Moon, RotateCcw, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LIVE_SOURCE, liveRoutes, liveUrl } from "../../content/live";

type Theme = "light" | "dark";

const APP_WIDTH = 1280;
const APP_HEIGHT = 800;

/**
 * The real Conductor frontend in a framed plate. The iframe is same-origin, so
 * the Libretto switch asks the embed (postMessage) to press Conductor's own
 * ThemeToggle; the embed reports back whenever its <html class="dark"> changes,
 * so the plate also follows clicks on the toggle inside the app.
 */
export function LiveConductor({ initialRoute = "/dashboard" }: { initialRoute?: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [route, setRoute] = useState(initialRoute);
  const [theme, setTheme] = useState<Theme>("light");
  const [path, setPath] = useState(initialRoute);
  const [scale, setScale] = useState(0.6);
  const [active, setActive] = useState(false);
  const [src, setSrc] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const resize = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / APP_WIDTH);
    });
    resize.observe(wrap);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActive(true);
      },
      { rootMargin: "120px", threshold: 0.05 },
    );
    io.observe(wrap);
    return () => {
      resize.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!active || src) return;
    setSrc(liveUrl(route, theme));
  }, [active, route, theme, src]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      const data = event.data as { type?: string; theme?: Theme; path?: string };
      if (data?.type !== "conductor:theme") return;
      if (data.theme === "light" || data.theme === "dark") setTheme(data.theme);
      if (typeof data.path === "string") setPath(data.path);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const requestTheme = useCallback((next: Theme) => {
    setTheme(next);
    frameRef.current?.contentWindow?.postMessage({ type: "conductor:set-theme", theme: next }, window.location.origin);
  }, []);

  const go = (next: string) => {
    setRoute(next);
    setLoaded(false);
    if (active) setSrc(liveUrl(next, theme));
  };

  return (
    <figure className="live" data-theme={theme}>
      <div className="live-bar">
        <span className="live-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="live-address mono" title={LIVE_SOURCE}>
          conductor{path}
        </span>
        <div className="live-switch" role="group" aria-label="Conductor theme">
          <button type="button" data-click="toggle" aria-pressed={theme === "light"} onClick={() => requestTheme("light")}>
            <Sun size={13} strokeWidth={2} aria-hidden="true" />
            <span className="mono">LIGHT</span>
          </button>
          <button type="button" data-click="toggle" aria-pressed={theme === "dark"} onClick={() => requestTheme("dark")}>
            <Moon size={13} strokeWidth={2} aria-hidden="true" />
            <span className="mono">DARK</span>
          </button>
        </div>
      </div>
      <div className="live-screen" ref={wrapRef} style={{ height: APP_HEIGHT * scale }}>
        {!active ? (
          <p className="live-loading mono">SCROLL TO LOAD CONDUCTOR …</p>
        ) : !loaded ? (
          <p className="live-loading mono">STARTING CONDUCTOR …</p>
        ) : null}
        {src ? (
          <iframe
            ref={frameRef}
            key={src}
            src={src}
            title="Conductor, running live with mock data"
            loading="lazy"
            width={APP_WIDTH}
            height={APP_HEIGHT}
            style={{ transform: `scale(${scale})` }}
            onLoad={() => setLoaded(true)}
          />
        ) : null}
      </div>
      <div className="live-foot">
        <div className="live-routes" role="group" aria-label="Open a Conductor page">
          {liveRoutes.map((item) => (
            <button
              key={item.route}
              type="button"
              className="mono"
              data-click="nav"
              aria-pressed={route === item.route}
              onClick={() => go(item.route)}
            >
              {item.label.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="live-tools">
          <button
            type="button"
            className="mono"
            data-click="soft"
            onClick={() => go(route)}
            aria-label="Reset the live Conductor page"
          >
            <RotateCcw size={12} strokeWidth={2} aria-hidden="true" /> RESET
          </button>
          <a className="mono" data-click="nav" href={liveUrl(route, theme)} target="_blank" rel="noreferrer">
            <ExternalLink size={12} strokeWidth={2} aria-hidden="true" /> FULL PAGE
          </a>
        </div>
      </div>
      <figcaption>
        <span className="mono">LIVE · {LIVE_SOURCE.toUpperCase()}</span>
        <span>
          The real Conductor frontend, built unmodified and running in this page. Use the switch above, or Conductor’s own
          sun-and-moon toggle in its top bar: both drive the app’s ThemeContext. Click through the rail, pick a course in
          the AI Assistant, and ask something. Every course, student, count, and agent reply is mock data answered in the
          browser; nothing reaches Canvas or a model.
        </span>
      </figcaption>
    </figure>
  );
}
