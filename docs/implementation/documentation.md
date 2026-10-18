# Product documentation mirror

The repository being changed is **stonega/repodesk-landing**. Content comes from
**stonega/repodesk**, starting at `docs/README.md`. Do not confuse the product's
architecture/setup pages with this landing application's guidance in `docs/`.

## Content and provenance

`src/content/repodesk/` holds unmodified Markdown from the pinned product commit:
all Markdown under upstream `docs/`, plus `src/agent/SOUL.md` linked by the index.
`manifest.json` records the repository, full commit, titles, local routes and SHA-256
digests. `/docs` is the original index; other pages keep their upstream folder and
filename without `.md`. The personality page is `/docs/assistant-personality`.

Each page displays its pinned source link and explains that the snapshot includes
research and proposals, not just released features. Content is not rewritten or
promoted into marketing claims. Source links outside the mirror (code, JSON data,
root README and other assets) retain a pinned upstream destination. External URLs
are preserved. Local documentation links preserve query strings and section hashes.

`react-markdown` renders Markdown without executing raw HTML, `remark-gfm` preserves
GitHub tables, task lists and autolinks, and `rehype-slug` preserves GitHub-style
heading anchors. These are explicit rendering dependencies; no live fetch,
documentation service, backend, or extra application is involved.

## Refresh

Prerequisites: Bun 1.3.14, Git and public GitHub network access. No credential is
needed. Choose and review the public upstream commit before updating:

```sh
bun install --frozen-lockfile
bun run docs:sync FULL_40_CHARACTER_UPSTREAM_COMMIT_SHA
bun run verify
bun scripts/verify-docs-build.tsx
bunx playwright install chromium
bun run test:browser
```

`bun run docs:sync` without an argument reproduces the currently pinned snapshot.
The script fetches only that commit into a temporary directory, copies the original
bytes, regenerates the manifest and removes its temporary checkout. It never changes
the landing repository's remotes, branches, CI, deployment settings, or accounts.
Review the content diff and check upstream relative links before publication.

## Build and acceptance

`src/routes.ts` enumerates the snapshot as static React Router routes, so existing
`prerender: true` builds HTML and route data for every document without changing
deployment configuration. A server-only content module keeps the complete Markdown
collection out of the browser JavaScript bundle. Each page includes only its own
Markdown in prerendered route data. Ordinary anchor links work without JavaScript
and load the corresponding static page directly.

`bun run preview` uses `scripts/preview.ts` to serve these built directory indexes
with or without a trailing slash. Vite's SPA preview otherwise falls back to the
landing HTML for slashless document URLs. The local static server is shared by
manual preview and Playwright, covers missing files and path traversal in unit
tests, and does not alter Cloudflare Pages or production deployment configuration.

Unit tests check every snapshot hash, index coverage, routes, navigation, link
rewrites, section IDs, safe Markdown rendering and preserved GFM syntax. Browser
tests check direct deep links, landing navigation, back navigation, source links,
the mobile keyboard disclosure, skip-link focus, horizontal overflow, scrollable
tables/code, reduced motion and desktop/mobile layouts. Build tests additionally
inspect every emitted HTML document for its title, heading and body content.

Refresh is explicit, not automatic: the site does not promise to track upstream
`main` in real time. Verification after installation works offline and needs no
model or GitHub credentials. Publication remains an application/operator action.

On minimal Debian Linux runners without root, use `bash scripts/verify-browser.sh`
after `bun install --frozen-lockfile`. It installs Chromium and, only if libraries
are missing, uses the system's signed APT repositories to download and extract
browser libraries under ignored `node_modules/.cache/`. It does not install system
packages or need sudo, credentials or temporary state from another runner phase.
It then runs the unchanged full browser suite. On other operating systems, install
Playwright's system prerequisites through the normal operator-managed setup.
