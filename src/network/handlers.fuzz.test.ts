import assert from "node:assert/strict";
import test from "node:test";

import fc from "fast-check";

import { deckVersion } from "../cards/index.js";
import { startGame } from "../game/rounds.js";
import { addHostPlayer } from "../game/submissions.js";
import { createHostRuntime } from "../host/factory.js";
import type { HostGameState, SyncView } from "../types.js";
import { decodeJson } from "../utils/codec.js";
import type { NetworkContext } from "./context.js";
import { handleHostMessage } from "./handlers.js";
import type { ChannelLike } from "./transport.js";
import type { Message } from "./types.js";
const HANDLERS_FUZZ_RUNS = parseEnvInt("HANDLERS_FUZZ_RUNS", 100);
const HANDLERS_FUZZ_SEED = parseEnvInt("HANDLERS_FUZZ_SEED", 424243);

type ForgedAction =
  | {
      kind: "hello-wrong-room";
      connectionId: string;
      playerId: string;
      reconnectToken: string;
    }
  | {
      kind: "hello-wrong-token";
      connectionId: string;
      playerId: string;
    }
  | {
      kind: "raise-invalid";
      connectionId: string;
    }
  | {
      kind: "submit-invalid";
      connectionId: string;
    }
  | {
      kind: "reveal-random";
      connectionId: string;
      submissionId: string;
    }
  | {
      kind: "pick-random";
      connectionId: string;
      submissionId: string;
    }
  | {
      kind: "hello-reconnect-valid";
      connectionId: string;
      playerId: string;
    }
  | {
      kind: "raise-valid";
      connectionId: string;
    }
  | {
      kind: "submit-valid";
      connectionId: string;
    }
  | {
      kind: "submit-replay";
      connectionId: string;
    }
  | {
      kind: "reveal-current";
      connectionId: string;
    }
  | {
      kind: "pick-current";
      connectionId: string;
    };

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

function createStartedHost() {
  const host = createHostRuntime("Host", "seed");
  addHostPlayer(
    host.state,
    "alice",
    "Alice",
    "token-alice",
    "session-alice",
    "conn-alice"
  );
  addHostPlayer(
    host.state,
    "bob",
    "Bob",
    "token-bob",
    "session-bob",
    "conn-bob"
  );
  addHostPlayer(
    host.state,
    "carol",
    "Carol",
    "token-carol",
    "session-carol",
    "conn-carol"
  );
  startGame(host.state);
  return host;
}

function assertHostStateInvariants(game: HostGameState): void {
  assert.equal(
    game.players.length,
    new Set(game.players.map((player) => player.id)).size
  );
  assert.equal(game.participantIds.length, new Set(game.participantIds).size);
  if (game.judgeId !== null) {
    assert.equal(game.participantIds.includes(game.judgeId), false);
  }
  assert.equal(
    game.submissions.length,
    new Set(game.submissions.map((submission) => submission.playerId)).size
  );
  const submissionIds = new Set(
    game.submissions.map((submission) => submission.id)
  );
  for (const revealedId of game.revealedSubmissionIds) {
    assert.ok(submissionIds.has(revealedId));
  }
}

function findPlayerByConnection(game: HostGameState, connectionId: string) {
  return (
    game.players.find((player) => player.connectionId === connectionId) ?? null
  );
}

function validCardIdsForConnection(
  game: HostGameState,
  connectionId: string
): string[] {
  const player = findPlayerByConnection(game, connectionId);
  if (!player) {
    return [];
  }

  return player.hand.slice(0, game.blackPick);
}

function currentSubmissionId(game: HostGameState): string {
  return game.submissions[0]?.id ?? "missing-submission";
}

