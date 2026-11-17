import type { ReactNode } from "react";
import { LazyFrame, OrnamentSuspense } from "./ornamentLazy";

type FrameVariant = "pavot30" | "lys33" | "halo01" | "coins46";

/**
 * Nouveau frame around content.
 * pavot30 (plate-30 goblet/pod register) is stripped site-wide — callers keep working.
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
  if (variant === "pavot30") {
    return <div className={className}>{children}</div>;
  }

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
