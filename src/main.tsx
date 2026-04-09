import { createEffect, onCleanup, type JSX } from "solid-js";
import { render } from "solid-js/web";
import {
  Route,
  Router,
  useLocation,
  useNavigate,
  useSearchParams
} from "@solidjs/router";

import {
  buildPublicGamePath,
  buildPublicHostGamePath,
  readRouteState,
  withBasePath
} from "./app/routes.js";
import { createAppController } from "./app/controller.js";
import { appBuildCommit, appBuildTimestamp } from "./build.js";
import { GUEST_CONNECT_TIMEOUT_MESSAGE } from "./network/messages.js";
import { App } from "./ui/App.js";
import { BoardSlotsLabApp } from "./ui/BoardSlotsLabApp.js";
import { CardAnimationsLabApp } from "./ui/CardAnimationsLabApp.js";
import { DevGridApp } from "./ui/DevGridApp.js";
import { LandingPage } from "./ui/LandingPage.js";
import { LandingStatusLabApp } from "./ui/LandingStatusLabApp.js";
import { Masthead } from "./ui/Masthead.js";
import { NotFoundPage } from "./ui/NotFoundPage.js";
import type { AppController } from "./app/controller.js";

const rootElement = document.querySelector<HTMLDivElement>("#app");

if (!rootElement) {
  throw new Error("Expected #app root element.");
}

type DebugWindow = typeof globalThis & {
  __cardsAgainstDevelopersController?: AppController;
};

const initialUrl = new URL(window.location.href);
const initialRouteState = readRouteState(
  initialUrl.pathname,
  initialUrl.search,
  import.meta.env.BASE_URL
);

replaceCanonicalUrl(initialUrl, initialRouteState.appPath);

const controller = createAppController({
  initialSearch: initialUrl.search,
  initialRouteState
});
const debugEnabled = initialUrl.searchParams.get("debug") === "1";

if (debugEnabled) {
  (globalThis as DebugWindow).__cardsAgainstDevelopersController = controller;
}

setBuildMetadata();

render(
  () => (
    <Router base={import.meta.env.BASE_URL}>
      <Route path="/" component={LandingRoute} />
      <Route path="/play" component={GameRoute} />
      <Route path="/dev/singleplayer" component={DevGridApp} />
      <Route path="/dev/board-slots" component={BoardSlotsLabRoute} />
      <Route path="/dev/landing-status" component={LandingStatusLabRoute} />
      <Route path="/dev/card-animations" component={CardAnimationsLabRoute} />
      <Route
        path="*404"
        component={() => (
          <NotFoundPage
            landingHref={withBasePath("/", import.meta.env.BASE_URL)}
          />
        )}
      />
    </Router>
  ),
  rootElement
);

function LandingRoute(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = () =>
    readRouteState(
      location.pathname,
      location.search,
      import.meta.env.BASE_URL
    );
  const shouldRedirectToGame = () =>
    Boolean(controller.state.guest.channel) && !routeState().isGameRoute;

  createEffect(() => {
    const nextRouteState = routeState();
    void controller.syncRoute(nextRouteState);
  });

  createEffect(() => {
    if (shouldRedirectToGame()) {
      void navigate(
        buildPublicGamePath(location.search, import.meta.env.BASE_URL),
        {
          replace: true,
          resolve: false
        }
      );
    }
  });

  const navigateToGame = (path: string): void => {
    void navigate(path, {
      resolve: false
    });
  };

  const handleCreateHost = async () => {
    await controller.createHost();
    if (!hasActiveSession()) {
      return;
    }

    navigateToGame(
      buildPublicHostGamePath(
        location.search,
        controller.state.host?.peerId ?? "",
        controller.state.host?.roomId ?? "",
        controller.state.host?.seed ?? controller.state.seedInput,
        import.meta.env.BASE_URL
      )
    );
  };

  const handleJoinHost = async () => {
    await controller.prepareGuestAnswer();
    if (!hasActiveSession()) {
      return;
    }

    navigateToGame(
      buildPublicGamePath(location.search, import.meta.env.BASE_URL)
    );
  };

  return (
    <main class="shell">
      <Masthead />
      <LandingPage
        usernameInput={controller.state.usernameInput}
        hasJoinHost={controller.state.joinHostId.trim().length > 0}
        status={controller.state.guest.status || controller.state.flash}
        onUsernameInput={controller.updateUsername}
        onCreateHost={handleCreateHost}
        onJoinHost={handleJoinHost}
      />
    </main>
  );
}

function GameRoute(): JSX.Element {
  const location = useLocation();
  const routeState = () =>
    readRouteState(
      location.pathname,
      location.search,
      import.meta.env.BASE_URL
    );

  createEffect(() => {
    const nextRouteState = routeState();
    void controller.syncRoute(nextRouteState);
  });

  onCleanup(() => {
    controller.leaveSession();
  });

  return <App controller={controller} />;
}

function BoardSlotsLabRoute(): JSX.Element {
  const [searchParams] = useSearchParams();
  const countValue = Number.parseInt(
    firstSearchParam(searchParams.count) ?? "1",
    10
  );

  return (
    <BoardSlotsLabApp count={Number.isFinite(countValue) ? countValue : 1} />
  );
}

function LandingStatusLabRoute(): JSX.Element {
  const [searchParams] = useSearchParams();
  const status =
    firstSearchParam(searchParams.status) ?? GUEST_CONNECT_TIMEOUT_MESSAGE;

  return <LandingStatusLabApp status={status} />;
}

function CardAnimationsLabRoute(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const countdownValue = Number.parseInt(
    firstSearchParam(searchParams.countdown) ?? "",
    10
  );
  const countdownSeconds =
    Number.isFinite(countdownValue) && countdownValue > 0
      ? countdownValue
      : null;

  return (
    <CardAnimationsLabApp
      initialStage={firstSearchParam(searchParams.stage) ?? null}
      countdownSeconds={countdownSeconds}
      onStageChange={(stage) => setSearchParams({ stage })}
    />
  );
}

function firstSearchParam(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function hasActiveSession(): boolean {
  return Boolean(controller.state.host || controller.state.guest.channel);
}

function setBuildMetadata(): void {
  const ensureMetaTag = (name: string, content: string): void => {
    let meta = document.head.querySelector<HTMLMetaElement>(
      `meta[name="${name}"]`
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = name;
      document.head.append(meta);
    }
    meta.content = content;
  };

  ensureMetaTag("build-commit", appBuildCommit);
  ensureMetaTag("build-timestamp", appBuildTimestamp);
}

function replaceCanonicalUrl(url: URL, appPath: string): void {
  const canonicalPath = withBasePath(appPath, import.meta.env.BASE_URL);
  if (url.pathname === canonicalPath) {
    return;
  }

  url.pathname = canonicalPath;
  window.history.replaceState({}, "", url.toString());
}
