import assert from "node:assert/strict";
import test from "node:test";

import type { HostGameState, HostPlayer } from "../types.js";
import { processRoundDeadline } from "./deadlines.js";
import {
  expireJudging,
  expireWinnerSelection,
  forceReveal,
  skipCurrentRound,
  startGame,
  startNextRound
} from "./rounds.js";
import {
  handleHostDisconnect,
  pickSubmissionForPlayer,
  revealSubmissionForPlayer,
  removeDisconnectedPlayer,
  reconnectOrCreatePlayer,
  submitCardsForPlayer
} from "./submissions.js";
import { buildSyncView } from "./sync.js";

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
  const players = overrides.players ?? [
    createPlayer("host"),
    createPlayer("alice"),
    createPlayer("bob")
  ];

  return {
    seed: "unit-seed",
    randomState: 12345,
    countdownMs: 30_000,
    started: false,
    phase: "lobby",
    round: 0,
    submissionDeadlineAt: null,
    winnerSelectionClosed: false,
    votingClosed: false,
    announcement: "Lobby",
    blackCardId: null,
    blackPick: 1,
    judgeId: null,
    participantIds: [],
    lastWinnerId: null,
    judgeCursor: -1,
    votesByPlayerId: {},
    winnerPlayerIds: [],
    submissions: [],
    revealedSubmissionIds: [],
    players,
    blackDrawPile: [
      { id: "black-02", pick: 2 },
      { id: "black-01", pick: 1 }
    ],
    blackDiscard: [],
    whiteDrawPile: Array.from(
      { length: 40 },
      (_, index) => `white-${index + 1}`
    ),
    whiteDiscard: [],
    ...overrides
  };
}

test("startGame starts round one, chooses a judge, and fills hands", () => {
  const game = createGame();

  startGame(game);

  assert.equal(game.started, true);
  assert.equal(game.phase, "submitting");
  assert.equal(game.round, 1);
  assert.equal(game.blackCardId, "black-01");
  assert.equal(game.blackPick, 1);
  assert.ok(game.judgeId);
  assert.equal(game.participantIds.length, 2);
  assert.ok(game.announcement.includes("is judging."));

  for (const player of game.players) {
    assert.equal(player.hand.length, 10);
  }
});

test("submitCardsForPlayer keeps played cards in hand until the next round", () => {
  const game = createGame({
    started: true,
    phase: "submitting",
    round: 1,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    players: [
      createPlayer("host", { hand: ["white-h1", "white-h2"] }),
      createPlayer("alice", { hand: ["white-a1", "white-a2"] }),
      createPlayer("bob", { hand: ["white-b1", "white-b2"] })
    ],
    whiteDrawPile: Array.from(
      { length: 20 },
      (_, index) => `white-next-${index + 1}`
    )
  });

  submitCardsForPlayer(game, "alice", ["white-a1"], "submission-1");
  assert.equal(game.phase, "submitting");
  assert.equal(game.submissions.length, 1);
  assert.deepEqual(game.whiteDiscard, ["white-a1"]);
  assert.deepEqual(game.players.find((player) => player.id === "alice")?.hand, [
    "white-a1",
    "white-a2"
  ]);
  assert.deepEqual(
    game.players.find((player) => player.id === "alice")?.raisedCardIds,
    ["white-a1"]
  );
  assert.ok(game.announcement.includes("1 submission remaining."));

  submitCardsForPlayer(game, "bob", ["white-b1"], "submission-2");
  assert.equal(game.phase, "judging");
  assert.equal(game.submissions.length, 2);
  assert.equal(
    game.announcement,
    "All submissions are in. Judge, reveal the cards."
  );
  assert.notEqual(game.submissionDeadlineAt, null);
  assert.equal(
    game.players
      .find((player) => player.id === "bob")
      ?.hand.includes("white-b1"),
    true
  );
});

