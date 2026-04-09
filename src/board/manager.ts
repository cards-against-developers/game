import { WHITE_CARD_SLOTS } from "./layout.js";

export type BoardCardSlot = {
  x: number;
  y: number;
  tilt: number;
};

export type BoardCardModel = {
  id: string;
  kind: "player" | "submission";
  slotIndex: number;
  slot: BoardCardSlot;
  text: string;
  hidden: boolean;
  connected?: boolean;
  reconnectSecondsLeft?: number | null;
  winner: boolean;
  highlighted?: boolean;
};

export type BoardCardInput = Omit<BoardCardModel, "slotIndex" | "slot">;

export const BOARD_CARD_SLOTS = WHITE_CARD_SLOTS as readonly BoardCardSlot[];

export class BoardCardManager {
  private readonly slots: readonly BoardCardSlot[];
  private readonly cardsById = new Map<string, BoardCardModel>();
  private readonly slotById = new Map<string, number>();

  constructor(slots: readonly BoardCardSlot[] = BOARD_CARD_SLOTS) {
    this.slots = slots;
  }

  playCard(input: BoardCardInput): BoardCardModel {
    const existing = this.cardsById.get(input.id);
    const slotIndex = existing
      ? existing.slotIndex
      : this.allocateSlot(input.id);
    const nextCard: BoardCardModel = {
      ...input,
      slotIndex,
      slot: this.slots[slotIndex] ?? this.slots[this.slots.length - 1]!
    };

    this.cardsById.set(input.id, nextCard);
    return nextCard;
  }

  revealCard(
    id: string,
    updates: Partial<BoardCardInput> = {}
  ): BoardCardModel | null {
    const card = this.cardsById.get(id);
    if (!card) {
      return null;
    }

    return this.playCard({
      ...card,
      ...updates,
      id,
      hidden: false
    });
  }

  revealAllCards(
    updatesById: Record<string, Partial<BoardCardInput>> = {}
  ): BoardCardModel[] {
    return this.getCards().map(
      (card) => this.revealCard(card.id, updatesById[card.id]) ?? card
    );
  }

  removeCard(id: string): void {
    this.cardsById.delete(id);
    this.slotById.delete(id);
  }

  removeAllCards(): void {
    this.cardsById.clear();
    this.slotById.clear();
  }

  getCard(id: string): BoardCardModel | null {
    return this.cardsById.get(id) ?? null;
  }

  getCards(): BoardCardModel[] {
    return [...this.cardsById.values()].sort(
      (left, right) => left.slotIndex - right.slotIndex
    );
  }

  private allocateSlot(id: string): number {
    const existing = this.slotById.get(id);
    if (existing !== undefined) {
      return existing;
    }

    for (let slotIndex = 0; slotIndex < this.slots.length; slotIndex += 1) {
      const slotTaken = [...this.slotById.values()].includes(slotIndex);
      if (!slotTaken) {
        this.slotById.set(id, slotIndex);
        return slotIndex;
      }
    }

    const fallbackIndex = this.slots.length - 1;
    this.slotById.set(id, fallbackIndex);
    return fallbackIndex;
  }
}
