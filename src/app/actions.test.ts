import assert from "node:assert/strict";
import test from "node:test";

import { blackCards, whiteCards } from "../cards/index.js";
import type { NetworkContext } from "../network/context.js";
import { disposeHostTransport } from "../network/host.js";
import type { ChannelLike } from "../network/transport.js";
import type { SyncView } from "../types.js";
import { decodeJson } from "../utils/codec.js";
import { createActionHandler } from "./actions.js";
import { createInitialAppState, type AppState } from "./state.js";

function installFakeWindow(): () => void {
  const originalWindow = globalThis.window;
  const fakeWindow = {
    location: {
      href: "http://127.0.0.1:4173/?transport=loopback"
    },
    history: {
      replaceState: (
        _state: unknown,
        _unused: string,
        url?: string | URL | null
      ) => {
        if (typeof url === "string") {
          fakeWindow.location.href = url;
        } else if (url instanceof URL) {
          fakeWindow.location.href = url.toString();
        }
      }
    },
    setTimeout: globalThis.setTimeout.bind(globalThis),
    clearTimeout: globalThis.clearTimeout.bind(globalThis)
  } as unknown as Window & typeof globalThis;

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: fakeWindow
  });

  return () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: originalWindow
    });
  };
}

function createState(): AppState {
  const state = createInitialAppState({
    lastUsername: "",
    rooms: {}
  });
  state.usernameInput = "Developer 123";
  state.guest.status = "Idle";
  return state;
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
    trimSelectionsToHand: (hand) => {
      state.selectedCardIds = state.selectedCardIds.filter((cardId) =>
        hand.includes(cardId)
      );
    },
    currentSync: () =>
      state.guest.sync ??
      ({
        roomId: "",
        roomName: "",
        started: false,
        phase: "lobby",
        round: 0,
        submissionSecondsLeft: null,
        announcement: "",
        blackCardId: null,
        blackPick: 1,
        judgeId: null,
        lastWinnerId: null,
        players: [],
        submissions: [],
        hand: [],
        selfPlayerId: "",
        canSubmit: false,
        canJudge: false,
        canPickWinner: false
      } satisfies SyncView),
    setFlash: () => undefined,
    armWinnerPickLockout: () => undefined,
    clearWinnerPickLockout: () => undefined
  };
}

function createMemoryContext(state: AppState): NetworkContext {
  return {
    ...createContext(state),
    transportMode: "memory"
  };
}

function createGuestChannel(sent: unknown[]): ChannelLike {
  return {
    readyState: "open",
    send(data: string) {
      sent.push(decodeJson(data));
    },
    close() {
      return undefined;
    }
  } as unknown as ChannelLike;
}

function cleanupHostedState(state: AppState): void {
  if (!state.host) {
    return;
  }

  disposeHostTransport(state.host);
  if (state.host.roundTimerIntervalId) {
    clearInterval(state.host.roundTimerIntervalId);
    state.host.roundTimerIntervalId = null;
  }
}

test("createHost sanitizes the seed and clears the local selection", async () => {
  const restoreWindow = installFakeWindow();
  const state = createState();
  state.usernameInput = "  Alice   Dev  ";
  state.seedInput = "   custom   seed   ";
  state.selectedCardIds = ["white-1", "white-2"];

  const flashes: string[] = [];
  const actions = createActionHandler({
    state,
    storageKey: "test-key",
    networkContext: createContext(state),
    saveIdentity: (_storageKey, identity) => {
      state.identity = structuredClone(identity);
    },
    setFlash: (message) => flashes.push(message)
  });

  await actions.createHost();

  assert.equal(state.host?.seed, "custom seed");
  assert.equal(state.seedInput, "custom seed");
  assert.deepEqual(state.selectedCardIds, []);
  assert.equal(state.host?.roomName, "Alice Dev's table");
  assert.equal(state.identity.lastUsername, "Alice Dev");
  assert.equal(flashes.at(-1), "Local host created.");
  cleanupHostedState(state);
  restoreWindow();
});

test("createHost updates the host share URL", async () => {
  const restoreWindow = installFakeWindow();
  const state = createState();
  const actions = createActionHandler({
    state,
    storageKey: "test-key",
    networkContext: createContext(state),
    saveIdentity: () => undefined,
    setFlash: () => undefined
  });

  await actions.createHost();

  const currentUrl = new URL(window.location.href);
  assert.ok(currentUrl.searchParams.get("host"));
  assert.equal(currentUrl.searchParams.get("room"), state.host?.roomId ?? null);
  cleanupHostedState(state);
  restoreWindow();
});

