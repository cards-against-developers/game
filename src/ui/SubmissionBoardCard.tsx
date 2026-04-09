import { type JSX } from "solid-js";

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
  onRevealIntent: (submissionId: string) => void;
  onPickSubmission: (submissionId: string) => void;
}): JSX.Element {
  const pickableClass =
    !props.card.hidden && !props.card.winner && !props.disabled
      ? " submission-choice-pickable"
      : "";
  const winnerClass = props.card.winner ? " submission-choice-winner" : "";
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

  return (
    <button
      data-testid="submission-choice"
      class={`board-card-node seat-node submission-choice ${props.card.hidden ? "submission-choice-hidden" : ""}${pickableClass}${winnerClass}${freshRevealClass}${clickedRevealClass}${highlightedClass}`}
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
