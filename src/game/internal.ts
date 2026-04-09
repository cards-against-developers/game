import type { BlackDeckEntry, HostGameState } from "../types.js";
import { shuffleWithGame } from "../utils/index.js";

export function ensurePlayerHand(game: HostGameState, playerId: string): void {
  const player = game.players.find((entry) => entry.id === playerId);
  if (!player) {
    return;
  }

  while (player.hand.length < 10) {
    const next = drawWhiteCard(game);
    if (!next) {
      break;
    }
    player.hand.push(next);
  }
}

export function drawWhiteCard(game: HostGameState): string | null {
  if (game.whiteDrawPile.length === 0) {
    if (game.whiteDiscard.length === 0) {
      return null;
    }
    game.whiteDrawPile = shuffleWithGame([...game.whiteDiscard], game);
    game.whiteDiscard = [];
  }
  return game.whiteDrawPile.pop() ?? null;
}

export function drawBlackCard(game: HostGameState): BlackDeckEntry | null {
  if (game.blackCardId) {
    game.blackDiscard.push({ id: game.blackCardId, pick: game.blackPick });
  }
  if (game.blackDrawPile.length === 0) {
    game.blackDrawPile = shuffleWithGame([...game.blackDiscard], game);
    game.blackDiscard = [];
  }
  return game.blackDrawPile.pop() ?? null;
}

export function hasSubmitted(game: HostGameState, playerId: string): boolean {
  return game.submissions.some(
    (submission) => submission.playerId === playerId
  );
}
