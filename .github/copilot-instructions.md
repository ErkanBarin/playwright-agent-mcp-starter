# GitHub Copilot Instructions

## General

Read and follow the conventions defined in `AGENTS.md` at the repository root.
That file is the single source of truth for coding standards, selector strategy,
test structure, and project layout.

## Shared AI Workspace

This repository uses a shared AI workspace at `/ai`. Use the resources there:

- `/ai/skills/` — Reusable skills (e.g., MCP server selection, prompt templates)
- `/ai/agents/` — Agent definitions for specialized tasks
- `/ai/prompts/` — Ready-to-use prompt templates
- `/ai/knowledge/` — Domain knowledge and reference material

## Generating Playwright Tests

When generating or suggesting Playwright tests:

1. **Use `@playwright/test`** — import `test` and `expect` from `@playwright/test`
2. **Follow the Page Object Model** — interact through page objects in `pages/`, not raw selectors
3. **Prefer accessibility selectors** — `getByRole`, `getByLabel`, `getByText` over CSS or XPath
4. **Save tests under `tests/e2e/`** — use descriptive filenames like `checkout-flow.spec.ts`
5. **Tag tests** — add `@smoke`, `@regression`, or `@api` annotations
6. **Use fixtures** — extend the base fixture in `tests/fixtures/base.fixture.ts`
7. **Generate test data** — use `utils/data-factory.ts`, never hard-code values
8. **No `waitForTimeout`** — rely on Playwright auto-waiting and assertion retries
9. **Keep tests deterministic** — no shared state, no order dependencies
10. **TypeScript strict mode** — proper types, no `any`

## Example Test Skeleton

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should perform expected behavior @smoke', async ({ page }) => {
    // Arrange
    await page.goto('/feature');

    // Act
    await page.getByRole('button', { name: 'Submit' }).click();

    // Assert
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

## Code Style

- Use `async/await` consistently
- Prefer `const` over `let`
- Use descriptive test names starting with "should"
- Group related tests with `test.describe`
- One assertion focus per test (multiple related assertions are fine)
