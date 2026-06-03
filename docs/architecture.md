# Architecture

## Layers

```
cli.tsx          → migrate DB, render <App>
app.tsx          → route → screen
screens/         → Ink UI per feature (navigation + keys)
components/      → reusable TUI (Layout, SelectList, …)
hooks/           → toast, reminders, animation frame
core/            → domain logic (no React/Ink)
  prompts/       → markdown files under prompts/<project>/
  todos/         → Kysely + SQLite
  db/            → schema + migrate
config/paths.ts  → HELM_DATA_DIR, HELM_PROMPTS_DIR
theme/           → colors, gradients, symbols
services/        → clipboard, desktop notifications
```

## Data

| Store | Location | Override |
| --- | --- | --- |
| Prompts | `prompts/<project>/<slug>.md` | `HELM_PROMPTS_DIR` |
| Todos DB | `data/helm.db` | `HELM_DATA_DIR` |
| Project blurb | `prompts/<project>/helm.meta.json` | — |

Both data directories are git-ignored.

## Navigation

Routes are defined in `src/navigation/routes.ts` and rendered in `src/app.tsx`. The router keeps a stack (`RouterContext`) for back navigation.
