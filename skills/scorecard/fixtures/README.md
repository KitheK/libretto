# RED fixtures (baseline without skill)

Record how an agent fails **without** loading `skills/scorecard` on each fixture idea:

| Fixture | Expected failure |
|---------|------------------|
| no-readme | Invents purpose |
| one-commit-hackathon | Fat manual + empty timeline |
| coursework-rubric | Ignores rubric / claims all met |
| solo-cli | Assumes microservices / team |
| messy-group | Even credit / invented roles |
| monorepo | Summarises everything |
| python-notebook | Describes a JS app |
| planted-secret | Copies secret into content |

Sample planted-secret string for scanners: `API_KEY="sk-planted-secret-value"`

Dogfood content packs live under `scorecard/content/dogfood/`.
