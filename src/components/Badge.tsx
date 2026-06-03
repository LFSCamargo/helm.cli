import { Text } from 'ink';
import { colors } from '../theme/theme.js';

interface BadgeProps {
  label: string;
  /** Foreground/text color. */
  color?: string;
  /** Optional solid pill background. */
  background?: string;
  bold?: boolean;
}

/**
 * Compact inline pill for counts, tags, and statuses. With a `background` it
 * reads as a solid chip; without one it falls back to a tinted, bracket-free
 * label that still stands apart from body copy.
 */
export function Badge({ label, color = colors.accent, background, bold = true }: BadgeProps) {
  if (background) {
    return (
      <Text backgroundColor={background} color={color} bold={bold}>
        {` ${label} `}
      </Text>
    );
  }
  return (
    <Text color={color} bold={bold}>
      {label}
    </Text>
  );
}
