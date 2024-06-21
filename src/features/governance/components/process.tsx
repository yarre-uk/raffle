import { useEffect, useState } from 'react';
import { useBlock, useReadContract } from 'wagmi';

import ProposalList from './proposal-list';

import { Button, CardLoader } from '@/components';
import { proxyGovernanceAbi, proxyGovernanceAddress } from '@/constants';
import useGetProposalEvents from '@/hooks/useGetProposalEvents';
import { FullProposalEvent } from '@/types';

const ProcessCard = () => {
  const { fetchProposal } = useGetProposalEvents();
  const [data, setData] = useState<FullProposalEvent[] | null>();
  const [isLoading, setIsLoading] = useState(false);
  const { data: blockData } = useBlock();

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
        proposal.proposal.votingStartedAt !== 0n &&
        proposal.proposal.votingStartedAt + (blocksBeforeExecution ?? 0n) <
          (blockData?.number ?? 0n),
    );
    setData(filteredProposals);
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchProposal();
  }, [blockData, blocksBeforeExecution]);

  if (isLoading || !data) {
    return <CardLoader />;
  }

  return (
    <div>
      <p>Proposals ready for execution:</p>
      <Button onClick={handleFetchProposal}>Refetch</Button>
      <ProposalList data={data} mode="process" />
    </div>
  );
};

export default ProcessCard;
