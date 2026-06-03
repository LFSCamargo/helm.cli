# ◆ helm

A stunning, keyboard-driven terminal cockpit for managing your **reusable prompts**
and **todos** — built with React + Ink and styled after Claude Code, Cursor's
Agent CLI, and OpenCode.

```
██╗  ██╗███████╗██╗     ███╗   ███╗
██║  ██║██╔════╝██║     ████╗ ████║
███████║█████╗  ██║     ██╔████╔██║
██╔══██║██╔══╝  ██║     ██║╚██╔╝██║
██║  ██║███████╗███████╗██║ ╚═╝ ██║
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚═╝
your terminal cockpit for prompts & todos
```

## Features

### ◈ Prompts
- Organized **per project** as plain markdown files: `prompts/<project>/<slug>.md`
- Built-in markdown viewer with syntax-aware rendering
- Inline multiline editor (cursor navigation, live save)
- **Copy any prompt to the clipboard** with `c` — then paste it straight into
  your agent
- Everything is just files on disk, so it's easy to back up or sync yourself

### ✦ Todos (Todoist, in your terminal)
- Priorities **P1–P4** with color coding
- Friendly due dates: `today 17:00`, `tomorrow 9am`, `+2h`, `2026-06-10 09:00`
- **Reminders that fire native desktop notifications** while helm is open
- Toggle complete, cycle priority, edit, and delete — all from the keyboard
- Stored in a local **SQLite** database via **Kysely**

### Stunning by default
- Gradient hero banner and accent gradients per surface
- Rounded panels, animated pointer, contextual key hints, transient toasts

## Stack

React · Ink 5 · TypeScript · Node.js · SQLite (better-sqlite3) · Kysely

## Getting started

> This project uses **pnpm** exclusively (enforced via `only-allow`). Install it
> with `corepack enable` or `npm i -g pnpm`. Tasks run through **Nx**.

```bash
pnpm install       # better-sqlite3 compiles a native module here
pnpm dev           # launch from source (tsx)
```

Build a runnable binary:

```bash
pnpm build         # or: pnpm nx build helm-cli
pnpm start         # runs dist/cli.js
# or, after `pnpm link --global`, just:
helm
```

Nx caches `build` and `typecheck`:

```bash
pnpm nx typecheck helm-cli
pnpm nx run helm-cli:build
```

> helm is an interactive TUI — run it in a real terminal (not piped), since it
> uses raw keyboard input.

## Keyboard reference

| Context        | Keys                                                        |
| -------------- | ----------------------------------------------------------- |
| Everywhere     | `↑↓` / `j k` navigate · `⏎` select · `esc` back · `q` quit  |
| Prompt list    | `c` copy · `e` edit · `n` new · `d` delete                  |
| Prompt editor  | type to edit · `↑↓←→` move cursor · `^S` save · `esc` save & back |
| Todo list      | `␣`/`⏎` toggle · `e` edit · `p` cycle priority · `n` new · `d` delete |
| Todo form      | `↑↓`/`⇥` change field · `←→` priority · `^S`/`⏎` save · `esc` cancel |

## Where your data lives

| What     | Location                          | Git           |
| -------- | --------------------------------- | ------------- |
| Prompts  | `prompts/<project>/<slug>.md`     | **ignored**   |
| Database | `data/helm.db`                    | **ignored**   |

Override locations with environment variables:

```bash
HELM_PROMPTS_DIR=~/notes/prompts HELM_DATA_DIR=~/.local/share/helm helm
```

Both `prompts/` and `data/` are listed in `.gitignore`, so your prompts and
tasks never get committed.

## Quality gates

```bash
pnpm quality          # format + lint + types + unit + integration
pnpm test:coverage    # same tests with 80% coverage on core/config/theme
```

CI runs `format:check`, `lint:check`, `types:check`, `unitary:test`, `integration:test`,
and `test:coverage` on every pull request. See [`docs/quality-gates.md`](./docs/quality-gates.md).

## Project structure

See [`AGENTS.md`](./AGENTS.md) and [`docs/`](./docs/) for architecture, features, and
contribution conventions. In short:

```
src/
  core/        UI-free domain logic (db, prompts, todos, util)
  services/    clipboard + desktop notifications
  components/  reusable Ink UI
  screens/     one folder per feature
  navigation/  stack-based router
  theme/       colors & gradients
```

## License

MIT
