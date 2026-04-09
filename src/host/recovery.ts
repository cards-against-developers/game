import type { RecoveryBundle } from "../types.js";
import { encodeJson } from "../utils/codec.js";
import type { HostRuntime } from "./runtime.js";

export function buildRecoveryBundle(
  host: HostRuntime,
  playerId: string
): string {
  const player = host.state.players.find((entry) => entry.id === playerId);
  if (!player) {
    return "";
  }

  return encodeJson({
    roomId: host.roomId,
    playerId: player.id,
    reconnectToken: player.reconnectToken
  } satisfies RecoveryBundle);
}
