# RepoDesk landing page

Public landing page and dedicated live acceptance repository for RepoDesk's Codex plugin.
This is a marketing demo, not a running RepoDesk service. Conversations and PR examples
on the page are illustrative. Product source: https://github.com/stonega/repodesk.

Production: https://repodesk-landing.pages.dev

Setup status (2026-10-17): production is deployed. Git source/branch preview settings
are configured, but automatic push triggers are awaiting repair of the existing
Cloudflare GitHub connection. Use an explicit branch build in Cloudflare meanwhile.
The live VPS Codex optimization proposal is waiting for the configured Reviewed
approval; baseline checks do not represent a completed Codex task.

## Local development

Use Bun 1.3.14 and Node 22.19+ (Node 24 recommended).

```sh
bun install --frozen-lockfile
bun run dev
```

```sh
bun run verify
bunx playwright install chromium
bun run test:browser
```

React Router v7 prerenders the page into `build/client`. Tailwind v4 provides the
CSS entry point, with page-specific design tokens and styles; no UI kit is needed.
Biome handles formatting and lint. Unit tests render the real page; Playwright checks
mobile/desktop navigation, overflow, disclosures, setup destinations, reduced motion
and the accessible Code Q&A / Fix an issue / PR review example tabs. The walkthrough
contains sample outcomes only, not live task results. See [page guidance](docs/user/landing.md)
for keyboard controls.

## Deployment and plugin testing

Cloudflare Pages connects directly to this repository: main is production, other
branches get previews. No Cloudflare credential belongs in the application, VPS
coding environment, or repository.

- [Architecture and UI acceptance](docs/design/architecture.md)
- [Setup and Cloudflare configuration](docs/implementation/setup.md)
- [Live Codex task and benchmark protocol](docs/implementation/codex-test.md)
- [Runnable task prompt](examples/optimize-landing.txt)

Agent workflow instructions are in AGENTS.md.
