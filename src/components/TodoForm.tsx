import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { colors, priorityMeta } from '../theme/theme.js';
import { formatAbsolute, parseDueDate, parseReminder } from '../core/util/datetime.js';

export interface TodoFormValues {
  title: string;
  notes: string;
  project: string;
  priority: number;
  due: string;
  reminder: string;
}

interface TodoFormProps {
  initial: TodoFormValues;
  onSubmit: (values: TodoFormValues) => void;
  onError: (message: string) => void;
}

const FIELDS = ['title', 'notes', 'project', 'priority', 'due', 'reminder'] as const;
type FieldName = (typeof FIELDS)[number];

const LABELS: Record<FieldName, string> = {
  title: 'Title',
  notes: 'Notes',
  project: 'Project',
  priority: 'Priority',
  due: 'Due',
  reminder: 'Reminder',
};

const HELP: Partial<Record<FieldName, string>> = {
  due: 'e.g. "today 17:00", "tomorrow 9am", "+2h", "2026-06-10 09:00"',
  reminder: 'e.g. "10m" / "1h before", "at", or a date — relative to the due time',
  priority: '← → to change',
};

/**
 * Multi-field todo editor. Navigate with ↑↓ / Tab, tweak priority with ←→,
 * submit with Ctrl+S (or Enter on the last field), cancel with Esc.
 */
export function TodoForm({ initial, onSubmit, onError }: TodoFormProps) {
  const [values, setValues] = useState<TodoFormValues>(initial);
  const [active, setActive] = useState(0);

  const field = FIELDS[active];
  const set = (name: FieldName, value: string | number) =>
    setValues((v) => ({ ...v, [name]: value }));

  const submit = () => {
    if (!values.title.trim()) {
      onError('Title is required');
      setActive(0);
      return;
    }
    onSubmit(values);
  };

  useInput((input, key) => {
    if (key.ctrl && input === 's') submit();
    else if (key.tab && key.shift) setActive((a) => (a - 1 + FIELDS.length) % FIELDS.length);
    else if (key.tab) setActive((a) => (a + 1) % FIELDS.length);
    else if (key.upArrow) setActive((a) => (a - 1 + FIELDS.length) % FIELDS.length);
    else if (key.downArrow) setActive((a) => (a + 1) % FIELDS.length);
    else if (key.return) {
      if (active === FIELDS.length - 1) submit();
      else setActive((a) => a + 1);
    } else if (field === 'priority') {
      if (key.leftArrow) set('priority', values.priority <= 1 ? 4 : values.priority - 1);
      else if (key.rightArrow) set('priority', values.priority >= 4 ? 1 : values.priority + 1);
    }
  });

  const dueDate = parseDueDate(values.due);
  const remindDate = parseReminder(values.reminder, dueDate);

  return (
    <Box flexDirection="column">
      {FIELDS.map((name, i) => {
        const isActive = i === active;
        const labelColor = isActive ? colors.accent : colors.muted;
        return (
          <Box key={name} flexDirection="column" marginBottom={1}>
            <Box>
              <Box width={2}>
                <Text color={colors.accent}>{isActive ? '❯' : ' '}</Text>
              </Box>
              <Box width={10}>
                <Text bold color={labelColor}>
                  {LABELS[name]}
                </Text>
              </Box>
              {name === 'priority' ? (
                <PrioritySelector value={values.priority} active={isActive} />
              ) : (
                <TextInput
                  value={String(values[name])}
                  onChange={(v) => set(name, v)}
                  focus={isActive}
                  placeholder={name === 'title' ? 'What needs doing?' : '—'}
                />
              )}
            </Box>
            {isActive && HELP[name] ? (
              <Box marginLeft={12}>
                <Text color={colors.dim}>{HELP[name]}</Text>
              </Box>
            ) : null}
          </Box>
        );
      })}

      <Box marginTop={0} flexDirection="column">
        {dueDate ? <Text color={colors.info}>↳ due {formatAbsolute(dueDate)}</Text> : null}
        {remindDate ? (
          <Text color={colors.warning}>↳ reminder {formatAbsolute(remindDate)}</Text>
        ) : null}
      </Box>
    </Box>
  );
}

function PrioritySelector({ value, active }: { value: number; active: boolean }) {
  return (
    <Box>
      {[1, 2, 3, 4].map((p) => {
        const meta = priorityMeta[p];
        const selected = p === value;
        return (
          <Box key={p} marginRight={1}>
            <Text
              color={selected ? meta.color : colors.dim}
              bold={selected}
              inverse={selected && active}
            >
              {' '}
              {meta.label}{' '}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
