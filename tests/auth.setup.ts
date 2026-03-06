import { test as setup } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Authentication Setup
 *
 * This file runs before all UI browser projects (chromium, firefox, webkit).
 * It authenticates once and saves the browser state (cookies, localStorage)
 * to a JSON file that other projects reuse via storageState.
 *
 * Cache logic:
 *   - If state.json exists and cookies are not expired → skip login (fast)
 *   - If state.json is missing or cookies expired → login and save fresh state
 *
 * How to use:
 *   1. Replace the placeholder login steps below with your app's login flow
 *   2. The saved state is loaded automatically by browser projects in playwright.config.ts
 *   3. Every UI test starts already authenticated — no login needed per test
 *
 * @see https://playwright.dev/docs/auth
 */

/** Stored outside outputDir so Playwright doesn't wipe it between runs. */
const AUTH_STATE_PATH = '.auth/state.json';

/**
 * Check if the cached auth state is still valid.
 *
 * Reads state.json and checks every cookie's `expires` field.
 * Returns true only if the file exists AND all cookies are still valid.
 */
function isAuthStateValid(): boolean {
  const fullPath = path.resolve(AUTH_STATE_PATH);

  if (!fs.existsSync(fullPath)) {
    return false;
  }

  try {
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const state = JSON.parse(raw);

    // No cookies at all — treat as invalid (fresh placeholder file)
    if (!state.cookies || state.cookies.length === 0) {
      return false;
    }

    const now = Date.now() / 1000; // cookies use Unix seconds

    // Check if any cookie has expired
    const hasExpired = state.cookies.some(
      (cookie: { expires: number }) =>
        cookie.expires > 0 && cookie.expires < now,
    );

    return !hasExpired;
  } catch {
    // Corrupt file — re-authenticate
    return false;
  }
}

setup('authenticate', async ({ page }) => {
  // Skip login if we already have a valid cached session
  if (isAuthStateValid()) {
    // eslint-disable-next-line no-console
    console.log('[auth] Reusing cached session — cookies still valid.');
    return;
  }

  // eslint-disable-next-line no-console
  console.log('[auth] No valid session found — authenticating...');

  // ----------------------------------------------------------------
  // Replace the steps below with your application's login flow.
  //
  // Example for a typical email/password login:
  //
  //   await page.goto('/login');
  //   await page.getByLabel('Email').fill('testuser@example.com');
  //   await page.getByLabel('Password').fill(process.env.TEST_PASSWORD ?? '<from-env>');
  //   await page.getByRole('button', { name: 'Sign in' }).click();
  //   await page.waitForURL('/dashboard');
  //
  // Example for API-based auth (faster):
  //
  //   const response = await page.request.post('/api/auth/login', {
  //     data: { email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD },
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
