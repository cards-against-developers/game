import assert from "node:assert/strict";
import test from "node:test";

import fc from "fast-check";

import type { HostGameState, HostPlayer } from "../types.js";
import { processRoundDeadline } from "./deadlines.js";
import {
  expireJudging,
  expireWinnerSelection,
  skipCurrentRound,
  startGame,
  startNextRound
} from "./rounds.js";
import {
  handleHostDisconnect,
  pickSubmissionForPlayer,
  reconnectOrCreatePlayer,
  removeDisconnectedPlayer,
  revealSubmissionForPlayer,
  setRaisedCardsForPlayer,
  submitCardsForPlayer
} from "./submissions.js";
import { buildSyncView } from "./sync.js";

type Action =
  | { kind: "start-game" }
  | { kind: "start-next-round" }
  | { kind: "skip-round" }
  | { kind: "expire-judging" }
  | { kind: "expire-winner" }
  | { kind: "process-deadline" }
  | { kind: "expire-disconnect"; playerId: string }
  | { kind: "raise"; playerId: string; mode: "valid" | "invalid" | "clear" }
  | {
      kind: "submit";
      playerId: string;
      mode: "valid" | "raised" | "invalid" | "duplicate" | "valid-multipick";
    }
  | { kind: "reveal"; index: number }
  | { kind: "pick"; index: number }
  | { kind: "disconnect"; playerId: string }
  | { kind: "remove-disconnected"; playerId: string }
  | { kind: "reconnect"; playerId: string };

type ActionSequence = Action[];

const PLAYER_IDS = ["host", "alice", "bob", "carol"] as const;
const FUZZ_NOW = 1_760_000_000_000;
const GAME_FUZZ_RUNS = parseEnvInt("GAME_FUZZ_RUNS", 150);
const GAME_FUZZ_DISCONNECT_RUNS = parseEnvInt("GAME_FUZZ_DISCONNECT_RUNS", 200);
const GAME_FUZZ_SEED = parseEnvInt("GAME_FUZZ_SEED", 424242);
const GAME_FUZZ_DISCONNECT_SEED = parseEnvInt(
  "GAME_FUZZ_DISCONNECT_SEED",
  424244
);

function createPlayer(
  id: string,
  overrides: Partial<HostPlayer> = {}
): HostPlayer {
  return {
    id,
    username: `Player ${id}`,
    score: 0,
    reconnectToken: `token-${id}`,
    sessionId: `session-${id}`,
    hand: [],
    raisedCardIds: [],
    connected: true,
    connectionId: `conn-${id}`,
    disconnectDeadlineAt: null,
    activeFromRound: 0,
    ...overrides
  };
}

function createGame(overrides: Partial<HostGameState> = {}): HostGameState {
  const players =
    overrides.players ??
    PLAYER_IDS.map((playerId) =>
      createPlayer(playerId, { activeFromRound: 0 })
    );

  return {
    seed: "fuzz-seed",
    randomState: 123456,
    countdownMs: 5_000,
    started: false,
    phase: "lobby",
    round: 0,
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
    players,
    blackDrawPile: Array.from({ length: 80 }, (_, index) => ({
      id: `black-${index + 1}`,
      pick: index % 4 === 0 ? 2 : 1
    })),
    blackDiscard: [],
    whiteDrawPile: Array.from(
      { length: 600 },
      (_, index) => `white-${index + 1}`
    ),
    whiteDiscard: [],
    ...overrides
  };
}

function validCardIds(game: HostGameState, playerId: string): string[] {
  const player = game.players.find((entry) => entry.id === playerId);
  if (!player) {
    return [];
  }

  return player.hand.slice(0, game.blackPick);
}

function invalidCardIds(game: HostGameState, playerId: string): string[] {
  const player = game.players.find((entry) => entry.id === playerId);
  if (!player) {
    return [];
  }

  const valid = validCardIds(game, playerId);
  if (player.hand.length === 0) {
    return ["missing-card"];
  }

  if (game.blackPick > 1) {
    return [player.hand[0]!, player.hand[0]!];
  }

  return valid.length > 0 ? [...valid, "missing-card"] : ["missing-card"];
}

function validMultiPickCardIds(
  game: HostGameState,
  playerId: string
): string[] {
  const player = game.players.find((entry) => entry.id === playerId);
  if (!player) {
    return [];
  }

  return player.hand.slice(0, Math.max(2, game.blackPick));
}

