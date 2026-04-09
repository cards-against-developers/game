import assert from "node:assert/strict";
import test from "node:test";

import type { SyncView } from "../types.js";
import { buildBoardCards } from "./project.js";

function createSync(overrides: Partial<SyncView> = {}): SyncView {
  return {
    roomId: "room-1",
    roomName: "Room 1",
    started: true,
    phase: "lobby",
    round: 0,
    submissionSecondsLeft: null,
    announcement: "",
    blackCardId: null,
    blackCard: null,
    blackPick: 1,
    judgeId: null,
    lastWinnerId: null,
    players: [
      {
        id: "host",
        username: "Host",
        score: 0,
        connected: true,
        disconnectSecondsLeft: null,
        handCount: 7,
        isJudge: false,
        isWaiting: false,
        hasSubmitted: false
      },
      {
        id: "alice",
        username: "Alice",
        score: 0,
        connected: false,
        disconnectSecondsLeft: 18,
        handCount: 7,
        isJudge: false,
        isWaiting: false,
        hasSubmitted: false
      }
    ],
    submissions: [],
    hand: [],
    handCards: [],
    selfPlayerId: "host",
    canSubmit: false,
    canJudge: false,
    ...overrides
  };
}

test("buildBoardCards projects lobby players into board cards", () => {
  const cards = buildBoardCards(createSync());

  assert.deepEqual(
    cards.map((card) => ({
      id: card.id,
      kind: card.kind,
      text: card.text,
      hidden: card.hidden,
      connected: card.connected,
      reconnectSecondsLeft: card.reconnectSecondsLeft
    })),
    [
      {
        id: "host",
        kind: "player",
        text: "Host",
        hidden: false,
        connected: true,
        reconnectSecondsLeft: null
      },
      {
        id: "alice",
        kind: "player",
        text: "Alice",
        hidden: false,
        connected: false,
        reconnectSecondsLeft: 18
      }
    ]
  );
});

test("buildBoardCards projects submissions into hidden and revealed board cards", () => {
  const cards = buildBoardCards(
    createSync({
      phase: "judging",
      submissions: [
        {
          id: "submission-1",
          cardIds: ["a"],
          hidden: true,
          winner: false
        },
        {
          id: "submission-2",
          cardIds: ["b"],
          cards: [{ id: "b", text: "Real card text" }],
          hidden: false,
          winner: true
        }
      ]
    })
  );

  assert.deepEqual(
    cards.map((card) => ({
      id: card.id,
      kind: card.kind,
      text: card.text,
      hidden: card.hidden,
      winner: card.winner
    })),
    [
      {
        id: "submission-1",
        kind: "submission",
        text: "Cards Against Developers",
        hidden: true,
        winner: false
      },
      {
        id: "submission-2",
        kind: "submission",
        text: "Real card text",
        hidden: false,
        winner: true
      }
    ]
  );
});

test("buildBoardCards does not show player placeholders during submitting before picks", () => {
  const cards = buildBoardCards(
    createSync({
      phase: "submitting",
      submissions: []
    })
  );

  assert.deepEqual(cards, []);
});
