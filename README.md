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
mobile/desktop navigation, overflow, disclosures, setup destinations and reduced motion.

## Deployment and plugin testing

Cloudflare Pages connects directly to this repository: main is production, other
branches get previews. No Cloudflare credential belongs in the application, VPS
coding environment, or repository.

- [Architecture and UI acceptance](docs/design/architecture.md)
- [Setup and Cloudflare configuration](docs/implementation/setup.md)
- [Live Codex task and benchmark protocol](docs/implementation/codex-test.md)
- [Runnable task prompt](examples/optimize-landing.txt)

Agent workflow instructions are in AGENTS.md.
