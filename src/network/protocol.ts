import type { Message } from "./types.js";
import { decodeJson } from "../utils/codec.js";

export function parseMessage(raw: string): Message {
  return decodeJson<Message>(raw);
}