test("startHostedGame refuses to start with fewer than three players", async () => {
  const restoreWindow = installFakeWindow();
  const state = createState();
  const actions = createActionHandler({
    state,
    storageKey: "test-key",
    networkContext: createContext(state),
    saveIdentity: () => undefined,
    setFlash: (message) => {
      state.flash = message;
    }
  });

  await actions.createHost();
  await actions.startHostedGame();

  assert.equal(state.host?.state.started, false);
  assert.equal(state.flash, "You need at least three players to start.");
  cleanupHostedState(state);
  restoreWindow();
});

test("createHost refuses usernames shorter than three characters", async () => {
  const restoreWindow = installFakeWindow();
  const state = createState();
  state.usernameInput = "Al";

  const actions = createActionHandler({
    state,
    storageKey: "test-key",
    networkContext: createContext(state),
    saveIdentity: () => undefined,
    setFlash: (message) => {
      state.flash = message;
    }
  });

  await actions.createHost();

  assert.equal(state.host, null);
  assert.equal(state.guest.status, "Username must be at least 3 characters.");
  assert.equal(state.flash, "Username must be at least 3 characters.");
  restoreWindow();
});

test("createHost rolls back local host state when transport startup fails", async () => {
  const restoreWindow = installFakeWindow();
  const state = createState();
  const actions = createActionHandler({
    state,
    storageKey: "test-key",
    networkContext: createMemoryContext(state),
    saveIdentity: () => undefined,
    setFlash: (message) => {
      state.flash = message;
    }
  });

  await actions.createHost();

  assert.equal(state.host, null);
  assert.equal(state.guest.status, "Missing in-memory transport hub.");
  assert.equal(state.flash, "Missing in-memory transport hub.");
  restoreWindow();
});

test("prepareGuestAnswer refuses usernames shorter than three characters", async () => {
  const state = createState();
  state.usernameInput = "Bo";

  const actions = createActionHandler({
    state,
    storageKey: "test-key",
    networkContext: createContext(state),
    saveIdentity: () => undefined,
    setFlash: (message) => {
      state.flash = message;
    }
  });

  await actions.prepareGuestAnswer();

  assert.equal(state.guest.channel, null);
  assert.equal(state.guest.status, "Username must be at least 3 characters.");
  assert.equal(state.flash, "Username must be at least 3 characters.");
});

test("submitSelection sends guest card choices and clears the local selection", async () => {
  const blackCard = blackCards[0];
  const whiteCard = whiteCards[0];
  if (!blackCard || !whiteCard) {
    throw new Error("Expected bundled cards for action tests.");
  }

  const state = createState();
  const sent: unknown[] = [];
  state.guest.channel = createGuestChannel(sent);
  state.guest.sync = {
    roomId: "room-1",
    roomName: "Room One",
    started: true,
    phase: "submitting",
    round: 1,
    submissionSecondsLeft: 30,
    announcement: "Choose a card.",
    blackCardId: blackCard.id,
    blackPick: blackCard.pick,
    judgeId: "judge-1",
    lastWinnerId: null,
    players: [],
    submissions: [],
    hand: [whiteCard.id],
    selfPlayerId: "player-1",
    canSubmit: true,
    canJudge: false
  };
  state.selectedCardIds = Array.from(
    { length: blackCard.pick },
    () => whiteCard.id
  );

  const actions = createActionHandler({
    state,
    storageKey: "test-key",
    networkContext: createContext(state),
    saveIdentity: () => undefined,
    setFlash: () => undefined
  });

  await actions.submitSelection();

  assert.deepEqual(sent, [
    {
      type: "submit_cards",
      cardIds: Array.from({ length: blackCard.pick }, () => whiteCard.id)
    }
  ]);
  assert.deepEqual(state.selectedCardIds, []);
});

