import { Text } from 'ink';
import Gradient from 'ink-gradient';
import { useFrame } from '../hooks/useFrame.js';

interface AnimatedGradientProps {
  /** A seamless palette (see `flow` in theme). */
  colors: readonly string[];
  bold?: boolean;
  /** Milliseconds between shimmer steps. Higher = calmer. */
  speedMs?: number;
  /** Pause the shimmer (renders a static gradient). */
  active?: boolean;
  children: string;
}

/** Rotate an array left by `by` (wrapping), without mutating the input. */
function rotate<T>(arr: readonly T[], by: number): T[] {
  const n = arr.length;
  if (n === 0) return [...arr];
  const k = ((by % n) + n) % n;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

/**
 * Text painted with a gradient that flows over time. The gradient stops are
 * rotated one position per frame, creating a smooth shimmer across the glyphs.
 */
export function AnimatedGradient({
  colors,
  bold,
  speedMs = 130,
  active = true,
  children,
}: AnimatedGradientProps) {
  const frame = useFrame(speedMs, active);
  const palette = active ? rotate(colors, frame) : [...colors];
  return (
    <Gradient colors={palette}>
      <Text bold={bold}>{children}</Text>
    </Gradient>
  );
}
