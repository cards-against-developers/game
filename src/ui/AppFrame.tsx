import { onCleanup, onMount, type JSX } from "solid-js";

import type { AppController } from "../app/controller.js";
import { currentBoardBlackCard, currentLocalHand } from "../app/view-model.js";
import { Hand } from "./Hand.js";
import { Table } from "./Table.js";

type AppFrameProps = {
  controller: AppController;
};

export function AppFrame(props: AppFrameProps): JSX.Element {
  const isHost = () => Boolean(props.controller.state.host);

  onMount(() => {
    const intervalId = window.setInterval(() => {
      props.controller.state.nowTick = Date.now();
    }, 1_000);

    onCleanup(() => {
      window.clearInterval(intervalId);
    });
  });

  return (
    <section class="game-stage">
      <Table
        sync={props.controller.currentSync}
        blackCard={() => currentBoardBlackCard(props.controller)}
        isHost={isHost}
        forceTransitionOnMount
        onPickSubmission={(submissionId) =>
          void props.controller.pickSubmission(submissionId)
        }
        onStartGame={() => void props.controller.startHostedGame()}
        onStartNextRound={() => void props.controller.startNextRound()}
      />

      <Hand
        sync={props.controller.currentSync}
        handCards={() => currentLocalHand(props.controller)}
        pendingSubmittedCards={() =>
          props.controller.state.pendingSubmittedCards ?? []
        }
        selectedCardIds={() => props.controller.state.selectedCardIds}
        submissionAnimationCards={() =>
          props.controller.state.submissionAnimationCards ?? []
        }
        onToggleCard={(cardId) => void props.controller.toggleCard(cardId)}
        onSubmissionAnimationComplete={() => {
          props.controller.state.submissionAnimationCards = [];
        }}
      />
    </section>
  );
}
