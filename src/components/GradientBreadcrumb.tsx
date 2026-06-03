import { AnimatedGradient } from './AnimatedGradient.js';
import { flow, symbols } from '../theme/theme.js';

interface GradientBreadcrumbProps {
  /** Trail after the wordmark, e.g. ['Todos'] or ['Prompts', 'my-app']. */
  segments?: string[];
  accent?: readonly string[];
  speedMs?: number;
}

/** Full header trail as one shimmering line: ◆ helm ❯ Todos ❯ … */
export function GradientBreadcrumb({
  segments = [],
  accent = flow.brand,
  speedMs = 150,
}: GradientBreadcrumbProps) {
  const trail =
    segments.length > 0
      ? `◆ helm ${segments.map((s) => `${symbols.chevron} ${s}`).join(' ')}`
      : '◆ helm';
  return (
    <AnimatedGradient colors={accent} speedMs={speedMs} bold>
      {trail}
    </AnimatedGradient>
  );
}
