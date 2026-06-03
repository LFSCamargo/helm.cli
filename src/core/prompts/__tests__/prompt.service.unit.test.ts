import { describe, expect, it } from 'vitest';
import {
  createProject,
  createPrompt,
  deletePrompt,
  getProjectCustomDescription,
  getProjectDescription,
  listPrompts,
  readPrompt,
  slugify,
  writePrompt,
} from '../prompt.service.js';

describe('slugify', () => {
  it('normalizes titles into safe slugs', () => {
    expect(slugify('  Hello World! ')).toBe('hello-world');
  });

  it('falls back to untitled when empty', () => {
    expect(slugify('---')).toBe('untitled');
  });
});

describe('prompt project metadata', () => {
  it('returns generated description when no meta file', () => {
    const project = createProject('Sample App');
    createPrompt(project, 'One');
    createPrompt(project, 'Two');
    const desc = getProjectDescription(project);
    expect(desc).toContain('2 reusable prompts');
  });

  it('returns null custom description when missing', () => {
    expect(getProjectCustomDescription('nonexistent-project')).toBeNull();
  });
});

describe('prompt file operations', () => {
  it('creates project, prompt, reads and deletes', () => {
    const project = createProject('Test Project');
    const slug = createPrompt(project, 'My Prompt');
    expect(slug).toBe('my-prompt');

    const listed = listPrompts(project);
    expect(listed.some((p) => p.slug === slug)).toBe(true);

    writePrompt(project, slug, '# Updated\n\nBody');
    expect(readPrompt(project, slug)).toContain('# Updated');

    deletePrompt(project, slug);
    expect(readPrompt(project, slug)).toBe('');
  });
});
