import { Box, Text } from 'ink';
import { colors, symbols } from '../theme/theme.js';

export interface KeyHint {
  key: string;
  label: string;
}

interface StatusBarProps {
  hints: KeyHint[];
  message?: { text: string; tone?: 'success' | 'danger' | 'info' } | null;
}

const toneColor: Record<string, string> = {
  success: colors.success,
  danger: colors.danger,
  info: colors.info,
};

/** Bottom bar showing contextual key bindings + an optional transient toast. */
export function StatusBar({ hints, message }: StatusBarProps) {
  return (
    <Box marginTop={1} flexDirection="column">
      {message ? (
        <Box marginBottom={0}>
          <Text color={toneColor[message.tone ?? 'info']} bold>
            {message.tone === 'success' ? symbols.check : symbols.spark} {message.text}
          </Text>
        </Box>
      ) : null}
      <Box>
        {hints.map((hint, i) => (
          <Box key={hint.key} marginRight={2}>
            <Text color={colors.accent} bold>
              {hint.key}
            </Text>
            <Text color={colors.dim}> {hint.label}</Text>
            {i < hints.length - 1 ? <Text color={colors.border}> </Text> : null}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
