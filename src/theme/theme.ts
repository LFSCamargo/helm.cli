/**
 * Central design tokens for the whole TUI. Keeping colors and gradients in one
 * place makes the app feel cohesive and easy to re-skin.
 */

export const gradients = {
  /** Primary brand: mint → teal → indigo. */
  brand: ['#6ee7b7', '#2dd4bf', '#6366f1'] as const,
  /** Warm highlight for home / stats. */
  sunrise: ['#fde68a', '#fb923c', '#f472b6'] as const,
  /** Prompts surface: violet → fuchsia → pink. */
  ocean: ['#a78bfa', '#c084fc', '#f472b6'] as const,
  /** Todos surface: amber → orange → red. */
  flame: ['#fbbf24', '#f97316', '#ef4444'] as const,
};

/**
 * Seamless palettes for the animation layer (rotate one stop per frame).
 */
export const flow = {
  brand: ['#6ee7b7', '#2dd4bf', '#22d3ee', '#6366f1', '#818cf8', '#6366f1', '#22d3ee', '#2dd4bf'] as const,
  ocean: ['#a78bfa', '#c084fc', '#f472b6', '#c084fc'] as const,
  flame: ['#fbbf24', '#fb923c', '#f97316', '#ef4444', '#f97316', '#fb923c'] as const,
  sunrise: ['#fde68a', '#fb923c', '#f472b6', '#fb923c'] as const,
  /** Animated selection highlight for menus. */
  purple: [
    '#4c1d95',
    '#5b21b6',
    '#6d28d9',
    '#7c3aed',
    '#8b5cf6',
    '#a78bfa',
    '#8b5cf6',
    '#7c3aed',
  ] as const,
};

export const colors = {
  accent: '#a78bfa',
  accentAlt: '#2dd4bf',
  text: 'white',
  muted: 'gray',
  dim: '#6b7280',
  border: '#3f3f5f',
  borderActive: '#a78bfa',
  selectionBg: '#2a2150',
  /** Text on purple menu selection (violet-50). */
  selectionText: '#faf5ff',
  /** Secondary lines on purple selection (violet-200). */
  selectionMuted: '#ddd6fe',
  surface: '#181826',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#fb7185',
  info: '#38bdf8',
};

/** Todoist-style priority palette (P1 highest). */
export const priorityMeta: Record<number, { label: string; color: string; dot: string }> = {
  1: { label: 'P1', color: '#fb7185', dot: '●' },
  2: { label: 'P2', color: '#fbbf24', dot: '●' },
  3: { label: 'P3', color: '#38bdf8', dot: '●' },
  4: { label: 'P4', color: '#9ca3af', dot: '●' },
};

export const symbols = {
  pointer: '❯',
  bar: '▌',
  check: '✔',
  uncheck: '○',
  bullet: '•',
  arrow: '→',
  chevron: '❯',
  clock: '⏰',
  spark: '✦',
  star: '★',
  dot: '·',
  separator: '·',
};
