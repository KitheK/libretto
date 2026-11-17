# Repo analysis

Read-only and bounded: tree, README, manifests, config, tests, CI, licence, sample sources, git stats.

## Robustness

| Case | Behaviour |
|------|-----------|
| No README | Infer; tag draft; ask B1 first |
| One commit / squash | Skip branch river; build-log or interview timeline |
| Monorepo | Ask which package |
| Non-JS | Use that ecosystem’s manifests |
| Large repo | Fixed sample limits; state what was skipped |
| Vendor/generated | Borrowed, not built |
| Secrets | Redaction pass before write |

## Architecture

Validate every node path. Drop invalid. No runtime gitdiagram.com dependency.

## Redaction

Scan secrets, tokens, private URLs, emails, B9 names. Author approves. Env names only.
