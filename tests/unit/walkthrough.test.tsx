import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Walkthrough, { scenarios } from "../../src/components/walkthrough";

describe("illustrative scenario walkthrough", () => {
  test("prerenders three distinct requests and outcomes without live claims", () => {
    const html = renderToStaticMarkup(<Walkthrough />);
    expect(scenarios.map((scenario) => scenario.label)).toEqual([
      "Code Q&A",
      "Fix an issue",
      "PR review",
    ]);
    expect(new Set(scenarios.map((scenario) => scenario.request)).size).toBe(3);
    expect(
      new Set(scenarios.map((scenario) => scenario.resultTitle)).size,
    ).toBe(3);
    for (const scenario of scenarios) {
      expect(html).toContain(renderToStaticMarkup(scenario.request));
      expect(html).toContain(scenario.resultLabel);
      expect(html).toContain(scenario.resultTitle);
      expect(scenario.reply).toStartWith("In this example,");
    }
    expect(html).toContain("ILLUSTRATIVE CONVERSATION");
    expect(html).toContain("not live execution results.");
    expect(html).not.toContain("Repository checks passed");
    expect(html).not.toContain("<a ");
    expect(html).not.toContain("<form");
  });

  test("links each tab and panel and keeps only the default fix in the tab order", () => {
    const html = renderToStaticMarkup(<Walkthrough />);
    expect(html).toContain('role="tablist" aria-label="Example scenarios"');
    expect(html.match(/role="tab"/g)).toHaveLength(3);
    expect(html.match(/role="tabpanel"/g)).toHaveLength(3);
    for (const scenario of scenarios) {
      const active = scenario.id === "fix";
      const tab = html.match(
        new RegExp(`<button[^>]*id="scenario-tab-${scenario.id}"[^>]*>`),
      )?.[0];
      const panel = html.match(
        new RegExp(`<div[^>]*id="scenario-panel-${scenario.id}"[^>]*>`),
      )?.[0];
      expect(tab).toContain(`aria-controls="scenario-panel-${scenario.id}"`);
      expect(tab).toContain(`aria-selected="${active}"`);
      expect(tab).toContain(`tabindex="${active ? 0 : -1}"`);
      expect(panel).toContain(`aria-labelledby="scenario-tab-${scenario.id}"`);
      expect(panel).toContain(`aria-hidden="${!active}"`);
      expect(panel).toContain(`tabindex="${active ? 0 : -1}"`);
      if (active) {
        expect(panel).not.toContain("inert");
      } else {
        expect(panel).toContain('inert=""');
      }
    }
  });
});
