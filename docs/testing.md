# Testing

We use [Vitest](https://vitest.dev/) with tests colocated in `__tests__/` folders.

## Naming

| Pattern | Purpose |
| --- | --- |
| `*.unit.test.ts` | Fast, isolated tests (parsers, slugify, pure helpers) |
| `*.integration.test.ts` | DB, filesystem, or multi-step flows |

Examples:

- `src/core/util/__tests__/datetime.unit.test.ts`
- `src/core/todos/__tests__/todo.service.integration.test.ts`

## Environment

`src/test/setup.ts` points `HELM_DATA_DIR` and `HELM_PROMPTS_DIR` at a temp directory so tests never touch your real `data/` or `prompts/` folders.

## Commands

```bash
pnpm unitary:test
pnpm integration:test
pnpm test:coverage
```

Test harness lives in `src/test/`:

- `setup.ts` — temp `HELM_DATA_DIR` / `HELM_PROMPTS_DIR`
- `setup.integration.ts` — runs DB migrations for integration tests
- `helpers.ts` — shared paths/helpers for tests

## When to add tests

- **core/** — always cover new or changed behavior.
- **components/** — cover exported helpers (e.g. `isTitleRedundant`); full Ink screens are optional.
- **screens/** — prefer testing via `core/` services; add UI tests only when logic is screen-specific.

Update or remove tests when you change or delete the implementation they protect.

## Coverage (80%)

`pnpm test:coverage` enforces thresholds on **`src/core`**, **`src/config`**, and **`src/theme`**. UI screens are type-checked but not part of the coverage gate until dedicated Ink tests are added.
