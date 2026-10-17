# Architecture

One static deployable surface: React Router v7 Framework Mode, React 19, TypeScript
strict mode, Tailwind CSS v4, Bun and Biome. `ssr: false` with prerendering emits
crawlable HTML without a runtime server. Cloudflare Pages serves `build/client`.
There is no backend, visitor database, analytics tracker, or account flow.

The baseline is a complete landing page: responsive navigation, product introduction,
a labeled illustrative Telegram conversation, three workflow steps, permission and
review boundaries, native FAQ disclosures, and setup/source links. Keep product
claims aligned with RepoDesk's implementation evidence; do not invent adoption data.

## Visual acceptance

The existing RepoDesk logo preference applies to this product surface: use its
minimal vector geometry and restrained green palette, without modifying the mark.
The admin/setup TelegramUI preference and modal editor rules have narrower scopes;
this landing page uses its own quiet editorial layout. Its existing mark is copied
from stonega/repodesk/web/assets/repodesk-mark.svg.

- At 1440px: balanced two-column hero, readable conversation preview, aligned sections.
- At 390px and 320px: one-column content, no horizontal overflow, working menu.
- Setup/source CTAs have real destinations. Example chat and PR are visibly labeled.
- Native FAQ works with keyboard; links have visible focus, skip link reaches main.
- Reduced motion removes smooth scrolling. No remote fonts or oversized raster images.

## Test boundaries

Unit and browser checks are deterministic and call no model, Telegram or GitHub APIs.
CI and Pages previews validate a proposed change; neither represents a successful
Codex plugin task. A plugin pass additionally requires a VPS task and confirmed PR.
