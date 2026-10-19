# Scripts

Current workflows are package.json commands. Add repeatable automation here when needed.

`bun run docs:sync [CHECKOUT_PATH]` refreshes only `docs/user/` from the local
RepoDesk checkout, defaulting to `../repodesk`. It copies the original bytes into
this repository's `docs/user/`, removes stale synced guides and regenerates the
route/hash manifest. Uncommitted source edits are recorded for accurate attribution.
The local landing guide is preserved. See the [README](../README.md#product-documentation)
for refresh and verification commands.

After `bun run build`, `bun scripts/verify-docs-build.tsx` verifies that all
documentation pages contain the full rendered original body and pinned source.

`bash scripts/verify-browser.sh` prepares Chromium and runs browser acceptance.
On minimal Debian Linux it extracts missing system libraries locally without root.
Install project dependencies with the frozen lockfile first.

`bun run preview` runs `preview.ts`, a local static build preview that resolves
prerendered directory indexes at slashless and trailing-slash URLs. It accepts
`--port` and `--host`, and is not a production runtime.
