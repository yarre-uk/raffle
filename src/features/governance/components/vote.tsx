import { useEffect, useState } from 'react';

import VoteProposalList from './vote-list';

import { Button, CardLoader } from '@/components';
import useGetProposalEvents from '@/hooks/useGetProposalEvents';
import { FullProposalEvent } from '@/types';

const VoteCard = () => {
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
      <VoteProposalList data={data} />
    </div>
  );
};

export default VoteCard;
