import { Show, type JSX } from "solid-js";

import type { BoardCardModel } from "../board/manager.js";
import type { SyncView } from "../types.js";
import { FitText } from "./FitText.js";

export function BoardCardFace(props: {
  sync: SyncView;
  card: BoardCardModel;
  includeHiddenClass?: boolean;
}): JSX.Element {
  const isRightSide = props.card.slot.x > 0;
  const submission = () =>
    props.card.kind === "submission"
      ? (props.sync.submissions.find((entry) => entry.id === props.card.id) ??
        null)
      : null;
  const footerName = boardCardFooterName(props.sync, props.card);
  const footerStatus = boardCardFooterStatus(props.sync, props.card);
  const footerVoteCount = boardCardFooterVoteCount(
    submission(),
    props.sync.votingClosed ?? false
  );
  const footerStart = isRightSide ? footerVoteCount : footerName;
  const footerEnd = isRightSide ? footerName : footerVoteCount;
  const seatNameTestId =
    props.card.kind === "player" && props.sync.phase === "lobby"
      ? "seat-name"
      : undefined;

  return (
    <article
      class={`card white small ${props.card.slot.x > 0 ? "board-card-right" : ""} ${props.card.winner ? "selected" : ""} ${props.card.hidden && (props.includeHiddenClass ?? true) ? "submission-card-hidden" : ""}`}
    >
      <Show when={props.card.kind === "player" && props.sync.phase === "lobby"}>
        <FitText
          class="card-copy-secondary submission-hidden-copy"
          text="Cards Against Developers"
          maxRem={0.98}
          minRem={0.62}
        />
      </Show>
      <Show
        when={!(props.card.kind === "player" && props.sync.phase === "lobby")}
      >
        <FitText
          class={`card-copy-secondary ${props.card.hidden ? "submission-hidden-copy" : ""}`}
          text={props.card.text}
          maxRem={props.card.kind === "player" ? 1.02 : 1.05}
          minRem={props.card.kind === "player" ? 0.66 : 0.62}
        />
      </Show>
      <div class="card-footer board-card-footer">
        <Show when={footerStart}>
          <span class="board-card-footer-start" data-testid={seatNameTestId}>
            {footerStart}
          </span>
        </Show>
        <Show when={footerStatus}>
          <span class="board-card-footer-center">{footerStatus}</span>
        </Show>
        <Show when={footerEnd}>
          <span class="board-card-footer-end" data-testid={seatNameTestId}>
            {footerEnd}
          </span>
        </Show>
      </div>
    </article>
  );
}

function boardCardFooterName(sync: SyncView, card: BoardCardModel): string {
  if (card.kind !== "player") {
    const submission = sync.submissions.find((entry) => entry.id === card.id);
    if (!submission || submission.hidden) {
      return "";
    }
    return submission.playerName ?? "";
  }

  if (sync.phase === "lobby") {
    return card.text;
  }

  if (!card.connected && card.reconnectSecondsLeft !== null) {
    return `Rejoin ${card.reconnectSecondsLeft}s`;
  }

  return "";
}

function boardCardFooterVoteCount(
  submission: SyncView["submissions"][number] | null,
  votingClosed: boolean
): string {
  if (!submission || submission.hidden) {
    return "";
  }

  if (votingClosed) {
    return typeof submission.voteCount === "number"
      ? `★ ${submission.voteCount}`
      : "";
  }

  return submission.votedBySelf ? "★ 1" : "";
}

function boardCardFooterStatus(sync: SyncView, card: BoardCardModel): string {
  if (card.kind === "player") {
    return card.connected === false ? "Offline seat" : "";
  }

  return "";
}
