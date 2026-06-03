# Quality gates

Every PR and agent change must pass:

| Gate | Command | Nx target |
| --- | --- | --- |
| Format | `pnpm format:check` | `nx format:check helm-cli` |
| Lint | `pnpm lint:check` | `nx lint:check helm-cli` |
| Types | `pnpm types:check` | `nx types:check helm-cli` |
| Unit tests | `pnpm unitary:test` | `nx unitary:test helm-cli` |
| Integration tests | `pnpm integration:test` | `nx integration:test helm-cli` |

Local all-in-one:

```bash
pnpm quality
```

CI runs the same checks on pull requests (see `.github/workflows/ci.yml`).

Coverage (80% on gated paths):

```bash
pnpm test:coverage
```

Gated paths: `src/core`, `src/config`, `src/theme` (80% coverage). Screens and CLI entry are excluded from the coverage threshold but must pass format, lint, and types.
