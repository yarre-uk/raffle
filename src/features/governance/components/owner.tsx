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
    <div className="flex flex-col gap-4">
      <p>Proposals:</p>
      <Button onClick={handleFetchProposal}>Refetch</Button>
      {data?.length > 0 ? <ProposalList data={data} mode="view" /> : null}
    </div>
  );
};

export default OwnerCard;
