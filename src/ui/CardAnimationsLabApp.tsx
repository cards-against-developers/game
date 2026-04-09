import {
  For,
  createEffect,
  createMemo,
  createSignal,
  type JSX
} from "solid-js";

import { blackCards, deckName, whiteCards } from "../cards/index.js";
import type { SyncSubmission, SyncView, SyncWhiteCard } from "../types.js";
import { Hand } from "./Hand.js";
import { Table } from "./Table.js";

type CardAnimationsStage =
  | "hand-picked"
  | "hand-swapped"
  | "reveal"
  | "pick-winner"
  | "winner-picked"
  | "round-reset";

type CardAnimationsLabAppProps = {
  initialStage: string | null;
  countdownSeconds?: number | null;
  onStageChange?: (stage: CardAnimationsStage) => void;
};

const STAGES: CardAnimationsStage[] = [
  "hand-picked",
  "hand-swapped",
  "reveal",
  "pick-winner",
  "winner-picked",
  "round-reset"
];

const STAGE_LABELS: Record<CardAnimationsStage, string> = {
  "hand-picked": "Hand picked",
  "hand-swapped": "Hand swapped",
  reveal: "Reveal",
  "pick-winner": "Pick winner",
  "winner-picked": "Winner picked",
  "round-reset": "Round reset"
};

const handCards = whiteCards.slice(0, 7).map((card) => ({
  id: card.id,
  text: card.text
})) satisfies SyncWhiteCard[];

const sampleSubmissions = whiteCards.slice(7, 10).map((card, index) => ({
  id: `lab-submission-${index + 1}`,
  playerId: `player-${index + 2}`,
  playerName: ["Alice", "Bob", "Carol"][index] ?? `Player ${index + 2}`,
  cards: [
    {
      id: card.id,
      text: card.text
    }
  ]
}));

export function CardAnimationsLabApp(
  props: CardAnimationsLabAppProps
): JSX.Element {
  const initialStage = normalizeStage(props.initialStage);
  const [stage, setStage] = createSignal<CardAnimationsStage>(initialStage);
  const [selectedCardIds, setSelectedCardIds] = createSignal<string[]>(
    defaultSelectedCards(initialStage)
  );
  const [revealedSubmissionIds, setRevealedSubmissionIds] = createSignal<
    string[]
  >(
    initialStage === "reveal" ? [] : sampleSubmissions.map((entry) => entry.id)
  );
  const [winnerSubmissionId, setWinnerSubmissionId] = createSignal<
    string | null
  >(initialStage === "winner-picked" ? "lab-submission-2" : null);

  const sync = createMemo<SyncView>(() =>
    buildSyncView(
      stage(),
      revealedSubmissionIds(),
      winnerSubmissionId(),
      props.countdownSeconds ?? 30
    )
  );
  const roundResetOutgoingSync = createMemo<SyncView>(() =>
    buildSyncView(
      "winner-picked",
      sampleSubmissions.map((entry) => entry.id),
      "lab-submission-2",
      props.countdownSeconds ?? 30
    )
  );

  const applyStage = (nextStage: CardAnimationsStage) => {
    setStage(nextStage);
    setSelectedCardIds(defaultSelectedCards(nextStage));
    setRevealedSubmissionIds(
      nextStage === "reveal" ? [] : sampleSubmissions.map((entry) => entry.id)
    );
    setWinnerSubmissionId(
      nextStage === "winner-picked" ? "lab-submission-2" : null
    );
  };

  const chooseStage = (nextStage: CardAnimationsStage) => {
    applyStage(nextStage);
    props.onStageChange?.(nextStage);
  };

  createEffect(() => {
    applyStage(normalizeStage(props.initialStage));
  });

  const handleToggleCard = (cardId: string) => {
    if (stage() !== "hand-picked" && stage() !== "hand-swapped") {
      return;
    }

    setSelectedCardIds([cardId]);
    if (stage() === "hand-picked" && cardId !== handCards[0]?.id) {
      chooseStage("hand-swapped");
      setSelectedCardIds([cardId]);
    }
  };

  const handlePickSubmission = (submissionId: string) => {
    if (stage() === "reveal") {
      setRevealedSubmissionIds((current) => {
        if (current.includes(submissionId)) {
          return current;
        }

        const next = [...current, submissionId];
        if (next.length === sampleSubmissions.length) {
          chooseStage("pick-winner");
        }
        return next;
      });
      return;
    }

    if (stage() === "pick-winner") {
      setWinnerSubmissionId(submissionId);
      applyStage("winner-picked");
      props.onStageChange?.("winner-picked");
    }
  };

  return (
    <main class="shell shell-game">
      <div class="game-overlay game-overlay-top">
        <details class="game-drawer" open>
          <summary>Animation Lab</summary>
          <section class="sidebar panel sidebar-summary card-animations-panel">
            <div class="sidebar-block-header">
              <div>
                <h2>Card States</h2>
                <p class="tiny">
                  Switch between isolated raise, reveal, and winner-pick states.
                </p>
              </div>
            </div>
            <div class="card-animations-controls">
              <For each={STAGES}>
                {(nextStage) => (
                  <button
                    data-testid={`card-animations-stage-${nextStage}`}
                    class={stage() === nextStage ? "secondary" : ""}
                    onClick={() => chooseStage(nextStage)}
                  >
                    {STAGE_LABELS[nextStage]}
                  </button>
                )}
              </For>
            </div>
          </section>
        </details>
      </div>
      <section class={`game-stage card-animations-stage-${stage()}`}>
        <Table
          sync={sync}
          blackCard={() => sync().blackCard}
          isHost={() => false}
          transitionPreviewSync={() =>
            stage() === "round-reset" ? roundResetOutgoingSync() : null
          }
          onPickSubmission={handlePickSubmission}
          onStartGame={() => undefined}
          onStartNextRound={() => undefined}
        />
        <Hand
          sync={sync}
          handCards={() => handCards}
          selectedCardIds={selectedCardIds}
          onToggleCard={handleToggleCard}
        />
      </section>
    </main>
  );
}