function applyAction(game: HostGameState, action: Action, step: number): void {
  switch (action.kind) {
    case "start-game":
      startGame(game);
      return;
    case "start-next-round":
      startNextRound(game);
      return;
    case "skip-round":
      skipCurrentRound(game);
      return;
    case "expire-judging":
      expireJudging(game);
      return;
    case "expire-winner":
      expireWinnerSelection(game);
      return;
    case "process-deadline":
      if (game.submissionDeadlineAt !== null) {
        game.submissionDeadlineAt = FUZZ_NOW - 1;
      }
      processRoundDeadline(game, FUZZ_NOW);
      return;
    case "expire-disconnect": {
      const player = game.players.find((entry) => entry.id === action.playerId);
      if (!player || player.connected) {
        return;
      }
      player.disconnectDeadlineAt = FUZZ_NOW - 1;
      removeDisconnectedPlayer(game, action.playerId);
      return;
    }
    case "raise":
      setRaisedCardsForPlayer(
        game,
        action.playerId,
        action.mode === "valid"
          ? validCardIds(game, action.playerId)
          : action.mode === "clear"
            ? []
            : invalidCardIds(game, action.playerId)
      );
      return;
    case "submit":
      submitCardsForPlayer(
        game,
        action.playerId,
        action.mode === "valid"
          ? validCardIds(game, action.playerId)
          : action.mode === "valid-multipick"
            ? validMultiPickCardIds(game, action.playerId)
            : action.mode === "raised"
              ? (game.players.find((entry) => entry.id === action.playerId)
                  ?.raisedCardIds ?? [])
              : action.mode === "duplicate"
                ? Array.from(
                    { length: Math.max(1, game.blackPick) },
                    () =>
                      game.players.find((entry) => entry.id === action.playerId)
                        ?.hand[0]
                  ).filter((cardId): cardId is string => Boolean(cardId))
                : invalidCardIds(game, action.playerId),
        `submission-${step}`
      );
      return;
    case "reveal": {
      const judgeId = game.judgeId ?? "host";
      const submission =
        game.submissions[action.index % Math.max(1, game.submissions.length)];
      if (submission) {
        revealSubmissionForPlayer(game, judgeId, submission.id);
      }
      return;
    }
    case "pick": {
      const judgeId = game.judgeId ?? "host";
      const submission =
        game.submissions[action.index % Math.max(1, game.submissions.length)];
      if (submission) {
        pickSubmissionForPlayer(game, judgeId, submission.id);
      }
      return;
    }
    case "disconnect": {
      const player = game.players.find((entry) => entry.id === action.playerId);
      if (player?.connectionId) {
        handleHostDisconnect(game, player.connectionId);
      }
      return;
    }
    case "remove-disconnected":
      removeDisconnectedPlayer(game, action.playerId);
      return;
    case "reconnect": {
      const existing = game.players.find(
        (entry) => entry.id === action.playerId
      );
      reconnectOrCreatePlayer(
        game,
        `reconn-${step}-${action.playerId}`,
        action.playerId,
        existing?.reconnectToken ?? `token-${action.playerId}`,
        existing?.sessionId ?? `session-${action.playerId}`,
        `Player ${action.playerId}`
      );
      return;
    }
  }
}

function replayActions(
  game: HostGameState,
  actions: ActionSequence,
  assertStep?: (previousGame: HostGameState, nextGame: HostGameState) => void
): void {
  actions.forEach((action, index) => {
    const previousGame = structuredClone(game);
    applyAction(game, action, index);
    assertStep?.(previousGame, game);
  });
}

function formatActionSequence(actions: ActionSequence): string {
  return JSON.stringify(actions, null, 2);
}

