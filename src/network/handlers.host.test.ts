import assert from "node:assert/strict";
import test from "node:test";

import { blackCards, deckVersion, whiteCards } from "../cards/index.js";
import { startGame } from "../game/rounds.js";
import { addHostPlayer } from "../game/submissions.js";
import { createHostRuntime } from "../host/factory.js";
import type { SyncView } from "../types.js";
import { decodeJson } from "../utils/codec.js";
import type { NetworkContext } from "./context.js";
import { handleHostMessage } from "./handlers.js";
import type { ChannelLike } from "./transport.js";
import type { Message } from "./types.js";

function createContext(): NetworkContext {
  return {
    state: {
      identity: { lastUsername: "", rooms: {} },
      nowTick: Date.now(),
      usernameInput: "Host",
      seedInput: "seed",
      joinHostId: "",
      joinRoomId: "",
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
    },
    transportMode: "loopback",
    memoryTransportHub: null,
    hostCountdownMs: null,
    rtcConfig: {},
    currentUsername: () => "Host",
    getRecoveryBundle: () => null,
    persistIdentity: () => undefined,
    persistHostState: () => undefined,
    trimSelectionsToHand: () => undefined,
    currentSync: () =>
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
      }) satisfies SyncView,
    setFlash: () => undefined,
    armWinnerPickLockout: () => undefined,
    clearWinnerPickLockout: () => undefined
  };
}

function createChannel() {
  const sent: Message[] = [];
  let closed = false;
  const channel = {
    readyState: "open",
    send(data: string) {
      sent.push(decodeJson<Message>(data));
    },
    close() {
      closed = true;
    }
  } as unknown as ChannelLike;

  return {
    channel,
    sent,
    isClosed: () => closed
  };
}

test("handleHostMessage rejects hello messages for the wrong room", () => {
  const host = createHostRuntime("Host", "seed");
  const context = createContext();
  const { channel, sent, isClosed } = createChannel();

  handleHostMessage(
    host,
    "invite-1",
    channel,
    {
      type: "hello",
      roomId: "wrong-room",
      deckVersion,
      username: "Guest",
      playerId: "player-2",
      reconnectToken: "token-2",
      sessionId: "session-2"
    },
    context
  );

  assert.deepEqual(sent, [
    {
      type: "error",
      message: "Room or deck mismatch."
    }
  ]);
  assert.equal(isClosed(), true);
});

test("handleHostMessage rejects reconnects with the wrong token", () => {
  const host = createHostRuntime("Host", "seed");
  addHostPlayer(
    host.state,
    "player-2",
    "Guest",
    "correct-token",
    "session-2",
    null
  );
  const context = createContext();
  const { channel, sent, isClosed } = createChannel();

  handleHostMessage(
    host,
    "invite-2",
    channel,
    {
      type: "hello",
      roomId: host.roomId,
      deckVersion,
      username: "Guest",
      playerId: "player-2",
      reconnectToken: "wrong-token",
      sessionId: "session-2"
    },
    context
  );

  assert.deepEqual(sent, [
    {
      type: "error",
      message: "Reconnect token mismatch."
    }
  ]);
  assert.equal(isClosed(), true);
  assert.equal(host.state.players.length, 2);
});

test("handleHostMessage welcomes a newly joined player", () => {
  const host = createHostRuntime("Host", "seed");
  const context = createContext();
  const { channel, sent } = createChannel();

  handleHostMessage(
    host,
    "invite-3",
    channel,
    {
      type: "hello",
      roomId: host.roomId,
      deckVersion,
      username: "Guest",
      playerId: "player-3",
      reconnectToken: "token-3",
      sessionId: "session-3"
    },
    context
  );

  assert.equal(host.state.players.length, 2);
  assert.equal(host.state.players[1]?.connectionId, "invite-3");
  assert.equal(sent[0]?.type, "welcome");
  if (sent[0]?.type !== "welcome") {
    throw new Error("Expected welcome message.");
  }
  const recovery = decodeJson<{
    roomId: string;
    playerId: string;
    reconnectToken: string;
  }>(sent[0].recoveryCode);
  assert.equal(recovery.roomId, host.roomId);
  assert.equal(recovery.playerId, "player-3");
});

test("handleHostMessage clears a pending disconnect when a player rejoins", () => {
  const host = createHostRuntime("Host", "seed");
  const guest = addHostPlayer(
    host.state,
    "player-2",
    "Guest",
    "token-2",
    "session-2",
    null
  );
  guest.connected = false;
  guest.disconnectDeadlineAt = Date.now() + 10_000;
  const timeoutId = setTimeout(() => undefined, 60_000);
  const intervalId = setInterval(() => undefined, 60_000);
  host.pendingDisconnects.set(guest.id, { timeoutId, intervalId });

  const context = createContext();
  const { channel } = createChannel();

  handleHostMessage(
    host,
    "invite-2",
    channel,
    {
      type: "hello",
      roomId: host.roomId,
      deckVersion,
      username: "Guest",
      playerId: "player-2",
      reconnectToken: "token-2",
      sessionId: "session-2"
    },
    context
  );

  assert.equal(host.pendingDisconnects.has("player-2"), false);
  assert.equal(guest.connected, true);
  assert.equal(guest.connectionId, "invite-2");
  assert.equal(guest.disconnectDeadlineAt, null);
});

