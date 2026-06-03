import React from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import { Wordmark } from './Logo.js';
import { StatusBar, type KeyHint } from './StatusBar.js';
import { colors, gradients, symbols } from '../theme/theme.js';

interface LayoutProps {
  /** Breadcrumb segments, e.g. ['Prompts', 'my-app']. */
  breadcrumb?: string[];
  title: string;
  subtitle?: string;
  accent?: readonly string[];
  hints: KeyHint[];
  message?: { text: string; tone?: 'success' | 'danger' | 'info' } | null;
  children: React.ReactNode;
}

/** Shared chrome: header (wordmark + breadcrumb), bordered body, status bar. */
export function Layout({
  breadcrumb = [],
  title,
  subtitle,
  accent = gradients.brand,
  hints,
  message,
  children,
}: LayoutProps) {
  return (
    <Box flexDirection="column" paddingX={1} paddingY={0}>
      <Box justifyContent="space-between">
        <Box>
          <Wordmark />
          {breadcrumb.length > 0 ? (
            <Text color={colors.dim}>
              {'  '}
              {breadcrumb.map((crumb, i) => (
                <Text key={i}>
                  {i > 0 ? <Text color={colors.border}> {symbols.arrow} </Text> : null}
                  <Text color={colors.muted}>{crumb}</Text>
                </Text>
              ))}
            </Text>
          ) : null}
        </Box>
      </Box>

      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={colors.border}
        paddingX={2}
        paddingY={1}
        marginTop={1}
      >
        <Box flexDirection="column" marginBottom={1}>
          <Gradient colors={[...accent]}>
            <Text bold>{title}</Text>
          </Gradient>
          {subtitle ? <Text color={colors.dim}>{subtitle}</Text> : null}
        </Box>
        {children}
      </Box>

      <StatusBar hints={hints} message={message} />
    </Box>
  );
}
