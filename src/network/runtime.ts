import { randomId } from "../utils/index.js";
import type { SyncView } from "../types.js";
import type { ChannelLike, TransportHandle } from "./transport.js";

export type GuestRuntime = {
  sessionId: string;
  transportHandle: TransportHandle | null;
  channel: ChannelLike | null;
  roomId: string | null;
  roomName: string | null;
  status: string;
  sync: SyncView | null;
  recoveryCode: string;
  hostClockOffsetMs?: number | null;
  reconnectAttemptCount?: number;
  reconnectTimerId?: ReturnType<typeof setTimeout> | null;
  reconnectBlocked?: boolean;
  joining?: boolean;
};

export function createGuestRuntime(): GuestRuntime {
  return {
    sessionId: randomId("guest-session"),
    transportHandle: null,
    channel: null,
    roomId: null,
    roomName: null,
    status: "",
    sync: null,
    recoveryCode: "",
    hostClockOffsetMs: null,
    reconnectAttemptCount: 0,
    reconnectTimerId: null,
    reconnectBlocked: false,
    joining: false
  };
}
