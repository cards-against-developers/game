import { getBlackCard } from "../cards/index.js";
import {
  forceReveal,
  skipCurrentRound,
  startGame,
  startNextRound
} from "../game/rounds.js";
import {
  pickSubmissionForPlayer,
  setRaisedCardsForPlayer,
  submitCardsForPlayer
} from "../game/submissions.js";
import { createHostRuntime } from "../host/factory.js";
import { ensureRoundTimer } from "../host/runtime.js";
import { joinHost } from "../network/guest.js";
import { disposeHostTransport } from "../network/host.js";
import { startHostTransport } from "../network/host.js";
import type { NetworkContext } from "../network/context.js";
import { syncAllPlayers } from "../network/sync.js";
import {
  currentUsername,
  importRecoveryBundle,
  rememberCurrentUsername
} from "../session/index.js";
import { sendMessage } from "../network/transport.js";
import {
  getUsernameValidationMessage,
  randomId,
  randomSeed
} from "../utils/index.js";
import { sanitizeSeed } from "../utils/sanitize.js";
import { debugLog } from "../utils/debug.js";
import { currentSync } from "./selectors.js";
import type { AppState } from "./state.js";

type ActionDeps = {
  state: AppState;
  storageKey: string;
  networkContext: NetworkContext;
  saveIdentity: (storageKey: string, identity: AppState["identity"]) => void;
  setFlash: (message: string) => void;
};

export type AppActions = {
  createHost: () => Promise<void>;
  createInvite: () => Promise<void>;
  acceptAnswer: (inviteId: string) => Promise<void>;
  prepareGuestAnswer: () => Promise<void>;
  copyToClipboard: (value: string) => Promise<void>;
  startHostedGame: () => Promise<void>;
  startNextRound: () => Promise<void>;
  forceReveal: () => Promise<void>;
  skipRound: () => Promise<void>;
  toggleCard: (cardId: string) => Promise<void>;
  submitSelection: () => Promise<void>;
  pickSubmission: (submissionId: string) => Promise<void>;
  importRecovery: () => Promise<void>;
};

