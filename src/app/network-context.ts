import type { MemoryTransportHub } from "../network/memory.js";
import type { HostRuntime } from "../host/runtime.js";
import type { NetworkContext } from "../network/context.js";
import {
  currentUsername,
  getRecoveryBundle,
  persistIdentity,
  trimSelectionsToHand
} from "../session/index.js";
import { currentSync } from "./selectors.js";
import type { AppState } from "./state.js";

export type CreateNetworkContextArgs = {
  state: AppState;
  storageKey: string;
  saveIdentity: (storageKey: string, identity: AppState["identity"]) => void;
  hostStorageKey: string;
  saveHostState: (storageKey: string, host: HostRuntime | null) => void;
  transportMode: "loopback" | "memory" | "peerjs";
  memoryTransportHub: MemoryTransportHub | null;
  hostCountdownMs: number | null;
  guestConnectTimeoutMs: number | null;
  guestReconnectBackoffMs: number[] | null;
  guestReconnectMaxAttempts: number | null;
  rtcConfig: RTCConfiguration;
  setFlash: (message: string) => void;
};

export function createNetworkContext(
  args: CreateNetworkContextArgs
): NetworkContext {
  const {
    state,
    storageKey,
    saveIdentity,
    hostStorageKey,
    saveHostState,
    transportMode,
    memoryTransportHub,
    hostCountdownMs,
    guestConnectTimeoutMs,
    guestReconnectBackoffMs,
    guestReconnectMaxAttempts,
    rtcConfig,
    setFlash
  } = args;
  let winnerPickLockoutTimeout = 0;

  return {
    state,
    transportMode,
    memoryTransportHub,
    hostCountdownMs,
    guestConnectTimeoutMs,
    guestReconnectBackoffMs,
    guestReconnectMaxAttempts,
    rtcConfig,
    currentUsername: () => currentUsername(state),
    getRecoveryBundle: (roomId: string | null) =>
      getRecoveryBundle(state, roomId),
    persistIdentity: () => {
      if (transportMode === "memory") {
        return;
      }
      persistIdentity(storageKey, state, saveIdentity);
    },
    persistHostState: (host: HostRuntime | null) => {
      if (transportMode === "memory") {
        return;
      }
      saveHostState(hostStorageKey, host);
    },
    trimSelectionsToHand: (hand: string[]) => trimSelectionsToHand(state, hand),
    currentSync: () => currentSync(state),
    setFlash,
    armWinnerPickLockout: () => {
      state.winnerPickBlocked = true;
      window.clearTimeout(winnerPickLockoutTimeout);
      winnerPickLockoutTimeout = window.setTimeout(() => {
        state.winnerPickBlocked = false;
      }, 550);
    },
    clearWinnerPickLockout: () => {
      state.winnerPickBlocked = false;
      window.clearTimeout(winnerPickLockoutTimeout);
    }
  };
}
