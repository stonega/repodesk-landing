import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import ScenarioWalkthrough from "../../src/components/ScenarioWalkthrough";

describe("illustrative scenario walkthrough", () => {
  test("prerenders linked tabs and panels with read-only Q&A selected", () => {
    const html = renderToStaticMarkup(<ScenarioWalkthrough />);
    expect(html).toContain('role="tablist" aria-label="Example scenarios"');
    expect(html.match(/role="tab"/g)).toHaveLength(3);
    expect(html.match(/role="tabpanel"/g)).toHaveLength(3);
    expect(html.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(html.match(/aria-hidden="true" inert=""/g)).toHaveLength(2);

    for (const id of ["code-qa", "fix-issue", "pr-review"]) {
      const tab = html.match(
        new RegExp(`<button[^>]*id="tab-${id}"[^>]*>`),
      )?.[0];
      const panel = html.match(
        new RegExp(`<div[^>]*id="panel-${id}"[^>]*>`),
      )?.[0];
      expect(tab).toContain(`aria-controls="panel-${id}"`);
      expect(tab).toContain(`aria-selected="${id === "code-qa"}"`);
      expect(tab).toContain(`tabindex="${id === "code-qa" ? 0 : -1}"`);
      expect(panel).toContain(`aria-labelledby="tab-${id}"`);
      expect(panel).toContain('aria-describedby="walkthrough-note"');
      expect(panel).toContain(`aria-hidden="${id !== "code-qa"}"`);
      expect(panel).toContain(`tabindex="${id === "code-qa" ? 0 : -1}"`);
    }
  });

  test("labels all requests and results as examples, without a live task claim", () => {
    const html = renderToStaticMarkup(<ScenarioWalkthrough />);
    expect(html).toContain("ILLUSTRATIVE CONVERSATION");
    expect(html).toContain(
      "Examples only — not live tasks or real execution results.",
    );
    expect(html.match(/Example request/g)).toHaveLength(3);
    expect(html.match(/RepoDesk · example response/g)).toHaveLength(3);
    for (const label of [
      "EXAMPLE ANSWER",
      "EXAMPLE PULL REQUEST",
      "EXAMPLE REVIEW",
    ]) {
      expect(html).toContain(label);
    }
    expect(html).toContain("Read-only explanation. No code changes.");
    expect(html).toContain("Review before merging.");
    expect(html).toContain("No edits or merge.");
    expect(html).not.toContain("Repository checks passed");
    expect(html).not.toContain("<a");
    expect(html).not.toContain("<form");
  });
});
