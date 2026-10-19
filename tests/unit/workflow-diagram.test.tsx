import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import WorkflowDiagram, {
  connectionPaths,
} from "../../src/components/workflow-diagram";

describe("illustrative workflow diagram", () => {
  test("renders labeled example repositories and messages without live claims", () => {
    const html = renderToStaticMarkup(<WorkflowDiagram />);
    for (const label of [
      "ILLUSTRATIVE WORKFLOW",
      "GITHUB",
      "web-app",
      "api-service",
      "RepoDesk",
      "Telegram",
      "example conversation",
      "Example repositories and messages, not live activity.",
    ]) {
      expect(html).toContain(label);
    }
    expect(html).toContain('src="/repodesk-mark.svg"');
    expect(html).not.toContain("<a ");
    expect(html).not.toContain("<form");
  });

  test("shares exact curves for tracks and dots with static server-rendered fallback", () => {
    const html = renderToStaticMarkup(<WorkflowDiagram />);
    expect(connectionPaths).toHaveLength(3);
    for (const path of connectionPaths) {
      expect(html.split(`d="${path}"`)).toHaveLength(3);
    }
    expect(html.match(/pathLength="100"/g)).toHaveLength(3);
    expect(html).toContain('aria-hidden="true" focusable="false"');
    expect(html).not.toContain("<animate");
    expect(html).not.toContain("is-animated");
    expect(html).toContain('aria-pressed="false" disabled=""');
  });
});
