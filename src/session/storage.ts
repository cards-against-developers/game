import type { StoredIdentity } from "../types.js";

export function loadIdentity(storageKey: string): StoredIdentity {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as {
        lastUsername?: string;
        rooms?: StoredIdentity["rooms"];
      };
      return {
        lastUsername: parsed.lastUsername ?? "",
        rooms: parsed.rooms ?? {}
      };
    }
  } catch {
    // Ignore malformed storage and fall through to a fresh profile.
  }

  return {
    lastUsername: "",
    rooms: {}
  };
}

export function saveIdentity(
  storageKey: string,
  identity: StoredIdentity
): void {
  localStorage.setItem(storageKey, JSON.stringify(identity));
}
