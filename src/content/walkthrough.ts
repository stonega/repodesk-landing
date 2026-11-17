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
    preview: {
      kind: "trace",
      label: "Sample access trace",
      lines: [
        "Workspace membership",
        "Connected repository",
        "Verified GitHub permissions",
      ],
    },
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
    preview: {
      kind: "diff",
      label: "Sample diff · src/signup.css",
      lines: ["- padding: 8px;", "+ padding: 24px 16px;"],
    },
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
    preview: {
      kind: "review",
      label: "Sample review checklist",
      lines: [
        "Check wrapping on long input labels",
        "Check the submit button at 390px",
      ],
    },
  },
] as const;

export type Scenario = (typeof scenarios)[number];
