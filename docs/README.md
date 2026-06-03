# Helm documentation

Helm is a terminal cockpit for **reusable prompts** (markdown on disk) and **todos** (SQLite).

## Index

| Doc | Description |
| --- | --- |
| [Architecture](./architecture.md) | Layers, data flow, and folder layout |
| [Quality gates](./quality-gates.md) | Lint, format, tests, CI |
| [Testing](./testing.md) | Vitest layout and naming |
| [Features: Prompts](./features/prompts.md) | Prompt library and projects |
| [Features: Todos](./features/todos.md) | Tasks, Today view, projects |
| [Components](./components/README.md) | Shared Ink UI building blocks |

## Quick commands

```bash
pnpm dev              # run TUI from source
pnpm quality          # format + lint + types + tests
pnpm test:coverage    # unit + integration with 80% threshold
```
