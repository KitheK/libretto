import { useContent } from "../lib/ContentContext";

const PREVIEW: Record<string, string> = {
  lys33: "/previews/nouveau/frieze-lys33.png",
  pavot30: "/previews/nouveau/frieze-pavot30.png",
};

export function FootFrieze() {
  const { theme } = useContent();
  const v = theme.ornaments.footFrieze;
  if (v === "none" || theme.scheme === "plain") return null;
  const src = PREVIEW[v];
  if (!src) return null;
  return (
    <div className="foot-frieze page" aria-hidden="true">
      <img src={src} alt="" />
    </div>
  );
}