test("startNextRound replaces submitted cards after the round finishes", () => {
  const game = createGame({
    started: true,
    phase: "result",
    round: 1,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    revealedSubmissionIds: ["submission-1", "submission-2"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] },
      { id: "submission-2", playerId: "bob", cardIds: ["white-b1"] }
    ],
    players: [
      createPlayer("host", { hand: ["white-h1", "white-h2"] }),
      createPlayer("alice", {
        hand: ["white-a1", "white-a2"],
        raisedCardIds: ["white-a1"]
      }),
      createPlayer("bob", {
        hand: ["white-b1", "white-b2"],
        raisedCardIds: ["white-b1"]
      })
    ],
    whiteDrawPile: Array.from(
      { length: 40 },
      (_, index) => `white-next-${index + 1}`
    )
  });

  pickSubmissionForPlayer(game, "host", "submission-1");

  assert.equal(game.phase, "result");
  assert.equal(game.lastWinnerId, "alice");
  assert.deepEqual(game.players.find((player) => player.id === "alice")?.hand, [
    "white-a1",
    "white-a2"
  ]);
  assert.deepEqual(game.players.find((player) => player.id === "bob")?.hand, [
    "white-b1",
    "white-b2"
  ]);

  startNextRound(game);

  assert.equal(
    game.players.find((player) => player.id === "alice")?.hand.length,
    10
  );
  assert.equal(
    game.players.find((player) => player.id === "bob")?.hand.length,
    10
  );
  assert.equal(
    game.players
      .find((player) => player.id === "alice")
      ?.hand.includes("white-a1"),
    false
  );
  assert.equal(
    game.players
      .find((player) => player.id === "bob")
      ?.hand.includes("white-b1"),
    false
  );
});

test("revealing the final submission ends the round but keeps submitted cards until restart", () => {
  const game = createGame({
    started: true,
    phase: "judging",
    round: 1,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] },
      { id: "submission-2", playerId: "bob", cardIds: ["white-b1"] }
    ],
    players: [
      createPlayer("host", { hand: ["white-h1", "white-h2"] }),
      createPlayer("alice", {
        hand: ["white-a1", "white-a2"],
        raisedCardIds: ["white-a1"]
      }),
      createPlayer("bob", {
        hand: ["white-b1", "white-b2"],
        raisedCardIds: ["white-b1"]
      })
    ],
    whiteDrawPile: Array.from(
      { length: 40 },
      (_, index) => `white-next-${index + 1}`
    )
  });

  pickSubmissionForPlayer(game, "host", "submission-1");
  assert.equal(game.phase, "judging");

  revealSubmissionForPlayer(game, "host", "submission-1");
  assert.deepEqual(game.revealedSubmissionIds, ["submission-1"]);
  assert.equal(game.announcement, "1 hidden submission remaining.");

  revealSubmissionForPlayer(game, "host", "submission-2");
  assert.deepEqual(game.revealedSubmissionIds, [
    "submission-1",
    "submission-2"
  ]);
  assert.equal(game.phase, "result");
  assert.equal(game.announcement, "All cards revealed.");
  assert.equal(game.lastWinnerId, null);
  assert.equal(game.winnerSelectionClosed, false);
  assert.notEqual(game.submissionDeadlineAt, null);
  assert.deepEqual(game.players.find((player) => player.id === "alice")?.hand, [
    "white-a1",
    "white-a2"
  ]);
  assert.deepEqual(
    game.players.find((player) => player.id === "alice")?.raisedCardIds,
    ["white-a1"]
  );
  assert.deepEqual(game.players.find((player) => player.id === "bob")?.hand, [
    "white-b1",
    "white-b2"
  ]);
  assert.equal(
    game.players.find((player) => player.id === "bob")?.raisedCardIds?.[0],
    "white-b1"
  );
});

test("pickSubmissionForPlayer closes voting when the last vote arrives", () => {
  const game = createGame({
    started: true,
    phase: "result",
    round: 1,
    blackCardId: "black-01",
    blackPick: 1,
    participantIds: ["host", "alice", "bob"],
    revealedSubmissionIds: ["submission-1", "submission-2"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] },
      { id: "submission-2", playerId: "bob", cardIds: ["white-b1"] }
    ],
    votesByPlayerId: {
      host: "submission-2",
      alice: "submission-2"
    }
  });

  pickSubmissionForPlayer(game, "bob", "submission-1");

  assert.equal(game.phase, "result");
  assert.equal(game.lastWinnerId, "bob");
  assert.equal(game.winnerSelectionClosed, true);
  assert.equal(game.votingClosed, true);
  assert.equal(game.submissionDeadlineAt, null);
  assert.equal(game.announcement, "Player bob wins this round.");
});

