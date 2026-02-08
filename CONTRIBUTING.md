# Contributing

Thanks for your interest in contributing!

## Quick Rules

- Keep changes small and focused.
- Follow the conventions in [docs/QA_CONTEXT.md](docs/QA_CONTEXT.md) and [docs/PR_WORKFLOW.md](docs/PR_WORKFLOW.md).
- Do not commit secrets or local config (see [docs/SECURITY_SANITIZATION.md](docs/SECURITY_SANITIZATION.md)).

## Setup

```bash
npm install
npx playwright install
```

## Development Workflow

1. Fork the repo
2. Create a branch: `git checkout -b feat/my-change`
3. Make changes
4. Run checks:
   ```bash
   npm run lint
   npm test
   ```
5. Open a PR to `main`

## PR Expectations

- Include a short description of what changed and why
- Include how you tested it (commands + results)
- Keep the PR scope tight (avoid drive-by refactors)
- Use accessible selectors (`getByRole` > `getByTestId` > `getByText`)
- No hard-coded waits (`waitForTimeout`) — use Playwright auto-waits
- Tag tests appropriately: `@ui`, `@api`, `@smoke`, `@regression`

## Reporting Bugs

Open an issue with:

- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version, Playwright version)
