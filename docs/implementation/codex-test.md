# Live Codex acceptance and benchmark

## Workload

Use `examples/optimize-landing.txt` as the same user-authored request for each trial.
Baseline is tagged `baseline-v1`; record its full commit SHA before launching.
Optimization adds a useful accessible interactive walkthrough to the existing
illustrative conversation. The initial page remains a usable, complete website.

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

Docker is the existing VPS baseline. microsandbox and OpenSandbox are additional
runtimes implemented in RepoDesk's source; they require their own validated VPS
installation before they can be reported as tested. Do not switch a deployment
backend while tasks or retained checkpoints exist. Use isolated runner deployments
and unique branches for runtime trials. Check VPS KVM/nested virtualization before
planning microsandbox runs.

Hold baseline commit, prompt, model, resources, network, dependency cache state,
concurrency and verification plan constant. Never benchmark by stacking successive
optimizations onto main. Record cold/warm separately, at least five successful trials
per runtime when comparing latency, and report failures alongside P50/P95.
Separate model time, dependency install, runtime phases, checks and GitHub publication.
Provider variance makes a single live run an acceptance check, not a speed ranking.
The credential-free RepoDesk sandbox fixture is a separate infrastructure measurement.
