import { useAccount, useReadContracts } from 'wagmi';

import useGetDepositEvents from './useGetDepositEvents';

import { proxyContract } from '@/constants';
import { FullDepositEvent } from '@/types';

const useWinner = () => {
  const { address: account } = useAccount();
  const fetchDeposits = useGetDepositEvents();

  const { data, isSuccess, isError } = useReadContracts({
    contracts: [
      {
        ...proxyContract,
        functionName: 'randomWords',
        args: [0n],
      },
      {
        ...proxyContract,
        functionName: 'pool',
      },
      {
        ...proxyContract,
        functionName: 'status',
      },
      {
        ...proxyContract,
        functionName: 'raffleId',
      },
    ],
  });

  const getWinnerData = async (): Promise<{
    winner: FullDepositEvent;
    proof: FullDepositEvent;
    luckyNumber: number;
  } | null> => {
    if (!isSuccess || isError) {
      return null;
    }

    const [randomWords, pool, status, raffleId] = data.map((item) =>
      Number(item.result),
    );

    if (status !== 2) {
      console.error('Raffle is not finished');
      return null;
    }

    const luckyNumber = randomWords % pool;

    const userDeposits = await fetchDeposits({ raffleId: BigInt(raffleId) });

    let i = 0;
    for (; i < userDeposits.length; i++) {
      if (
        userDeposits[i].deposit.point < luckyNumber &&
        userDeposits[i].deposit.point + userDeposits[i].deposit.amount >=
          luckyNumber
      ) {
        break;
      }
    }
    const winnerDepositData = userDeposits[i];

    if (!winnerDepositData) {
      console.error('Winner not found');
      return null;
    }

    const nextDepositData = (
      await fetchDeposits({
        prevDeposit: winnerDepositData.event.id,
      })
    )[0];

    return {
      winner: winnerDepositData,
      proof: nextDepositData,
      luckyNumber,
    };
  };

  const calculateChance = async (): Promise<number | null> => {
    if (!isSuccess || isError) {
      return null;
    }

    const [_, pool, status, raffleId] = data.map((item) => Number(item.result));

    if (status !== 2) {
      return 0;
    }

    const events = await fetchDeposits({
      sender: account,
      raffleId: BigInt(raffleId),
    });

    let sum = 0;

    for (const event of events) {
      sum += Number(event.deposit.amount);
    }

    return (sum / Number(pool)) * 100;
  };

  return { getWinnerData, calculateChance };
};

export default useWinner;
