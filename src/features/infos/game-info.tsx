import { useBlock, useReadContract } from 'wagmi';

import { Card, CardLoader } from '@/components';
import { proxyRaffleAbi, proxyRaffleAddress } from '@/constants';

const statuses: { [key: number]: string } = {
  0: 'Finished',
  1: 'Started',
  2: 'Ended',
};

const GameInfo = () => {
  const blockInfo = useBlock();

  const { data: status } = useReadContract({
    abi: proxyRaffleAbi,
    address: proxyRaffleAddress,
    functionName: 'status',
  });

  const { data: pool } = useReadContract({
    abi: proxyRaffleAbi,
    address: proxyRaffleAddress,
    functionName: 'pool',
  });

  const { data: startedAt } = useReadContract({
    abi: proxyRaffleAbi,
    address: proxyRaffleAddress,
    functionName: 'startedAt',
  });

  const { data: timeToClose } = useReadContract({
    abi: proxyRaffleAbi,
    address: proxyRaffleAddress,
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

  if (
    status == undefined ||
    pool == undefined ||
    startedAt == undefined ||
    timeToClose == undefined ||
    !blockInfo
  ) {
    return <CardLoader />;
  }

  return (
    <Card className="grid grid-cols-2 items-center justify-center p-8">
      <div className="flex flex-col items-center justify-center">
        <p>Contact status: {statuses[status]}</p>
        <p>Pool: {`${pool}`}</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p>
          Able to deposit:{' '}
          {startedAt + BigInt(endsBy) < timeStamp || status !== 2
            ? 'Yes'
            : 'No'}
        </p>
        <p>
          Ends by:{' '}
          {status === 1 ? new Date(endsBy * 1000).toLocaleString() : '---'}
        </p>
        <p>Current block time: {new Date(timeStamp * 1000).toLocaleString()}</p>
      </div>
    </Card>
  );
};

export default GameInfo;
