import assert from "node:assert/strict";
import test from "node:test";

import { BLACK_CARD_SLOT, WHITE_CARD_SLOTS } from "./layout.js";
import { BOARD_CARD_SLOTS, BoardCardManager } from "./manager.js";

test("playCard assigns stable slots in insertion order", () => {
  const manager = new BoardCardManager();

  manager.playCard({
    id: "alice",
    kind: "player",
    text: "Alice",
    hidden: false,
    winner: false
  });
  manager.playCard({
    id: "bob",
    kind: "player",
    text: "Bob",
    hidden: false,
    winner: false
  });

  const cards = manager.getCards();
  assert.equal(cards[0]?.slotIndex, 0);
  assert.equal(cards[1]?.slotIndex, 1);
  assert.equal(cards[0]?.slot.x, -235);
  assert.equal(cards[1]?.slot.x, 235);
  assert.equal(cards[0]?.slot.y, -233);
  assert.equal(cards[1]?.slot.y, -233);
});

test("playCard preserves a card slot when the card updates", () => {
  const manager = new BoardCardManager();

  manager.playCard({
    id: "submission-1",
    kind: "submission",
    text: "Cards Against Developers",
    hidden: true,
    winner: false
  });

  manager.playCard({
    id: "submission-1",
    kind: "submission",
    text: "Real card text",
    hidden: false,
    winner: false
  });

  const card = manager.getCard("submission-1");
  assert.equal(card?.slotIndex, 0);
  assert.equal(card?.text, "Real card text");
  assert.equal(card?.hidden, false);
});

test("revealAllCards flips all existing cards face up without moving them", () => {
  const manager = new BoardCardManager();

  manager.playCard({
    id: "submission-1",
    kind: "submission",
    text: "Hidden 1",
    hidden: true,
    winner: false
  });
  manager.playCard({
    id: "submission-2",
    kind: "submission",
    text: "Hidden 2",
    hidden: true,
    winner: false
  });

  manager.revealAllCards({
    "submission-1": { text: "Shown 1" },
    "submission-2": { text: "Shown 2" }
  });

  const cards = manager.getCards();
  assert.deepEqual(
    cards.map((card) => ({
      id: card.id,
      slotIndex: card.slotIndex,
      text: card.text,
      hidden: card.hidden
    })),
    [
      { id: "submission-1", slotIndex: 0, text: "Shown 1", hidden: false },
      { id: "submission-2", slotIndex: 1, text: "Shown 2", hidden: false }
    ]
  );
});

test("removeAllCards clears the board state", () => {
  const manager = new BoardCardManager();

  manager.playCard({
    id: "alice",
    kind: "player",
    text: "Alice",
    hidden: false,
    winner: false
  });
  manager.playCard({
    id: "submission-1",
    kind: "submission",
    text: "Cards Against Developers",
    hidden: true,
    winner: false
  });

  manager.removeAllCards();

  assert.deepEqual(manager.getCards(), []);
});

test("board slots stay perfectly mirrored around the black card", () => {
  assert.deepEqual(BLACK_CARD_SLOT, {
    x: 0,
    y: 0,
    tilt: 0
  });
  assert.equal(BOARD_CARD_SLOTS, WHITE_CARD_SLOTS);
  assert.deepEqual(BOARD_CARD_SLOTS[0], {
    x: -235,
    y: -233,
    tilt: -5.5
  });
  assert.deepEqual(BOARD_CARD_SLOTS[1], {
    x: 235,
    y: -233,
    tilt: 5.5
  });
  assert.deepEqual(BOARD_CARD_SLOTS[2], {
    x: -235,
    y: 233,
    tilt: -5.5
  });
  assert.deepEqual(BOARD_CARD_SLOTS[3], {
    x: 235,
    y: 233,
    tilt: 5.5
  });
  assert.deepEqual(BOARD_CARD_SLOTS[4], {
    x: -466,
    y: -233,
    tilt: -10.5
  });
  assert.deepEqual(BOARD_CARD_SLOTS[7], {
    x: 466,
    y: 233,
    tilt: 10.5
  });
  assert.deepEqual(BOARD_CARD_SLOTS[8], {
    x: -716,
    y: -233,
    tilt: -16
  });
  assert.deepEqual(BOARD_CARD_SLOTS[11], {
    x: 716,
    y: 233,
    tilt: 16
  });

  for (let index = 0; index < BOARD_CARD_SLOTS.length; index += 2) {
    const left: (typeof BOARD_CARD_SLOTS)[number] = BOARD_CARD_SLOTS[index]!;
    const right: (typeof BOARD_CARD_SLOTS)[number] =
      BOARD_CARD_SLOTS[index + 1]!;

    assert.equal(left.x, -right.x);
    assert.equal(left.y, right.y);
    assert.equal(left.tilt, -right.tilt);
  }
});
