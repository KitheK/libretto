export type TocItem = {
  label: string;
  href: string;
  rev: string;
};

export type TocColumn = {
  heading: string;
  items: TocItem[];
};

export const tableOfContents: TocColumn[] = [
  {
    heading: '1. WHAT LIBRETTO COVERS',
    items: [
      { label: 'Mission and product intent', href: '/chapters/01-mission', rev: 'REV 1' },
      { label: 'Requirements and personas', href: '/chapters/02-requirements', rev: 'REV 2' },
      { label: 'Safety guardrails', href: '/chapters/02-requirements', rev: 'REV 1' },
    ],
  },
  {
    heading: '2. ARCHITECTURE',
    items: [
      { label: 'System overview', href: '/chapters/03-architecture', rev: 'REV 3' },
      { label: 'Data flows', href: '/chapters/04-data-flows', rev: 'REV 2' },
      { label: 'Database and schemas', href: '/chapters/05-database', rev: 'REV 1' },
      { label: 'UI and navigation', href: '/chapters/06-ui', rev: 'REV 2' },
    ],
  },
  {
    heading: '3. ORCHESTRATION',
    items: [
      { label: 'Agent service', href: '/chapters/07-agent', rev: 'REV 3' },
      { label: 'Canvas bridge', href: '/chapters/08-canvas-bridge', rev: 'REV 2' },
      { label: 'Dev process', href: '/chapters/09-dev-process', rev: 'REV 1' },
      { label: 'Project history', href: '/chapters/10-history', rev: 'REV 1' },
    ],
  },
];
