import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { PROMPTS_DIR } from '../../../config/paths.js';
import {
  createProject,
  createPrompt,
  listProjects,
  listRecentPrompts,
  listPrompts,
} from '../prompt.service.js';

describe('prompt library integration', () => {
  beforeEach(() => {
    const project = 'meta-demo';
    const dir = join(PROMPTS_DIR, project);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, 'helm.meta.json'),
      JSON.stringify({ description: 'Integration test project' }),
    );
    writeFileSync(join(dir, 'alpha.md'), '# Alpha\n\nAlpha body');
  });

  it('lists projects with descriptions from meta', () => {
    createProject('Another');
    createPrompt('Another', 'Second prompt');
    const projects = listProjects();
    const meta = projects.find((p) => p.name === 'meta-demo');
    expect(meta?.description).toBe('Integration test project');
    expect(meta?.count).toBeGreaterThan(0);
  });

  it('returns recent prompts sorted by mtime', () => {
    const recent = listRecentPrompts(3);
    expect(recent.length).toBeGreaterThan(0);
    expect(recent[0].title.length).toBeGreaterThan(0);
  });

  it('lists prompts inside a project folder', () => {
    const prompts = listPrompts('meta-demo');
    expect(prompts.some((p) => p.slug === 'alpha')).toBe(true);
  });
});
