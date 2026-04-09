import type { SyncView } from "../types.js";
import { getBlackCard, whiteById } from "../cards/index.js";
import { hasSubmitted } from "./internal.js";
import type { HostGameState } from "../types.js";

export function buildSyncView(
  roomId: string,
  roomName: string,
  game: HostGameState,
  playerId: string,
  now = Date.now()
): SyncView {
  const votingClosed = Boolean(game.votingClosed);
  const votesByPlayerId = game.votesByPlayerId ?? {};
  const winnerPlayerIds = game.winnerPlayerIds ?? [];
  const player = game.players.find((entry) => entry.id === playerId);
  const blackCard = getBlackCard(game.blackCardId);
  const submissionSecondsLeft =
    game.phase !== "lobby" && game.submissionDeadlineAt !== null
      ? Math.max(0, Math.ceil((game.submissionDeadlineAt - now) / 1000))
      : null;
  const visibleSubmissions =
    game.phase === "result"
      ? game.submissions.map((submission) => {
          const owner =
            game.players.find((entry) => entry.id === submission.playerId) ??
            null;
          const voteCount = countVotesForSubmission(game, submission.id);
          const ownSubmission = submission.playerId === playerId;
          const revealScores = votingClosed;
          const votedBySelf = votesByPlayerId[playerId] === submission.id;
          return {
            id: submission.id,
            playerId: revealScores ? submission.playerId : undefined,
            cardIds: submission.cardIds,
            playerName: revealScores ? (owner?.username ?? "") : undefined,
            cards: submission.cardIds
              .map((cardId) => whiteById.get(cardId))
              .filter((card): card is NonNullable<typeof card> => Boolean(card))
              .map((card) => ({
                id: card.id,
                text: card.text
              })),
            hidden: false,
            voteCount: revealScores ? voteCount : undefined,
            votedBySelf,
            ownSubmission,
            canVote:
              !votingClosed &&
              !ownSubmission &&
              game.submissions.some((entry) => entry.playerId !== playerId),
            winner:
              revealScores && winnerPlayerIds.includes(submission.playerId),
            highlighted: game.highlightedSubmissionId === submission.id
          };
        })
      : game.phase === "judging"
        ? game.submissions.map((submission) => {
            const isRevealed = game.revealedSubmissionIds.includes(
              submission.id
            );
            return {
              id: submission.id,
              cardIds: submission.cardIds,
              cards: isRevealed
                ? submission.cardIds
                    .map((cardId) => whiteById.get(cardId))
                    .filter((card): card is NonNullable<typeof card> =>
                      Boolean(card)
                    )
                    .map((card) => ({
                      id: card.id,
                      text: card.text
                    }))
                : undefined,
              hidden: !isRevealed,
              voteCount: undefined,
              votedBySelf: undefined,
              ownSubmission: submission.playerId === playerId,
              canVote: false,
              winner: false,
              highlighted: game.highlightedSubmissionId === submission.id
            };
          })
        : game.phase === "submitting"
          ? buildSubmittingPreviewSubmissions(game, playerId)
          : [];

  return {
    roomId,
    roomName,
    started: game.started,
    phase: game.phase,
    round: game.round,
    hostNow: now,
    submissionDeadlineAt: game.submissionDeadlineAt,
    submissionSecondsLeft,
    announcement: game.announcement,
    blackCardId: game.blackCardId,
    blackCard: blackCard
      ? {
          id: blackCard.id,
          text: blackCard.text,
          pick: blackCard.pick
        }
      : null,
    blackPick: game.blackPick,
    judgeId: null,
    lastWinnerId: game.lastWinnerId ?? null,
    winnerSelectionClosed: game.winnerSelectionClosed ?? votingClosed,
    votingClosed,
    winnerPlayerIds: [...winnerPlayerIds],
    highlightedSubmissionId: game.highlightedSubmissionId,
    resolutionPending:
      game.phase === "result" && !votingClosed && game.allVotesInAt !== null,
    players: game.players.map((entry) => ({
      id: entry.id,
      username: entry.username,
      score: entry.score,
      connected: entry.connected,
      disconnectDeadlineAt: entry.disconnectDeadlineAt,
      disconnectSecondsLeft: entry.disconnectDeadlineAt
        ? Math.max(0, Math.ceil((entry.disconnectDeadlineAt - now) / 1000))
        : null,
      handCount: entry.hand.length,
      isJudge: false,
      isWaiting: game.started && entry.activeFromRound > game.round,
      hasSubmitted: hasSubmitted(game, entry.id)
    })),
    submissions: visibleSubmissions,
    hand: player?.hand ?? [],
    handCards:
      player?.hand
        .map((cardId) => whiteById.get(cardId))
        .filter((card): card is NonNullable<typeof card> => Boolean(card))
        .map((card) => ({
          id: card.id,
          text: card.text
        })) ?? [],
    selfRaisedCardIds: player?.raisedCardIds ?? [],
    selfPlayerId: playerId,
    canSubmit:
      game.phase === "submitting" &&
      game.participantIds.includes(playerId) &&
      !hasSubmitted(game, playerId),
    canJudge: false,
    canPickWinner: false,
    canVote:
      game.phase === "result" &&
      !votingClosed &&
      game.submissions.some((submission) => submission.playerId !== playerId)
  };
}

function buildSubmittingPreviewSubmissions(
  game: HostGameState,
  playerId: string
) {
  return game.players
    .filter((player) => game.participantIds.includes(player.id))
    .flatMap((player) => {
      const submitted = game.submissions.find(
        (submission) => submission.playerId === player.id
      );

      if (submitted) {
        return [
          {
            id: submitted.id,
            playerId: submitted.playerId,
            cardIds: submitted.cardIds,
            hidden: true,
            voteCount: 0,
            votedBySelf: false,
            ownSubmission: submitted.playerId === playerId,
            canVote: false,
            winner: false
          }
        ];
      }

      if (player.raisedCardIds.length === game.blackPick) {
        return [
          {
            id: `raised-${player.id}`,
            playerId: player.id,
            cardIds: [...player.raisedCardIds],
            hidden: true,
            voteCount: 0,
            votedBySelf: false,
            ownSubmission: player.id === playerId,
            canVote: false,
            winner: false
          }
        ];
      }

      return [];
    });
}

function countVotesForSubmission(
  game: HostGameState,
  submissionId: string
): number {
  return Object.values(game.votesByPlayerId ?? {}).filter(
    (voteId) => voteId === submissionId
  ).length;
}
