import { useEffect, useState } from 'react';
import { useBlockNumber, useReadContract } from 'wagmi';

import ProposalList from './proposal-list';

import { Button, CardLoader } from '@/components';
import { proxyGovernanceAbi, proxyGovernanceAddress } from '@/constants';
import useGetProposalEvents from '@/hooks/useGetProposalEvents';
import { FullProposalEvent } from '@/types';

const VoteCard = () => {
  const { fetchProposal } = useGetProposalEvents();
  const [data, setData] = useState<FullProposalEvent[] | null>();
  const [isLoading, setIsLoading] = useState(false);
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: blocksBeforeVoting } = useReadContract({
    abi: proxyGovernanceAbi,
    address: proxyGovernanceAddress,
    functionName: 'blocksBeforeVoting',
  });

  const { data: blocksBeforeExecution } = useReadContract({
    abi: proxyGovernanceAbi,
    address: proxyGovernanceAddress,
    functionName: 'blocksBeforeExecution',
  });

  const handleFetchProposal = async () => {
    setIsLoading(true);
    const proposals = await fetchProposal({});
    const filteredProposals = proposals.filter(
      (proposal) =>
        proposal.proposal.state == 0 &&
        proposal.proposal.proposedAt + (blocksBeforeVoting ?? 0n) <
          (blockNumber ?? 0n) &&
        (proposal.proposal.votingStartedAt + (blocksBeforeExecution ?? 0n) >
          (blockNumber ?? 0n) ||
          proposal.proposal.votingStartedAt === 0n),
    );
    setData(filteredProposals);
    setIsLoading(false);
  };

  useEffect(() => {
    if (blockNumber) {
      handleFetchProposal();
    }
  }, [blockNumber, blocksBeforeVoting, blocksBeforeExecution]);

  if (isLoading || !data) {
    return <CardLoader />;
  }

  return (
    <div className="flex flex-col gap-4">
      <p>Proposals ready for voting:</p>
      <Button onClick={handleFetchProposal}>Refetch</Button>
      {data?.length > 0 ? <ProposalList data={data} mode="vote" /> : null}
    </div>
  );
};

export default VoteCard;
