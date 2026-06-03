import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

/**
 * Walk upwards from the current module until we find the package root
 * (the directory that owns package.json). This keeps the `prompts/` and
 * `data/` folders anchored to the project regardless of where `helm` is
 * launched from.
 */
function findPackageRoot(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, 'package.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

export const PACKAGE_ROOT = findPackageRoot();

/** Local SQLite database lives here (git-ignored). */
export const DATA_DIR = process.env.HELM_DATA_DIR ?? join(PACKAGE_ROOT, 'data');

/** Markdown prompts live here as prompts/<project>/<slug>.md (git-ignored). */
export const PROMPTS_DIR = process.env.HELM_PROMPTS_DIR ?? join(PACKAGE_ROOT, 'prompts');

export const DB_PATH = join(DATA_DIR, 'helm.db');

/** Make sure the writable data directories exist before we touch them. */
export function ensureDirs(): void {
  for (const dir of [DATA_DIR, PROMPTS_DIR]) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }
}
