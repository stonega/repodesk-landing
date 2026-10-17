# Live Codex acceptance and benchmark

## Workload

Use `examples/optimize-landing.txt` as the same user-authored request for each trial.
Baseline is tagged `baseline-v1`; record its full commit SHA before launching.
Optimization adds a useful accessible interactive walkthrough to the existing
illustrative conversation. The initial page remains a usable, complete website.

## Current acceptance status — 2026-10-17

The exact baseline passed local/CI checks and isolated VPS preflights. The requester
approved the live proposal through Reviewed; Docker completed the task and created
[PR #2](https://github.com/stonega/repodesk-landing/pull/2), with passing Verify jobs
and a native Cloudflare `github:push` preview:
https://51612f60.repodesk-landing.pages.dev. That deployed result passed desktop
(1440px) and mobile (390px) tab/keyboard/overflow checks and visual inspection.
The PR remains open; its code is not merged into production.

Both live runtimes use the docs-only main base
`c3ac21835b95432421035b369dd13727c6f263e1`; the initial source remains pinned by
`baseline-v1` at `d5fb0c64ef6c73da4b1af8805f5f077f00f5462f`.

An isolated OpenSandbox 1.1.1 repeat produced
[PR #3](https://github.com/stonega/repodesk-landing/pull/3), head
`d5108b97a0f04a91d3cb7ce636a4352d33697e5d`, with both Verify jobs and native
Cloudflare checks passing. Preview: https://36cfc077.repodesk-landing.pages.dev.
Desktop/mobile tab, keyboard, Home/End, reduced-motion and overflow checks passed
on that deployed result, and captures were inspected. It is unmerged.

That repeat used a separate supervisor under the host operator's explicit test
request, with the existing approved task scope and current application permission
checks/audits. It was not a new Telegram approval or a production backend switch.
The first OpenSandbox attempt failed independent verification: Chromium's CDN was
outside default egress, and rechecking with a prepared browser exposed ambiguous
generated test locators. A fresh attempt with preinstalled Playwright 1.64.1
Chromium/native dependencies and that diagnostic feedback passed every independent
check, including the browser suite. Its verification command explicitly exports
`PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-browsers` through the job's limited
subprocess environment. `gpt-6.1-sol` / high reasoning used two CPUs / 2048 MiB;
prepublication time was 514.546 s, with usage unreported by this legacy protocol.
This repaired live run is an acceptance result, not a model-speed comparison.

The separate credential-free six-phase fixture ran on the same VPS, preloaded
image, two CPUs / 2048 MiB, concurrency one and 25 ms polling, five trials each:

| Backend | P50 | P95 | Successful trials |
| --- | ---: | ---: | ---: |
| Docker | 8.813 s | 10.373 s | 5 |
| OpenSandbox, Docker backend | 23.783 s | 24.994 s | 5 |

There were no failures in that final fixture comparison. It excludes live model,
dependency download and remote publication costs. No pool or snapshot was used.
microsandbox could not launch on this VPS without KVM and was removed from support
at the operator's request; it has no successful VPS timing.

## Environment

- Repository: stonega/repodesk-landing, base branch main.
- Public page: https://repodesk-landing.pages.dev.
- RepoDesk service: existing VPS deployment, https://dev.stonegate.me.
- Existing Codex plugin and real model/account authentication; do not put tokens here.
- GitHub App installation must include this repository and have Contents/PR write.
- Requester must be a current workspace member with verified GitHub write access.
- Use existing Direct policy or the existing Reviewed approval flow; do not bypass it.

Send the prompt from the requester's authenticated Telegram conversation. Confirm
RepoDesk resolves the exact repository before execution. The task must run on the
VPS through the plugin, rather than a developer's local Codex CLI.

## Acceptance

1. Task record identifies repository, requester, attempt and current backend.
2. Runner prepares environment, performs a real Codex implementation, and runs checks.
3. Changes become a ready-for-review PR against main, with a Cloudflare preview.
4. Verify CI, desktop/mobile rendering, keyboard interactions and reduced motion.
5. Record task/attempt IDs, base/head SHA, PR/preview URL, phase durations, model,
   reasoning setting, reported tokens, verification results and failure/retry counts.
6. Keep the PR open for review. Merging and production rollout are separate decisions.

## Fair runtime comparison

Docker is the existing VPS baseline. OpenSandbox is an additional runtime that
requires its own isolated, validated server. microsandbox was evaluated and
removed from scope at the operator's request after the VPS lacked usable KVM.
Do not switch a deployment backend while tasks or retained checkpoints exist.
Use isolated runner deployments and unique branches for runtime trials.

Hold baseline commit, prompt, model, resources, network, dependency cache state,
concurrency and verification plan constant. Never benchmark by stacking successive
optimizations onto main. Record cold/warm separately, at least five successful trials
per runtime when comparing latency, and report failures alongside P50/P95.
Separate model time, dependency install, runtime phases, checks and GitHub publication.
Provider variance makes a single live run an acceptance check, not a speed ranking.
The credential-free RepoDesk sandbox fixture is a separate infrastructure measurement.
