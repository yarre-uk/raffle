import { Button } from '@/components';
import useGetProposalEvents from '@/hooks/useGetProposalEvents';

const ProcessCard = () => {
  const { fetchProposal } = useGetProposalEvents();

  const handleFetchProposal = async () => {
    const proposals = await fetchProposal({});
    console.log(proposals);
  };

  return (
    <div>
      <Button onClick={handleFetchProposal}>Fetch Proposal</Button>
    </div>
  );
};

export default ProcessCard;
