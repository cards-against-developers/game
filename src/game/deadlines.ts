import type { HostGameState } from "../types.js";
import {
  expireJudging,
  expireWinnerSelection,
  forceReveal,
  skipCurrentRound
} from "./rounds.js";
import { autoSubmitRaisedCards } from "./submissions.js";

export function processRoundDeadline(
  game: HostGameState,
  now = Date.now()
): boolean {
  if (!game.started || game.submissionDeadlineAt === null) {
    return false;
  }

  if (now < game.submissionDeadlineAt) {
    return false;
  }

  if (game.phase === "result") {
    if (!game.votingClosed && game.submissions.length > 0) {
      expireWinnerSelection(
        game,
        game.allVotesInAt
          ? "All votes are in."
          : "Vote countdown ended. No one wins this round."
      );
      return true;
    }

    return false;
  }

  if (game.phase === "judging") {
    expireJudging(game);
    return true;
  }

  if (game.phase !== "submitting") {
    return false;
  }

  autoSubmitRaisedCards(game);

  if (game.phase !== "submitting") {
    return true;
  }

  if (game.submissions.length > 0) {
    forceReveal(game, "Submission countdown ended. Revealing submitted cards.");
  } else {
    skipCurrentRound(
      game,
      "Submission countdown ended. No cards were submitted."
    );
  }

  return true;
}
