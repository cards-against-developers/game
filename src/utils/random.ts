import type { HostGameState } from "../types.js";

export function shuffleWithGame<T>(
  items: T[],
  game: Pick<HostGameState, "randomState">
): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom(game) * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function nextRandom(game: Pick<HostGameState, "randomState">): number {
  let stateValue = game.randomState | 0;
  stateValue = (stateValue + 0x6d2b79f5) | 0;
  let mixed = Math.imul(stateValue ^ (stateValue >>> 15), 1 | stateValue);
  mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed);
  game.randomState = stateValue;
  return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
}

export function seedToState(seed: string): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 1;
}

export function randomId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function randomSeed(): string {
  return `seed-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}
