# AGENTS.md

Instructions for AI agents working in this repository.

## Project Overview

This repository is a **Playwright test automation framework** built with TypeScript.
It provides end-to-end (E2E) and API test coverage for web applications.

## Tech Stack

- **Test framework:** [Playwright Test](https://playwright.dev/) (`@playwright/test`)
- **Language:** TypeScript (strict mode)
- **Package manager:** npm
- **CI:** GitHub Actions (`.github/workflows/playwright.yml`)

## Project Structure

```
tests/e2e/          # E2E test specs (UI and API)
pages/              # Page Object Model classes
utils/              # Shared helpers (data factory, env, timeouts)
tests/fixtures/     # Custom Playwright fixtures
ai/                 # Shared AI workspace (skills, agents, prompts, knowledge)
docs/               # Project documentation
```

## Test Conventions

### Selectors (priority order)

1. **Accessibility selectors** — `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`
2. **Test IDs** — `getByTestId` when no accessible selector is available
3. **CSS selectors** — avoid; only as a last resort for third-party widgets

Never use brittle CSS selectors like `.btn-primary`, `div > span:nth-child(2)`, or XPath.

### Test Structure

- Use `test.describe` to group related tests
- Each test should be **independent** and **deterministic**
- No shared mutable state between tests
- Use fixtures for setup/teardown, not `beforeAll` with side effects
- Tag tests with `@smoke`, `@regression`, or `@api` for filtering

### Waits and Timing

- Never use `waitForTimeout` or `sleep`
- Use Playwright auto-waiting: `waitForSelector`, `toBeVisible`, `toHaveURL`, assertions
- Use `expect` with built-in retry via `toPass()` for polling assertions
- All tests must be **CI-friendly** — no reliance on local browser state

### File Naming

- Test files: `*.spec.ts`
- Page objects: `*.page.ts`
- Fixtures: `*.fixture.ts`
- Utilities: descriptive name in `utils/`

### Environment

- Configuration via `.env` file (see `.env.example`)
- Base URL set in `playwright.config.ts` and overridable via `BASE_URL`
- Auth state cached in `.auth/` to speed up test runs

## Page Object Model

All page interactions go through page objects in `pages/`.
Page objects extend `BasePage` and expose methods, not raw selectors.

```typescript
// Good
await loginPage.login(user.email, user.password);

// Bad
await page.fill('#email', user.email);
```

## Data Management

- Use `utils/data-factory.ts` to generate test data
- Never hard-code test data in specs
- Clean up created data in test teardown when possible

## AI Workspace

The `ai/` directory is a shared workspace for AI tools (Claude Code, GitHub Copilot, etc.).

- `ai/skills/` — Reusable skill definitions
- `ai/agents/` — Agent role definitions
- `ai/prompts/` — Prompt templates
- `ai/knowledge/` — Domain knowledge and reference material
