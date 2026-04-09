import { createMutable } from "solid-js/store";

import {
  loadHostSnapshot,
  restoreHostRuntime,
  saveHostSnapshot
} from "../host/storage.js";
import type { MemoryTransportHub } from "../network/memory.js";
import { ensureRoundTimer } from "../host/runtime.js";
import { resumePersistedHost } from "../network/host.js";
import { disposeHostTransport } from "../network/host.js";
import { stopGuestSession } from "../network/guest.js";
import { loadIdentity, saveIdentity } from "../session/storage.js";
import type { SyncView } from "../types.js";
import { createActionHandler, type AppActions } from "./actions.js";
import {
  createNetworkContext,
  type CreateNetworkContextArgs
} from "./network-context.js";
import type { AppRouteState } from "./routes.js";
import { currentSync } from "./selectors.js";
import { createInitialAppState, type AppState } from "./state.js";
import {
  updateJoinHost,
  updateRecoveryImport,
  updateSeed,
  updateUsername
} from "./updates.js";
import { sanitizeSeed } from "../utils/sanitize.js";

export type AppController = AppActions & {
  state: AppState;
  currentSync: () => SyncView;
  leaveSession: () => void;
  syncRoute: (route: AppRouteState) => Promise<void>;
  updateUsername: (value: string) => void;
  updateSeed: (value: string) => void;
  updateJoinHost: (hostId: string, roomId?: string) => void;
  updateRecoveryImport: (value: string) => void;
};

export type CreateAppControllerOptions = {
  transportMode?: "loopback" | "memory" | "peerjs";
  profileName?: string;
  initialSearch?: string;
  initialRouteState?: AppRouteState;
  memoryTransportHub?: MemoryTransportHub | null;
  hostCountdownMs?: number | null;
  guestConnectTimeoutMs?: number | null;
  guestReconnectBackoffMs?: number[] | null;
  guestReconnectMaxAttempts?: number | null;
};

