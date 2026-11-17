import { expect, test } from "@playwright/test";

const examples = [
  {
    label: "Code Q&A",
    id: "questions",
    request:
      "Where does this app decide which repositories a workspace can use?",
    resultLabel: "EXAMPLE ANSWER",
    title: "Follow the repository access checks",
    artifact: "Sample access trace",
  },
  {
    label: "Fix an issue",
    id: "fix",
    request:
      "The signup page feels cramped on mobile. Can you improve the spacing?",
    resultLabel: "EXAMPLE PULL REQUEST",
    title: "Improve the mobile signup layout",
    artifact: "Sample diff · src/signup.css",
  },
  {
    label: "PR review",
    id: "review",
    request:
      "Review the proposed mobile signup changes. Are there any layout risks?",
    resultLabel: "EXAMPLE REVIEW",
    title: "Check the form at narrow widths",
    artifact: "Sample review checklist",
  },
];

test("switches distinct examples without overflow or layout jumps", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const tabs = page.getByRole("tablist", { name: "Example scenarios" });
  await expect(tabs.getByRole("tab")).toHaveCount(3);
  await expect(
    tabs.getByRole("tab", { name: "Fix an issue", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("tabpanel", { name: "Fix an issue", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("EXAMPLE REPOSITORY", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("example/site", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Preview only · no messages are sent", { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".chat-window input, .chat-window textarea, .chat-window a"),
  ).toHaveCount(0);
  await expect(
    page.getByText(
      "Sample requests and outcomes — not live execution results.",
      {
        exact: true,
      },
    ),
  ).toBeVisible();
  const baseline = await page.locator(".hero").boundingBox();
  const chatBaseline = await page.locator(".chat-window").boundingBox();
  expect(baseline).not.toBeNull();
  expect(chatBaseline).not.toBeNull();

  for (const example of examples) {
    const tab = tabs.getByRole("tab", { name: example.label, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(tab).toHaveCSS("text-decoration-line", "underline");
    await expect(page.getByRole("tab", { selected: true })).toHaveCount(1);
    await expect(page.getByRole("tabpanel")).toHaveCount(1);
    const panel = page.getByRole("tabpanel", {
      name: example.label,
      exact: true,
    });
    await expect(panel).toHaveAttribute("id", `scenario-panel-${example.id}`);
    await expect(tab).toHaveAttribute(
      "aria-controls",
      `scenario-panel-${example.id}`,
    );
    await expect(panel).toHaveAttribute(
      "aria-labelledby",
      `scenario-tab-${example.id}`,
    );
    await expect(panel.locator(".outgoing")).toContainText(example.request);
    await expect(
      panel.getByText(example.resultLabel, { exact: true }),
    ).toBeVisible();
    await expect(panel.getByText(example.title, { exact: true })).toBeVisible();
    await expect(panel.locator("figcaption")).toHaveText(example.artifact);
    const artifact = panel.locator(".example-artifact");
    expect(
      await artifact.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    if (example.id === "fix") {
      await expect(artifact.locator(".diff-remove")).toContainText(
        "- padding: 8px;",
      );
      await expect(artifact.locator(".diff-add")).toContainText(
        "+ padding: 24px 16px;",
      );
    } else {
      await expect(artifact.getByRole("listitem")).toHaveCount(
        example.id === "questions" ? 3 : 2,
      );
    }
    for (const other of examples.filter((item) => item.id !== example.id)) {
      const inactive = page.locator(`#scenario-panel-${other.id}`);
      await expect(inactive).toBeHidden();
      await expect(inactive).toHaveAttribute("aria-hidden", "true");
      await expect(inactive).toHaveAttribute("inert", "");
      await expect(inactive).toHaveAttribute("tabindex", "-1");
    }
    const hero = await page.locator(".hero").boundingBox();
    const chat = await page.locator(".chat-window").boundingBox();
    expect(hero?.height).toBeCloseTo(baseline?.height ?? 0, 1);
    expect(chat?.height).toBeCloseTo(chatBaseline?.height ?? 0, 1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath(`scenario-${example.id}.png`),
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test("keeps the preview readable with enlarged text and tablet layouts", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".conversation-scene").evaluate((scene) => {
    const sizes = [scene, ...scene.querySelectorAll<HTMLElement>("*")].map(
      (element) => ({
        element,
        fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
      }),
    );
    for (const { element, fontSize } of sizes) {
      (element as HTMLElement).style.fontSize = `${fontSize * 1.5}px`;
    }
  });
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const example of examples) {
      await page.getByRole("tab", { name: example.label, exact: true }).click();
      const artifact = page.getByRole("tabpanel").locator(".example-artifact");
      await expect(artifact.locator("figcaption")).toBeVisible();
      expect(
        await artifact.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});

test.describe("prerendered preview", () => {
  test.use({ javaScriptEnabled: false });

  test("shows the default sample and its boundaries without JavaScript", async ({
    page,
  }) => {
    await page.goto("/");
    const panel = page.getByRole("tabpanel", {
      name: "Fix an issue",
      exact: true,
    });
    await expect(panel).toBeVisible();
    await expect(panel.locator("figcaption")).toHaveText(
      "Sample diff · src/signup.css",
    );
    await expect(page.getByRole("tabpanel")).toHaveCount(1);
    await expect(
      page.getByText("Preview only · no messages are sent", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Get started", exact: true }),
    ).toHaveAttribute("href", "/docs/user/get-started");
  });
});

test("supports roving focus, wrapping arrows, Home, End and panel keyboard access", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "See how it works" }).focus();
  await page.keyboard.press("Tab");
  const fix = page.getByRole("tab", { name: "Fix an issue", exact: true });
  await expect(fix).toBeFocused();
  await expect(fix).toHaveCSS("outline-style", "solid");
  for (const [key, label] of [
    ["ArrowLeft", "Code Q&A"],
    ["ArrowLeft", "PR review"],
    ["ArrowRight", "Code Q&A"],
    ["End", "PR review"],
    ["Home", "Code Q&A"],
    ["ArrowRight", "Fix an issue"],
    ["Enter", "Fix an issue"],
    ["Space", "Fix an issue"],
  ]) {
    await page.keyboard.press(key);
    const active = page.getByRole("tab", { name: label, exact: true });
    await expect(active).toBeFocused();
    await expect(active).toHaveAttribute("aria-selected", "true");
    await expect(active).toHaveAttribute("tabindex", "0");
    await expect(
      page.getByRole("tabpanel", { name: label, exact: true }),
    ).toBeVisible();
    for (const tab of await page.getByRole("tab", { selected: false }).all()) {
      await expect(tab).toHaveAttribute("tabindex", "-1");
    }
  }
  await page.keyboard.press("Tab");
  await expect(page.getByRole("tabpanel")).toBeFocused();
  await expect(page.getByRole("tabpanel")).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Tab");
  expect(
    await page
      .locator(".conversation-scene")
      .evaluate((scene) => scene.contains(document.activeElement)),
  ).toBe(false);
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("tabpanel")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(fix).toBeFocused();
});

test("works at 320px and with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const example of examples) {
    const tab = page.getByRole("tab", { name: example.label, exact: true });
    await tab.click();
    await expect(page.getByRole("tabpanel")).toHaveAccessibleName(
      example.label,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect((await tab.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  const motion = await page.locator(".conversation-scene").evaluate((scene) =>
    [scene, ...scene.querySelectorAll("*")].every((element) => {
      const style = getComputedStyle(element);
      return (
        style.transitionDuration === "0s" && style.animationName === "none"
      );
    }),
  );
  expect(motion).toBe(true);
});
