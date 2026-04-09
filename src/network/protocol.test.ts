import assert from "node:assert/strict";
import test from "node:test";

import { parseMessage } from "./protocol.js";
import { encodeJson } from "../utils/codec.js";

test("parseMessage decodes a sync message payload", () => {
  const raw = encodeJson({
    type: "sync",
    payload: {
      roomId: "room-1",
      roomName: "Test Room",
      started: true,
      phase: "submitting",
      round: 2,
      submissionSecondsLeft: 30,
      announcement: "Choose a card.",
      blackCardId: "black-1",
      blackPick: 1,
      judgeId: "player-2",
      lastWinnerId: null,
      players: [],
      submissions: [],
      hand: ["white-1"],
      selfPlayerId: "player-1",
      canSubmit: true,
      canJudge: false
    }
  });

  const message = parseMessage(raw);

  assert.equal(message.type, "sync");
  if (message.type !== "sync") {
    throw new Error("Expected sync message.");
  }
  assert.equal(message.payload.roomId, "room-1");
  assert.deepEqual(message.payload.hand, ["white-1"]);
});
