import { Box, Text } from 'ink';
import { AnimatedGradient } from './AnimatedGradient.js';
import { flow, colors, symbols } from '../theme/theme.js';

const BANNER = [
  '██╗  ██╗███████╗██╗     ███╗   ███╗',
  '██║  ██║██╔════╝██║     ████╗ ████║',
  '███████║█████╗  ██║     ██╔████╔██║',
  '██╔══██║██╔══╝  ██║     ██║╚██╔╝██║',
  '██║  ██║███████╗███████╗██║ ╚═╝ ██║',
  '╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚═╝',
].join('\n');

/** Full-size hero banner for the home screen, with a flowing shimmer. */
export function Logo() {
  return (
    <Box flexDirection="column" alignItems="flex-start">
      <AnimatedGradient colors={flow.brand} speedMs={110}>
        {BANNER}
      </AnimatedGradient>
      <Box marginTop={0} marginLeft={1}>
        <Text color={colors.dim}>
          {symbols.spark} your terminal cockpit for prompts &amp; todos
        </Text>
      </Box>
    </Box>
  );
}

/** Compact inline wordmark for screen headers. */
export function Wordmark() {
  return (
    <AnimatedGradient colors={flow.brand} speedMs={180} bold>
      {'◆ helm'}
    </AnimatedGradient>
  );
}
