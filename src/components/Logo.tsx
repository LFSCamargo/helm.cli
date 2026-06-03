import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import { gradients, colors } from '../theme/theme.js';

const BANNER = [
  '██╗  ██╗███████╗██╗     ███╗   ███╗',
  '██║  ██║██╔════╝██║     ████╗ ████║',
  '███████║█████╗  ██║     ██╔████╔██║',
  '██╔══██║██╔══╝  ██║     ██║╚██╔╝██║',
  '██║  ██║███████╗███████╗██║ ╚═╝ ██║',
  '╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚═╝',
].join('\n');

/** Full-size hero banner for the home screen. */
export function Logo() {
  return (
    <Box flexDirection="column" alignItems="flex-start">
      <Gradient colors={[...gradients.brand]}>
        <Text>{BANNER}</Text>
      </Gradient>
      <Box marginTop={0} marginLeft={1}>
        <Text color={colors.dim}>your terminal cockpit for prompts &amp; todos</Text>
      </Box>
    </Box>
  );
}

/** Compact inline wordmark for screen headers. */
export function Wordmark() {
  return (
    <Gradient colors={[...gradients.brand]}>
      <Text bold>◆ helm</Text>
    </Gradient>
  );
}
