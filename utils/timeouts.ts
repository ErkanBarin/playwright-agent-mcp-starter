/**
 * Timeout Constants
 *
 * Centralized timeout values to eliminate magic numbers across tests and config.
 * Use these instead of hardcoded millisecond values for consistency and easy tuning.
 *
 * @example
 *   import { Timeouts } from '../utils/timeouts';
 *
 *   await page.click(selector, { timeout: Timeouts.SHORT });
 *   await page.goto(url, { timeout: Timeouts.NAVIGATION });
 */

/** Timeout values in milliseconds for use across tests and configuration. */
export const Timeouts = {
  /** 3s — quick assertions, element visibility checks */
  SHORT: 3_000,

  /** 5s — expect() assertions, standard element interactions */
  MEDIUM: 5_000,

  /** 10s — clicks, fills, and other action timeouts */
  LONG: 10_000,

  /** 15s — page.goto(), page navigations, route changes */
  NAVIGATION: 15_000,

  /** 30s — full test timeout (default per-test limit) */
  TEST: 30_000,

  /** 60s — complex flows, file uploads, heavy pages */
  EXTENDED: 60_000,

  /** 120s — global setup/teardown, server startup */
  GLOBAL: 120_000,
} as const;

/** Type for any value in the Timeouts object. */
export type TimeoutValue = (typeof Timeouts)[keyof typeof Timeouts];