test("pickSubmissionForPlayer lets players change their vote before voting closes", () => {
  const game = createGame({
    started: true,
    phase: "result",
    round: 1,
    winnerSelectionClosed: false,
    blackCardId: "black-01",
    blackPick: 1,
    participantIds: ["host", "alice", "bob"],
    revealedSubmissionIds: ["submission-1", "submission-2"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] },
      { id: "submission-2", playerId: "bob", cardIds: ["white-b1"] }
    ]
  });

  pickSubmissionForPlayer(game, "host", "submission-1");
  pickSubmissionForPlayer(game, "host", "submission-2");

  assert.equal(game.votesByPlayerId?.host, "submission-2");
  assert.equal(game.votingClosed, false);
  assert.equal(game.lastWinnerId, null);
});

test("expireWinnerSelection closes the round with no winner after the countdown when nobody votes", () => {
  const game = createGame({
    started: true,
    phase: "result",
    round: 1,
    submissionDeadlineAt: Date.now() - 1,
    winnerSelectionClosed: false,
    blackCardId: "black-01",
    blackPick: 1,
    participantIds: ["host", "alice", "bob"],
    revealedSubmissionIds: ["submission-1", "submission-2"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] },
      { id: "submission-2", playerId: "bob", cardIds: ["white-b1"] }
    ],
    votesByPlayerId: {}
  });

  expireWinnerSelection(game);
  pickSubmissionForPlayer(game, "host", "submission-1");

  assert.equal(game.lastWinnerId, null);
  assert.equal(game.winnerPlayerIds?.length, 0);
  assert.equal(game.winnerSelectionClosed, true);
  assert.equal(game.votingClosed, true);
  assert.equal(game.submissionDeadlineAt, null);
  assert.equal(
    game.announcement,
    "Vote countdown ended. No one wins this round."
  );
});

test("buildSyncView keeps player names and vote totals visible after voting closes with no winner", () => {
  const game = createGame({
    started: true,
    phase: "result",
    round: 1,
    submissionDeadlineAt: null,
    winnerSelectionClosed: true,
    votingClosed: true,
    blackCardId: "black-01",
    blackPick: 1,
    participantIds: ["host", "alice", "bob"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] },
      { id: "submission-2", playerId: "bob", cardIds: ["white-b1"] }
    ],
    players: [
      createPlayer("host", { username: "Host" }),
      createPlayer("alice", { username: "Alice" }),
      createPlayer("bob", { username: "Bob" })
    ],
    votesByPlayerId: {},
    winnerPlayerIds: [],
    announcement: "Vote countdown ended. No one wins this round."
  });

  const sync = buildSyncView("room-1", "Test Room", game, "host");

  assert.equal(sync.votingClosed, true);
  assert.equal(sync.winnerPlayerIds?.length, 0);
  assert.deepEqual(
    sync.submissions.map((submission) => ({
      playerName: submission.playerName,
      voteCount: submission.voteCount,
      winner: submission.winner
    })),
    [
      {
        playerName: "Alice",
        voteCount: 0,
        winner: false
      },
      {
        playerName: "Bob",
        voteCount: 0,
        winner: false
      }
    ]
  );
});

test("expireWinnerSelection awards every tied top submission a point", () => {
  const game = createGame({
    started: true,
    phase: "result",
    round: 1,
    submissionDeadlineAt: Date.now() - 1,
    winnerSelectionClosed: false,
    blackCardId: "black-01",
    blackPick: 1,
    participantIds: ["host", "alice", "bob"],
    revealedSubmissionIds: ["submission-1", "submission-2"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] },
      { id: "submission-2", playerId: "bob", cardIds: ["white-b1"] }
    ],
    votesByPlayerId: {
      host: "submission-1",
      alice: "submission-2"
    }
  });

  expireWinnerSelection(game);

  assert.deepEqual(game.winnerPlayerIds, ["alice", "bob"]);
  assert.equal(game.lastWinnerId, null);
  assert.equal(game.players.find((player) => player.id === "alice")?.score, 1);
  assert.equal(game.players.find((player) => player.id === "bob")?.score, 1);
});

