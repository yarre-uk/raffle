import { useAccount, useReadContract } from 'wagmi';

import useGetDepositEvents from './useGetDepositEvents';

import { proxyAddress, proxyAbi } from '@/constants';
import { FullDepositEvent } from '@/types';

const useWinner = () => {
  const { address: account } = useAccount();
  const fetchDeposits = useGetDepositEvents();

  const { data: status } = useReadContract({
    address: proxyAddress,
    abi: proxyAbi,
    account,
    functionName: 'status',
  });

  const { data: raffleId } = useReadContract({
    address: proxyAddress,
    abi: proxyAbi,
    account,
    functionName: 'raffleId',
  });

  const { data: randomNumber } = useReadContract({
    address: proxyAddress,
    abi: proxyAbi,
    account,
    functionName: 'randomWords',
    args: [0n],
  });

  const getWinnerData = async (): Promise<{
    winner: FullDepositEvent;
    proof: FullDepositEvent;
    randomNumber: bigint;
  }> => {
    if (!status) {
      return;
    }

    if (status !== 2) {
      console.error('Raffle is not finished');
      return;
    }

    const userDeposits = await fetchDeposits({ raffleId });

    const winnerDepositData = userDeposits.reduce((acc, data) => {
      return data.deposit.point < randomNumber ? data : acc;
    }, null);

    const nextDepositData = (
      await fetchDeposits({
        prevDeposit: winnerDepositData.event.id,
      })
    )[0];

    return {
      winner: winnerDepositData,
      proof: nextDepositData,
      randomNumber,
    };
  };

  const calculateChance = async (pool: number) => {
    if (!status) {
      return;
    }

    if (status !== 2) {
      console.error('Raffle is not finished');
      return;
    }

    const events = await fetchDeposits({ sender: account });

    let sum = 0;

    for (const event of events) {
      sum += Number(event.deposit.amount);
    }

    return (sum / Number(pool)) * 100;
  };

  return { getWinnerData, calculateChance };
};

export default useWinner;
