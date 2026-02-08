# MCP (Model Context Protocol) Setup Guide

This guide explains how to configure and use MCP servers with Claude Code for browser automation and test execution in this project.

---

## What is MCP?

**Model Context Protocol (MCP)** allows Claude Code to interact with external tools and servers. Instead of only reading and writing files, Claude Code can use MCP to control a browser, run tests, and interact with other services directly.

This project uses two MCP servers:

| Server | Package | Purpose |
|---|---|---|
| **playwright** | `@playwright/mcp` | Browser automation -- navigate pages, click elements, fill forms, take screenshots, inspect the DOM |
| **playwright-test** | `@playwright/test --mcp` | Test runner -- execute Playwright tests, get results, manage test execution |

---

## Prerequisites

| Requirement | Notes |
|---|---|
| **Node.js** >= 18 | Required for Playwright and MCP servers |
| **Claude Code** | CLI or VS Code extension (`anthropic.claude-code`) |
| **Playwright VS Code extension** (optional) | `ms-playwright.playwright` — run/debug tests from the sidebar |

```bash
# Install VS Code extensions (optional, for VS Code / Cursor users)
code --install-extension anthropic.claude-code
code --install-extension ms-playwright.playwright
```

> **Note:** Claude Code also works from the terminal without VS Code. The extensions are recommended but not required.

---

### When to Use Each Server

| Task | Server |
|---|---|
| Navigate to a URL and inspect the page | `playwright` |
| Click buttons, fill forms, interact with UI | `playwright` |
| Take a screenshot of the current page | `playwright` |
| Debug a failing test by replaying steps in a real browser | `playwright` |
| Run test suites and get pass/fail results | `playwright-test` |
| Run specific test files or tagged tests | `playwright-test` |
| Get test output and error details | `playwright-test` |

---

## Setup Steps

### 1. Copy the Example Config

The repository includes a safe example configuration. Copy it to create your local config:

```bash
cp .mcp.json.example .mcp.json
```

> **Important:** The `.mcp.json` file **must** live in the repository root (the same directory as `package.json`). Claude Code looks for it in the current working directory when it starts. If it is in a subdirectory, MCP servers will not be detected.

### 2. Understand the Configuration

Open `.mcp.json` to see the server definitions:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {}
    },
    "playwright-test": {
      "command": "npx",
      "args": ["@playwright/test@latest", "--mcp"],
      "env": {}
    }
  }
}
```

**Configuration breakdown:**

| Field | Description |
|---|---|
| `mcpServers` | Top-level object containing all server definitions |
| `playwright` | Server name -- used to identify this server in Claude Code |
| `command` | The executable to run (`npx` runs npm packages without global install) |
| `args` | Arguments passed to the command (the package name and flags) |
| `env` | Environment variables passed to the server process (empty by default) |

### 3. Install Dependencies

Make sure Playwright and its browsers are installed:

```bash
# Install project dependencies (includes Playwright)
npm install

# Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install --with-deps
```

### 4. Sanity Check — Verify MCP Is Working

**Step 1 — Confirm `.mcp.json` exists at the repo root:**

```bash
ls -la .mcp.json
# Expected: -rw-r--r-- ... .mcp.json
```

**Step 2 — Start Claude Code in the project directory:**

```bash
cd /path/to/your-repo
claude
```

**Step 3 — Ask Claude Code to list MCP tools:**

```
Show me available Playwright MCP tools.
```

You should see tools from both servers, including:

- `browser_navigate` — Navigate to a URL
- `browser_click` — Click an element
- `browser_snapshot` — Take an accessibility snapshot
- `browser_screenshot` — Capture a screenshot
- `run_tests` — Execute Playwright tests
- `list_tests` — List available tests

If you see these tools listed, MCP is working correctly.

**Step 4 — Run a quick test via MCP:**

```
Use MCP to run tests/ui/smoke.spec.ts and show me the results.
```

This should execute the smoke tests and display pass/fail results.

---

## Using MCP with Claude Code

### Browser Automation (playwright server)

The `playwright` MCP server gives Claude Code direct control over a browser. Use it for:

**Navigating and inspecting pages:**
```
Use MCP to navigate to https://example.com and describe what you see on the page.
```

**Interacting with elements:**
```
Use MCP to navigate to the login page, fill in the email field with
"testuser@example.com" and the password field with "testpassword",
then click the Sign In button.
```

**Taking screenshots for debugging:**
```
Use MCP to navigate to [URL] and take a screenshot. I want to see the
current state of the page.
```

**Exploring the DOM to find selectors:**
```
Use MCP to navigate to [URL] and inspect the form elements. Help me
identify the best selectors (role-based or testid) for each field.
```

### Test Execution (playwright-test server)

The `playwright-test` MCP server lets Claude Code run your Playwright tests and analyze results. Use it for:

**Running all tests:**
```
Use MCP to run all tests and show me the results.
```

**Running tagged tests:**
```
Use MCP to run all @smoke tests and show me the results.
If any fail, show the error details.
```

**Running a specific test file:**
```
Use MCP to run tests/ui/login.spec.ts and show me the results.
```

**Debugging a failure:**
```
Use MCP to run tests/api/users.spec.ts. If any test fails, show me
the full error output and help me diagnose the issue.
```

---

## Adding Environment Variables

If your MCP servers need environment variables (for example, a base URL), add them to the `env` object:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {
        "BASE_URL": "https://example.com"
      }
    },
    "playwright-test": {
      "command": "npx",
      "args": ["@playwright/test@latest", "--mcp"],
      "env": {
        "BASE_URL": "https://example.com",
        "API_URL": "https://api.example.com/v1"
      }
    }
  }
}
```

---

## Security Notes

### .mcp.json is Gitignored

The `.mcp.json` file is listed in `.gitignore` and should **never be committed** to version control. It may contain:

- API keys or tokens in the `env` section
- Internal URLs specific to your environment
- Local paths or configurations

### Only .mcp.json.example is Committed

The `.mcp.json.example` file is safe to commit. It contains:

- Default server configurations with no secrets
- Empty `env` objects (no real values)
- Comments or placeholders where needed

### Best Practices

| Do | Do Not |
|---|---|
| Use `.mcp.json.example` as a template | Commit `.mcp.json` with real values |
| Put secrets in `env` fields (kept local) | Hardcode secrets in `args` |
| Verify `.mcp.json` is in `.gitignore` | Share your `.mcp.json` with others directly |
| Use placeholder URLs in the example file | Put internal URLs in `.mcp.json.example` |

---

## Troubleshooting

### "MCP server not found" or "Failed to start MCP server"

1. Verify `.mcp.json` exists in the project root (not just `.mcp.json.example`).
2. Run `npm install` to ensure dependencies are installed.
3. Verify the MCP packages are accessible:
   ```bash
   npx @playwright/mcp@latest --help
   npx @playwright/test@latest --help
   ```

### "Browser not installed"

Install Playwright browsers:
```bash
npx playwright install --with-deps
```

### MCP tools are not appearing in Claude Code

1. Restart Claude Code (close and reopen in the project directory).
2. Verify the `.mcp.json` file is valid JSON (no trailing commas, proper quoting).
3. Check that the server names in `.mcp.json` match what you expect.

### Slow MCP server startup

The first run may be slow because `npx` downloads the packages. Subsequent runs use the cached packages and start faster.

---

## Further Reading

- [Playwright MCP Documentation](https://github.com/anthropics/anthropic-cookbook/tree/main/misc/model_context_protocol)
- [Playwright Test Documentation](https://playwright.dev/docs/intro)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
