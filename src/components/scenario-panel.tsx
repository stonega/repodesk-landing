import type { Scenario } from "../content/walkthrough";

function ExampleArtifact({ preview }: { preview: Scenario["preview"] }) {
  return (
    <figure className="example-artifact">
      <figcaption>{preview.label}</figcaption>
      {preview.kind === "diff" ? (
        <pre>
          <code>
            {preview.lines.map((line) => (
              <span
                key={line}
                className={line.startsWith("+") ? "diff-add" : "diff-remove"}
              >
                {line}
                {"\n"}
              </span>
            ))}
          </code>
        </pre>
      ) : preview.kind === "trace" ? (
        <ol>
          {preview.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      ) : (
        <ul>
          {preview.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </figure>
  );
}

export default function ScenarioPanel({
  scenario,
  active,
}: {
  scenario: Scenario;
  active: boolean;
}) {
  return (
    <div
      id={`scenario-panel-${scenario.id}`}
      role="tabpanel"
      aria-labelledby={`scenario-tab-${scenario.id}`}
      aria-hidden={!active}
      inert={!active}
      tabIndex={active ? 0 : -1}
      className="scenario-panel"
    >
      <div className="message outgoing">
        <strong>Example request</strong>
        <p>{scenario.request}</p>
      </div>
      <div className="message incoming">
        <strong>RepoDesk · example response</strong>
        <p>{scenario.reply}</p>
      </div>
      <div className="task-progress">
        <svg
          className="handoff-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M5 4v7a3 3 0 0 0 3 3h11m-5-5 5 5-5 5" />
        </svg>
        <div>
          <strong>{scenario.status}</strong>
          <span>{scenario.detail}</span>
        </div>
      </div>
      <div className="pr-preview">
        <span className="result-label">{scenario.resultLabel}</span>
        <strong>{scenario.resultTitle}</strong>
        <p>{scenario.resultBody}</p>
        <ExampleArtifact preview={scenario.preview} />
      </div>
    </div>
  );
}
