import { expect, test } from "@playwright/test";
import { docsSnapshot } from "../../src/lib/docs";

test("landing Docs and setup links open local documentation; Back returns home", async ({
  page,
}, info) => {
  await page.goto("/");
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Menu", exact: true }).click();
  }
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Docs", exact: true })
    .click();
  await expect(page).toHaveURL(/\/docs$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "RepoDesk 用户文档",
  );
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Good work starts",
  );
  await page.getByRole("link", { name: "Get started", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/user\/get-started$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Get started：快速开始",
  );
});

test("index preserves original documents, links, section IDs and source attribution", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("/docs");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("RepoDesk 用户文档 — RepoDesk Docs");
  const article = page.getByRole("article");
  await expect(article.getByRole("table").first()).toBeVisible();
  await expect(
    article.getByRole("link", { name: "Codex 开发任务" }),
  ).toHaveAttribute("href", "/docs/user/codex");
  await expect(
    page.getByRole("link", {
      name: `View source at ${docsSnapshot.revision.slice(0, 7)}`,
    }),
  ).toHaveAttribute(
    "href",
    `${docsSnapshot.repository}/blob/${docsSnapshot.revision}/docs/user/README.md`,
  );
  const guide = article
    .getByRole("link", { name: "连接和使用 GitHub", exact: true })
    .first();
  await guide.click();
  await expect(page).toHaveURL(/\/docs\/user\/github$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "连接和使用 GitHub",
  );
  await page.goto("/docs#使用范围");
  await expect(page.locator("#使用范围")).toBeInViewport();
  expect(errors).toEqual([]);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: info.outputPath("docs-index.png"),
    fullPage: true,
  });
});

test("deep pages prerender useful content without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  for (const [path, title] of [
    ["/docs", "RepoDesk 用户文档"],
    ["/docs/user/get-started", "Get started：快速开始"],
    ["/docs/user/codex", "Codex 开发任务"],
    ["/docs/user/troubleshooting", "常见问题与排障"],
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.getByRole("article")).not.toBeEmpty();
  }
  await page
    .getByRole("link", { name: "All documentation", exact: true })
    .click();
  await expect(page).toHaveURL(/\/docs$/);
  await context.close();
});

test("documentation navigation and skip link work with keyboard focus", async ({
  page,
}, info) => {
  await page.goto("/docs/user/get-started");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  if (info.project.name === "mobile") {
    const disclosure = page.locator(".docs-mobile-navigation");
    const summary = disclosure.locator("summary");
    await expect(disclosure).not.toHaveAttribute("open");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(disclosure).toHaveAttribute("open", "");
    const current = disclosure.locator('[aria-current="page"]');
    await expect(current).toHaveText("Get started：快速开始");
    await summary.focus();
    await page.keyboard.press("Tab");
    await expect(
      disclosure.getByRole("link", {
        name: "RepoDesk 用户文档",
        exact: true,
      }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/docs$/);
    await page.locator(".docs-mobile-navigation summary").focus();
    await page.keyboard.press("Space");
    await expect(page.locator(".docs-mobile-navigation")).toHaveAttribute(
      "open",
      "",
    );
    await page.keyboard.press("Space");
    await expect(page.locator(".docs-mobile-navigation")).not.toHaveAttribute(
      "open",
    );
  } else {
    const navigation = page.locator(".docs-sidebar");
    await expect(navigation.locator('[aria-current="page"]')).toHaveText(
      "Get started：快速开始",
    );
    await navigation
      .getByRole("link", { name: "RepoDesk 用户文档", exact: true })
      .focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/docs$/);
  }
});

test("all document routes load without page overflow, including long tables and code", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const entry of docsSnapshot.documents) {
    const response = await page.goto(entry.route);
    expect(response?.status(), entry.route).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      entry.title,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      entry.route,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("wide content is keyboard-scrollable and reduced motion remains supported", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/user/maintenance");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  const code = page.locator('.docs-code-scroll[tabindex="0"]').first();
  await expect(code).toBeVisible();
  await code.focus();
  await expect(code).toBeFocused();
  await expect(code).toHaveCSS("overflow-x", "auto");
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => code.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
  await page.goto("/docs");
  const table = page.getByRole("region", { name: "Scrollable table" }).first();
  if (info.project.name === "mobile") {
    await expect(table).toHaveAttribute("tabindex", "0");
    await table.focus();
    await expect(table).toBeFocused();
    expect(
      await table.evaluate(
        (element) => element.scrollWidth > element.clientWidth,
      ),
    ).toBe(true);
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() => table.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(0);
  } else {
    await expect(table).not.toHaveAttribute("tabindex");
  }
});
