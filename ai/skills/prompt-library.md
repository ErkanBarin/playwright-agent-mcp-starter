---
name: prompt-library
description: Collection of short copy-paste prompts for common QA automation tasks
tools: [Read, Glob]
---

# Prompt Library

Short, copy-paste-ready prompts for common QA tasks. Replace `[bracketed]` placeholders with your specifics.

## UI Test Design

```
Write a smoke test for the [page name] page using the POM pattern in pages/.
```

```
Generate a page object for [page URL] following selector priority: role > testid > css.
```

```
Review selectors in [file path] and flag any CSS or XPath that should use getByRole or getByTestId.
```

## API Test Design

```
Write API tests for [endpoint] covering: 200 success, 400 bad request, 401 unauthorized, 404 not found.
```

```
Generate test skeletons for all endpoints in [OpenAPI spec or endpoint list].
```

## Coverage Analysis

```
Find untested user flows by comparing page objects in pages/ to test specs in tests/ui/.
```

```
Map API endpoints and identify missing test coverage in tests/api/.
```

## Flake Triage

```
Triage flaky test "[test name]" — check traces in test-results/, identify root cause, suggest fix.
```

```
Find all tests using waitForTimeout or sleep and suggest proper Playwright wait alternatives.
```

## PR Hygiene

```
Run pr-hygiene checks: no .only, no console.log, proper tags, no hardcoded URLs, good selectors.
```

```
Scan the codebase for hardcoded secrets, API keys, or tokens.
```

## MCP

```
Which MCP server should I use to [describe your task]?
```

```
Use MCP to navigate to [URL] and help me find the best selectors for the [form/page/component].
```

## Documentation

```
Update docs to match the current project structure and test inventory.
```

```
Generate a test plan for [feature name] with prioritized test cases.
```
