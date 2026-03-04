---
name: playwright-cli
description: Use Playwright MCP to browse websites, snapshot elements, interact with pages, and convert sessions into Playwright tests
tools: [Read, Glob, Bash]
---

# Playwright CLI Skill

Use the Playwright MCP server to interactively browse websites and convert interactions into Playwright tests.

## Capabilities

### 1. Open a Website

Navigate to any URL and get a structured view of the page.

```
Navigate to https://example.com and describe the page structure.
```

The MCP `playwright` server provides browser automation. Use it to:
- Load any URL in a real browser
- Wait for the page to be fully loaded
- Capture the initial state for further interaction

### 2. Snapshot Page Elements

Take an accessibility snapshot to discover all interactive elements on the page.

```
Take an accessibility snapshot of the current page and list all interactive elements.
```

The snapshot returns a structured tree of:
- Roles (button, link, textbox, heading, etc.)
- Accessible names and labels
- States (checked, disabled, expanded, etc.)

Use this to determine the best selectors for test automation.

### 3. Interact with Buttons and Forms

Perform user actions through the MCP server.

```
Fill the email field with "test@example.com" and click the Login button.
```

Supported interactions:
- **Click** — buttons, links, checkboxes, radio buttons
- **Fill** — text inputs, textareas, search fields
- **Select** — dropdown menus and select elements
- **Check/Uncheck** — checkboxes and toggle switches
- **Hover** — trigger tooltips and dropdown menus
- **Keyboard** — press Enter, Tab, Escape, type text

### 4. Convert Interactions into Playwright Tests

After exploring a page and performing interactions, generate a Playwright test.

```
Convert the login flow I just performed into a Playwright test following repo conventions.
```

When generating tests:
1. Use selectors discovered from the accessibility snapshot
2. Prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors
3. Follow the Page Object Model — create or update a page object in `pages/`
4. Save the test spec in `tests/e2e/`
5. Add appropriate tags (`@smoke`, `@regression`)
6. Use `utils/data-factory.ts` for test data

## Workflow Example

```
Step 1: "Navigate to /login"
Step 2: "Snapshot the page — what form fields are present?"
Step 3: "Fill email with test@example.com, fill password with secret123, click Sign In"
Step 4: "What page did we land on? Snapshot it."
Step 5: "Generate a Playwright test for this login flow"
```

## Server Selection

| Action | MCP Server |
|--------|------------|
| Browse, click, fill, snapshot | `playwright` |
| Run generated tests | `playwright-test` |

See the `mcp-scout` skill for the full decision tree.
