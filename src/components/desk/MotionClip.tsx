import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Clip } from "../../content/live";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Plays webm only while in view (poster otherwise). Avoids decoding every
 * clip at once on the home page — the main scroll jank source.
 */
export function MotionClip({ clip, wide = false }: { clip: Clip; wide?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [videoOk, setVideoOk] = useState(true);
  /** User intent; visibility / reduced-motion gate actual playback. */
  const [wantPlay, setWantPlay] = useState(true);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "80px", threshold: 0.15 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const playing = wantPlay && inView && !reduced && videoOk;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      void video.play().catch(() => setWantPlay(false));
    } else {
      video.pause();
    }
  }, [playing]);

  const showGif = !videoOk && wantPlay && inView && !reduced;

  return (
    <figure ref={rootRef} className={`clip ${wide ? "clip--wide" : ""}`} data-clip={clip.id}>
      <div className="clip-frame" style={{ aspectRatio: clip.ratio }}>
        {inView && videoOk ? (
          <video
            ref={videoRef}
            className="clip-media"
            muted
            loop
            playsInline
            preload="metadata"
            poster={clip.poster}
            aria-label={clip.alt}
            onError={() => setVideoOk(false)}
          >
            <source src={clip.webm} type="video/webm" onError={() => setVideoOk(false)} />
          </video>
        ) : (
          <img
            className="clip-media"
            src={showGif ? clip.gif : clip.poster}
            alt={clip.alt}
            loading="lazy"
            decoding="async"
          />
        )}
        <button
          type="button"
          className="clip-toggle mono"
          aria-pressed={wantPlay && !reduced}
          aria-label={wantPlay ? `Pause: ${clip.title}` : `Play: ${clip.title}`}
          data-click="toggle"
          onClick={() => setWantPlay((value) => !value)}
        >
          {wantPlay && !reduced ? <Pause size={12} strokeWidth={2} aria-hidden="true" /> : <Play size={12} strokeWidth={2} aria-hidden="true" />}
          {wantPlay && !reduced ? "PAUSE" : "PLAY"}
        </button>
      </div>
      <figcaption>
        <span className="mono">{clip.label}</span>
        <span className="clip-title">{clip.title}</span>
        <span>{clip.caption}</span>
        <a className="clip-gif mono" href={clip.gif} target="_blank" rel="noreferrer">
          GIF ↗
        </a>
      </figcaption>
    </figure>
  );
}
