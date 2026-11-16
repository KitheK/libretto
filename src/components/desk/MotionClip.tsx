import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Clip } from "../../content/live";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * A recorded clip of the real Conductor UI. Plays the webm muted and looped;
 * falls back to the GIF if the browser cannot play it. With
 * prefers-reduced-motion it shows the poster and waits for a press.
 */
export function MotionClip({ clip, wide = false }: { clip: Clip; wide?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOk, setVideoOk] = useState(true);
  const [playing, setPlaying] = useState(!reduced);

  useEffect(() => {
    setPlaying(!reduced);
  }, [reduced]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [playing, videoOk]);

  const showGif = !videoOk && playing;

  return (
    <figure className={`clip ${wide ? "clip--wide" : ""}`} data-clip={clip.id}>
      <div className="clip-frame" style={{ aspectRatio: clip.ratio }}>
        {videoOk ? (
          <video
            ref={videoRef}
            className="clip-media"
            muted
            loop
            playsInline
            preload={reduced ? "none" : "metadata"}
            poster={clip.poster}
            aria-label={clip.alt}
            onError={() => setVideoOk(false)}
          >
            <source src={clip.webm} type="video/webm" onError={() => setVideoOk(false)} />
          </video>
        ) : (
          <img className="clip-media" src={showGif ? clip.gif : clip.poster} alt={clip.alt} loading="lazy" decoding="async" />
        )}
        <button
          type="button"
          className="clip-toggle mono"
          aria-pressed={playing}
          aria-label={playing ? `Pause: ${clip.title}` : `Play: ${clip.title}`}
          data-click="toggle"
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? <Pause size={12} strokeWidth={2} aria-hidden="true" /> : <Play size={12} strokeWidth={2} aria-hidden="true" />}
          {playing ? "PAUSE" : "PLAY"}
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