test("autoSubmitRaisedCards submits each valid raised selection at timeout", async () => {
  const { autoSubmitRaisedCards } = await import("./submissions.js");
  const game = createGame({
    started: true,
    phase: "submitting",
    round: 1,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    players: [
      createPlayer("host", { hand: ["white-h1", "white-h2"] }),
      createPlayer("alice", {
        hand: ["white-a1", "white-a2"],
        raisedCardIds: ["white-a2"]
      }),
      createPlayer("bob", {
        hand: ["white-b1", "white-b2"],
        raisedCardIds: ["white-b1"]
      })
    ]
  });

  autoSubmitRaisedCards(game);

  assert.equal(game.phase, "judging");
  assert.equal(game.submissions.length, 2);
  assert.deepEqual(
    game.players.find((player) => player.id === "alice")?.raisedCardIds,
    ["white-a2"]
  );
  assert.deepEqual(
    game.players.find((player) => player.id === "bob")?.raisedCardIds,
    ["white-b1"]
  );
});

test("setRaisedCardsForPlayer immediately starts judging when every participant is ready", async () => {
  const { setRaisedCardsForPlayer } = await import("./submissions.js");
  const game = createGame({
    started: true,
    phase: "submitting",
    round: 1,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    players: [
      createPlayer("host", { hand: ["white-h1", "white-h2"] }),
      createPlayer("alice", {
        hand: ["white-a1", "white-a2"],
        raisedCardIds: ["white-a2"]
      }),
      createPlayer("bob", { hand: ["white-b1", "white-b2"] })
    ]
  });

  setRaisedCardsForPlayer(game, "bob", ["white-b1"]);

  assert.equal(game.phase, "judging");
  assert.equal(game.submissions.length, 2);
  assert.deepEqual(
    game.players.find((player) => player.id === "alice")?.raisedCardIds,
    ["white-a2"]
  );
  assert.deepEqual(
    game.players.find((player) => player.id === "bob")?.raisedCardIds,
    ["white-b1"]
  );
  assert.equal(
    game.announcement,
    "All submissions are in. Judge, reveal the cards."
  );
});

test("forceReveal ends the round with submitted cards already revealed", () => {
  const game = createGame({
    started: true,
    phase: "submitting",
    round: 2,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] }
    ]
  });

  forceReveal(game, "Submission countdown ended. Revealing submitted cards.");

  assert.equal(game.phase, "result");
  assert.deepEqual(game.revealedSubmissionIds, ["submission-1"]);
  assert.equal(
    game.announcement,
    "Submission countdown ended. Revealing submitted cards."
  );
  assert.equal(game.lastWinnerId, null);
  assert.equal(game.winnerSelectionClosed, false);
  assert.notEqual(game.submissionDeadlineAt, null);
});

test("skipCurrentRound preserves submitted cards in player hands", () => {
  const game = createGame({
    started: true,
    phase: "submitting",
    round: 2,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] }
    ],
    players: [
      createPlayer("host", { hand: ["white-h1", "white-h2"] }),
      createPlayer("alice", { hand: ["white-a1", "white-a2"] }),
      createPlayer("bob", { hand: ["white-b1", "white-b2"] })
    ]
  });

  skipCurrentRound(game);
  startNextRound(game);

  assert.deepEqual(game.submissions, []);
  assert.equal(
    game.players
      .find((player) => player.id === "alice")
      ?.hand.includes("white-a1"),
    true
  );
  assert.equal(
    game.players.find((player) => player.id === "alice")?.hand.length,
    10
  );
});

