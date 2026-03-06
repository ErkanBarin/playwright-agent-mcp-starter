import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/**
 * API Test Helpers
 *
 * Reusable utility functions for API testing with Playwright.
 * These helpers reduce boilerplate in your API test files and
 * enforce consistent patterns across your test suite.
 *
 * Usage:
 *   import { createRequestContext, assertJsonResponse, logResponse } from '../utils/api-helpers';
 *
 * @see https://playwright.dev/docs/api-testing
 */

/**
 * Create a new APIRequestContext with the given base URL and default headers.
 *
 * Use this when you need an API context outside of the fixture system
 * (e.g., in setup scripts or standalone utility scripts).
 *
 * @param playwright - The Playwright instance (from test fixtures)
 * @param baseURL - The base URL for all API requests
 * @param extraHeaders - Optional additional HTTP headers
 * @returns A configured APIRequestContext
 *
 * @example
 *   const apiContext = await createRequestContext(
 *     playwright,
 *     'https://api.example.com',
 *     { 'Authorization': `Bearer ${process.env.API_TOKEN ?? '<your-token>'}` }
 *   );
 *   const response = await apiContext.get('/users');
 */
export async function createRequestContext(
  playwright: { request: { newContext: (options: Record<string, unknown>) => Promise<APIRequestContext> } },
  baseURL: string,
  extraHeaders: Record<string, string> = {},
): Promise<APIRequestContext> {
  return playwright.request.newContext({
    baseURL,
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

/**
 * Assert that an API response has a JSON content type and a parseable body.
 *
 * This is a common assertion pattern used in almost every API test.
 * It checks the Content-Type header and attempts to parse the body as JSON.
 *
 * @param response - The Playwright APIResponse to validate
 * @returns The parsed JSON body
 *
 * @example
 *   const response = await apiContext.get('/api/users');
 *   const body = await assertJsonResponse(response);
 *   expect(body.users).toHaveLength(10);
 */
export async function assertJsonResponse(response: APIResponse): Promise<unknown> {
  // Verify the Content-Type header indicates JSON
  const contentType = response.headers()['content-type'] ?? '';
  expect(
    contentType,
    `Expected Content-Type to include 'application/json', got '${contentType}'`
  ).toContain('application/json');

  // Parse and return the JSON body
  // This will throw a clear error if the body is not valid JSON
  const body = await response.json();
  expect(body, 'Response body should not be null or undefined').toBeDefined();

  return body;
}

/**
 * Assert that an API response has a specific status code.
 *
 * Provides a more descriptive error message than a bare expect() call,
 * including the response URL and body text for debugging.
 *
 * @param response - The Playwright APIResponse to check
 * @param expectedStatus - The expected HTTP status code
 *
 * @example
 *   const response = await apiContext.post('/api/users', { data: newUser });
 *   await assertStatus(response, 201);
 */
export async function assertStatus(
  response: APIResponse,
  expectedStatus: number,
): Promise<void> {
  if (response.status() !== expectedStatus) {
    // Include the response body in the error for easier debugging
    let bodyText = '';
    try {
      bodyText = await response.text();
    } catch {
      bodyText = '[Could not read response body]';
    }

    expect(
      response.status(),
      `Expected status ${expectedStatus} for ${response.url()}, got ${response.status()}. Body: ${bodyText}`
    ).toBe(expectedStatus);
  }
}

/**
 * Log API response details for debugging.
 *
 * Prints the request URL, status code, headers, and body to the console.
 * Useful during test development; remove or disable in production test runs.
 *
 * NOTE: This function uses console.log which will trigger the ESLint
 * "no-console" warning. This is intentional for debugging purposes.
 *
 * @param response - The Playwright APIResponse to log
 * @param label - Optional label to identify the log entry
 *
 * @example
 *   const response = await apiContext.get('/api/health');
 *   await logResponse(response, 'Health Check');
 *   // Output:
 *   // === Health Check ===
 *   // URL:    https://api.example.com/api/health
 *   // Status: 200
 *   // Body:   {"status":"healthy"}
 */
export async function logResponse(
  response: APIResponse,
  label: string = 'API Response',
): Promise<void> {
  let bodyText = '';
  try {
    bodyText = await response.text();
  } catch {
    bodyText = '[Could not read response body]';
  }

  // eslint-disable-next-line no-console
  console.log(`
=== ${label} ===
URL:     ${response.url()}
Status:  ${response.status()} ${response.statusText()}
Headers: ${JSON.stringify(response.headers(), null, 2)}
Body:    ${bodyText}
==================`);
}

/**
 * Build a URL with query parameters.
 *
 * A convenience function for constructing API URLs with query strings.
 *
 * @param path - The API endpoint path
 * @param params - Key-value pairs for query parameters
 * @returns The path with encoded query parameters appended
 *
 * @example
 *   const url = buildUrl('/api/users', { page: '1', limit: '10', search: 'john' });
 *   // Returns: '/api/users?page=1&limit=10&search=john'
 *
 *   const response = await apiContext.get(url);
 */
export function buildUrl(
  path: string,
  params: Record<string, string>,
): string {
  const searchParams = new URLSearchParams(params);
  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}