test("handleHostMessage rebinds a valid reconnect to the new connection and invalidates the old one", () => {
  const host = createHostRuntime("Host", "seed");
  const guest = addHostPlayer(
    host.state,
    "player-2",
    "Guest",
    "token-2",
    "session-2",
    "old-conn"
  );
  startGame(host.state);
  const context = createContext();
  const { channel } = createChannel();

  handleHostMessage(
    host,
    "new-conn",
    channel,
    {
      type: "hello",
      roomId: host.roomId,
      deckVersion,
      username: "Guest",
      playerId: "player-2",
      reconnectToken: "token-2",
      sessionId: "session-2"
    },
    context
  );

  assert.equal(guest.connectionId, "new-conn");

  const previousRaised = [...guest.raisedCardIds];
  handleHostMessage(
    host,
    "old-conn",
    channel,
    {
      type: "raise_cards",
      cardIds: guest.hand.slice(0, host.state.blackPick)
    },
    context
  );

  assert.deepEqual(guest.raisedCardIds, previousRaised);
});

test("handleHostMessage rejects a new player when the table already has 12 players", () => {
  const host = createHostRuntime("Host", "seed");
  for (let index = 0; index < 11; index += 1) {
    addHostPlayer(
      host.state,
      `player-${index + 2}`,
      `Guest ${index + 2}`,
      `token-${index + 2}`,
      `session-${index + 2}`,
      null
    );
  }

  const context = createContext();
  const { channel, sent, isClosed } = createChannel();

  handleHostMessage(
    host,
    "invite-overflow",
    channel,
    {
      type: "hello",
      roomId: host.roomId,
      deckVersion,
      username: "Overflow",
      playerId: "player-overflow",
      reconnectToken: "token-overflow",
      sessionId: "session-overflow"
    },
    context
  );

  assert.equal(host.state.players.length, 12);
  assert.deepEqual(sent, [
    {
      type: "error",
      message: "Table is full. Maximum 12 players."
    }
  ]);
  assert.equal(isClosed(), true);
});

test("handleHostMessage still allows reconnecting into a full table", () => {
  const host = createHostRuntime("Host", "seed");
  for (let index = 0; index < 10; index += 1) {
    addHostPlayer(
      host.state,
      `player-${index + 2}`,
      `Guest ${index + 2}`,
      `token-${index + 2}`,
      `session-${index + 2}`,
      null
    );
  }
  const returningGuest = addHostPlayer(
    host.state,
    "player-returning",
    "Returning Guest",
    "token-returning",
    "session-returning",
    null
  );
  returningGuest.connected = false;
  returningGuest.connectionId = null;

  const context = createContext();
  const { channel, sent, isClosed } = createChannel();

  handleHostMessage(
    host,
    "invite-returning",
    channel,
    {
      type: "hello",
      roomId: host.roomId,
      deckVersion,
      username: "Returning Guest",
      playerId: "player-returning",
      reconnectToken: "token-returning",
      sessionId: "session-returning"
    },
    context
  );

  assert.equal(host.state.players.length, 12);
  assert.equal(returningGuest.connected, true);
  assert.equal(returningGuest.connectionId, "invite-returning");
  assert.equal(sent[0]?.type, "welcome");
  assert.equal(isClosed(), false);
});

test("handleHostMessage records a remote card submission", () => {
  const blackCard = blackCards[0];
  const whiteCard = whiteCards[0];
  if (!blackCard || !whiteCard) {
    throw new Error("Expected bundled cards for host handler tests.");
  }

  const host = createHostRuntime("Host", "seed");
  const guest = addHostPlayer(
    host.state,
    "player-2",
    "Guest",
    "token-2",
    "session-2",
    "invite-2"
  );
  guest.hand = Array.from({ length: blackCard.pick }, () => whiteCard.id);
  host.state.started = true;
  host.state.phase = "submitting";
  host.state.round = 1;
  host.state.blackCardId = blackCard.id;
  host.state.blackPick = blackCard.pick;
  host.state.judgeId = host.selfPlayerId;
  host.state.participantIds = [guest.id];
  host.state.submissions = [];

  const context = createContext();
  const { channel } = createChannel();

  handleHostMessage(
    host,
    "invite-2",
    channel,
    {
      type: "submit_cards",
      cardIds: Array.from({ length: blackCard.pick }, () => whiteCard.id)
    },
    context
  );

  assert.equal(host.state.submissions.length, 1);
  assert.equal(host.state.submissions[0]?.playerId, "player-2");
  assert.equal(host.state.phase, "judging");
});

test("handleHostMessage records a remote raised card selection", () => {
  const blackCard = blackCards[0];
  const [whiteCardA, whiteCardB] = whiteCards;
  if (!blackCard || !whiteCardA || !whiteCardB) {
    throw new Error("Expected bundled cards for host handler tests.");
  }

  const host = createHostRuntime("Host", "seed");
  const guest = addHostPlayer(
    host.state,
    "player-2",
    "Guest",
    "token-2",
    "session-2",
    "invite-2"
  );
  guest.hand = [whiteCardA.id, whiteCardB.id];
  host.state.started = true;
  host.state.phase = "submitting";
  host.state.round = 1;
  host.state.blackCardId = blackCard.id;
  host.state.blackPick = blackCard.pick;
  host.state.judgeId = host.selfPlayerId;
  host.state.participantIds = [guest.id];
  host.state.submissions = [];

  const context = createContext();
  const { channel } = createChannel();

  handleHostMessage(
    host,
    "invite-2",
    channel,
    {
      type: "raise_cards",
      cardIds: [whiteCardB.id]
    },
    context
  );

  assert.deepEqual(guest.raisedCardIds, [whiteCardB.id]);
  assert.equal(host.state.submissions.length, 0);
});
