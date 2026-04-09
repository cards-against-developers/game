import type { HostGameState } from "../types.js";
import type { ChannelLike, TransportHandle } from "../network/transport.js";
import type { NetworkContext } from "../network/context.js";
import { processRoundDeadline } from "../game/deadlines.js";
import { syncAllPlayers } from "../network/sync.js";

export type PendingDisconnect = {
  timeoutId: ReturnType<typeof setTimeout>;
  intervalId?: ReturnType<typeof setInterval>;
};

export type HostRuntime = {
  roomId: string;
  roomName: string;
  peerId: string;
  selfPlayerId: string;
  seed: string;
  state: HostGameState;
  connections: Map<string, ChannelLike>;
  transportHandle: TransportHandle | null;
  roundTimerIntervalId: ReturnType<typeof setInterval> | null;
  pendingDisconnects: Map<string, PendingDisconnect>;
};

export function clearPendingDisconnect(
  host: HostRuntime,
  playerId: string
): void {
  const pending = host.pendingDisconnects.get(playerId);
  if (!pending) {
    return;
  }

  clearTimeout(pending.timeoutId);
  if (pending.intervalId) {
    clearInterval(pending.intervalId);
  }
  host.pendingDisconnects.delete(playerId);
}

export function ensureRoundTimer(
  host: HostRuntime,
  context: NetworkContext
): void {
  if (host.roundTimerIntervalId) {
    return;
  }

  host.roundTimerIntervalId = setInterval(() => {
    if (
      !host.state.started ||
      host.state.submissionDeadlineAt === null ||
      Date.now() < host.state.submissionDeadlineAt
    ) {
      return;
    }
    processRoundDeadline(host.state);
    syncAllPlayers(host, context);
  }, 1_000);
}
