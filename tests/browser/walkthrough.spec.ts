import { expect, test } from "@playwright/test";

const examples = [
  {
    id: "code-qa",
    name: "Code Q&A",
    request:
      "Where is signup validation handled, and how does the form show errors?",
    response: "the signup route calls a shared validation helper",
    result: "Trace the signup flow",
    label: "EXAMPLE ANSWER",
  },
  {
    id: "fix-issue",
    name: "Fix an issue",
    request:
      "The signup page feels cramped on mobile. Can you improve the spacing?",
    response: "add a layout regression test",
    result: "Improve the mobile signup layout",
    label: "EXAMPLE PULL REQUEST",
  },
  {
    id: "pr-review",
    name: "PR review",
    request:
      "Review the signup PR for missing error handling. Don’t change any files.",
    response: "a failed signup request leaves the submit button disabled",
    result: "Handle failed signup requests",
    label: "EXAMPLE REVIEW",
  },
];

test("scenario selection exposes only its labeled example request and result", async ({
  page,
}, info) => {
  await page.goto("/");
  const tablist = page.getByRole("tablist", { name: "Example scenarios" });
  await expect(tablist.getByRole("tab")).toHaveCount(3);
  await expect(page.getByRole("tab", { name: "Code Q&A" })).toHaveAttribute(
    "aria-selected",
    "true",
  );

  for (const example of examples) {
    const tab = tablist.getByRole("tab", { name: example.name, exact: true });
    if (info.project.name === "mobile") {
      await tab.tap();
    } else {
      await tab.click();
    }
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(tab).toHaveAttribute("aria-controls", `panel-${example.id}`);
    await expect(tab).toHaveAttribute("tabindex", "0");
    await expect(page.getByRole("tab", { selected: true })).toHaveCount(1);
    const panel = page.getByRole("tabpanel", {
      name: example.name,
      exact: true,
    });
    await expect(page.getByRole("tabpanel")).toHaveCount(1);
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("aria-labelledby", `tab-${example.id}`);
    await expect(panel).toHaveAccessibleDescription(
      "Examples only — not live tasks or real execution results.",
    );
    await expect(panel.locator(".message.outgoing")).toContainText(
      example.request,
    );
    await expect(panel.locator(".message.incoming")).toContainText(
      example.response,
    );
    await expect(
      panel.getByRole("heading", { name: example.result, level: 2 }),
    ).toBeVisible();
    await expect(panel.getByText(example.label, { exact: true })).toBeVisible();
    await expect(page.getByText("ILLUSTRATIVE CONVERSATION")).toBeVisible();
    for (const inactive of examples.filter(
      (other) => other.id !== example.id,
    )) {
      await expect(page.locator(`#panel-${inactive.id}`)).toBeHidden();
      await expect(page.locator(`#panel-${inactive.id}`)).toHaveAttribute(
        "inert",
        "",
      );
      await expect(page.locator(`#tab-${inactive.id}`)).toHaveAttribute(
        "tabindex",
        "-1",
      );
    }
    const inactiveTab = tablist.locator('[aria-selected="false"]').first();
    expect(
      await tab.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    ).not.toBe(
      await inactiveTab.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    );
    expect((await tab.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    await page.screenshot({
      path: info.outputPath(`${example.id}.png`),
      fullPage: true,
    });
  }
});

test("keyboard selection wraps, supports Home/End, and skips inactive panels", async ({
  page,
}) => {
  await page.goto("/");
  const qa = page.getByRole("tab", { name: "Code Q&A" });
  const fix = page.getByRole("tab", { name: "Fix an issue" });
  const review = page.getByRole("tab", { name: "PR review" });
  await page.getByRole("link", { name: "See how it works" }).focus();
  await page.keyboard.press("Tab");
  await expect(qa).toBeFocused();

  for (const [key, target] of [
    ["ArrowLeft", review],
    ["ArrowRight", qa],
    ["ArrowRight", fix],
    ["End", review],
    ["Home", qa],
    ["Enter", qa],
    ["Space", qa],
  ] as const) {
    await page.keyboard.press(key);
    await expect(target).toBeFocused();
    await expect(target).toHaveAttribute("aria-selected", "true");
    await expect(target).toHaveCSS("outline-style", "solid");
    await expect(target).toHaveCSS("outline-width", "3px");
  }
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("tabpanel", { name: "Fix an issue" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Read the documentation" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("tabpanel", { name: "Fix an issue" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(fix).toBeFocused();
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`switching keeps the layout stable without overflow (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/");
    const scene = page.locator(".conversation-scene");
    const height = await scene.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    const workflow = page.locator("#workflow");
    const workflowTop = await workflow.evaluate(
      (element) => element.getBoundingClientRect().top + scrollY,
    );
    for (const example of examples) {
      await page.getByRole("tab", { name: example.name, exact: true }).click();
      await expect(
        page.getByRole("tabpanel", { name: example.name, exact: true }),
      ).toBeVisible();
      expect(
        await scene.evaluate(
          (element) => element.getBoundingClientRect().height,
        ),
      ).toBeCloseTo(height, 1);
      expect(
        await workflow.evaluate(
          (element) => element.getBoundingClientRect().top + scrollY,
        ),
      ).toBeCloseTo(workflowTop, 1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.getByRole("tabpanel")).toHaveCSS(
        "animation-name",
        "none",
      );
      await expect(page.getByRole("tabpanel")).toHaveCSS(
        "transition-duration",
        "0s",
      );
    }
    if (reducedMotion === "reduce") {
      await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
    }
  });
}

test("all scenarios also fit a 320px narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  for (const example of examples) {
    await page.getByRole("tab", { name: example.name, exact: true }).click();
    await expect(
      page.getByRole("tabpanel", { name: example.name, exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
