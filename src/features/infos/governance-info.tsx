import { useBlock, useReadContract } from 'wagmi';

import { Card, CardLoader } from '@/components';
import { proxyRaffleAbi, proxyRaffleAddress } from '@/constants';

const GovernanceInfo = () => {
  const blockInfo = useBlock();

  const { data: x } = useReadContract({
    abi: proxyRaffleAbi,
    address: proxyRaffleAddress,
    functionName: 'X',
  });

  const { data: y } = useReadContract({
    abi: proxyRaffleAbi,
    address: proxyRaffleAddress,
    functionName: 'Y',
  });

  const { data: z } = useReadContract({
    abi: proxyRaffleAbi,
    address: proxyRaffleAddress,
    functionName: 'Z',
  });

  if (x == undefined || y == undefined || z == undefined || !blockInfo) {
    return <CardLoader />;
  }

  return (
    <Card className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex w-full flex-row items-center justify-center gap-4">
        <p>X - {x.toString()}</p>
        <p>Y - {y.toString()}</p>
        <p>Z - {z.toString()}</p>
      </div>
      <p>Block number: {blockInfo.data?.number.toString()}</p>
    </Card>
  );
};

export default GovernanceInfo;