function applyForgedAction(
  host: ReturnType<typeof createStartedHost>,
  context: NetworkContext,
  action: ForgedAction
): void {
  const { channel } = createChannel();
  switch (action.kind) {
    case "hello-wrong-room":
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "hello",
          roomId: "wrong-room",
          deckVersion,
          username: "Intruder",
          playerId: action.playerId,
          reconnectToken: action.reconnectToken,
          sessionId: `session-${action.playerId}`
        },
        context
      );
      return;
    case "hello-wrong-token":
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "hello",
          roomId: host.roomId,
          deckVersion,
          username: "Intruder",
          playerId: action.playerId,
          reconnectToken: "wrong-token",
          sessionId: `session-${action.playerId}`
        },
        context
      );
      return;
    case "raise-invalid":
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "raise_cards",
          cardIds: ["missing-card-a", "missing-card-b"]
        },
        context
      );
      return;
    case "submit-invalid":
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "submit_cards",
          cardIds: ["missing-card-a", "missing-card-b"]
        },
        context
      );
      return;
    case "reveal-random":
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "reveal_submission",
          submissionId: action.submissionId
        },
        context
      );
      return;
    case "pick-random":
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "pick_submission",
          submissionId: action.submissionId
        },
        context
      );
      return;
    case "hello-reconnect-valid": {
      const player = host.state.players.find(
        (entry) => entry.id === action.playerId
      );
      if (!player) {
        return;
      }
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "hello",
          roomId: host.roomId,
          deckVersion,
          username: `${player.username} again`,
          playerId: player.id,
          reconnectToken: player.reconnectToken,
          sessionId: player.sessionId
        },
        context
      );
      return;
    }
    case "raise-valid":
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "raise_cards",
          cardIds: validCardIdsForConnection(host.state, action.connectionId)
        },
        context
      );
      return;
    case "submit-valid":
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "submit_cards",
          cardIds: validCardIdsForConnection(host.state, action.connectionId)
        },
        context
      );
      return;
    case "submit-replay": {
      const player = findPlayerByConnection(host.state, action.connectionId);
      const existingSubmission = player
        ? host.state.submissions.find(
            (submission) => submission.playerId === player.id
          )
        : null;
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "submit_cards",
          cardIds:
            existingSubmission?.cardIds ??
            validCardIdsForConnection(host.state, action.connectionId)
        },
        context
      );
      return;
    }
    case "reveal-current":
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "reveal_submission",
          submissionId: currentSubmissionId(host.state)
        },
        context
      );
      return;
    case "pick-current":
      handleHostMessage(
        host,
        action.connectionId,
        channel,
        {
          type: "pick_submission",
          submissionId: currentSubmissionId(host.state)
        },
        context
      );
      return;
  }
}

function replayHostMessages(
  host: ReturnType<typeof createStartedHost>,
  context: NetworkContext,
  actions: ForgedAction[],
  assertStep?: (
    action: ForgedAction,
    before: HostGameState,
    after: HostGameState
  ) => void
): void {
  actions.forEach((action) => {
    const before = structuredClone(host.state);
    applyForgedAction(host, context, action);
    assertStep?.(action, before, host.state);
  });
}

function formatForgedActionSequence(actions: ForgedAction[]): string {
  return JSON.stringify(actions, null, 2);
}

const knownConnectionArbitrary = fc.constantFrom(
  "conn-host",
  "conn-alice",
  "conn-bob",
  "conn-carol",
  "ghost-connection"
);

const forgedActionArbitrary: fc.Arbitrary<ForgedAction> = fc.oneof(
  {
    weight: 1,
    arbitrary: fc.record({
      kind: fc.constant<"hello-wrong-room">("hello-wrong-room"),
      connectionId: knownConnectionArbitrary,
      playerId: fc.constantFrom("host", "alice", "bob", "carol", "ghost"),
      reconnectToken: fc.string({ minLength: 1, maxLength: 12 })
    })
  },
  {
    weight: 1,
    arbitrary: fc.record({
      kind: fc.constant<"hello-wrong-token">("hello-wrong-token"),
      connectionId: knownConnectionArbitrary,
      playerId: fc.constantFrom("host", "alice", "bob", "carol")
    })
  },
  {
    weight: 3,
    arbitrary: fc.record({
      kind: fc.constant<"raise-invalid">("raise-invalid"),
      connectionId: knownConnectionArbitrary
    })
  },
  {
    weight: 3,
    arbitrary: fc.record({
      kind: fc.constant<"submit-invalid">("submit-invalid"),
      connectionId: knownConnectionArbitrary
    })
  },
  {
    weight: 3,
    arbitrary: fc.record({
      kind: fc.constant<"reveal-random">("reveal-random"),
      connectionId: knownConnectionArbitrary,
      submissionId: fc.string({ minLength: 1, maxLength: 18 })
    })
  },
  {
    weight: 3,
    arbitrary: fc.record({
      kind: fc.constant<"pick-random">("pick-random"),
      connectionId: knownConnectionArbitrary,
      submissionId: fc.string({ minLength: 1, maxLength: 18 })
    })
  },
  {
    weight: 2,
    arbitrary: fc.record({
      kind: fc.constant<"hello-reconnect-valid">("hello-reconnect-valid"),
      connectionId: fc.constantFrom(
        "conn-alice",
        "conn-bob",
        "conn-carol",
        "ghost-connection"
      ),
      playerId: fc.constantFrom("alice", "bob", "carol")
    })
  },
  {
    weight: 4,
    arbitrary: fc.record({
      kind: fc.constant<"raise-valid">("raise-valid"),
      connectionId: knownConnectionArbitrary
    })
  },
  {
    weight: 4,
    arbitrary: fc.record({
      kind: fc.constant<"submit-valid">("submit-valid"),
      connectionId: knownConnectionArbitrary
    })
  },
  {
    weight: 4,
    arbitrary: fc.record({
      kind: fc.constant<"submit-replay">("submit-replay"),
      connectionId: knownConnectionArbitrary
    })
  },
  {
    weight: 3,
    arbitrary: fc.record({
      kind: fc.constant<"reveal-current">("reveal-current"),
      connectionId: knownConnectionArbitrary
    })
  },
  {
    weight: 3,
    arbitrary: fc.record({
      kind: fc.constant<"pick-current">("pick-current"),
      connectionId: knownConnectionArbitrary
    })
  }
);

