import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['src/steps/**/*.ts', 'src/fixtures/**/*.ts'],
  enrichReporterData: false,
});

export default defineConfig({
  testDir,
  timeout: 15 * 60 * 1000,
  expect: { timeout: 60 * 1000 },
  workers: 1,
  retries: 0,
  reporter: [['list']],
  // outputDir: '',
  use: {
    channel: 'msedge',
    headless: false,
    viewport: null,
    screenshot: 'off',
    video: 'off',
    trace: 'off',
    launchOptions: {
      args: ['--start-maximized'],
    },
  },
});
