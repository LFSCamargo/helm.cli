import { useMemo, useState } from 'react';
import { Box, useInput } from 'ink';
import { Layout } from '../../components/Layout.js';
import { SelectList } from '../../components/SelectList.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { useToast } from '../../hooks/useToast.js';
import {
  deletePrompt,
  getProjectDescription,
  listPrompts,
  readPrompt,
} from '../../core/prompts/prompt.service.js';
import { copyToClipboard } from '../../services/clipboard.js';
import { flow, gradients, symbols } from '../../theme/theme.js';
import { MenuText } from '../../components/MenuText.js';
import { formatRelative } from '../../core/util/datetime.js';

export function PromptListScreen({ project }: { project: string }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const [tick, setTick] = useState(0);
  // tick forces refresh after mutations without remounting the screen
  const prompts = useMemo(() => listPrompts(project), [project, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  const copyPrompt = async (slug: string) => {
    const content = readPrompt(project, slug);
    const ok = await copyToClipboard(content);
    show(
      ok ? 'Copied to clipboard — paste it to your agent!' : 'Clipboard unavailable',
      ok ? 'success' : 'danger',
    );
  };

  useInput((input, key) => {
    if (key.escape) router.back();
    else if (input === 'n') router.navigate({ name: 'prompt-create', project });
  });

  return (
    <Layout
      breadcrumb={['Prompts', project]}
      title={project}
      subtitle={getProjectDescription(project, prompts.length)}
      accent={gradients.ocean}
      bodyBorder={false}
      contentPaddingX={0}
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
        accent={flow.ocean}
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
          <Box flexDirection="column">
            <Box>
              <Box width={3}>
                <MenuText variant="icon" selected={selected} bold>
                  {selected ? symbols.spark : symbols.dot}
                </MenuText>
              </Box>
              <MenuText variant="label" selected={selected} bold>
                {prompt.title}
              </MenuText>
            </Box>
            <Box marginLeft={3}>
              <MenuText variant="description" selected={selected}>
                {`${prompt.slug}.md ${symbols.separator} ${formatRelative(prompt.updatedAt)}`}
              </MenuText>
            </Box>
          </Box>
        )}
      />
    </Layout>
  );
}
