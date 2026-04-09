import { deckVersion } from "../cards/index.js";
import {
  CONNECTING_TO_HOST_MESSAGE,
  CONNECTION_LOST_MESSAGE,
  GUEST_CONNECT_TIMEOUT_MESSAGE,
  REJOINING_TABLE_MESSAGE,
  REPLACED_SESSION_MESSAGE
} from "./messages.js";
import { randomId } from "../utils/index.js";
import { debugLog, summarizeMessage } from "../utils/debug.js";
import type { NetworkContext } from "./context.js";
import { handleGuestMessage } from "./handlers.js";
import { Peer } from "./peer.js";
import { parseMessage } from "./protocol.js";
import {
  loopbackDataChannelId,
  loopbackSignalChannelId,
  LoopbackEndpoint,
  PeerJsEndpoint,
  sendMessage,
  type ChannelLike,
  type TransportHandle
} from "./transport.js";

export const GUEST_CONNECT_TIMEOUT_MS = 10_000;
const MAX_RECONNECT_ATTEMPTS = 6;
const RECONNECT_BACKOFF_MS = [500, 1_000, 2_000, 3_000, 5_000, 8_000];

export async function joinHost(
  hostPeerId: string,
  context: NetworkContext,
  options?: { takeover?: boolean }
): Promise<void> {
  if (context.state.guest.joining || context.state.guest.reconnectBlocked) {
    return;
  }

  const trimmedHostId = hostPeerId.trim();
  if (!trimmedHostId) {
    throw new Error("Missing host id in the URL.");
  }

  debugLog("guest", "join host requested", {
    hostId: trimmedHostId,
    transportMode: context.transportMode
  });

  context.state.guest.joining = true;
  cancelGuestReconnect(context);
  resetGuestTransport(context);
  resetGuestSession(context, { preserveReconnectState: true });
  context.state.selectedCardIds = [];
  context.state.guest.status = CONNECTING_TO_HOST_MESSAGE;
  context.state.guest.roomId = context.state.joinRoomId || null;

  let channel: ChannelLike;
  let transportHandle: TransportHandle | null = null;

  if (context.transportMode === "loopback") {
    channel = connectLoopbackGuest(trimmedHostId);
  } else if (context.transportMode === "memory") {
    if (!context.memoryTransportHub) {
      throw new Error("Missing in-memory transport hub.");
    }
    channel = context.memoryTransportHub.connectGuest(
      trimmedHostId,
      randomId("connection")
    );
  } else {
    try {
      const connected = await connectPeerJsGuest(trimmedHostId, context);
      channel = connected.channel;
      transportHandle = connected.transportHandle;
    } catch (error) {
      context.state.guest.joining = false;
      throw error;
    }
  }

  context.state.guest.transportHandle = transportHandle;
  context.state.guest.channel = channel;
  if (context.state.guest.reconnectBlocked) {
    resetGuestTransport(context);
    context.state.guest.joining = false;
    return;
  }
  bindGuestChannel(channel, context, options);
}

export function resetGuestTransport(context: NetworkContext): void {
  context.state.guest.channel?.close();
  context.state.guest.transportHandle?.destroy();
  context.state.guest.transportHandle = null;
  context.state.guest.channel = null;
}

export function stopGuestSession(context: NetworkContext): void {
  cancelGuestReconnect(context);
  context.state.guest.reconnectBlocked = true;
  context.state.guest.joining = false;
  resetGuestTransport(context);
  resetGuestSession(context);
  context.state.guest.status = "";
  context.state.selectedCardIds = [];
}

function resetGuestSession(
  context: NetworkContext,
  options?: { preserveReconnectState?: boolean }
): void {
  context.state.guest.roomId = null;
  context.state.guest.roomName = null;
  context.state.guest.recoveryCode = "";
  context.state.guest.sync = null;
  context.state.guest.hostClockOffsetMs = null;
  if (!options?.preserveReconnectState) {
    context.state.guest.reconnectAttemptCount = 0;
    context.state.guest.reconnectBlocked = false;
  }
}

function cancelGuestReconnect(context: NetworkContext): void {
  if (context.state.guest.reconnectTimerId) {
    globalThis.clearTimeout(context.state.guest.reconnectTimerId);
    context.state.guest.reconnectTimerId = null;
  }
}

function connectLoopbackGuest(hostPeerId: string): ChannelLike {
  const connectionId = randomId("connection");
  const channel = new LoopbackEndpoint(
    loopbackDataChannelId(hostPeerId, connectionId),
    "guest"
  );
  const signalBus = new BroadcastChannel(loopbackSignalChannelId(hostPeerId));
  signalBus.postMessage({ type: "join", connectionId });
  signalBus.close();
  return channel;
}

async function connectPeerJsGuest(
  hostPeerId: string,
  context: NetworkContext
): Promise<{ channel: ChannelLike; transportHandle: TransportHandle }> {
  const peer = new Peer({
    config: context.rtcConfig
  });

  await new Promise<void>((resolve, reject) => {
    let settled = false;

    const onOpen = (): void => {
      if (settled) {
        return;
      }
      settled = true;
      resolve();
    };

    const onError = (error: Error): void => {
      if (settled) {
        return;
      }
      settled = true;
      reject(error);
    };

    peer.on("open", onOpen);
    peer.on("error", onError);
  });

  const connection = peer.connect(hostPeerId, {
    reliable: true
  });

  const channel = new PeerJsEndpoint(connection);

  peer.on("error", (error: Error) => {
    handleGuestDisconnect(
      context,
      error.message || GUEST_CONNECT_TIMEOUT_MESSAGE
    );
  });

  return {
    channel,
    transportHandle: {
      destroy: () => {
        peer.destroy();
      }
    }
  };
}

