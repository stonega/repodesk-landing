import { expect, test } from "@playwright/test";

test("renders a responsive page and working setup links", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Get started" })).toHaveAttribute(
    "href",
    "https://github.com/stonega/repodesk/blob/main/docs/implementation/setup.md",
  );
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
