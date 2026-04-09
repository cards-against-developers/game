import { createEffect, createSignal, onCleanup, type Accessor } from "solid-js";

import type { BoardCardModel } from "../board/manager.js";
import {
  SUBMISSION_REVEAL_CLICK_PULSE_MS,
  SUBMISSION_REVEAL_FRESH_STATE_MS
} from "./submissionAnimation.js";

export function useSubmissionRevealEffects(cards: Accessor<BoardCardModel[]>) {
  const [freshRevealIds, setFreshRevealIds] = createSignal<string[]>([]);
  const [clickedRevealIds, setClickedRevealIds] = createSignal<string[]>([]);
  const previousHiddenById = new Map<string, boolean>();
  const revealTimers = new Map<string, number>();
  const clickPulseTimers = new Map<string, number>();

  createEffect(() => {
    const nextCards = cards();
    const visibleIds = new Set(nextCards.map((card) => card.id));

    for (const [cardId, timer] of revealTimers) {
      if (visibleIds.has(cardId)) {
        continue;
      }

      window.clearTimeout(timer);
      revealTimers.delete(cardId);
    }

    for (const [cardId, timer] of clickPulseTimers) {
      if (visibleIds.has(cardId)) {
        continue;
      }

      window.clearTimeout(timer);
      clickPulseTimers.delete(cardId);
    }

    for (const card of nextCards) {
      const previousHidden = previousHiddenById.get(card.id);

      if (
        card.kind === "submission" &&
        previousHidden === true &&
        !card.hidden
      ) {
        setFreshRevealIds((current) =>
          current.includes(card.id) ? current : [...current, card.id]
        );

        const existingTimer = revealTimers.get(card.id);
        if (existingTimer !== undefined) {
          window.clearTimeout(existingTimer);
        }

        const timer = window.setTimeout(() => {
          setFreshRevealIds((current) =>
            current.filter((entryId) => entryId !== card.id)
          );
          revealTimers.delete(card.id);
        }, SUBMISSION_REVEAL_FRESH_STATE_MS);
        revealTimers.set(card.id, timer);
      }

      previousHiddenById.set(card.id, card.hidden);
    }

    for (const cardId of [...previousHiddenById.keys()]) {
      if (!visibleIds.has(cardId)) {
        previousHiddenById.delete(cardId);
      }
    }
  });

  onCleanup(() => {
    for (const timer of revealTimers.values()) {
      window.clearTimeout(timer);
    }

    for (const timer of clickPulseTimers.values()) {
      window.clearTimeout(timer);
    }
  });

  const markRevealClicked = (submissionId: string) => {
    setClickedRevealIds((current) =>
      current.includes(submissionId) ? current : [...current, submissionId]
    );

    const existingTimer = clickPulseTimers.get(submissionId);
    if (existingTimer !== undefined) {
      window.clearTimeout(existingTimer);
    }

    const timer = window.setTimeout(() => {
      setClickedRevealIds((current) =>
        current.filter((entryId) => entryId !== submissionId)
      );
      clickPulseTimers.delete(submissionId);
    }, SUBMISSION_REVEAL_CLICK_PULSE_MS);

    clickPulseTimers.set(submissionId, timer);
  };

  return {
    isFreshReveal: (cardId: string) => freshRevealIds().includes(cardId),
    isRevealClicked: (cardId: string) => clickedRevealIds().includes(cardId),
    markRevealClicked
  };
}
