import { useBlock, useReadContract } from 'wagmi';

import { Card } from '@/components';
import { proxyAbi, proxyAddress } from '@/constants';

const statuses = {
  0: 'Finished',
  1: 'Started',
  2: 'Ended',
};

const GameInfo = () => {
  const blockInfo = useBlock();

  const { data: status } = useReadContract({
    abi: proxyAbi,
    address: proxyAddress,
    functionName: 'status',
  });

  const { data: pool } = useReadContract({
    abi: proxyAbi,
    address: proxyAddress,
    functionName: 'pool',
  });

  const { data: startedAt } = useReadContract({
    abi: proxyAbi,
    address: proxyAddress,
    functionName: 'startedAt',
  });

  const { data: timeToClose } = useReadContract({
    abi: proxyAbi,
    address: proxyAddress,
    functionName: 'timeToClose',
  });

  const timeStamp = Number(blockInfo?.data?.timestamp);

  const secondsLeft = Number(startedAt + timeToClose) - timeStamp;

  return (
    <Card className="flex w-[80%] flex-col items-center justify-center gap-12 p-8">
      <p>Status: {statuses[status]}</p>
      <p>Pool {`${pool}`}</p>
      {secondsLeft > 0 ? (
        <p>Seconds left: {secondsLeft}</p>
      ) : (
        <p>Time is up!</p>
      )}
    </Card>
  );
};

export default GameInfo;
