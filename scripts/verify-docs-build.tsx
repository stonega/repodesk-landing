import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import DocumentMarkdown from "../src/components/document-markdown";
import { docsSnapshot } from "../src/lib/docs";

for (const document of docsSnapshot.documents) {
  const content = readFileSync(
    new URL(`../src/content/repodesk/${document.source}`, import.meta.url),
    "utf8",
  );
  const html = readFileSync(
    new URL(`../build/client${document.route}/index.html`, import.meta.url),
    "utf8",
  );
  const rendered = renderToStaticMarkup(
    <DocumentMarkdown content={content} source={document.source} />,
  );
  assert(
    html.replaceAll("<!-- -->", "").includes(rendered),
    `Missing prerendered body: ${document.route}`,
  );
  assert(html.includes("<title>"), `Missing metadata: ${document.route}`);
  assert(
    html.includes(`${docsSnapshot.revision}/${document.source}`),
    `Missing pinned source: ${document.route}`,
  );
}
console.log(
  `Verified ${docsSnapshot.documents.length} prerendered documentation pages.`,
);
