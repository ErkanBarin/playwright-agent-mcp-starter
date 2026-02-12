import { test as setup } from '@playwright/test';

/**
 * Authentication Setup
 *
 * This file runs before all UI browser projects (chromium, firefox, webkit).
 * It authenticates once and saves the browser state (cookies, localStorage)
 * to a JSON file that other projects reuse via storageState.
 *
 * Benefits over globalSetup:
 *   - Appears in the HTML report with traces
 *   - Can use Playwright fixtures (page, context, etc.)
 *   - Retries work if auth is flaky
 *
 * How to use:
 *   1. Replace the placeholder login steps below with your app's login flow
 *   2. The saved state is loaded automatically by browser projects in playwright.config.ts
 *   3. Every UI test starts already authenticated — no login needed per test
 *
 * @see https://playwright.dev/docs/auth
 */

const AUTH_STATE_PATH = 'test-results/.auth/state.json';

setup('authenticate', async ({ page }) => {
  // ----------------------------------------------------------------
  // Replace the steps below with your application's login flow.
  //
  // Example for a typical email/password login:
  //
  //   await page.goto('/login');
  //   await page.getByLabel('Email').fill('testuser@example.com');
  //   await page.getByLabel('Password').fill('password123');
  //   await page.getByRole('button', { name: 'Sign in' }).click();
  //   await page.waitForURL('/dashboard');
  //
  // Example for API-based auth (faster):
  //
  //   const response = await page.request.post('/api/auth/login', {
  //     data: { email: 'testuser@example.com', password: 'password123' },
  //   });
  //   const { token } = await response.json();
  //   await page.goto('/');
  //   await page.evaluate((t) => localStorage.setItem('auth_token', t), token);
  //
  // ----------------------------------------------------------------

  // Placeholder: navigate to the base URL so storageState has a valid origin.
  // Remove this and add your real auth flow above.
  await page.goto('/');

  // Save the authenticated browser state for reuse by other projects
  await page.context().storageState({ path: AUTH_STATE_PATH });
});
