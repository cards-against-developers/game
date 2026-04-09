import type { AppState } from "../app/state.js";
import type { RecoveryBundle } from "../types.js";
import { decodeJson, sanitizeUsername } from "../utils/index.js";

export function persistIdentity(
  storageKey: string,
  state: AppState,
  saveIdentity: (storageKey: string, identity: AppState["identity"]) => void
): void {
  saveIdentity(storageKey, state.identity);
}

export function getRecoveryBundle(
  state: AppState,
  roomId: string | null
): RecoveryBundle | null {
  if (!roomId) {
    return null;
  }
  return state.identity.rooms[roomId] ?? null;
}

export function importRecoveryBundle(
  state: AppState,
  storageKey: string,
  saveIdentityFn: (storageKey: string, identity: AppState["identity"]) => void
): string {
  const bundle = decodeJson<RecoveryBundle>(state.recoveryImportInput.trim());
  state.identity.rooms[bundle.roomId] = bundle;
  persistIdentity(storageKey, state, saveIdentityFn);
  return `Imported recovery for room ${bundle.roomId}.`;
}

export function currentUsername(state: AppState): string {
  const sanitized = sanitizeUsername(state.usernameInput);
  state.usernameInput = sanitized;
  return sanitized;
}

export function rememberCurrentUsername(
  storageKey: string,
  state: AppState,
  saveIdentity: (storageKey: string, identity: AppState["identity"]) => void
): void {
  state.identity.lastUsername = sanitizeUsername(state.usernameInput);
  persistIdentity(storageKey, state, saveIdentity);
}

export function trimSelectionsToHand(state: AppState, hand: string[]): void {
  state.selectedCardIds = state.selectedCardIds.filter((cardId) =>
    hand.includes(cardId)
  );
}
