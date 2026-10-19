import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from "react-router";
import DocumentMarkdown from "../components/document-markdown";
import {
  type Doc,
  docsSnapshot,
  documentationGroups,
  findDocument,
  sourceUrl,
} from "../lib/docs";
import { readDocument } from "../lib/docs-content.server";
import "../docs.css";

export function loader({ request }: LoaderFunctionArgs) {
  const document = findDocument(new URL(request.url).pathname);
  if (!document) throw new Response("Document not found", { status: 404 });
  return { document, content: readDocument(document) };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.document.title ?? "Documentation"} — RepoDesk Docs` },
  {
    name: "description",
    content: `${data?.document.title ?? "User documentation"} from the RepoDesk user guides. Deployment, configuration, Telegram workflows and integrations.`,
  },
];

function DocumentationNavigation({ current }: { current: Doc }) {
  return (
    <nav aria-label="Documentation">
      {documentationGroups.map((group) => (
        <section key={group.title} aria-label={group.title}>
          <h2>{group.title}</h2>
          <ul>
            {group.documents.map((document) => (
              <li key={document.source}>
                <a
                  href={document.route}
                  aria-current={
                    document.source === current.source ? "page" : undefined
                  }
                >
                  {document.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}

export function DocumentationPage({
  document,
  content,
}: ReturnType<typeof loader>) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap docs-header">
        <a href="/" className="wordmark" aria-label="RepoDesk home">
          <img src="/repodesk-mark.svg" width="32" height="32" alt="" />
          RepoDesk
        </a>
        <nav aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/docs" aria-current="page">
            Docs
          </a>
          <a href={docsSnapshot.repository}>GitHub</a>
        </nav>
      </header>
      <div className="docs-layout wrap">
        <aside className="docs-sidebar">
          <DocumentationNavigation current={document} />
        </aside>
        <details className="docs-mobile-navigation">
          <summary>Browse documentation</summary>
          <DocumentationNavigation current={document} />
        </details>
        <main id="main" className="docs-main" tabIndex={-1}>
          <div className="docs-provenance">
            <p className="eyebrow">REPODESK DOCUMENTATION</p>
            <p>
              User guides from <strong>stonega/repodesk</strong>. Available
              features depend on your deployment version, connected services and
              workspace settings.
            </p>
            <a href={sourceUrl(document)}>
              {document.modified
                ? "View upstream source at "
                : "View source at "}
              {docsSnapshot.revision.slice(0, 7)}
            </a>
            {document.modified && (
              <p>This guide includes local edits since that revision.</p>
            )}
          </div>
          <article aria-label={document.title}>
            <DocumentMarkdown content={content} source={document.source} />
          </article>
          <footer className="docs-footer">
            <a href="/docs">All documentation</a>
            <a href="#main">Back to top ↑</a>
          </footer>
        </main>
      </div>
    </>
  );
}

export default function DocumentationRoute() {
  return <DocumentationPage {...useLoaderData<typeof loader>()} />;
}
