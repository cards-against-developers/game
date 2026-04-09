import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  type JSX
} from "solid-js";

import type { BoardCardModel } from "../board/manager.js";
import type { SyncView } from "../types.js";
import { BoardCardFace } from "./BoardCardFace.js";

export function SubmissionBoardCard(props: {
  sync: SyncView;
  card: BoardCardModel;
  style: Record<string, string>;
  disabled: boolean;
  justRevealed: boolean;
  clickedToReveal: boolean;
  resolutionPending: boolean;
  onRevealIntent: (submissionId: string) => void;
  onPickSubmission: (submissionId: string) => void;
}): JSX.Element {
  const [celebrateWinner, setCelebrateWinner] = createSignal(false);
  const celebratedWinnerKeys = new Set<string>();
  let celebrateTimeout = 0;

  createEffect(() => {
    if (!props.card.winner) {
      return;
    }

    const winnerKey = `${props.sync.roomId}:${props.sync.round}:${props.card.id}`;
    if (celebratedWinnerKeys.has(winnerKey)) {
      return;
    }

    celebratedWinnerKeys.add(winnerKey);
    setCelebrateWinner(true);

    window.clearTimeout(celebrateTimeout);
    celebrateTimeout = window.setTimeout(() => {
      setCelebrateWinner(false);
    }, 950);
  });

  onCleanup(() => {
    window.clearTimeout(celebrateTimeout);
  });

  const submission = createMemo(() =>
    props.sync.submissions.find((entry) => entry.id === props.card.id)
  );
  const className = createMemo(() => {
    const hiddenClass = props.card.hidden ? "submission-choice-hidden" : "";
    const pickableClass =
      !props.card.hidden && !props.card.winner && !props.disabled
        ? " submission-choice-pickable"
        : "";
    const winnerClass = props.card.winner ? " submission-choice-winner" : "";
    const winnerCelebrateClass = celebrateWinner()
      ? " submission-choice-winner-celebrate"
      : "";
    const resolutionPendingClass = props.resolutionPending
      ? " submission-choice-resolution-pending"
      : "";
    const freshRevealClass = props.justRevealed
      ? " submission-choice-revealed-fresh"
      : "";
    const clickedRevealClass = props.clickedToReveal
      ? " submission-choice-reveal-clicked"
      : "";
    const highlightedClass =
      props.card.highlighted && props.sync.phase === "judging"
        ? " submission-choice-highlighted"
        : "";
    const votedClass =
      submission()?.votedBySelf && !props.sync.votingClosed
        ? " submission-choice-voted"
        : "";

    return `board-card-node seat-node submission-choice ${hiddenClass}${pickableClass}${winnerClass}${winnerCelebrateClass}${resolutionPendingClass}${freshRevealClass}${clickedRevealClass}${highlightedClass}${votedClass}`;
  });

  return (
    <button
      data-testid="submission-choice"
      class={className()}
      style={props.style}
      disabled={props.disabled}
      onClick={() => {
        if (props.card.hidden) {
          props.onRevealIntent(props.card.id);
        }

        props.onPickSubmission(props.card.id);
      }}
    >
      <div
        class={`submission-card-flip ${props.card.hidden ? "submission-card-flip-hidden submission-card-hidden" : ""}`}
      >
        <div class="submission-card-face submission-card-face-back">
          <BoardCardFace
            sync={props.sync}
            card={{
              ...props.card,
              hidden: true,
              text: "Cards Against Developers"
            }}
            includeHiddenClass={false}
          />
        </div>
        <div class="submission-card-face submission-card-face-front">
          <BoardCardFace
            sync={props.sync}
            card={{
              ...props.card,
              hidden: false
            }}
            includeHiddenClass={false}
          />
        </div>
      </div>
    </button>
  );
}
