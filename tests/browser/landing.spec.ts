import { expect, test } from "@playwright/test";

test("header and footer GitHub links share their icon, styling and keyboard focus", async ({
  page,
}, info) => {
  await page.goto("/");
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Menu", exact: true }).click();
  }
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  const link = navigation.getByRole("link", { name: "GitHub", exact: true });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "https://github.com/stonega/telo");
  const icon = link.locator("svg");
  await expect(icon).toBeVisible();
  await expect(icon).toHaveAttribute("aria-hidden", "true");
  await expect(icon).toHaveAttribute("focusable", "false");
  await expect(icon).toHaveAttribute("fill", "currentColor");
  await navigation.getByRole("link", { name: "Built for your team" }).focus();
  await page.keyboard.press("Tab");
  await expect(
    navigation.getByRole("link", { name: "Docs", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(link).toBeFocused();
  expect(
    await link.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("solid");
  const footer = page.getByRole("contentinfo");
  const footerLink = footer.getByRole("link", { name: "GitHub", exact: true });
  await expect(footerLink).toBeVisible();
  await expect(footerLink).toHaveAttribute(
    "href",
    "https://github.com/stonega/telo",
  );
  await expect(
    footer.getByRole("link", { name: "Source", exact: true }),
  ).toHaveCount(0);
  await expect(footerLink.locator("svg")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(footerLink.locator("svg")).toHaveAttribute("focusable", "false");
  expect(await footerLink.innerHTML()).toBe(await link.innerHTML());
  const styles = await page.locator(".github-link").evaluateAll((elements) =>
    elements.map((element) => {
      const style = getComputedStyle(element);
      const icon = element.querySelector("svg");
      return {
        display: style.display,
        gap: style.gap,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color,
        paddingBlock: style.paddingBlock,
        iconWidth: icon?.getBoundingClientRect().width,
        iconHeight: icon?.getBoundingClientRect().height,
      };
    }),
  );
  expect(styles).toHaveLength(2);
  expect(styles[0]).toEqual(styles[1]);
  await footer.getByRole("link", { name: "Telo home" }).focus();
  await page.keyboard.press("Tab");
  await expect(footerLink).toBeFocused();
  expect(
    await footerLink.evaluate(
      (element) => getComputedStyle(element).outlineStyle,
    ),
  ).toBe("solid");
  await page.keyboard.press("Tab");
  await expect(
    footer.getByRole("link", { name: "Documentation", exact: true }),
  ).toBeFocused();
});

test("renders a responsive Telo page with working setup and capability links", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your warm AI work buddy",
  );
  await expect(page.getByRole("link", { name: "Get started" })).toHaveAttribute(
    "href",
    "/docs/user/get-started",
  );
  await expect(page.getByRole("link", { name: "Set up Telo" })).toHaveAttribute(
    "href",
    "/docs/user/get-started",
  );
  for (const name of [
    "Read the documentation",
    "Documentation",
    "Explore docs",
  ]) {
    await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      "/docs",
    );
  }
  await expect(page.locator(".capability-card")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: info.outputPath("landing.png"),
    fullPage: true,
  });
});

test("FAQ works with a keyboard", async ({ page }) => {
  await page.goto("/");
  const question = page
    .locator("summary")
    .filter({ hasText: "Does it get access to all my repositories?" });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(
      "You choose which repositories to connect through your GitHub App.",
      { exact: false },
    ),
  ).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("details[open]")).toHaveCount(0);
});

test("navigation opens on mobile and closes after selecting a section", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Close", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "How it works" })
    .click();
  await expect(
    page.getByRole("button", { name: "Menu", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#workflow$/);
});

test("reduced motion disables smooth scrolling and hides motion toggles", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await expect(page.locator(".footer-motion-toggle")).toBeHidden();
});

test("paper boats footer renders with pause/resume controls and zero errors", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();

  const stage = footer.locator(".paper-boats-stage");
  await expect(stage).toBeVisible();
  await expect(stage).toHaveAttribute("aria-hidden", "true");

  const toggle = footer.getByRole("button", { name: /boats animation/i });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");

  // Clicking on the ocean stage triggers an interactive wave ripple without errors
  const box = await stage.boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
  }

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toHaveText("Resume boats animation");

  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(toggle).toHaveText("Pause boats animation");

  expect(errors).toEqual([]);
  await footer.screenshot({ path: info.outputPath("paper-boats-footer.png") });
});

test("paper boats footer degrades gracefully without JavaScript", async ({
  browser,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: info.project.use.viewport,
  });
  const page = await context.newPage();
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.locator(".footer-boats-fallback")).toBeVisible();
  await expect(footer.locator(".footer-motion-toggle")).toBeHidden();
  await expect(footer.locator(".footer-motion-toggle")).toBeDisabled();
  await context.close();
});

test("illustrated workflow stays readable, static and inside its cards", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const cards = page.locator(".steps .step");
  await expect(cards).toHaveCount(3);
  for (const card of await cards.all()) {
    const art = card.locator(".workflow-illustration");
    await expect(art).toBeVisible();
    await expect(art).toHaveAttribute("aria-hidden", "true");
    await expect(art).toHaveAttribute("focusable", "false");
    await expect(card.getByRole("heading", { level: 3 })).toBeVisible();
    expect(
      await card.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return [...element.querySelectorAll("svg, .step-copy")].every(
          (child) => {
            const childBounds = child.getBoundingClientRect();
            return (
              childBounds.left >= bounds.left &&
              childBounds.right <= bounds.right &&
              childBounds.bottom <= bounds.bottom
            );
          },
        );
      }),
    ).toBe(true);
  }
  expect(
    await page
      .locator(".steps")
      .evaluate((element) => element.getAnimations({ subtree: true }).length),
  ).toBe(0);
  const positions = await cards.evaluateAll((elements) =>
    elements.map((element) => {
      const bounds = element.getBoundingClientRect();
      return { x: bounds.x, y: bounds.y };
    }),
  );
  if (info.project.name === "mobile") {
    expect(positions[0].x).toBe(positions[1].x);
    expect(positions[1].y).toBeGreaterThan(positions[0].y);
  } else {
    expect(positions[0].y).toBe(positions[1].y);
    expect(positions[1].x).toBeGreaterThan(positions[0].x);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator(".steps")
    .screenshot({ path: info.outputPath("workflow-stories.png") });
});

test("decorative accents never widen the viewport, including with disclosures open", async ({
  page,
}) => {
  await page.goto("/");
  for (const summary of await page.locator("summary").all()) {
    await summary.click();
  }
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => innerWidth)).toBe(width);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  }
});

test("mobile navigation dismisses with Escape and repeated section links", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/#workflow");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "How it works" })
    .focus();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeHidden();
  for (let attempt = 0; attempt < 2; attempt++) {
    await menu.click();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "How it works" })
      .click();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/#workflow$/);
  }
});
