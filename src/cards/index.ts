import {
  blackCards,
  deckName,
  deckVersion,
  whiteCards,
  type BlackCard,
  type WhiteCard
} from "./deck.generated.js";

export {
  blackCards,
  deckName,
  deckVersion,
  whiteCards,
  type BlackCard,
  type WhiteCard
};

export const blackById = new Map(blackCards.map((card) => [card.id, card]));
export const whiteById = new Map(whiteCards.map((card) => [card.id, card]));

export function getBlackCard(cardId: string | null): BlackCard | null {
  return cardId ? (blackById.get(cardId) ?? null) : null;
}

export function getHandCards(cardIds: string[]): WhiteCard[] {
  return cardIds
    .map((cardId) => whiteById.get(cardId))
    .filter((card): card is WhiteCard => Boolean(card));
}
