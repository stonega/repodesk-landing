import { Arrow, SiteFooter, SiteHeader } from "../components/site-chrome";
import Walkthrough from "../components/walkthrough";
import WorkflowDiagram from "../components/workflow-diagram";
import WorkflowIllustration, {
  type WorkflowStory,
} from "../components/workflow-illustration";
import { DOCS_URL } from "../lib/site";

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
const steps: {
  number: string;
  story: WorkflowStory;
  title: string;
  body: string;
}[] = [
  {
    number: "01",
    story: "connect",
    title: "Connect your repository.",
    body: "Install your GitHub App and choose the repositories your workspace can use. Access stays explicit.",
  },
  {
    number: "02",
    story: "conversation",
    title: "Give the work some context.",
    body: "Describe a fix or feature in Telegram. RepoDesk keeps the request, questions, and progress in the conversation.",
  },
  {
    number: "03",
    story: "review",
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
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" aria-hidden="true" /> YOUR CODE. YOUR
              CONVERSATION.
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
              <article className={`step step-${step.story}`} key={step.number}>
                <WorkflowIllustration story={step.story} />
                <div className="step-copy">
                  <span className="step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
          <WorkflowDiagram />
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
              <a className="text-link" href="/docs">
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
      <SiteFooter />
    </>
  );
}
