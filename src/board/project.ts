import { whiteById } from "../cards/index.js";
import type { SyncView } from "../types.js";
import { BoardCardManager, type BoardCardModel } from "./manager.js";

export function buildBoardCards(
  sync: SyncView,
  manager = new BoardCardManager()
): BoardCardModel[] {
  const cardBackText = "Cards Against Developers";

  if (sync.submissions.length > 0) {
    const submissionIds = new Set(
      sync.submissions.map((submission) => submission.id)
    );
    removeCardsOutsideSet(manager, submissionIds);

    for (const submission of sync.submissions) {
      const hidden = submission.hidden || !submission.cards?.length;
      const text = hidden
        ? cardBackText
        : (submission.cards?.length
            ? submission.cards.map((card) => card.text)
            : submission.cardIds.map(
                (cardId) => whiteById.get(cardId)?.text ?? ""
              )
          ).join("\n\n");

      manager.playCard({
        id: submission.id,
        kind: "submission",
        text,
        hidden,
        winner: submission.winner,
        highlighted: submission.highlighted
      });
    }

    return manager.getCards();
  }

  if (sync.phase !== "lobby") {
    manager.removeAllCards();
    return [];
  }

  const playerIds = new Set(sync.players.map((player) => player.id));
  removeCardsOutsideSet(manager, playerIds);

  for (const player of sync.players) {
    manager.playCard({
      id: player.id,
      kind: "player",
      text: player.username,
      hidden: false,
      connected: player.connected,
      reconnectSecondsLeft: player.disconnectSecondsLeft,
      winner: false
    });
  }

  return manager.getCards();
}

function removeCardsOutsideSet(
  manager: BoardCardManager,
  activeIds: Set<string>
): void {
  for (const card of manager.getCards()) {
    if (!activeIds.has(card.id)) {
      manager.removeCard(card.id);
    }
  }
}
