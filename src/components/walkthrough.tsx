import { useRef, useState } from "react";
import { scenarios } from "../content/walkthrough";
import ScenarioPanel from "./scenario-panel";

function ScenarioTabs({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (index: number) => void;
}) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function selectTab(index: number) {
    onSelect(index);
    tabs.current[index]?.focus();
  }

  return (
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
          onClick={() => onSelect(index)}
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
  );
}

export default function Walkthrough() {
  const [selected, setSelected] = useState(1);

  return (
    <div className="conversation-scene">
      <div className="scene-doodle" aria-hidden="true">
        <svg
          width="74"
          height="46"
          viewBox="0 0 76 52"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M3 43Q31 43 49 17M35 18l17-9-1 19M62 5v10m-5-5h10"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>A quick message. A clear next step.</span>
      </div>
      <div className="scene-label">
        <span>THREE WAYS TO START</span>
        <span>INTERACTIVE EXAMPLE</span>
      </div>
      <div className="chat-window">
        <div className="chat-header">
          <img src="/telo-mark.svg" width="40" height="40" alt="" />
          <div>
            <strong>Telo</strong>
            <span>Telegram · workspace assistant</span>
          </div>
          <span className="bot-label">EXPLICIT APPROVAL</span>
        </div>
        <div className="repository-context">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <circle cx="6" cy="5" r="3" />
            <circle cx="6" cy="19" r="3" />
            <circle cx="18" cy="5" r="3" />
            <path d="M6 8v8m12-8v3a4 4 0 0 1-4 4H6" />
          </svg>
          <div>
            <span>EXAMPLE REPOSITORY</span>
            <strong>example/site</strong>
          </div>
          <span className="repository-scope">Selected repo</span>
        </div>
        <ScenarioTabs selected={selected} onSelect={setSelected} />
        <div className="chat-body">
          <p className="chat-date">ILLUSTRATIVE CONVERSATION</p>
          <p className="example-notice">
            Sample requests and outcomes — not live execution results.
          </p>
          <div className="scenario-panels">
            {scenarios.map((scenario, index) => (
              <ScenarioPanel
                key={scenario.id}
                scenario={scenario}
                active={selected === index}
              />
            ))}
          </div>
        </div>
        <div className="chat-compose">
          <span>Preview only · no messages are sent</span>
        </div>
      </div>
      <div className="scene-footnote">
        <span className="tiny-line" /> From a question to a fix or a review.
      </div>
    </div>
  );
}
