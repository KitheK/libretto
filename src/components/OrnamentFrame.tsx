import type { ReactNode } from "react";
import { LazyFrame, OrnamentSuspense } from "./ornamentLazy";

type FrameVariant = "pavot30" | "lys33" | "halo01" | "coins46";

/**
 * Nouveau frame around content. Suspense shows the bare children until the
 * frame chunk loads (one swap, not an idle + chunk double remount).
 */
export function OrnamentFrame({
  variant,
  children,
  className,
  scale = 0.85,
  gap = 8,
}: {
  variant: FrameVariant;
  children: ReactNode;
  className?: string;
  scale?: number;
  gap?: number;
}) {
  return (
    <OrnamentSuspense fallback={<div className={className}>{children}</div>}>
      <LazyFrame
        variant={variant}
        palette="libretto"
        scale={scale}
        gap={gap}
        animate={false}
        className={className}
      >
        {children}
      </LazyFrame>
    </OrnamentSuspense>
  );
}
