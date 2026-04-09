import assert from "node:assert/strict";
import test from "node:test";

import { createAppController } from "./controller.js";
import { readRouteState } from "./routes.js";

function installFakeBrowser(initialHref = "http://127.0.0.1:4173/"): {
  restore: () => void;
  storage: Map<string, string>;
} {
  const originalWindow = globalThis.window;
  const originalLocalStorage = globalThis.localStorage;
  const storage = new Map<string, string>();

  const fakeWindow = {
    location: {
      href: initialHref
    },
    history: {
      replaceState: () => undefined
    },
    setTimeout: globalThis.setTimeout.bind(globalThis),
    clearTimeout: globalThis.clearTimeout.bind(globalThis),
    clearInterval: globalThis.clearInterval.bind(globalThis)
  } as unknown as Window & typeof globalThis;

  const fakeLocalStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    }
  } as Storage;

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: fakeWindow
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    writable: true,
    value: fakeLocalStorage
  });

  return {
    storage,
    restore: () => {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        writable: true,
        value: originalWindow
      });
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        writable: true,
        value: originalLocalStorage
      });
    }
  };
}

test("controller reads room state only from the game route", async () => {
  const browser = installFakeBrowser(
    "http://127.0.0.1:4173/game/play?host=alpha&room=room-a&seed=first"
  );

  const controller = createAppController({
    initialSearch: "?host=alpha&room=room-a&seed=first",
    initialRouteState: readRouteState(
      "/game/play",
      "?host=alpha&room=room-a&seed=first",
      "/game/"
    )
  });

  assert.equal(controller.state.joinHostId, "alpha");
  assert.equal(controller.state.joinRoomId, "room-a");
  assert.equal(controller.state.seedInput, "first");

  await controller.syncRoute(
    readRouteState("/game/", "?seed=second", "/game/")
  );

  assert.equal(controller.state.joinHostId, "");
  assert.equal(controller.state.joinRoomId, "");
  assert.equal(controller.state.seedInput, "second");
  assert.equal(controller.state.guest.status, "");

  browser.restore();
});

test("controller ignores room state on the landing route", () => {
  const browser = installFakeBrowser(
    "http://127.0.0.1:4173/game/?host=alpha&room=room-a&seed=first"
  );

  const controller = createAppController({
    initialSearch: "?host=alpha&room=room-a&seed=first",
    initialRouteState: readRouteState(
      "/game/",
      "?host=alpha&room=room-a&seed=first",
      "/game/"
    )
  });

  assert.equal(controller.state.joinHostId, "");
  assert.equal(controller.state.joinRoomId, "");
  assert.equal(controller.state.seedInput, "first");

  browser.restore();
});

test("memory controllers neither restore nor persist local storage state", async () => {
  const browser = installFakeBrowser("http://127.0.0.1:4173/dev/singleplayer");
  browser.storage.set(
    "cards-against-developers.identity.v1.dev-grid.host",
    JSON.stringify({
      lastUsername: "Stored Host",
      rooms: {
        "room-stored": {
          roomId: "room-stored",
          playerId: "player-stored",
          reconnectToken: "token-stored"
        }
      }
    })
  );
  const storedSnapshot = JSON.stringify({
    roomId: "room-stored",
    roomName: "Stored room",
    peerId: "host-stored",
    selfPlayerId: "player-stored",
    seed: "stored-seed",
    state: {
      players: [],
      started: false,
      phase: "lobby",
      round: 0
    }
  });
  browser.storage.set(
    "cards-against-developers.host.v1.dev-grid.host",
    storedSnapshot
  );

  const controller = createAppController({
    transportMode: "memory",
    profileName: "dev-grid.host"
  });

  assert.equal(controller.state.identity.lastUsername, "");
  assert.deepEqual(controller.state.identity.rooms, {});
  assert.equal(controller.state.host, null);

  controller.updateUsername("Host");
  await controller.createHost();

  const host = controller.state.host as { roomId: string } | null;
  assert.ok(host);
  assert.ok(host.roomId.length > 0);
  assert.equal(
    browser.storage.get("cards-against-developers.host.v1.dev-grid.host"),
    storedSnapshot
  );
  assert.equal(
    browser.storage.get("cards-against-developers.identity.v1.dev-grid.host"),
    JSON.stringify({
      lastUsername: "Stored Host",
      rooms: {
        "room-stored": {
          roomId: "room-stored",
          playerId: "player-stored",
          reconnectToken: "token-stored"
        }
      }
    })
  );

  browser.restore();
});
