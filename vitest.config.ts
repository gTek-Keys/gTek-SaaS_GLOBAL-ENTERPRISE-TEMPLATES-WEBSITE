import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'apps/gtek-web/**/*.test.{ts,tsx,js,jsx}'
    ],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
