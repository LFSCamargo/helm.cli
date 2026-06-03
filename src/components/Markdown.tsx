import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme/theme.js';

/** Split a line into styled inline segments (code, bold, italic, plain). */
function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Tokenize on `code`, **bold**, and *italic* / _italic_.
  const regex = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*|_[^_]+_)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(<Text key={`${keyBase}-t${i++}`}>{text.slice(last, match.index)}</Text>);
    }
    const token = match[0];
    if (token.startsWith('`')) {
      nodes.push(
        <Text key={`${keyBase}-c${i++}`} color={colors.accentAlt} backgroundColor="#1f2233">
          {' '}
          {token.slice(1, -1)}{' '}
        </Text>,
      );
    } else if (token.startsWith('**')) {
      nodes.push(
        <Text key={`${keyBase}-b${i++}`} bold color={colors.text}>
          {token.slice(2, -2)}
        </Text>,
      );
    } else {
      nodes.push(
        <Text key={`${keyBase}-i${i++}`} italic color={colors.muted}>
          {token.slice(1, -1)}
        </Text>,
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) {
    nodes.push(<Text key={`${keyBase}-t${i++}`}>{text.slice(last)}</Text>);
  }
  return nodes;
}

/** Minimal but pretty markdown renderer tuned for terminal prompt previews. */
export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let inCode = false;
  let codeBuffer: string[] = [];
  let codeLang = '';

  const flushCode = (key: string) => {
    blocks.push(
      <Box
        key={key}
        flexDirection="column"
        borderStyle="round"
        borderColor={colors.border}
        paddingX={1}
        marginY={0}
      >
        {codeLang ? <Text color={colors.dim}>{codeLang}</Text> : null}
        {codeBuffer.map((c, i) => (
          <Text key={i} color={colors.success}>
            {c || ' '}
          </Text>
        ))}
      </Box>,
    );
    codeBuffer = [];
    codeLang = '';
  };

  lines.forEach((line, idx) => {
    const key = `md-${idx}`;
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      if (inCode) {
        flushCode(key);
        inCode = false;
      } else {
        inCode = true;
        codeLang = fence[1];
      }
      return;
    }
    if (inCode) {
      codeBuffer.push(line);
      return;
    }

    if (/^#{1,6}\s+/.test(line)) {
      const level = line.match(/^(#+)/)![1].length;
      const text = line.replace(/^#{1,6}\s+/, '');
      blocks.push(
        <Box key={key} marginTop={level === 1 ? 0 : 1}>
          <Text bold underline={level === 1} color={level === 1 ? colors.accent : colors.accentAlt}>
            {text}
          </Text>
        </Box>,
      );
      return;
    }

    if (/^\s*([-*+])\s+/.test(line)) {
      const text = line.replace(/^\s*([-*+])\s+/, '');
      blocks.push(
        <Box key={key}>
          <Text color={colors.accent}> • </Text>
          <Text>{renderInline(text, key)}</Text>
        </Box>,
      );
      return;
    }

    const ordered = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (ordered) {
      blocks.push(
        <Box key={key}>
          <Text color={colors.accent}> {ordered[1]}. </Text>
          <Text>{renderInline(ordered[2], key)}</Text>
        </Box>,
      );
      return;
    }

    if (/^\s*>\s?/.test(line)) {
      const text = line.replace(/^\s*>\s?/, '');
      blocks.push(
        <Box key={key}>
          <Text color={colors.border}>│ </Text>
          <Text color={colors.dim} italic>
            {text}
          </Text>
        </Box>,
      );
      return;
    }

    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      blocks.push(
        <Text key={key} color={colors.border}>
          ────────────────────────────
        </Text>,
      );
      return;
    }

    if (line.trim() === '') {
      blocks.push(<Text key={key}> </Text>);
      return;
    }

    blocks.push(
      <Text key={key} color={colors.text}>
        {renderInline(line, key)}
      </Text>,
    );
  });

  if (inCode) flushCode('md-code-tail');

  return <Box flexDirection="column">{blocks}</Box>;
}
