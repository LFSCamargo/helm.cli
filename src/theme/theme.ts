/**
 * Central design tokens for the whole TUI. Keeping colors and gradients in one
 * place makes the app feel cohesive and easy to re-skin.
 */

export const gradients = {
  /** Primary brand gradient: cyan -> violet -> pink. */
  brand: ['#22d3ee', '#818cf8', '#e879f9'] as const,
  /** Warm gradient used for celebratory / success moments. */
  sunrise: ['#f59e0b', '#fb7185', '#e879f9'] as const,
  /** Cool gradient for the prompts surface. */
  ocean: ['#22d3ee', '#38bdf8', '#818cf8'] as const,
  /** Energetic gradient for the todos surface. */
  flame: ['#fbbf24', '#fb7185', '#f43f5e'] as const,
};

export const colors = {
  accent: '#a78bfa',
  accentAlt: '#22d3ee',
  text: 'white',
  muted: 'gray',
  dim: '#6b7280',
  border: '#3f3f5f',
  borderActive: '#a78bfa',
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
  check: '✔',
  uncheck: '○',
  bullet: '•',
  arrow: '→',
  clock: '⏰',
  spark: '✦',
  dot: '·',
};
