import type { HostGameState, HostPlayer } from "../types.js";
import { randomId, sanitizeUsername, shuffleWithGame } from "../utils/index.js";
import { debugLog } from "../utils/debug.js";
import { ensurePlayerHand, hasSubmitted } from "./internal.js";
import {
  completeRoundAndArmNextRound,
  RESULT_TENSION_MS,
  startRevealPhase
} from "./rounds.js";

export function submitCardsForPlayer(
  game: HostGameState,
  playerId: string,
  cardIds: string[],
  submissionId: string
): void {
  const player = game.players.find((entry) => entry.id === playerId);

  if (!player || !game.blackCardId || game.phase !== "submitting") {
    return;
  }

  if (!game.participantIds.includes(playerId) || hasSubmitted(game, playerId)) {
    return;
  }

  if (cardIds.length !== game.blackPick) {
    return;
  }

  if (new Set(cardIds).size !== cardIds.length) {
    return;
  }

  const handSet = new Set(player.hand);
  if (!cardIds.every((cardId) => handSet.has(cardId))) {
    return;
  }

  player.raisedCardIds = [...cardIds];
  player.hand = player.hand.filter((cardId) => !cardIds.includes(cardId));
  game.whiteDiscard.push(...cardIds);

  game.submissions.push({
    id: submissionId,
    playerId,
    cardIds: [...cardIds]
  });

  debugLog("game", "submission recorded", {
    round: game.round,
    playerId,
    cardCount: cardIds.length,
    submitted: game.submissions.length,
    expected: game.participantIds.length
  });

  if (game.submissions.length >= game.participantIds.length) {
    game.submissions = shuffleWithGame([...game.submissions], game);
    startRevealPhase(game, "All cards are in. Revealing them one by one.");
  } else {
    const remaining = game.participantIds.length - game.submissions.length;
    game.announcement = `${remaining} submission${remaining === 1 ? "" : "s"} remaining.`;
  }
}

export function setRaisedCardsForPlayer(
  game: HostGameState,
  playerId: string,
  cardIds: string[]
): void {
  const player = game.players.find((entry) => entry.id === playerId);
  if (!player) {
    return;
  }

  if (
    game.phase !== "submitting" ||
    !game.participantIds.includes(playerId) ||
    hasSubmitted(game, playerId)
  ) {
    player.raisedCardIds = [];
    return;
  }

  if (new Set(cardIds).size !== cardIds.length) {
    return;
  }

  const handSet = new Set(player.hand);
  if (!cardIds.every((cardId) => handSet.has(cardId))) {
    return;
  }

  player.raisedCardIds = [...cardIds];
  debugLog("game", "raised cards updated", {
    round: game.round,
    playerId,
    cardCount: cardIds.length
  });

  if (allParticipantsReadyToSubmit(game)) {
    autoSubmitRaisedCards(game);
  }
}

export function autoSubmitRaisedCards(game: HostGameState): void {
  if (game.phase !== "submitting") {
    return;
  }

  for (const playerId of [...game.participantIds]) {
    if (game.phase !== "submitting") {
      return;
    }

    if (hasSubmitted(game, playerId)) {
      continue;
    }

    const player = findHostPlayerById(game, playerId);
    if (!player || player.raisedCardIds.length !== game.blackPick) {
      continue;
    }

    submitCardsForPlayer(
      game,
      playerId,
      [...player.raisedCardIds],
      randomId("submission")
    );
  }
}

export function pickSubmissionForPlayer(
  game: HostGameState,
  playerId: string,
  submissionId: string
): void {
  if (game.phase !== "result" || game.votingClosed) {
    return;
  }

  const chosen = game.submissions.find((entry) => entry.id === submissionId);
  if (!chosen || chosen.playerId === playerId) {
    return;
  }

  if (!game.participantIds.includes(playerId)) {
    return;
  }

  game.votesByPlayerId = {
    ...(game.votesByPlayerId ?? {}),
    [playerId]: submissionId
  };

  debugLog("game", "vote recorded", {
    round: game.round,
    voterId: playerId,
    submissionId
  });

  if (allEligibleVotesCast(game)) {
    if (game.allVotesInAt === null) {
      game.allVotesInAt = Date.now();
      game.highlightedSubmissionId = chosen.id;
      const remainingCountdownMs = Math.max(
        0,
        (game.submissionDeadlineAt ?? Date.now()) - Date.now()
      );
      game.submissionDeadlineAt =
        Date.now() + Math.min(remainingCountdownMs, RESULT_TENSION_MS);
      game.announcement = "All votes are in. Hold for the reveal...";
    }
  } else {
    game.allVotesInAt = null;
    game.highlightedSubmissionId = chosen.id;
    const remaining = countMissingVotes(game);
    game.announcement = `${remaining} vote${remaining === 1 ? "" : "s"} remaining.`;
  }
}

export function revealSubmissionForPlayer(
  game: HostGameState,
  playerId: string,
  submissionId: string
): void {
  pickSubmissionForPlayer(game, playerId, submissionId);
}

export function handleHostDisconnect(
  game: HostGameState,
  connectionId: string
): HostPlayer | null {
  const player = findHostPlayerByConnection(game, connectionId);
  if (!player) {
    return null;
  }

  player.connected = false;
  player.connectionId = null;
  debugLog("game", "player disconnected", {
    playerId: player.id,
    phase: game.phase
  });
  return player;
}

