import assert from "node:assert/strict";
import test from "node:test";

import { blackCards, whiteCards } from "../cards/index.js";
import { buildSyncView } from "../game/sync.js";
import type { HostRuntime } from "../host/runtime.js";
import type { HostGameState, StoredIdentity, SyncView } from "../types.js";
import {
  currentBlackCard,
  currentHandCards,
  currentPlayer,
  currentSync
} from "./selectors.js";
import type { AppState } from "./state.js";

function createIdentity(): StoredIdentity {
  return {
    lastUsername: "",
    rooms: {}
  };
}

function createHostState(): HostGameState {
  const [hostCardA, hostCardB, guestCardA, guestCardB] = whiteCards;
  const [blackCard] = blackCards;

  if (!hostCardA || !hostCardB || !guestCardA || !guestCardB || !blackCard) {
    throw new Error(
      "Expected bundled cards to be available in selectors tests."
    );
  }

  return {
    seed: "seed",
    randomState: 1,
    countdownMs: 30_000,
    started: true,
    phase: "submitting",
    round: 2,
    submissionDeadlineAt: null,
    winnerSelectionClosed: false,
    announcement: "Choose a card.",
    blackCardId: blackCard.id,
    blackPick: blackCard.pick,
    judgeId: "player-2",
    participantIds: ["player-1", "player-2"],
    lastWinnerId: null,
    judgeCursor: 1,
    submissions: [],
    revealedSubmissionIds: [],
    players: [
      {
        id: "player-1",
        username: "Host",
        score: 0,
        reconnectToken: "token-1",
        sessionId: "session-1",
        hand: [hostCardA.id, hostCardB.id],
        raisedCardIds: [],
        connected: true,
        connectionId: null,
        disconnectDeadlineAt: null,
        activeFromRound: 1
      },
      {
        id: "player-2",
        username: "Guest",
        score: 0,
        reconnectToken: "token-2",
        sessionId: "session-2",
        hand: [guestCardA.id, guestCardB.id],
        raisedCardIds: [],
        connected: true,
        connectionId: "invite-1",
        disconnectDeadlineAt: null,
        activeFromRound: 1
      }
    ],
    blackDrawPile: [],
    blackDiscard: [],
    whiteDrawPile: [],
    whiteDiscard: []
  };
}

function createHostRuntime(): HostRuntime {
  return {
    roomId: "room-1",
    roomName: "Host's table",
    peerId: "host-1",
    selfPlayerId: "player-1",
    seed: "seed",
    connections: new Map(),
    transportHandle: null,
    roundTimerIntervalId: null,
    pendingDisconnects: new Map(),
    state: createHostState()
  };
}

function createState(): AppState {
  return {
    identity: createIdentity(),
    nowTick: Date.now(),
    usernameInput: "Host",
    seedInput: "seed",
    joinHostId: "",
    joinRoomId: "",
    host: createHostRuntime(),
    guest: {
      sessionId: "guest-session-1",
      transportHandle: null,
      channel: null,
      roomId: null,
      roomName: null,
      status: "",
      sync: null,
      recoveryCode: ""
    },
    selectedCardIds: [],
    recoveryImportInput: "",
    flash: "",
    winnerPickBlocked: false
  };
}

test("currentSync builds the host perspective when hosting locally", () => {
  const state = createState();

  const sync = currentSync(state);

  assert.equal(sync.roomId, "room-1");
  assert.equal(sync.selfPlayerId, "player-1");
  assert.equal(sync.hand.length, 2);
  assert.equal(sync.canSubmit, true);
});

test("currentSync falls back to guest sync when not hosting", () => {
  const state = createState();
  const guestSync: SyncView = buildSyncView(
    "room-2",
    "Guest room",
    createHostState(),
    "player-2"
  );

  state.host = null;
  state.guest.sync = guestSync;

  const sync = currentSync(state);

  assert.equal(sync.roomId, "room-2");
  assert.equal(sync.selfPlayerId, "player-2");
});

test("currentSync derives guest countdowns from host-relative deadlines", () => {
  const state = createState();
  state.host = null;
  state.nowTick = 100_000;
  state.guest.hostClockOffsetMs = 5_000;
  state.guest.sync = {
    ...buildSyncView("room-2", "Guest room", createHostState(), "player-2"),
    hostNow: 95_000,
    submissionDeadlineAt: 108_000,
    submissionSecondsLeft: 99,
    players: [
      {
        id: "player-2",
        username: "Guest",
        score: 0,
        connected: false,
        disconnectDeadlineAt: 107_000,
        disconnectSecondsLeft: 99,
        handCount: 2,
        isJudge: false,
        isWaiting: false,
        hasSubmitted: false
      }
    ],
    hand: [],
    handCards: [],
    selfPlayerId: "player-2",
    canSubmit: false,
    canJudge: false
  };

  const sync = currentSync(state);

  assert.equal(sync.submissionSecondsLeft, 3);
  assert.equal(sync.players[0]?.disconnectSecondsLeft, 2);
});

test("currentPlayer and card selectors derive the local view", () => {
  const state = createState();

  const player = currentPlayer(state);
  const hand = currentHandCards(state);
  const blackCard = currentBlackCard(state);

  assert.equal(player?.username, "Host");
  assert.equal(hand.length, 2);
  assert.equal(blackCard?.id, blackCards[0]?.id);
});
