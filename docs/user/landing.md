# Landing page

Get started and Set up Telo open the local Telo user quick-start guide.
Documentation links open the user guide index. GitHub opens the product repository
(`stonega/telo`). How it works jumps to the workflow; Capabilities jumps to the
feature grid; Built for your team jumps to the principles section. The mobile menu
closes after selecting a section, including when selecting the current section
again. Escape dismisses an open mobile menu and returns keyboard focus to its
toggle. FAQ rows open with click, Enter or Space.

## Visual storytelling & Three.js motion

The page follows **Telo's** warm sunny origami identity: linen canvas (`#faf7f2`),
crisp white cards, terracotta and golden-amber accents, and the sunny origami paper
boat mark (`/telo-mark.svg`). Three local SVG illustrations explain connecting a
repository, giving a task context and reviewing a pull request. The illustrations
are decorative, static and hidden from assistive technology; the adjacent headings
explain every step without them. Cards form a row on desktop and a single column
on mobile.

Two decorative Three.js WebGL scenes add gentle depth and movement:

- **Hero origami ambience**: translucent 3D folded origami boats and warm sun motes
  float softly behind the hero with subtle pointer parallax.
- **Footer paper boats on water**: a golden-hour ocean scene featuring 22 folded 3D
  origami paper boats bobbing and gliding across animated waves. Clicking or tapping
  the water sends out a gentle ripple. Use the **Pause boats animation** toggle with
  click, Enter or Space to pause or resume the fleet; its `aria-pressed` state reflects
  the paused state.

Both Three.js canvases are hidden from assistive technology (`aria-hidden="true"`),
pause when scrolled out of view, render a single calm static frame under
`prefers-reduced-motion: reduce` (hiding the unnecessary motion toggle), and fall
back to a crisp static SVG paper-boat horizon without JavaScript or WebGL.

The conversation remains an interactive **example**, not a live application. No
fake status indicators, message submission or invented product claims are included.

## Documentation

Docs in the header, Explore docs in the closing banner and Documentation in the
footer open `/docs`. Get started and Set up Telo open `/docs/user/get-started`.
Only guides from the product's `docs/user/` directory are published, with its
README at `/docs`. Source attribution appears above each page; guides with
uncommitted edits are labeled. GitHub source links show the committed upstream
revision.

Use the documentation sidebar on desktop. On mobile, open Browse documentation
with click, Enter or Space, then choose a page. The current page is highlighted and
announced. Skip to content moves focus past navigation; overflowing tables and code
samples are keyboard-focusable and scroll horizontally without widening the page.
Section links, direct document URLs and browser Back work without a backend. Home
returns to the landing page. The snapshot updates only when maintainers explicitly
refresh it; View source opens the recorded upstream version.

## Example walkthrough

The Telegram-style preview offers Code Q&A, Fix an issue (the default), and PR review.
Each shows a different sample request, response and outcome. All are illustrative:
the preview does not submit tasks, run checks, approve reviews or show real results.
The header names an explicitly fictional `example/site` repository. The three
outcome cards contain a sample access trace, a sample CSS diff and a sample review
checklist respectively. These are illustrative artifacts, not files or findings
retrieved from a connected repository. The preview-only footer is informational,
not a message input or send action.

Click or tap a scenario to switch. With a keyboard, Tab reaches the selected tab;
Left/Right arrows select the previous/next scenario and wrap at either end. Home
selects Code Q&A and End selects PR review. Tab again reaches the selected panel;
another Tab leaves the walkthrough. Screen readers receive the tab names, selected
state and associated panel; inactive content is hidden and inert.

The panels share a grid footprint sized to the longest example, avoiding layout
jumps without clipping text. The selected tab has an underline as well as a terracotta
background. Local deterministic tests require no model, Telegram or GitHub access.
Without JavaScript, the default Fix an issue example and its sample diff remain
readable; scenario switching requires JavaScript.

Scenario copy and sample artifacts live in `src/content/walkthrough.ts`. The tab
controller and panel rendering are separate components; shared header/footer
navigation lives in `src/components/site-chrome.tsx`. Keep future examples labeled
and avoid adding fake live statuses or nonfunctional app controls.

## Animated workflow diagram

The workflow section includes an illustrative GitHub → Telo → Telegram diagram.
Small golden dots follow the curved connections and the sunny origami Telo mark has
a subtle halo. Repository names and chat messages are examples, not live activity.
The diagram uses local SVG and CSS only, with no network calls.

Use the **Pause diagram animation** toggle with click, Enter or Space to stop all
diagram motion; its pressed state indicates that motion is paused. Toggle it again
to resume from the same position. With the system's reduced-motion preference enabled,
the diagram remains static and the unnecessary motion toggle is hidden. Content,
navigation and the example walkthrough remain available without animation or JavaScript.
