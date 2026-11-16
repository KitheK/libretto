import { getSoundEnabled } from "./prefs";

export type ClickKind = "soft" | "select" | "toggle" | "nav";

let ctx: AudioContext | null = null;
let unlocked = false;

function prefersQuiet(): boolean {
  if (typeof window === "undefined") return true;
  if (!getSoundEnabled()) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  return ctx;
}

export function unlockClickSound() {
  if (unlocked) return;
  const audio = ensureContext();
  if (!audio) return;
  if (audio.state === "suspended") {
    void audio.resume();
  }
  unlocked = true;
}

/** Quiet Web Audio ticks — no asset files, starts after a user gesture. */
export function playClick(kind: ClickKind = "soft") {
  if (prefersQuiet()) return;
  const audio = ensureContext();
  if (!audio) return;
  if (audio.state === "suspended") {
    void audio.resume().then(() => beep(audio, kind));
    return;
  }
  beep(audio, kind);
}

function beep(audio: AudioContext, kind: ClickKind) {
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  const profile =
    kind === "select"
      ? { type: "triangle" as const, freq: 520, peak: 0.045, dur: 0.055 }
      : kind === "toggle"
        ? { type: "sine" as const, freq: 380, peak: 0.04, dur: 0.07 }
        : kind === "nav"
          ? { type: "sine" as const, freq: 440, peak: 0.028, dur: 0.04 }
          : { type: "triangle" as const, freq: 310, peak: 0.032, dur: 0.045 };

  osc.type = profile.type;
  osc.frequency.setValueAtTime(profile.freq, now);
  osc.frequency.exponentialRampToValueAtTime(profile.freq * 0.72, now + profile.dur);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(profile.peak, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.dur);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);
  osc.start(now);
  osc.stop(now + profile.dur + 0.02);
}

export function installClickSoundBridge() {
  if (typeof window === "undefined") return () => undefined;

  const unlock = () => unlockClickSound();
  window.addEventListener("pointerdown", unlock, { once: true, passive: true });
  window.addEventListener("keydown", unlock, { once: true });

  const onClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const host = target.closest("[data-click]");
    if (!(host instanceof HTMLElement) && !(host instanceof SVGElement)) return;
    const kind = (host.getAttribute("data-click") as ClickKind | null) ?? "soft";
    playClick(kind);
  };

  document.addEventListener("click", onClick, true);
  return () => {
    document.removeEventListener("click", onClick, true);
  };
}
