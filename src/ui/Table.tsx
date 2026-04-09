import {
  For,
  Show,
  createMemo,
  createRenderEffect,
  createSignal,
  onCleanup,
  onMount,
  type Accessor,
  type JSX
} from "solid-js";

import {
  BLACK_CARD_SLOT,
  BOARD_LAYOUT_HEIGHT,
  BOARD_LAYOUT_WIDTH,
  buildBoardSlotStyle
} from "../board/layout.js";
import { buildBoardCards } from "../board/project.js";
import type { BoardCardModel } from "../board/manager.js";
import { escapeHtml } from "../utils/html.js";
import type { SyncView } from "../types.js";
import { BoardCardFace } from "./BoardCardFace.js";
import { FitText } from "./FitText.js";
import { Leaderboard } from "./Leaderboard.js";
import { buildBoardStatus } from "./presentation.js";
import { SubmissionBoardCard } from "./SubmissionBoardCard.js";
import { StartGameButton } from "./StartGameButton.js";
import { submissionAnimationStyleVars } from "./submissionAnimation.js";
import { useSubmissionRevealEffects } from "./useSubmissionRevealEffects.js";

type TableProps = {
  sync: Accessor<SyncView>;
  blackCard: Accessor<SyncView["blackCard"] | null | undefined>;
  isHost: Accessor<boolean>;
  transitionPreviewSync?: Accessor<SyncView | null>;
  forceTransitionOnMount?: boolean;
  onPickSubmission: (submissionId: string) => void;
  onStartGame: () => void;
  onStartNextRound: () => void;
};

type BoardTransitionSnapshot = {
  sync: SyncView;
  blackCardText: string;
};

