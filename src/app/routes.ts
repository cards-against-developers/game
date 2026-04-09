export function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function normalizeBasePath(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "") || "/";
}

export function normalizeAppPath(pathname: string): string {
  const normalized = normalizePath(pathname);
  return normalized.endsWith("/index.html")
    ? normalized.replace(/\/index\.html$/, "") || "/"
    : normalized;
}

export function stripBasePath(pathname: string, baseUrl: string): string {
  const normalizedPath = normalizeAppPath(pathname);
  const normalizedBasePath = normalizeBasePath(baseUrl);

  if (normalizedBasePath === "/") {
    return normalizedPath;
  }

  if (normalizedPath === normalizedBasePath) {
    return "/";
  }

  if (normalizedPath.startsWith(`${normalizedBasePath}/`)) {
    return normalizedPath.slice(normalizedBasePath.length) || "/";
  }

  return normalizedPath;
}

export type AppRouteState = {
  hostId: string;
  roomId: string;
  seed: string | null;
  appPath: string;
  isGameRoute: boolean;
};

export function withBasePath(pathname: string, basePath: string): string {
  const normalizedBasePath = normalizeBasePath(basePath);
  if (pathname === "/") {
    return normalizedBasePath;
  }

  return `${normalizedBasePath}${pathname}`.replace(/\/{2,}/g, "/");
}

export function readRouteState(
  pathname: string,
  search: string,
  baseUrl: string
): AppRouteState {
  const appPath = stripBasePath(pathname, baseUrl);
  const isGameRoute = appPath === "/play";
  const params = new URLSearchParams(search);

  return {
    appPath,
    isGameRoute,
    hostId: isGameRoute ? (params.get("host") ?? "") : "",
    roomId: isGameRoute ? (params.get("room") ?? "") : "",
    seed: params.get("seed")
  };
}

export function buildAppGamePath(search: string): string {
  return `/play${search}`;
}

export function buildAppHostGamePath(
  search: string,
  hostId: string,
  roomId: string,
  seed?: string | null
): string {
  const url = new URL(`http://app.local/${search.replace(/^\?/, "?")}`);
  url.pathname = "/play";
  url.searchParams.set("host", hostId);
  url.searchParams.set("room", roomId);
  if (seed) {
    url.searchParams.set("seed", seed);
  }
  return `${url.pathname}${url.search}`;
}

export function buildPublicGamePath(search: string, basePath: string): string {
  return withBasePath(buildAppGamePath(search), basePath);
}

export function buildPublicHostGamePath(
  search: string,
  hostId: string,
  roomId: string,
  seedOrBasePath: string,
  maybeBasePath?: string
): string {
  const seed = maybeBasePath ? seedOrBasePath : null;
  const basePath = maybeBasePath ?? seedOrBasePath;
  return withBasePath(
    buildAppHostGamePath(search, hostId, roomId, seed),
    basePath
  );
}
