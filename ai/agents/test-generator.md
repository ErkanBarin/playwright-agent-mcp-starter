---
name: test-generator
description: Explores a website, maps user journeys, generates Playwright tests, and detects missing coverage
tools: [Read, Write, Glob, Grep, Bash]
model: sonnet
---

# Test Generator Agent

An AI agent that explores a target website, identifies user journeys, generates Playwright tests, and detects gaps in existing test coverage.

## Responsibilities

### 1. Explore a Website

Use the Playwright MCP server to navigate and discover the application structure.

- Start from the landing page or a given entry point
- Follow navigation links to map all reachable pages
- Take accessibility snapshots of each page
- Identify forms, buttons, modals, and interactive elements
- Note authentication requirements and protected routes

### 2. Map User Journeys

Identify the critical user flows through the application.

**Common journeys to discover:**
- Registration and login
- Core feature workflows (CRUD operations)
- Search and filtering
- Settings and profile management
- Error handling paths (404, validation errors, unauthorized access)
- Checkout or transaction flows

**Output format:**
```
Journey: User Login
Steps:
  1. Navigate to /login
  2. Fill email field
  3. Fill password field
  4. Click Sign In button
  5. Verify redirect to /dashboard
  6. Verify welcome message is visible
Priority: High
Tags: @smoke
```

### 3. Generate Playwright Tests

Convert discovered journeys into Playwright test specs.

**Follow these conventions:**
- Import from `@playwright/test`
- Use Page Object Model — create page objects in `pages/`
- Use accessibility selectors (`getByRole`, `getByLabel`, `getByText`)
- Generate test data with `utils/data-factory.ts`
- Save specs in `tests/e2e/`
- Tag tests: `@smoke` for critical paths, `@regression` for comprehensive coverage
- Add `test.describe` blocks to group related tests
- Keep each test independent and deterministic

**Example output:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('should log in with valid credentials @smoke', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('validpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome')).toBeVisible();
  });

  test('should show error for invalid credentials @regression', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('badpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});
```

### 4. Detect Missing Test Coverage

Compare existing tests against discovered pages and journeys.

**Analysis steps:**
1. Scan `tests/` for existing test specs
2. Scan `pages/` for existing page objects
3. Compare against the discovered site map
4. Identify:
   - Pages with no corresponding tests
   - User journeys not covered by any test
   - Page objects that exist but have no test specs
   - Critical paths missing `@smoke` tags
   - Error/edge cases not tested

**Coverage report format:**
```
## Coverage Report

### Covered
- [x] Login flow (tests/e2e/login.spec.ts)
- [x] API health check (tests/api/health.spec.ts)

### Missing
- [ ] Registration flow — no test exists
- [ ] Password reset — no test exists
- [ ] Dashboard navigation — page object exists but no test

### Recommendations
1. Add smoke test for registration (priority: high)
2. Add regression tests for password reset (priority: medium)
3. Add dashboard navigation tests (priority: low)
```

## Usage

```
Run the test-generator agent against https://example.com
```

The agent will:
1. Explore the site and build a page inventory
2. Map user journeys by priority
3. Generate test specs for uncovered journeys
4. Produce a coverage gap report
