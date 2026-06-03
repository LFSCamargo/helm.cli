import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
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
            {message.tone === 'success' ? (
              `${symbols.check} `
            ) : message.tone === 'danger' ? (
              `${symbols.spark} `
            ) : (
              <Spinner type="dots" />
            )}
            {message.tone === 'info' ? ' ' : ''}
            {message.text}
          </Text>
        </Box>
      ) : null}
      <Box>
        {hints.map((hint, i) => (
          <Box key={hint.key}>
            {i > 0 ? <Text color={colors.border}> {symbols.separator} </Text> : null}
            <Text color={colors.accent} bold>
              {hint.key}
            </Text>
            <Text color={colors.dim}> {hint.label}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
