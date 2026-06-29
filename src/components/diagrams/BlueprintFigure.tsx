import { useEffect, useRef, type ReactNode } from 'react';

type BlueprintFigureProps = {
  id: string;
  caption: string;
  children: ReactNode;
};

export default function BlueprintFigure({ id, caption, children }: BlueprintFigureProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      node.dataset.visible = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.dataset.visible = 'true';
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="figure" ref={ref} data-visible="false" aria-labelledby={`${id}-caption`}>
      <div className="figure__label">{id}</div>
      <div className="figure__content">{children}</div>
      <figcaption className="figure__caption" id={`${id}-caption`}>
        {caption}
      </figcaption>
    </figure>
  );
}
