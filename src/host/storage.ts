import type { HostGameState } from "../types.js";
import type { HostRuntime } from "./runtime.js";

export type StoredHostSnapshot = {
  roomId: string;
  roomName: string;
  peerId: string;
  selfPlayerId: string;
  seed: string;
  state: HostGameState;
};

export function buildHostStorageKey(peerId: string, roomId: string): string {
  return `cards-against-developers.host.v1.${peerId}.${roomId}`;
}

export function loadHostSnapshot(
  storageKey: string
): StoredHostSnapshot | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as StoredHostSnapshot;
  } catch {
    return null;
  }
}

export function saveHostSnapshot(
  storageKey: string,
  host: HostRuntime | null
): void {
  if (!host) {
    localStorage.removeItem(storageKey);
    return;
  }

  const snapshot: StoredHostSnapshot = {
    roomId: host.roomId,
    roomName: host.roomName,
    peerId: host.peerId,
    selfPlayerId: host.selfPlayerId,
    seed: host.seed,
    state: host.state
  };

  localStorage.setItem(storageKey, JSON.stringify(snapshot));
}

export function restoreHostRuntime(snapshot: StoredHostSnapshot): HostRuntime {
  return {
    roomId: snapshot.roomId,
    roomName: snapshot.roomName,
    peerId: snapshot.peerId,
    selfPlayerId: snapshot.selfPlayerId,
    seed: snapshot.seed,
    state: snapshot.state,
    connections: new Map(),
    transportHandle: null,
    roundTimerIntervalId: null,
    pendingDisconnects: new Map()
  };
}
