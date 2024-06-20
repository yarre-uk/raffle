import { useEffect, useState } from 'react';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { currentChain } from 'wagmiConfig';

import { Button, CardLoader, TransactionInfo } from '@/components';
import { proxyRaffleAbi, proxyRaffleAddress } from '@/constants';
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
    luckyNumber: number;
  } | null>(null);
  const [chance, setChance] = useState<number>(0);

  const { data: pool } = useReadContract({
    abi: proxyRaffleAbi,
    address: proxyRaffleAddress,
    functionName: 'pool',
  });

  const { data: owner } = useReadContract({
    address: proxyRaffleAddress,
    abi: proxyRaffleAbi,
    account,
    functionName: 'owner',
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const chanceUpdate = async () => {
    const _chance = await calculateChance();
    setChance(_chance ?? 0);
  };

  const handleRefetch = async () => {
    setIsLoading(true);
    chanceUpdate();
    const _winnerData = await getWinnerData();
    setWinnerData(_winnerData);
    setIsLoading(false);
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
        address: proxyRaffleAddress,
        abi: proxyRaffleAbi,
        functionName: 'withdraw',
        args: [winnerData.winner.event.id, winnerData.winner.event.id],
      });
      return;
    }

    writeContract({
      account,
      chain: currentChain,
      address: proxyRaffleAddress,
      abi: proxyRaffleAbi,
      functionName: 'withdraw',
      args: [winnerData.winner.event.id, winnerData.proof.event.id],
    });
  };

  useEffect(() => {
    handleRefetch();
  }, []);

  if (isLoading || pool == undefined) {
    return <CardLoader />;
  }

  return (
    <div className="flex w-full flex-col gap-4">
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
          <p>Lucky number: {winnerData.luckyNumber.toString()}</p>
          <>
            {account == winnerData.winner?.deposit.sender ? (
              <p>You are the winner</p>
            ) : (
              <p>You are not the winner</p>
            )}
          </>
        </>
      )}
      {chance != undefined && <p>Chance: {chance.toFixed(3)}%</p>}
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

      <TransactionInfo
        error={error}
        hash={hash}
        isConfirmed={isConfirmed}
        isConfirming={isConfirming}
      />
    </div>
  );
};

export default WithdrawCard;
