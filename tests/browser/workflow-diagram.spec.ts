import { expect, test } from "@playwright/test";

test("workflow dots follow curves and all motion can pause and resume", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const diagram = page.locator(".workflow-diagram");
  const toggle = diagram.getByRole("button", {
    name: "Pause diagram animation",
  });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(diagram.locator(".flow-dot")).toHaveCount(3);
  await expect(diagram).toContainText("not live activity");
  expect(
    await diagram.evaluate((element) =>
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.playState),
    ),
  ).toEqual(["running", "running", "running", "running"]);

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(
    await diagram.evaluate((element) =>
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.playState),
    ),
  ).toEqual(["paused", "paused", "paused", "paused"]);

  const samples = await diagram.locator(".flow-dot").evaluateAll((dots) =>
    dots.map((dot) => {
      const animation = dot.getAnimations()[0];
      animation.currentTime = 0;
      const start = getComputedStyle(dot).strokeDashoffset;
      animation.currentTime = 1000;
      return { start, end: getComputedStyle(dot).strokeDashoffset };
    }),
  );
  for (const sample of samples) {
    expect(sample.end).not.toBe(sample.start);
  }

  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(
    await toggle.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("solid");
  expect(
    await diagram.evaluate((element) =>
      element
        .getAnimations({ subtree: true })
        .every((animation) => animation.playState === "running"),
    ),
  ).toBe(true);
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  for (const card of await diagram
    .locator(".diagram-repository, .diagram-telegram")
    .all()) {
    expect(
      await card.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
  }
  await diagram.screenshot({ path: info.outputPath("workflow-diagram.png") });
  const chatBounds = await diagram.locator(".diagram-telegram").boundingBox();
  const noteBounds = await diagram.locator(".diagram-note").boundingBox();
  expect(chatBounds).not.toBeNull();
  expect(noteBounds).not.toBeNull();
  if (chatBounds && noteBounds) {
    expect(chatBounds.y + chatBounds.height).toBeLessThan(noteBounds.y);
  }
});

test("reduced motion keeps the diagram static, including preference changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const diagram = page.locator(".workflow-diagram");
  await expect(diagram).toHaveClass(/is-animated/);
  await expect(diagram.getByRole("button")).toBeHidden();
  expect(
    await diagram.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await expect(diagram.getByText("What changed today?")).toBeVisible();

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(diagram.getByRole("button")).toBeVisible();
  expect(
    await diagram.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(4);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await diagram.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
});

test("diagram content remains static and readable without JavaScript", async ({
  browser,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: info.project.use.viewport,
  });
  const page = await context.newPage();
  await page.goto("/");
  const diagram = page.locator(".workflow-diagram");
  await expect(diagram.getByText("web-app", { exact: true })).toBeVisible();
  await expect(diagram.getByText("Here’s the latest.")).toBeVisible();
  await expect(diagram.locator("button")).toBeHidden();
  await expect(diagram.locator("button")).toBeDisabled();
  expect(
    await diagram.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await context.close();
});
