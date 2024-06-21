export type ProposalEvent = {
  id: `0x${string}`;
  sender: `0x${string}`;
};

export type ProposalData = {
  sender: `0x${string}`;
  calldatas: string[];
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
