# Content schemas

`schemaVersion: 1` on every file.

| File | Role |
|------|------|
| scorecard.json | job, brief, outcome, features, built/borrowed, proof, next |
| run.json | steps, envNames, demoScript |
| decisions.json | decisions / dead ends |
| requirements.json | rubric map (no grades) |
| team.json | people |
| interview.json | profile + answers |
| manual.json | parts, chapters, blocks |
| stack.json / apis.json / architecture.json / branches.json | plates |
| theme.json | scheme, tokens, fonts, ornaments, tone |

## Provenance

- `confirmed` | `inferred` | `draft`
- `source`: `generated` | `authored`
- Agent never sets `confirmed`
- `inferred` needs `evidence` (path or commit)