test("expireJudging reveals all cards when the judge does not react", () => {
  const game = createGame({
    started: true,
    phase: "judging",
    round: 2,
    submissionDeadlineAt: Date.now() - 1,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] },
      { id: "submission-2", playerId: "bob", cardIds: ["white-b1"] }
    ],
    revealedSubmissionIds: ["submission-1"]
  });

  expireJudging(game);

  assert.equal(game.phase, "result");
  assert.deepEqual(game.revealedSubmissionIds, [
    "submission-1",
    "submission-2"
  ]);
  assert.equal(game.winnerSelectionClosed, false);
  assert.notEqual(game.submissionDeadlineAt, null);
  assert.equal(
    game.announcement,
    "Judge countdown ended. Revealing all cards."
  );
});

test("submitCardsForPlayer rejects duplicate card ids for multi-pick prompts", () => {
  const game = createGame({
    started: true,
    phase: "submitting",
    round: 1,
    blackCardId: "black-02",
    blackPick: 2,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    players: [
      createPlayer("host"),
      createPlayer("alice", { hand: ["white-a1", "white-a2"] }),
      createPlayer("bob", { hand: ["white-b1", "white-b2"] })
    ]
  });

  submitCardsForPlayer(game, "alice", ["white-a1", "white-a1"], "submission-1");

  assert.equal(game.submissions.length, 0);
  assert.deepEqual(game.players.find((player) => player.id === "alice")?.hand, [
    "white-a1",
    "white-a2"
  ]);
});

test("handleHostDisconnect marks the player offline without advancing the round", () => {
  const game = createGame({
    started: true,
    phase: "submitting",
    round: 2,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] }
    ],
    players: [
      createPlayer("host"),
      createPlayer("alice", { connectionId: "conn-alice" }),
      createPlayer("bob", { connectionId: "conn-bob" })
    ]
  });

  const disconnected = handleHostDisconnect(game, "conn-bob");

  assert.equal(disconnected?.id, "bob");
  assert.deepEqual(game.participantIds, ["alice", "bob"]);
  assert.equal(game.phase, "submitting");
  assert.equal(
    game.players.find((player) => player.id === "bob")?.connected,
    false
  );
});

test("removeDisconnectedPlayer times out an unreturned participant and advances the round", () => {
  const game = createGame({
    started: true,
    phase: "submitting",
    round: 2,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] }
    ],
    players: [
      createPlayer("host"),
      createPlayer("alice"),
      createPlayer("bob", {
        connected: false,
        connectionId: null,
        disconnectDeadlineAt: Date.now() + 10_000
      })
    ]
  });

  removeDisconnectedPlayer(game, "bob");

  assert.deepEqual(game.participantIds, ["alice"]);
  assert.equal(game.phase, "judging");
  assert.match(game.announcement, /All remaining submissions are in/);
  assert.notEqual(game.submissionDeadlineAt, null);
  assert.equal(
    game.players.some((player) => player.id === "bob"),
    true
  );
  assert.equal(
    game.players.find((player) => player.id === "bob")?.connected,
    false
  );
  assert.equal(
    game.players.find((player) => player.id === "bob")?.disconnectDeadlineAt,
    null
  );
});

test("removeDisconnectedPlayer forfeits the round when the judge times out", () => {
  const game = createGame({
    started: true,
    phase: "judging",
    round: 2,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "bob",
    participantIds: ["alice"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] }
    ],
    players: [
      createPlayer("host"),
      createPlayer("alice"),
      createPlayer("bob", {
        connected: false,
        connectionId: null,
        disconnectDeadlineAt: Date.now() + 10_000
      })
    ]
  });

  removeDisconnectedPlayer(game, "bob");

  assert.equal(game.phase, "result");
  assert.equal(game.lastWinnerId, null);
  assert.equal(game.judgeId, null);
  assert.deepEqual(game.submissions, []);
  assert.equal(game.winnerSelectionClosed, true);
  assert.equal(game.submissionDeadlineAt, null);
  assert.match(game.announcement, /Round forfeited/);
});

