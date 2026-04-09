import { MemoryEndpoint } from "./memory.js";
import type { DataConnection } from "peerjs";
import { encodeJson } from "../utils/codec.js";
import { debugLog, summarizeMessage } from "../utils/debug.js";

export class LoopbackEndpoint {
  readonly bus: BroadcastChannel;
  readonly role: "host" | "guest";
  readyState: "connecting" | "open" | "closing" | "closed" = "connecting";
  onopen: ((this: LoopbackEndpoint, event: Event) => void) | null = null;
  onclose: ((this: LoopbackEndpoint, event: Event) => void) | null = null;
  onmessage:
    | ((this: LoopbackEndpoint, event: MessageEvent<string>) => void)
    | null = null;

  constructor(channelId: string, role: "host" | "guest") {
    this.bus = new BroadcastChannel(channelId);
    this.role = role;
    this.bus.onmessage = (event) => {
      const payload = event.data as { type: string; data?: string };
      if (payload.type === "open" && this.role === "guest") {
        this.readyState = "open";
        this.onopen?.call(this, new Event("open"));
        return;
      }
      if (payload.type === "close") {
        this.readyState = "closed";
        this.onclose?.call(this, new Event("close"));
        this.bus.close();
        return;
      }
      if (payload.type === "message" && this.readyState === "open") {
        this.onmessage?.call(
          this,
          new MessageEvent("message", { data: payload.data ?? "" })
        );
      }
    };
  }

  openHostSide(): void {
    if (this.readyState === "open") {
      return;
    }
    this.readyState = "open";
    this.onopen?.call(this, new Event("open"));
    this.bus.postMessage({ type: "open" });
  }

  send(data: string): void {
    if (this.readyState !== "open") {
      return;
    }
    this.bus.postMessage({ type: "message", data });
  }

  close(): void {
    if (this.readyState === "closed") {
      return;
    }
    this.readyState = "closed";
    this.bus.postMessage({ type: "close" });
    this.bus.close();
    this.onclose?.call(this, new Event("close"));
  }
}

export class PeerJsEndpoint {
  readyState: "connecting" | "open" | "closing" | "closed";
  onopen: ((this: PeerJsEndpoint, event: Event) => void) | null = null;
  onclose: ((this: PeerJsEndpoint, event: Event) => void) | null = null;
  onmessage:
    | ((this: PeerJsEndpoint, event: MessageEvent<string>) => void)
    | null = null;

  private closed = false;

  constructor(private readonly connection: DataConnection) {
    this.readyState = connection.open ? "open" : "connecting";

    connection.on("open", () => {
      if (this.closed) {
        return;
      }
      this.readyState = "open";
      this.onopen?.call(this, new Event("open"));
    });

    connection.on("data", (data) => {
      if (this.closed || this.readyState !== "open") {
        return;
      }
      this.onmessage?.call(
        this,
        new MessageEvent("message", { data: String(data) })
      );
    });

    connection.on("close", () => {
      this.finalizeClose();
    });

    connection.on("error", () => {
      this.finalizeClose();
    });
  }

  send(data: string): void {
    if (this.readyState !== "open") {
      return;
    }
    void this.connection.send(data);
  }

  close(): void {
    if (this.closed) {
      return;
    }
    this.readyState = "closing";
    this.connection.close();
    this.finalizeClose();
  }

  private finalizeClose(): void {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.readyState = "closed";
    this.onclose?.call(this, new Event("close"));
  }
}

export type ChannelLike =
  | RTCDataChannel
  | LoopbackEndpoint
  | MemoryEndpoint
  | PeerJsEndpoint;

export type TransportHandle = {
  destroy: () => void;
};

export function openLocalChannel(channel: ChannelLike): void {
  if (
    channel instanceof LoopbackEndpoint ||
    channel instanceof MemoryEndpoint
  ) {
    channel.openHostSide();
  }
}

export function loopbackSignalChannelId(hostId: string): string {
  return `cards-against-developers.loopback.signal.${hostId}`;
}

export function loopbackDataChannelId(
  hostId: string,
  connectionId: string
): string {
  return `cards-against-developers.loopback.data.${hostId}.${connectionId}`;
}

export function waitForIceComplete(pc: RTCPeerConnection): Promise<void> {
  if (pc.iceGatheringState === "complete") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const listener = (): void => {
      if (pc.iceGatheringState === "complete") {
        pc.removeEventListener("icegatheringstatechange", listener);
        resolve();
      }
    };
    pc.addEventListener("icegatheringstatechange", listener);
  });
}

export function sendMessage(channel: ChannelLike, message: unknown): void {
  debugLog("network", "send", summarizeMessage(message));
  channel.send(encodeJson(message));
}
