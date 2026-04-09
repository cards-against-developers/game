import {
  handleHostDisconnect,
  removeDisconnectedPlayer
} from "../game/submissions.js";
import { clearPendingDisconnect, type HostRuntime } from "../host/runtime.js";
import { randomId } from "../utils/index.js";
import type { NetworkContext } from "./context.js";
import { handleHostMessage } from "./handlers.js";
import { Peer } from "./peer.js";
import { parseMessage } from "./protocol.js";
import { syncAllPlayers } from "./sync.js";
import {
  loopbackDataChannelId,
  loopbackSignalChannelId,
  openLocalChannel,
  PeerJsEndpoint,
  type ChannelLike,
  type TransportHandle
} from "./transport.js";
import { LoopbackEndpoint } from "./transport.js";
import { debugLog, summarizeMessage } from "../utils/debug.js";

const DISCONNECT_GRACE_MS = 10_000;

export async function startHostTransport(
  host: HostRuntime,
  context: NetworkContext
): Promise<void> {
  debugLog("host", "starting transport", {
    transportMode: context.transportMode,
    peerId: host.peerId,
    roomId: host.roomId
  });
  disposeHostTransport(host);

  if (context.transportMode === "loopback") {
    host.transportHandle = createLoopbackHost(host, context);
    return;
  }

  if (context.transportMode === "memory") {
    if (!context.memoryTransportHub) {
      throw new Error("Missing in-memory transport hub.");
    }
    host.transportHandle = createMemoryHost(host, context);
    return;
  }

  host.transportHandle = await createPeerJsHost(host, context);
}

export async function resumePersistedHost(
  host: HostRuntime,
  context: NetworkContext
): Promise<void> {
  const now = Date.now();

  for (const player of host.state.players) {
    if (player.id === host.selfPlayerId) {
      player.connected = true;
      player.connectionId = null;
      player.disconnectDeadlineAt = null;
      continue;
    }

    if (player.connected || player.connectionId) {
      player.connected = false;
      player.connectionId = null;
      player.disconnectDeadlineAt = now + DISCONNECT_GRACE_MS;
    }
  }

  await startHostTransport(host, context);

  for (const player of host.state.players) {
    if (
      player.id !== host.selfPlayerId &&
      !player.connected &&
      player.disconnectDeadlineAt !== null
    ) {
      const remainingMs = player.disconnectDeadlineAt - now;
      if (remainingMs <= 0) {
        removeDisconnectedPlayer(host.state, player.id);
        continue;
      }

      scheduleDisconnectedPlayerRemoval(host, player.id, remainingMs, context);
    }
  }

  syncAllPlayers(host, context);
}

export function disposeHostTransport(host: HostRuntime): void {
  host.transportHandle?.destroy();
  host.transportHandle = null;

  for (const channel of host.connections.values()) {
    channel.close();
  }
  host.connections.clear();
}

function createLoopbackHost(
  host: HostRuntime,
  context: NetworkContext
): TransportHandle {
  const signalBus = new BroadcastChannel(loopbackSignalChannelId(host.peerId));
  const activeChannels = new Set<LoopbackEndpoint>();

  signalBus.onmessage = (event) => {
    const payload = event.data as
      | { type?: string; connectionId?: string }
      | undefined;

    if (payload?.type !== "join" || !payload.connectionId) {
      return;
    }

    const channel = new LoopbackEndpoint(
      loopbackDataChannelId(host.peerId, payload.connectionId),
      "host"
    );
    activeChannels.add(channel);
    registerHostConnection(host, payload.connectionId, channel, context);
    openLocalChannel(channel);
  };

  return {
    destroy: () => {
      signalBus.close();
      for (const channel of activeChannels) {
        channel.close();
      }
      activeChannels.clear();
    }
  };
}

function createMemoryHost(
  host: HostRuntime,
  context: NetworkContext
): TransportHandle {
  const unregister = context.memoryTransportHub!.registerHost(
    host.peerId,
    (connectionId, channel) => {
      registerHostConnection(host, connectionId, channel, context);
      queueMicrotask(() => {
        openLocalChannel(channel);
      });
    }
  );

  return {
    destroy: unregister
  };
}

async function createPeerJsHost(
  host: HostRuntime,
  context: NetworkContext
): Promise<TransportHandle> {
  const peer = new Peer(host.peerId, {
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

  peer.on("connection", (connection) => {
    const channel = new PeerJsEndpoint(connection);
    const connectionId =
      typeof connection.connectionId === "string" && connection.connectionId
        ? connection.connectionId
        : randomId("connection");
    registerHostConnection(host, connectionId, channel, context);
  });

  peer.on("error", (error: Error) => {
    context.setFlash(error.message);
  });

  return {
    destroy: () => {
      peer.destroy();
    }
  };
}

function registerHostConnection(
  host: HostRuntime,
  connectionId: string,
  channel: ChannelLike,
  context: NetworkContext
): void {
  host.connections.set(connectionId, channel);
  debugLog("host", "connection registered", {
    connectionId,
    connectionCount: host.connections.size
  });
  bindHostConnection(host, connectionId, channel, context);
}

function bindHostConnection(
  host: HostRuntime,
  connectionId: string,
  channel: ChannelLike,
  context: NetworkContext
): void {
  channel.onopen = () => {
    debugLog("host", "connection opened", { connectionId });
    syncAllPlayers(host, context);
  };

  channel.onclose = () => {
    handleConnectionDisconnect(host, connectionId, context);
  };

  channel.onmessage = (event: MessageEvent<string>) => {
    const message = parseMessage(String(event.data));
    debugLog("host", "received message", {
      connectionId,
      ...summarizeMessage(message)
    });
    handleHostMessage(host, connectionId, channel, message, context);
  };
}

function handleConnectionDisconnect(
  host: HostRuntime,
  connectionId: string,
  context: NetworkContext
): void {
  const channel = host.connections.get(connectionId);
  if (channel) {
    host.connections.delete(connectionId);
  }

  debugLog("host", "connection closed", {
    connectionId,
    connectionCount: host.connections.size
  });

  const player = handleHostDisconnect(host.state, connectionId);
  if (player) {
    player.disconnectDeadlineAt = Date.now() + DISCONNECT_GRACE_MS;
    host.state.announcement = `${player.username} disconnected. ${DISCONNECT_GRACE_MS / 1000}s to rejoin before sitting out this round.`;
    scheduleDisconnectedPlayerRemoval(
      host,
      player.id,
      DISCONNECT_GRACE_MS,
      context
    );
  }

  syncAllPlayers(host, context);
}

function scheduleDisconnectedPlayerRemoval(
  host: HostRuntime,
  playerId: string,
  graceMs: number,
  context: NetworkContext
): void {
  clearPendingDisconnect(host, playerId);

  const timeoutId = setTimeout(() => {
    clearPendingDisconnect(host, playerId);
    removeDisconnectedPlayer(host.state, playerId);
    syncAllPlayers(host, context);
  }, graceMs);

  host.pendingDisconnects.set(playerId, { timeoutId });
}
