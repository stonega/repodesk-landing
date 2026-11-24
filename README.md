# Telo landing page

Public landing page for **Telo** (formerly RepoDesk) and dedicated live acceptance
repository for Telo's coding plugins. This is a marketing demo, not a running Telo
service. Conversations and PR examples on the page are illustrative. Product source:
https://github.com/stonega/telo.

Production: https://repodesk-landing.pages.dev

## Local development

Use Bun 1.3.14 and Node 22.19+ (Node 24 recommended).

```sh
bun install --frozen-lockfile
bun run dev
```

```sh
bun run verify
bun scripts/verify-docs-build.tsx
bash scripts/verify-browser.sh
```

The browser script installs Chromium, prepares missing Linux libraries locally
when needed, and runs `bun run test:browser` without GitHub or model credentials.

React Router v7 prerenders the page into `build/client`. Tailwind v4 provides the
CSS entry point alongside Telo's warm sunny origami design tokens. Three.js (`three`)
powers the decorative floating origami hero layer and the interactive paper-boats-on-water
footer scene, with static SVG fallbacks, pause/resume controls, and `prefers-reduced-motion`
support. Biome handles formatting and lint. Unit tests render the real page and test
the wave/buoyancy math deterministically; Playwright checks mobile/desktop navigation,
overflow, disclosures, setup destinations, reduced motion, the paper-boats footer, the
animated workflow diagram, and the accessible Code Q&A / Fix an issue / PR review example
tabs. See [page guidance](docs/user/landing.md) for keyboard and motion controls.

## Product documentation

`/docs` renders only the user guides from **stonega/telo** inside this landing
application. The source defaults to `../telo/docs/user/`; guides are copied unchanged to
`docs/user/` and relative documentation links stay on the site. The user README is
the documentation index; other guides keep their `/docs/user/` paths without `.md`.
Design, implementation, reference, research and assistant personality documents
are excluded.

Builds and tests use the local snapshot and need no GitHub credentials or live API.
`src/content/telo/manifest.json` records the source revision, hashes and routes.
Guides with uncommitted source edits are labeled; their GitHub links show the
upstream committed version. Run `bun scripts/verify-docs-build.tsx` after building
to verify every prerendered guide.

To preview the built site, run `bun run build && bun run preview`. The local
static preview serves prerendered directory indexes at both `/docs` and `/docs/`,
including deep pages. It is development/test tooling, not a production server.

To refresh the [user guides](docs/user/README.md) from a local Telo checkout:

```sh
bun run docs:sync /path/to/telo
bun run verify
bun scripts/verify-docs-build.tsx
bun run test:browser
```

Refreshes update the manifest and remove previously synced guides that no longer
exist upstream. [Landing-page guidance](docs/user/landing.md) is maintained locally
and is not published in the product documentation navigation.

## Deployment and plugin testing

Cloudflare Pages connects directly to this repository: main is production, other
branches get previews. No Cloudflare credential belongs in the application, VPS
coding environment, or repository.

Build command: `bun run verify`. Output: `build/client`. Root: repository root.
Environment: `BUN_VERSION=1.3.14`, `NODE_VERSION=24` for production and previews.

- [Runnable task prompt](examples/optimize-landing.txt)

Agent workflow instructions are in AGENTS.md.
