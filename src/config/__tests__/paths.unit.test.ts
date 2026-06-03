import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { DATA_DIR, PACKAGE_ROOT, PROMPTS_DIR } from '../paths.js';

describe('paths', () => {
  it('resolves package root with package.json', () => {
    expect(existsSync(`${PACKAGE_ROOT}/package.json`)).toBe(true);
  });

  it('honours HELM_DATA_DIR and HELM_PROMPTS_DIR from test setup', () => {
    expect(PROMPTS_DIR).toContain('prompts');
    expect(DATA_DIR).toContain('data');
  });
});
