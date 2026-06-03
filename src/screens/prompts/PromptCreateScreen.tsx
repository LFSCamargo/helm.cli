import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { Layout } from '../../components/Layout.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { createPrompt, slugify } from '../../core/prompts/prompt.service.js';
import { colors, gradients, symbols } from '../../theme/theme.js';

export function PromptCreateScreen({ project }: { project: string }) {
  const router = useRouter();
  const [title, setTitle] = useState('');

  useInput((_input, key) => {
    if (key.escape) router.back();
  });

  const submit = () => {
    if (!title.trim()) return;
    const slug = createPrompt(project, title);
    router.replace({ name: 'prompt-edit', project, slug });
  };

  return (
    <Layout
      breadcrumb={['Prompts', project, 'New prompt']}
      title="New prompt"
      subtitle="We'll seed a markdown template and drop you into the editor."
      accent={gradients.ocean}
      hints={[
        { key: '⏎', label: 'create & edit' },
        { key: 'esc', label: 'cancel' },
      ]}
    >
      <Box flexDirection="column">
        <Text color={colors.muted}>Prompt title</Text>
        <Box>
          <Text color={colors.accent} bold>{`${symbols.pointer} `}</Text>
          <TextInput
            value={title}
            onChange={setTitle}
            onSubmit={submit}
            placeholder="Refactor a React component"
          />
        </Box>
        {title.trim() ? (
          <Box marginTop={1}>
            <Text color={colors.dim}>
              file: prompts/{project}/{slugify(title)}.md
            </Text>
          </Box>
        ) : null}
      </Box>
    </Layout>
  );
}
