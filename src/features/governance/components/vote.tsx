import { useEffect, useState } from 'react';
import { useBlock, useReadContract } from 'wagmi';

import ProposalList from './proposal-list';

import { Button, CardLoader } from '@/components';
import { proxyGovernanceAbi, proxyGovernanceAddress } from '@/constants';
import useGetProposalEvents from '@/hooks/useGetProposalEvents';
import { FullProposalEvent } from '@/types';

const VoteCard = () => {
  const { fetchProposal } = useGetProposalEvents();
  const [data, setData] = useState<FullProposalEvent[] | null>();
  const [isLoading, setIsLoading] = useState(false);
  const { data: blockData } = useBlock();

  const { data: blocksBeforeVoting } = useReadContract({
    abi: proxyGovernanceAbi,
    address: proxyGovernanceAddress,
    functionName: 'blocksBeforeVoting',
  });

  const handleFetchProposal = async () => {
    setIsLoading(true);
    const proposals = await fetchProposal({});
    const filteredProposals = proposals.filter(
      (proposal) =>
        proposal.proposal.state == 0 &&
        proposal.proposal.proposedAt + (blocksBeforeVoting ?? 0n) <
          (blockData?.number ?? 0n),
    );
    setData(filteredProposals);
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchProposal();
  }, [blockData, blocksBeforeVoting]);

  if (isLoading || !data) {
    return <CardLoader />;
  }

  return (
    <div>
      <p>Proposals ready for voting:</p>
      <Button onClick={handleFetchProposal}>Refetch</Button>
      <ProposalList data={data} mode="vote" />
    </div>
  );
};

export default VoteCard;
