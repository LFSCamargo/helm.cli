# Todos feature

## Overview

Todos live in SQLite (`data/helm.db`) via Kysely. Dates are ISO strings; booleans are `0/1`.

## Navigation

| Route | View | Description |
| --- | --- | --- |
| `todos` | Hub | **Today** + one entry per todo project tag |
| `todo-list` + `today` | Today | Open tasks due today, all projects |
| `todo-list` + `project` | Project | Tasks filtered by `#project` |
| `todo-create` | New task | Multi-field form |
| `todo-edit` | Edit task | Same form, pre-filled |

## Priorities

Todoist-style P1–P4 (1 = highest). Lists group tasks by priority with section headers.

## Core API

`src/core/todos/todo.service.ts` — CRUD, `toggleTodo`, `cyclePriority`, `listTodoProjects`, reminders.

## Friendly dates

`src/core/util/datetime.ts` parses due dates and reminders (`today 17:00`, `+2h`, `30m before`, etc.).

## Keys (typical)

- `n` — new task
- `␣` / `⏎` — toggle complete
- `e` — edit
- `p` — cycle priority
- `d` — delete
- `esc` — back
