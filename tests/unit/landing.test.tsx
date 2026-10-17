import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Home, { DOCS_URL, meta, REPO_URL } from "../../src/routes/home";

describe("public landing page contract", () => {
  test("offers setup and source destinations without collecting visitor data", () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain(`href="${DOCS_URL}"`);
    expect(html).toContain(`href="${REPO_URL}"`);
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<iframe");
  });
  test("distinguishes demonstration content from a real task result", () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain("ILLUSTRATIVE CONVERSATION");
    expect(html).toContain("EXAMPLE PULL REQUEST");
    expect(html).toContain("Merging is a separate action");
  });
  test("ships useful document metadata and native disclosures", () => {
    expect(meta()).toContainEqual(
      expect.objectContaining({ name: "description" }),
    );
    const html = renderToStaticMarkup(<Home />);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html.match(/<details>/g)).toHaveLength(4);
    expect(html).toContain('href="#main"');
  });
});
