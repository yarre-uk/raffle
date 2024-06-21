import { ArrowDown, ArrowUp } from 'lucide-react';
import { decodeFunctionData } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import ProposalVotingForm from './proposal-voting-form';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  TransactionInfo,
} from '@/components';
import {
  proxyGovernanceAbi,
  proxyGovernanceAddress,
  proxyRaffleAbi,
} from '@/constants';
import { FullProposalEvent } from '@/types';
import { bytes } from '@/types/shared';

type Mode = 'vote' | 'process' | 'view';

const decodeCalldata = (data: `0x${string}`) => {
  const decoded = decodeFunctionData({ abi: proxyRaffleAbi, data });

  return `${decoded.functionName}(${decoded.args.join(', ')})`;
};

const proposalState: Record<number, string> = {
  0: 'Created',
  1: 'Executed',
  2: 'Canceled',
};

const ProposalList = ({
  data,
  mode,
}: {
  data: FullProposalEvent[];
  mode: Mode;
}) => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleProcess = async (id: bytes) => {
    writeContract({
      abi: proxyGovernanceAbi,
      address: proxyGovernanceAddress,
      functionName: 'processProposal',
      args: [id],
    });
  };

  return (
    <Card className="flex flex-col gap-4 p-6">
      {data.map((proposal) => (
        <Card
          className="flex w-full flex-col gap-2 p-2"
          key={proposal.event.id}
        >
          <p>Id: {proposal.event.id}</p>
          <p>Proposer: {proposal.event.sender}</p>
          <p>Description {proposal.proposal.description}</p>
          <span>
            Votes: {<ArrowUp className="inline text-green-700" />}{' '}
            {proposal.proposal.forVotes.toString()} -{' '}
            {proposal.proposal.againstVotes.toString()}{' '}
            {<ArrowDown className="inline text-red-600" />}
          </span>
          <p>State: {proposalState[proposal.proposal.state]}</p>
          <ol>
            {proposal.proposal.calldatas.map((calldata, index) => (
              <li className="ml-2" key={index}>
                {index + 1} {decodeCalldata(calldata)}
              </li>
            ))}
          </ol>
          {mode === 'vote' && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Want to vote?</AccordionTrigger>
                <AccordionContent>
                  <ProposalVotingForm id={proposal.event.id} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {mode === 'process' && (
            <>
              <Button
                className="w-full"
                onClick={() => handleProcess(proposal.event.id)}
              >
                Process
              </Button>
              <TransactionInfo
                hash={hash}
                isConfirmed={isConfirmed}
                isConfirming={isConfirming}
                error={error}
              />
            </>
          )}
        </Card>
      ))}
    </Card>
  );
};

export default ProposalList;
