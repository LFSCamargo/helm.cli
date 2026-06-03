# Prompts feature

## Overview

Prompts are markdown files stored per project:

```
prompts/<project>/<slug>.md
```

Optional project metadata:

```json
// prompts/<project>/helm.meta.json
{ "description": "Short blurb shown in the project list" }
```

## Screens

| Route | Screen | Purpose |
| --- | --- | --- |
| `prompt-projects` | Prompt projects list | Pick a project |
| `prompt-list` | Prompt list | Browse/copy/edit prompts in a project |
| `prompt-view` | Prompt view | Read markdown, copy to clipboard |
| `prompt-edit` | Multiline editor | Edit markdown (Ctrl+S save) |
| `prompt-create` | New prompt | Title → template file |
| `project-create` | New project | Creates `prompts/<slug>/` |

## Core API

`src/core/prompts/prompt.service.ts` — `slugify`, `listProjects`, `createPrompt`, `readPrompt`, `writePrompt`, `deletePrompt`, `listRecentPrompts`, `getProjectDescription`.

## Keys (typical)

- `n` — new prompt / project
- `c` — copy (list/view)
- `e` — edit
- `d` — delete
- `esc` — back