export function removeDisconnectedPlayer(
  game: HostGameState,
  playerId: string
): void {
  const player = findHostPlayerById(game, playerId);
  if (!player || player.connected) {
    return;
  }

  const playerName = player.username;
  const timedOutAnnouncement = (
    suffix = "will sit out until they return."
  ): string => `${playerName} did not rejoin in time and ${suffix}`;
  player.disconnectDeadlineAt = null;
  player.activeFromRound = Math.max(player.activeFromRound, game.round + 1);
  game.participantIds = game.participantIds.filter((id) => id !== playerId);
  const votesByPlayerId = game.votesByPlayerId ?? {};
  delete votesByPlayerId[playerId];
  game.votesByPlayerId = votesByPlayerId;

  for (const [voterId, submissionId] of Object.entries(votesByPlayerId)) {
    const votedSubmission = game.submissions.find(
      (submission) => submission.id === submissionId
    );
    if (votedSubmission?.playerId === playerId) {
      delete votesByPlayerId[voterId];
    }
  }

  if (game.phase === "submitting") {
    ensurePlayerHand(game, player.id);
    if (game.submissions.length >= game.participantIds.length) {
      game.submissions = shuffleWithGame([...game.submissions], game);
      startRevealPhase(
        game,
        `${playerName} disconnected. Revealing the submitted cards.`
      );
      return;
    }

    const remaining = Math.max(
      0,
      game.participantIds.length - game.submissions.length
    );
    game.announcement =
      remaining > 0
        ? `${timedOutAnnouncement("were removed from this round.")} ${remaining} submission${remaining === 1 ? "" : "s"} remaining.`
        : timedOutAnnouncement("were removed from this round.");
    return;
  }

  if (
    game.phase === "result" &&
    !game.votingClosed &&
    allEligibleVotesCast(game)
  ) {
    game.allVotesInAt = Date.now();
    game.submissionDeadlineAt = Date.now() + RESULT_TENSION_MS;
    game.announcement = `${playerName} disconnected. Hold for the reveal...`;
    return;
  }

  if (
    game.phase === "result" &&
    game.submissions.every((submission) => submission.playerId === playerId)
  ) {
    game.submissions = [];
    game.votesByPlayerId = {};
    completeRoundAndArmNextRound(
      game,
      timedOutAnnouncement("cleared the round.")
    );
    return;
  }

  game.announcement = timedOutAnnouncement();
}

export function reconnectOrCreatePlayer(
  game: HostGameState,
  connectionId: string,
  username: string,
  playerId: string,
  reconnectToken: string,
  sessionId: string
): HostPlayer {
  const reconnecting = game.players.find((entry) => entry.id === playerId);
  if (reconnecting) {
    reconnecting.connected = true;
    reconnecting.connectionId = connectionId;
    reconnecting.disconnectDeadlineAt = null;
    reconnecting.sessionId = sessionId;
    reconnecting.username = sanitizeUsername(username);
    ensurePlayerHand(game, reconnecting.id);
    return reconnecting;
  }

  return addHostPlayer(
    game,
    playerId,
    username,
    reconnectToken,
    sessionId,
    connectionId
  );
}

export function addHostPlayer(
  game: HostGameState,
  playerId: string,
  username: string,
  reconnectToken: string,
  sessionId: string,
  connectionId: string | null
): HostPlayer {
  const player: HostPlayer = {
    id: playerId,
    username: sanitizeUsername(username),
    score: 0,
    reconnectToken,
    sessionId,
    hand: [],
    raisedCardIds: [],
    connected: true,
    connectionId,
    disconnectDeadlineAt: null,
    activeFromRound: 0
  };

  game.players = [...game.players, player];
  ensurePlayerHand(game, player.id);
  return player;
}

export function findHostPlayerByConnection(
  game: HostGameState,
  connectionId: string
): HostPlayer | null {
  return (
    game.players.find((entry) => entry.connectionId === connectionId) ?? null
  );
}

export function findHostPlayerById(
  game: HostGameState,
  playerId: string
): HostPlayer | null {
  return game.players.find((entry) => entry.id === playerId) ?? null;
}

function allParticipantsReadyToSubmit(game: HostGameState): boolean {
  if (game.phase !== "submitting" || game.participantIds.length === 0) {
    return false;
  }

  return game.participantIds.every((playerId) => {
    const player = findHostPlayerById(game, playerId);
    return Boolean(
      player &&
      (hasSubmitted(game, playerId) ||
        player.raisedCardIds.length === game.blackPick)
    );
  });
}

function allEligibleVotesCast(game: HostGameState): boolean {
  const eligibleVoterIds = game.participantIds.filter((playerId) =>
    canPlayerVote(game, playerId)
  );
  const votesByPlayerId = game.votesByPlayerId ?? {};
  return eligibleVoterIds.every((playerId) =>
    Boolean(votesByPlayerId[playerId])
  );
}

function countMissingVotes(game: HostGameState): number {
  const votesByPlayerId = game.votesByPlayerId ?? {};
  return game.participantIds.filter((playerId) => {
    return canPlayerVote(game, playerId) && !votesByPlayerId[playerId];
  }).length;
}

function canPlayerVote(game: HostGameState, playerId: string): boolean {
  return game.submissions.some(
    (submission) => submission.playerId !== playerId
  );
}
