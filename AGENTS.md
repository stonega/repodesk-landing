# AGENTS.md

## Product and scope

This is RepoDesk's public landing page and a dedicated Codex plugin acceptance repository.
Read README.md and docs/user/landing.md first.
Keep illustrative conversations labeled. Do not invent customers, testimonials,
usage statistics, security guarantees or integrations that RepoDesk does not have.

## Structure and workflow

Keep one standalone React Router v7 application. Source lives in src/, tests in tests/,
automation in scripts/, and user guidance in docs/user/.
Use Bun 1.3.14 for dependencies and scripts, TypeScript strict mode and Biome.
Dependencies must be explicit and justified. Prefer small readable components.
Preserve the minimal green RepoDesk vector mark. The admin panel's modal rules do
not apply to this marketing page. Use accessible HTML and responsive layouts.

Before completing changes run:

```sh
bun install --frozen-lockfile
bun run check
bun run typecheck
bun test
bun run build
```

Browser acceptance (when Chromium is available):

```sh
bunx playwright install chromium
bun run test:browser
```

Check desktop (1440px) and mobile (390px), navigation, keyboard focus, disclosures,
reduced motion and horizontal overflow. Add deterministic tests for new behavior.
Update docs and runnable examples when the workflow changes.

## Deployment and permissions

Cloudflare Pages builds main for production and other branches for previews.
Codex optimization tasks may change source and propose a PR; merging and changing
Cloudflare/GitHub account configuration require separate operator authorization.
Never store credentials, private conversations or customer data in this repository.
Do not modify the CI workflow, deployment configuration or this authorization scope
as part of a landing-page optimization task unless the operator explicitly asks.
Use git; use gh only when git is insufficient.

Adapted from stonega/harness _AGENTS.md, fetched 2026-10-17.
