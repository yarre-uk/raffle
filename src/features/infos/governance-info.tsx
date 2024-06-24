import { useEffect } from 'react';
import { useBlockNumber, useReadContracts } from 'wagmi';

import { Card, CardLoader } from '@/components';
import { proxyContract } from '@/constants';

const GovernanceInfo = () => {
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data, refetch, isLoading, isError, isSuccess } = useReadContracts({
    contracts: [
      {
        ...proxyContract,
        functionName: 'X',
      },
      {
        ...proxyContract,
        functionName: 'Y',
      },
      {
        ...proxyContract,
        functionName: 'Z',
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

  const [x, y, z] = data.map((data) => Number(data.result));

  return (
    <Card className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex w-full flex-row items-center justify-center gap-4">
        <p>X - {x}</p>
        <p>Y - {y}</p>
        <p>Z - {z}</p>
      </div>
      <p>Block number: {blockNumber?.toString()}</p>
    </Card>
  );
};

export default GovernanceInfo;
