import { statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { parseArgs } from "node:util";

export function serveBuild(request: Request, directory: string): Response {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }
  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(request.url).pathname);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }
  const root = resolve(directory);
  const target = resolve(root, pathname.replace(/^\/+/, ""));
  if (target !== root && !target.startsWith(`${root}${sep}`)) {
    return new Response("Forbidden", { status: 403 });
  }
  for (const candidate of [
    target,
    join(target, "index.html"),
    `${target}.html`,
  ]) {
    if (!statSync(candidate, { throwIfNoEntry: false })?.isFile()) continue;
    const file = Bun.file(candidate);
    return new Response(request.method === "HEAD" ? null : file, {
      headers: { "Content-Type": file.type },
    });
  }
  return new Response("Not found", { status: 404 });
}

if (import.meta.main) {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      port: { type: "string", default: "4173" },
      host: { type: "string", default: "0.0.0.0" },
    },
  });
  const server = Bun.serve({
    hostname: values.host,
    port: Number(values.port),
    fetch: (request) =>
      serveBuild(
        request,
        new URL("../build/client/", import.meta.url).pathname,
      ),
  });
  console.log(`Static preview listening on ${server.url}`);
}
