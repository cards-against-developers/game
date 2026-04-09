import assert from "node:assert/strict";
import test from "node:test";

import { deckVersion } from "../cards/index.js";
import { decodeJson } from "../utils/codec.js";
import type { AppState } from "../app/state.js";
import type { NetworkContext } from "./context.js";
import { GUEST_CONNECT_TIMEOUT_MS, joinHost } from "./guest.js";

class FakeBroadcastChannel {
  static messages: Array<{ name: string; data: unknown }> = [];
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  postMessage(data: unknown): void {
    FakeBroadcastChannel.messages.push({ name: this.name, data });
  }

  close(): void {
    return;
  }
}

function installFakeBroadcastChannel(): typeof BroadcastChannel {
  const original = globalThis.BroadcastChannel;
  globalThis.BroadcastChannel =
    FakeBroadcastChannel as unknown as typeof BroadcastChannel;
  FakeBroadcastChannel.messages = [];
  return original;
}

function createState(): AppState {
  return {
    identity: {
      lastUsername: "",
      rooms: {}
    },
    nowTick: Date.now(),
    usernameInput: "Developer 123",
    seedInput: "seed",
    joinHostId: "host-1",
    joinRoomId: "room-1",
    host: null,
    guest: {
      sessionId: "guest-session-1",
      transportHandle: null,
      channel: null,
      roomId: null,
      roomName: null,
      status: "Idle",
      sync: null,
      recoveryCode: ""
    },
    selectedCardIds: [],
    recoveryImportInput: "",
    flash: "",
    winnerPickBlocked: false
  };
}

function createContext(state: AppState): NetworkContext {
  return {
    state,
    transportMode: "loopback",
    memoryTransportHub: null,
    hostCountdownMs: null,
    rtcConfig: {},
    currentUsername: () => state.usernameInput,
    getRecoveryBundle: (roomId) =>
      roomId ? (state.identity.rooms[roomId] ?? null) : null,
    persistIdentity: () => undefined,
    persistHostState: () => undefined,
    trimSelectionsToHand: () => undefined,
    currentSync: () => {
      throw new Error("currentSync should not be called in guest tests.");
    },
    setFlash: () => undefined,
    armWinnerPickLockout: () => undefined,
    clearWinnerPickLockout: () => undefined
  };
}

test("joinHost populates loopback room fields and waits for the channel", async () => {
  const state = createState();

  const original = installFakeBroadcastChannel();
  try {
    await joinHost(state.joinHostId, createContext(state));
  } finally {
    globalThis.BroadcastChannel = original;
  }

  assert.equal(state.guest.roomId, "room-1");
  assert.equal(state.guest.roomName, null);
  assert.match(state.guest.status, /Connecting to host/);
});

test("guest loopback channel sends hello using the recovery bundle identity", async () => {
  const state = createState();
  state.identity.rooms["room-1"] = {
    roomId: "room-1",
    playerId: "player-9",
    reconnectToken: "token-9"
  };

  const original = installFakeBroadcastChannel();
  try {
    await joinHost(state.joinHostId, createContext(state));
    const channel = state.guest.channel;
    if (!channel) {
      throw new Error("Expected guest channel.");
    }
    (channel as { readyState: string }).readyState = "open";
    (
      channel.onopen as
        | ((this: unknown, event: Event) => void)
        | null
        | undefined
    )?.call(channel, new Event("open"));
  } finally {
    globalThis.BroadcastChannel = original;
  }

  const helloEnvelope = FakeBroadcastChannel.messages.find(
    (entry) =>
      typeof entry.data === "object" &&
      entry.data !== null &&
      "type" in (entry.data as Record<string, unknown>) &&
      (entry.data as { type?: string }).type === "message"
  );
  if (!helloEnvelope) {
    throw new Error("Expected loopback hello message.");
  }
  const hello = decodeJson<{
    type: string;
    roomId: string;
    username: string;
    playerId: string;
    reconnectToken: string;
    sessionId: string;
    takeover?: boolean;
    deckVersion: string;
  }>((helloEnvelope.data as { data: string }).data);

  assert.deepEqual(hello, {
    type: "hello",
    roomId: "room-1",
    username: "Developer 123",
    playerId: "player-9",
    reconnectToken: "token-9",
    sessionId: "guest-session-1",
    takeover: false,
    deckVersion
  });
});

test("guest loopback channel close updates the status", async () => {
  const state = createState();
  state.identity.rooms["room-1"] = {
    roomId: "room-1",
    playerId: "player-9",
    reconnectToken: "token-9"
  };

  const original = installFakeBroadcastChannel();
  const originalSetTimeout = globalThis.setTimeout;
  try {
    globalThis.setTimeout = (() => {
      return 1 as unknown as ReturnType<typeof setTimeout>;
    }) as unknown as typeof setTimeout;
    await joinHost(state.joinHostId, createContext(state));
    (
      state.guest.channel?.onclose as
        | ((this: unknown, event: Event) => void)
        | null
        | undefined
    )?.call(state.guest.channel, new Event("close"));
  } finally {
    globalThis.BroadcastChannel = original;
    globalThis.setTimeout = originalSetTimeout;
  }

  assert.equal(state.guest.status, "Connection lost. Reconnecting in 1s…");
  assert.equal(state.guest.reconnectAttemptCount, 1);
});

test("guest join timeout surfaces a network guidance message", async () => {
  const state = createState();
  const originalBroadcastChannel = installFakeBroadcastChannel();
  const originalSetTimeout = globalThis.setTimeout;
  let timeoutCallback: (() => void) | undefined;

  globalThis.setTimeout = ((callback: TimerHandler) => {
    timeoutCallback = () => {
      if (typeof callback === "function") {
        callback();
      }
    };
    return 1 as unknown as ReturnType<typeof setTimeout>;
  }) as unknown as typeof setTimeout;

  try {
    await joinHost(state.joinHostId, createContext(state));
    assert.ok(timeoutCallback);
    timeoutCallback();
  } finally {
    globalThis.BroadcastChannel = originalBroadcastChannel;
    globalThis.setTimeout = originalSetTimeout;
  }

  assert.equal(state.guest.channel, null);
  assert.equal(
    state.guest.status,
    "Could not reach the host. If you are using WARP, a VPN, or a restrictive network, try disabling it or switching networks."
  );
  assert.equal(GUEST_CONNECT_TIMEOUT_MS, 10_000);
});
