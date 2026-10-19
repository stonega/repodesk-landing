# Landing page

Get started and Set up RepoDesk open the local RepoDesk user quick-start guide.
Documentation links open the user guide index. GitHub opens the product repository.
How it works jumps to the workflow. The mobile menu closes after selecting a section.
FAQ rows open with click, Enter or Space.

## Documentation

Docs in the header and Documentation in the footer open `/docs`. Get started and
Set up RepoDesk open `/docs/user/get-started`. Only guides from the product's
`docs/user/` directory are published, with its README at `/docs`. Source attribution
appears above each page; guides with uncommitted edits are labeled. GitHub source
links show the committed upstream revision.

Use the documentation sidebar on desktop. On mobile, open Browse documentation
with click, Enter or Space, then choose a page. The current page is highlighted and
announced. Skip to content moves focus past navigation; overflowing tables and code samples are
keyboard-focusable and scroll horizontally without widening the page. Section
links, direct document URLs and browser Back work without a backend. Home returns
to the landing page. The snapshot updates only when maintainers explicitly refresh
it; View source opens the recorded upstream version.

## Example walkthrough

The Telegram-style preview offers Code Q&A, Fix an issue (the default), and PR review.
Each shows a different sample request, response and outcome. All are illustrative:
the preview does not submit tasks, run checks, approve reviews or show real results.

Click or tap a scenario to switch. With a keyboard, Tab reaches the selected tab;
Left/Right arrows select the previous/next scenario and wrap at either end. Home
selects Code Q&A and End selects PR review. Tab again reaches the selected panel;
another Tab leaves the walkthrough. Screen readers receive the tab names, selected
state and associated panel; inactive content is hidden and inert.

The panels share a grid footprint sized to the longest example, avoiding layout
jumps without clipping text. The selected tab has an underline as well as a green
background. The panels do not animate or require an extra UI dependency; reduced
motion remains supported. Local deterministic tests require no model, Telegram or GitHub access.

## Animated workflow diagram

The workflow section includes an illustrative GitHub → RepoDesk → Telegram diagram.
Small dots follow the curved connections and the existing green RepoDesk mark has
a subtle halo. Repository names and chat messages are examples, not live activity.
The diagram uses local SVG and CSS only, with no animation dependency or network calls.

Use the **Pause diagram animation** toggle with click, Enter or Space to stop all
diagram motion; its pressed state indicates that motion is paused. Toggle it again
to resume from the same position. With the system’s reduced-motion preference enabled,
the diagram remains static and the unnecessary motion toggle is hidden. Content,
navigation and the example walkthrough remain available without animation or JavaScript.
