import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { Button, TransactionInfo } from '@/components';
import { proxyGovernanceAbi, proxyGovernanceAddress } from '@/constants';
import { bytes } from '@/types';

const ProposalVotingForm = ({ id }: { id: bytes }) => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleVote = async (vote: 'for' | 'against') => {
    writeContract({
      abi: proxyGovernanceAbi,
      address: proxyGovernanceAddress,
      functionName: 'voteForProposal',
      args: [id, vote === 'for'],
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => handleVote('for')}>Vote For</Button>
      <Button onClick={() => handleVote('against')}>Vote Against</Button>
      <TransactionInfo
        hash={hash}
        isConfirmed={isConfirmed}
        isConfirming={isConfirming}
        error={error}
      />
    </div>
  );
};

export default ProposalVotingForm;
