import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import DocumentMarkdown from "../../src/components/document-markdown";
import {
  docsSnapshot,
  documentationGroups,
  findDocument,
  resolveDocumentUrl,
  sourceUrl,
} from "../../src/lib/docs";

const directory = new URL("../../", import.meta.url);
const index = findDocument("/docs");
if (!index) throw new Error("Missing documentation index");

describe("user documentation snapshot", () => {
  test("includes only user guides with verified hashes and unique static routes", () => {
    expect(docsSnapshot.repository).toBe("https://github.com/stonega/repodesk");
    expect(docsSnapshot.revision).toMatch(/^[a-f0-9]{40}$/);
    const files = readdirSync(new URL("docs/user/", directory), {
      recursive: true,
      encoding: "utf8",
    })
      .filter((path) => path.endsWith(".md") && path !== "landing.md")
      .map((path) => `docs/user/${path}`)
      .sort();
    expect(docsSnapshot.documents.map((doc) => doc.source).sort()).toEqual(
      files,
    );
    const routes = docsSnapshot.documents.map((doc) => doc.route);
    expect(new Set(routes).size).toBe(routes.length);
    for (const document of docsSnapshot.documents) {
      const content = readFileSync(new URL(document.source, directory));
      expect(createHash("sha256").update(content).digest("hex")).toBe(
        document.sha256,
      );
      expect(content.toString("utf8").startsWith(`# ${document.title}\n`)).toBe(
        true,
      );
      expect(document.route).toMatch(/^\/docs(?:\/[a-z0-9-]+)*$/);
      expect(findDocument(`${document.route}/`)).toEqual(document);
    }
    expect(findDocument("/docs/missing")).toBeUndefined();
    expect(findDocument("/docs/../README")).toBeUndefined();
    expect(findDocument("/docs/implementation/setup")).toBeUndefined();
    expect(findDocument("/docs/design/architecture")).toBeUndefined();
    expect(findDocument("/docs/assistant-personality")).toBeUndefined();
  });

  test("serves the user index and keeps navigation within the user guides", () => {
    const content = readFileSync(new URL(index.source, directory), "utf8");
    const links = Array.from(content.matchAll(/\]\(([^)]+\.md)(?:#[^)]*)?\)/g));
    expect(links.length).toBeGreaterThan(15);
    for (const [, href] of links) {
      const route = resolveDocumentUrl(href, index.source);
      expect(findDocument(route)).toBeDefined();
    }
    expect(resolveDocumentUrl("README.md", index.source)).toBe("/docs");
    const navigable = documentationGroups.flatMap((group) => group.documents);
    expect(navigable.every((doc) => doc.source.startsWith("docs/user/"))).toBe(
      true,
    );
    expect(navigable.map((doc) => doc.source).sort()).toEqual(
      docsSnapshot.documents.map((doc) => doc.source).sort(),
    );
  });

  test("renders all source documents with one level-one heading and preserved content", () => {
    for (const document of docsSnapshot.documents) {
      const content = readFileSync(new URL(document.source, directory), "utf8");
      const html = renderToStaticMarkup(
        <DocumentMarkdown content={content} source={document.source} />,
      );
      expect(html.match(/<h1\b/g)).toHaveLength(1);
      expect(html.length).toBeGreaterThan(100);
      expect(html).not.toContain('href="javascript:');
      expect(html).not.toMatch(/href="(?:\.\.\/|\.\/)[^"]*\.md/);
    }
  });
});

describe("documentation destinations and Markdown rendering", () => {
  const source = "docs/user/get-started.md";

  test("resolves relative docs, root links, queries, fragments and same-repository URLs", () => {
    expect(resolveDocumentUrl("./README.md", source)).toBe("/docs");
    expect(resolveDocumentUrl("./deployment.md#runtime", source)).toBe(
      "/docs/user/deployment#runtime",
    );
    expect(resolveDocumentUrl("./github.md?view=1#permissions", source)).toBe(
      "/docs/user/github?view=1#permissions",
    );
    expect(resolveDocumentUrl("/docs/user/README.md", source)).toBe("/docs");
    expect(resolveDocumentUrl("#docker", source)).toBe("#docker");
    expect(resolveDocumentUrl("", source)).toBe("");
    expect(
      resolveDocumentUrl(
        "https://github.com/stonega/repodesk/blob/main/docs/user/README.md#evidence-vocabulary",
        source,
      ),
    ).toBe("/docs#evidence-vocabulary");
    expect(resolveDocumentUrl(sourceUrl(index), source)).toBe("/docs");
  });

  test("pins non-mirrored files and images but preserves external URLs and other versions", () => {
    const root = `${docsSnapshot.repository}/blob/${docsSnapshot.revision}`;
    expect(resolveDocumentUrl("../../README.md#setup", source)).toBe(
      `${root}/README.md#setup`,
    );
    expect(
      resolveDocumentUrl(
        "../research/data/sandbox-vps-2026-10-17.json",
        source,
      ),
    ).toBe(`${root}/docs/research/data/sandbox-vps-2026-10-17.json`);
    expect(
      resolveDocumentUrl("../../web/assets/repodesk-mark.svg", source, true),
    ).toBe(
      `https://raw.githubusercontent.com/stonega/repodesk/${docsSnapshot.revision}/web/assets/repodesk-mark.svg`,
    );
    for (const href of [
      "https://example.com/docs?q=a#b",
      "mailto:hello@example.com",
      "https://github.com/stonega/repodesk/blob/another-version/docs/user/README.md",
    ]) {
      expect(resolveDocumentUrl(href, source)).toBe(href);
    }
  });

  test("keeps GFM, duplicate heading IDs, code and safe links without executing HTML", () => {
    const content = `# Example

## Permissions & scope
## Permissions & scope

[Guide](./deployment.md#runtime)
[Unsafe](javascript:alert%281%29)

| Document | Status |
| --- | --- |
| Setup | **Implemented** |

- [x] Verified
- [ ] Proposed

~~Removed~~ and https://example.com

\`\`\`sh
echo '<script>not executable</script>'
\`\`\`

<script>alert('unsafe')</script>
`;
    const html = renderToStaticMarkup(
      <DocumentMarkdown content={content} source={source} />,
    );
    expect(html).toContain('id="permissions--scope"');
    expect(html).toContain('id="permissions--scope-1"');
    expect(html).toContain('href="/docs/user/deployment#runtime"');
    expect(html).toContain("<table>");
    expect(html).toContain("<strong>Implemented</strong>");
    expect(html).toContain('type="checkbox"');
    expect(html).toContain("<del>Removed</del>");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('aria-label="Code example"');
    expect(html).toContain('aria-label="Scrollable table"');
    expect(html).toContain("&lt;script&gt;not executable&lt;/script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("alert(&#x27;unsafe&#x27;)");
  });
});
