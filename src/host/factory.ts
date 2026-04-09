import { blackCards, whiteCards } from "../cards/index.js";
import type { HostGameState } from "../types.js";
import { addHostPlayer } from "../game/submissions.js";
import { randomId, seedToState, shuffleWithGame } from "../utils/random.js";
import type { HostRuntime } from "./runtime.js";

const DEFAULT_COUNTDOWN_MS = 30_000;

export function createHostRuntime(
  username: string,
  seed: string,
  countdownMs = DEFAULT_COUNTDOWN_MS
): HostRuntime {
  const selfPlayerId = randomId("player");
  const reconnectToken = randomId("token");
  const sessionId = randomId("guest-session");

  const state: HostGameState = {
    seed,
    randomState: seedToState(seed),
    countdownMs,
    started: false,
    phase: "lobby",
    round: 0,
    submissionDeadlineAt: null,
    winnerSelectionClosed: false,
    votingClosed: false,
    announcement: "",
    blackCardId: null,
    blackPick: 1,
    judgeId: null,
    participantIds: [],
    lastWinnerId: null,
    judgeCursor: -1,
    revealedSubmissionIds: [],
    revealOrderIds: [],
    highlightedSubmissionId: null,
    allVotesInAt: null,
    votesByPlayerId: {},
    winnerPlayerIds: [],
    submissions: [],
    players: [],
    blackDrawPile: shuffleWithGame(
      blackCards.map((card) => ({ id: card.id, pick: card.pick })),
      { randomState: seedToState(seed) }
    ),
    blackDiscard: [],
    whiteDrawPile: [],
    whiteDiscard: []
  };

  state.whiteDrawPile = shuffleWithGame(
    whiteCards.map((card) => card.id),
    state
  );

  addHostPlayer(state, selfPlayerId, username, reconnectToken, sessionId, null);

  return {
    roomId: randomId("room"),
    roomName: `${username}'s table`,
    peerId: randomId("host"),
    selfPlayerId,
    seed,
    connections: new Map(),
    transportHandle: null,
    roundTimerIntervalId: null,
    pendingDisconnects: new Map(),
    state
  };
}
