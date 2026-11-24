import HeroThreeCanvas from "../components/hero-three-canvas";
import { Arrow, SiteFooter, SiteHeader } from "../components/site-chrome";
import Walkthrough from "../components/walkthrough";
import WorkflowDiagram from "../components/workflow-diagram";
import WorkflowIllustration, {
  type WorkflowStory,
} from "../components/workflow-illustration";
import { DOCS_URL } from "../lib/site";

export function meta() {
  return [
    {
      title:
        "Telo — Your warm, dependable AI work buddy for GitHub inside Telegram.",
    },
    {
      name: "description",
      content:
        "Self-hosted Telegram AI work buddy for GitHub teams and solo builders. Ask source-grounded code questions, review PRs, delegate isolated coding tasks, and run proactive watchers.",
    },
    {
      property: "og:title",
      content: "Telo — Telegram × GitHub AI Work Buddy",
    },
    {
      property: "og:description",
      content:
        "Work with selected GitHub repositories right inside Telegram with explicit approval before external writes.",
    },
    { property: "og:type", content: "website" },
  ];
}

const heroHighlights = [
  "Scoped Repos",
  "Coding & PRs",
  "Missions & Watchers",
  "Self-Hosted",
] as const;

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
    body: "Install your GitHub App and choose the exact repositories your workspace can use. Access stays explicit.",
  },
  {
    number: "02",
    story: "conversation",
    title: "Give the work some context.",
    body: "Describe a question, fix, or review in Telegram. Telo keeps the request, clarifications, and progress in one thread.",
  },
  {
    number: "03",
    story: "review",
    title: "Come back to a pull request.",
    body: "Sandboxed coding runners work in an isolated environment, run repository checks, and return a PR for your review.",
  },
];

const capabilities = [
  {
    tag: "CODE TRUTH",
    title: "Source-grounded code Q&A",
    body: "Built-in read-only source indexing answers architecture and code questions with file, symbol, and commit provenance.",
    href: "/docs/user/code-truth",
    linkLabel: "Code Truth guide",
    icon: "search",
  },
  {
    tag: "ISOLATED RUNNERS",
    title: "Codex & Antigravity coding tasks",
    body: "Delegate coding work to continuous sandboxed runners across Docker, OpenSandbox, or Native VPS with mid-task chat check-ins.",
    href: "/docs/user/codex",
    linkLabel: "Coding runners guide",
    icon: "terminal",
  },
  {
    tag: "REVIEW BOT",
    title: "PR reviews & feedback groups",
    body: "Automatic PR reviews on selected repositories, same-PR @mention follow-up fixes, and repo-bound Telegram groups.",
    href: "/docs/user/review-bot",
    linkLabel: "Review Bot guide",
    icon: "review",
  },
  {
    tag: "ORCHESTRATION",
    title: "Missions & silent watchers",
    body: "Run multi-step background missions, serialized per-repo task queues, scheduled reports, and silent watchers that stay quiet when healthy.",
    href: "/docs/user/agent-orchestration",
    linkLabel: "Orchestration guide",
    icon: "orbit",
  },
  {
    tag: "TELEGRAM NATIVE",
    title: "Topics, voice & interactive widgets",
    body: "Works in private chats, native Topics, and opted-in groups—with optional local Qwen3-ASR voice transcription and HTML widgets.",
    href: "/docs/user/telegram-experience",
    linkLabel: "Telegram guide",
    icon: "chat",
  },
  {
    tag: "SKILLS & TOOLS",
    title: "Memory, skills & built-in integrations",
    body: "Scoped memory and evolving skills, plus optional Obsidian vaults, Private Browser, Google Workspace, and Cloudflare tools.",
    href: "/docs/user/skills",
    linkLabel: "Skills & tools guide",
    icon: "spark",
  },
] as const;

const faqs = [
  {
    question: "What is Telo?",
    answer:
      "Telo (formerly RepoDesk) is a self-hosted Telegram AI work buddy for GitHub teams and solo builders. It brings source-grounded repository Q&A, isolated coding tasks, PR reviews, and proactive workflows into your Telegram conversations.",
  },
  {
    question: "Does it get access to all my repositories?",
    answer:
      "You choose which repositories to connect through your GitHub App. Workspace membership, roles, and verified GitHub permissions control who can ask Telo to inspect or act.",
  },
  {
    question: "Does every task change code?",
    answer:
      "No. Questions can stay strictly read-only. Coding tasks follow your configured autonomy preset (Supervised or Check-in) and return a pull request for review. Merging is a separate action.",
  },
  {
    question: "Where does it run?",
    answer:
      "You host Telo on your own server with Docker and optional overlays for Code Truth, Coding Runners, Private Browser, and Qwen3-ASR transcription. See the quick-start guide for requirements and setup steps.",
  },
];

