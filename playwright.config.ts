import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['src/steps/**/*.ts', 'src/fixtures/**/*.ts'],
  enrichReporterData: true,
});

export default defineConfig({
  testDir,
  timeout: 15 * 60 * 1000, // falha depois de 15 min
  expect: { timeout: 60 * 1000 },
  workers: 1,
  retries: 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list']],
  // outputDir: '',
  use: {
    // channel: 'msedge',
    headless: !!process.env.CI,
    channel: process.env.CI ? undefined : 'chrome',
    viewport: null,
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'off',
    launchOptions: {
      args: ['--start-maximized'],
    },
  },
});
