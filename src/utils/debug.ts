export function debugLog(
  scope: string,
  event: string,
  details?: Record<string, unknown>
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (details && Object.keys(details).length > 0) {
    console.info(`[cad:${scope}] ${event}`, details);
    return;
  }

  console.info(`[cad:${scope}] ${event}`);
}

export function summarizeMessage(message: unknown): Record<string, unknown> {
  if (!message || typeof message !== "object" || !("type" in message)) {
    return {};
  }

  const typedMessage = message as {
    type?: string;
    payload?: {
      phase?: string;
      round?: number;
      players?: unknown[];
      submissions?: unknown[];
    };
    roomId?: string;
    playerId?: string;
    submissionId?: string;
    cardIds?: unknown[];
    message?: string;
  };

  switch (typedMessage.type) {
    case "sync":
      return {
        type: typedMessage.type,
        phase: typedMessage.payload?.phase,
        round: typedMessage.payload?.round,
        players: typedMessage.payload?.players?.length,
        submissions: typedMessage.payload?.submissions?.length
      };
    case "hello":
      return {
        type: typedMessage.type,
        roomId: typedMessage.roomId,
        playerId: typedMessage.playerId
      };
    case "raise_cards":
    case "submit_cards":
      return {
        type: typedMessage.type,
        cardCount: typedMessage.cardIds?.length ?? 0
      };
    case "vote_submission":
    case "pick_submission":
    case "reveal_submission":
      return {
        type: typedMessage.type,
        submissionId: typedMessage.submissionId
      };
    case "welcome":
      return {
        type: typedMessage.type,
        roomId: typedMessage.roomId,
        playerId: typedMessage.playerId
      };
    case "error":
      return {
        type: typedMessage.type,
        message: typedMessage.message
      };
    default:
      return {
        type: typedMessage.type
      };
  }
}
