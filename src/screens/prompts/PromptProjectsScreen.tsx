import { useMemo, useState } from 'react';
import { useInput } from 'ink';
import { Layout } from '../../components/Layout.js';
import { SelectList } from '../../components/SelectList.js';
import { MenuRow } from '../../components/MenuRow.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { listProjects } from '../../core/prompts/prompt.service.js';
import { flow, gradients } from '../../theme/theme.js';
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
      subtitle="Each folder is a project — pick one to browse or copy prompts."
      accent={gradients.ocean}
      bodyBorder={false}
      contentPaddingX={0}
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
        accent={flow.ocean}
        emptyText="No projects yet. Press n to create your first one."
        onSelect={(p) => router.navigate({ name: 'prompt-list', project: p.name })}
        renderItem={(project, selected) => (
          <MenuRow
            label={project.name}
            description={project.description}
            meta={formatRelative(project.updatedAt)}
            selected={selected}
            icon="◈"
          />
        )}
      />
    </Layout>
  );
}
