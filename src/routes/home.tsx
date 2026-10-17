import { useEffect, useState } from "react";
import Walkthrough from "../components/walkthrough";

export const REPO_URL = "https://github.com/stonega/repodesk";
export const DOCS_URL = `${REPO_URL}/blob/main/docs/implementation/setup.md`;
export function meta() {
  return [
    { title: "RepoDesk — Your repositories, one conversation away." },
    {
      name: "description",
      content:
        "Work with selected GitHub repositories from Telegram. Ask questions, delegate coding tasks, and bring the pull request back to your conversation.",
    },
    {
      property: "og:title",
      content: "RepoDesk — From conversation to contribution.",
    },
    {
      property: "og:description",
      content: "A self-hosted Telegram assistant for your GitHub workflow.",
    },
    { property: "og:type", content: "website" },
  ];
}
function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} />
    </svg>
  );
}
function Mark() {
  return (
    <span className="wordmark">
      <img src="/repodesk-mark.svg" width="32" height="32" alt="" />
      RepoDesk
    </span>
  );
}
const steps = [
  {
    number: "01",
    title: "Connect your repository.",
    body: "Install your GitHub App and choose the repositories your workspace can use. Access stays explicit.",
  },
  {
    number: "02",
    title: "Give the work some context.",
    body: "Describe a fix or feature in Telegram. RepoDesk keeps the request, questions, and progress in the conversation.",
  },
  {
    number: "03",
    title: "Come back to a pull request.",
    body: "Codex works in an isolated environment, runs repository checks, and returns a PR for your review.",
  },
];
const faqs = [
  {
    question: "What is RepoDesk?",
    answer:
      "RepoDesk is a self-hosted Telegram assistant for selected GitHub repositories. It brings repository questions, coding tasks, and pull-request workflows into your conversations.",
  },
  {
    question: "Does it get access to all my repositories?",
    answer:
      "You choose which repositories to connect through your GitHub App. Workspace membership and verified GitHub permissions control who can ask it to act.",
  },
  {
    question: "Does every task change code?",
    answer:
      "No. Questions can stay read-only. Coding tasks follow your configured execution policy, and a pull request gives you a reviewable result. Merging is a separate action.",
  },
  {
    question: "Where does it run?",
    answer:
      "You host RepoDesk on your own server. The current deployment uses Docker for its service and isolated coding environments. See the setup guide for requirements and optional components.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap">
        <a href="/" aria-label="RepoDesk home">
          <Mark />
        </a>
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav
          id="site-nav"
          aria-label="Main navigation"
          className={menuOpen ? "nav open" : "nav"}
        >
          <a href="#workflow">How it works</a>
          <a href="#principles">Built for your team</a>
          <a href={REPO_URL} className="nav-github">
            GitHub <Arrow diagonal />
          </a>
        </nav>
      </header>
      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> YOUR CODE. YOUR CONVERSATION.
            </p>
            <h1 id="hero-title">
              Good work starts
              <br />
              with a <em>conversation.</em>
            </h1>
            <p className="hero-description">
              Bring your GitHub workflow into Telegram. Ask a question, hand off
              a fix, and pick up a pull request — without losing the thread.
            </p>
            <div className="hero-actions">
              <a className="button primary" href={DOCS_URL}>
                Get started <Arrow />
              </a>
              <a className="text-link" href="#workflow">
                See how it works <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-note">
              Self-hosted. Open source. Made for repository work.
            </p>
          </div>
          <Walkthrough />
        </section>
        <div className="integration-strip wrap">
          <span>THE TOOLS YOU ALREADY WORK IN</span>
          <div>
            <span className="integration-name">GitHub</span>
            <span className="connecting-line" />
            <img
              src="/repodesk-mark.svg"
              width="25"
              height="25"
              alt="RepoDesk"
            />
            <span className="connecting-line" />
            <span className="integration-name">Telegram</span>
          </div>
          <span>ONE CONTINUOUS THREAD</span>
        </div>
        <section
          id="workflow"
          className="workflow wrap section-space"
          aria-labelledby="workflow-title"
        >
          <div className="section-heading">
            <p className="eyebrow">A SHORTER PATH TO THE PR</p>
            <h2 id="workflow-title">
              Stay in the conversation.
              <br />
              <span>Keep the work moving.</span>
            </h2>
            <p>
              Small fixes shouldn’t need a new meeting.
              <br />
              Give the task a clear home, from request to review.
            </p>
          </div>
          <div className="steps">
            {steps.map((step) => (
              <article className="step" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          id="principles"
          className="principles section-space"
          aria-labelledby="principles-title"
        >
          <div className="wrap principles-grid">
            <div>
              <p className="eyebrow">A HELPFUL TEAMMATE, CLEAR BOUNDARIES</p>
              <h2 id="principles-title">
                Your workflow.
                <br />
                Your say.
              </h2>
              <p className="principles-intro">
                Keep the useful parts of delegation.
                <br />
                Keep control of what ships.
              </p>
              <a
                className="text-link"
                href={`${REPO_URL}/blob/main/docs/README.md`}
              >
                Read the documentation <Arrow diagonal />
              </a>
            </div>
            <div className="principle-list">
              <article>
                <span aria-hidden="true">01 /</span>
                <div>
                  <h3>Access you can understand.</h3>
                  <p>
                    Selected repositories, workspace membership, and verified
                    GitHub permissions define the scope.
                  </p>
                </div>
              </article>
              <article>
                <span aria-hidden="true">02 /</span>
                <div>
                  <h3>Work you can review.</h3>
                  <p>
                    Coding tasks run repository checks and return changes
                    through a pull request. You decide what to merge.
                  </p>
                </div>
              </article>
              <article>
                <span aria-hidden="true">03 /</span>
                <div>
                  <h3>A home on your own server.</h3>
                  <p>
                    Run the service yourself, configure your model provider, and
                    keep durable task state with your deployment.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section className="faq wrap section-space" aria-labelledby="faq-title">
          <div>
            <p className="eyebrow">A FEW USEFUL DETAILS</p>
            <h2 id="faq-title">
              Before you
              <br />
              say hello.
            </h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="closing wrap">
          <div>
            <p className="eyebrow">LESS FRICTION. MORE FORWARD.</p>
            <h2>
              Your next contribution
              <br />
              can start right here.
            </h2>
          </div>
          <a className="button primary" href={DOCS_URL}>
            Set up RepoDesk <Arrow />
          </a>
        </section>
      </main>
      <footer className="site-footer wrap">
        <a href="/" aria-label="RepoDesk home">
          <Mark />
        </a>
        <p>From conversation to contribution.</p>
        <div>
          <a href={REPO_URL}>
            Source <Arrow diagonal />
          </a>
          <a href={`${REPO_URL}/blob/main/docs/README.md`}>
            Documentation <Arrow diagonal />
          </a>
        </div>
      </footer>
    </>
  );
}
