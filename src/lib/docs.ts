import snapshot from "../content/repodesk/manifest.json" with { type: "json" };

export const docsSnapshot = snapshot;
export type Doc = (typeof snapshot.documents)[number];

export function findDocument(pathname: string) {
  return snapshot.documents.find(
    (document) => document.route === pathname.replace(/\/$/, ""),
  );
}

export function sourceUrl(document: Doc) {
  return `${snapshot.repository}/blob/${snapshot.revision}/${document.source}`;
}

export function resolveDocumentUrl(
  href: string,
  source: string,
  image = false,
) {
  if (!href || href.startsWith("#")) return href;
  const base = "https://repodesk-source.invalid/";
  const url = new URL(href, `${base}${source}`);
  let path: string;
  if (url.origin === new URL(base).origin) {
    path = url.pathname.slice(1);
  } else {
    const prefixes = ["main", snapshot.revision].map(
      (revision) => `${snapshot.repository}/blob/${revision}/`,
    );
    const prefix = prefixes.find((value) => url.href.startsWith(value));
    if (!prefix) return href;
    path = url.pathname.slice(new URL(prefix).pathname.length);
  }
  const document = snapshot.documents.find((entry) => entry.source === path);
  if (document && !image) return document.route + url.search + url.hash;
  const root = image
    ? `https://raw.githubusercontent.com/stonega/repodesk/${snapshot.revision}`
    : `${snapshot.repository}/blob/${snapshot.revision}`;
  return `${root}/${path}${url.search}${url.hash}`;
}

export const documentationGroups = [
  {
    title: "Overview",
    documents: snapshot.documents.filter((doc) => doc.route === "/docs"),
  },
  ...["design", "implementation", "user", "reference", "research"].map(
    (group) => ({
      title: group.charAt(0).toUpperCase() + group.slice(1),
      documents: snapshot.documents.filter(
        (doc) =>
          doc.source.startsWith(`docs/${group}/`) ||
          (group === "reference" && doc.source === "src/agent/SOUL.md"),
      ),
    }),
  ),
];
