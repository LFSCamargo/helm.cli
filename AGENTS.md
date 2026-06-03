# Helm — agent guide

Helm is a keyboard-driven terminal cockpit (TUI) for managing **reusable prompts**
and **todos**, styled after Claude Code / Cursor Agent / OpenCode.

## Stack

- **React + Ink 5** — terminal UI (ESM only)
- **TypeScript + Node.js** (Node ≥ 20, tested on 24)
- **SQLite (better-sqlite3) + Kysely** — typed data layer for todos
- **Markdown files** — prompts live on disk under `prompts/<project>/<slug>.md`

## Run it

This repo is **pnpm-only** (enforced by a `preinstall` `only-allow pnpm` guard plus
`engines`/`packageManager`). Tasks run through **Nx**, which caches `build`/`typecheck`.

```bash
pnpm install     # installs deps (better-sqlite3 is native)
pnpm dev         # run from source with tsx
pnpm build       # compile to dist/ (alias: pnpm nx build helm-cli)
pnpm start       # run the compiled build
pnpm typecheck   # alias: pnpm nx typecheck helm-cli
pnpm quality     # format + lint + types + unit + integration tests
```

## Quality gates (required)

Every change must pass **format**, **lint**, **types**, and **tests** before merge.

| Check | Command |
| --- | --- |
| Format | `pnpm format:check` |
| Lint | `pnpm lint:check` |
| Types | `pnpm types:check` |
| Unit tests | `pnpm unitary:test` (`*.unit.test.ts` in `__tests__/`) |
| Integration tests | `pnpm integration:test` (`*.integration.test.ts`) |
| E2E (Ink UI) | `pnpm e2e:test` (`*.e2e.test.tsx`) |
| Coverage (80%) | `pnpm test:coverage` |

When you change implementation, **update tests and `/docs` in the same PR**. See `docs/quality-gates.md` and `.cursor/rules/quality-gates.mdc`.

Do not use `npm` or `yarn`, and never commit `package-lock.json` / `yarn.lock`.
The bin is `helm` (after `pnpm build`, points to `dist/cli.js`). For a local PATH
wrapper without global link: `pnpm path:bin` then add repo `bin/` to `PATH`.

## Where data lives (git-ignored)

- Prompts: `prompts/<project>/<slug>.md`
- Database: `data/helm.db`
- Override with `HELM_PROMPTS_DIR` / `HELM_DATA_DIR` env vars.

Both `prompts/` and `data/` are in `.gitignore` and must **never** be committed.

## Architecture (modular by feature)

```
src/
  cli.tsx                 entry: migrate db, render <App>
  app.tsx                 router → screen mapping + reminder poller
  config/paths.ts         resolves data/ and prompts/ dirs
  theme/theme.ts          colors, gradients, symbols (single source of truth)
  navigation/             RouterContext (navigation stack) + route union
  core/                   framework-free domain logic
    db/                   kysely client, schema, migrations
    prompts/              markdown file service + types
    todos/                kysely-backed service + types
    util/datetime.ts      friendly date parsing/formatting
  services/               side-effects: clipboard, desktop notifications
  hooks/                  useToast, useReminders
  components/             reusable Ink UI (Layout, SelectList, Markdown, …)
  screens/                one folder per feature (prompts/, todos/)
```

## Conventions

- **ESM imports use explicit `.js` extensions** (TS `Bundler`/`NodeNext` style),
  even when importing `.ts`/`.tsx` source. Keep this consistent.
- **Don't `import React`** — the project uses the automatic JSX runtime
  (`jsx: react-jsx`) and `noUnusedLocals` is on. Import only the hooks you use.
- Keep **domain logic in `core/`** free of Ink/React so it stays testable.
- All visual tokens (colors, gradients) come from `theme/theme.ts` — add new
  ones there rather than hardcoding hex values in components.
- Screens own navigation + global keys (`esc`, `ctrl+s`); reusable components
  own only their local interactions.
- Dates are stored as ISO strings, booleans as `0/1` integers in SQLite.

## Follow workspace security rules

Never log PII/secrets, never weaken security controls, and avoid
high-cardinality metric tags (see workspace rules).
