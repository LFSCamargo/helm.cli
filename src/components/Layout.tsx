import React from 'react';
import { Box, Text } from 'ink';
import { AnimatedGradient } from './AnimatedGradient.js';
import { GradientBreadcrumb } from './GradientBreadcrumb.js';
import { StatusBar, type KeyHint } from './StatusBar.js';
import { useFrame } from '../hooks/useFrame.js';
import { colors, gradients, symbols } from '../theme/theme.js';

interface LayoutProps {
  /** Breadcrumb segments after ◆ helm, e.g. ['Todos'] or ['Prompts', 'my-app']. */
  breadcrumb?: string[];
  /** Large heading; omitted when it repeats the last breadcrumb segment. */
  title?: string;
  /** Muted helper line under the breadcrumb (or under the title when shown). */
  subtitle?: string;
  accent?: readonly string[];
  hints: KeyHint[];
  message?: { text: string; tone?: 'success' | 'danger' | 'info' } | null;
  bodyBorder?: boolean;
  contentPaddingX?: number;
  children: React.ReactNode;
}

/** Build a seamless, loopable palette from a short static gradient. */
function seamless(palette: readonly string[]): string[] {
  if (palette.length < 3) return [...palette, ...palette];
  return [...palette, ...palette.slice(1, -1).reverse()];
}

/** True when the big title would duplicate the breadcrumb trail. */
export function isTitleRedundant(title: string, breadcrumb: string[]): boolean {
  if (!title.trim() || breadcrumb.length === 0) return false;
  const last = breadcrumb[breadcrumb.length - 1];
  const lastBase = last.replace(/\.md$/i, '');
  const t = title.trim();
  const lower = t.toLowerCase();
  return (
    t === last || lower === last.toLowerCase() || t === lastBase || lower === lastBase.toLowerCase()
  );
}

function Clock() {
  useFrame(20_000);
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return (
    <Text color={colors.dim}>
      {symbols.clock} {hh}:{mm}
    </Text>
  );
}

/** Shared chrome: gradient breadcrumb header, body, status bar. */
export function Layout({
  breadcrumb = [],
  title,
  subtitle,
  accent = gradients.brand,
  hints,
  message,
  bodyBorder = true,
  contentPaddingX = 2,
  children,
}: LayoutProps) {
  const breadcrumbAccent = seamless(accent);
  const showTitle = title ? !isTitleRedundant(title, breadcrumb) : false;
  const showHeader = showTitle || Boolean(subtitle);

  return (
    <Box flexDirection="column" paddingX={1} paddingY={0}>
      <Box justifyContent="space-between">
        <GradientBreadcrumb segments={breadcrumb} accent={breadcrumbAccent} />
        <Clock />
      </Box>

      <Box
        flexDirection="column"
        borderStyle={bodyBorder ? 'round' : undefined}
        borderColor={bodyBorder ? colors.border : undefined}
        paddingX={contentPaddingX}
        paddingY={bodyBorder ? 1 : 0}
        marginTop={1}
      >
        {showHeader ? (
          <Box flexDirection="column" marginBottom={1}>
            {showTitle ? (
              <AnimatedGradient colors={breadcrumbAccent} speedMs={150} bold>
                {title!}
              </AnimatedGradient>
            ) : null}
            {subtitle ? <Text color={colors.dim}>{subtitle}</Text> : null}
          </Box>
        ) : null}
        {children}
      </Box>

      <StatusBar hints={hints} message={message} />
    </Box>
  );
}
