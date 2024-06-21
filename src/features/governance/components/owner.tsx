import { useEffect, useState } from 'react';

import ProposalList from './proposal-list';

import { Button, CardLoader } from '@/components';
import useGetProposalEvents from '@/hooks/useGetProposalEvents';
import { FullProposalEvent } from '@/types';

const OwnerCard = () => {
  const { fetchProposal } = useGetProposalEvents();
  const [data, setData] = useState<FullProposalEvent[] | null>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchProposal = async () => {
    setIsLoading(true);
    const proposals = await fetchProposal({});
    setData(proposals);
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchProposal();
  }, []);

  if (isLoading || !data) {
    return <CardLoader />;
  }

  return (
    <div>
      <p>Proposals:</p>
      <Button onClick={handleFetchProposal}>Refetch</Button>
      <ProposalList data={data} mode="vote" />
    </div>
  );
};

export default OwnerCard;
