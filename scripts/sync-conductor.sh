#!/usr/bin/env bash
set -euo pipefail

REPO="${CONDUCTOR_REPO:-https://github.com/UBCO-COSC499-S2026/capstone-team-1.git}"
CACHE=".cache/conductor"

echo "Syncing capstone evidence from ${REPO}..."

rm -rf "$CACHE"
mkdir -p "$CACHE" content/_sources

git clone --depth 1 --branch development "$REPO" "$CACHE/development"
git clone --depth 1 --branch Documents "$REPO" "$CACHE/Documents"

if command -v rsync >/dev/null 2>&1; then
  rsync -a "$CACHE/Documents/docs/" content/_sources/docs/
  rsync -a "$CACHE/development/app/" content/_sources/app/
  rsync -a "$CACHE/development/.github/" content/_sources/.github/
else
  cp -r "$CACHE/Documents/docs/" content/_sources/docs/
  cp -r "$CACHE/development/app/" content/_sources/app/
  cp -r "$CACHE/development/.github/" content/_sources/.github/
fi

echo "Snapshots written to content/_sources/"
