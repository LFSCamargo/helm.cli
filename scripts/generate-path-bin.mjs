#!/usr/bin/env node
/**
 * Writes `bin/helm` — a git-ignored shell wrapper for local PATH use.
 * Resolves the repo root from the script location so the checkout can move.
 */
import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const binDir = join(root, 'bin');
const wrapperPath = join(binDir, 'helm');

const script = `#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
CLI="$ROOT/dist/cli.js"

if [ ! -f "$CLI" ]; then
  echo "helm: missing build — run 'pnpm build' in $ROOT" >&2
  exit 1
fi

cd "$ROOT"
export HELM_DATA_DIR="\${HELM_DATA_DIR:-$ROOT/data}"
export HELM_PROMPTS_DIR="\${HELM_PROMPTS_DIR:-$ROOT/prompts}"

exec node "$CLI" "$@"
`;

mkdirSync(binDir, { recursive: true });
writeFileSync(wrapperPath, script, { encoding: 'utf8', mode: 0o755 });
chmodSync(wrapperPath, 0o755);

console.log(`Created ${wrapperPath}`);
console.log('');
console.log('Add to your shell profile:');
console.log(`  export PATH="${binDir}:$PATH"`);
console.log('');
console.log('Then run: helm');
