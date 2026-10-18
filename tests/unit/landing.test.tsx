import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Home, { DOCS_URL, meta, REPO_URL } from "../../src/routes/home";

describe("public landing page contract", () => {
  test("shares matching GitHub links and decorative brand icons across header and footer", () => {
    const html = renderToStaticMarkup(<Home />);
    const links = Array.from(
      html.matchAll(/<a\b[^>]*class="github-link"[^>]*>(.*?)<\/a>/g),
    );
    expect(links).toHaveLength(2);
    expect(links[0]?.[0]).toBe(links[1]?.[0]);
    const link = links[0]?.[0];
    expect(link).toContain(`href="${REPO_URL}"`);
    expect(link).toContain("GitHub ");
    const footer = html.split("<footer")[1];
    expect(footer).toContain(link ?? "missing GitHub link");
    expect(footer).not.toContain("Source");
    expect(link).toContain('fill="currentColor"');
    expect(link).toContain('aria-hidden="true"');
    expect(link).toContain('focusable="false"');
    expect(link).toContain("M12 .297C5.37.297");
    expect(link).not.toContain('stroke="currentColor"');
  });
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
