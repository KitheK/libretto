import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

/** Short enter motion keyed to the current route. */
export function PageEnter({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className={`page-enter ${className}`.trim()}>
      {children}
    </div>
  );
}
