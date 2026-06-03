import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Route } from './routes.js';

interface RouterValue {
  route: Route;
  depth: number;
  navigate: (route: Route) => void;
  /** Replace the current route without growing the stack. */
  replace: (route: Route) => void;
  back: () => void;
  reset: (route?: Route) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);

  const navigate = useCallback((route: Route) => {
    setStack((prev) => [...prev, route]);
  }, []);

  const replace = useCallback((route: Route) => {
    setStack((prev) => [...prev.slice(0, -1), route]);
  }, []);

  const back = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const reset = useCallback((route: Route = { name: 'home' }) => {
    setStack([route]);
  }, []);

  const value = useMemo<RouterValue>(
    () => ({
      route: stack[stack.length - 1],
      depth: stack.length,
      navigate,
      replace,
      back,
      reset,
    }),
    [stack, navigate, replace, back, reset],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within a RouterProvider');
  return ctx;
}
