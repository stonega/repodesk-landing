import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const destination = new URL("../src/content/repodesk/", import.meta.url)
  .pathname;
const manifestPath = join(destination, "manifest.json");
const revision: string | undefined =
  process.argv[2] ??
  (existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8")).revision
    : undefined);

if (!revision || !/^[a-f0-9]{40}$/.test(revision)) {
  throw new Error("Pass a full public stonega/repodesk commit SHA.");
}

const repository = "https://github.com/stonega/repodesk";
const temporary = mkdtempSync(join(tmpdir(), "repodesk-docs-"));

try {
  const git = (...args: string[]) =>
    execFileSync(
      "git",
      ["-c", "credential.helper=", "-c", "core.hooksPath=/dev/null", ...args],
      {
        cwd: temporary,
        env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
        stdio: "pipe",
      },
    );
  git("init");
  git("fetch", "--depth=1", `${repository}.git`, revision);
  git("checkout", "--detach", "FETCH_HEAD");

  const sources = [
    ...readdirSync(join(temporary, "docs"), {
      recursive: true,
      encoding: "utf8",
    })
      .filter((path) => path.endsWith(".md"))
      .map((path) => `docs/${path}`),
    "src/agent/SOUL.md",
  ].sort();
  const documents = sources.map((source) => {
    const content = readFileSync(join(temporary, source));
    const title = content.toString("utf8").match(/^# (.+)$/m)?.[1];
    if (!title) throw new Error(`Missing document title: ${source}`);
    const route =
      source === "docs/README.md"
        ? "/docs"
        : source === "src/agent/SOUL.md"
          ? "/docs/assistant-personality"
          : `/${source.replace(/\.md$/, "")}`;
    return {
      source,
      route,
      title,
      sha256: createHash("sha256").update(content).digest("hex"),
    };
  });

  rmSync(destination, { recursive: true, force: true });
  for (const source of sources) {
    const target = join(destination, source);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, readFileSync(join(temporary, source)));
  }
  writeFileSync(
    manifestPath,
    `${JSON.stringify({ repository, revision, documents }, null, 2)}\n`,
  );
  console.log(`Copied ${documents.length} unchanged documents at ${revision}.`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