test("toggleCard immediately submits a single guest card", async () => {
  const blackCard = blackCards[0];
  const [whiteCardA, whiteCardB] = whiteCards;
  if (!blackCard || !whiteCardA || !whiteCardB) {
    throw new Error("Expected bundled cards for action tests.");
  }

  const state = createState();
  const sent: unknown[] = [];
  state.guest.channel = createGuestChannel(sent);
  state.guest.sync = {
    roomId: "room-1",
    roomName: "Room One",
    started: true,
    phase: "submitting",
    round: 1,
    submissionSecondsLeft: 30,
    announcement: "Raise a card.",
    blackCardId: blackCard.id,
    blackPick: 1,
    judgeId: "judge-1",
    lastWinnerId: null,
    players: [],
    submissions: [],
    hand: [whiteCardA.id, whiteCardB.id],
    selfPlayerId: "player-1",
    canSubmit: true,
    canJudge: false
  };

  const actions = createActionHandler({
    state,
    storageKey: "test-key",
    networkContext: createContext(state),
    saveIdentity: () => undefined,
    setFlash: () => undefined
  });

  state.guest.sync.handCards = [
    { id: whiteCardA.id, text: whiteCardA.text },
    { id: whiteCardB.id, text: whiteCardB.text }
  ];

  await actions.toggleCard(whiteCardA.id);

  assert.deepEqual(sent, [
    {
      type: "submit_cards",
      cardIds: [whiteCardA.id]
    }
  ]);
  assert.deepEqual(state.selectedCardIds, []);
  assert.deepEqual(state.pendingSubmittedCards, [
    {
      id: whiteCardA.id,
      text: whiteCardA.text,
      handIndex: 0
    }
  ]);
  assert.deepEqual(state.submissionAnimationCards, [
    {
      id: whiteCardA.id,
      text: whiteCardA.text,
      handIndex: 0
    }
  ]);
});

test("toggleCard still ignores clicking the same guest card again in multi-pick rounds", async () => {
  const blackCard = blackCards[0];
  const [whiteCardA, whiteCardB] = whiteCards;
  if (!blackCard || !whiteCardA || !whiteCardB) {
    throw new Error("Expected bundled cards for action tests.");
  }

  const state = createState();
  const sent: unknown[] = [];
  state.guest.channel = createGuestChannel(sent);
  state.guest.sync = {
    roomId: "room-1",
    roomName: "Room One",
    started: true,
    phase: "submitting",
    round: 1,
    submissionSecondsLeft: 30,
    announcement: "Pick your card.",
    blackCardId: blackCard.id,
    blackPick: 2,
    judgeId: "judge-1",
    lastWinnerId: null,
    players: [],
    submissions: [],
    hand: [whiteCardA.id, whiteCardB.id],
    selfPlayerId: "player-1",
    canSubmit: true,
    canJudge: false,
    selfRaisedCardIds: [whiteCardA.id]
  };

  state.selectedCardIds = [whiteCardA.id];

  const actions = createActionHandler({
    state,
    storageKey: "test-key",
    networkContext: createContext(state),
    saveIdentity: () => undefined,
    setFlash: () => undefined
  });

  await actions.toggleCard(whiteCardA.id);

  assert.deepEqual(sent, []);
  assert.deepEqual(state.selectedCardIds, [whiteCardA.id]);
});

test("pickSubmission sends a reveal message for hidden submissions when acting as a guest", async () => {
  const state = createState();
  const sent: unknown[] = [];
  state.guest.channel = createGuestChannel(sent);
  state.guest.sync = {
    roomId: "room-1",
    roomName: "Room One",
    started: true,
    phase: "judging",
    round: 2,
    submissionSecondsLeft: null,
    announcement: "Judge, pick the winner.",
    blackCardId: blackCards[0]?.id ?? null,
    blackPick: blackCards[0]?.pick ?? 1,
    judgeId: "player-1",
    lastWinnerId: null,
    players: [],
    submissions: [
      {
        id: "submission-9",
        cardIds: ["white-1"],
        hidden: true,
        winner: false
      }
    ],
    hand: [],
    selfPlayerId: "player-1",
    canSubmit: false,
    canJudge: true
  };

  const actions = createActionHandler({
    state,
    storageKey: "test-key",
    networkContext: createContext(state),
    saveIdentity: () => undefined,
    setFlash: () => undefined
  });

  await actions.pickSubmission("submission-9");

  assert.deepEqual(sent, [
    {
      type: "reveal_submission",
      submissionId: "submission-9"
    }
  ]);
});