function normalizeStage(stage: string | null): CardAnimationsStage {
  return STAGES.includes(stage as CardAnimationsStage)
    ? (stage as CardAnimationsStage)
    : "hand-picked";
}

function defaultSelectedCards(stage: CardAnimationsStage): string[] {
  if (stage === "hand-picked") {
    return handCards[0] ? [handCards[0].id] : [];
  }

  if (stage === "hand-swapped") {
    return handCards[2] ? [handCards[2].id] : [];
  }

  return [];
}

function buildSyncView(
  stage: CardAnimationsStage,
  revealedSubmissionIds: string[],
  winnerSubmissionId: string | null,
  countdownSeconds: number
): SyncView {
  const blackCard = blackCards[0] ?? null;
  const submissions = buildSubmissions(
    stage,
    revealedSubmissionIds,
    winnerSubmissionId
  );
  const winnerSubmission =
    winnerSubmissionId === null
      ? null
      : (sampleSubmissions.find((entry) => entry.id === winnerSubmissionId) ??
        null);
  const isHandStage =
    stage === "hand-picked" ||
    stage === "hand-swapped" ||
    stage === "round-reset";
  const isRevealStage = stage === "reveal";
  const isPickWinnerStage = stage === "pick-winner";
  const isRoundResetStage = stage === "round-reset";
  const isWinnerPickedStage = stage === "winner-picked";

  return {
    roomId: "card-animations-lab",
    roomName: deckName,
    started: true,
    phase: isHandStage ? "submitting" : isRevealStage ? "judging" : "result",
    round: isRoundResetStage ? 4 : 3,
    submissionSecondsLeft:
      isHandStage || isPickWinnerStage
        ? countdownSeconds
        : winnerSubmissionId === null && submissions.length > 0
          ? Math.max(1, Math.floor(countdownSeconds / 2))
          : null,
    announcement: "Card animations lab.",
    blackCardId: blackCard?.id ?? null,
    blackCard: blackCard
      ? {
          id: blackCard.id,
          text: blackCard.text,
          pick: blackCard.pick
        }
      : null,
    blackPick: blackCard?.pick ?? 1,
    judgeId: isRoundResetStage ? "player-3" : "player-1",
    lastWinnerId: winnerSubmission?.playerId ?? null,
    winnerSelectionClosed: isWinnerPickedStage,
    votingClosed: isWinnerPickedStage,
    winnerPlayerIds: winnerSubmission ? [winnerSubmission.playerId] : [],
    highlightedSubmissionId: isRevealStage
      ? (sampleSubmissions.find(
          (entry) => !revealedSubmissionIds.includes(entry.id)
        )?.id ?? null)
      : isPickWinnerStage
        ? "lab-submission-2"
        : null,
    resolutionPending: false,
    players: [
      {
        id: "player-1",
        username: "Host",
        score: winnerSubmission?.playerId === "player-1" ? 1 : 0,
        connected: true,
        disconnectSecondsLeft: null,
        handCount: 7,
        isJudge: true,
        isWaiting: false,
        hasSubmitted: false
      },
      {
        id: "player-2",
        username: "Alice",
        score: winnerSubmission?.playerId === "player-2" ? 1 : 0,
        connected: true,
        disconnectSecondsLeft: null,
        handCount: 6,
        isJudge: false,
        isWaiting: false,
        hasSubmitted: true
      },
      {
        id: "player-3",
        username: "Bob",
        score: winnerSubmission?.playerId === "player-3" ? 1 : 0,
        connected: true,
        disconnectSecondsLeft: null,
        handCount: 6,
        isJudge: false,
        isWaiting: false,
        hasSubmitted: true
      },
      {
        id: "player-4",
        username: "Carol",
        score: winnerSubmission?.playerId === "player-4" ? 1 : 0,
        connected: true,
        disconnectSecondsLeft: null,
        handCount: 7,
        isJudge: false,
        isWaiting: false,
        hasSubmitted: stage === "pick-winner" || stage === "winner-picked"
      }
    ],
    submissions,
    hand: handCards.map((card) => card.id),
    handCards,
    selfRaisedCardIds: isHandStage ? [] : [handCards[1]?.id].filter(Boolean),
    selfPlayerId: isHandStage ? "player-2" : "player-1",
    canSubmit: isHandStage,
    canJudge: isRevealStage,
    canPickWinner: false,
    canVote: isPickWinnerStage
  };
}

