import { useEffect, useState } from 'react';
import { useBlock, useReadContract } from 'wagmi';

import ProposalList from './proposal-list';

import { Button, CardLoader } from '@/components';
import { proxyGovernanceAbi, proxyGovernanceAddress } from '@/constants';
import useGetProposalEvents from '@/hooks/useGetProposalEvents';
import { FullProposalEvent } from '@/types';

const ProcessedCard = () => {
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
      (proposal) => proposal.proposal.state !== 0,
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
    <div className="flex flex-col gap-4">
      <p>Processed proposals:</p>
      <Button onClick={handleFetchProposal}>Refetch</Button>
      {data?.length > 0 ? <ProposalList data={data} mode="view" /> : null}
    </div>
  );
};

export default ProcessedCard;
