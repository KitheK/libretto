import type { MDXComponents } from 'astro/types';
import Section from './components/layout/Section.astro';
import BlueprintFigure from './components/diagrams/BlueprintFigure.tsx';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Section,
    BlueprintFigure,
  };
}
