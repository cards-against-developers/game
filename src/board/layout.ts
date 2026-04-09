export type BoardLayoutSlot = {
  x: number;
  y: number;
  tilt: number;
  width?: number;
};

const CARD_ASPECT_RATIO = 7 / 5;
const BLACK_CARD_WIDTH = 212;
const WHITE_CARD_WIDTH = 178;
const BLACK_CARD_HEIGHT = BLACK_CARD_WIDTH * CARD_ASPECT_RATIO;
const WHITE_CARD_HEIGHT = WHITE_CARD_WIDTH * CARD_ASPECT_RATIO;

const INNER_TILT = 5.5;
const MID_TILT = 10.5;
const OUTER_TILT = 16;

const HORIZONTAL_GAP_TO_BLACK = 28;
const HORIZONTAL_GAP_BETWEEN_CARDS = 20;
const VERTICAL_GAP_TO_BLACK = -48;

function projectedHalfWidth(tilt: number): number {
  const radians = (Math.abs(tilt) * Math.PI) / 180;
  return (
    (WHITE_CARD_WIDTH / 2) * Math.cos(radians) +
    (WHITE_CARD_HEIGHT / 2) * Math.sin(radians)
  );
}

function projectedHalfHeight(tilt: number): number {
  const radians = (Math.abs(tilt) * Math.PI) / 180;
  return (
    (WHITE_CARD_HEIGHT / 2) * Math.cos(radians) +
    (WHITE_CARD_WIDTH / 2) * Math.sin(radians)
  );
}

const firstColumnX = Math.round(
  BLACK_CARD_WIDTH / 2 +
    projectedHalfWidth(INNER_TILT) +
    HORIZONTAL_GAP_TO_BLACK
);
const secondColumnX = Math.round(
  firstColumnX +
    projectedHalfWidth(INNER_TILT) +
    projectedHalfWidth(MID_TILT) +
    HORIZONTAL_GAP_BETWEEN_CARDS
);
const thirdColumnX = Math.round(
  secondColumnX +
    projectedHalfWidth(MID_TILT) +
    projectedHalfWidth(OUTER_TILT) +
    HORIZONTAL_GAP_BETWEEN_CARDS
);

const rowY = Math.round(
  BLACK_CARD_HEIGHT / 2 +
    projectedHalfHeight(INNER_TILT) +
    VERTICAL_GAP_TO_BLACK
);

const topY = -rowY;
const bottomY = rowY;

export const BLACK_CARD_SLOT = {
  x: 0,
  y: 0,
  tilt: 0
} as const satisfies BoardLayoutSlot;

export const WHITE_CARD_SLOTS = [
  { x: -firstColumnX, y: topY, tilt: -INNER_TILT },
  { x: firstColumnX, y: topY, tilt: INNER_TILT },
  { x: -firstColumnX, y: bottomY, tilt: -INNER_TILT },
  { x: firstColumnX, y: bottomY, tilt: INNER_TILT },
  { x: -secondColumnX, y: topY, tilt: -MID_TILT },
  { x: secondColumnX, y: topY, tilt: MID_TILT },
  { x: -secondColumnX, y: bottomY, tilt: -MID_TILT },
  { x: secondColumnX, y: bottomY, tilt: MID_TILT },
  { x: -thirdColumnX, y: topY, tilt: -OUTER_TILT },
  { x: thirdColumnX, y: topY, tilt: OUTER_TILT },
  { x: -thirdColumnX, y: bottomY, tilt: -OUTER_TILT },
  { x: thirdColumnX, y: bottomY, tilt: OUTER_TILT }
] as const satisfies readonly BoardLayoutSlot[];

export const BOARD_LAYOUT_WIDTH = Math.ceil(
  2 *
    Math.max(
      BLACK_CARD_WIDTH / 2,
      ...WHITE_CARD_SLOTS.map(
        (slot) => Math.abs(slot.x) + projectedHalfWidth(slot.tilt)
      )
    )
);

export const BOARD_LAYOUT_HEIGHT = Math.ceil(
  2 *
    Math.max(
      BLACK_CARD_HEIGHT / 2,
      ...WHITE_CARD_SLOTS.map(
        (slot) => Math.abs(slot.y) + projectedHalfHeight(slot.tilt)
      )
    )
);

export function buildBoardSlotStyle(
  layout: BoardLayoutSlot
): Record<string, string> {
  const style: Record<string, string> = {
    "--x": `${layout.x}px`,
    "--y": `${layout.y}px`,
    "--tilt": `${layout.tilt}deg`
  };

  if (layout.width !== undefined) {
    style["--seat-width"] = `${layout.width}px`;
  }

  return style;
}