test("fuzz host handlers reject forged or invalid guest actions", () => {
  fc.assert(
    fc.property(
      fc.array(forgedActionArbitrary, { minLength: 10, maxLength: 80 }),
      (actions) => {
        const host = createStartedHost();
        const context = createContext();
        assertHostStateInvariants(host.state);
        replayHostMessages(host, context, actions, (action, before, after) => {
          assertHostStateInvariants(host.state);

          if (
            (action.kind === "raise-invalid" ||
              action.kind === "submit-invalid" ||
              action.kind === "reveal-random" ||
              action.kind === "pick-random") &&
            action.connectionId === "ghost-connection" &&
            findPlayerByConnection(before, action.connectionId) === null
          ) {
            assert.deepEqual(after, before);
          }

          if (
            (action.kind === "reveal-random" ||
              action.kind === "pick-random" ||
              action.kind === "reveal-current" ||
              action.kind === "pick-current") &&
            host.state.judgeId !== null
          ) {
            const judgeConnectionId =
              after.players.find((player) => player.id === after.judgeId)
                ?.connectionId ?? null;
            if (action.connectionId !== judgeConnectionId) {
              assert.deepEqual(
                after.revealedSubmissionIds,
                before.revealedSubmissionIds
              );
              assert.equal(after.lastWinnerId, before.lastWinnerId);
            }
          }

          if (
            (action.kind === "submit-valid" ||
              action.kind === "submit-replay") &&
            before.phase === "submitting"
          ) {
            const player = findPlayerByConnection(before, action.connectionId);
            const wasEligible =
              player !== null &&
              before.judgeId !== player.id &&
              before.participantIds.includes(player.id) &&
              !before.submissions.some(
                (submission) => submission.playerId === player.id
              );
            const beforeCount = before.submissions.filter(
              (submission) => submission.playerId === player?.id
            ).length;
            const afterCount = after.submissions.filter(
              (submission) => submission.playerId === player?.id
            ).length;

            if (!wasEligible) {
              assert.equal(
                afterCount,
                beforeCount,
                "ineligible valid submit must not create a submission"
              );
            } else {
              assert.ok(
                afterCount === beforeCount || afterCount === beforeCount + 1,
                "eligible valid submit may add at most one submission"
              );
            }
          }

          if (action.kind === "raise-valid") {
            const player = findPlayerByConnection(before, action.connectionId);
            if (player === null) {
              assert.deepEqual(
                after,
                before,
                "unknown connection must not change host state"
              );
            } else if (
              before.phase !== "submitting" ||
              before.judgeId === player.id ||
              !before.participantIds.includes(player.id) ||
              before.submissions.some(
                (submission) => submission.playerId === player.id
              )
            ) {
              assert.deepEqual(
                after.players.find((entry) => entry.id === player.id)
                  ?.raisedCardIds ?? [],
                [],
                "ineligible valid raise must clear raised cards"
              );
            }
          }
        });
      }
    ),
    {
      numRuns: HANDLERS_FUZZ_RUNS,
      seed: HANDLERS_FUZZ_SEED,
      verbose: process.env.FAST_CHECK_VERBOSE === "1"
    }
  );
});

test("replayHostMessages replays a shrunk handler counterexample deterministically", () => {
  const host = createStartedHost();
  const context = createContext();
  const actions: ForgedAction[] = [
    { kind: "submit-valid", connectionId: "conn-alice" },
    { kind: "submit-replay", connectionId: "conn-alice" },
    { kind: "reveal-current", connectionId: "conn-host" }
  ];

  replayHostMessages(host, context, actions, (_action, before, after) => {
    assertHostStateInvariants(after);
    assert.ok(after.submissions.length >= before.submissions.length);
  });

  assert.ok(
    formatForgedActionSequence(actions).includes('"kind": "submit-replay"')
  );
});

function parseEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
