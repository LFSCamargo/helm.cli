# Components

Shared Ink UI under `src/components/`. Screens compose these; domain logic stays in `core/`.

| Component | Role |
| --- | --- |
| `Layout` | Breadcrumb, subtitle, optional body border, status bar |
| `GradientBreadcrumb` | `◆ helm ❯ …` gradient trail |
| `SelectList` | Keyboard list with `❯` pointer and purple title highlight |
| `SelectListRow` | Row spacing + selection chrome |
| `MenuRow` / `MenuTitle` / `MenuText` | Two-line menu items |
| `PriorityTodoList` | Todos grouped by P1–P4 |
| `Markdown` | Terminal markdown preview |
| `MultilineEditor` | Prompt editor with gutter |
| `TodoForm` | Create/edit task fields |
| `StatusBar` | Key hints + toasts |
| `Logo` / `AnimatedGradient` | Home banner and shimmer |

## Theming

All colors and gradients come from `src/theme/theme.ts` and `src/theme/menuColors.ts`. Do not hardcode hex values in components.