export function createActionHandler(deps: ActionDeps): AppActions {
  const { state, storageKey, networkContext, saveIdentity, setFlash } = deps;

  return {
    createHost: () => withErrorHandling(async () => createHost()),
    createInvite: () =>
      withErrorHandling(async () => {
        if (state.host) {
          await refreshHostShareUrl();
        }
      }),
    acceptAnswer: () =>
      withErrorHandling(async () => {
        return;
      }),
    prepareGuestAnswer: () =>
      withErrorHandling(async () => {
        const roomId = state.joinRoomId || null;
        if (!networkContext.getRecoveryBundle(roomId)) {
          assertValidUsername();
        }
        await joinHost(state.joinHostId, networkContext, { takeover: true });
      }),
    copyToClipboard: (value) =>
      withErrorHandling(async () => {
        await navigator.clipboard.writeText(value);
        setFlash("Copied to clipboard.");
      }),
    startHostedGame: () => withErrorHandling(async () => startHostedGame()),
    startNextRound: () =>
      withErrorHandling(async () => {
        if (state.host) {
          state.selectedCardIds = [];
          state.localHandOverride = [];
          state.pendingSubmittedCards = [];
          startNextRound(state.host.state);
          syncAllPlayers(state.host, networkContext);
        }
      }),
    forceReveal: () =>
      withErrorHandling(async () => {
        if (state.host) {
          state.selectedCardIds = [];
          state.localHandOverride = [];
          state.pendingSubmittedCards = [];
          forceReveal(state.host.state);
          syncAllPlayers(state.host, networkContext);
        }
      }),
    skipRound: () =>
      withErrorHandling(async () => {
        if (state.host) {
          state.selectedCardIds = [];
          state.localHandOverride = [];
          state.pendingSubmittedCards = [];
          skipCurrentRound(state.host.state);
          syncAllPlayers(state.host, networkContext);
        }
      }),
    toggleCard: (cardId) => withErrorHandling(async () => toggleCard(cardId)),
    submitSelection: () =>
      withErrorHandling(async () => submitCurrentSelection()),
    pickSubmission: (submissionId) =>
      withErrorHandling(async () => pickSubmission(submissionId)),
    importRecovery: () =>
      withErrorHandling(async () => {
        setFlash(importRecoveryBundle(state, storageKey, saveIdentity));
      })
  };

  async function withErrorHandling(run: () => Promise<void>): Promise<void> {
    try {
      await run();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error.";
      state.guest.status = message;
      setFlash(message);
    }
  }

  async function createHost(): Promise<void> {
    assertValidUsername();
    const username = currentUsername(state);
    rememberCurrentUsername(storageKey, state, saveIdentity);
    const requestedSeed = sanitizeSeed(state.seedInput);
    const seed =
      requestedSeed === "cards-against-developers"
        ? randomSeed()
        : requestedSeed;
    debugLog("app", "create host", { username, seed });

    state.host = createHostRuntime(
      username,
      seed,
      networkContext.hostCountdownMs ?? undefined
    );
    state.seedInput = seed;
    state.selectedCardIds = [];
    const host = state.host;
    if (!host) {
      throw new Error("Could not initialize the host runtime.");
    }
    try {
      ensureRoundTimer(host, networkContext);
      await startHostTransport(host, networkContext);
      syncAllPlayers(host, networkContext);
      setFlash("Local host created.");
    } catch (error) {
      if (host.roundTimerIntervalId) {
        clearInterval(host.roundTimerIntervalId);
        host.roundTimerIntervalId = null;
      }
      disposeHostTransport(host);
      if (state.host === host) {
        state.host = null;
      }
      networkContext.persistHostState(null);
      throw error;
    }
  }

  function assertValidUsername(): void {
    const validationMessage = getUsernameValidationMessage(state.usernameInput);
    if (validationMessage) {
      throw new Error(validationMessage);
    }
  }

  async function refreshHostShareUrl(): Promise<void> {
    if (!state.host) {
      return;
    }

    updateShareUrl(state.host.peerId, state.host.roomId, state.host.seed);
  }

  function updateShareUrl(hostId: string, roomId: string, seed: string): void {
    if (networkContext.transportMode === "memory") {
      return;
    }

    if (!hostId.trim()) {
      return;
    }

    const url = new URL(window.location.href);
    if (
      url.pathname.endsWith("/dev/singleplayer") ||
      url.pathname.endsWith("/dev/singleplayer/index.html")
    ) {
      url.pathname = url.pathname.replace(
        /\/dev\/singleplayer(?:\/index\.html)?$/,
        "/"
      );
    }

    const normalizedPath = url.pathname
      .replace(/\/index\.html$/, "")
      .replace(/\/+$/, "");
    if (normalizedPath.endsWith("/play")) {
      url.pathname = normalizedPath;
    } else {
      url.pathname = `${normalizedPath || ""}/play`;
    }
    url.searchParams.set("host", hostId);
    url.searchParams.set("room", roomId);
    url.searchParams.set("seed", seed);
    const nextUrl = url.toString();
    if (nextUrl === window.location.href) {
      return;
    }

    window.history.replaceState({}, "", nextUrl);
  }

  function startHostedGame(): void {
    if (!state.host) {
      return;
    }

    if (state.host.state.players.length < 3) {
      debugLog("app", "start game blocked", {
        players: state.host.state.players.length
      });
      setFlash("You need at least three players to start.");
      return;
    }

    debugLog("app", "start game requested", {
      players: state.host.state.players.length
    });
    state.selectedCardIds = [];
    startGame(state.host.state);
    ensureRoundTimer(state.host, networkContext);
    syncAllPlayers(state.host, networkContext);
  }

  function pickSubmission(submissionId: string): void {
    const sync = currentSync(state);
    const submission = sync.submissions.find(
      (entry) => entry.id === submissionId
    );
    const shouldVote = Boolean(
      submission && !submission.hidden && submission.canVote && sync.canVote
    );

    if (!shouldVote) {
      return;
    }

    if (state.host) {
      debugLog("app", "vote submission", {
        submissionId,
        source: "host"
      });
      state.selectedCardIds = [];
      pickSubmissionForPlayer(
        state.host.state,
        state.host.selfPlayerId,
        submissionId
      );
      syncAllPlayers(state.host, networkContext);
      return;
    }

    if (state.guest.channel && sync.canVote) {
      debugLog("app", "vote submission", {
        submissionId,
        source: "guest"
      });
      sendMessage(state.guest.channel, {
        type: "vote_submission",
        submissionId
      });
    }
  }

  function submitCurrentSelection(): void {
    const sync = currentSync(state);
    const blackCard = getBlackCard(sync.blackCardId);
    if (!blackCard || state.selectedCardIds.length !== blackCard.pick) {
      return;
    }

    submitCardIds(sync, [...state.selectedCardIds]);
    state.selectedCardIds = [];
  }

  function submitCardIds(
    sync: ReturnType<typeof currentSync>,
    cardIds: string[]
  ): void {
    debugLog("app", "submit selection", {
      cardCount: cardIds.length,
      source: state.host ? "host" : "guest"
    });
    const submittedCards = (sync.handCards ?? [])
      .map((card, handIndex) => ({
        ...card,
        handIndex
      }))
      .filter((card) => cardIds.includes(card.id));
    state.submissionAnimationCards = submittedCards;
    const pendingById = new Map(
      (state.pendingSubmittedCards ?? []).map((card) => [card.id, card])
    );
    for (const card of submittedCards) {
      pendingById.set(card.id, card);
    }
    state.pendingSubmittedCards = [...pendingById.values()];
    state.localHandOverride = (sync.handCards ?? []).filter(
      (card) => !cardIds.includes(card.id)
    );

    if (state.host) {
      submitCardsForPlayer(
        state.host.state,
        state.host.selfPlayerId,
        cardIds,
        randomId("submission")
      );
      syncAllPlayers(state.host, networkContext);
    } else if (state.guest.channel && sync.canSubmit) {
      sendMessage(state.guest.channel, {
        type: "submit_cards",
        cardIds
      });
    }
  }

  function toggleCard(cardId: string): void {
    const sync = currentSync(state);
    const blackCard = getBlackCard(sync.blackCardId);
    if (!sync.canSubmit || !blackCard) {
      return;
    }

    if (blackCard.pick === 1) {
      submitCardIds(sync, [cardId]);
      state.selectedCardIds = [];
      return;
    }

    let nextSelectedCardIds: string[];
    if (state.selectedCardIds.includes(cardId)) {
      return;
    } else if (state.selectedCardIds.length < blackCard.pick) {
      nextSelectedCardIds = [...state.selectedCardIds, cardId];
    } else {
      nextSelectedCardIds = [...state.selectedCardIds.slice(1), cardId];
    }

    state.selectedCardIds = nextSelectedCardIds;
    debugLog("app", "selection changed", {
      selected: nextSelectedCardIds.length,
      required: blackCard.pick,
      source: state.host ? "host" : "guest"
    });

    if (state.host) {
      setRaisedCardsForPlayer(
        state.host.state,
        state.host.selfPlayerId,
        nextSelectedCardIds
      );
      syncAllPlayers(state.host, networkContext);
      return;
    }

    if (state.guest.channel) {
      sendMessage(state.guest.channel, {
        type: "raise_cards",
        cardIds: nextSelectedCardIds
      });
    }
  }
}
