import { useReadContract } from 'wagmi';

import { Card } from '@/components';
import { proxyAbi, proxyAddress } from '@/constants';

const GameInfo = () => {
  const { data: status, error } = useReadContract({
    abi: proxyAbi,
    address: proxyAddress,
    functionName: 'pool',
    args: [],
  });

  const { data: pool } = useReadContract({
    abi: proxyAbi,
    address: proxyAddress,
    functionName: 'pool',
    args: [],
  });

  return (
    <Card className="flex w-[80%] flex-col items-center justify-center gap-12 p-8">
      <p>Status: {status?.toString()}</p>
      <p>Error: {error?.message}</p>
      <p>Pool {`${pool}`}</p>
    </Card>
  );
};

export default GameInfo;
