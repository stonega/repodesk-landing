import { useEffect, useState } from "react";

export const connectionPaths = [
  "M162 72H184Q204 72 204 92V100Q204 120 224 120H264",
  "M162 168H184Q204 168 204 148V140Q204 120 224 120H264",
  "M264 120H310Q332 120 332 98V94Q332 72 354 72H366",
];

export default function WorkflowDiagram() {
  const [paused, setPaused] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => setAnimated(true), []);

  return (
    <figure
      className={`workflow-diagram${animated ? " is-animated" : ""}${paused ? " is-paused" : ""}`}
    >
      <figcaption>
        <div>
          <p className="eyebrow">ILLUSTRATIVE WORKFLOW</p>
          <p>Selected repositories. One shared conversation.</p>
        </div>
        <button
          type="button"
          className="diagram-motion-toggle"
          aria-pressed={paused}
          disabled={!animated}
          onClick={() => setPaused(!paused)}
        >
          Pause diagram animation
        </button>
      </figcaption>
      <div className="diagram-stage">
        <svg
          className="diagram-connections"
          viewBox="0 0 600 240"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          {connectionPaths.map((path, index) => (
            <g key={path}>
              <path className="flow-track" d={path} />
              <path
                className={`flow-dot flow-dot-${index}`}
                d={path}
                pathLength="100"
              />
            </g>
          ))}
        </svg>
        <div className="diagram-repositories">
          <span className="diagram-label">GITHUB</span>
          {["web-app", "api-service"].map((repository) => (
            <div className="diagram-repository" key={repository}>
              <strong>{repository}</strong>
              <span>main</span>
            </div>
          ))}
        </div>
        <div className="diagram-hub">
          <span className="flow-halo" aria-hidden="true" />
          <img src="/repodesk-mark.svg" width="48" height="48" alt="" />
          <strong>RepoDesk</strong>
        </div>
        <div className="diagram-telegram">
          <strong className="diagram-chat-title">Telegram</strong>
          <span className="diagram-channel"># release-planning</span>
          <p className="diagram-question">What changed today?</p>
          <div className="diagram-answer">
            <strong>Here’s the latest.</strong>
            <span>2 repos · one conversation</span>
          </div>
          <span className="diagram-team">Your team · example conversation</span>
        </div>
      </div>
      <p className="diagram-note">
        Example repositories and messages, not live activity.
      </p>
    </figure>
  );
}
