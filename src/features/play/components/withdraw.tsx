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
import useWinner from '@/hooks/useWinner';
import { FullDepositEvent } from '@/types';

const WithdrawCard = () => {
  const { address: account } = useAccount();
  const { getWinnerData } = useWinner();
  const [winnerData, setWinnerData] = useState<{
    winner: FullDepositEvent;
    proof: FullDepositEvent;
    randomNumber: bigint;
  }>(null);

  const { data: pool } = useReadContract({
    abi: proxyAbi,
    address: proxyAddress,
    functionName: 'pool',
  });

  const { data: hash, error, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleRefetch = async () => {
    const _winnerData = await getWinnerData();
    setWinnerData(_winnerData);
  };

  const handleWithdraw = () => {
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
          <p>Lucky number: {winnerData.randomNumber.toString()}</p>
          <>
            {account == winnerData.winner?.deposit.sender ? (
              <p>You are the winner</p>
            ) : (
              <p>You are not the winner</p>
            )}
          </>
        </>
      )}
      <Button className="w-full" onClick={handleRefetch}>
        Refetch Data
      </Button>
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
