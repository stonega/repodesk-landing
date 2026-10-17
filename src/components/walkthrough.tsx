import { useRef, useState } from "react";

export const scenarios = [
  {
    id: "questions",
    label: "Code Q&A",
    request:
      "Where does this app decide which repositories a workspace can use?",
    reply:
      "In this example, I’d trace the permission checks and explain how repository access is scoped.",
    status: "Read-only explanation",
    detail: "No code changes requested",
    resultLabel: "EXAMPLE ANSWER",
    resultTitle: "Follow the repository access checks",
    resultBody:
      "Start with workspace membership, then check the connected repositories and GitHub permissions.",
  },
  {
    id: "fix",
    label: "Fix an issue",
    request:
      "The signup page feels cramped on mobile. Can you improve the spacing?",
    reply:
      "In this example, I’d inspect the layout, adjust the mobile spacing, and run the project checks.",
    status: "Proposed layout fix",
    detail: "Checks and changes would accompany the PR",
    resultLabel: "EXAMPLE PULL REQUEST",
    resultTitle: "Improve the mobile signup layout",
    resultBody:
      "A focused spacing change for you to inspect. Review and merging remain separate actions.",
  },
  {
    id: "review",
    label: "PR review",
    request:
      "Review the proposed mobile signup changes. Are there any layout risks?",
    reply:
      "In this example, I’d read the diff and flag narrow-screen issues for a maintainer to consider.",
    status: "Review notes for a maintainer",
    detail: "No approval or merge implied",
    resultLabel: "EXAMPLE REVIEW",
    resultTitle: "Check the form at narrow widths",
    resultBody:
      "Suggested follow-up: check that input labels wrap and the submit button stays within the viewport.",
  },
] as const;

export default function Walkthrough() {
  const [selected, setSelected] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function selectTab(index: number) {
    setSelected(index);
    tabs.current[index]?.focus();
  }

  return (
    <div className="conversation-scene">
      <div className="scene-label">
        <span>THREE WAYS TO START</span>
        <span aria-hidden="true">↙</span>
      </div>
      <div className="chat-window">
        <div className="chat-header">
          <img src="/repodesk-mark.svg" width="38" height="38" alt="" />
          <div>
            <strong>RepoDesk</strong>
            <span>Your repository, in the loop</span>
          </div>
          <span className="chat-dots" aria-hidden="true">
            ···
          </span>
        </div>
        <div
          className="scenario-tabs"
          role="tablist"
          aria-label="Example scenarios"
        >
          {scenarios.map((scenario, index) => (
            <button
              key={scenario.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              id={`scenario-tab-${scenario.id}`}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-controls={`scenario-panel-${scenario.id}`}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => {
                let next: number;
                switch (event.key) {
                  case "ArrowRight":
                    next = (index + 1) % scenarios.length;
                    break;
                  case "ArrowLeft":
                    next = (index + scenarios.length - 1) % scenarios.length;
                    break;
                  case "Home":
                    next = 0;
                    break;
                  case "End":
                    next = scenarios.length - 1;
                    break;
                  default:
                    return;
                }
                event.preventDefault();
                selectTab(next);
              }}
            >
              {scenario.label}
            </button>
          ))}
        </div>
        <div className="chat-body">
          <p className="chat-date">ILLUSTRATIVE CONVERSATION</p>
          <p className="example-notice">
            Sample requests and outcomes — not live execution results.
          </p>
          <div className="scenario-panels">
            {scenarios.map((scenario, index) => (
              <div
                key={scenario.id}
                id={`scenario-panel-${scenario.id}`}
                role="tabpanel"
                aria-labelledby={`scenario-tab-${scenario.id}`}
                aria-hidden={selected !== index}
                inert={selected !== index}
                tabIndex={selected === index ? 0 : -1}
                className="scenario-panel"
              >
                <div className="message outgoing">
                  <strong>Example request</strong>
                  {scenario.request}
                </div>
                <div className="message incoming">
                  <strong>RepoDesk · example response</strong>
                  {scenario.reply}
                </div>
                <div className="task-progress">
                  <span className="check-circle" aria-hidden="true">
                    ↳
                  </span>
                  <div>
                    <strong>{scenario.status}</strong>
                    <span>{scenario.detail}</span>
                  </div>
                </div>
                <div className="pr-preview">
                  <span className="pr-icon" aria-hidden="true">
                    ⑂
                  </span>
                  <div>
                    <span>{scenario.resultLabel}</span>
                    <strong>{scenario.resultTitle}</strong>
                    <small>{scenario.resultBody}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="chat-compose" aria-hidden="true">
          A little less back-and-forth.<span>↗</span>
        </div>
      </div>
      <div className="scene-footnote">
        <span className="tiny-line" /> From a question to a fix or a review.
      </div>
    </div>
  );
}
