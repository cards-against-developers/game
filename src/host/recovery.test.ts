import assert from "node:assert/strict";
import test from "node:test";

import type { HostRuntime } from "./runtime.js";
import { buildRecoveryBundle } from "./recovery.js";
import { decodeJson } from "../utils/codec.js";

function createHostRuntime(): HostRuntime {
  return {
    roomId: "room-1",
    roomName: "Test Room",
    peerId: "host-1",
    selfPlayerId: "player-1",
    seed: "seed",
    connections: new Map(),
    transportHandle: null,
    roundTimerIntervalId: null,
    pendingDisconnects: new Map(),
    state: {
      seed: "seed",
      randomState: 1,
      countdownMs: 30_000,
      started: true,
      phase: "submitting",
      round: 1,
      submissionDeadlineAt: null,
      winnerSelectionClosed: false,
      announcement: "Lobby",
      blackCardId: null,
      blackPick: 1,
      judgeId: null,
      participantIds: [],
      lastWinnerId: null,
      judgeCursor: -1,
      submissions: [],
      revealedSubmissionIds: [],
      players: [
        {
          id: "player-1",
          username: "Host",
          score: 0,
          reconnectToken: "token-1",
          sessionId: "session-1",
          hand: [],
          raisedCardIds: [],
          connected: true,
          connectionId: null,
          disconnectDeadlineAt: null,
          activeFromRound: 0
        }
      ],
      blackDrawPile: [],
      blackDiscard: [],
      whiteDrawPile: [],
      whiteDiscard: []
    }
  };
}

test("buildRecoveryBundle encodes the room and reconnect identity", () => {
  const encoded = buildRecoveryBundle(createHostRuntime(), "player-1");
  const decoded = decodeJson<{
    roomId: string;
    playerId: string;
    reconnectToken: string;
  }>(encoded);

  assert.deepEqual(decoded, {
    roomId: "room-1",
    playerId: "player-1",
    reconnectToken: "token-1"
  });
});

test("buildRecoveryBundle returns an empty string for an unknown player", () => {
  assert.equal(buildRecoveryBundle(createHostRuntime(), "missing"), "");
});
