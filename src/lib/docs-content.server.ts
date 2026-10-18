import type { Doc } from "./docs";

const content = import.meta.glob<string>("../content/repodesk/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export function readDocument(document: Doc) {
  const markdown = content[`../content/repodesk/${document.source}`];
  if (!markdown) throw new Error(`Missing documentation: ${document.source}`);
  return markdown;
}