function buildSubmissions(
  stage: CardAnimationsStage,
  revealedSubmissionIds: string[],
  winnerSubmissionId: string | null
): SyncSubmission[] {
  if (
    stage === "hand-picked" ||
    stage === "hand-swapped" ||
    stage === "round-reset"
  ) {
    return [];
  }

  return sampleSubmissions.map((entry) => {
    const revealed =
      stage === "reveal" ? revealedSubmissionIds.includes(entry.id) : true;

    return {
      id: entry.id,
      playerId: stage === "winner-picked" ? entry.playerId : undefined,
      cardIds: entry.cards.map((card) => card.id),
      cards: entry.cards,
      playerName: stage === "winner-picked" ? entry.playerName : undefined,
      hidden: !revealed,
      voteCount:
        stage === "winner-picked"
          ? entry.id === winnerSubmissionId
            ? 2
            : 1
          : undefined,
      votedBySelf:
        stage === "pick-winner" ? entry.id === "lab-submission-2" : undefined,
      ownSubmission: entry.playerId === "player-1",
      canVote: stage === "pick-winner" ? entry.playerId !== "player-1" : false,
      winner: stage === "winner-picked" && entry.id === winnerSubmissionId,
      highlighted:
        stage === "reveal"
          ? !revealed &&
            sampleSubmissions.find(
              (candidate) => !revealedSubmissionIds.includes(candidate.id)
            )?.id === entry.id
          : stage === "pick-winner" && entry.id === "lab-submission-2"
    };
  });
}
