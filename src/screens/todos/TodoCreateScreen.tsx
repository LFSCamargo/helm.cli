import { useInput } from 'ink';
import { Layout } from '../../components/Layout.js';
import { TodoForm, type TodoFormValues } from '../../components/TodoForm.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { useToast } from '../../hooks/useToast.js';
import { createTodo } from '../../core/todos/todo.service.js';
import { parseDueDate, parseReminder } from '../../core/util/datetime.js';
import { gradients } from '../../theme/theme.js';

const EMPTY: TodoFormValues = {
  title: '',
  notes: '',
  project: '',
  priority: 4,
  due: '',
  reminder: '',
};

export function TodoCreateScreen() {
  const router = useRouter();
  const { toast, show } = useToast();

  useInput((_input, key) => {
    if (key.escape) router.back();
  });

  const handleSubmit = (values: TodoFormValues) => {
    const dueAt = parseDueDate(values.due);
    void createTodo({
      title: values.title,
      notes: values.notes,
      project: values.project,
      priority: values.priority,
      dueAt,
      remindAt: parseReminder(values.reminder, dueAt),
    }).then(() => router.back());
  };

  return (
    <Layout
      breadcrumb={['Todos', 'New']}
      title="New task"
      subtitle="Capture it before it slips away."
      accent={gradients.flame}
      message={toast}
      hints={[
        { key: '↑↓/⇥', label: 'fields' },
        { key: '←→', label: 'priority' },
        { key: '^S/⏎', label: 'save' },
        { key: 'esc', label: 'cancel' },
      ]}
    >
      <TodoForm initial={EMPTY} onSubmit={handleSubmit} onError={(m) => show(m, 'danger')} />
    </Layout>
  );
}
