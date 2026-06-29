import type { MDXComponents } from 'astro/types';
import Evidence from './components/evidence/Evidence.astro';
import BlueprintFigure from './components/diagrams/BlueprintFigure.tsx';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Evidence,
    BlueprintFigure,
  };
}
