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
    functionName: 'status',
  });

  const { data: pool } = useReadContract({
    abi: proxyAbi,
    address: proxyAddress,
    functionName: 'pool',
  });

  const { data: raffleId } = useReadContract({
    address: proxyAddress,
    abi: proxyAbi,
    functionName: 'raffleId',
  });

  const { data: randomNumber } = useReadContract({
    address: proxyAddress,
    abi: proxyAbi,
    functionName: 'randomWords',
    args: [0n],
  });

  // const asd = {
  //   address: proxyAddress,
  //   abi: proxyAbi,
  // } as const;

  // const zxc = {
  //   ...asd,
  //   functionName: 'randomWords',
  //   args: [0n],
  // } as const;

  // useReadContracts({
  //   contracts: [zxc],
  // });

  const getWinnerData = async (): Promise<{
    winner: FullDepositEvent;
    proof: FullDepositEvent;
    randomNumber: bigint;
  } | null> => {
    if (!status || !pool || !raffleId || !randomNumber) {
      return null;
    }

    if (status !== 2) {
      console.error('Raffle is not finished');
      return null;
    }

    const luckyNumber = randomNumber % pool;

    const userDeposits = await fetchDeposits({ raffleId });

    let winnerDepositData = null;
    for (let i = 0; i < userDeposits.length; i++) {
      if (userDeposits[i].deposit.point < luckyNumber) {
        winnerDepositData = userDeposits[i];
        break;
      }
    }

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
      randomNumber,
    };
  };

  const calculateChance = async (pool: number): Promise<number> => {
    if (!status) {
      throw new Error('Status is not loaded');
    }

    if (status !== 2) {
      return 0;
    }

    const events = await fetchDeposits({ sender: account, raffleId });

    let sum = 0;

    for (const event of events) {
      sum += Number(event.deposit.amount);
    }

    return (sum / Number(pool)) * 100;
  };

  return { getWinnerData, calculateChance };
};

export default useWinner;
