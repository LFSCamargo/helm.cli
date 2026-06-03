import { useCallback, useEffect, useRef, useState } from 'react';

export type ToastTone = 'success' | 'danger' | 'info';
export interface ToastMessage {
  text: string;
  tone?: ToastTone;
}

/** Transient status message that auto-dismisses after a short delay. */
export function useToast(timeoutMs = 2200) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (text: string, tone: ToastTone = 'info') => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ text, tone });
      timer.current = setTimeout(() => setToast(null), timeoutMs);
    },
    [timeoutMs],
  );

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { toast, show };
}
