import { colors } from './theme.js';

/** Violet tones for idle menu rows. */
export const menuPurple = {
  label: '#c4b5fd',
  secondary: '#a78bfa',
  dim: '#8b5cf6',
} as const;

/** Foreground colors for menu rows (selected vs idle). */
export function menuColors(selected: boolean) {
  if (selected) {
    return {
      label: colors.selectionText,
      description: '#e9d5ff',
      meta: '#e9d5ff',
      icon: '#e9d5ff',
      hint: '#e9d5ff',
      pointer: '#c4b5fd',
      bold: true,
    };
  }
  return {
    label: menuPurple.label,
    description: menuPurple.secondary,
    meta: menuPurple.secondary,
    icon: menuPurple.dim,
    hint: menuPurple.secondary,
    pointer: menuPurple.dim,
    bold: false,
  };
}
