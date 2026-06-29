import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function parseManifest(raw) {
  const entries = {};
  let currentId = null;

  for (const line of raw.split('\n')) {
    const trimmed = line.replace(/\r$/, '');
    const idMatch = trimmed.match(/^(EV-\d+):$/);
    if (idMatch) {
      currentId = idMatch[1];
      entries[currentId] = {};
      continue;
    }
    if (!currentId) continue;

    const labelMatch = trimmed.match(/^\s+label:\s+(.+)$/);
    if (labelMatch) {
      entries[currentId].label = labelMatch[1].trim();
      continue;
    }

    const urlMatch = trimmed.match(/^\s+url:\s+(.+)$/);
    if (urlMatch) {
      entries[currentId].url = urlMatch[1].trim();
    }
  }

  return entries;
}

function collectMdxEvidenceIds(dir) {
  const ids = new Set();
  if (!fs.existsSync(dir)) return ids;

  const sectionPattern = /evidence=\{(\[[^\]]*\])\}/g;
  const idPattern = /EV-\d+/g;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.mdx')) continue;
    const content = fs.readFileSync(path.join(dir, file), 'utf8');

    for (const match of content.matchAll(sectionPattern)) {
      for (const id of match[1].matchAll(idPattern)) {
        ids.add(id[0]);
      }
    }
  }

  return ids;
}

const manifestPath = path.join(root, 'evidence', 'manifest.yaml');
const chaptersDir = path.join(root, 'src', 'content', 'chapters');

if (!fs.existsSync(manifestPath)) {
  console.error('Missing evidence/manifest.yaml');
  process.exit(1);
}

const manifest = parseManifest(fs.readFileSync(manifestPath, 'utf8'));
const referencedIds = collectMdxEvidenceIds(chaptersDir);
const errors = [];

for (const [id, entry] of Object.entries(manifest)) {
  if (!entry.label) errors.push(`${id}: missing label`);
  if (!entry.url) errors.push(`${id}: missing url`);
  else if (!entry.url.startsWith('https://github.com/')) {
    errors.push(`${id}: url must point to github.com`);
  }
}

for (const id of referencedIds) {
  if (!manifest[id]) {
    errors.push(`MDX references ${id} but it is not in manifest.yaml`);
  }
}

if (errors.length > 0) {
  console.error('Evidence validation failed:\n');
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log(
  `Evidence OK: ${Object.keys(manifest).length} manifest entries, ${referencedIds.size} referenced in MDX`
);
