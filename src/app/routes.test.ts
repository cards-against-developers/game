import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAppGamePath,
  buildAppHostGamePath,
  buildPublicGamePath,
  buildPublicHostGamePath,
  readRouteState,
  stripBasePath,
  withBasePath
} from "./routes.js";

test("withBasePath prefixes non-root routes and normalizes duplicate slashes", () => {
  assert.equal(withBasePath("/play", "/game/"), "/game/play");
});

test("stripBasePath removes the deployment base from app routes", () => {
  assert.equal(stripBasePath("/game/play/", "/game/"), "/play");
  assert.equal(stripBasePath("/game/", "/game/"), "/");
});

test("readRouteState extracts room state only from the game route", () => {
  assert.deepEqual(
    readRouteState(
      "/game/play/",
      "?host=alpha&room=room-a&seed=first",
      "/game/"
    ),
    {
      appPath: "/play",
      isGameRoute: true,
      hostId: "alpha",
      roomId: "room-a",
      seed: "first"
    }
  );
});

test("readRouteState ignores room state on the landing route", () => {
  assert.deepEqual(
    readRouteState("/game/", "?host=alpha&room=room-a&seed=first", "/game/"),
    {
      appPath: "/",
      isGameRoute: false,
      hostId: "",
      roomId: "",
      seed: "first"
    }
  );
});

test("app game path produces a canonical app route", () => {
  assert.equal(
    buildAppGamePath("?host=alpha&room=room-a"),
    "/play?host=alpha&room=room-a"
  );
});

test("public game path includes the deployment base", () => {
  assert.equal(
    buildPublicGamePath("?host=alpha&room=room-a", "/game/"),
    "/game/play?host=alpha&room=room-a"
  );
});

test("app host game path produces a canonical app route with room params", () => {
  assert.equal(
    buildAppHostGamePath("", "host-1", "room-1"),
    "/play?host=host-1&room=room-1"
  );
});

test("public host game path includes the deployment base and room params", () => {
  assert.equal(
    buildPublicHostGamePath("", "host-1", "room-1", "/game/"),
    "/game/play?host=host-1&room=room-1"
  );
});
