import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import { env } from './src/config/env';

const reporters: ReporterDescription[] = [
  ['list'],
  ['html', { outputFolder: 'test-results/playwright-report', open: 'never' }],
];
if (env.CI) {
  reporters.push(['github']);
}

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: env.CI,
  retries: env.CI ? 2 : 0,
  workers: env.CI ? 2 : undefined,
  reporter: reporters,
  outputDir: 'test-results/playwright-artifacts',

  use: {
    baseURL: env.APP_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'ui-chromium',
      testDir: './src/ui/tests',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: './src/api/tests',
      use: { baseURL: env.API_BASE_URL },
    },
  ],
});
