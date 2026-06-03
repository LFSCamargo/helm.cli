import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { Layout } from '../../components/Layout.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { createProject, slugify } from '../../core/prompts/prompt.service.js';
import { colors, gradients, symbols } from '../../theme/theme.js';

export function ProjectCreateScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  useInput((_input, key) => {
    if (key.escape) router.back();
  });

  const submit = () => {
    if (!name.trim()) return;
    const slug = createProject(name);
    router.replace({ name: 'prompt-list', project: slug });
  };

  return (
    <Layout
      breadcrumb={['Prompts', 'New project']}
      title="Create a project"
      subtitle="Prompts will be stored as markdown under prompts/<project>/."
      accent={gradients.ocean}
      hints={[
        { key: '⏎', label: 'create' },
        { key: 'esc', label: 'cancel' },
      ]}
    >
      <Box flexDirection="column">
        <Text color={colors.muted}>Project name</Text>
        <Box>
          <Text color={colors.accent} bold>{`${symbols.pointer} `}</Text>
          <TextInput value={name} onChange={setName} onSubmit={submit} placeholder="my-app" />
        </Box>
        {name.trim() ? (
          <Box marginTop={1}>
            <Text color={colors.dim}>folder: prompts/{slugify(name)}/</Text>
          </Box>
        ) : null}
      </Box>
    </Layout>
  );
}
