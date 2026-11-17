# Scorecard — Cursor plugin

Installs the **scorecard** agent skill: turn any project into a descriptive manual site (kit + Write mode). Never grades.

Libretto (https://github.com/KitheK/libretto) is the reference **Full** Scorecard-shaped site this skill generalizes.

## Local test

```bash
# From the libretto repo root
mkdir -p ~/.cursor/plugins/local
# Windows PowerShell:
# New-Item -ItemType Directory -Force "$env:USERPROFILE\.cursor\plugins\local"
cp -r plugins/scorecard ~/.cursor/plugins/local/scorecard
```

Reload Cursor (**Developer: Reload Window**). Confirm **scorecard** under Customize → Skills.

## Marketplace submit

1. Ensure this folder (or the whole public repo) is on GitHub.  
2. Official: [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish) — paste the repo URL.  
3. Community: [cursor.directory/plugins/new](https://cursor.directory/plugins/new).  

Manifests: `.cursor-plugin/plugin.json` (Cursor) and root `plugin.json` (Agent Plugins standard). Skill: `skills/scorecard/SKILL.md`.

## After install

Ask the agent to run Scorecard on a repo, or say “use the scorecard skill”. Full kit docs: `../../scorecard/README.md`.
