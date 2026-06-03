import { useEffect, useState } from 'react';

/**
 * Lightweight animation ticker. Returns a frame counter that increments every
 * `intervalMs`. Pass `active = false` to pause (and stop re-rendering) when an
 * animation is off-screen or not needed, keeping the TUI cheap to run.
 */
export function useFrame(intervalMs = 120, active = true): number {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => {
      // Wrap well before MAX_SAFE_INTEGER so the counter never overflows.
      setFrame((f) => (f + 1) % 1_000_000);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, active]);

  return frame;
}
