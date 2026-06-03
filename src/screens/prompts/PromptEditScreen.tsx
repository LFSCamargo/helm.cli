import { useRef, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Layout } from '../../components/Layout.js';
import { MultilineEditor } from '../../components/MultilineEditor.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { useToast } from '../../hooks/useToast.js';
import { readPrompt, writePrompt } from '../../core/prompts/prompt.service.js';
import { colors, gradients } from '../../theme/theme.js';

export function PromptEditScreen({ project, slug }: { project: string; slug: string }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const initial = useRef(readPrompt(project, slug)).current;
  const draft = useRef(initial);
  const [dirty, setDirty] = useState(false);

  const save = () => {
    writePrompt(project, slug, draft.current);
    setDirty(false);
    show('Saved', 'success');
  };

  useInput((input, key) => {
    // Ctrl+S to save, Esc to leave (saving any pending changes first).
    if (key.ctrl && input === 's') {
      save();
    } else if (key.escape) {
      if (draft.current !== initial) writePrompt(project, slug, draft.current);
      router.back();
    }
  });

  return (
    <Layout
      breadcrumb={['Prompts', project, `${slug}.md`, 'edit']}
      title={`Editing ${slug}`}
      subtitle={dirty ? '● unsaved changes' : 'all changes saved'}
      accent={gradients.ocean}
      message={toast}
      hints={[
        { key: '^S', label: 'save' },
        { key: '↑↓←→', label: 'move' },
        { key: 'esc', label: 'save & back' },
      ]}
    >
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={colors.borderActive}
        paddingX={1}
      >
        <MultilineEditor
          initialValue={initial}
          onChange={(value) => {
            draft.current = value;
            setDirty(value !== initial);
          }}
        />
      </Box>
      <Box marginTop={1}>
        <Text color={colors.dim}>Markdown supported · cursor moves with arrow keys</Text>
      </Box>
    </Layout>
  );
}
