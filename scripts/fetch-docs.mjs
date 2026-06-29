import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repo = 'UBCO-COSC499-S2026/capstone-team-1';
const branch = 'Documents';
const outDir = path.join(process.cwd(), '.cache', 'docs');

const files = [
  'docs/charter/charter.md',
  'docs/plan/project_planning.md',
  'docs/design/System Architecture/SystemArchitecture.md',
  'docs/design/component_diagram/component_diagram.md',
  'docs/design/ER Diagram/DATABASE.md',
  'docs/design/UI/Figma.md',
  'docs/design/UI/Frontend_Requiremnts.md',
  'docs/design/design_document.md',
  'docs/design/Data Flow Diagrams/level0.md',
  'docs/design/Data Flow Diagrams/level1.md',
];

fs.mkdirSync(outDir, { recursive: true });

for (const file of files) {
  const raw = execSync(
    `gh api "repos/${repo}/contents/${file}?ref=${branch}" --jq .content`,
    { encoding: 'utf8' }
  ).trim();

  const content = Buffer.from(raw.replace(/\s/g, ''), 'base64').toString('utf8');
  const outPath = path.join(outDir, path.basename(file));
  fs.writeFileSync(outPath, content);
  console.log(`Wrote ${outPath} (${content.length} bytes)`);
}