export function Table(props: TableProps): JSX.Element {
  let tableElement: HTMLElement | undefined;
  const statusText = () => buildBoardStatus(props.sync());
  const connectedPlayerCount = () =>
    props.sync().players.filter((player) => player.connected).length;
  const canStartGame = () => connectedPlayerCount() >= 3;
  const lobbyBlackCardText = () =>
    props.isHost()
      ? "Invite players by sharing the current URL with them."
      : "Waiting for host to start the game.";
  const previewSnapshot = createMemo(() => {
    const previewSync = props.transitionPreviewSync?.() ?? null;
    if (!previewSync) {
      return null;
    }

    return {
      sync: previewSync,
      blackCardText: blackCardTextForSync(previewSync, lobbyBlackCardText())
    } satisfies BoardTransitionSnapshot;
  });
  const [transitionSnapshot, setTransitionSnapshot] =
    createSignal<BoardTransitionSnapshot | null>(null);
  const [transitionActive, setTransitionActive] = createSignal(
    Boolean(props.forceTransitionOnMount) || Boolean(previewSnapshot())
  );
  const [transitionDelayMs, setTransitionDelayMs] = createSignal(
    previewSnapshot()?.blackCardText.trim().length ? 780 : 0
  );
  const [boardScale, setBoardScale] = createSignal(1);
  const activeTransitionSnapshot = createMemo(
    () => previewSnapshot() ?? transitionSnapshot()
  );
  const isTransitionActive = () =>
    Boolean(previewSnapshot()) || transitionActive();

  let transitionTimeout = 0;
  let previousSync: SyncView | null = null;

  onMount(() => {
    if (!tableElement) {
      return;
    }

    const element = tableElement;
    const updateBoardScale = () => {
      const { width, height } = element.getBoundingClientRect();
      setBoardScale(calculateBoardScale(width, height));
    };
    const resizeObserver = new ResizeObserver(updateBoardScale);

    updateBoardScale();
    resizeObserver.observe(tableElement);

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  createRenderEffect(() => {
    if (!props.forceTransitionOnMount) {
      return;
    }

    const currentSync = props.sync();
    if (!currentSync.roomId || transitionActive()) {
      return;
    }

    setTransitionDelayMs(0);
    setTransitionActive(true);

    window.clearTimeout(transitionTimeout);
    transitionTimeout = window.setTimeout(() => {
      setTransitionActive(false);
      setTransitionSnapshot(null);
      setTransitionDelayMs(0);
    }, 900);
  });

  createRenderEffect(() => {
    const currentSync = props.sync();
    if (props.transitionPreviewSync?.()) {
      previousSync = currentSync;
      return;
    }

    if (!previousSync) {
      previousSync = currentSync;
      return;
    }

    if (!shouldAnimateTableTransition(previousSync, currentSync)) {
      previousSync = currentSync;
      return;
    }

    const snapshot = {
      sync: previousSync,
      blackCardText: blackCardTextForSync(previousSync, lobbyBlackCardText())
    } satisfies BoardTransitionSnapshot;
    const hasOutgoingBlack = snapshot.blackCardText.trim().length > 0;

    setTransitionSnapshot(snapshot);
    setTransitionDelayMs(hasOutgoingBlack ? 780 : 0);
    setTransitionActive(true);

    window.clearTimeout(transitionTimeout);
    transitionTimeout = window.setTimeout(
      () => {
        setTransitionActive(false);
        setTransitionSnapshot(null);
        setTransitionDelayMs(0);
      },
      hasOutgoingBlack ? 1700 : 900
    );

    previousSync = currentSync;
  });

  onCleanup(() => {
    window.clearTimeout(transitionTimeout);
  });

  return (
    <section
      ref={(element) => {
        tableElement = element;
      }}
      data-testid="board-panel"
      class={`table board ${isTransitionActive() ? "table-transition-active" : ""}`}
      style={{
        ...submissionAnimationStyleVars(),
        "--board-scale": `${boardScale()}`,
        "--table-black-in-delay": `${previewSnapshot() ? 780 : transitionDelayMs()}ms`
      }}
    >
      <Show when={statusText().trim().length > 0}>
        <div
          data-testid="board-status"
          class={`table-status ${isCriticalCountdown(props.sync()) ? "table-status-critical" : ""}`}
        >
          {statusText()}
        </div>
      </Show>
      <div class="table-leaderboard">
        <Leaderboard sync={props.sync} />
      </div>
      <Show when={activeTransitionSnapshot()}>
        {(snapshot) => <BoardTransitionOverlay snapshot={snapshot()} />}
      </Show>
      <div class="table-board-field">
        <div
          class={`table-ring ${(props.sync().winnerPlayerIds ?? []).length > 0 ? "table-ring-has-winner" : ""}`}
        >
          <BoardRing
            sync={props.sync}
            onPickSubmission={props.onPickSubmission}
          />
        </div>
        <div class="table-center" style={buildBoardSlotStyle(BLACK_CARD_SLOT)}>
          <article data-testid="black-card" class="card black">
            <Show when={props.sync().round > 0}>
              <div class="card-label">Round {props.sync().round}</div>
            </Show>
            <FitText
              class="card-copy-primary"
              html={formatBlackCardHtml(
                props.blackCard()?.text ?? lobbyBlackCardText()
              )}
              maxRem={1.56}
              minRem={0.78}
            />
            <Show when={props.isHost() && !props.sync().started}>
              <div class="card-footer card-footer-action">
                <StartGameButton
                  inverted
                  testId="start-game"
                  disabled={!canStartGame()}
                  label={
                    canStartGame() ? "Start game" : "Need 3 players to start"
                  }
                  onClick={props.onStartGame}
                />
              </div>
            </Show>
            <Show
              when={
                props.isHost() &&
                props.sync().phase === "result" &&
                (props.sync().submissions.length === 0 ||
                  props.sync().votingClosed)
              }
            >
              <div class="card-footer card-footer-action">
                <StartGameButton
                  inverted
                  testId="start-next-round"
                  label="Next round"
                  onClick={props.onStartNextRound}
                />
              </div>
            </Show>
          </article>
        </div>
      </div>
    </section>
  );
}

function calculateBoardScale(width: number, height: number): number {
  if (width <= 0 || height <= 0) {
    return 1;
  }

  return Number(
    Math.min(
      1,
      width / BOARD_LAYOUT_WIDTH,
      height / BOARD_LAYOUT_HEIGHT
    ).toFixed(4)
  );
}

function isCriticalCountdown(sync: SyncView): boolean {
  if (sync.phase === "judging") {
    return false;
  }

  return Boolean(
    sync.submissionSecondsLeft !== null && sync.submissionSecondsLeft <= 3
  );
}

function BoardTransitionOverlay(props: {
  snapshot: BoardTransitionSnapshot;
}): JSX.Element {
  const cards = createMemo(() => buildBoardCards(props.snapshot.sync));

  return (
    <div class="table-transition-overlay" aria-hidden="true">
      <div class="table-board-field">
        <For each={cards()}>
          {(card) => (
            <article
              class={`board-card-node seat-node seat table-transition-outgoing-card ${card.slot.x < 0 ? "table-transition-outgoing-card-left" : "table-transition-outgoing-card-right"}`}
              style={buildBoardSlotStyle(card.slot)}
            >
              <BoardCardFace sync={props.snapshot.sync} card={card} />
            </article>
          )}
        </For>
        <Show when={props.snapshot.blackCardText.trim().length > 0}>
          <div
            class="table-center table-transition-outgoing-black"
            style={buildBoardSlotStyle(BLACK_CARD_SLOT)}
          >
            <article class="card black">
              <Show when={props.snapshot.sync.round > 0}>
                <div class="card-label">Round {props.snapshot.sync.round}</div>
              </Show>
              <FitText
                class="card-copy-primary"
                html={formatBlackCardHtml(props.snapshot.blackCardText)}
                maxRem={1.56}
                minRem={0.78}
              />
            </article>
          </div>
        </Show>
      </div>
    </div>
  );
}

function BoardRing(props: {
  sync: Accessor<SyncView>;
  onPickSubmission: (submissionId: string) => void;
}): JSX.Element {
  const cards = () => buildBoardCards(props.sync());
  const revealEffects = useSubmissionRevealEffects(cards);

  return (
    <For each={cards()}>
      {(card) => {
        return (
          <Show
            when={card.kind === "submission"}
            fallback={
              <article
                class="board-card-node seat-node seat"
                style={buildBoardSlotStyle(card.slot)}
              >
                <BoardCardFace sync={props.sync()} card={card} />
              </article>
            }
          >
            <SubmissionBoardCard
              sync={props.sync()}
              card={card}
              style={buildBoardSlotStyle(card.slot)}
              disabled={boardCardDisabled(props.sync(), card)}
              justRevealed={revealEffects.isFreshReveal(card.id)}
              clickedToReveal={revealEffects.isRevealClicked(card.id)}
              onRevealIntent={revealEffects.markRevealClicked}
              onPickSubmission={props.onPickSubmission}
            />
          </Show>
        );
      }}
    </For>
  );
}

function formatBlackCardHtml(text: string): string {
  return escapeHtml(text)
    .replace(/\\BLANK/g, `<span class="blank">&nbsp;</span>`)
    .replace(/_{3,}/g, `<span class="blank">&nbsp;</span>`);
}

function boardCardDisabled(sync: SyncView, card: BoardCardModel): boolean {
  if (card.kind !== "submission") {
    return true;
  }

  if (card.hidden) {
    return true;
  }

  const submission = sync.submissions.find((entry) => entry.id === card.id);
  return !(submission?.canVote && sync.canVote);
}

function blackCardTextForSync(sync: SyncView, lobbyText: string): string {
  if (!sync.roomId) {
    return "";
  }

  return sync.blackCard?.text ?? lobbyText;
}

function shouldAnimateTableTransition(
  previousSync: SyncView,
  currentSync: SyncView
): boolean {
  if (!previousSync.roomId && currentSync.roomId) {
    return true;
  }

  if (previousSync.started !== currentSync.started) {
    return true;
  }

  return previousSync.round !== currentSync.round;
}
