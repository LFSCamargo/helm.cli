import { useMemo, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Layout } from '../../components/Layout.js';
import { SelectList } from '../../components/SelectList.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { listProjects } from '../../core/prompts/prompt.service.js';
import { colors, gradients, symbols } from '../../theme/theme.js';
import { formatRelative } from '../../core/util/datetime.js';

export function PromptProjectsScreen() {
  const router = useRouter();
  const [, setTick] = useState(0);
  const projects = useMemo(() => listProjects(), []);

  useInput((input, key) => {
    if (key.escape) router.back();
    else if (input === 'n') router.navigate({ name: 'project-create' });
    else if (input === 'r') setTick((t) => t + 1);
  });

  return (
    <Layout
      breadcrumb={['Prompts']}
      title="Prompt Library"
      subtitle="Pick a project to browse its reusable prompts."
      accent={gradients.ocean}
      hints={[
        { key: '↑↓', label: 'navigate' },
        { key: '⏎', label: 'open' },
        { key: 'n', label: 'new project' },
        { key: 'esc', label: 'back' },
      ]}
    >
      <SelectList
        items={projects}
        getKey={(p) => p.name}
        emptyText="No projects yet. Press n to create your first one."
        onSelect={(p) => router.navigate({ name: 'prompt-list', project: p.name })}
        renderItem={(project, selected) => (
          <Box>
            <Box width={3}>
              <Text color={colors.accentAlt}>◈</Text>
            </Box>
            <Box width={26}>
              <Text bold color={selected ? colors.text : colors.muted}>
                {project.name}
              </Text>
            </Box>
            <Text color={colors.dim}>
              {project.count} prompt{project.count === 1 ? '' : 's'} {symbols.dot}{' '}
              {formatRelative(project.updatedAt)}
            </Text>
          </Box>
        )}
      />
    </Layout>
  );
}
