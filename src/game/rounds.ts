import type { HostGameState } from "../types.js";
import { drawBlackCard, ensurePlayerHand } from "./internal.js";
import { debugLog } from "../utils/debug.js";

export const AUTO_REVEAL_INTERVAL_MS = 2_000;
export const RESULT_TENSION_MS = 1_600;

export function startGame(game: HostGameState): void {
  if (game.players.length < 3) {
    debugLog("game", "start blocked", { players: game.players.length });
    return;
  }

  debugLog("game", "start game", { players: game.players.length });
  game.started = true;
  game.round = 0;
  startNextRound(game);
}

export function startNextRound(
  game: HostGameState,
  options?: { judgeIdOverride?: string | null }
): void {
  void options;
  const activePlayers = game.players.filter(
    (player) => player.connected && player.activeFromRound <= game.round + 1
  );

  if (activePlayers.length < 3) {
    debugLog("game", "next round blocked", {
      activePlayers: activePlayers.length
    });
    resetCurrentRound(game);
    game.phase = "lobby";
    game.started = false;
    game.announcement = "Need at least three connected players to continue.";
    return;
  }

  game.started = true;
  game.phase = "submitting";
  game.round += 1;
  game.submissionDeadlineAt = Date.now() + game.countdownMs;
  game.winnerSelectionClosed = false;
  game.votingClosed = false;
  game.submissions = [];
  game.revealedSubmissionIds = [];
  game.revealOrderIds = [];
  game.highlightedSubmissionId = null;
  game.lastWinnerId = null;
  game.allVotesInAt = null;
  game.votesByPlayerId = {};
  game.winnerPlayerIds = [];
  game.participantIds = activePlayers.map((player) => player.id);
  const blackCard = drawBlackCard(game);
  game.blackCardId = blackCard?.id ?? null;
  game.blackPick = blackCard?.pick ?? 1;
  game.announcement = "Pick your funniest card.";
  debugLog("game", "round started", {
    round: game.round,
    participants: game.participantIds.length,
    blackPick: game.blackPick
  });

  for (const player of game.players) {
    player.raisedCardIds = [];
  }

  for (const player of activePlayers) {
    ensurePlayerHand(game, player.id);
  }
}

export function forceReveal(
  game: HostGameState,
  announcement = "Host opened the reveal early."
): void {
  if (game.phase === "submitting" && game.submissions.length > 0) {
    startRevealPhase(game, announcement);
    debugLog("game", "force reveal", {
      round: game.round,
      submissions: game.submissions.length
    });
    return;
  }

  if (game.phase === "judging" && game.submissions.length > 0) {
    openVoting(game, announcement);
    debugLog("game", "force reveal", {
      round: game.round,
      submissions: game.submissions.length
    });
  }
}

export function skipCurrentRound(
  game: HostGameState,
  announcement = "Host skipped the current round and preserved everyone’s hand."
): void {
  game.phase = "result";
  game.submissionDeadlineAt = null;
  game.winnerSelectionClosed = true;
  game.votingClosed = true;
  game.lastWinnerId = null;
  game.winnerPlayerIds = [];
  game.revealOrderIds = [];
  game.highlightedSubmissionId = null;
  game.allVotesInAt = null;
  game.votesByPlayerId = {};
  game.submissions = [];
  for (const player of game.players) {
    ensurePlayerHand(game, player.id);
  }
  game.announcement = announcement;
  debugLog("game", "round skipped", { round: game.round });
}

export function expireWinnerSelection(
  game: HostGameState,
  announcement = "Vote countdown ended. No one wins this round."
): void {
  if (
    game.phase !== "result" ||
    game.votingClosed ||
    game.submissions.length === 0
  ) {
    return;
  }

  closeVoting(game, announcement);
  debugLog("game", "voting expired", {
    round: game.round,
    submissions: game.submissions.length
  });
}

export function completeRoundAndArmNextRound(
  game: HostGameState,
  announcement: string
): void {
  game.submissionDeadlineAt = null;
  game.winnerSelectionClosed = true;
  game.votingClosed = true;
  game.announcement = announcement;
}

export function openVoting(
  game: HostGameState,
  announcement = "Vote for your favourite card."
): void {
  if (
    (game.phase !== "submitting" && game.phase !== "judging") ||
    game.submissions.length === 0
  ) {
    return;
  }

  game.phase = "result";
  game.submissionDeadlineAt = Date.now() + game.countdownMs;
  game.winnerSelectionClosed = false;
  game.votingClosed = false;
  game.revealedSubmissionIds = game.submissions.map(
    (submission) => submission.id
  );
  game.highlightedSubmissionId = null;
  game.lastWinnerId = null;
  game.allVotesInAt = null;
  game.winnerPlayerIds = [];
  game.announcement = announcement;
  debugLog("game", "voting opened", {
    round: game.round,
    submissions: game.submissions.length
  });
}

