import { useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import { Layout } from '../../components/Layout.js';
import { Markdown } from '../../components/Markdown.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { useToast } from '../../hooks/useToast.js';
import { readPrompt } from '../../core/prompts/prompt.service.js';
import { copyToClipboard } from '../../services/clipboard.js';
import { colors, gradients } from '../../theme/theme.js';

export function PromptViewScreen({ project, slug }: { project: string; slug: string }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const content = useMemo(() => readPrompt(project, slug), [project, slug]);

  useInput((input, key) => {
    if (key.escape) router.back();
    else if (input === 'e') router.navigate({ name: 'prompt-edit', project, slug });
    else if (input === 'c') {
      void copyToClipboard(content).then((ok) =>
        show(
          ok ? 'Copied to clipboard — paste it to your agent!' : 'Clipboard unavailable',
          ok ? 'success' : 'danger',
        ),
      );
    }
  });

  return (
    <Layout
      breadcrumb={['Prompts', project, `${slug}.md`]}
      title={slug}
      subtitle="Markdown preview — copy or edit to use with your agent."
      accent={gradients.ocean}
      message={toast}
      hints={[
        { key: 'c', label: 'copy' },
        { key: 'e', label: 'edit' },
        { key: 'esc', label: 'back' },
      ]}
    >
      <Box flexDirection="column">
        {content.trim() ? (
          <Markdown content={content} />
        ) : (
          <Text color={colors.dim} italic>
            This prompt is empty. Press e to start writing.
          </Text>
        )}
      </Box>
    </Layout>
  );
}
