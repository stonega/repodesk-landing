# Scripts

Current workflows are package.json commands. Add repeatable automation here when needed.

`bun run docs:sync [FULL_UPSTREAM_COMMIT_SHA]` refreshes the unmodified product
documentation snapshot from public stonega/repodesk using Git without credentials.
Without a SHA it reproduces the pinned version. See
[documentation maintenance](../docs/implementation/documentation.md).

After `bun run build`, `bun scripts/verify-docs-build.tsx` verifies that all
documentation pages contain the full rendered original body and pinned source.

`bash scripts/verify-browser.sh` prepares Chromium and runs browser acceptance.
On minimal Debian Linux it extracts missing system libraries locally without root.
Install project dependencies with the frozen lockfile first.

`bun run preview` runs `preview.ts`, a local static build preview that resolves
prerendered directory indexes at slashless and trailing-slash URLs. It accepts
`--port` and `--host`, and is not a production runtime.
