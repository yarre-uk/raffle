import { useEffect } from 'react';
import { useBlock, useBlockNumber, useReadContracts } from 'wagmi';

import { Card, CardLoader } from '@/components';
import { proxyContract } from '@/constants';

const statuses: { [key: number]: string } = {
  0: 'Finished',
  1: 'Started',
  2: 'Ended',
};

const GameInfo = () => {
  const blockInfo = useBlock();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data, refetch, isLoading, isError, isSuccess } = useReadContracts({
    contracts: [
      {
        ...proxyContract,
        functionName: 'status',
      },
      {
        ...proxyContract,
        functionName: 'pool',
      },
      {
        ...proxyContract,
        functionName: 'startedAt',
      },
      {
        ...proxyContract,
        functionName: 'timeToClose',
      },
    ],
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (
    isLoading ||
    isError ||
    !isSuccess ||
    !data ||
    data.some((data) => data.result === undefined)
  ) {
    return <CardLoader />;
  }

  const [status, pool, startedAt, timeToClose] = data.map((data) =>
    Number(data.result),
  );

  const timeStamp = Number(blockInfo?.data?.timestamp);
  const endsBy = startedAt + timeToClose;

  return (
    <Card className="grid w-full grid-cols-2 items-center justify-center p-8">
      <div className="flex flex-col items-center justify-center">
        <p>Contact status: {statuses[status]}</p>
        <p>Pool: {`${pool}`}</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p>
          Able to deposit:{' '}
          {(endsBy > timeStamp && status !== 2) || status !== 2 ? 'Yes' : 'No'}
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
