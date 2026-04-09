import type { AppController } from "./controller.js";
import { currentBlackCard, currentHandCards } from "./selectors.js";

export function currentBoardBlackCard(controller: AppController) {
  return currentBlackCard(controller.state);
}

export function currentLocalHand(controller: AppController) {
  const override = controller.state.localHandOverride ?? [];
  if (override.length > 0) {
    return override;
  }
  const handCards = currentHandCards(controller.state);
  const hiddenIds = new Set(
    (controller.state.pendingSubmittedCards ?? []).map((card) => card.id)
  );
  return handCards.filter((card) => !hiddenIds.has(card.id));
}
