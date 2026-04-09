import { findHostPlayerById } from "../game/submissions.js";
import { buildSyncView } from "../game/sync.js";
import { sendMessage, type ChannelLike } from "./transport.js";
import type { HostRuntime } from "../host/runtime.js";
import type { NetworkContext } from "./context.js";

export function syncAllPlayers(
  host: HostRuntime,
  context: NetworkContext
): void {
  for (const player of host.state.players) {
    const payload = buildSyncView(
      host.roomId,
      host.roomName,
      host.state,
      player.id
    );
    if (player.id === host.selfPlayerId) {
      continue;
    }

    const channel = findChannelForPlayer(host, player.id);
    if (channel && channel.readyState === "open") {
      sendMessage(channel, { type: "sync", payload });
    }
  }

  const selfSync = buildSyncView(
    host.roomId,
    host.roomName,
    host.state,
    host.selfPlayerId
  );
  if (selfSync.phase !== "submitting") {
    context.state.selectedCardIds = [];
  } else {
    context.trimSelectionsToHand(selfSync.hand);
  }

  context.persistHostState(host);
}

function findChannelForPlayer(
  host: HostRuntime,
  playerId: string
): ChannelLike | null {
  const player = findHostPlayerById(host.state, playerId);
  if (!player?.connectionId) {
    return null;
  }
  return host.connections.get(player.connectionId) ?? null;
}
