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
  await expect(link).toHaveAttribute(
    "href",
    "https://github.com/stonega/repodesk",
  );
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
    "https://github.com/stonega/repodesk",
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
  await footer.getByRole("link", { name: "RepoDesk home" }).focus();
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

test("renders a responsive page and working setup links", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Get started" })).toHaveAttribute(
    "href",
    "/docs/user/get-started",
  );
  await expect(
    page.getByRole("link", { name: "Set up RepoDesk" }),
  ).toHaveAttribute("href", "/docs/user/get-started");
  for (const name of ["Read the documentation", "Documentation"]) {
    await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      "/docs",
    );
  }
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
test("reduced motion disables smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
