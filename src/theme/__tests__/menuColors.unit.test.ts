import { describe, expect, it } from 'vitest';
import { menuColors, menuPurple } from '../menuColors.js';

describe('menuColors', () => {
  it('uses violet tones when idle', () => {
    const c = menuColors(false);
    expect(c.label).toBe(menuPurple.label);
    expect(c.description).toBe(menuPurple.secondary);
  });

  it('brightens text when selected', () => {
    const c = menuColors(true);
    expect(c.bold).toBe(true);
    expect(c.label).toBe('#faf5ff');
  });
});
