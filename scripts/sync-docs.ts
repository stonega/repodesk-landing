import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const checkout = resolve(process.argv[2] ?? join(root, "../repodesk"));
const manifestPath = join(root, "src/content/repodesk/manifest.json");
const git = (...args: string[]) =>
  execFileSync("git", ["-C", checkout, ...args], { stdio: "pipe" });
const revision = git("rev-parse", "HEAD").toString().trim();
const sources = readdirSync(join(checkout, "docs/user"), {
  recursive: true,
  encoding: "utf8",
})
  .filter((path) => path.endsWith(".md"))
  .map((path) => `docs/user/${path}`)
  .sort();

const documents = sources.map((source) => {
  const content = readFileSync(join(checkout, source));
  const title = content.toString("utf8").match(/^# (.+)$/m)?.[1];
  if (!title) throw new Error(`Missing document title: ${source}`);
  let modified = true;
  try {
    modified = !content.equals(git("show", `HEAD:${source}`));
  } catch {
    // Newly added user guides have no committed source yet.
  }
  return {
    source,
    route:
      source === "docs/user/README.md"
        ? "/docs"
        : `/${source.replace(/\.md$/, "")}`,
    title,
    sha256: createHash("sha256").update(content).digest("hex"),
    modified,
  };
});

if (existsSync(manifestPath)) {
  const previous: { documents: { source: string }[] } = JSON.parse(
    readFileSync(manifestPath, "utf8"),
  );
  for (const { source } of previous.documents) {
    if (
      source.startsWith("docs/user/") &&
      !source.split("/").includes("..") &&
      !sources.includes(source)
    ) {
      rmSync(join(root, source), { force: true });
    }
  }
}
for (const source of sources) {
  const target = join(root, source);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, readFileSync(join(checkout, source)));
}
mkdirSync(dirname(manifestPath), { recursive: true });
writeFileSync(
  manifestPath,
  `${JSON.stringify({ repository: "https://github.com/stonega/repodesk", revision, documents }, null, 2)}\n`,
);
console.log(
  `Synced ${documents.length} user guides from ${checkout} at ${revision}.`,
);
