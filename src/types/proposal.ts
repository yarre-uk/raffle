import { bytes } from '@/types';

export type ProposalEvent = {
  id: bytes;
  sender: bytes;
};

export type ProposalData = {
  sender: bytes;
  calldatas: bytes[];
  proposedAt: bigint;
  description: string;
  votingStartedAt: bigint;
  forVotes: bigint;
  againstVotes: bigint;
  state: number;
};

export type FullProposalEvent = {
  event: ProposalEvent;
  proposal: ProposalData;
};
