import type { SyncView } from "../types.js";

export function buildBoardStatus(sync: SyncView): string {
  const countdownText = formatCountdown(sync.submissionSecondsLeft, {
    includeLeftSuffix: true
  });
  const winnerPlayerIds = sync.winnerPlayerIds ?? [];
  const winningPlayers = sync.players.filter((player) =>
    winnerPlayerIds.includes(player.id)
  );

  if (!sync.started) {
    return "";
  }

  if (sync.phase === "result") {
    if (sync.resolutionPending) {
      return countdownText
        ? `Votes locked in · ${countdownText}`
        : "Votes locked in";
    }

    if (winningPlayers.length === 1) {
      const winner = winningPlayers[0]!;
      const base =
        winner.id === sync.selfPlayerId
          ? "You win this round"
          : `${winner.username} wins this round`;
      return countdownText ? `${base} · ${countdownText}` : base;
    }

    if (winningPlayers.length > 1) {
      const youWon = winningPlayers.some(
        (player) => player.id === sync.selfPlayerId
      );
      const names = winningPlayers.map((player) => player.username).join(", ");
      const base = youWon
        ? "Tie round. You score a point"
        : `${names} tie for the round win`;
      return countdownText ? `${base} · ${countdownText}` : base;
    }

    if (sync.submissions.length === 0) {
      return countdownText
        ? `Round complete · ${countdownText}`
        : "Round complete";
    }

    if (sync.votingClosed) {
      return countdownText
        ? `No winner this round · ${countdownText}`
        : "No winner this round";
    }

    const base = sync.canVote
      ? "Vote for your favourite card"
      : "Waiting for votes";
    return countdownText ? `${base} · ${countdownText}` : base;
  }

  if (sync.phase === "judging") {
    return sync.submissions.some((submission) => submission.hidden)
      ? "Revealing cards"
      : "Cards revealed";
  }

  if (sync.phase === "submitting") {
    const base = sync.canSubmit ? "Pick your card" : "Waiting for submissions";
    return countdownText ? `${base} · ${countdownText}` : base;
  }

  return sync.announcement;
}

export function buildHandStatus(sync: SyncView): string {
  const countdownText = formatCountdown(sync.submissionSecondsLeft);

  if (!sync.started) {
    return "Waiting for the game to start";
  }

  if (sync.canSubmit) {
    const cardCountText = `Raise ${sync.blackPick} card${
      sync.blackPick === 1 ? "" : "s"
    }`;
    return countdownText
      ? `${cardCountText} · ${countdownText}`
      : cardCountText;
  }

  if (sync.canVote) {
    return countdownText
      ? `Cast your vote · ${countdownText}`
      : "Cast your vote";
  }

  if (sync.phase === "judging") {
    return "Cards are flipping";
  }

  if (sync.resolutionPending) {
    return countdownText ? `Votes are in · ${countdownText}` : "Votes are in";
  }

  if (sync.phase === "result" && !sync.votingClosed) {
    return "Waiting for the rest of the votes";
  }

  return "Waiting";
}

export function formatCountdown(
  secondsLeft: number | null,
  options: { includeLeftSuffix?: boolean } = {}
): string {
  if (secondsLeft === null) {
    return "";
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeText = `${minutes}:${String(seconds).padStart(2, "0")}`;
  return options.includeLeftSuffix ? `${timeText} left` : timeText;
}
