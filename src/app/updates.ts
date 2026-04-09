import type { AppState } from "./state.js";

export function updateUsername(state: AppState, value: string): void {
  state.usernameInput = value;
}

export function updateSeed(state: AppState, value: string): void {
  state.seedInput = value;
}

export function updateJoinHost(
  state: AppState,
  hostId: string,
  roomId = ""
): void {
  state.joinHostId = hostId.trim();
  state.joinRoomId = roomId.trim();
}

export function updateRecoveryImport(state: AppState, value: string): void {
  state.recoveryImportInput = value;
}
