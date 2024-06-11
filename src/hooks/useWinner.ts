import { useAccount, useReadContract } from 'wagmi';

import useGetEvents from './useGetEvents';

import { proxyAddress, proxyAbi } from '@/constants';

const useWinner = () => {
  const { address: account } = useAccount();
  const fetchEvents = useGetEvents();

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

  const { data: randomWords } = useReadContract({
    address: proxyAddress,
    abi: proxyAbi,
    account,
    functionName: 'randomWords',
    args: [0n],
  });

  const getWinnerData = async () => {
    if (status !== 2) {
      return;
    }

    const userDeposits = await fetchEvents({ raffleId, sender: account });

    const winnerDepositData = userDeposits.reduce((acc, data) => {
      return data.deposit.point < randomWords ? data : acc;
    }, null);

    const nextDepositData = await fetchEvents({
      prevDeposit: winnerDepositData.event.id,
    });

    return [winnerDepositData, nextDepositData];
  };

  return getWinnerData;
};

export default useWinner;