function assertInvariants(game: HostGameState): void {
  assert.equal(
    game.players.length,
    new Set(game.players.map((player) => player.id)).size
  );
  assert.equal(
    game.participantIds.length,
    new Set(game.participantIds).size,
    "participant ids must stay unique"
  );

  for (const participantId of game.participantIds) {
    assert.ok(
      game.players.some((player) => player.id === participantId),
      `participant ${participantId} must exist`
    );
  }

  if (game.judgeId !== null) {
    assert.ok(
      game.players.some((player) => player.id === game.judgeId),
      "judge must exist"
    );
    assert.equal(
      game.participantIds.includes(game.judgeId),
      false,
      "judge must not be a participant"
    );
  }

  for (const player of game.players) {
    assert.ok(player.score >= 0, `player ${player.id} score must stay >= 0`);
    if (player.connected) {
      assert.notEqual(
        player.connectionId,
        null,
        `connected player ${player.id} must have a connection id`
      );
    }
  }

  assert.equal(
    game.submissions.length,
    new Set(game.submissions.map((submission) => submission.playerId)).size,
    "at most one submission per player"
  );

  for (const submission of game.submissions) {
    assert.ok(
      game.players.some((player) => player.id === submission.playerId),
      `submission player ${submission.playerId} must exist`
    );
    assert.ok(
      game.participantIds.includes(submission.playerId),
      `submission player ${submission.playerId} must remain a participant`
    );
    assert.equal(
      submission.cardIds.length,
      new Set(submission.cardIds).size,
      "submission card ids must stay unique"
    );
  }

  const submissionIds = new Set(
    game.submissions.map((submission) => submission.id)
  );
  for (const revealedId of game.revealedSubmissionIds) {
    assert.ok(submissionIds.has(revealedId), "revealed submission must exist");
  }

  if (game.lastWinnerId !== null) {
    assert.ok(
      game.players.some((player) => player.id === game.lastWinnerId),
      "winner must exist"
    );
    assert.ok(
      game.submissions.some(
        (submission) => submission.playerId === game.lastWinnerId
      ),
      "winner must belong to a submission from the round"
    );
  }

  for (const player of game.players) {
    assert.equal(
      player.hand.length,
      new Set(player.hand).size,
      `player ${player.id} hand must not contain duplicates`
    );
    assert.equal(
      player.raisedCardIds.length,
      new Set(player.raisedCardIds).size,
      `player ${player.id} raised cards must stay unique`
    );
    for (const cardId of player.raisedCardIds) {
      assert.ok(
        player.hand.includes(cardId),
        `player ${player.id} raised card ${cardId} must still be in hand`
      );
    }
    if (!player.connected) {
      assert.equal(
        player.connectionId,
        null,
        "disconnected player must not keep a live connection id"
      );
    }
  }

  const allHandCards = game.players.flatMap((player) => player.hand);
  assert.equal(
    allHandCards.length,
    new Set(allHandCards).size,
    "white cards must not exist in more than one player hand"
  );
  const allSubmittedCards = game.submissions.flatMap(
    (submission) => submission.cardIds
  );
  assert.equal(
    allSubmittedCards.length,
    new Set(allSubmittedCards).size,
    "white cards must not appear in more than one submission"
  );
  const drawPileSet = new Set(game.whiteDrawPile);
  assert.equal(
    drawPileSet.size,
    game.whiteDrawPile.length,
    "white draw pile must not contain duplicates"
  );
  for (const cardId of [
    ...allHandCards,
    ...allSubmittedCards,
    ...game.whiteDiscard
  ]) {
    assert.equal(
      drawPileSet.has(cardId),
      false,
      `white draw pile must not still contain active/discarded card ${cardId}`
    );
  }
  const blackDrawSet = new Set(game.blackDrawPile.map((entry) => entry.id));
  assert.equal(
    blackDrawSet.size,
    game.blackDrawPile.length,
    "black draw pile must not contain duplicates"
  );
  if (game.blackCardId !== null) {
    assert.equal(
      blackDrawSet.has(game.blackCardId),
      false,
      "current black card must not still be in the black draw pile"
    );
  }
  for (const entry of game.blackDiscard) {
    assert.equal(
      blackDrawSet.has(entry.id),
      false,
      `black draw pile must not still contain discarded black card ${entry.id}`
    );
  }

  if (game.phase === "submitting") {
    assert.ok(game.started, "submitting implies started");
    assert.notEqual(game.judgeId, null, "submitting requires a judge");
    assert.notEqual(
      game.submissionDeadlineAt,
      null,
      "submitting requires a deadline"
    );
    assert.equal(
      game.revealedSubmissionIds.length,
      0,
      "submitting must not keep revealed submissions"
    );
  }

  if (game.phase === "judging") {
    assert.ok(game.submissions.length > 0, "judging requires submissions");
    assert.notEqual(game.judgeId, null, "judging requires a judge");
    assert.notEqual(
      game.submissionDeadlineAt,
      null,
      "judging requires a deadline"
    );
    assert.equal(
      game.winnerSelectionClosed,
      false,
      "judging must not close winner selection"
    );
    assert.ok(
      game.revealedSubmissionIds.length <= game.submissions.length,
      "judging cannot reveal more submissions than exist"
    );
  }

  if (game.phase === "result" && game.started) {
    assert.notEqual(
      game.submissionDeadlineAt,
      null,
      "result phase must keep the next deadline armed"
    );
  }

  for (const player of game.players) {
    const sync = buildSyncView(
      "room-fuzz",
      "Fuzz Room",
      game,
      player.id,
      FUZZ_NOW
    );
    assert.equal(sync.selfPlayerId, player.id);
    assert.equal(sync.players.length, game.players.length);
    assert.equal(
      sync.canJudge,
      game.judgeId === player.id && game.phase === "judging",
      `sync canJudge must match raw state for ${player.id}`
    );
    assert.equal(
      sync.canSubmit,
      game.phase === "submitting" &&
        game.judgeId !== player.id &&
        game.participantIds.includes(player.id) &&
        !game.submissions.some(
          (submission) => submission.playerId === player.id
        ),
      `sync canSubmit must match raw state for ${player.id}`
    );
    assert.equal(
      Boolean(sync.canPickWinner),
      game.phase === "result" &&
        game.judgeId === player.id &&
        !game.lastWinnerId &&
        !game.winnerSelectionClosed &&
        game.submissions.length > 0,
      `sync canPickWinner must match raw state for ${player.id}`
    );
  }
}

