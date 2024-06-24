import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

import { approvedTokens, proxyRaffleAddress } from '@/constants';
import { bytes } from '@/types';

const Allowance = ({
  tokenId,
  address,
}: {
  tokenId: number;
  address: bytes;
}) => {
  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    address: approvedTokens[tokenId],
    functionName: 'allowance',
    args: [address, proxyRaffleAddress],
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
