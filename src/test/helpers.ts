import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_DIR, PROMPTS_DIR } from '../config/paths.js';

/** Ensure temp data/prompts dirs from `setup.ts` exist before filesystem tests. */
export function ensureTestDirs(): void {
  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(PROMPTS_DIR, { recursive: true });
}

/** Path helper for assertions in integration tests. */
export function testPromptPath(project: string, slug: string): string {
  return join(PROMPTS_DIR, project, `${slug}.md`);
}
