import { afterAll, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { serveBuild } from "../../scripts/preview";

const directory = mkdtempSync(join(tmpdir(), "repodesk-preview-"));
mkdirSync(join(directory, "docs", "user", "get-started"), {
  recursive: true,
});
writeFileSync(join(directory, "index.html"), "<h1>Landing</h1>");
writeFileSync(join(directory, "docs", "index.html"), "<h1>Documentation</h1>");
writeFileSync(
  join(directory, "docs", "user", "get-started", "index.html"),
  "<h1>Setup</h1>",
);
writeFileSync(join(directory, "styles.css"), "body { margin: 0; }");

afterAll(() => rmSync(directory, { recursive: true, force: true }));

describe("static prerender preview", () => {
  test("serves directory indexes with and without trailing slashes, not the SPA home fallback", async () => {
    for (const [path, text] of [
      ["/", "Landing"],
      ["/docs", "Documentation"],
      ["/docs/", "Documentation"],
      ["/docs/user/get-started", "Setup"],
      ["/docs/user/get-started/", "Setup"],
    ]) {
      const response = serveBuild(
        new Request(`http://localhost${path}`),
        directory,
      );
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toContain("text/html");
      expect(await response.text()).toBe(`<h1>${text}</h1>`);
    }
  });

  test("serves typed static assets and HEAD without a body", async () => {
    const response = serveBuild(
      new Request("http://localhost/styles.css"),
      directory,
    );
    expect(response.headers.get("Content-Type")).toContain("text/css");
    expect(await response.text()).toBe("body { margin: 0; }");
    const head = serveBuild(
      new Request("http://localhost/docs", { method: "HEAD" }),
      directory,
    );
    expect(head.status).toBe(200);
    expect(await head.text()).toBe("");
  });

  test("rejects missing files, traversal, malformed encoding and writes", () => {
    for (const [path, status] of [
      ["/missing", 404],
      ["/%2e%2e%2foutside.txt", 403],
      ["/docs/%", 400],
    ] as const) {
      expect(
        serveBuild(new Request(`http://localhost${path}`), directory).status,
      ).toBe(status);
    }
    const response = serveBuild(
      new Request("http://localhost/docs", { method: "POST" }),
      directory,
    );
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET, HEAD");
  });
});
