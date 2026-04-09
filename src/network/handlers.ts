import { deckVersion } from "../cards/index.js";
import {
  setRaisedCardsForPlayer,
  findHostPlayerByConnection,
  findHostPlayerById,
  pickSubmissionForPlayer,
  reconnectOrCreatePlayer,
  submitCardsForPlayer
} from "../game/submissions.js";
import { buildRecoveryBundle } from "../host/recovery.js";
import { clearPendingDisconnect, type HostRuntime } from "../host/runtime.js";
import { REPLACED_SESSION_MESSAGE } from "./messages.js";
import { sendMessage, type ChannelLike } from "./transport.js";
import type { RecoveryBundle } from "../types.js";
import { decodeJson, randomId } from "../utils/index.js";
import { sanitizeUsername } from "../utils/sanitize.js";
import type { NetworkContext } from "./context.js";
import { syncAllPlayers } from "./sync.js";
import type { Message } from "./types.js";
import { debugLog, summarizeMessage } from "../utils/debug.js";

const MAX_PLAYERS = 12;

export function handleHostMessage(
  host: HostRuntime,
  connectionId: string,
  channel: ChannelLike,
  message: Message,
  context: NetworkContext
): void {
  debugLog("host", "handling message", {
    connectionId,
    ...summarizeMessage(message)
  });
  switch (message.type) {
    case "hello":
      handleHello(host, connectionId, channel, message, context);
      return;
    case "submit_cards": {
      const player = findHostPlayerByConnection(host.state, connectionId);
      if (!player) {
        return;
      }
      submitCardsForPlayer(
        host.state,
        player.id,
        message.cardIds,
        randomId("submission")
      );
      syncAllPlayers(host, context);
      return;
    }
    case "raise_cards": {
      const player = findHostPlayerByConnection(host.state, connectionId);
      if (!player) {
        return;
      }
      setRaisedCardsForPlayer(host.state, player.id, message.cardIds);
      syncAllPlayers(host, context);
      return;
    }
    case "vote_submission":
    case "pick_submission":
    case "reveal_submission": {
      const player = findHostPlayerByConnection(host.state, connectionId);
      if (!player) {
        return;
      }
      pickSubmissionForPlayer(host.state, player.id, message.submissionId);
      syncAllPlayers(host, context);
      return;
    }
    default:
      return;
  }
}

export function handleGuestMessage(
  message: Message,
  context: NetworkContext,
  channel?: ChannelLike | null
): void {
  debugLog("guest", "handling message", summarizeMessage(message));
  if (channel && context.state.guest.channel !== channel) {
    return;
  }
  if (context.state.guest.reconnectBlocked && message.type !== "error") {
    return;
  }

  switch (message.type) {
    case "welcome": {
      if (context.state.guest.reconnectBlocked) {
        return;
      }
      context.state.guest.status = "Connected to host.";
      context.state.guest.recoveryCode = message.recoveryCode;
      context.state.guest.reconnectAttemptCount = 0;
      context.state.guest.reconnectBlocked = false;
      const bundle = decodeJson<RecoveryBundle>(message.recoveryCode);
      context.state.identity.rooms[message.roomId] = bundle;
      context.state.identity.lastUsername = sanitizeUsername(
        context.state.usernameInput
      );
      context.persistIdentity();
      break;
    }
    case "sync": {
      if (typeof message.payload.hostNow === "number") {
        context.state.guest.hostClockOffsetMs =
          message.payload.hostNow - Date.now();
      }
      const roundContextChanged =
        message.payload.round !== context.state.guest.sync?.round ||
        message.payload.blackCardId !== context.state.guest.sync?.blackCardId;

      if (roundContextChanged) {
        context.state.localHandOverride = [];
        context.state.pendingSubmittedCards = [];
        context.state.submissionAnimationCards = [];
      } else {
        context.state.pendingSubmittedCards = (
          context.state.pendingSubmittedCards ?? []
        ).filter((card) => !message.payload.hand.includes(card.id));
        context.state.localHandOverride = message.payload.handCards
          ?.filter(
            (card) =>
              !(context.state.pendingSubmittedCards ?? []).some(
                (pending) => pending.id === card.id
              )
          )
          .map((card) => ({
            id: card.id,
            text: card.text
          }));
      }
      if (message.payload.phase !== "submitting" || roundContextChanged) {
        context.state.selectedCardIds = [];
      }
      context.state.guest.sync = message.payload;
      context.trimSelectionsToHand(message.payload.hand);
      break;
    }
    case "error":
      if (
        message.canReconnect === false ||
        message.message === REPLACED_SESSION_MESSAGE
      ) {
        terminateGuestSession(context, message.message);
        break;
      }
      context.state.guest.status = message.message;
      break;
    default:
      break;
  }
}

