# RepoDesk landing page

Public landing page and dedicated live acceptance repository for RepoDesk's Codex plugin.
This is a marketing demo, not a running RepoDesk service. Conversations and PR examples
on the page are illustrative. Product source: https://github.com/stonega/repodesk.

Production: https://repodesk-landing.pages.dev

Acceptance status (2026-10-17): production is deployed. The real VPS Docker Codex
task completed after requester approval and produced [PR #2](https://github.com/stonega/repodesk-landing/pull/2).
Verify and native Cloudflare Pages checks passed; its automatic preview is
https://51612f60.repodesk-landing.pages.dev. The PR remains open for review.
An isolated OpenSandbox repeat also passed and produced
[PR #3](https://github.com/stonega/repodesk-landing/pull/3), with passing CI and
preview https://36cfc077.repodesk-landing.pages.dev.
The fixed `baseline-v1` is unchanged. See the test protocol for separate sandbox
results and their limits.

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

## Product documentation

`/docs` renders the original product documentation from **stonega/repodesk** inside
this landing application. Every Markdown document under its `docs/` directory,
plus the assistant personality linked from the index, is checked in unchanged at a
pinned commit. Relative documentation links stay on the site; source files and
other repository links open that same upstream revision. Design proposals and
research remain labeled as such; mirroring them is not a new product claim.

Builds and tests use the local snapshot and need no GitHub credentials or live API.
See [documentation maintenance](docs/implementation/documentation.md) to refresh
the snapshot and verify its 43 prerendered pages.

To preview the built site, run `bun run build && bun run preview`. The local
static preview serves prerendered directory indexes at both `/docs` and `/docs/`,
including deep pages. It is development/test tooling, not a production server.

## Deployment and plugin testing

Cloudflare Pages connects directly to this repository: main is production, other
branches get previews. No Cloudflare credential belongs in the application, VPS
coding environment, or repository.

- [Architecture and UI acceptance](docs/design/architecture.md)
- [Setup and Cloudflare configuration](docs/implementation/setup.md)
- [Live Codex task and benchmark protocol](docs/implementation/codex-test.md)
- [Runnable task prompt](examples/optimize-landing.txt)

Agent workflow instructions are in AGENTS.md.
