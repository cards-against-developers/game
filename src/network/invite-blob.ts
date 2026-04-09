import { decodeJson } from "../utils/index.js";
import type {
  InviteBlob,
  LoopbackInviteBlob,
  MemoryInviteBlob
} from "./types.js";

const PENDING_INVITE_TEXT = "Preparing offer…";

export function isInviteBlobReady(inviteBlob: string): boolean {
  const trimmed = inviteBlob.trim();
  if (!trimmed || trimmed === PENDING_INVITE_TEXT) {
    return false;
  }

  try {
    const payload = decodeJson<
      InviteBlob | LoopbackInviteBlob | MemoryInviteBlob
    >(trimmed);

    if ("transport" in payload) {
      return (
        (payload.transport === "loopback" || payload.transport === "memory") &&
        typeof payload.roomId === "string" &&
        typeof payload.roomName === "string" &&
        typeof payload.deckVersion === "string" &&
        typeof payload.inviteId === "string"
      );
    }

    return (
      typeof payload.roomId === "string" &&
      typeof payload.roomName === "string" &&
      typeof payload.deckVersion === "string" &&
      typeof payload.offer === "object" &&
      payload.offer !== null &&
      typeof payload.offer.type === "string"
    );
  } catch {
    return false;
  }
}

export async function waitForReadyInviteBlob(
  readInviteBlob: () => string,
  timeoutMs = 10_000
): Promise<string> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const inviteBlob = readInviteBlob();
    if (isInviteBlobReady(inviteBlob)) {
      return inviteBlob.trim();
    }
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }

  throw new Error("Timed out while preparing the invite.");
}