function assertTransitionInvariants(
  previousGame: HostGameState,
  nextGame: HostGameState
): void {
  const previousScoreTotal = previousGame.players.reduce(
    (total, player) => total + player.score,
    0
  );
  const nextScoreTotal = nextGame.players.reduce(
    (total, player) => total + player.score,
    0
  );
  const scoreDelta = nextScoreTotal - previousScoreTotal;

  assert.ok(
    scoreDelta >= 0 && scoreDelta <= 1,
    "score total can increase by at most one per step"
  );

  if (scoreDelta === 1) {
    assert.notEqual(
      nextGame.lastWinnerId,
      null,
      "score increase requires a winner"
    );
    assert.ok(
      nextGame.submissions.some(
        (submission) => submission.playerId === nextGame.lastWinnerId
      ),
      "score increase winner must belong to a current-round submission"
    );
  }

  assert.ok(nextGame.round >= 0, "round number must stay non-negative");

  if (nextGame.round > previousGame.round) {
    assert.equal(
      nextGame.submissions.length,
      0,
      "new round must start with no submissions"
    );
    assert.equal(
      nextGame.revealedSubmissionIds.length,
      0,
      "new round must start with no revealed submissions"
    );
    assert.equal(
      nextGame.lastWinnerId,
      null,
      "new round must clear the winner"
    );
  }
}

const playerIdArbitrary = fc.constantFrom(...PLAYER_IDS);
const actionArbitrary: fc.Arbitrary<Action> = fc.oneof(
  { weight: 2, arbitrary: fc.constant({ kind: "start-game" }) },
  { weight: 1, arbitrary: fc.constant({ kind: "start-next-round" }) },
  { weight: 1, arbitrary: fc.constant({ kind: "skip-round" }) },
  { weight: 2, arbitrary: fc.constant({ kind: "expire-judging" }) },
  { weight: 2, arbitrary: fc.constant({ kind: "expire-winner" }) },
  { weight: 4, arbitrary: fc.constant({ kind: "process-deadline" }) },
  {
    weight: 4,
    arbitrary: fc.record({
      kind: fc.constant<"raise">("raise"),
      playerId: playerIdArbitrary,
      mode: fc.constantFrom<"valid" | "invalid" | "clear">(
        "valid",
        "valid",
        "invalid",
        "clear"
      )
    })
  },
  {
    weight: 5,
    arbitrary: fc.record({
      kind: fc.constant<"submit">("submit"),
      playerId: playerIdArbitrary,
      mode: fc.constantFrom<
        "valid" | "raised" | "invalid" | "duplicate" | "valid-multipick"
      >("valid", "valid", "raised", "invalid", "duplicate", "valid-multipick")
    })
  },
  {
    weight: 2,
    arbitrary: fc.record({
      kind: fc.constant<"reveal">("reveal"),
      index: fc.nat(8)
    })
  },
  {
    weight: 2,
    arbitrary: fc.record({
      kind: fc.constant<"pick">("pick"),
      index: fc.nat(8)
    })
  },
  {
    weight: 4,
    arbitrary: fc.record({
      kind: fc.constant<"disconnect">("disconnect"),
      playerId: playerIdArbitrary
    })
  },
  {
    weight: 4,
    arbitrary: fc.record({
      kind: fc.constant<"remove-disconnected">("remove-disconnected"),
      playerId: playerIdArbitrary
    })
  },
  {
    weight: 4,
    arbitrary: fc.record({
      kind: fc.constant<"expire-disconnect">("expire-disconnect"),
      playerId: playerIdArbitrary
    })
  },
  {
    weight: 3,
    arbitrary: fc.record({
      kind: fc.constant<"reconnect">("reconnect"),
      playerId: playerIdArbitrary
    })
  }
);

