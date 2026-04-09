import type { HostRuntime } from "../host/runtime.js";
import { createGuestRuntime, type GuestRuntime } from "../network/runtime.js";
import type { StoredIdentity } from "../types.js";
import type { SubmissionAnimationCard, SyncWhiteCard } from "../types.js";

export type AppState = {
  identity: StoredIdentity;
  nowTick: number;
  usernameInput: string;
  seedInput: string;
  joinHostId: string;
  joinRoomId: string;
  host: HostRuntime | null;
  guest: GuestRuntime;
  selectedCardIds: string[];
  localHandOverride?: SyncWhiteCard[];
  pendingSubmittedCards?: SubmissionAnimationCard[];
  winnerPickBlocked: boolean;
  submissionAnimationCards?: SubmissionAnimationCard[];
  recoveryImportInput: string;
  flash: string;
};

export function createInitialAppState(identity: StoredIdentity): AppState {
  return {
    identity,
    nowTick: Date.now(),
    usernameInput: identity.lastUsername,
    seedInput: "cards-against-developers",
    joinHostId: "",
    joinRoomId: "",
    host: null,
    guest: createGuestRuntime(),
    selectedCardIds: [],
    localHandOverride: [],
    pendingSubmittedCards: [],
    winnerPickBlocked: false,
    submissionAnimationCards: [],
    recoveryImportInput: "",
    flash: ""
  };
}
