import { LazyFrieze, OrnamentSuspense, useIdleReady } from "./ornamentLazy";

/** Plate 33 lily frieze at the absolute bottom of a page (animated). */
export function PageFootFrieze() {
  const ready = useIdleReady(180);
  if (!ready) return null;
  return (
    <div className="page-foot-frieze" aria-hidden="true">
      <OrnamentSuspense>
        <LazyFrieze variant="lys33" height={110} palette="libretto" crop="full" ground={false} animate />
      </OrnamentSuspense>
    </div>
  );
}
