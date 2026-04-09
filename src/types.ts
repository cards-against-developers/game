export type Phase = "lobby" | "submitting" | "judging" | "result";

export type RecoveryBundle = {
  roomId: string;
  playerId: string;
  reconnectToken: string;
};

export type StoredIdentity = {
  lastUsername: string;
  rooms: Record<string, RecoveryBundle>;
};

export type HostPlayer = {
  id: string;
  username: string;
  score: number;
  reconnectToken: string;
  sessionId: string;
  hand: string[];
  raisedCardIds: string[];
  connected: boolean;
  connectionId: string | null;
  disconnectDeadlineAt: number | null;
  activeFromRound: number;
};

export type Submission = {
  id: string;
  playerId: string;
  cardIds: string[];
};

export type BlackDeckEntry = {
  id: string;
  pick: number;
};

export type SyncPlayer = {
  id: string;
  username: string;
  score: number;
  connected: boolean;
  disconnectDeadlineAt?: number | null;
  disconnectSecondsLeft: number | null;
  handCount: number;
  isJudge?: boolean;
  isWaiting: boolean;
  hasSubmitted: boolean;
};

export type SyncWhiteCard = {
  id: string;
  text: string;
};

export type SubmissionAnimationCard = SyncWhiteCard & {
  handIndex: number;
};

export type SyncBlackCard = {
  id: string;
  text: string;
  pick: number;
};

export type SyncSubmission = {
  id: string;
  playerId?: string;
  cardIds: string[];
  cards?: SyncWhiteCard[];
  playerName?: string;
  hidden?: boolean;
  voteCount?: number;
  votedBySelf?: boolean;
  ownSubmission?: boolean;
  canVote?: boolean;
  winner: boolean;
  highlighted?: boolean;
};

export type SyncView = {
  roomId: string;
  roomName: string;
  started: boolean;
  phase: Phase;
  round: number;
  hostNow?: number;
  submissionDeadlineAt?: number | null;
  submissionSecondsLeft: number | null;
  announcement: string;
  blackCardId: string | null;
  blackCard?: SyncBlackCard | null;
  blackPick: number;
  judgeId: string | null;
  lastWinnerId: string | null;
  winnerSelectionClosed?: boolean;
  votingClosed?: boolean;
  winnerPlayerIds?: string[];
  highlightedSubmissionId?: string | null;
  resolutionPending?: boolean;
  players: SyncPlayer[];
  submissions: SyncSubmission[];
  hand: string[];
  handCards?: SyncWhiteCard[];
  selfRaisedCardIds?: string[];
  selfPlayerId: string;
  canSubmit: boolean;
  canJudge?: boolean;
  canPickWinner?: boolean;
  canVote?: boolean;
};

export type HostGameState = {
  seed: string;
  randomState: number;
  countdownMs: number;
  started: boolean;
  phase: Phase;
  round: number;
  submissionDeadlineAt: number | null;
  winnerSelectionClosed: boolean;
  votingClosed?: boolean;
  announcement: string;
  blackCardId: string | null;
  blackPick: number;
  judgeId: string | null;
  participantIds: string[];
  lastWinnerId: string | null;
  judgeCursor: number;
  revealedSubmissionIds: string[];
  revealOrderIds?: string[];
  highlightedSubmissionId?: string | null;
  allVotesInAt?: number | null;
  votesByPlayerId?: Record<string, string>;
  winnerPlayerIds?: string[];
  submissions: Submission[];
  players: HostPlayer[];
  blackDrawPile: BlackDeckEntry[];
  blackDiscard: BlackDeckEntry[];
  whiteDrawPile: string[];
  whiteDiscard: string[];
};

export type {
  InviteBlob,
  LoopbackAnswerBlob,
  LoopbackInviteBlob,
  Message
} from "./network/types.js";
