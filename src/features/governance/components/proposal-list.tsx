import { ArrowDown, ArrowUp } from 'lucide-react';

import ProposalVotingForm from './proposal-voting-form';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
} from '@/components';
import { FullProposalEvent } from '@/types';

type Mode = 'vote' | 'process';

const ProposalList = ({
  data, // mode,
}: {
  data: FullProposalEvent[];
  mode: Mode;
}) => {
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
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Want to vote?</AccordionTrigger>
              <AccordionContent>
                <ProposalVotingForm id={proposal.event.id} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      ))}
    </Card>
  );
};

export default ProposalList;
