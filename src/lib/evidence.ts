import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.join(process.cwd(), 'evidence', 'manifest.yaml');

export type EvidenceEntry = {
  label: string;
  url: string;
};

function parseManifest(raw: string): Record<string, EvidenceEntry> {
  const entries: Record<string, EvidenceEntry> = {};
  let currentId: string | null = null;

  for (const line of raw.split('\n')) {
    const trimmed = line.replace(/\r$/, '');
    const idMatch = trimmed.match(/^(EV-\d+):$/);
    if (idMatch) {
      currentId = idMatch[1];
      entries[currentId] = { label: '', url: '' };
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

const raw = fs.readFileSync(manifestPath, 'utf8');
export const evidenceManifest = parseManifest(raw);

export function getEvidence(id: string): EvidenceEntry | undefined {
  return evidenceManifest[id];
}

export function getAllEvidence(): Array<{ id: string } & EvidenceEntry> {
  return Object.entries(evidenceManifest).map(([id, entry]) => ({ id, ...entry }));
}
