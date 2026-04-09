import assert from "node:assert/strict";
import test from "node:test";

import {
  importRecoveryBundle,
  currentUsername,
  rememberCurrentUsername,
  trimSelectionsToHand
} from "./index.js";
import type { AppState } from "../app/state.js";
import type { RecoveryBundle } from "../types.js";
import { encodeJson } from "../utils/codec.js";

function createState(): AppState {
  return {
    identity: {
      lastUsername: "",
      rooms: {}
    },
    nowTick: Date.now(),
    usernameInput: "Developer 123",
    seedInput: "cards-against-developers",
    joinHostId: "",
    joinRoomId: "",
    host: null,
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

test("currentUsername sanitizes the chosen username", () => {
  const state = createState();
  state.usernameInput = "   <Alice>   ";
  const username = currentUsername(state);

  assert.equal(username, "<Alice>");
  assert.equal(state.usernameInput, "<Alice>");
});

test("rememberCurrentUsername stores the latest username", () => {
  const state = createState();
  state.usernameInput = "   <Alice>   ";

  const saves: AppState["identity"][] = [];
  rememberCurrentUsername("test-key", state, (_storageKey, identity) => {
    saves.push(structuredClone(identity));
  });

  assert.equal(state.identity.lastUsername, "<Alice>");
  assert.equal(saves[0]?.lastUsername, "<Alice>");
});

test("importRecoveryBundle stores the room bundle", () => {
  const state = createState();
  const bundle: RecoveryBundle = {
    roomId: "room-1",
    playerId: "player-1",
    reconnectToken: "token-1"
  };
  state.recoveryImportInput = encodeJson(bundle);

  const saves: AppState["identity"][] = [];
  const message = importRecoveryBundle(
    state,
    "test-key",
    (_storageKey, identity) => {
      saves.push(structuredClone(identity));
    }
  );

  assert.equal(message, "Imported recovery for room room-1.");
  assert.deepEqual(state.identity.rooms["room-1"], bundle);
  assert.equal(saves[0]?.rooms["room-1"]?.playerId, "player-1");
});

test("trimSelectionsToHand drops cards that are no longer in hand", () => {
  const state = createState();
  state.selectedCardIds = ["white-1", "white-2", "white-3"];

  trimSelectionsToHand(state, ["white-2", "white-4"]);

  assert.deepEqual(state.selectedCardIds, ["white-2"]);
});
