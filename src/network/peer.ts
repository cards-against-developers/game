import PeerJs from "peerjs";

type PeerConstructor = typeof PeerJs;

const PeerModule = PeerJs as unknown as {
  Peer?: PeerConstructor;
} & PeerConstructor;

export const Peer = PeerModule.Peer ?? PeerModule;