test("processRoundDeadline leaves a forfeited round waiting for the host", () => {
  const game = createGame({
    started: true,
    phase: "judging",
    round: 2,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "bob",
    participantIds: ["alice", "host"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] }
    ],
    players: [
      createPlayer("host", { hand: ["white-h1", "white-h2"] }),
      createPlayer("alice", { hand: ["white-a1", "white-a2"] }),
      createPlayer("bob", {
        hand: ["white-b1", "white-b2"],
        connected: false,
        connectionId: null,
        disconnectDeadlineAt: Date.now() + 10_000
      })
    ],
    whiteDrawPile: Array.from(
      { length: 40 },
      (_, index) => `white-next-${index + 1}`
    )
  });

  removeDisconnectedPlayer(game, "bob");
  assert.equal(game.phase, "result");
  assert.equal(game.submissionDeadlineAt, null);

  const processed = processRoundDeadline(game, Date.now());

  assert.equal(processed, false);
  assert.equal(game.phase, "result");
  assert.equal(game.started, true);
  assert.equal(game.round, 2);
  assert.equal(game.judgeId, null);
  assert.equal(game.participantIds.length, 0);
  assert.match(game.announcement, /Round forfeited/);
});

test("reconnectOrCreatePlayer preserves seat and hand for returning players", () => {
  const game = createGame({
    started: true,
    phase: "submitting",
    round: 3,
    players: [
      createPlayer("host"),
      createPlayer("alice", {
        username: "Alice",
        reconnectToken: "reconnect-alice",
        hand: ["white-a1", "white-a2"],
        connected: false,
        connectionId: null,
        disconnectDeadlineAt: Date.now() + 10_000
      }),
      createPlayer("bob")
    ]
  });

  const rejoined = reconnectOrCreatePlayer(
    game,
    "conn-returned",
    "alice",
    "reconnect-alice",
    "session-returned",
    "  Alice   Dev  "
  );

  assert.equal(rejoined.id, "alice");
  assert.equal(rejoined.username, "Alice Dev");
  assert.equal(rejoined.connectionId, "conn-returned");
  assert.equal(rejoined.connected, true);
  assert.equal(rejoined.disconnectDeadlineAt, null);
  assert.deepEqual(rejoined.hand, ["white-a1", "white-a2"]);
  assert.equal(game.players.length, 3);
  assert.equal(game.announcement, "Alice Dev rejoined the table.");
});

test("startNextRound falls back to a clean lobby state when too few connected players remain", () => {
  const game = createGame({
    started: true,
    phase: "result",
    round: 2,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] }
    ],
    players: [
      createPlayer("host", { connected: true }),
      createPlayer("alice", { connected: true }),
      createPlayer("bob", { connected: false, connectionId: null })
    ]
  });

  startNextRound(game);

  assert.equal(game.started, false);
  assert.equal(game.phase, "lobby");
  assert.equal(game.blackCardId, null);
  assert.equal(game.judgeId, null);
  assert.deepEqual(game.participantIds, []);
  assert.deepEqual(game.submissions, []);
});

test("startNextRound can keep the same judge when requested", () => {
  const game = createGame({
    started: true,
    phase: "result",
    round: 1,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    submissions: [
      { id: "submission-1", playerId: "alice", cardIds: ["white-a1"] }
    ]
  });

  startNextRound(game, { judgeIdOverride: "host" });

  assert.equal(game.round, 2);
  assert.equal(game.judgeId, "host");
});

