import { useEffect, useState } from 'react';
import {
  BaseError,
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { currentChain } from 'wagmiConfig';

import { Button } from '@/components';
import { proxyAbi, proxyAddress } from '@/constants';
import useGetDepositEvents from '@/hooks/useGetDepositEvents';
import useWinner from '@/hooks/useWinner';
import { FullDepositEvent } from '@/types';

const WithdrawCard = () => {
  const { address: account } = useAccount();
  const { data: hash, error, writeContract } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);

  const { getWinnerData, calculateChance } = useWinner();
  const fetchDeposits = useGetDepositEvents();

  const [winnerData, setWinnerData] = useState<{
    winner: FullDepositEvent;
    proof: FullDepositEvent;
    randomNumber: bigint;
  } | null>(null);
  const [chance, setChance] = useState<number>(0);

  const { data: pool } = useReadContract({
    abi: proxyAbi,
    address: proxyAddress,
    functionName: 'pool',
  });

  const { data: owner } = useReadContract({
    address: proxyAddress,
    abi: proxyAbi,
    account,
    functionName: 'owner',
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleRefetch = () => {
    setIsLoading(true);
    getWinnerData()
      .then(setWinnerData)
      .then(() => calculateChance(Number(pool)).then(setChance))
      .then(() => setIsLoading(false));
  };

  const handleDebug = async () => {
    const logs = await fetchDeposits({ raffleId: 0n });
    console.log(logs);
  };

  const handleWithdraw = () => {
    if (!winnerData) {
      return;
    }

    if (!winnerData.proof) {
      writeContract({
        account,
        chain: currentChain,
        address: proxyAddress,
        abi: proxyAbi,
        functionName: 'withdraw',
        args: [winnerData.winner.event.id, winnerData.winner.event.id],
      });
      return;
    }

    writeContract({
      account,
      chain: currentChain,
      address: proxyAddress,
      abi: proxyAbi,
      functionName: 'withdraw',
      args: [winnerData.winner.event.id, winnerData.proof.event.id],
    });
  };

  useEffect(() => {
    handleRefetch();
  }, []);

  if (isLoading || !pool) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <p>Withdraw</p>
      {winnerData && (
        <>
          <p>Winner: {winnerData.winner?.deposit.sender}</p>
          <p>id: {winnerData.winner?.event.id}</p>
          <p>
            Range:{' '}
            {`${winnerData.winner?.deposit.point} - ${
              winnerData.proof?.deposit.point || pool
            }`}
          </p>
          <p>Lucky number: {`${winnerData.randomNumber % pool}`}</p>
          <>
            {account == winnerData.winner?.deposit.sender ? (
              <p>You are the winner</p>
            ) : (
              <p>You are not the winner</p>
            )}
          </>
        </>
      )}
      {chance && <p>Chance: {chance.toFixed(3)}%</p>}
      <Button className="w-full" onClick={handleRefetch}>
        Refetch Data
      </Button>
      {account == owner && (
        <Button className="w-full" onClick={handleDebug}>
          Debug
        </Button>
      )}
      <Button
        disabled={account != winnerData?.winner.deposit.sender}
        className="w-full"
        onClick={handleWithdraw}
      >
        Withdraw
      </Button>

      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  );
};

export default WithdrawCard;
