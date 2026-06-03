import { defineConfig } from 'vitest/config';

const shared = {
  environment: 'node' as const,
  globals: false,
  setupFiles: ['src/test/setup.ts'],
};

const coverage = {
  provider: 'v8' as const,
  reporter: ['text', 'json-summary', 'html'],
  include: ['src/core/**', 'src/config/**', 'src/theme/**'],
  exclude: [
    'src/**/__tests__/**',
    'src/**/*.test.ts',
    'src/cli.tsx',
    'src/app.tsx',
    'src/screens/**',
    'src/navigation/**',
    'src/services/**',
  ],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 75,
    statements: 80,
  },
};

export default defineConfig({
  test: {
    ...shared,
    coverage,
    projects: [
      {
        extends: true,
        test: {
          ...shared,
          name: 'unit',
          include: ['src/**/*.unit.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          ...shared,
          name: 'integration',
          include: ['src/**/*.integration.test.ts'],
          setupFiles: ['src/test/setup.ts', 'src/test/setup.integration.ts'],
        },
      },
    ],
  },
});
