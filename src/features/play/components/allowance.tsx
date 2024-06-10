import { erc20Abi } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { approvedTokens, proxyAddress } from '@/constants';

const Allowance = ({ tokenId }: { tokenId: number }) => {
  const { address } = useAccount();

  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    address: approvedTokens[tokenId],
    functionName: 'allowance',
    args: [address, proxyAddress],
  });

  const { data: balance } = useReadContract({
    abi: erc20Abi,
    address: approvedTokens[tokenId],
    functionName: 'balanceOf',
    args: [address],
  });

  return (
    <>
      <p>Allowance: {allowance?.toString()}</p>
      <p>Balance: {balance?.toString()}</p>
    </>
  );
};

export default Allowance;