export function expireJudging(game: HostGameState): void {
  revealNextSubmission(game);
}

export function startRevealPhase(
  game: HostGameState,
  announcement = "Cards are hitting the table."
): void {
  if (game.phase !== "submitting" || game.submissions.length === 0) {
    return;
  }

  game.phase = "judging";
  game.revealOrderIds = [
    ...game.submissions.map((submission) => submission.id)
  ];
  game.revealedSubmissionIds = [];
  game.highlightedSubmissionId = game.revealOrderIds[0] ?? null;
  game.allVotesInAt = null;
  game.submissionDeadlineAt = Date.now() + AUTO_REVEAL_INTERVAL_MS;
  game.announcement = announcement;
}

export function revealNextSubmission(game: HostGameState): void {
  if (game.phase !== "judging") {
    return;
  }

  const revealOrderIds = game.revealOrderIds ?? [];
  if (revealOrderIds.length === 0) {
    return;
  }

  const nextSubmissionId =
    revealOrderIds[game.revealedSubmissionIds.length] ?? null;
  if (!nextSubmissionId) {
    openVoting(game);
    return;
  }

  game.revealedSubmissionIds = [
    ...game.revealedSubmissionIds,
    nextSubmissionId
  ];
  const revealedCount = game.revealedSubmissionIds.length;
  const remaining = revealOrderIds.length - revealedCount;

  if (remaining <= 0) {
    openVoting(game, "Vote for your favourite card.");
    return;
  }

  game.highlightedSubmissionId = revealOrderIds[revealedCount] ?? null;
  game.submissionDeadlineAt = Date.now() + AUTO_REVEAL_INTERVAL_MS;
  game.announcement = `${remaining} card${remaining === 1 ? "" : "s"} left to reveal.`;
}

function resetCurrentRound(game: HostGameState): void {
  if (game.blackCardId) {
    game.blackDiscard.push({ id: game.blackCardId, pick: game.blackPick });
  }

  game.blackCardId = null;
  game.blackPick = 1;
  game.submissionDeadlineAt = null;
  game.winnerSelectionClosed = false;
  game.votingClosed = false;
  game.participantIds = [];
  game.submissions = [];
  game.revealedSubmissionIds = [];
  game.revealOrderIds = [];
  game.highlightedSubmissionId = null;
  game.lastWinnerId = null;
  game.allVotesInAt = null;
  game.votesByPlayerId = {};
  game.winnerPlayerIds = [];
  for (const player of game.players) {
    player.raisedCardIds = [];
  }
}

function closeVoting(game: HostGameState, fallbackAnnouncement: string): void {
  game.submissionDeadlineAt = null;
  game.winnerSelectionClosed = true;
  game.votingClosed = true;
  game.highlightedSubmissionId = null;
  game.allVotesInAt = null;

  const voteCounts = countVotes(game);
  const maxVotes = Math.max(0, ...Object.values(voteCounts));
  const winners =
    maxVotes > 0
      ? game.submissions.filter(
          (submission) => (voteCounts[submission.id] ?? 0) === maxVotes
        )
      : [];

  game.winnerPlayerIds = winners.map((submission) => submission.playerId);
  game.lastWinnerId =
    winners.length === 1 ? (winners[0]?.playerId ?? null) : null;

  for (const winner of winners) {
    const player = game.players.find((entry) => entry.id === winner.playerId);
    if (player) {
      player.score += 1;
    }
  }

  if (winners.length === 0) {
    game.announcement = fallbackAnnouncement;
    return;
  }

  if (winners.length === 1) {
    const player = game.players.find(
      (entry) => entry.id === winners[0]!.playerId
    );
    game.announcement = player
      ? `${player.username} wins this round.`
      : "Winner chosen.";
    return;
  }

  const winnerNames = winners
    .map(
      (submission) =>
        game.players.find((entry) => entry.id === submission.playerId)?.username
    )
    .filter((name): name is string => Boolean(name));
  game.announcement =
    winnerNames.length > 0
      ? `${winnerNames.join(", ")} tie for the round win.`
      : "Tie round.";
}

function countVotes(game: HostGameState): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const submission of game.submissions) {
    counts[submission.id] = 0;
  }

  for (const submissionId of Object.values(game.votesByPlayerId ?? {})) {
    if (submissionId in counts) {
      counts[submissionId] += 1;
    }
  }

  return counts;
}
