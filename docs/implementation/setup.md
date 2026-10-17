# Setup

## Verified deployment — 2026-10-17

Production deployed through an explicit Git-backed Pages API trigger. The real
Docker Codex PR later verified automatic Git integration: head
`28f1acfef7df5074fb8fcb542e074ff6f8858f78` produced a successful `github:push`
deployment at https://51612f60.repodesk-landing.pages.dev and a passing native Pages
check. This resolves the initial automatic-preview gate. Earlier connection flags
and CLI permission failures did not establish the exact recovery cause.
The later OpenSandbox PR also passed the native Pages check, deploying head
`d5108b97a0f04a91d3cb7ce636a4352d33697e5d` to
https://36cfc077.repodesk-landing.pages.dev.

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
