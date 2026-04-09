import { getBlackCard, getHandCards } from "../cards/index.js";
import { buildSyncView } from "../game/sync.js";
import { deckName } from "../cards/index.js";
import type { SyncPlayer, SyncView } from "../types.js";
import type { AppState } from "./state.js";

export function currentSync(state: AppState) {
  const now = state.nowTick;
  const sync = state.host
    ? buildSyncView(
        state.host.roomId,
        state.host.roomName,
        state.host.state,
        state.host.selfPlayerId,
        now
      )
    : state.guest.sync
      ? deriveGuestSyncView(
          state.guest.sync,
          now,
          state.guest.hostClockOffsetMs ?? null
        )
      : createEmptySyncView();

  return {
    ...sync
  };
}

export function currentPlayer(state: AppState): SyncPlayer | null {
  const sync = currentSync(state);
  return sync.players.find((player) => player.id === sync.selfPlayerId) ?? null;
}

export function currentHandCards(state: AppState) {
  const sync = currentSync(state);
  return sync.handCards ?? getHandCards(sync.hand);
}

export function currentBlackCard(state: AppState) {
  const sync = currentSync(state);
  return sync.blackCard ?? getBlackCard(sync.blackCardId);
}

function createEmptySyncView(): SyncView {
  return {
    roomId: "",
    roomName: deckName,
    started: false,
    phase: "lobby",
    round: 0,
    submissionDeadlineAt: null,
    submissionSecondsLeft: null,
    announcement: "No active room yet.",
    blackCardId: null,
    blackCard: null,
    blackPick: 1,
    judgeId: null,
    lastWinnerId: null,
    winnerSelectionClosed: false,
    votingClosed: false,
    winnerPlayerIds: [],
    players: [],
    submissions: [],
    hand: [],
    handCards: [],
    selfPlayerId: "",
    canSubmit: false,
    canVote: false
  };
}

function deriveGuestSyncView(
  sync: SyncView,
  now: number,
  hostClockOffsetMs: number | null
): SyncView {
  const estimatedHostNow = now + (hostClockOffsetMs ?? 0);

  return {
    ...sync,
    submissionSecondsLeft: deriveSecondsLeft(
      sync.submissionDeadlineAt ?? null,
      estimatedHostNow,
      sync.submissionSecondsLeft
    ),
    players: sync.players.map((player) => ({
      ...player,
      disconnectSecondsLeft: deriveSecondsLeft(
        player.disconnectDeadlineAt ?? null,
        estimatedHostNow,
        player.disconnectSecondsLeft
      )
    }))
  };
}

function deriveSecondsLeft(
  deadlineAt: number | null,
  hostNow: number,
  fallback: number | null
): number | null {
  if (deadlineAt === null) {
    return fallback;
  }

  return Math.max(0, Math.ceil((deadlineAt - hostNow) / 1000));
}
