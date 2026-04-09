import { type JSX } from "solid-js";

import { blackCards, deckName, whiteCards } from "../cards/index.js";
import type { SyncView } from "../types.js";
import { Hand } from "./Hand.js";
import { Table } from "./Table.js";

type BoardSlotsLabAppProps = {
  count: number;
};

export function BoardSlotsLabApp(props: BoardSlotsLabAppProps): JSX.Element {
  const cardCount = Math.max(1, Math.min(12, props.count));
  const blackCard = blackCards[0] ?? null;
  const handCards = whiteCards.slice(12, 19).map((card) => ({
    id: card.id,
    text: card.text
  }));
  const sync: SyncView = {
    roomId: "lab-room",
    roomName: deckName,
    started: true,
    phase: "result",
    round: 1,
    submissionSecondsLeft: null,
    announcement: "Board slots lab.",
    blackCardId: blackCard?.id ?? null,
    blackCard: blackCard
      ? {
          id: blackCard.id,
          text: blackCard.text,
          pick: blackCard.pick
        }
      : null,
    blackPick: blackCard?.pick ?? 1,
    judgeId: "lab-judge",
    lastWinnerId: null,
    winnerSelectionClosed: false,
    votingClosed: false,
    winnerPlayerIds: [],
    players: [],
    submissions: whiteCards.slice(0, cardCount).map((card, index) => ({
      id: `lab-submission-${index + 1}`,
      cardIds: [card.id],
      cards: [
        {
          id: card.id,
          text: card.text
        }
      ],
      hidden: false,
      winner: false
    })),
    hand: handCards.map((card) => card.id),
    handCards,
    selfRaisedCardIds: [],
    selfPlayerId: "lab-player",
    canSubmit: false,
    canJudge: false,
    canVote: false
  };

  return (
    <main class="shell shell-game board-slots-lab">
      <section class="game-stage">
        <Table
          sync={() => sync}
          blackCard={() => sync.blackCard}
          isHost={() => false}
          onPickSubmission={() => undefined}
          onStartGame={() => undefined}
          onStartNextRound={() => undefined}
        />
        <Hand
          sync={() => sync}
          handCards={() => handCards}
          selectedCardIds={() => []}
          onToggleCard={() => undefined}
        />
      </section>
    </main>
  );
}