function bindGuestChannel(
  channel: ChannelLike,
  context: NetworkContext,
  options?: { takeover?: boolean }
): void {
  const connectTimeoutMs =
    context.guestConnectTimeoutMs ?? GUEST_CONNECT_TIMEOUT_MS;
  const timeoutId = globalThis.setTimeout(() => {
    if (
      context.state.guest.channel !== channel ||
      channel.readyState === "open"
    ) {
      return;
    }

    debugLog("guest", "connection timeout", {
      timeoutMs: connectTimeoutMs
    });
    handleGuestDisconnect(context, GUEST_CONNECT_TIMEOUT_MESSAGE);
    channel.close();
  }, connectTimeoutMs);

  const clearConnectTimeout = (): void => {
    globalThis.clearTimeout(timeoutId);
  };

  channel.onmessage = (event: MessageEvent<string>) => {
    clearConnectTimeout();
    const message = parseMessage(String(event.data));
    debugLog("guest", "received message", summarizeMessage(message));
    handleGuestMessage(message, context, channel);
  };

  channel.onclose = () => {
    clearConnectTimeout();
    if (context.state.guest.channel !== channel) {
      return;
    }
    handleGuestDisconnect(
      context,
      context.state.guest.reconnectBlocked &&
        context.state.guest.status === REPLACED_SESSION_MESSAGE
        ? context.state.guest.status
        : CONNECTION_LOST_MESSAGE
    );
  };

  channel.onopen = () => {
    clearConnectTimeout();
    if (
      context.state.guest.reconnectBlocked ||
      context.state.guest.channel !== channel
    ) {
      channel.close();
      return;
    }
    cancelGuestReconnect(context);
    context.state.guest.joining = false;
    context.state.guest.status = REJOINING_TABLE_MESSAGE;
    const roomId =
      context.state.joinRoomId ||
      context.state.guest.roomId ||
      context.state.guest.sync?.roomId ||
      "";
    const bundle = context.getRecoveryBundle(roomId);
    const playerId = bundle?.playerId ?? randomId("player");
    const reconnectToken = bundle?.reconnectToken ?? randomId("token");
    const username = bundle
      ? context.state.usernameInput.trim()
      : context.currentUsername();

    const helloMessage = {
      type: "hello",
      roomId: bundle?.roomId ?? roomId,
      deckVersion,
      username,
      playerId,
      reconnectToken,
      sessionId: context.state.guest.sessionId,
      takeover: options?.takeover === true
    };
    debugLog("guest", "channel opened", {
      playerId,
      roomId: helloMessage.roomId
    });
    sendMessage(channel, helloMessage);
  };

  if (channel.readyState === "open") {
    queueMicrotask(() => {
      if (
        context.state.guest.channel === channel &&
        channel.readyState === "open"
      ) {
        const handleOpen = channel.onopen as
          | ((this: ChannelLike, event: Event) => void)
          | null;
        handleOpen?.call(channel, new Event("open"));
      }
    });
  }
}

function handleGuestDisconnect(context: NetworkContext, status: string): void {
  debugLog("guest", "disconnected", { status });
  context.state.guest.transportHandle?.destroy();
  context.state.guest.transportHandle = null;
  context.state.guest.channel = null;
  context.state.guest.joining = false;
  resetGuestSession(context, { preserveReconnectState: true });
  context.state.guest.status = status;
  context.state.selectedCardIds = [];
  scheduleGuestReconnect(context, status);
}

function scheduleGuestReconnect(context: NetworkContext, status: string): void {
  if (context.state.guest.reconnectBlocked) {
    return;
  }

  const roomId = context.state.joinRoomId || context.state.guest.roomId;
  const hasRecovery = Boolean(context.getRecoveryBundle(roomId));
  if (!hasRecovery) {
    return;
  }

  const attempts = context.state.guest.reconnectAttemptCount ?? 0;
  const maxReconnectAttempts =
    context.guestReconnectMaxAttempts ?? MAX_RECONNECT_ATTEMPTS;
  if (attempts >= maxReconnectAttempts) {
    context.state.guest.status = `${status} Couldn't reconnect. Join again to get back in.`;
    return;
  }

  cancelGuestReconnect(context);
  const backoffMs = context.guestReconnectBackoffMs ?? RECONNECT_BACKOFF_MS;
  const delayMs =
    backoffMs[attempts] ?? backoffMs.at(-1) ?? RECONNECT_BACKOFF_MS.at(-1)!;
  context.state.guest.reconnectAttemptCount = attempts + 1;
  context.state.guest.status = `${status} Reconnecting in ${Math.ceil(delayMs / 1000)}s…`;
  context.state.guest.reconnectTimerId = globalThis.setTimeout(() => {
    context.state.guest.reconnectTimerId = null;
    void joinHost(context.state.joinHostId, context).catch((error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Could not reconnect to the host.";
      handleGuestDisconnect(context, message);
    });
  }, delayMs);
}