function terminateGuestSession(context: NetworkContext, status: string): void {
  if (context.state.guest.reconnectTimerId) {
    globalThis.clearTimeout(context.state.guest.reconnectTimerId);
    context.state.guest.reconnectTimerId = null;
  }

  context.state.guest.reconnectBlocked = true;
  context.state.guest.joining = false;

  const channel = context.state.guest.channel;
  const transportHandle = context.state.guest.transportHandle;
  context.state.guest.channel = null;
  context.state.guest.transportHandle = null;
  context.state.guest.roomId = null;
  context.state.guest.roomName = null;
  context.state.guest.recoveryCode = "";
  context.state.guest.sync = null;
  context.state.guest.hostClockOffsetMs = null;
  context.state.guest.status = status;
  context.state.selectedCardIds = [];

  if (channel) {
    channel.onopen = null;
    channel.onmessage = null;
    channel.onclose = null;
    channel.close();
  }
  transportHandle?.destroy();
}

function handleHello(
  host: HostRuntime,
  connectionId: string,
  channel: ChannelLike,
  message: Extract<Message, { type: "hello" }>,
  context: NetworkContext
): void {
  if (message.roomId !== host.roomId || message.deckVersion !== deckVersion) {
    sendMessage(channel, {
      type: "error",
      message: "Room or deck mismatch."
    });
    channel.close();
    return;
  }

  const stolenSlot = findHostPlayerById(host.state, message.playerId);
  const canReconnect =
    stolenSlot && stolenSlot.reconnectToken === message.reconnectToken;
  const previousConnectionId = stolenSlot?.connectionId ?? null;
  const sessionChanged =
    stolenSlot !== null && stolenSlot.sessionId !== message.sessionId;

  if (stolenSlot && !canReconnect) {
    sendMessage(channel, {
      type: "error",
      message: "Reconnect token mismatch."
    });
    channel.close();
    return;
  }

  if (stolenSlot && sessionChanged && !message.takeover) {
    sendMessage(channel, {
      type: "error",
      message: REPLACED_SESSION_MESSAGE,
      canReconnect: false
    });
    channel.close();
    return;
  }

  if (!stolenSlot && host.state.players.length >= MAX_PLAYERS) {
    sendMessage(channel, {
      type: "error",
      message: "Table is full. Maximum 12 players."
    });
    channel.close();
    return;
  }

  const player = reconnectOrCreatePlayer(
    host.state,
    connectionId,
    message.username,
    message.playerId,
    message.reconnectToken,
    message.sessionId
  );
  clearPendingDisconnect(host, player.id);

  if (previousConnectionId && previousConnectionId !== connectionId) {
    const previousChannel = host.connections.get(previousConnectionId);
    if (previousChannel) {
      sendMessage(previousChannel, {
        type: "error",
        message: REPLACED_SESSION_MESSAGE,
        canReconnect: false
      });
      queueMicrotask(() => {
        previousChannel.close();
        host.connections.delete(previousConnectionId);
      });
    }
  }

  sendMessage(channel, {
    type: "welcome",
    roomId: host.roomId,
    playerId: player.id,
    reconnectToken: player.reconnectToken,
    recoveryCode: buildRecoveryBundle(host, player.id)
  });
  syncAllPlayers(host, context);
}