test("buildSyncView exposes only judging submissions and local permissions", () => {
  const game = createGame({
    started: true,
    phase: "judging",
    round: 4,
    blackCardId: "black-02",
    blackPick: 2,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    lastWinnerId: "alice",
    revealedSubmissionIds: ["submission-1", "submission-2"],
    submissions: [
      {
        id: "submission-1",
        playerId: "alice",
        cardIds: ["white-a1", "white-a2"]
      },
      {
        id: "submission-2",
        playerId: "bob",
        cardIds: ["white-b1", "white-b2"]
      }
    ],
    players: [
      createPlayer("host", { hand: ["white-h1"] }),
      createPlayer("alice", { hand: ["white-a3"] }),
      createPlayer("bob", { hand: ["white-b3"] })
    ]
  });

  const judgeView = buildSyncView("room-1", "Test Room", game, "host");
  assert.equal(judgeView.canJudge, true);
  assert.equal(judgeView.canSubmit, false);
  assert.equal(judgeView.submissions.length, 2);
  assert.equal(
    judgeView.submissions.filter((submission) => submission.hidden).length,
    0
  );
  assert.equal(judgeView.players[0]?.disconnectSecondsLeft, null);

  revealSubmissionForPlayer(game, "host", "submission-1");
  revealSubmissionForPlayer(game, "host", "submission-2");

  const playerView = buildSyncView("room-1", "Test Room", game, "alice");
  assert.equal(playerView.canJudge, false);
  assert.equal(playerView.canSubmit, false);
  assert.deepEqual(playerView.hand, ["white-a3"]);
  assert.deepEqual(playerView.selfRaisedCardIds, []);
  assert.equal(playerView.lastWinnerId, "alice");
});

test("buildSyncView exposes hidden submissions only to the judge while submitting", () => {
  const game = createGame({
    started: true,
    phase: "submitting",
    round: 2,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    submissions: [
      {
        id: "submission-1",
        playerId: "alice",
        cardIds: ["white-a1"]
      }
    ],
    players: [
      createPlayer("host", { hand: ["white-h1"] }),
      createPlayer("alice", { hand: ["white-a2"] }),
      createPlayer("bob", { hand: ["white-b1"] })
    ]
  });

  const judgeView = buildSyncView("room-1", "Test Room", game, "host");
  const playerView = buildSyncView("room-1", "Test Room", game, "bob");

  assert.equal(judgeView.submissions.length, 1);
  assert.equal(judgeView.submissions[0]?.hidden, true);
  assert.equal(judgeView.submissions[0]?.cards, undefined);
  assert.equal(playerView.submissions.length, 1);
  assert.equal(playerView.submissions[0]?.hidden, true);
});

test("buildSyncView reveals judging submissions only after the judge reveals them", () => {
  const game = createGame({
    started: true,
    phase: "judging",
    round: 2,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    submissions: [
      {
        id: "submission-1",
        playerId: "alice",
        cardIds: ["white-a1"]
      },
      {
        id: "submission-2",
        playerId: "bob",
        cardIds: ["white-b1"]
      }
    ],
    players: [
      createPlayer("host", { hand: ["white-h1"] }),
      createPlayer("alice", { hand: ["white-a2"] }),
      createPlayer("bob", { hand: ["white-b2"] })
    ]
  });

  let judgeView = buildSyncView("room-1", "Test Room", game, "host");
  assert.equal(judgeView.submissions[0]?.hidden, true);
  assert.equal(judgeView.submissions[1]?.hidden, true);

  revealSubmissionForPlayer(game, "host", "submission-1");

  judgeView = buildSyncView("room-1", "Test Room", game, "host");
  const revealed = judgeView.submissions.find(
    (submission) => submission.id === "submission-1"
  );
  const stillHidden = judgeView.submissions.find(
    (submission) => submission.id === "submission-2"
  );
  assert.equal(revealed?.hidden, false);
  assert.deepEqual(revealed?.cardIds, ["white-a1"]);
  assert.equal(stillHidden?.hidden, true);
});

test("buildSyncView disables winner picking after the winner countdown expires", () => {
  const game = createGame({
    started: true,
    phase: "result",
    round: 2,
    submissionDeadlineAt: null,
    winnerSelectionClosed: true,
    blackCardId: "black-01",
    blackPick: 1,
    judgeId: "host",
    participantIds: ["alice", "bob"],
    revealedSubmissionIds: ["submission-1"],
    submissions: [
      {
        id: "submission-1",
        playerId: "alice",
        cardIds: ["white-a1"]
      }
    ]
  });

  const judgeView = buildSyncView("room-1", "Test Room", game, "host");

  assert.equal(judgeView.canPickWinner, false);
  assert.equal(judgeView.winnerSelectionClosed, true);
  assert.equal(judgeView.submissionSecondsLeft, null);
});