function CapabilityIcon({
  name,
}: {
  name: (typeof capabilities)[number]["icon"];
}) {
  switch (name) {
    case "search":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5M8.5 11h5M11 8.5v5" />
        </svg>
      );
    case "terminal":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="m7.5 10 3 2.5-3 2.5M13 15h3.5" />
        </svg>
      );
    case "review":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <path d="M6 8.5v7M18 8.5v2a4 4 0 0 1-4 4H8.5" />
        </svg>
      );
    case "orbit":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3a9 9 0 1 0 9 9" />
          <path d="M18.5 5.5 21 3m0 0h-4m4 0v4" />
        </svg>
      );
    case "chat":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5Z" />
          <path d="M8.5 9.5h7M8.5 12.5h4.5" />
        </svg>
      );
    case "spark":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m12 3 2.2 6.2L20.5 11l-6.3 1.8L12 19l-2.2-6.2L3.5 11l6.3-1.8Z" />
        </svg>
      );
  }
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <div className="hero-band">
          <HeroThreeCanvas />
          <section className="hero wrap" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="eyebrow hero-pill">
                <span className="status-dot" aria-hidden="true" /> TELEGRAM ×
                GITHUB ASSISTANT
              </p>
              <h1 id="hero-title">
                Your warm AI work buddy
                <br />
                for GitHub, <em>in Telegram.</em>
              </h1>
              <p className="hero-description">
                Ask source-grounded questions about your codebase, review pull
                requests, delegate isolated coding tasks, and run proactive
                watchers — without ever losing the thread.
              </p>
              <ul className="hero-highlights" aria-label="Key highlights">
                {heroHighlights.map((item) => (
                  <li key={item}>
                    <span className="highlight-dot" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="hero-actions">
                <a className="button primary" href={DOCS_URL}>
                  Get started <Arrow />
                </a>
                <a className="text-link" href="#workflow">
                  See how it works <span aria-hidden="true">↓</span>
                </a>
              </div>
              <p className="hero-note">
                Self-hosted. Open source. Explicit approval before external
                writes.
              </p>
            </div>
            <Walkthrough />
          </section>
        </div>

        <div className="integration-strip wrap">
          <span>THE TOOLS YOU ALREADY WORK IN</span>
          <div className="integration-chain">
            <span className="integration-name">GitHub</span>
            <span className="connecting-line" />
            <span className="integration-chip">Code Truth</span>
            <span className="connecting-line" />
            <span className="integration-mark">
              <img src="/telo-mark.svg" width="28" height="28" alt="Telo" />
            </span>
            <span className="connecting-line" />
            <span className="integration-chip">Codex &amp; Antigravity</span>
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
          id="capabilities"
          className="capabilities wrap section-space"
          aria-labelledby="capabilities-title"
        >
          <div className="section-heading">
            <p className="eyebrow">BUILT FOR REAL REPOSITORY WORK</p>
            <h2 id="capabilities-title">
              From quick answers to
              <br />
              <span>autonomous background missions.</span>
            </h2>
            <p>
              Start with read-only Q&amp;A and expand into sandboxed coding
              runners, automatic PR reviews, and scheduled watchers at your own
              pace.
            </p>
          </div>
          <div className="capabilities-grid">
            {capabilities.map((cap) => (
              <article className="capability-card" key={cap.tag}>
                <div className="capability-head">
                  <span className="capability-icon">
                    <CapabilityIcon name={cap.icon} />
                  </span>
                  <span className="capability-tag">{cap.tag}</span>
                </div>
                <h3>{cap.title}</h3>
                <p>{cap.body}</p>
                <a className="capability-link" href={cap.href}>
                  {cap.linkLabel} <Arrow diagonal />
                </a>
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
                Keep the momentum of delegation.
                <br />
                Keep control of what ships.
              </p>
              <a className="text-link principles-cta" href="/docs">
                Read the documentation <Arrow diagonal />
              </a>
            </div>
            <div className="principle-list">
              <article>
                <span aria-hidden="true">01</span>
                <div>
                  <h3>Access you can understand.</h3>
                  <p>
                    Selected repositories, workspace membership, and verified
                    GitHub permissions define the scope. External messages and
                    tool outputs are always treated as data, never permission.
                  </p>
                </div>
              </article>
              <article>
                <span aria-hidden="true">02</span>
                <div>
                  <h3>Work you can review.</h3>
                  <p>
                    Server-enforced Supervised and Check-in autonomy presets
                    require explicit approval before external writes. Coding
                    tasks return a pull request; merging stays your decision.
                  </p>
                </div>
              </article>
              <article>
                <span aria-hidden="true">03</span>
                <div>
                  <h3>A home on your own server.</h3>
                  <p>
                    Host Telo yourself with Docker, keep encrypted write-only
                    credentials, bring your own model provider, and track spend
                    in the built-in admin panel.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="faq wrap section-space"
          aria-labelledby="faq-title"
        >
          <div>
            <p className="eyebrow">A FEW USEFUL DETAILS</p>
            <h2 id="faq-title">
              Before you
              <br />
              say hello.
            </h2>
            <p className="faq-aside">
              Everything runs in your own deployment — try it first with a test
              bot and a test repository.
            </p>
          </div>
          <div className="faq-list">
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

        <section className="closing wrap" aria-labelledby="closing-title">
          <div className="closing-copy">
            <p className="eyebrow">LESS FRICTION. MORE FORWARD.</p>
            <h2 id="closing-title">
              Your next contribution
              <br />
              can set sail right here.
            </h2>
          </div>
          <div className="closing-actions">
            <a className="button primary" href={DOCS_URL}>
              Set up Telo <Arrow />
            </a>
            <a className="button secondary" href="/docs">
              Explore docs <Arrow diagonal />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
