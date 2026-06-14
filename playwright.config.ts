import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['src/steps/**/*.ts', 'src/fixtures/**/*.ts'],
});

export default defineConfig({
  testDir,
  timeout: 15 * 60 * 1000,
  expect: { timeout: 60 * 1000 },
  workers: 1,
  retries: 0,
  reporter: [['html'], ['list']],
  use: {
    headless: false,
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
});
