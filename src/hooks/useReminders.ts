import { useEffect, useRef } from 'react';
import { dueReminders, markReminded } from '../core/todos/todo.service.js';
import { notify } from '../services/notifications.js';
import { formatAbsolute } from '../core/util/datetime.js';

/**
 * Background poller that fires desktop notifications for todos whose reminder
 * time has arrived. Runs for the lifetime of the app (while the TUI is open).
 */
export function useReminders(pollMs = 20000): void {
  const running = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      if (running.current) return;
      running.current = true;
      try {
        const due = await dueReminders();
        for (const todo of due) {
          const when = todo.dueAt ? ` · due ${formatAbsolute(todo.dueAt)}` : '';
          notify('⏰ Reminder', `${todo.title}${when}`);
          await markReminded(todo.id);
        }
      } catch {
        // Polling errors are non-fatal; try again next tick.
      } finally {
        running.current = false;
      }
    };

    void tick();
    const interval = setInterval(() => {
      if (!cancelled) void tick();
    }, pollMs);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pollMs]);
}
