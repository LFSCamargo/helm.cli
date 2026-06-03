import { useMemo, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Layout } from '../../components/Layout.js';
import { SelectList } from '../../components/SelectList.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { useToast } from '../../hooks/useToast.js';
import {
  deletePrompt,
  listPrompts,
  readPrompt,
} from '../../core/prompts/prompt.service.js';
import { copyToClipboard } from '../../services/clipboard.js';
import { colors, gradients, symbols } from '../../theme/theme.js';
import { formatRelative } from '../../core/util/datetime.js';

export function PromptListScreen({ project }: { project: string }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const [tick, setTick] = useState(0);
  const prompts = useMemo(() => listPrompts(project), [project, tick]);

  const copyPrompt = async (slug: string) => {
    const content = readPrompt(project, slug);
    const ok = await copyToClipboard(content);
    show(ok ? 'Copied to clipboard — paste it to your agent!' : 'Clipboard unavailable', ok ? 'success' : 'danger');
  };

  useInput((input, key) => {
    if (key.escape) router.back();
    else if (input === 'n') router.navigate({ name: 'prompt-create', project });
  });

  return (
    <Layout
      breadcrumb={['Prompts', project]}
      title={`${project}`}
      subtitle="Reusable prompts in this project."
      accent={gradients.ocean}
      message={toast}
      hints={[
        { key: '↑↓', label: 'navigate' },
        { key: '⏎', label: 'view' },
        { key: 'c', label: 'copy' },
        { key: 'e', label: 'edit' },
        { key: 'n', label: 'new' },
        { key: 'd', label: 'delete' },
        { key: 'esc', label: 'back' },
      ]}
    >
      <SelectList
        items={prompts}
        getKey={(p) => p.slug}
        emptyText="No prompts yet. Press n to create one."
        onSelect={(p) => router.navigate({ name: 'prompt-view', project, slug: p.slug })}
        actions={{
          c: (p) => void copyPrompt(p.slug),
          e: (p) => router.navigate({ name: 'prompt-edit', project, slug: p.slug }),
          d: (p) => {
            deletePrompt(project, p.slug);
            show(`Deleted "${p.title}"`, 'danger');
            setTick((t) => t + 1);
          },
        }}
        renderItem={(prompt, selected) => (
          <Box>
            <Box width={3}>
              <Text color={colors.accentAlt}>{selected ? symbols.spark : symbols.dot}</Text>
            </Box>
            <Box width={32}>
              <Text bold color={selected ? colors.text : colors.muted}>
                {prompt.title}
              </Text>
            </Box>
            <Text color={colors.dim}>
              {prompt.slug}.md {symbols.dot} {formatRelative(prompt.updatedAt)}
            </Text>
          </Box>
        )}
      />
    </Layout>
  );
}
