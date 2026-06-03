import { describe, expect, it } from 'vitest';
import { isTitleRedundant } from '../Layout.js';

describe('isTitleRedundant', () => {
  it('detects exact breadcrumb match', () => {
    expect(isTitleRedundant('Todos', ['Todos'])).toBe(true);
  });

  it('detects slug.md breadcrumb vs slug title', () => {
    expect(isTitleRedundant('refactor', ['Prompts', 'app', 'refactor.md'])).toBe(true);
  });

  it('returns false when title adds information', () => {
    expect(isTitleRedundant('Prompt Library', ['Prompts'])).toBe(false);
  });
});
