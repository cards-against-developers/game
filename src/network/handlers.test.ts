import assert from "node:assert/strict";
import test from "node:test";

import type { AppState } from "../app/state.js";
import { encodeJson } from "../utils/codec.js";
import type { NetworkContext } from "./context.js";
import { handleGuestMessage } from "./handlers.js";

function createState(): AppState {
  return {
    identity: {
      lastUsername: "",
      rooms: {}
    },
    nowTick: Date.now(),
    usernameInput: "Developer 123",
    seedInput: "seed",
    joinHostId: "",
    joinRoomId: "",
    host: null,
    guest: {
      sessionId: "guest-session-1",
      transportHandle: null,
      channel: null,
      roomId: "room-1",
      roomName: "Room One",
      status: "Idle",
      sync: null,
      recoveryCode: ""
    },
    selectedCardIds: ["white-1", "white-2"],
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
    trimSelectionsToHand: (hand) => {
      state.selectedCardIds = state.selectedCardIds.filter((cardId) =>
        hand.includes(cardId)
      );
    },
    currentSync: () => {
      throw new Error("currentSync should not be called in this test.");
    },
    setFlash: () => undefined,
    armWinnerPickLockout: () => undefined,
    clearWinnerPickLockout: () => undefined
  };
}

test("handleGuestMessage stores welcome recovery data", () => {
  const state = createState();
  const context = createContext(state);
  const recoveryCode = encodeJson({
    roomId: "room-1",
    playerId: "player-1",
    reconnectToken: "token-1"
  });

  handleGuestMessage(
    {
      type: "welcome",
      roomId: "room-1",
      playerId: "player-1",
      reconnectToken: "token-1",
      recoveryCode
    },
    context
  );

  assert.equal(state.guest.status, "Connected to host.");
  assert.equal(state.guest.recoveryCode, recoveryCode);
  assert.equal(state.identity.rooms["room-1"]?.playerId, "player-1");
  assert.equal(state.identity.lastUsername, "Developer 123");
});

test("handleGuestMessage sync updates guest sync and trims selected cards", () => {
  const state = createState();
  state.identity.rooms["room-1"] = {
    roomId: "room-1",
    playerId: "player-1",
    reconnectToken: "token-1"
  };
  state.guest.sync = {
    roomId: "room-1",
    roomName: "Room One",
    started: true,
    phase: "submitting",
    round: 1,
    submissionSecondsLeft: 31,
    announcement: "Raise a card.",
    blackCardId: "black-1",
    blackPick: 1,
    judgeId: "player-2",
    lastWinnerId: null,
    players: [],
    submissions: [],
    hand: ["white-1", "white-2"],
    selfPlayerId: "player-1",
    canSubmit: true,
    canJudge: false
  };
  const context = createContext(state);

  handleGuestMessage(
    {
      type: "sync",
      payload: {
        roomId: "room-1",
        roomName: "Room One",
        started: true,
        phase: "submitting",
        round: 1,
        submissionSecondsLeft: 30,
        announcement: "Choose a card.",
        blackCardId: "black-1",
        blackPick: 1,
        judgeId: "player-2",
        lastWinnerId: null,
        players: [],
        submissions: [],
        hand: ["white-2", "white-3"],
        selfPlayerId: "player-1",
        canSubmit: true,
        canJudge: false
      }
    },
    context
  );

  assert.deepEqual(state.guest.sync?.hand, ["white-2", "white-3"]);
  assert.deepEqual(state.selectedCardIds, ["white-2"]);
});

test("handleGuestMessage keeps accepted submitted cards pending until the next round", () => {
  const state = createState();
  state.pendingSubmittedCards = [
    {
      id: "white-1",
      text: "First card",
      handIndex: 0
    }
  ];
  state.guest.sync = {
    roomId: "room-1",
    roomName: "Room One",
    started: true,
    phase: "submitting",
    round: 1,
    submissionSecondsLeft: 31,
    announcement: "Raise a card.",
    blackCardId: "black-1",
    blackPick: 1,
    judgeId: "player-2",
    lastWinnerId: null,
    players: [],
    submissions: [],
    hand: ["white-1", "white-2"],
    selfPlayerId: "player-1",
    canSubmit: true,
    canJudge: false
  };
  const context = createContext(state);

  handleGuestMessage(
    {
      type: "sync",
      payload: {
        roomId: "room-1",
        roomName: "Room One",
        started: true,
        phase: "submitting",
        round: 1,
        submissionSecondsLeft: 30,
        announcement: "1 submission remaining.",
        blackCardId: "black-1",
        blackPick: 1,
        judgeId: "player-2",
        lastWinnerId: null,
        players: [],
        submissions: [],
        hand: ["white-1", "white-2"],
        handCards: [
          { id: "white-1", text: "First card" },
          { id: "white-2", text: "Second card" }
        ],
        selfPlayerId: "player-1",
        canSubmit: false,
        canJudge: false
      }
    },
    context
  );

  assert.deepEqual(state.pendingSubmittedCards, [
    {
      id: "white-1",
      text: "First card",
      handIndex: 0
    }
  ]);
  assert.deepEqual(state.localHandOverride, [
    { id: "white-2", text: "Second card" }
  ]);
});

