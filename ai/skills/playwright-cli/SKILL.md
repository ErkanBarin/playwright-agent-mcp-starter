---
name: playwright-cli
description: Use Playwright CLI to browse websites, snapshot elements, interact with pages, and convert sessions into Playwright tests
tools: [Read, Glob, Bash]
---

# Playwright CLI Skill

Use `@playwright/cli` to interactively browse websites and convert interactions into Playwright tests.

## Installation

```bash
npm install -g @playwright/cli@latest
```

## Commands

### 1. Open a Website

```bash
playwright open https://example.com
```

Opens a Chromium browser with the Playwright inspector attached.

### 2. Snapshot Page Elements

```bash
playwright screenshot https://example.com screenshot.png
```

Or use the inspector (opened via `playwright open`) to explore the accessibility tree and discover selectors interactively.

### 3. Code Generation (Record Mode)

```bash
playwright codegen https://example.com
```

Opens a browser and records your interactions as Playwright test code in real time. This is the fastest way to scaffold a test:

- Click, fill, select — all recorded as `getByRole` / `getByLabel` selectors
- Assertions auto-generated for navigation and visibility
- Output is valid TypeScript that can be pasted into a spec file

### 4. Convert Recorded Code into Repo-Compliant Tests

After recording with `codegen`, adapt the output to match repo conventions:

1. Replace raw `page.locator()` calls with accessibility selectors (`getByRole`, `getByLabel`, `getByText`)
2. Wrap interactions in a Page Object in `pages/`
3. Save the spec in `tests/e2e/`
4. Add tags (`@smoke`, `@regression`)
5. Use `utils/data-factory.ts` for test data instead of hard-coded values

## Workflow Example

```bash
# 1. Record a login flow
playwright codegen https://myapp.com/login

# 2. Copy the generated code

# 3. Refactor into POM + spec following repo conventions

# 4. Run the test
npx playwright test tests/e2e/login.spec.ts --project=chromium
```

## Other Useful Commands

| Command | Purpose |
|---------|---------|
| `playwright open <url>` | Open URL with inspector |
| `playwright codegen <url>` | Record interactions as code |
| `playwright screenshot <url> <file>` | Capture a screenshot |
| `playwright pdf <url> <file>` | Save page as PDF |
| `playwright install` | Install browsers |
| `playwright test --ui` | Open Playwright Test UI mode |