const reconnectablePlayerIdArbitrary = fc.constantFrom<
  "host" | "alice" | "bob" | "carol"
>("host", "alice", "bob", "carol");

const disconnectScenarioArbitrary: fc.Arbitrary<ActionSequence> = fc.oneof(
  fc
    .record({
      playerId: reconnectablePlayerIdArbitrary
    })
    .map(
      ({ playerId }) =>
        [
          { kind: "disconnect", playerId },
          { kind: "reconnect", playerId }
        ] satisfies ActionSequence
    ),
  fc
    .record({
      playerId: reconnectablePlayerIdArbitrary
    })
    .map(
      ({ playerId }) =>
        [
          { kind: "disconnect", playerId },
          { kind: "expire-disconnect", playerId }
        ] satisfies ActionSequence
    ),
  fc
    .record({
      playerId: reconnectablePlayerIdArbitrary
    })
    .map(
      ({ playerId }) =>
        [
          { kind: "disconnect", playerId },
          { kind: "remove-disconnected", playerId },
          { kind: "reconnect", playerId }
        ] satisfies ActionSequence
    ),
  fc
    .record({
      playerId: reconnectablePlayerIdArbitrary
    })
    .map(
      ({ playerId }) =>
        [
          { kind: "disconnect", playerId },
          { kind: "reconnect", playerId },
          { kind: "disconnect", playerId },
          { kind: "expire-disconnect", playerId }
        ] satisfies ActionSequence
    ),
  fc
    .record({
      playerId: reconnectablePlayerIdArbitrary
    })
    .map(
      ({ playerId }) =>
        [
          { kind: "disconnect", playerId },
          { kind: "process-deadline" },
          { kind: "reconnect", playerId }
        ] satisfies ActionSequence
    )
);

const disconnectHeavySequenceArbitrary: fc.Arbitrary<ActionSequence> = fc
  .array(
    fc.oneof(
      { weight: 2, arbitrary: actionArbitrary.map((action) => [action]) },
      { weight: 5, arbitrary: disconnectScenarioArbitrary }
    ),
    { minLength: 6, maxLength: 24 }
  )
  .map((chunks) => chunks.flat());

test("fuzz core game flow invariants hold across random action sequences", () => {
  fc.assert(
    fc.property(
      fc.array(actionArbitrary, { minLength: 10, maxLength: 80 }),
      (actions) => {
        const game = createGame();
        assertInvariants(game);
        replayActions(game, actions, (previousGame, nextGame) => {
          assertTransitionInvariants(previousGame, nextGame);
          assertInvariants(nextGame);
        });
      }
    ),
    {
      numRuns: GAME_FUZZ_RUNS,
      seed: GAME_FUZZ_SEED,
      verbose: process.env.FAST_CHECK_VERBOSE === "1"
    }
  );
});

test("fuzz disconnect and reconnect heavy game flow scenarios", () => {
  fc.assert(
    fc.property(disconnectHeavySequenceArbitrary, (actions) => {
      const game = createGame();
      assertInvariants(game);
      replayActions(game, actions, (previousGame, nextGame) => {
        assertTransitionInvariants(previousGame, nextGame);
        assertInvariants(nextGame);
      });
    }),
    {
      numRuns: GAME_FUZZ_DISCONNECT_RUNS,
      seed: GAME_FUZZ_DISCONNECT_SEED,
      verbose: process.env.FAST_CHECK_VERBOSE === "1"
    }
  );
});

test("replayActions replays a shrunk counterexample deterministically", () => {
  const actions: ActionSequence = [
    { kind: "start-game" },
    { kind: "disconnect", playerId: "alice" },
    { kind: "reconnect", playerId: "alice" },
    { kind: "process-deadline" }
  ];
  const game = createGame();

  replayActions(game, actions, (previousGame, nextGame) => {
    assertTransitionInvariants(previousGame, nextGame);
    assertInvariants(nextGame);
  });

  assert.ok(formatActionSequence(actions).includes('"kind": "disconnect"'));
});

function parseEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