test("handleGuestMessage clears raised cards when the round leaves submitting", () => {
  const state = createState();
  state.guest.sync = {
    roomId: "room-1",
    roomName: "Room One",
    started: true,
    phase: "submitting",
    round: 1,
    submissionSecondsLeft: 3,
    announcement: "Raise a card.",
    blackCardId: "black-1",
    blackPick: 1,
    judgeId: "player-2",
    lastWinnerId: null,
    players: [],
    submissions: [],
    hand: ["white-1", "white-2"],
    selfPlayerId: "player-1",
    canSubmit: true,
    canJudge: false
  };
  const context = createContext(state);

  handleGuestMessage(
    {
      type: "sync",
      payload: {
        roomId: "room-1",
        roomName: "Room One",
        started: true,
        phase: "judging",
        round: 1,
        submissionSecondsLeft: null,
        announcement: "Judge, pick the winner.",
        blackCardId: "black-1",
        blackPick: 1,
        judgeId: "player-2",
        lastWinnerId: null,
        players: [],
        submissions: [],
        hand: ["white-1", "white-2"],
        selfPlayerId: "player-1",
        canSubmit: false,
        canJudge: false
      }
    },
    context
  );

  assert.deepEqual(state.selectedCardIds, []);
});

test("handleGuestMessage arms the winner lockout when a guest judge enters result", () => {
  const state = createState();
  state.guest.sync = {
    roomId: "room-1",
    roomName: "Room One",
    started: true,
    phase: "submitting",
    round: 2,
    submissionSecondsLeft: 1,
    announcement: "Waiting for submissions.",
    blackCardId: "black-1",
    blackPick: 1,
    judgeId: "player-1",
    lastWinnerId: null,
    players: [],
    submissions: [],
    hand: ["white-1", "white-2"],
    selfPlayerId: "player-1",
    canSubmit: false,
    canJudge: false
  };
  let armed = 0;
  const context: NetworkContext = {
    ...createContext(state),
    armWinnerPickLockout: () => {
      armed += 1;
    }
  };

  handleGuestMessage(
    {
      type: "sync",
      payload: {
        roomId: "room-1",
        roomName: "Room One",
        started: true,
        phase: "result",
        round: 2,
        submissionSecondsLeft: null,
        announcement: "Pick the winner.",
        blackCardId: "black-1",
        blackPick: 1,
        judgeId: "player-1",
        lastWinnerId: null,
        players: [],
        submissions: [
          {
            id: "submission-1",
            cardIds: ["white-3"],
            hidden: false,
            winner: false
          }
        ],
        hand: ["white-1", "white-2"],
        selfPlayerId: "player-1",
        canSubmit: false,
        canJudge: false,
        canPickWinner: true
      }
    },
    context
  );

  assert.equal(armed, 1);
});

test("handleGuestMessage error updates the guest status", () => {
  const state = createState();
  const context = createContext(state);

  handleGuestMessage(
    {
      type: "error",
      message: "Reconnect token mismatch."
    },
    context
  );

  assert.equal(state.guest.status, "Reconnect token mismatch.");
});

test("handleGuestMessage terminal error blocks automatic reconnect", () => {
  const state = createState();
  const context = createContext(state);

  handleGuestMessage(
    {
      type: "error",
      message: "This game is now active in another tab.",
      canReconnect: false
    },
    context
  );

  assert.equal(state.guest.status, "This game is now active in another tab.");
  assert.equal(state.guest.reconnectBlocked, true);
});

test("handleGuestMessage ignores stale channel messages", () => {
  const state = createState();
  const activeChannel = {
    close: () => undefined
  } as AppState["guest"]["channel"];
  const staleChannel = {
    close: () => undefined
  } as AppState["guest"]["channel"];
  state.guest.channel = activeChannel;
  const context = createContext(state);

  handleGuestMessage(
    {
      type: "error",
      message: "This game is now active in another tab.",
      canReconnect: false
    },
    context,
    staleChannel
  );

  assert.equal(state.guest.status, "Idle");
  assert.equal(state.guest.reconnectBlocked, undefined);
});
