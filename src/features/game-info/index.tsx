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

  if (
    !blockInfo ||
    status == undefined ||
    pool == undefined ||
    startedAt == undefined ||
    timeToClose == undefined
  ) {
    return null;
  }

  const timeStamp = Number(blockInfo?.data?.timestamp);
  const endsBy = Number(startedAt) + Number(timeToClose);

  return (
    <Card className="grid w-[80%] grid-cols-2 items-center justify-center p-8">
      <div className="flex flex-col items-center justify-center">
        <p>Status: {statuses[status]}</p>
        <p>Pool: {`${pool}`}</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p>Started at: {new Date(Number(startedAt) * 1000).toLocaleString()}</p>
        <p>Ends by: {new Date(endsBy * 1000).toLocaleString()}</p>
        <p>Current block time: {new Date(timeStamp * 1000).toLocaleString()}</p>
      </div>
    </Card>
  );
};

export default GameInfo;
