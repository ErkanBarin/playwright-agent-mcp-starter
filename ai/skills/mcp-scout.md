---
name: mcp-scout
description: Auto-selects the correct MCP server for a given task based on context
tools: [Read, Glob]
---

# MCP Scout

Auto-select which MCP server to use for a given QA task.

## Decision Tree

```
What do you need to do?
│
├── Interact with a real browser?
│   ├── Navigate to a URL → playwright server
│   ├── Click, fill, select elements → playwright server
│   ├── Take screenshots → playwright server
│   ├── Inspect DOM / accessibility tree → playwright server
│   └── Record a user flow → playwright server
│
├── Run or manage Playwright tests?
│   ├── Execute test files → playwright-test server
│   ├── List available tests → playwright-test server
│   ├── Get test results → playwright-test server
│   └── Generate test code → playwright-test server
│
└── Need both?
    └── Use playwright for browser interaction,
        then playwright-test to run the tests.
        Example: Discover selectors with browser,
        then generate and run a test.
```

## Quick Reference

| Task | Server | Example Prompt |
|------|--------|----------------|
| Explore a page | `playwright` | "Navigate to /login and show me the form elements" |
| Find selectors | `playwright` | "Get the accessibility snapshot of the dashboard page" |
| Run smoke tests | `playwright-test` | "Run all @smoke tests and show results" |
| Debug a failure | Both | "Navigate to the page, then run the failing test" |

## Usage

When unsure which MCP server to use, describe your task and this skill will recommend the right server based on the decision tree above.

## Application Context

This skill works with any web application. Configure your target app via:
- `BASE_URL` in `.env` for the application under test
- `API_BASE_URL` in `.env` for API endpoints
- Server settings in `.mcp.json` for MCP-specific configuration
