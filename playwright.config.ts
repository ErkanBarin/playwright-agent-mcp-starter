import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import { Timeouts } from './utils';

/**
 * Playwright Configuration
 *
 * This config reads environment variables from .env (via dotenv) and sets up
 * multi-browser testing with sensible defaults for both local and CI runs.
 *
 * Projects:
 *   - setup:    Runs auth.setup.ts first (login, save storageState)
 *   - chromium: UI tests in Chrome (depends on setup)
 *   - firefox:  UI tests in Firefox (depends on setup)
 *   - webkit:   UI tests in Safari (depends on setup)
 *   - api:      API-only tests — no browser launched
 *
 * Usage:
 *   npm test            - Run all tests across all browsers
 *   npm run test:ui     - Run only @ui-tagged tests
 *   npm run test:api    - Run only @api-tagged tests
 *   npm run test:debug  - Run tests in debug mode (headed + Playwright Inspector)
 *   npm run report      - Open the HTML report
 *
 * @see https://playwright.dev/docs/test-configuration
 */

const AUTH_STATE_PATH = 'test-results/.auth/state.json';

export default defineConfig({
  /* Directory where test files are located */
  testDir: './tests',

  /* Directory for test artifacts (screenshots, videos, traces) */
  outputDir: './test-results',

  /* Maximum time a single test can run */
  timeout: Timeouts.TEST,

  /* Maximum time expect() assertions can wait */
  expect: {
    timeout: Timeouts.MEDIUM,
  },

  /* Run tests in parallel within each file */
  fullyParallel: true,

  /* Fail the build on CI if test.only is left in source code */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests: 2 on CI, 1 locally (catches flaky tests during dev) */
  retries: process.env.CI ? 2 : 1,

  /* Limit parallel workers on CI to avoid resource contention */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter configuration */
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['list'], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['html', { open: 'on-failure' }], ['list']],

  /* Shared settings applied to all projects below */
  use: {
    /* Base URL for navigation actions like page.goto('/') */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    /* Timeout for actions like click(), fill(), etc. — fail fast instead of hanging */
    actionTimeout: Timeouts.LONG,

    /* Timeout for page.goto() and navigations */
    navigationTimeout: Timeouts.NAVIGATION,

    /* Capture trace on first retry to help debug flaky tests */
    trace: 'on-first-retry',

    /* Take screenshots only when a test fails */
    screenshot: 'only-on-failure',

    /* Record video but keep only for failed tests */
    video: 'retain-on-failure',

    /* Extra HTTP headers (useful for API testing or auth tokens) */
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },

  projects: [
    /* ---- Auth setup (runs before UI projects) ---- */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    /* ---- UI browser projects (depend on auth setup) ---- */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_STATE_PATH,
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: AUTH_STATE_PATH,
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: AUTH_STATE_PATH,
      },
      dependencies: ['setup'],
    },

    /* ---- API project (no browser — faster, cleaner separation) ---- */
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://httpbin.org',
      },
    },
  ],
});
