import {
  For,
  Show,
  createMemo,
  createEffect,
  onCleanup,
  createSignal,
  type Accessor,
  type JSX
} from "solid-js";

import type { SubmissionAnimationCard, SyncView } from "../types.js";
import { FitText } from "./FitText.js";
import { buildHandStatus } from "./presentation.js";

type HandProps = {
  sync: Accessor<SyncView>;
  handCards: Accessor<NonNullable<SyncView["handCards"]>>;
  pendingSubmittedCards?: Accessor<SubmissionAnimationCard[]>;
  selectedCardIds: Accessor<string[]>;
  submissionAnimationCards?: Accessor<SubmissionAnimationCard[]>;
  onToggleCard: (cardId: string) => void;
  onSubmissionAnimationComplete?: () => void;
};

export function Hand(props: HandProps): JSX.Element {
  const pendingSubmittedCards = () => props.pendingSubmittedCards?.() ?? [];
  const slots = createMemo(() => {
    const pendingByIndex = new Map(
      pendingSubmittedCards().map((card) => [card.handIndex, card.id])
    );
    const visibleHandCards = props.handCards();
    const visibleSlotCount = Math.max(
      0,
      Math.min(visibleHandCards.length, 7 - pendingByIndex.size)
    );
    const visibleCards = visibleHandCards.slice(0, visibleSlotCount);
    let visibleIndex = 0;

    return Array.from({ length: 7 }, (_, index) => {
      if (pendingByIndex.has(index)) {
        return {
          slotIndex: index,
          card: null
        };
      }

      const card = visibleCards[visibleIndex] ?? null;
      visibleIndex += 1;
      return {
        slotIndex: index,
        card
      };
    });
  });
  const submissionAnimationCards = () =>
    props.submissionAnimationCards?.() ?? [];
  const [transitionCycle, setTransitionCycle] = createSignal(0);
  let submissionAnimationTimeout = 0;

  let previousTransitionKey = "";
  createEffect(() => {
    const sync = props.sync();
    const nextKey = `${sync.started}:${sync.round}:${sync.selfPlayerId}`;
    if (previousTransitionKey && previousTransitionKey !== nextKey) {
      setTransitionCycle((current) => current + 1);
    }
    previousTransitionKey = nextKey;
  });

  createEffect(() => {
    const cards = submissionAnimationCards();
    window.clearTimeout(submissionAnimationTimeout);
    if (cards.length === 0) {
      return;
    }

    submissionAnimationTimeout = window.setTimeout(() => {
      props.onSubmissionAnimationComplete?.();
    }, 960);
  });

  onCleanup(() => {
    window.clearTimeout(submissionAnimationTimeout);
  });

  return (
    <section class="hand-wrap">
      <div class="hand-toolbar">
        <span
          data-testid="hand-status"
          class={`status-pill ${props.sync().canSubmit ? "ok" : ""} ${isCriticalCountdown(props.sync()) ? "warn status-pill-critical" : ""}`}
        >
          {buildHandStatus(props.sync())}
        </span>
      </div>
      <Show when={submissionAnimationCards().length > 0}>
        <div class="hand-submit-burst" aria-hidden="true">
          <For each={submissionAnimationCards()}>
            {(card, index) => (
              <article
                class="card white hand-submit-card"
                style={{
                  "--burst-index": `${index()}`,
                  "--burst-total": `${submissionAnimationCards().length}`,
                  "--hand-index": `${card.handIndex}`
                }}
              >
                <FitText
                  class="card-copy-secondary"
                  text={card.text}
                  maxRem={1.08}
                  minRem={0.68}
                />
              </article>
            )}
          </For>
        </div>
      </Show>
      <Show when={props.sync().started}>
        <div data-testid="hand-grid" class="hand-grid">
          <For each={slots()}>
            {(slot) => {
              const slotStyle = () => ({
                "--hand-index": `${slot.slotIndex}`,
                "--hand-entry-name":
                  transitionCycle() % 2 === 0
                    ? "hand-slot-rise-a"
                    : "hand-slot-rise-b"
              });

              return (
                <div class="hand-slot" style={slotStyle()}>
                  {slot.card ? (
                    (() => {
                      const currentCard = slot.card;
                      const selected = () =>
                        props.sync().canSubmit
                          ? props.selectedCardIds().includes(currentCard.id)
                          : (props.sync().selfRaisedCardIds ?? []).includes(
                              currentCard.id
                            );

                      return (
                        <button
                          data-testid="hand-card"
                          class={`card white ${props.sync().canSubmit ? "selectable" : ""} ${selected() ? "raised" : ""}`}
                          disabled={!props.sync().canSubmit}
                          onClick={() => props.onToggleCard(currentCard.id)}
                        >
                          <FitText
                            testId="hand-card-copy"
                            class="card-copy-secondary"
                            text={currentCard.text}
                            maxRem={1.15}
                            minRem={0.68}
                          />
                        </button>
                      );
                    })()
                  ) : (
                    <div class="card white hand-placeholder" />
                  )}
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </section>
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
