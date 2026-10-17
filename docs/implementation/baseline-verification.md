# Baseline verification — 2026-10-17

Baseline tag: `baseline-v1`, commit `d5fb0c64ef6c73da4b1af8805f5f077f00f5462f`.

The initial page passed Biome, strict TypeScript, three Bun unit tests and production
prerender build. Seven Chromium checks passed at 1440px and 390px; the desktop-only
skip is the mobile navigation scenario. Desktop/mobile full-page captures were
inspected against the design acceptance criteria.

GitHub Verify passed: https://github.com/stonega/repodesk-landing/actions/runs/39007839841.
Cloudflare production deployment: https://d1ca980a.repodesk-landing.pages.dev.
Public canonical URL: https://repodesk-landing.pages.dev (HTTP 200, prerendered content).

The existing VPS Codex job image (Node 24.21.0, Bun 1.3.14) also completed a fresh
clone, frozen install, checks, typecheck, unit tests and production build with
2 CPUs / 2 GiB, a read-only root, dropped capabilities and its own disposable work
volume. It received no model, GitHub or Cloudflare credential.

A live plugin optimization proposal was delivered through the existing Reviewed
approval workflow. Environment verification alone does not establish a completed
Codex task or PR; those outcomes must be recorded after actual execution.

This branch adds only the evidence record to the baseline source. It is used to
verify automatic Cloudflare branch deployment without modifying the optimization
baseline tag or production page.
