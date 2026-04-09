import type { AppState } from "../app/state.js";
import type { HostRuntime } from "../host/runtime.js";
import type { MemoryTransportHub } from "./memory.js";
import type { RecoveryBundle, SyncView } from "../types.js";

export type NetworkContext = {
  state: AppState;
  transportMode: "loopback" | "memory" | "peerjs";
  memoryTransportHub: MemoryTransportHub | null;
  hostCountdownMs: number | null;
  guestConnectTimeoutMs?: number | null;
  guestReconnectBackoffMs?: number[] | null;
  guestReconnectMaxAttempts?: number | null;
  rtcConfig: RTCConfiguration;
  currentUsername: () => string;
  getRecoveryBundle: (roomId: string | null) => RecoveryBundle | null;
  persistIdentity: () => void;
  persistHostState: (host: HostRuntime | null) => void;
  trimSelectionsToHand: (hand: string[]) => void;
  currentSync: () => SyncView;
  setFlash: (message: string) => void;
  armWinnerPickLockout: () => void;
  clearWinnerPickLockout: () => void;
};
