import type { ChannelLike } from "./transport.js";

type MemoryPayload =
  | { type: "open" }
  | { type: "close" }
  | { type: "message"; data: string };

export class MemoryEndpoint {
  readonly role: "host" | "guest";
  readyState: "connecting" | "open" | "closing" | "closed" = "connecting";
  onopen: ((this: MemoryEndpoint, event: Event) => void) | null = null;
  onclose: ((this: MemoryEndpoint, event: Event) => void) | null = null;
  onmessage:
    | ((this: MemoryEndpoint, event: MessageEvent<string>) => void)
    | null = null;

  private peer: MemoryEndpoint | null = null;

  constructor(role: "host" | "guest") {
    this.role = role;
  }

  attachPeer(peer: MemoryEndpoint): void {
    this.peer = peer;
  }

  openHostSide(): void {
    if (this.readyState === "open") {
      return;
    }
    this.readyState = "open";
    this.onopen?.call(this, new Event("open"));
    this.peer?.receive({ type: "open" });
  }

  send(data: string): void {
    if (this.readyState !== "open") {
      return;
    }
    this.peer?.receive({ type: "message", data });
  }

  close(): void {
    if (this.readyState === "closed") {
      return;
    }
    this.readyState = "closed";
    const peer = this.peer;
    this.peer = null;
    this.onclose?.call(this, new Event("close"));
    peer?.detachPeer();
    peer?.receive({ type: "close" });
  }

  private detachPeer(): void {
    this.peer = null;
  }

  private receive(payload: MemoryPayload): void {
    if (payload.type === "open" && this.role === "guest") {
      this.readyState = "open";
      this.onopen?.call(this, new Event("open"));
      return;
    }
    if (payload.type === "close") {
      this.readyState = "closed";
      this.onclose?.call(this, new Event("close"));
      return;
    }
    if (payload.type === "message" && this.readyState === "open") {
      this.onmessage?.call(
        this,
        new MessageEvent("message", { data: payload.data })
      );
    }
  }
}

export class MemoryTransportHub {
  private readonly hostConnectors = new Map<
    string,
    (connectionId: string, channel: MemoryEndpoint) => void
  >();

  registerHost(
    hostId: string,
    onConnect: (connectionId: string, channel: MemoryEndpoint) => void
  ): () => void {
    this.hostConnectors.set(hostId, onConnect);
    return () => {
      if (this.hostConnectors.get(hostId) === onConnect) {
        this.hostConnectors.delete(hostId);
      }
    };
  }

  connectGuest(hostId: string, connectionId: string): ChannelLike {
    const onConnect = this.hostConnectors.get(hostId);
    if (!onConnect) {
      throw new Error("Missing in-memory host listener.");
    }

    const host = new MemoryEndpoint("host");
    const guest = new MemoryEndpoint("guest");
    host.attachPeer(guest);
    guest.attachPeer(host);
    onConnect(connectionId, host);
    return guest;
  }
}
