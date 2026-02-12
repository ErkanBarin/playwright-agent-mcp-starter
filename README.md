# Playwright Agent MCP Starter

[![Playwright Tests](https://github.com/ErkanBarin/playwright-agent-mcp-starter/actions/workflows/playwright.yml/badge.svg)](https://github.com/ErkanBarin/playwright-agent-mcp-starter/actions/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Production-ready starter for **UI + API test automation** with Playwright, TypeScript, Page Object Model, and AI-powered Claude Code agents via MCP.

---

## Who It's For

- **Jr QA Engineers** who want a clean, opinionated Playwright + TypeScript starting point
- **Sr SDETs** who want a batteries-included template with AI agent tooling and MCP integration
- **Teams** that want repeatable PR workflows — small scope, stable selectors, no flaky sleeps

---

## What's Included

- **UI testing** — Playwright Test with Page Object Model, custom fixtures, cross-browser (Chromium, Firefox, WebKit)
- **API testing** — Dedicated browser-free project for fast HTTP testing via Playwright `request` API
- **Auth setup project** — Runs once before UI tests, saves `storageState` so every test starts authenticated
- **Test data factory** — Generates unique users, addresses, products, orders with optional overrides
- **Timeout constants** — Named values (`Timeouts.SHORT`, `.LONG`, `.NAVIGATION`) instead of magic numbers
- **11 AI agents** — Claude Code agents for test design, PR hygiene, security scanning, flake triage, coverage analysis, and more
- **2 MCP servers** — `@playwright/mcp` (browser automation) + Playwright Test MCP (test runner)
- **Docs library** — QA conventions, prompt library, PR workflow, security sanitization, MCP setup

---

## 5-Minute Quickstart

```bash
# 1. Use this template (click "Use this template" on GitHub) — or clone directly
git clone https://github.com/ErkanBarin/playwright-agent-mcp-starter.git
cd playwright-agent-mcp-starter

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env → set BASE_URL to your app (defaults to http://localhost:3000)

# 4. Set up MCP (optional, for Claude Code users)
cp .mcp.json.example .mcp.json

# 5. Install browsers
npx playwright install

# 6. Run one UI test (proof it works)
npx playwright test tests/ui/smoke.spec.ts --project=chromium

# 7. Run API tests (no browser launched — fast)
npx playwright test --project=api

# 8. See the HTML report
npm run report
```

> **Note:** UI defaults to `http://localhost:3000`, API defaults to `https://httpbin.org`. All tests pass out of the box against these public URLs. Change them in `.env` to point to your application.

---

## Repository Structure

```
├── .claude/
│   ├── agents/          # 11 AI agents (test design, PR hygiene, security, etc.)
│   └── skills/          # Reusable prompt skills (MCP scout, prompt library)
├── docs/
│   ├── QA_CONTEXT.md    # Scope, selectors, waits, PR slicing
│   ├── PROMPT_LIBRARY.md
│   ├── PR_WORKFLOW.md
│   ├── SECURITY_SANITIZATION.md
│   └── MCP_SETUP.md
├── pages/               # Page Object Models (base + login example)
├── tests/
│   ├── auth.setup.ts    # Auth setup (runs before UI projects)
│   ├── fixtures/        # Custom Playwright fixtures
│   ├── ui/              # UI test specs (smoke.spec.ts)
│   └── api/             # API test specs (health.spec.ts)
├── utils/
│   ├── index.ts         # Barrel — import everything from '../utils'
│   ├── timeouts.ts      # Named timeout constants (SHORT, MEDIUM, LONG, etc.)
│   ├── data-factory.ts  # Test data generators (user, product, order, etc.)
│   ├── api-helpers.ts   # API response assertion helpers
│   └── env.ts           # Typed environment variable access
├── .mcp.json.example    # MCP server config template
├── playwright.config.ts
└── package.json
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (all browsers) |
| `npm run test:ui` | Run UI tests only |
| `npm run test:api` | Run API tests only |
| `npm run test:debug` | Run with Playwright Inspector |
| `npm run report` | Open the HTML test report |
| `npm run lint` | Lint TypeScript files |

---

## Project Architecture

The config defines 5 projects that run in a specific order:

```
setup → chromium, firefox, webkit (parallel)
                                        api (independent, no browser)
```

- **setup** — Authenticates once, saves browser state to `storageState`
- **chromium/firefox/webkit** — UI tests that load the saved auth state (no login per test)
- **api** — Runs against `tests/api/` with no browser — pure HTTP requests

### Utilities (barrel import)

All utils re-export from `utils/index.ts` — one import for everything:

```typescript
import { Timeouts, TestData, assertStatus, getBaseUrl } from '../utils';
```

### Timeouts

```typescript
await page.click(selector, { timeout: Timeouts.SHORT });   // 3s
await expect(locator).toBeVisible({ timeout: Timeouts.MEDIUM }); // 5s
await page.goto(url, { timeout: Timeouts.NAVIGATION });    // 15s
```

| Constant | Value | Use case |
|----------|-------|----------|
| `SHORT` | 3s | Quick visibility checks |
| `MEDIUM` | 5s | Assertions, element interactions |
| `LONG` | 10s | Actions (click, fill) |
| `NAVIGATION` | 15s | Page navigations |
| `TEST` | 30s | Per-test limit |
| `EXTENDED` | 60s | Complex flows, uploads |
| `GLOBAL` | 120s | Setup/teardown |

### Test Data Factory

Generate unique, realistic test data with optional overrides:

```typescript
import { TestData } from '../utils';

const user = TestData.user();                        // random user
const admin = TestData.user({ role: 'admin' });      // override role
const product = TestData.product({ price: 9.99 });   // override price
const order = TestData.order();                      // random order
const email = TestData.email('signup');               // signup.k8f3x2@example.com
```

---

## AI Agents

11 Claude Code agents are included to accelerate QA workflows. They work inside Claude Code (CLI or VS Code extension).

| Agent | Purpose |
|-------|---------|
| `qa-orchestrator` | Coordinates all specialist agents |
| `ui-test-designer` | Designs UI test cases from user stories |
| `api-coverage-planner` | Plans API test coverage from endpoints |
| `pr-hygiene` | Checks PR quality and standards |
| `security-scout` | Scans for secrets and vulnerabilities |
| `coverage-hunter` | Finds test coverage gaps |
| `flake-triage` | Diagnoses and fixes flaky tests |
| `ci-reporter` | Parses CI output into summaries |
| `docs-writer` | Generates and updates documentation |
| `mcp-explorer` | Discovers MCP server capabilities |
| `seed-data-manager` | Manages test data and fixtures |

### Copy-Paste Prompts

```
Design UI tests for the login page following POM pattern. Check existing
page objects first, then create missing ones. Tag all tests @ui @smoke.
```

```
Scan this repo for hardcoded secrets, API keys, tokens, and internal URLs.
Report findings with file paths and line numbers.
```

```
Analyze test coverage gaps. Map page objects and API endpoints to existing
tests. Show what's untested and prioritize by risk.
```

See [docs/PROMPT_LIBRARY.md](docs/PROMPT_LIBRARY.md) for the full prompt library.

---

## MCP Setup

Two MCP servers connect Claude Code to your browser and test runner:

| Server | What it does |
|--------|--------------|
| `playwright` | Navigate, click, fill, screenshot, inspect DOM |
| `playwright-test` | Run tests, get results, manage execution |

```bash
cp .mcp.json.example .mcp.json
```

See [docs/MCP_SETUP.md](docs/MCP_SETUP.md) for prerequisites, VS Code extensions, and a sanity check walkthrough.

---

## CI

This repo includes a GitHub Actions workflow that runs all Playwright tests on every push and PR to `main`.

It works out of the box — no configuration needed.

See [.github/workflows/playwright.yml](.github/workflows/playwright.yml) for the workflow definition.

---

## Documentation

- [MCP Setup](docs/MCP_SETUP.md) — MCP server configuration and sanity check
- [QA Context & Conventions](docs/QA_CONTEXT.md) — scope, selectors, waits, PR slicing
- [Prompt Library](docs/PROMPT_LIBRARY.md) — copy-paste prompts for agents
- [PR Workflow](docs/PR_WORKFLOW.md) — standard PR flow
- [Security Sanitization](docs/SECURITY_SANITIZATION.md) — pre-publish checklist

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
