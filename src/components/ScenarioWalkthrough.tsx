import { type KeyboardEvent, useRef, useState } from "react";

const scenarios = [
  {
    id: "code-qa",
    label: "Code Q&A",
    request:
      "Where is signup validation handled, and how does the form show errors?",
    response:
      "In this example, the signup route calls a shared validation helper. Field errors return to the form beside the matching inputs.",
    resultLabel: "EXAMPLE ANSWER",
    resultTitle: "Trace the signup flow",
    resultDescription: "Read-only explanation. No code changes.",
  },
  {
    id: "fix-issue",
    label: "Fix an issue",
    request:
      "The signup page feels cramped on mobile. Can you improve the spacing?",
    response:
      "I’d adjust the mobile spacing, add a layout regression test, and run the repository checks before returning a PR.",
    resultLabel: "EXAMPLE PULL REQUEST",
    resultTitle: "Improve the mobile signup layout",
    resultDescription:
      "Proposed spacing changes and a regression test. Review before merging.",
  },
  {
    id: "pr-review",
    label: "PR review",
    request:
      "Review the signup PR for missing error handling. Don’t change any files.",
    response:
      "In this example, a failed signup request leaves the submit button disabled. I’d flag the error path and suggest a regression test.",
    resultLabel: "EXAMPLE REVIEW",
    resultTitle: "Handle failed signup requests",
    resultDescription: "Suggested feedback for the author. No edits or merge.",
  },
];

export default function ScenarioWalkthrough() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % scenarios.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + scenarios.length) % scenarios.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = scenarios.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setSelectedIndex(nextIndex);
    tabs.current[nextIndex]?.focus();
  }

  return (
    <div className="conversation-scene">
      <div className="scene-label">
        <span>LESS CONTEXT SWITCHING</span>
        <span aria-hidden="true">↙</span>
      </div>
      <div
        className="scenario-tabs"
        role="tablist"
        aria-label="Example scenarios"
      >
        {scenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            id={`tab-${scenario.id}`}
            type="button"
            role="tab"
            aria-selected={selectedIndex === index}
            aria-controls={`panel-${scenario.id}`}
            tabIndex={selectedIndex === index ? 0 : -1}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            onClick={() => setSelectedIndex(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {scenario.label}
          </button>
        ))}
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
        <div className="chat-body">
          <p className="chat-date">ILLUSTRATIVE CONVERSATION</p>
          <p className="chat-disclaimer" id="walkthrough-note">
            Examples only — not live tasks or real execution results.
          </p>
          <div className="scenario-panels">
            {scenarios.map((scenario, index) => (
              <div
                key={scenario.id}
                id={`panel-${scenario.id}`}
                className="scenario-panel"
                role="tabpanel"
                aria-labelledby={`tab-${scenario.id}`}
                aria-describedby="walkthrough-note"
                aria-hidden={selectedIndex !== index}
                inert={selectedIndex !== index}
                tabIndex={selectedIndex === index ? 0 : -1}
              >
                <div className="message outgoing">
                  <strong>Example request</strong>
                  {scenario.request}
                </div>
                <div className="message incoming">
                  <strong>RepoDesk · example response</strong>
                  {scenario.response}
                </div>
                <div className="scenario-result">
                  <p className="result-label">{scenario.resultLabel}</p>
                  <h2>{scenario.resultTitle}</h2>
                  <p>{scenario.resultDescription}</p>
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
        <span className="tiny-line" /> From a question to a reviewable next
        step.
      </div>
    </div>
  );
}
