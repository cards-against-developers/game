import type { SyncView } from "../types.js";

export type Message =
  | {
      type: "hello";
      roomId: string;
      deckVersion: string;
      username: string;
      playerId: string;
      reconnectToken: string;
      sessionId: string;
      takeover?: boolean;
    }
  | {
      type: "raise_cards";
      cardIds: string[];
    }
  | {
      type: "submit_cards";
      cardIds: string[];
    }
  | {
      type: "vote_submission";
      submissionId: string;
    }
  | {
      type: "pick_submission";
      submissionId: string;
    }
  | {
      type: "reveal_submission";
      submissionId: string;
    }
  | {
      type: "sync";
      payload: SyncView;
    }
  | {
      type: "welcome";
      roomId: string;
      playerId: string;
      reconnectToken: string;
      recoveryCode: string;
    }
  | {
      type: "error";
      message: string;
      canReconnect?: boolean;
    };

export type InviteBlob = {
  roomId: string;
  roomName: string;
  deckVersion: string;
  offer: RTCSessionDescriptionInit;
};

export type LoopbackInviteBlob = {
  transport: "loopback";
  roomId: string;
  roomName: string;
  deckVersion: string;
  inviteId: string;
};

export type LoopbackAnswerBlob = {
  transport: "loopback";
  inviteId: string;
};

export type MemoryInviteBlob = {
  transport: "memory";
  roomId: string;
  roomName: string;
  deckVersion: string;
  inviteId: string;
};

export type MemoryAnswerBlob = {
  transport: "memory";
  inviteId: string;
};
