import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const portFlag = process.argv.find((argument) =>
  argument.startsWith("--port=")
);
const rootFlag = process.argv.find((argument) =>
  argument.startsWith("--root=")
);
const port = Number(portFlag?.split("=")[1] ?? process.env.PORT ?? "4173");
const rootDir = resolve(rootFlag?.split("=")[1] ?? ".");
const basePath = normalizeBasePath(process.env.APP_BASE_URL ?? "/");

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

function normalizeBasePath(baseUrl: string): string {
  const normalized = `/${baseUrl}`.replace(/\/{2,}/g, "/").replace(/\/+$/, "");
  return normalized || "/";
}

function stripBasePath(
  pathname: string,
  activeBasePath: string
): string | null {
  if (activeBasePath === "/") {
    return pathname;
  }

  if (pathname === activeBasePath) {
    return "/";
  }

  if (pathname.startsWith(`${activeBasePath}/`)) {
    return pathname.slice(activeBasePath.length) || "/";
  }

  return null;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(
      request.url ?? "/",
      `http://${request.headers.host ?? "127.0.0.1"}`
    );
    const pathname = decodeURIComponent(url.pathname);
    const appPath = stripBasePath(pathname, basePath);

    if (!appPath) {
      response.writeHead(404).end("Not found");
      return;
    }

    const relativePath = normalize(
      appPath === "/" ? "/index.html" : appPath
    ).replace(/^\/+/, "");
    let filePath = join(rootDir, relativePath);

    if (!filePath.startsWith(rootDir)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    let fileStat = await stat(filePath).catch(() => null);
    if (fileStat?.isDirectory()) {
      filePath = join(filePath, "index.html");
      fileStat = await stat(filePath).catch(() => null);
    }

    if (!fileStat) {
      const notFoundPath = join(rootDir, "404.html");
      const notFoundStat = await stat(notFoundPath).catch(() => null);
      if (!notFoundStat || notFoundStat.isDirectory()) {
        response.writeHead(404).end("Not found");
        return;
      }

      const body = await readFile(notFoundPath);
      response.writeHead(404, {
        "content-type": "text/html; charset=utf-8"
      });
      response.end(body);
      return;
    }

    if (fileStat.isDirectory()) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, {
      "content-type":
        contentTypes[extname(filePath)] ?? "application/octet-stream"
    });
    response.end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static server listening on http://127.0.0.1:${port}`);
});
