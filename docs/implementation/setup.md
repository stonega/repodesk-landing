# Setup

## Current deployment gate — 2026-10-17

Production has deployed successfully from Git through an explicit Pages API trigger.
Automatic branch pushes have not triggered builds yet. Git source and preview
settings are configured, but the existing Cloudflare GitHub connection needs operator
inspection/reconnection. Its repository-selection API update returned 403.
Until automatic triggers are verified, explicitly deploy the desired branch through
the Cloudflare dashboard. Do not assume a push or merge updates the public page.


Run the commands in README.md. Keep bun.lock committed and use frozen installs.
`bun run verify` is the credential-free verification command for Codex runners.
Browser acceptance is separate because it requires the Playwright Chromium binary.

## Cloudflare Pages

Repository: stonega/repodesk-landing. Production branch: main.
Build command: `bun run verify`. Output: `build/client`. Root: repository root.
Environment: `BUN_VERSION=1.3.14`, `NODE_VERSION=24` for production and previews.
Use the existing Cloudflare GitHub integration so every PR branch has a preview
without exposing Cloudflare tokens to GitHub Actions or the Codex task.

The GitHub Verify workflow also runs Chromium browser acceptance. No deployment
credential is present in it. Merging an accepted PR triggers production deployment.
A separate operator decision is required to merge a Codex result.

If native Git integration cannot read this new repository, add only this repository
to the existing Cloudflare GitHub App installation, then create the Pages project.
Avoid creating a Direct Upload project if branch previews are required: project
source integration cannot be changed freely after creation.