export function createAppController(
  options: CreateAppControllerOptions = {}
): AppController {
  const searchState = readSearchState(
    options.initialSearch ?? window.location.search
  );
  const initialRouteState = options.initialRouteState ?? {
    hostId: "",
    roomId: "",
    seed: null,
    appPath: "/",
    isGameRoute: false
  };
  const transportMode =
    options.transportMode ??
    (searchState.transportMode === "loopback" ? "loopback" : "peerjs");
  const profileName =
    options.profileName ?? searchState.profileName ?? "default";
  const initialHostId = initialRouteState.hostId;
  const initialRoomId = initialRouteState.roomId;
  const seedFromUrl = initialRouteState.seed;
  const countdownFromUrl = parseCountdownOverride(searchState.countdown);
  const guestConnectTimeoutMs =
    options.guestConnectTimeoutMs ??
    parseMillisecondOverride(searchState.guestConnectTimeoutMs);
  const guestReconnectMaxAttempts =
    options.guestReconnectMaxAttempts ??
    parsePositiveIntOverride(searchState.guestReconnectAttempts);
  const guestReconnectBackoffMs =
    options.guestReconnectBackoffMs ??
    parseMillisecondListOverride(searchState.guestReconnectBackoffMs);

  const rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.cloudflare.com:3478" },
      { urls: "stun:stun.l.google.com:19302" }
    ]
  };

  const storageKey = `cards-against-developers.identity.v1.${profileName}`;
  const hostStorageKey = `cards-against-developers.host.v1.${profileName}`;
  const state = createMutable(
    createInitialAppState(
      transportMode !== "memory"
        ? loadIdentity(storageKey)
        : {
            lastUsername: "",
            rooms: {}
          }
    )
  );
  state.joinHostId = initialHostId.trim();
  state.joinRoomId = initialRoomId.trim();
  if (seedFromUrl) {
    state.seedInput = sanitizeSeed(seedFromUrl);
  }
  const storedHost =
    transportMode !== "memory" ? loadHostSnapshot(hostStorageKey) : null;
  if (
    storedHost &&
    storedHost.peerId === state.joinHostId &&
    storedHost.roomId === state.joinRoomId
  ) {
    state.host = restoreHostRuntime(storedHost);
    const selfPlayer = state.host.state.players.find(
      (player) => player.id === state.host?.selfPlayerId
    );
    state.usernameInput = selfPlayer?.username ?? "";
  }

  function setFlash(message: string): void {
    state.flash = message;
    window.clearTimeout(flashTimeout);
    flashTimeout = window.setTimeout(() => {
      state.flash = "";
    }, 2200);
  }

  let flashTimeout = 0;

  const networkContextArgs: CreateNetworkContextArgs = {
    state,
    storageKey,
    saveIdentity,
    hostStorageKey,
    saveHostState: saveHostSnapshot,
    transportMode,
    memoryTransportHub: options.memoryTransportHub ?? null,
    hostCountdownMs: options.hostCountdownMs ?? countdownFromUrl,
    guestConnectTimeoutMs,
    guestReconnectBackoffMs,
    guestReconnectMaxAttempts,
    rtcConfig,
    setFlash
  };
  const networkContext = createNetworkContext(networkContextArgs);

  const actions = createActionHandler({
    state,
    storageKey,
    networkContext,
    saveIdentity,
    setFlash
  });

  if (state.host) {
    void (async () => {
      try {
        await resumePersistedHost(state.host!, networkContext);
        ensureRoundTimer(state.host!, networkContext);
      } catch (error) {
        setFlash(
          error instanceof Error ? error.message : "Could not restore host."
        );
      }
    })();
  } else if (
    state.joinHostId &&
    state.joinRoomId &&
    state.identity.rooms[state.joinRoomId]
  ) {
    void actions.prepareGuestAnswer();
  }

  return {
    state,
    currentSync: () => currentSync(state),
    leaveSession,
    syncRoute: (route) => syncControllerToRoute(route),
    updateUsername: (value) => updateUsername(state, value),
    updateSeed: (value) => updateSeed(state, value),
    updateJoinHost: (hostId, roomId) => updateJoinHost(state, hostId, roomId),
    updateRecoveryImport: (value) => updateRecoveryImport(state, value),
    ...actions
  };

  async function syncControllerToRoute(route: AppRouteState): Promise<void> {
    const nextSeed = route.seed
      ? sanitizeSeed(route.seed)
      : "cards-against-developers";

    state.joinHostId = route.hostId.trim();
    state.joinRoomId = route.roomId.trim();
    state.seedInput = nextSeed;

    if (state.host || state.guest.channel) {
      return;
    }

    const canRecoverRoom =
      Boolean(state.joinHostId) &&
      Boolean(state.joinRoomId) &&
      Boolean(state.identity.rooms[state.joinRoomId]);

    if (!canRecoverRoom) {
      state.guest.status = "";
      return;
    }

    await actions.prepareGuestAnswer();
  }

  function leaveSession(): void {
    if (state.host) {
      if (state.host.roundTimerIntervalId) {
        window.clearInterval(state.host.roundTimerIntervalId);
        state.host.roundTimerIntervalId = null;
      }
      disposeHostTransport(state.host);
      state.host = null;
      networkContext.persistHostState(null);
    }

    if (state.guest.channel || state.guest.transportHandle) {
      stopGuestSession(networkContext);
    } else {
      state.guest.status = "";
    }

    state.selectedCardIds = [];
  }
}

type SearchState = {
  transportMode: string | null;
  profileName: string | null;
  countdown: string | null;
  guestConnectTimeoutMs: string | null;
  guestReconnectAttempts: string | null;
  guestReconnectBackoffMs: string | null;
};

function readSearchState(search: string): SearchState {
  const params = new URLSearchParams(search);
  return {
    transportMode: params.get("transport"),
    profileName: params.get("profile"),
    countdown: params.get("countdown"),
    guestConnectTimeoutMs: params.get("guestConnectTimeoutMs"),
    guestReconnectAttempts: params.get("guestReconnectAttempts"),
    guestReconnectBackoffMs: params.get("guestReconnectBackoffMs")
  };
}

function parseCountdownOverride(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const seconds = Number.parseInt(value, 10);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return null;
  }

  return seconds * 1_000;
}

function parseMillisecondOverride(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const milliseconds = Number.parseInt(value, 10);
  return Number.isFinite(milliseconds) && milliseconds > 0
    ? milliseconds
    : null;
}

function parsePositiveIntOverride(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseMillisecondListOverride(value: string | null): number[] | null {
  if (!value) {
    return null;
  }

  const parsed = value
    .split(",")
    .map((entry) => Number.parseInt(entry.trim(), 10))
    .filter((entry) => Number.isFinite(entry) && entry > 0);

  return parsed.length > 0 ? parsed : null;
}
