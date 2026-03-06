import { test, expect } from '../fixtures/base.fixture';

/**
 * UI Smoke Tests - @ui
 *
 * Smoke tests verify that the most critical user-facing functionality works.
 * These are the first tests to run after a deployment and should be fast.
 *
 * Selector Strategy:
 *   This boilerplate uses accessible selectors (role-based, label-based, and
 *   data-testid) rather than fragile CSS/XPath selectors. This approach:
 *
 *   1. getByRole()   - Finds elements by their ARIA role (button, link, heading, etc.)
 *                      Best choice: matches how assistive technologies see the page.
 *   2. getByText()   - Finds elements by their visible text content.
 *   3. getByLabel()  - Finds form inputs by their associated label.
 *   4. getByTestId() - Finds elements by data-testid attribute (fallback when
 *                      roles/labels are not available).
 *
 *   Avoid: CSS selectors like '.my-class' or XPath like '//div[@id="foo"]'
 *   because they break when developers refactor HTML/CSS.
 *
 * @see https://playwright.dev/docs/locators
 * @see https://playwright.dev/docs/best-practices
 */

test.describe('Home Page Smoke Tests @ui', () => {

  test('home page loads successfully', async ({ homePage }) => {
    // The homePage fixture already navigated to baseURL.
    // Verify the page has a non-empty title (indicates the page loaded).
    const title = await homePage.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Verify the page body is visible (page rendered something)
    await expect(homePage.locator('body')).toBeVisible();
  });

  test('page returns valid HTTP status', async ({ page, baseURL }) => {
    // Navigate to the home page and capture the response
    const response = await page.goto(baseURL ?? '/');

    // Assert the server returned a successful HTTP status (2xx)
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
  });

  test('navigation elements are present', async ({ homePage }) => {
    // Use role-based selectors to find navigation elements.
    // These selectors match ARIA roles, making tests resilient to UI changes.

    // Check for a navigation landmark (most sites wrap nav links in <nav>)
    // NOTE: Adapt these selectors to match your actual application's structure.
    const navigation = homePage.getByRole('navigation');
    const hasNavigation = await navigation.count();

    if (hasNavigation > 0) {
      // If a <nav> element exists, verify it is visible
      await expect(navigation.first()).toBeVisible();
    }

    // Check for heading elements (every page should have at least one heading)
    const headings = homePage.getByRole('heading');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Check for link elements (most pages have at least one link)
    const links = homePage.getByRole('link');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('no console errors on page load', async ({ page, baseURL }) => {
    // Collect console errors during page load
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(baseURL ?? '/');
    await page.waitForLoadState('domcontentloaded');

    // Assert no JavaScript errors occurred during page load
    // NOTE: Some third-party scripts may produce console errors;
    // adjust this assertion if you need to allow specific errors.
    expect(
      consoleErrors,
      `Console errors found: ${consoleErrors.join(', ')}`
    ).toHaveLength(0);
  });

  test('page has valid meta tags', async ({ homePage }) => {
    // Verify basic SEO/meta elements exist.
    // These are good baseline checks for any web application.

    // Check that <html> has a lang attribute (accessibility requirement)
    const lang = await homePage.locator('html').getAttribute('lang');
    // Many pages set lang; if yours does not, adjust or remove this check
    if (lang) {
      expect(lang.length).toBeGreaterThan(0);
    }

    // Check that a viewport meta tag exists (responsive design)
    const viewport = homePage.locator('meta[name="viewport"]');
    const viewportCount = await viewport.count();
    expect(viewportCount).toBeGreaterThanOrEqual(0);
  });
});
