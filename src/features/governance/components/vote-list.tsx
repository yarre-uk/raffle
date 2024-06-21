import { ArrowDown, ArrowUp } from 'lucide-react';

import { Card } from '@/components';
import { FullProposalEvent } from '@/types';

const VoteProposalList = ({ data }: { data: FullProposalEvent[] }) => {
  return (
    <Card className="flex flex-col p-6">
      {data.map((proposal) => (
        <Card className="w-full p-2" key={proposal.event.id}>
          <p>Id: {proposal.event.id}</p>
          <p>Proposer: {proposal.event.sender}</p>
          <p>Description {proposal.proposal.description}</p>
          <span>
            Votes: {<ArrowUp className="inline" />}{' '}
            {proposal.proposal.forVotes.toString()} -{' '}
            {proposal.proposal.againstVotes.toString()}{' '}
            {<ArrowDown className="inline" />}
          </span>
        </Card>
      ))}
    </Card>
  );
};

export default VoteProposalList;
