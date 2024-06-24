import { useEffect, useState } from 'react';
import { useBlockNumber } from 'wagmi';

import ProposalList from './proposal-list';

import { Button, CardLoader } from '@/components';
import useGetProposalEvents from '@/hooks/useGetProposalEvents';
import { FullProposalEvent } from '@/types';

const AllCard = () => {
  const { fetchProposal } = useGetProposalEvents();
  const [data, setData] = useState<FullProposalEvent[] | null>();
  const [isLoading, setIsLoading] = useState(false);
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const handleFetchProposal = async () => {
    setIsLoading(true);
    setData(await fetchProposal({}));
    setIsLoading(false);
  };

  useEffect(() => {
    if (blockNumber) {
      handleFetchProposal();
    }
  }, [blockNumber]);

  if (isLoading || !data) {
    return <CardLoader />;
  }

  return (
    <div className="flex flex-col gap-4">
      <p>All proposals:</p>
      <Button onClick={handleFetchProposal}>Refetch</Button>
      {data?.length > 0 ? <ProposalList data={data} mode="view" /> : null}
    </div>
  );
};

export default AllCard;
